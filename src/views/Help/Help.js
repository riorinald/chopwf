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
import config from '../../config'
import Authorize from '../../functions/Authorize'



class Help extends Component {
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
            existingQALength: 0,
            loading: false
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
        /*let qaArray = []
        for (let i = 0; i < 50; i++) {
            let isError = false
            let obj = {}
            await Axios.get(`${config.url}/helps/chop/question${i}`)
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
        console.log(qaArray)
        this.setState({ QA: qaArray, existingQALength: qaArray.length })*/
    }

    /*async getChopKeeper() {
        let chopKeeperArray = []
        for (let i = 0; i < 50; i++) {
            let isError = false
            let obj = {}
            await Axios.get(`${config.url}/helps/chop/chopKeeper${i}`)
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
        console.log(chopKeeperArray)
    }*/

    getChopKeeper() {

        let chopKeeperArray = []
        let qaArray = []
        for (let i = 0; i < 1; i++) {
            let isError = false
            let obj = {}
            Axios.get(`${config.url}/helps/chop`, { headers: { Pragma: 'no-cache' } })
                .then(res => {
                    for (let i = 0; i < res.data.length; i++) {
                        //alert(1)
                        if (res.data[i]['sectionId'].includes("chopKeeper")) {
                            let obj = {}
                            let arr = res.data[i]['sectionData'].split(';')
                            obj.chopType = arr[0].split(',')
                            obj.chopKeeper = arr[1]
                            obj.sectionId =  res.data[i]['sectionId']
                            obj.contactPerson = arr[2].split(',')
                            obj.location = arr[3]
                            isError = false
                            chopKeeperArray.push(obj)
                        }
                        if (res.data[i]['sectionId'].includes("question")) {
                            let obj = {}
                             isError = false
                            let arr = res.data[i]['sectionData'].split(',')
                            obj.sectionId =  res.data[i]['sectionId']
                            obj.question = arr[0]
                            obj.answer = arr[1]
                            qaArray.push(obj)
                        }
                    }
                    /*let arr = res.data.sectionData.split(';')
                    obj.chopType = arr[0].split(',')
                    obj.chopKeeper = arr[1]
                    obj.contactPerson = arr[2].split(',')
                    obj.location = arr[3]
                    isError = false*/
                    // console.log(obj)
                    this.setState({ QA: qaArray, existingQALength: qaArray.length })
                    this.setState({ existingCKLength: chopKeeperArray.length })
                    this.setState(state => {
                        let { chopKeepers } = this.state
                        chopKeepers.table = chopKeeperArray
                        return chopKeepers
                    })
                })
                .catch(error => {
                    isError = true
                });
            if (isError)
                break;
            //chopKeeperArray.push(obj)
        }
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
        await Axios.get(`${config.url}/helps/chop`, { headers: { Pragma: 'no-cache' } }).then(res => {
            console.log(res.data)
        })
        // this.setState({ chopKeepers: response.data.chopKeepers, QA: response.data.QA })
    }

    addNewChopKeeperDetails(details, index, name) {
        let postData = new FormData()
        postData.append('sectionData', details)
        postData.append('sectionId', `${name}${index}`)
        Axios.post(`${config.url}/helps/chop/${Authorize.getCookies().userId}`, postData)
            .then(result => {
                console.log(`ADDED ${name}`)
            })
            .catch(error => {
                // console.log(error)
            })
    }

    updateChopKeeperDetails(details, index, name) {
        let postData = new FormData()
        postData.append('sectionData', details)
        Axios.put(`${config.url}/helps/chop/${index}/${Authorize.getCookies().userId}`, postData)
            .then(result => {
                console.log(`UPDATED ${name}`)
            })
            .catch(error => {
                // console.log(error)
            })
    }

    async deleteChopKeeper(index, name) {
        await Axios.delete(`${config.url}/helps/chop/${index}`)
            .then(result => {
               this.getChopKeeper();
            })
            .catch(error => {
                console.error(error)
            })
    }

    makeEditable() {
        if (this.state.editable) {
            let chopKeepers = this.state.chopKeepers.table
            let qa = this.state.QA
            let i = 0
            let p = 0
            this.setState({ loading: true })
            for (i = 0; i < chopKeepers.length; i++) {
                let array = []
                let chopTypes = chopKeepers[i].chopType.join(',')
                let contactPersons = chopKeepers[i].contactPerson.join(',')
                array.push(chopTypes)
                array.push(chopKeepers[i].chopKeeper)
                array.push(contactPersons)
                array.push(chopKeepers[i].location)
                let finalString = array.join(';')
                // console.log(finalString)
                if (chopKeepers[i].sectionId) {
                //if (i < this.state.existingCKLength) {
                    this.updateChopKeeperDetails(finalString, chopKeepers[i].sectionId, "chopKeeper")
                    // console.log("Chop keeper details updated")
                }
                else {
                    this.addNewChopKeeperDetails(finalString, Math.floor(Date.now() / 1000)+i, "chopKeeper")
                    // console.log("Chop keeper details added")
                }
            }
            for (p = 0; p < qa.length; p++) {
                let array = []
                array.push(qa[p].question)
                array.push(qa[p].answer)
                let qaString = array.join(',')
                // console.log(qaString)
                if (qa[p].sectionId) {
                //if (p < this.state.existingQALength) {
                    // console.log("QA Updated")
                    this.updateChopKeeperDetails(qaString, qa[p].sectionId, "question")
                }
                else {
                    // console.log("New QA Added")
                    this.addNewChopKeeperDetails(qaString, Math.floor(Date.now() / 1000)+p, "question")
                }

            }
            console.log(i, p)
            console.log(chopKeepers.length, qa.length)
            if (i === chopKeepers.length && p === qa.length) {
                this.setState({ loading: false })
            }
            // window.location.reload()
            //codes to update instructions to the database
            this.setState({
                QA: []
            })
            this.setState({
                chopKeepers: {
                    columnHeader: ["Company", "License Admin", "Contact Person", "Location"],
                    table: []
                }
            })
            this.getChopKeeper();
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
        //alert()
        let chopKeepersCopy = JSON.parse(JSON.stringify(this.state.chopKeepers))
        let sectionId = chopKeepersCopy.table[index].sectionId;
        chopKeepersCopy.table.splice(index, 1)
        this.setState({
            chopKeepers: {
                columnHeader: ["Company", "License Admin", "Contact Person", "Location"],
                table: []
            }
        })
        this.deleteChopKeeper(sectionId, "chopKeeper")
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
        let sectionId = QaCopy[index].sectionId;
        QaCopy.splice(index, 1)
        this.setState({
            QA: []
        })
        this.deleteChopKeeper(sectionId, "question")
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
                        <Form style={{ display: "flex" }}><Input type="text" maxLength={1000} onChange={this.handleChopKeeper("chopType", i, index)} placeholder="Please enter the chop type" defaultValue={type}></Input><Button onClick={() => this.deleteChopType(index, i)} color="danger">Delete</Button></Form><br />
                    </div>
                )}
                    <Button onClick={() => this.addChopType(index)} >Add New Chop Type</Button>
                </td>
                <td><Form><Input type="text" maxLength={1000} placeholder="Please enter the chop keeper" onChange={this.handleChange("chopKeeper", index)} defaultValue={table.chopKeeper}></Input></Form></td>
                <td> {table.contactPerson.map((person, i) =>
                    <div key={i}><Form style={{ display: "flex" }}><Input type="text" maxLength={1000} onChange={this.handleChopKeeper("contactPerson", i, index)} placeholder="Please enter the name of the contact person" defaultValue={person}></Input><Button onClick={() => this.deleteContactPerson(index, i)} color="danger">Delete</Button></Form><br /></div>)}
                    <Button onClick={() => this.addContactPerson(index)} >Add New Contact Person</Button></td>
                <td><Form><Input type="text" maxLength={1000} placeholder="Please add the location" onChange={this.handleChange("location", index)} defaultValue={table.location}></Input></Form></td>
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
                    <Input type="textarea" maxLength={1999} onChange={this.handleQAChange("question", index)} placeholder="Please enter your question." defaultValue={qnsAns.question}></Input>
                    <Label><b>Answer</b></Label>
                    <Input type="textarea" maxLength={1999} onChange={this.handleQAChange("answer", index)} placeholder="Please enter your answer." defaultValue={qnsAns.answer}></Input>
                </Form>
                <br />
            </div>)}<Button onClick={this.addQA}>Add New Question and Answer</Button></div>
        const Edit = <img onClick={this.makeEditable} width="20px" src={editIcon} />
        const Apply = <Button color="success" onClick={this.makeEditable}>APPLY</Button>
        return (
            <div>
                {this.state.loading
                    ? ""
                    : <div className="animated fadeIn">
                        <h4 >Help</h4>
                        <Card>
                            <CardBody>
                                <div style={{ float: "left", marginTop: "5px", paddingRight: "10px" }} ><b>Chop Keeper Information</b></div>
                                <div style={{ float: "left" }}>
                                    {this.state.editable ? (<Button onClick={this.addData}> Add New Data</Button>) : ""}

                                </div>


                                {localStorage.getItem('viewAdminChop') === "true"
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
                    </div>}
            </div>

        );
    }
}
export default Help;