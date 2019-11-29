import React,{Component} from 'react';
import swal from 'sweetalert2';
import Axios from 'axios';
import {
    Col, Row,
    Input, Button,
    FormGroup, Label, Collapse,
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
            editable: false,
            accordion: [true, false, false, false]
        }
        this.handleChange = this.handleChange.bind(this);
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

    handleChange(event){
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

    toggleAccordion(tab){
        const prevState = this.state.accordion;
        const state = prevState.map((x, index) => tab === index ? !x : false);

    this.setState({
      accordion: state,
    })
    }

    render(){

        return (
            <Card>
                <CardHeader>
                <h3>Administration</h3>
                </CardHeader>
                <CardBody>
                    <Card  className="mb-4">
                        <CardHeader>
                            <Button block color="link" className="text-left m-0 p-0" onClick={() => this.toggleAccordion(0)}>
                            <h5 className="m-0 p-0">Create Request</h5>
                        </Button>
                        </CardHeader>
                        <Collapse isOpen={this.state.accordion[0]} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
                        <CardBody className="px-0 py-3">
                        <Col className="mb-4">
                        <Label>Notes :</Label>
                            <Input rows={5} name="notes" disabled={!this.state.editable} value={this.state.notes} onChange={this.handleChange} type="textarea"  > </Input>                
                        </Col>
                        <Col className="text-right">
                            {this.state.editable 
                            ? <Button color="success" onClick={this.putUpdate}> Update </Button>
                            : <Button color="info" onClick={this.toggleEdit}> Edit </Button>
                            }
                        </Col>                    
                        </CardBody>
                        </Collapse>
                    </Card>
                    <Card  className="mb-4">
                        <CardHeader>
                            <Button block color="link" className="text-left m-0 p-0" onClick={() => this.toggleAccordion(1)}>
                            <h5 className="m-0 p-0">Department</h5>
                        </Button>
                        </CardHeader>
                        <Collapse isOpen={this.state.accordion[1]} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
                        <CardBody>
                        Department
                        </CardBody>
                        </Collapse>
                    </Card>
                    <Card  className="mb-4">
                        <CardHeader>
                            <Button block color="link" className="text-left m-0 p-0" onClick={() => this.toggleAccordion(2)}>
                            <h5 className="m-0 p-0">branch company chop</h5>
                        </Button>
                        </CardHeader>
                        <Collapse isOpen={this.state.accordion[2]} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
                        <CardBody>
                        Branch   
                        </CardBody>
                        </Collapse>
                    </Card>
                    <Card  className="mb-4">
                        <CardHeader>
                            <Button block color="link" className="text-left m-0 p-0" onClick={() => this.toggleAccordion(3)}>
                            <h5 className="m-0 p-0">Entitled Teams</h5>
                        </Button>
                        </CardHeader>
                        <Collapse isOpen={this.state.accordion[3]} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
                        <CardBody>
                        Teams  
                        </CardBody>
                        </Collapse>
                    </Card>
                    
                </CardBody>
            </Card>
        )
    }
}

export default Administration ;