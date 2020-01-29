import React, { Component,useEffect } from 'react';
import axios from 'axios';
import { Redirect,NavLink } from 'react-router-dom';
import { fakeAuth } from '../../App';
import {Card, CardBody, Row, Spinner, UncontrolledAlert } from 'reactstrap';
import config from '../../config';
import { access } from 'fs';
import qs from 'querystring';
import JWT from 'jsonwebtoken';

class Authenticated extends Component { 
  constructor(props) {
    super(props);
    this.state = {
      userDetails:'',
      redirectOuth: false,
      token: '',
      loading: true,
      isExpired: false,
      info: '',
      timer: 5
    };
  }
  
  componentDidMount(){
    const code = this.props.location.code
    if (code){
      this.exchangeToken(code);
    }
  }
  
  exchangeToken(code){
    const requestBody = {
      grant_type: 'authorization_code',
      code: code,
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
            localStorage.setItem('accessToken',result.data.access_token)
            localStorage.setItem('idToken',result.data.id_token)
            this.getOpenId(result.data.access_token)
        })
        .catch((err) => {
            if(err.response){
              this.setState({
                loading: false,
                info:"OAuth server unreachable",
                isExpired:true
              })
                console.log(err.response)
                console.log(err.response.statusText)}
            else {
              this.setState({
                loading: false,
                info:"OAuth server unreachable",
                isExpired:true
              })
                console.log(err)
            }
            // this.props.history.push({pathname:'/login',search:null})
            setTimeout(this.countDownRedirect(),1000)
        })
  }

  async getOpenId(token) {
    const config = {
      headers: {
        "Authorization": "Bearer "+ token,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
    let credentials= {username: '', password: ''}

       await axios.get(`https://sso-int.daimler.com/idp/userinfo.openid`, config)
          .then(res => {

            this.setState({ loading: false, userDetails: res.data})
            localStorage.setItem('userId', res.data.sub)
            credentials.username = res.data.sub
            this.validate(credentials)
          })
          .catch(err => {
            console.log(err)
            this.setState({
              loading:false,
              info: "openId not authenticated",
            })  
          })
  }

  async validate(credentials) {
    try {
        await axios.post(`${config.url}/login`, credentials
            , { headers: { 'Content-Type': '  application/json' } })
            .then(res => {
                let info = "User " + res.data.userId + " is authorized in the system."
                localStorage.setItem('authenticate', true)
                localStorage.setItem('legalEntity', 'MBAFC')
                localStorage.setItem('ticket', res.data.ticket)
                localStorage.setItem('userId', res.data.userId)
                localStorage.setItem('roleId', res.data.roleId)
                localStorage.setItem('token', res.data.token)
                localStorage.setItem('isLicenseAdmin', res.data.isLicenseAdmin)
                localStorage.setItem('chopKeeperCompanyIds', res.data.chopKeeperCompanyIds)
                localStorage.setItem('licenseAdminCompanyIds', res.data.licenseAdminCompanyIds)
                localStorage.setItem('isChopKeeper', res.data.isChopKeeper)

                console.log(res.data)

                if (res.data.status === "success") {
                  this.setState({
                    loading: false, 
                    info: info,
                    redirectOuth:true
                  })
                  this.countDownRedirect()
                  this.redirect()
                }
            })
    } catch (error) {
        if (error.response){
        this.setState({ info: error.response.statusText+" : user " + credentials.username + " is not authorized in the system." });
        } else {
        this.setState({ info: "server unreachable"});
        }   
    }
}
  
  checkTokenExpired = (token) => {
    var decodedToken=JWT.decode(token.id_token, {complete: true}); //decode JWT token with library jsonwebtoken
    var dates = new Date();
    var dateNow = dates.getTime() / 1000 //conver to unix Time
    
    if(decodedToken.payload.exp < dateNow){
      this.setState({ isExpired: true })
      console.log('token expired')
    }
    else{
      console.log('token not expired')
      this.setState({ isExpired: true })
    }
  }
  
  // getParameterByName(name, url) {
  //   name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  //   var regex = new RegExp("[\\?&#]" + name + "=([^&#]*)"),
  //       results = regex.exec(url);
  //   return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  // }

  redirect = () =>{
    fakeAuth.authenticate(() => {});
  }

  countDownRedirect = () => {
    setInterval(() => {
      if(this.state.timer !== 0){
        this.downcrement();
        }
      }, 1000);

  }
  
  downcrement = () => {
      this.setState({
        timer: this.state.timer -1
    });
  }

  render(){
    if (this.state.timer === 0){
      if (this.state.redirectOuth) {
        return <Redirect to={`/portal`} />
      }
      if (this.state.isExpired) {
        return <Redirect to={`/login`} />
      }
    }
    const authenticated = <label className="display-5 mb-4">Authenticated as {this.state.userDetails.sub || localStorage.getItem('userId')}</label>
    const notAuth = <label className="display-5 mb-4">You are not Authenticated</label>
    const loading = <div> <Spinner type='grow' color="info" /> </div>
    return(
    <div style={{ backgroundColor: "#2F353A" }}>
    <Row className="centerd">
      <Card className="shadow-lg p-3 rounded">
        <CardBody>
          {this.state.loading ? loading : 
          <>
            {this.state.userDetails || localStorage.getItem('userId') ? authenticated : notAuth}
            <UncontrolledAlert color="secondary">{this.state.info}</UncontrolledAlert >
            <p className="mt-3"><center>redirect in {this.state.timer}</center></p>
          </>
          }   
        </CardBody>
      </Card>
    </Row>
    </div >
    )}
  
  }
  
  export default Authenticated;