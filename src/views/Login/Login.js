import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { fakeAuth } from '../../App';
import config from '../../config';

import {
    Form,
    FormGroup,
    Input,
    Button,
    Label, Col, Alert, Fade,
    Navbar, NavbarBrand, Nav, NavItem,
    Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';


class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            redirectToReferrer: false,
            username: "",
            password: "",
            info: "",
            second: 5,
            fade: false
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
                    console.log(res);
                    localStorage.setItem('authenticate', true)
                    localStorage.setItem('legalEntity', 'MBAFC')
                    localStorage.setItem('ticket', res.data.ticket)
                    localStorage.setItem('userId', res.data.userId)
                    localStorage.setItem('roleId', res.data.roleId)
                    localStorage.setItem('token', res.data.token)
                    if (res.data.status === "success") {
                        this.setState({ info: "login " + res.data.status})
                        setTimeout(this.redirect, 1000);
                    }
                })
        } catch (error) {
            this.setState({ info: error.response.statusText});
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
        this.setState({ fade: true,info: "Loding ... " })
        this.validate(loginCredentials);
    }


    


    render() {
        const { redirectToReferrer } = this.state

        if (redirectToReferrer) {
            console.log("redirect")
            return <Redirect to='/portal' />
        }


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


                        {/* </CardBody> */}
                        {/* </Card> */}
                    </ModalBody>
                    <ModalFooter>
                        <Button block color="primary" style={{ justifyContent: "center" }} onClick={this.loginCheck}>Login </Button>
                        <br />
                        <Button block color="success" style={{ justifyContent: "center" }} onClick={this.WindowsLogin}>Login With Windows </Button>
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