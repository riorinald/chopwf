import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { fakeAuth } from '../../App';
import {Card, CardBody, Button, Spinner, Alert } from 'reactstrap';
import config from '../../config';
import qs from 'querystring';
import JWT from 'jsonwebtoken';
import Cookies from 'universal-cookie';
import Authorize from '../../functions/Authorize'


import {
  AppHeader
} from '@coreui/react';

const cookies = new Cookies();

class Authenticated extends Component { 
  constructor(props) {
    super(props);
    this.state = {
      userDetails:'',
      token: '',
      loading: true,
      isExpired: false,
      info: '',
      redirectTo: '/login',
      color:'',
      timer: 10,
      title: 'Authenticated as'
    };
  }
  
  componentDidMount(){
    const code = this.props.location.code
    const param = qs.parse(this.props.location.search.slice(1))
    if (code){
      this.exchangeToken(code);
    }
    else {
      if(param.session === 'expired'){
      this.setState({
          loading:false,
          title: 'Session Expired',
          info: "Your Session is expired. Please do relogin",
          color: "danger",
          isExpired:true,
          // timer: 2,
          // redirectTo: '/login'+this.props.location.search    
        })
        localStorage.clear()
        // this.countDown()
      }
      else if (param.workflow && param.companyid && param.userid){
        const userInfo = cookies.get('userInfo', {path:'/'})
        
        if(userInfo && userInfo.userId === param.userid){          
          if(param.workflow === 'license'){
          const page = param.userrole === 'approver' ? 'mypendingtask' : 'myapplication'

            localStorage.setItem('legalEntity', param.companyid.toUpperCase())
            localStorage.setItem('application', param.workflow.toUpperCase())
            this.props.history.push({
              pathname:`${param.workflow}/${page}/details/`,
              state:{redirected:true, taskId:param.licenseid}
            })
          }
          else{
            const page = param.userrole === 'approver' ? 'mypendingtask' : 'myapps'

            localStorage.setItem('legalEntity', param.companyid.toUpperCase())
            localStorage.setItem('application', param.workflow.toUpperCase())
            this.props.history.push({
              pathname:`/${page}/details/`,
              state:{redirected:true, taskId:param.taskid}
            })
          }

        }
        else{
          if(param.workflow && userInfo){
            this.setState({
              loading:false,
              title: 'You are not Authorized',
              info: "Session user does not match with the redirect URL",
              isExpired: false,
              color: "danger",
              timer:5,
              redirectTo: '/login' + this.props.location.search        
            })
            cookies.remove('userInfo',{path:'/'})
            this.countDown()
          }
          else {
            this.setState({
              loading:false,
              title: 'You are not Authenticated',
              info: "Login required to see the apllication details",
              color: "danger",
              timer:5,
              redirectTo: '/login' + this.props.location.search 
            })
            this.countDown()
            }
        }
      }
      else {
        if(Authorize.getCookies()){
          this.setState({
            loading:false,
            title: 'Authenticated with session',
            info: "login as "+ Authorize.getCookies().userId,
            color: "success",
            timer:3,
            redirectTo: '/portal'
          })
          this.countDown()
        }
        else{
          this.setState({
            loading:false,
            title: 'You are not Authenticated',
            info: "Login required",
            color: "danger",
            timer:5,
            redirectTo: '/login'
          })
          this.countDown()
        }
      }
    }
  }
  
  exchangeToken(code){
    const requestBody = {
      grant_type: 'authorization_code',
      code: code, 
      redirect_uri: "https://docms.es.corpintra.net/clwf/login?authhandler=Daimler_OpenID"
    }

    const axiosConfig = {
      // withCredentials: false,
      headers: {
        "Authorization": `Basic ${config.clientBase64}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }

    axios.post(`${config.OAdomain}/as/token.oauth2`, qs.stringify(requestBody), axiosConfig)

        .then((result) => {
            //console.log(result)
            this.setState({token:result.data})
            localStorage.setItem('accessToken',result.data.access_token)
            localStorage.setItem('idToken',result.data.id_token)
            this.getOpenId(result.data.access_token)
        })
        .catch((err) => {
            if(err.response){
              this.setState({
                loading: false,
                title: 'You are not Authenticated',
                info:'error: can not retrieve token | ' + err.response.statusText,
                timer:5,
                color: "danger",
              })
                console.log(err.response)
                // console.log(err.response.statusText)
              }
            else {
              this.setState({
                loading: false,
                title: 'You are not Authenticated',
                info:"OAuth server unreachable",
                timer:5,
                color: "danger",
              })
                console.log(err)
            }
            // this.props.history.push({pathname:'/login',search:null})
            setTimeout(this.countDown(),1000)
        })
  }

  async getOpenId(token) {
    const axiosConfig = {
      headers: {
        "Authorization": "Bearer "+ token,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
    let credentials= {username: '', password: ''}

       await axios.get(`${config.OAdomain}/idp/userinfo.openid`, axiosConfig)
          .then(res => {

            this.setState({ 
              loading: false, 
              userDetails: res.data,
              title: "Authenticated as " + res.data.sub
              })
            localStorage.setItem('userId', res.data.sub)
            credentials.username = res.data.sub
            this.validate(credentials)
          })
          .catch(err => {
            console.log(err)
            this.setState({
              loading:false,
              title: 'You are not Authenticated',
              info: "openId not authenticated",
              color: "danger",
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

                // console.log(res.data)

                if (res.data.status === "success") {
                  this.setState({
                    loading: false, 
                    info: info,
                    color: "success",
                    timer:2,
                    isExpired:false,
                    redirectTo:'/portal'
                  })

                  Authorize.setCookies(res.data)
                  this.countDown()
                  this.redirect()
                }
            })
    } catch (error) {
        if (error.response){
        this.setState({ 
          info: error.response.statusText+" : user " + credentials.username + " is not authorized in the system.",
          color:"danger",
        });
        }
        else {
        this.setState({ info: "CLWFB API is unreachable", color: "danger",});
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

  countDown = () => {
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
        return <Redirect to={this.state.redirectTo} />
    }
    return (
    <div>
      <AppHeader fixed>
          <span className="navbar-nav mr-5">{this.state.userDetails.displayName}</span>
      </AppHeader>
      <div>
      <Card className="centerd shadow-lg mt-5 p-3 rounded">
        <CardBody className="text-center">
          {this.state.loading
           ? <div className="display-5">Loading <Spinner type='grow' color="info" /> </div>
           : <> 
            <label className="display-5 mb-4 ">{this.state.title}</label>
            <Alert color={this.state.color} >{this.state.info}</Alert >
            {this.state.isExpired ?
            <Button className="btn-openid btn-brand mb-2" onClick= {event =>  window.location.href = config.openid} >
                <i className="fa fa-openid"></i><span>Daimler OpenID Auth</span> </Button>
            : null }
            {/* {this.state.timer === 0 ? <p className="mt-3 mb-0"><span style={{color:'grey'}}>Redirect in {this.state.timer}</span></p>:null} */}
            </>
          }   
        </CardBody>
      </Card>
      </div>
    </div>
    );
  }
}
  
  export default Authenticated;