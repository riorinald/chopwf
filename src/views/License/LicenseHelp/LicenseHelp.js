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


class LicenseHelp extends Component {
    constructor(props) {
        super(props)
        this.state = {
            chopKeepers: {
                columnHeader: ["Company", "License Admin", "Contact Person", "Location"],
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
        /*let qaArray = []
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
        this.setState({ QA: qaArray, existingQALength: qaArray.length })*/
    }

    getChopKeeper() {

        let chopKeeperArray = []
        let qaArray = []
        for (let i = 0; i < 1; i++) {
            let isError = false
            let obj = {}
            Axios.get(`${config.url}/helps/license`, { headers: { Pragma: 'no-cache' } })
                .then(res => {
                    for (let i = 0; i < res.data.length; i++) {
                        //alert(1)
                        if (res.data[i]['sectionId'].includes("chopKeeper")) {
                            let obj = {}
                            let arr = res.data[i]['sectionData'].split(';')
                            obj.chopType = arr[0].split(',')
                            obj.chopTypeSort = arr[0].trim().toLowerCase
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
                            let arr = res.data[i]['sectionData'].split('@@@')
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
                    console.log('Updated on 28 Feb');
                    //chopKeeperArray.sort(this.dynamicSort("chopTypeSort"));
                    chopKeeperArray.sort(function(a, b) { 
                        return a.chopTypeSort > b.chopTypeSort || -(a.chopTypeSort < b.chopTypeSort);
                    });

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


    dynamicSort(property) {
        var sortOrder = 1;
        if(property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }

        return function (a,b) {
            console.log(a,'9999999')

            if(sortOrder == -1){
                return b[property].localeCompare(a[property]);
            }else{
                return a[property].localeCompare(b[property]);
            }
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
        await Axios.get(`${config.url}/helps/license`, { headers: { Pragma: 'no-cache' } }).then(res => {
            console.log(res.data)
        })
        // this.setState({ chopKeepers: response.data.chopKeepers, QA: response.data.QA })
    }

    addNewChopKeeperDetails(details, index, name) {
        let postData = new FormData()
        postData.append('sectionData', details)
        postData.append('sectionId', `${name}${index}`)
        Axios.post(`${config.url}/helps/license/${localStorage.getItem('userId')}`, postData)
            .then(result => {
               // console.log(result.data)
            })
            .catch(error => {
                console.log(error)
            })
    }

    updateChopKeeperDetails(details, index, name) {
        let postData = new FormData()
        postData.append('sectionData', details)
        Axios.put(`${config.url}/helps/license/${index}/${localStorage.getItem('userId')}`, postData)
            .then(result => {
               // console.log(result.data)
            })
            .catch(error => {
                console.log(error)
            })
    }

    async deleteChopKeeper(index, name) {
        await Axios.delete(`${config.url}/helps/license/${index}`)
            .then(result => {
                this.getChopKeeper();
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
                chopKeepers[i].chopTypeSort = chopKeepers[i].chopType[0].trim().toLowerCase();
                array.push(chopTypes)
                array.push(chopKeepers[i].chopKeeper)
                array.push(contactPersons)
                array.push(chopKeepers[i].location)
                let finalString = array.join(';')
                console.log(finalString)
                if (chopKeepers[i].sectionId) {

                //if (i < this.state.existingCKLength) {
                    this.updateChopKeeperDetails(finalString, chopKeepers[i].sectionId, "chopKeeper")
                    // console.log("Chop keeper details updated")
                }
                else {
                    var secId = Math.floor(Date.now() / 1000)+i
                    this.addNewChopKeeperDetails(finalString, secId, "chopKeeper")
                    this.state.chopKeepers.table[i]['sectionId'] = 'chopKeeper'+secId;
                }
            }
            for (let i = 0; i < qa.length; i++) {
                let array = []
                array.push(qa[i].question)
                array.push(qa[i].answer)
                let qaString = array.join('@@@')
                // console.log(qaString)
                if (qa[i].sectionId) {
                    this.updateChopKeeperDetails(qaString, qa[i].sectionId, "question")
                }
                else {
                    // console.log("New QA Added")
                    var secId = Math.floor(Date.now() / 1000)+i
                    this.addNewChopKeeperDetails(qaString, secId, "question")
                    this.state.QA[i]['sectionId'] = 'question'+secId;
                }

            }
            chopKeepers.sort(function(a, b) { 
                return a.chopTypeSort > b.chopTypeSort || -(a.chopTypeSort < b.chopTypeSort);
            });
            //chopKeepers.sort(this.dynamicSort("chopTypeSort"));
            this.setState({
                chopKeepers: {
                    columnHeader: ["Company", "License Admin", "Contact Person", "Location"],
                    table: chopKeepers
                }
            })
            // window.location.reload()
            //codes to update instructions to the database
            /*this.setState({
                QA: []
            })
            this.setState({
                chopKeepers: {
                    columnHeader: ["Company", "License Admin", "Contact Person", "Location"],
                    table: []
                }
            })
            this.getChopKeeper();*/
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
        //alert()
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
                        <Form style={{ display: "flex" }}><Input maxLength={1000} type="text" onChange={this.handleChopKeeper("chopType", i, index)} placeholder="Please enter the chop type" defaultValue={type}></Input></Form><br />
                    </div>
                )}
                   
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
            <div className="animated fadeIn">
                <h4 >Help</h4>
                <Card>
                    <CardBody>
                        <div style={{ float: "left", marginTop: "5px", paddingRight: "10px" }} ><b>License Admin Information</b></div>
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