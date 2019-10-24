import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { fakeAuth } from '../../App'

import {
    Form,
    FormGroup,
    Input,
    Button,
    Card,
    CardBody, CardImg,
    Label, Col,
    Navbar, NavbarBrand, Nav, NavItem,
    Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';


class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            redirectToReferrer: false,
            username: "",
            password: ""
        }

        this.handleChange = this.handleChange.bind(this);
        this.loginCheck = this.loginCheck.bind(this);
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

        this.validate(loginCredentials);
    }

    async validate(loginCredentials) {
        try {
            await axios.post('http://192.168.1.47/echop/api/v1/login', loginCredentials
                , { headers: { 'Content-Type': '  application/json' } })
                .then(res => {
                    console.log(res)
                    localStorage.setItem('authenticate', true)
                    localStorage.setItem('ticket', res.data.ticket)
                    localStorage.setItem('userId', res.data.userId)
                    localStorage.setItem('token', res.data.token)
                    if (res.data.status === "success") {
                        fakeAuth.authenticate(() => {
                            this.setState({ redirectToReferrer: true })
                        })
                    }
                })
        } catch (error) {
            console.error(error);
        }
    }

    


    render() {
        const { redirectToReferrer } = this.state

        if (redirectToReferrer) {
            console.log("redirect")
            return <Redirect to='/create' />
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
                                    <Input onChange={this.handleChange} value={this.state.username} type="text" name="username" id="username" placeholder="Please enter Username" />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="password" sm={3}>Password</Label>
                                <Col sm={9}>
                                    <Input onChange={this.handleChange} name="password" value={this.state.password} type="password" name="password" id="password" placeholder="Please enter your Password" />
                                </Col>
                            </FormGroup>
                        </Form>


                        {/* </CardBody> */}
                        {/* </Card> */}
                    </ModalBody>
                    <ModalFooter>
                        {/* <div style={{ textAlign: "center" }}> */}
                        <Button block color="primary" style={{ justifyContent: "center" }} onClick={this.loginCheck}>Login </Button>
                        {/* </div> */}
                    </ModalFooter>
                </Modal>
            </div>
        )
    }

}
export default Login;