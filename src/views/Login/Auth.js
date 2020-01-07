import React, { Component,useEffect } from 'react';
import LegalEntity from '../../context';
import Axios from 'axios';
import { Redirect,NavLink } from 'react-router-dom';
import { fakeAuth } from '../../App';
import {Card, CardBody, Row} from 'reactstrap';
import config from '../../config';
import { access } from 'fs';

class Authenticated extends Component { 
  constructor(props) {
    super(props);
    this.state = {
      userDetails:'',
      redirectOuth: false,
    };
  }
  
  componentDidMount(){
    if(this.props.location.hash){
      this.getUserDetails(this.getParameterByName('access_token',this.props.location.hash))
    }
    else{

    }
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

  render(){
    if (this.state.redirectOuth || localStorage.getItem('userId') ) {
      console.log("redirect oauth google")
      // return <Redirect to={`/portal`} />
    }
    const authenticated = <><label>Authenticated as {this.state.userDetails.given_name || localStorage.getItem('userId')}</label><center>redirecting . . .</center></>
    const notAuth = <label>You are not Authenticated</label> 
    return(
    <div className="app flex-row align-items-center">
    <Row className="justify-content-center">
      <Card className="shadow-lg p-3 bg-white rounded">
        <CardBody>
          {this.props.location.hash || localStorage.getItem('userId') ? authenticated : notAuth}
        </CardBody>
      </Card>
    </Row>
    </div >
    )}
  
  }
  
  export default Authenticated;