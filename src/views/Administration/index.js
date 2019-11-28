import React,{Component} from 'react';
import swal from 'sweetalert2';
import Axios from 'axios';
import {
    Col, Row,
    Input, Button,
    FormGroup, Label,
    Card, CardHeader, CardBody, CardFooter
} from 'reactstrap';
import { AppBreadcrumb } from '@coreui/react';
import qs from 'qs'

class Administration extends Component {
    constructor(props){
        super(props)
        this.state = {
            notes: '',
            label: '',
            editable: false
        }
    }

    componentDidMount(){
        this.getData()
    }

    getData(){
        Axios.get(`http://5b7aa3bb6b74010014ddb4f6.mockapi.io/config/1`)
        .then (res => {
            this.setState({
                notes : res.data.notes,
                label : res.data.label
            })
        })
    }

    handleChanges = (event) => {
        this.setState({
            notes : event.target.value
        })
    }

    toggleEdit = () => {
        this.setState({editable: !this.state.editable})
    }

    putUpdate = () => {
        // Axios.put(`http://5b7aa3bb6b74010014ddb4f6.mockapi.io/config/1`, qs.stringify(this.state.notes), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
        let xhr = new XMLHttpRequest();
        let data= qs.stringify(this.state)
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
              console.log(this.responseText);
            }
          });
        xhr.open("PUT", "http://5b7aa3bb6b74010014ddb4f6.mockapi.io/config/1");
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("User-Agent", "PostmanRuntime/7.20.1");
        xhr.setRequestHeader("Accept", "*/*");
        xhr.send(data);
        swal.fire({
            title: "Updated",
            timer: 1500,
            type: 'success',
            timerProgressBar: true
        })
        this.setState({editable: !this.state.editable})
    }

    render(){

        return (
            <Card>
                <CardHeader>
                <h3>Administration</h3>
                </CardHeader>
                <CardBody>
                <Col className="mb-4">
                <Label>Notes :</Label>
                    <Input rows={5} disabled={!this.state.editable} onChange={this.handleChanges} type="textarea" value={this.state.notes} > </Input>                
                </Col>
                <Col className="text-right">
                    {this.state.editable 
                    ? <Button color="success" onClick={this.putUpdate}> Update </Button>
                    : <Button color="info" onClick={this.toggleEdit}> Edit </Button>
                    }
                </Col>                    
                </CardBody>
            </Card>
        )
    }
}

export default Administration ;