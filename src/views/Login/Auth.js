import React, { Component,useEffect } from 'react';
import LegalEntity from '../../context';
import Axios from 'axios';
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
    };
  }
  
  componentDidMount(){
    // if(this.props.location.hash){
    //   this.getUserDetails(this.getParameterByName('access_token',this.props.location.hash))
    // }
    // else{

    // }
  }

  async getUserDetails(token) {
    this.setState({ loading: true })
    await Axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?alt=json&access_token=${token}`).then(res => {
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
    // let code = this.props.location.hash
    // let data = "grant_type=authorization_code&code="+code;
    // let xhr = new XMLHttpRequest();
    // xhr.withCredentials = true;
    // xhr.addEventListener("readystatechange", function() {
    //   if(this.readyState === 4) {
    //     console.log(this.responseText);
    //   }
    // });
    // xhr.open("POST", "https://sso-int.daimler.com/sa/token.oauth2");
    // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    // xhr.setRequestHeader("Authorization", "Basic YmFzaWM6T0RFeVpHRTNaREl0WWpjMFlTMDBPRFJrTFRneVlUTXRaRE13Wm1ZNFlXVTJaamxqT2pWa1pEQTROR1kyTFdRNVpHRXRORFV5WVMwNE5tVmxMVFExWVRaa016QXhORE01Wmc9PQ==");
    // xhr.send(data);

    const requestBody = {
      grant_type: 'authorization_code',
      code: this.props.location.code,
      redirect_uri: "https%3A%2F%2Fdocms.es.corpintra.net%2Fclwf%2Flogin%3Fauthhandler%3DDaimler_OpenID"
    }

    const config = {
      withCredentials: false,
      headers: {
        "Authorization": "Basic YmFzaWM6T0RFeVpHRTNaREl0WWpjMFlTMDBPRFJrTFRneVlUTXRaRE13Wm1ZNFlXVTJaamxqT2pWa1pEQTROR1kyTFdRNVpHRXRORFV5WVMwNE5tVmxMVFExWVRaa016QXhORE01Wmc9PQ==",
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
    
    Axios.post(`https://sso-int.daimler.com/as/token.oauth2`, qs.stringify(requestBody), config)
      .then((result) => {
        console.log(result)
        this.setState({userDetails:result})
        localStorage.setItem('at',result.access_token)
        localStorage.setItem('it',result.id_token)
        localStorage.setItem('authenticate', true)
        localStorage.setItem('isLicenseAdmin', 'N')
        localStorage.setItem('isChopKeeper', 'Y')

        if (result.data.status === "success") {
          this.setState({ redirectOuth: true})
          setTimeout(this.redirect, 1000);
      }
      })
      .catch((err) => {
        console.log(err)
        console.log(err.data)

      })
  }

  render(){
    const code = this.props.location.code
    if (this.state.redirectOuth || localStorage.getItem('userId') ) {
      console.log("redirect oauth google")
      // return <Redirect to={`/portal`} />
    }
    if (code){
      console.log(code)
      this.exchangeToken()
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