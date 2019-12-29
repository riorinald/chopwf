import React, { Component } from 'react';
import editIcon from "../../assets/img/edit.png";
import deleteIcon from "../../assets/img/delete.png";
import {
    Table,
    Card,
    CardBody,
    Button,
    Form,
    Input,
    Label
} from 'reactstrap';

import Axios from 'axios';


class Help extends Component {
    constructor(props) {
        super(props)
        this.state = {
            chopKeepers: {
                columnHeader: ["Chop Type", "Chop Keeper", "Contact Person", "Location"],
                table: [
                    { chopType: ["MBAFC Company Chop", "MBAFC Company Chop", "MBAFC Company Chop", "MBAFC Company Chop"], chopKeeper: "MBAFC Enterprise Governance", contactPerson: ["person 1", "person 2", "person 3", "person 4"], location: "9F, Tower C" },
                    { chopType: ["MBAFC Company Chop", "MBAFC Company Chop", "MBAFC Company Chop", "MBAFC Company Chop"], chopKeeper: "MBAFC Enterprise Governance", contactPerson: ["person 1", "person 2", "person 3", "person 4"], location: "9F, Tower C" },
                    { chopType: ["MBAFC Company Chop", "MBAFC Company Chop", "MBAFC Company Chop", "MBAFC Company Chop"], chopKeeper: "MBAFC Enterprise Governance", contactPerson: ["person 1", "person 2", "person 3", "person 4"], location: "9F, Tower C" },
                    { chopType: ["MBAFC Company Chop", "MBAFC Company Chop", "MBAFC Company Chop", "MBAFC Company Chop"], chopKeeper: "MBAFC Enterprise Governance", contactPerson: ["person 1", "person 2", "person 3", "person 4"], location: "9F, Tower C" }
                ]
            },
            QA: [
                {
                    question: "Who can submit an application ?",
                    answer: "Applicant of the Chop Use Application shall be permanent staff of Daimler. Inters and external staffs are not eligible to submit applications for chop usage, but they can come to BC for chop on behalf of permanent staffs."
                },
                {
                    question: "Who can submit an application ?",
                    answer: "Applicant of the Chop Use Application shall be permanent staff of Daimler. Inters and external staffs are not eligible to submit applications for chop usage, but they can come to BC for chop on behalf of permanent staffs."
                },
                {
                    question: "Who can submit an application ?",
                    answer: "Applicant of the Chop Use Application shall be permanent staff of Daimler. Inters and external staffs are not eligible to submit applications for chop usage, but they can come to BC for chop on behalf of permanent staffs."
                },
                {
                    question: "Who can submit an application ?",
                    answer: "Applicant of the Chop Use Application shall be permanent staff of Daimler. Inters and external staffs are not eligible to submit applications for chop usage, but they can come to BC for chop on behalf of permanent staffs."
                },
                {
                    question: "Who can submit an application ?",
                    answer: "Applicant of the Chop Use Application shall be permanent staff of Daimler. Inters and external staffs are not eligible to submit applications for chop usage, but they can come to BC for chop on behalf of permanent staffs."
                },
                {
                    question: "Who can submit an application ?",
                    answer: "Applicant of the Chop Use Application shall be permanent staff of Daimler. Inters and external staffs are not eligible to submit applications for chop usage, but they can come to BC for chop on behalf of permanent staffs."
                },
                {
                    question: "Who can submit an application ?",
                    answer: "Applicant of the Chop Use Application shall be permanent staff of Daimler. Inters and external staffs are not eligible to submit applications for chop usage, but they can come to BC for chop on behalf of permanent staffs."
                },
            ],
            editable: false,
            dropdownOpen: false
        };
        this.makeEditable = this.makeEditable.bind(this);
        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.addData = this.addData.bind(this);
        this.addQA = this.addQA.bind(this);
        this.deleteQA = this.deleteQA.bind(this);
        this.deleteData = this.deleteData.bind(this);
        this.addChopType = this.addChopType.bind(this);
        this.addContactPerson = this.addContactPerson.bind(this);
        this.deleteChopType = this.deleteChopType.bind(this);
        this.deleteContactPerson = this.deleteContactPerson.bind(this);


    }

    async getData(){
        const response = Axios.get('http://5b7aa3bb6b74010014ddb4f6.mockapi.io/config/3')
        this.setState({chopKeepers: response.data.chopKeepers, QA: response.data.QA })
    }

    makeEditable() {
        if (this.state.editable) {
            console.log("Instructions updated")
            //codes to update instructions to the database
        }
        this.setState(state => ({
            editable: !state.editable,
        }))
    }

    toggleDropdown() {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }

    addData() {
        let chopKeepersCopy = JSON.parse(JSON.stringify(this.state.chopKeepers))
        const obj = { 'chopType': ["Plese enter a new chop Type"], 'chopKeeper': "Please enter the name of the new Chop Keeper", 'contactPerson': ["Please add a new contact person"], 'location': "Please enter a new location" }

        chopKeepersCopy.table.push(obj)
        // console.log(chopKeepersCopy)
        this.setState({
            chopKeepers: chopKeepersCopy
        })
    }

    deleteData(index) {
        let chopKeepersCopy = JSON.parse(JSON.stringify(this.state.chopKeepers))
        chopKeepersCopy.table.splice(index, 1)
        this.setState({
            chopKeepers: chopKeepersCopy
        })
    }

    addQA() {
        let QaCopy = JSON.parse(JSON.stringify(this.state.QA))
        const obj = { 'question': "Plese enter a new question", 'answer': "Please enter the answer" }
        QaCopy.push(obj)
        // console.log(QaCopy)
        this.setState({
            QA: QaCopy
        })
    }

    deleteQA(index) {
        console.log(index)
        // let QaCopy = JSON.parse(JSON.stringify(this.state.QA))
        const QaCopy = this.state.QA.slice()
        QaCopy.splice(index, 1)
        this.setState({
            QA: QaCopy
        })
    }

    addChopType(index) {
        let chopKeepersCopy = JSON.parse(JSON.stringify(this.state.chopKeepers))
        // console.log(chopKeepersCopy.table)
        chopKeepersCopy.table[index].chopType.push("Please enter a new Chop Type")
        this.setState({
            chopKeepers: chopKeepersCopy
        })
    }

    addContactPerson(index) {
        let chopKeepersCopy = JSON.parse(JSON.stringify(this.state.chopKeepers))
        // console.log(chopKeepersCopy.table)
        chopKeepersCopy.table[index].contactPerson.push("Please enter a new Contact Person")
        this.setState({
            chopKeepers: chopKeepersCopy
        })

    }

    deleteChopType(index, i) {
        let chopKeepersCopy = JSON.parse(JSON.stringify(this.state.chopKeepers))
        chopKeepersCopy.table[index].chopType.splice(i, 1)
        this.setState({
            chopKeepers: chopKeepersCopy
        })
    }

    deleteContactPerson(index, i) {
        let chopKeepersCopy = JSON.parse(JSON.stringify(this.state.chopKeepers))
        chopKeepersCopy.table[index].contactPerson.splice(i, 1)
        this.setState({
            chopKeepers: chopKeepersCopy
        })
    }



    render() {
        const chopKeepersColumnHeaders = this.state.chopKeepers.columnHeader.map((columnHeader, index) =>
            <th key={index}>{columnHeader}</th>)
        const chopKeepers = this.state.chopKeepers.table.map((table, index) =>
            <tr key={index}>
                <td>{table.chopType.map((type, i) =>
                    <div key={type + i}>{type}</div>)}</td>
                <td>{table.chopKeeper}</td>
                <td> {table.contactPerson.map((person, i) =>
                    <div key={person + i}>{person}</div>)}</td>
                <td>{table.location}</td>
            </tr>)
        const chopKeepersEditable = this.state.chopKeepers.table.map((table, index) =>
            <tr key={index}>
                <td>{table.chopType.map((type, i) =>
                    <div key={i}>
                        <Form style={{ display: "flex" }}><Input type="text" defaultValue={type}></Input><Button onClick={() => this.deleteChopType(index, i)} color="danger">Delete</Button></Form><br />
                    </div>
                )}
                    <Button onClick={() => this.addChopType(index)} >Add New Chop Type</Button>
                </td>
                <td><Form><Input type="text" defaultValue={table.chopKeeper}></Input></Form></td>
                <td> {table.contactPerson.map((person, i) =>
                    <div key={i}><Form style={{ display: "flex" }}><Input type="text" defaultValue={person}></Input><Button onClick={() => this.deleteContactPerson(index, i)} color="danger">Delete</Button></Form><br /></div>)}
                    <Button onClick={() => this.addContactPerson(index)} >Add New Contact Person</Button></td>
                <td><Form><Input type="text" defaultValue={table.location}></Input></Form></td>
                <td><Button onClick={() => this.deleteData(index)} color="danger">Delete</Button></td>
            </tr>)
        const QA = this.state.QA.map((qnsAns, index) =>
            <div key={index}>
                <div><b>Q:&nbsp;&nbsp;{qnsAns.question}</b></div>
                <div>A:&nbsp;&nbsp;{qnsAns.answer}</div>
                <br />
            </div>)
        const QaEditable = <div>{this.state.QA.map((qnsAns, index) =>
            <div key={index}>
                <Form>
                    <Label style={{ float: "left" }}><b>Question: {index + 1}</b></Label>
                    <img style={{ float: "right" }} onClick={() => this.deleteQA(index)} height="20px" width="20px" src={deleteIcon} />
                    <Input type="textarea" defaultValue={qnsAns.question}></Input>
                    <Label><b>Answer</b></Label>
                    <Input type="textarea" defaultValue={qnsAns.answer}></Input>
                </Form>
                <br />
            </div>)}<Button onClick={this.addQA}>Add New Question and Answer</Button></div>
        const Edit = <img onClick={this.makeEditable} width="20px" src={editIcon} />
        const Apply = <Button color="success" onClick={this.makeEditable}>APPLY</Button>
        return (
            <div className="animated fadeIn">
                <h2 >Help</h2>
                <Card>
                    <CardBody>
                        <div style={{ float: "left", marginTop: "5px", paddingRight: "10px" }} ><b>Chop Keeper Information</b></div>
                        <div style={{ float: "left" }}>
                            {this.state.editable ? (<Button onClick={this.addData}> Add New Data</Button>) : ""}

                        </div>
                        <div style={{ float: "right" }}>
                            {!this.state.editable ? Edit : Apply}
                        </div>
                        <br /><br />
                        <Table bordered >
                            <thead>
                                <tr>
                                    {chopKeepersColumnHeaders}
                                    {!this.state.editable ? null : <th></th>}
                                </tr>
                            </thead>
                            <tbody>
                                {!this.state.editable ? chopKeepers : chopKeepersEditable}
                            </tbody>
                        </Table>
                        <br />
                        {!this.state.editable ? QA : QaEditable}
                    </CardBody>
                </Card>
            </div>
        );
    }
}
export default Help;