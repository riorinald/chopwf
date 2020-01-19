import React, { Component } from 'react';
import axios from 'axios';
import { Redirect,NavLink } from 'react-router-dom';
import { fakeAuth } from '../../App';
import config from '../../config';
import queryString from 'query-string';

import {
    Form,
    FormGroup,
    Input,
    Button, Row,
    Label, Col, Alert, Fade,
    Navbar, NavbarBrand, Nav, NavItem,
    Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';

// const scope="email%20openid%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive.metadata.readonly";
// const client_id="414328176448-a8id4cjtkim0f3ag4nli28hjbcqte4su.apps.googleusercontent.com";
// const redirect_uri="http%3A%2F%2Flocalhost/authenticated"
// const pathname = `https://accounts.google.com/o/oauth2/v2/auth?scope=${scope}&state=state_parameter_passthrough_value&redirect_uri=${redirect_uri}&response_type=token&client_id=${client_id}&authuser=1`;

const scope ="openid"
const client_id="812da7d2-b74a-484d-82a3-d30ff8ae6f9c"
const client_secret="5dd084f6-d9da-452a-86ee-45a6d301439f"
const redirect_uri="https%3A%2F%2Fdocms.es.corpintra.net%2Fclwf%2Flogin%3Fauthhandler%3DDaimler_OpenID"
const pathname=`https://sso-int.daimler.com/as/authorization.oauth2?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}`


class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            redirectToReferrer: false,
            username: "",
            password: "",
            info: "",
            second: 5,
            fade: false,
            redirectOuth: false,
            pathname: "",
            token:""
        }

        this.handleChange = this.handleChange.bind(this);
        this.loginCheck = this.loginCheck.bind(this);
        this.WindowsLogin = this.WindowsLogin.bind(this);
        this.redirect = this.redirect.bind(this);


    }

    componentDidMount(){
        const src = queryString.parse(this.props.location.search)

        if (src.code){
            console.log('code acquired!', src.code)
            this.exchangeToken(src.code)
        }
    }

    windowsSSO() {
        axios.get('https://docms.es.corpintra.net/clwfb/api/v1/authenticate',{withCredentials: true})
        .then(res => {

            localStorage.setItem('authenticate', res.data.isAuthenticated)
            localStorage.setItem('userId', res.data.userId)
            localStorage.setItem('username', res.data.userName)
            localStorage.setItem('authType', res.data.authenticationType)
            console.log(res);
        }) 
        .catch(function (error) {
            console.log(error);
        })
    }

    WindowsLogin() {
        axios.get('https://docms.es.corpintra.net/clwfb/api/v1/authenticate',{withCredentials: true})
        .then(res => {
            
            localStorage.setItem('authenticate', res.data.isAuthenticated)
            localStorage.setItem('userId', res.data.userId)
            localStorage.setItem('username', res.data.userName)
            localStorage.setItem('authType', res.data.authenticationType)
            
            if (res.data.windowsIdExist === true) {
                this.setState({ 
                fade: true,
                info: "logged in as :" + res.data.userName})
                setTimeout(this.redirect, 1000);
            }
            else {
                this.setState({
                fade: true,
                info: "Windows Credential not Authenticated"
                });
                setTimeout(this.setState({fade: true}), 2500);
            }
        })
        .catch(function (error) {
            console.log(error);

        })
    }

    async validate(loginCredentials) {
        try {
            await axios.post(`${config.url}/login`, loginCredentials
                , { headers: { 'Content-Type': '  application/json' } })
                .then(res => {
                    let info = "LOGIN " + res.data.status.toUpperCase()
                    localStorage.setItem('authenticate', true)
                    localStorage.setItem('legalEntity', 'MBAFC')
                    localStorage.setItem('ticket', res.data.ticket)
                    localStorage.setItem('userId', res.data.userId)
                    localStorage.setItem('roleId', res.data.roleId)
                    localStorage.setItem('token', res.data.token)
                    localStorage.setItem('isLicenseAdmin', res.data.isLicenseAdmin)
                    localStorage.setItem('isChopKeeper', res.data.isChopKeeper)


                    if (res.data.status === "success") {
                        this.setState({ info: info})
                        setTimeout(this.redirect, 1000);
                    }
                })
        } catch (error) {
            if (error.response){
            this.setState({ info: error.response.statusText});
            } else {
            this.setState({ info: "server unreachable"});
            }   
        }
    }

    redirect(){
        fakeAuth.authenticate(() => {
            this.setState({ redirectToReferrer: true })
            });
    }

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    loginCheck() {
        const loginCredentials = {
            username: this.state.username,
            password: this.state.password
        }
        this.setState({ fade: true,info: "Loading ... " })
        this.validate(loginCredentials);
    }

    loginWithGoogle = () =>{
        const scope="email%20openid%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive.metadata.readonly";
        const client_id="414328176448-a8id4cjtkim0f3ag4nli28hjbcqte4su.apps.googleusercontent.com";
        const redirect_uri="http%3A%2F%2Flocalhost/authenticated"
        const pathname = `https://accounts.google.com/o/oauth2/v2/auth?scope=${scope}&state=state_parameter_passthrough_value&redirect_uri=${redirect_uri}&response_type=token&client_id=${client_id}&authuser=1`;
        // const scope ="openid"
        // const client_id="812da7d2-b74a-484d-82a3-d30ff8ae6f9c"
        // const client_secret="5dd084f6-d9da-452a-86ee-45a6d301439f"
        // const redirect_uri="https%3A%2F%2Fdocms.es.corpintra.net%2Fclwf%2Flogin%3Fauthhandler%3DDaimler_OpenID"
        // const pathname=`https://sso-int.daimler.com/as/authorization.oauth2?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}`
        console.log(pathname)
        var windowpop = window.open(pathname,null, 'height=600,width=450')
        windowpop.focus()
        var newThis = this;
        var timer = setInterval(()=> {
            if (windowpop.location.href === "http://localhost/portal" ) {
                clearInterval(timer);
                windowpop.close()
            }   
                    if(windowpop.closed) {  
                        clearInterval(timer);
                        fakeAuth.authenticate(() => {
                            this.setState({ redirectToReferrer: true })
                            });
                        console.log('closed');  
                    }  
                }, 1000);
        // axios.get(pathname).then(response => {
        //     console.log(response);
        //     var strWindowFeatures = "width=1000,height=800,resizable,scrollbars=yes,status=1";
        //     var windowpop = window.open(response.data.href, null, strWindowFeatures)
        //     this.setState({
        //       authUrl: response.data.href
        //     })
        //     windowpop.focus()
        //     var newThis = this; 
        //     var timer = setInterval(function() {   
        //         if(windowpop.closed) {  
        //             clearInterval(timer);
        //             newThis.setState({
        //               redirectToReferrer: true,
        //               success: true
        //             });
        //             localStorage.setItem('authenticate', true)
        //             console.log('closed');  
        //         }  
        //     }, 1000); 
        //   })
        //   .catch(error => {
        //     console.log('Error fetching and parsing data', error);
        //   });

        // this.setState({ redirectOuth:true, pathname: pathname})
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

        axios.post(`https://sso-int.daimler.com/as/token.oauth2`, queryString.stringify(requestBody), config)

            .then((result) => {
                console.log(result)
                this.setState({token:result.data})
        
                localStorage.setItem('accessToken',result.data.access_token)
                localStorage.setItem('idToken',result.data.id_token)
                this.props.history.push({pathname:'/authenticated',token:result.data})

            })
            .catch((err) => {
                if(err.response){
                    console.log(err.response)
                    console.log(err.response.statusText)}
                else {
                    console.log(err)
                }
                this.props.history.push({pathname:'/login',search:null})
            })
      }

    render() {
        const { redirectToReferrer } = this.state

        if (redirectToReferrer) {
            console.log("redirect")
            return <Redirect to={'/portal'} />
        }
        return (
            <div>
                <Navbar color="light" light expand="md">
                    <NavbarBrand>Chop Workflow System</NavbarBrand>
                    <Nav className="ml-auto" navbar>
                        <NavItem></NavItem>
                    </Nav>
                </Navbar>

                <Modal size="md " centered isOpen={true}>
                    <ModalHeader >Login to Chop Workflow System</ModalHeader>
                    <ModalBody>
                        <div style={{ textAlign: "center" }}>
                            {/* <img style={{ width: "150px" }} src="https://img.icons8.com/ios-filled/250/000000/ios-logo.png" /> */}
                        </div>
                    </ModalBody>
                    <ModalBody>
                        <Form>
                            <FormGroup row>
                                <Label for="exampleEmail" sm={3}>Username</Label>
                                <Col sm={9}>
                                    <Input onChange={this.handleChange} 
                                    value={this.state.username} type="text" name="username" 
                                    id="username" placeholder="Please enter Username" 
                                    onKeyPress={(e) => {if (e.key === 'Enter'){this.loginCheck()}}}/>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="password" sm={3}>Password</Label>
                                <Col sm={9}>
                                    <Input onChange={this.handleChange} 
                                    value={this.state.password} type="password" name="password"
                                    id="password" placeholder="Please enter your Password" 
                                    onKeyPress={(e) => {if (e.key === 'Enter'){this.loginCheck()}}}/>
                                </Col>
                            </FormGroup>
                        </Form>
                        <Row noGutters>
                            <Col className="text-center">
                                <Button className="btn-openid btn-brand" onClick= {this.loginWithGoogle}>
                                    <i className="fa fa-openid"></i><span>Google OpenID Auth</span>
                                </Button>
                            </Col>
                            <Col className="text-center">
                                <Button className="btn-openid btn-brand" onClick= {event =>  window.location.href = pathname} >
                                    <i className="fa fa-openid"></i><span>Daimler OpenID Auth</span>
                                </Button>
                            </Col>
                        </Row>
                        {/* </CardBody> */}
                        {/* </Card> */}
                    </ModalBody>
                    <ModalFooter>
                        <Button id="login" block color="primary" style={{ justifyContent: "center" }} onClick={this.loginCheck}>Login </Button>
                        <br />
                        <Button id="loginWindows" block color="success" style={{ justifyContent: "center" }} onClick={this.WindowsLogin}>Login With Windows </Button>
                    </ModalFooter>
                <Fade in={this.state.fade}>
                    <Alert color="info"><center>{this.state.info}</center></Alert>
                </Fade>
                </Modal>

            </div>
        )
    }

}
export default Login;