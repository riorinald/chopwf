import React, { Component } from 'react';
import editIcon from "../../../assets/img/edit.png";
import deleteIcon from "../../../assets/img/delete.png";
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
import config from '../../../config'
import Authorize from '../../../functions/Authorize'



class LicenseHelp extends Component {
    constructor(props) {
        super(props)
        this.state = {
            chopKeepers: {
                columnHeader: ["Chop Type", "Chop Keeper", "Contact Person", "Location"],
                table: []
            },
            QA: [],
            editable: false,
            dropdownOpen: false,
            existingCKLength: 0,
            existingQALength: 0
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

    componentDidMount() {
        // this.getData();
        this.getQA()
        this.getChopKeeper();
    }

    async getQA() {
        let qaArray = []
        for (let i = 0; i < 50; i++) {
            let isError = false
            let obj = {}
            await Axios.get(`${config.url}/helps/license/question${i}`)
                .then(res => {
                    isError = false
                    let arr = res.data.sectionData.split(',')
                    obj.question = arr[0]
                    obj.answer = arr[1]
                })
                .catch(error => {
                    isError = true
                });
            if (isError)
                break;

            qaArray.push(obj)
        }
        this.setState({ QA: qaArray, existingQALength: qaArray.length })
    }

    async getChopKeeper() {
        let chopKeeperArray = []
        for (let i = 0; i < 50; i++) {
            let isError = false
            let obj = {}
            await Axios.get(`${config.url}/helps/license/chopKeeper${i}`)
                .then(res => {
                    let arr = res.data.sectionData.split(';')
                    obj.chopType = arr[0].split(',')
                    obj.chopKeeper = arr[1]
                    obj.contactPerson = arr[2].split(',')
                    obj.location = arr[3]
                    isError = false
                    // console.log(obj)
                })
                .catch(error => {
                    isError = true
                });
            if (isError)
                break;
            chopKeeperArray.push(obj)
        }
        this.setState({ existingCKLength: chopKeeperArray.length })
        this.setState(state => {
            let { chopKeepers } = this.state
            chopKeepers.table = chopKeeperArray
            return chopKeepers
        })
    }



    handleQAChange = (name, mainIndex) => event => {
        let value = event.target.value
        this.setState(state => {
            let { QA } = this.state
            QA[mainIndex][name] = value
            return QA
        })
    }

    handleChange = (name, mainIndex) => event => {
        let value = event.target.value
        this.setState(state => {
            let { chopKeepers } = this.state
            chopKeepers.table[mainIndex][name] = value
            return chopKeepers
        })
    }


    handleChopKeeper = (name, firstIndex, mainIndex) => event => {
        let value = event.target.value
        // console.log(name, firstIndex, mainIndex)
        this.setState(state => {
            let { chopKeepers } = this.state
            chopKeepers.table[mainIndex][name][firstIndex] = value
            return chopKeepers
        })


    }

    async getData() {
        await Axios.get(`${config.url}/helps/license`).then(res => {
            // console.log(res.data)
        })
        // this.setState({ chopKeepers: response.data.chopKeepers, QA: response.data.QA })
    }

    async addNewChopKeeperDetails(details, index, name) {
        let postData = new FormData()
        postData.append('sectionData', details)
        postData.append('sectionId', `${name}${index}`)
        await Axios.post(`${config.url}/helps/license/${Authorize.getCookies().userId}`, postData)
            .then(result => {
                console.log(result.data)
            })
            .catch(error => {
                console.log(error)
            })
    }

    async updateChopKeeperDetails(details, index, name) {
        let postData = new FormData()
        postData.append('sectionData', details)
        await Axios.put(`${config.url}/helps/license/${name}${index}/${Authorize.getCookies().userId}`, postData)
            .then(result => {
                console.log(result.data)
            })
            .catch(error => {
                console.log(error)
            })
    }

    async deleteChopKeeper(index, name) {
        await Axios.delete(`${config.url}/helps/license/${name}${index}/${Authorize.getCookies().userId}}`)
            .then(result => {
                console.log(result.data)
            })
            .catch(error => {
                console.log(error)
            })
    }

    makeEditable() {
        if (this.state.editable) {
            let chopKeepers = this.state.chopKeepers.table
            let qa = this.state.QA
            for (let i = 0; i < chopKeepers.length; i++) {
                let array = []
                let chopTypes = chopKeepers[i].chopType.join(',')
                let contactPersons = chopKeepers[i].contactPerson.join(',')
                array.push(chopTypes)
                array.push(chopKeepers[i].chopKeeper)
                array.push(contactPersons)
                array.push(chopKeepers[i].location)
                let finalString = array.join(';')
                console.log(finalString)
                if (i < this.state.existingCKLength) {
                    this.updateChopKeeperDetails(finalString, i, "chopKeeper")
                    // console.log("Chop keeper details updated")
                }
                else {
                    this.addNewChopKeeperDetails(finalString, i, "chopKeeper")
                    // console.log("Chop keeper details added")
                }
            }
            for (let i = 0; i < qa.length; i++) {
                let array = []
                array.push(qa[i].question)
                array.push(qa[i].answer)
                let qaString = array.join(',')
                // console.log(qaString)
                if (i < this.state.existingQALength) {
                    // console.log("QA Updated")
                    this.updateChopKeeperDetails(qaString, i, "question")
                }
                else {
                    // console.log("New QA Added")
                    this.addNewChopKeeperDetails(qaString, i, "question")
                }

            }
            // window.location.reload()
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
        const obj = { 'chopType': [""], 'chopKeeper': "", 'contactPerson': [""], 'location': "" }

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
        this.deleteChopKeeper(index, "chopKeeper")
    }

    addQA() {
        let QaCopy = JSON.parse(JSON.stringify(this.state.QA))
        const obj = { 'question': "", 'answer': "" }
        QaCopy.push(obj)
        // console.log(QaCopy)
        this.setState({
            QA: QaCopy
        })
    }

    deleteQA(index) {
        // console.log(index)
        // let QaCopy = JSON.parse(JSON.stringify(this.state.QA))
        const QaCopy = this.state.QA.slice()
        QaCopy.splice(index, 1)
        this.setState({
            QA: QaCopy
        })
        this.deleteChopKeeper(index, "question")
    }

    addChopType(index) {

        let chopKeepersCopy = JSON.parse(JSON.stringify(this.state.chopKeepers))
        // console.log(chopKeepersCopy.table)
        chopKeepersCopy.table[index].chopType.push("")
        this.setState({
            chopKeepers: chopKeepersCopy
        })
    }

    addContactPerson(index) {
        let chopKeepersCopy = JSON.parse(JSON.stringify(this.state.chopKeepers))
        // console.log(chopKeepersCopy.table)
        chopKeepersCopy.table[index].contactPerson.push("")
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
                        <Form style={{ display: "flex" }}><Input type="text" onChange={this.handleChopKeeper("chopType", i, index)} placeholder="Please enter the chop type" defaultValue={type}></Input><Button onClick={() => this.deleteChopType(index, i)} color="danger">Delete</Button></Form><br />
                    </div>
                )}
                    <Button onClick={() => this.addChopType(index)} >Add New Chop Type</Button>
                </td>
                <td><Form><Input type="text" placeholder="Please enter the chop keeper" onChange={this.handleChange("chopKeeper", index)} defaultValue={table.chopKeeper}></Input></Form></td>
                <td> {table.contactPerson.map((person, i) =>
                    <div key={i}><Form style={{ display: "flex" }}><Input type="text" onChange={this.handleChopKeeper("contactPerson", i, index)} placeholder="Please enter the name of the contact person" defaultValue={person}></Input><Button onClick={() => this.deleteContactPerson(index, i)} color="danger">Delete</Button></Form><br /></div>)}
                    <Button onClick={() => this.addContactPerson(index)} >Add New Contact Person</Button></td>
                <td><Form><Input type="text" placeholder="Please add the location" onChange={this.handleChange("location", index)} defaultValue={table.location}></Input></Form></td>
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
                    <Input type="textarea" onChange={this.handleQAChange("question", index)} placeholder="Please enter your question." defaultValue={qnsAns.question}></Input>
                    <Label><b>Answer</b></Label>
                    <Input type="textarea" onChange={this.handleQAChange("answer", index)} placeholder="Please enter your answer." defaultValue={qnsAns.answer}></Input>
                </Form>
                <br />
            </div>)}<Button onClick={this.addQA}>Add New Question and Answer</Button></div>
        const Edit = <img onClick={this.makeEditable} width="20px" src={editIcon} />
        const Apply = <Button color="success" onClick={this.makeEditable}>APPLY</Button>
        return (
            <div className="animated fadeIn">
                <h4 >Help</h4>
                <Card>
                    <CardBody>
                        <div style={{ float: "left", marginTop: "5px", paddingRight: "10px" }} ><b>Chop Keeper Information</b></div>
                        <div style={{ float: "left" }}>
                            {this.state.editable ? (<Button onClick={this.addData}> Add New Data</Button>) : ""}

                        </div>


                        {localStorage.getItem('viewAdminLicense') === "true"
                            ? <div style={{ float: "right" }}>
                                {!this.state.editable ? Edit : Apply}
                            </div>
                            : null
                        }
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
export default LicenseHelp;