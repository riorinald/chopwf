import React, { Component,useEffect } from 'react';
import LegalEntity from '../../context';
import axios from 'axios';
import { Redirect,NavLink } from 'react-router-dom';
import { fakeAuth } from '../../App';
import {Card, CardBody, Row} from 'reactstrap';
import config from '../../config';
import { access } from 'fs';
import qs from 'querystring';

class Authenticated extends Component { 
  constructor(props) {
    super(props);
    this.state = {
      userDetails:'',
      redirectOuth: false,
      token: ''
    };
  }
  
  componentDidMount(){
    const code = this.props.location.code
    if(code){
      this.exchangeToken()
    }
  }

  async getGoogleUserDetails(token) {
    this.setState({ loading: true })
    await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?alt=json&access_token=${token}`)
    .then(res => {
        this.setState({ userDetails: res.data, loading: false })

        localStorage.setItem('authenticate', true)
        localStorage.setItem('authType', "REQUESTOR")
        localStorage.setItem('application', "CHOP")
        localStorage.setItem('legalEntity', 'MBAFC')
        localStorage.setItem('userId', "abby@otds.admin")
        localStorage.setItem('token', this.getParameterByName('access_token',this.props.location.hash))
    })
    setTimeout(this.redirect, 1000)
  }
  // const token = url.match(/\#(?:access_token)\=([\S\s]*?)\&/)['1'];
  // const token = JSON.parse(url).access_token
  // console.log(url, token)

  async getUserDetails(token) {
    await axios.post(`https://sso-int.daimler.com/idp/userinfo.openid`, {headers:{'Authorization': 'Bearer' + token}})
          .then(res => {
            console.log(res)
            this.setState({ userDetails: res.data})
            localStorage.setItem('userId', res.data.sub)
          })

      setTimeout(this.redirect, 1000)
  }

  getParameterByName(name, url) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&#]" + name + "=([^&#]*)"),
        results = regex.exec(url);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  redirect = () =>{
    fakeAuth.authenticate(() => {
      this.setState({redirectOuth: true})
      });
  }

  exchangeToken(){
    const requestBody = {
      grant_type: 'authorization_code',
      code: this.props.location.code,
      redirect_uri: "https://docms.es.corpintra.net/clwf/login?authhandler=Daimler_OpenID"
    }

    const config = {
      // withCredentials: false,
      headers: {
        "Authorization": "Basic ODEyZGE3ZDItYjc0YS00ODRkLTgyYTMtZDMwZmY4YWU2ZjljOjVkZDA4NGY2LWQ5ZGEtNDUyYS04NmVlLTQ1YTZkMzAxNDM5Zg==",
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
    
    axios.post(`https://sso-int.daimler.com/as/token.oauth2`, qs.stringify(requestBody), config)
      .then((result) => {
        console.log(result)
        this.setState({token:result.data})
        localStorage.setItem('at',result.data.access_token)
        localStorage.setItem('it',result.data.id_token)
        localStorage.setItem('authenticate', true)
        localStorage.setItem('isLicenseAdmin', 'N')
        localStorage.setItem('isChopKeeper', 'Y')
      })
      .then(this.getUserDetails(this.state.token.access_token))
      .catch((err) => {
        if(err.response){
          console.log(err.response)
          console.log(err.response.statusText)}
        else {
          console.log(err)
        }
      })
  }

  render(){
    if (this.state.redirectOuth || localStorage.getItem('userId') ) {
      console.log("redirect oauth")
      return <Redirect to={`/portal`} />
    }
    const authenticated = <><label>Authenticated as {this.state.userDetails.given_name || localStorage.getItem('userId')}</label><center>redirecting . . .</center></>
    const notAuth = <label>You are not Authenticated</label> 
    return(
    <div className="app flex-row align-items-center">
    <Row className="justify-content-center">
      <Card className="shadow-lg p-3 bg-white rounded">
        <CardBody>
          {this.props.location.code || localStorage.getItem('userId') ? authenticated : notAuth}
        </CardBody>
      </Card>
    </Row>
    </div >
    )}
  
  }
  
  export default Authenticated;