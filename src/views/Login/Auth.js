import React, { Component,useEffect } from 'react';
import LegalEntity from '../../context';
import axios from 'axios';
import { Redirect,NavLink } from 'react-router-dom';
import { fakeAuth } from '../../App';
import {Card, CardBody, Row, Spinner} from 'reactstrap';
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
      errorMessage: '',
    };
  }
  
  componentDidMount(){
 
    var token = this.props.location.token
      if (token){
        var decodedToken=JWT.decode(token.id_token, {complete: true}); //decode JWT token with library jsonwebtoken
        var dates = new Date();
        var dateNow = dates.getTime() / 1000 //conver to unix Time
      
        // if(decodedToken.payload.exp < dateNow){
        //   this.setState({ isExpired: true })
        //   console.log('token expired')
        //   }
        // else{
          this.getOpenId(token.access_token);
          console.log('token not expired')
          // }
      } else {
          this.setState({ isExpired: true })
      }
  }

  async getOpenId(token) {
    const config = {

      headers: {
        "Authorization": "Bearer "+ token,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
       await axios.get(`https://sso-int.daimler.com/idp/userinfo.openid`, config)
          .then(res => {
            console.log(res, 'executed')
            this.setState({ loading: false, userDetails: res.data})

            localStorage.setItem('userId', res.data.sub)
            localStorage.setItem('authenticate', true)
            localStorage.setItem('legalEntity', 'MBAFC')
            localStorage.setItem('isLicenseAdmin', 'N')
            localStorage.setItem('isChopKeeper', 'Y')
            this.getUserDetails(res.data.sub)
          })
          .catch(err => {
            console.log(err)
            this.setState({
              loading:false,
              errorMessage: "openId not authenticated",
            })  
          })

      setTimeout(this.redirect, 2000)
  }

  async getUserDetails(userId) {
    this.setState({ loading: true })
    await axios.get(`${config.url}/users/${userId}`,{ headers: { Pragma: 'no-cache' } })
		.then(res => {
			this.setState({ userDetails: res.data, loading: false })
			switch(res.data.companyCode){
				case '685': 
					localStorage.setItem('legalEntity','MBAFC')
					break;
				case '632': 
					localStorage.setItem('legalEntity','MBIA')
					break;
				case '669': 
					localStorage.setItem('legalEntity','MBLC')
					break;
				case '520': 
					localStorage.setItem('legalEntity','DMT')
					break;
				}
			})
		.catch(err => {
			console.log(err)
			if(err.response){
				this.setState({
					loading:false,
					errorMessage: "User not found in the system. redirect to login page in ",
				})
				// setTimeout(this.props.history.push('/login'), 5000)
				this.countDown()
			}
			else{
				this.setState({
					loading:false,
					errorMessage: "Server Unreachable"
				})
			}
		})
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

  countDown = () => {
    if(this.state.timer !== 0){
    setInterval(() => {
      this.downcrement();
      }, 1000);
    }
  }
  
  downcrement = () => {
      this.setState({
        timer: this.state.timer -1
    });
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
        localStorage.setItem('authenticate', true)
        localStorage.setItem('isLicenseAdmin', 'N')
        localStorage.setItem('isChopKeeper', 'Y')
      })
      .then(()=> this.getOpenId(this.state.token.access_token))
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
    if (this.state.timer === 0){
      if (this.state.redirectOuth || localStorage.getItem('userId') ) {
        console.log("redirect oauth")
        // return <Redirect to={`/portal`} />
      }
      if (this.state.isExpired) {
        // return <Redirect to={`/login`} />
      }
    }
    const authenticated = <><label>Authenticated as {this.state.userDetails.sub || localStorage.getItem('userId')}</label><center>redirecting . . .</center></>
    const notAuth = <label>You are not Authenticated</label>
    const loading = <div> <Spinner type='grow' color="info" /> </div>
    return(
    <div className="app flex-row align-items-center">
    <Row className="justify-content-center">
      <Card className="shadow-lg p-3 bg-white rounded">
        <CardBody>
          {this.state.loading ? loading : this.state.userDetails || localStorage.getItem('userId') ? authenticated : notAuth}
        </CardBody>
      </Card>
    </Row>
    </div >
    )}
  
  }
  
  export default Authenticated;