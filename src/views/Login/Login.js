import React, { Component } from 'react';
import {
    Form,
    FormGroup,
    Input,
    Button,
    Card,
    CardBody
} from 'reactstrap';

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: "",
            password: ""
        }

        this.handleChange = this.handleChange.bind(this);
        this.login = this.login.bind(this);
    }

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    async login(){
        // const loginCredentials = {
        //     username: this.state.username,
        //     password: this.state.password
        // }

        // try {
        //     await axios.post('http://192.168.1.47/echop/api/v1/login', loginCredentials
        //     , { headers: { 'Content-Type': '  application/json' } })
        //       .then(res => {
        //         console.log(res.data)
        //         Swal.fire({
        //           title: 'Requested',
        //           text: 'Status Code: ' + res.data.statusCode + 'Reference Number: ' + res.data.referenceNum,
        //           type: res.data.status
        //         })
        //       })
        //   } catch (error) {
        //     console.error(error);
        //   }


    }



    render() {
        return (
            <div>

                <Card>
                    <CardBody>
                        <Form>
                            <FormGroup>
                                <Input type="text" name="username" onChange={this.handleChange} value={this.state.username} placeholder="username"></Input>
                                <Input type="password" onChange={this.handleChange} name="password" value={this.state.password} placeholder="password"></Input>
                                <Button onClick={this.login} type="submit">Login </Button>
                            </FormGroup>
                        </Form>
                    </CardBody>
                </Card>
            </div>
        )
    }

}
export default Login;