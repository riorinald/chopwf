import React, { Component } from 'react';
import axios from 'axios';
import { Redirect,NavLink } from 'react-router-dom';
import { fakeAuth } from '../../App';
import config from '../../config';
import {GoogleAPI,GoogleLogin,GoogleLogout} from 'react-google-oauth'

import {
    Form,
    FormGroup,
    Input,
    Button, Row,
    Label, Col, Alert, Fade,
    Navbar, NavbarBrand, Nav, NavItem,
    Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';

const scope="email%20openid%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive.metadata.readonly";
const client_id="414328176448-a8id4cjtkim0f3ag4nli28hjbcqte4su.apps.googleusercontent.com";
const redirect_uri="http%3A%2F%2Flocalhost/authenticated"
const pathname = `https://accounts.google.com/o/oauth2/v2/auth?scope=${scope}&state=state_parameter_passthrough_value&redirect_uri=${redirect_uri}&response_type=token&client_id=${client_id}&authuser=1`;
 

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
            pathname: ""
        }

        this.handleChange = this.handleChange.bind(this);
        this.loginCheck = this.loginCheck.bind(this);
        this.WindowsLogin = this.WindowsLogin.bind(this);
        this.redirect = this.redirect.bind(this);


    }

    componentDidMount(){
        // this.windowsSSO();
    }

    windowsSSO() {
        axios.get('http://192.168.1.47/echop/api/v1/authenticate',{withCredentials: true})
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
        axios.get('http://192.168.1.47/echop/api/v1/authenticate',{withCredentials: true})
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
        var windowpop = window.open(pathname,null, 'height=600,width=450')
        windowpop.focus()
        var newThis = this;
        var timer = setInterval(()=> {   
                    if(windowpop.closed) {  
                        clearInterval(timer);
                        newThis.setState({
                          redirectToReferrer: true,
                          success: true
                        });
                        setTimeout(windowpop.close(), 1500)
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


    render() {
        const { redirectToReferrer } = this.state

        if (redirectToReferrer) {
            console.log("redirect")
            return <Redirect to={'/portal'} />
        }
        
        const googleOauth = <GoogleAPI clientId="877545934462-i1ap0krecmv6qqsema0ch6n5l4mndk21.apps.googleusercontent.com"
         redirectUri="http%3A%2F%2Flocalhost/authenticated"
        // onUpdateSigninStatus= {console.log()}
        // onInitFailure={CALLBACK}
         >
        <div>
              <div><GoogleLogin /></div>
              {/* <div><GoogleLogout /></div> */}
        </div>
    </GoogleAPI>

        return (
            <div>
                <Navbar color="light" light expand="md">
                    <NavbarBrand>Chop Workflow System</NavbarBrand>
                    <Nav className="ml-auto" navbar>
                        <NavItem>DEMO</NavItem>
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
                        {/* <Card> */}
                        {/* <CardBody> */}
                        {/* <Form> */}
                        <Form>
                            <FormGroup row>
                                <Label for="exampleEmail" sm={3}>Username</Label>
                                <Col sm={9}>
                                    <Input onChange={this.handleChange} 
                                    value={this.state.username} type="text" name="username" 
                                    id="username" placeholder="Please enter Username" />
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
                                <Button className="btn-google-plus btn-brand" onClick= {this.loginWithGoogle}>
                                    <i className="fa fa-google-plus"></i><span>with Google</span>
                                </Button>
                            </Col>
                            <Col className="text-center">
                                <Button className="btn-openid btn-brand" onClick= {event =>  window.location.href = pathname} >
                                    <i className="fa fa-openid"></i><span>Google OpenID</span>
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