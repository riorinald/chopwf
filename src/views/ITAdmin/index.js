import React,{Component} from 'react';
import swal from 'sweetalert2';
import Axios from 'axios';
import {
    Col, Row,
    Input, Button, InputGroup,
    FormGroup, Label, Collapse,
    Table, Badge,
    Card, CardHeader, CardBody, CardFooter
} from 'reactstrap';
import Creatable from 'react-select/creatable';
import ReactTable from "react-table";
import "react-table/react-table.css"

class ITAdmin extends Component {
    constructor(props){
        super(props)
        this.state = {

        }
    }
    render(){
        return(
            <Card>
                <CardHeader>
                    <h4>IT Admin</h4>
                </CardHeader>
                <CardBody>
                </CardBody>    
            </Card>
        )
    }   
}

export default ITAdmin;