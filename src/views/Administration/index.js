import React, { Component } from 'react';
import swal from 'sweetalert2';
import Axios from 'axios';
import {
    Col, Row, CustomInput,
    Input, Button, InputGroup,
    FormGroup, Label, Collapse,
    Table, Badge,
    Modal, ModalBody, ModalFooter,
    Card, CardHeader, CardBody, CardFooter
} from 'reactstrap';
import ReactTable from "react-table";
import "react-table/react-table.css"
import selectTableHOC from "react-table/lib/hoc/selectTable";
import qs from 'qs'
import PropTypes from 'prop-types';
import Papa from 'papaparse';
import Authorize from '../../functions/Authorize'
import config from '../../config'

const SelectTable = selectTableHOC(ReactTable);

class Administration extends Component {
    constructor(props) {
        super(props)
        this.state = {
            notes: [],
            label: '',
            branch: [],
            newBranch: [],
            updateBranch: false,
            filteredData: [],
            editable: false,
            showModal: false,
            accordion: [true, false, false, false],
            tempFileURL: "",
            isAdmin: false
        }
        this.addNotes = this.addNotes.bind(this);
        this.deleteNotes = this.deleteNotes.bind(this);
    }

    static defaultProps = {
        keyField: "id"
    };

    static propTypes = {
        keyField: PropTypes.string
    }

    componentDidMount() {
        const legalEntity = this.props.legalName
        const adminEntity = Authorize.getCookies().chopKeeperCompanyIds

        const isAdmin = Authorize.check(legalEntity, adminEntity)
        // const isAdmin = Authorize.check(this.props.legalName, Authorize.getCookies().chopKeeperCompanyIds)
        
            if (isAdmin) {
                this.setState({ isAdmin: isAdmin })
                this.getData();
                this.getBranch();
        }
    }

    getData() {
        Axios.get(`${config.url}/notes/0`, { headers: { Pragma: 'no-cache' } })
            .then(res => {
                let tempNotes = res.data.noteContent.split('%')
                for (let i = 0; i < tempNotes.length; i++) {
                    let obj = {
                        chinese: tempNotes[i].split('#')[0],
                        english: tempNotes[i].split('#')[1]
                    }
                    this.setState({
                        notes: this.state.notes.concat(obj)
                    })
                }
            })
    }

    getBranch() {
        Axios.get(`http://5b7aa3bb6b74010014ddb4f6.mockapi.io/config/4`)
            .then(res => {
                this.setState({
                    branch: res.data.branchList
                })
            })
    }

    handleChange = (index, name) => event => {
        let value = event.target.value
        this.setState(state => {
            let { notes } = this.state
            notes[index][name] = value
            return notes
        })
    }

    toggleModal = () => {
        this.setState({ showModal: !this.state.showModal, newBranch: [] })
    }

    toggleEdit = () => {
        this.setState({ editable: !this.state.editable })
    }

    addNotes() {
        let obj = { chinese: "", english: "" }
        this.setState({ notes: this.state.notes.concat(obj) })
    }
    deleteNotes(index) {
        let notes = this.state.notes.filter((key, i) => i !== index)
        this.setState({ notes: notes })
    }

    putNotes = () => {
        let postData = new FormData()
        let tempArray = []
        this.state.notes.map(note => {
            let str = note.chinese + '#' + note.english
            tempArray.push(str)
        })
        let notes = tempArray.join('%')
        postData.append('noteContent', notes)
        Axios.put(`${config.url}/notes/0`, postData)
            .then((res) => {
                // console.log(res)
                swal.fire({
                    title: "Updated",
                    timer: 1500,
                    type: 'success',
                    timerProgressBar: true
                })
            })
            .catch((err) => {
                // console.log(err)
            })

        this.setState({ editable: !this.state.editable })
    }

    putBranch = () => {
        let xhr = new XMLHttpRequest();
        let inData = { branchList: JSON.stringify(this.state.newBranch) }
        let data = qs.stringify(inData)
        // encodeURIComponent(JSON.stringify(inData))
        // console.log(inData, data)

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                // console.log(this.responseText);
            }
        });

        xhr.open("PUT", "http://5b7aa3bb6b74010014ddb4f6.mockapi.io/config/4");
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("Accept", "*/*");
        // xhr.send(data);
        swal.fire({
            title: "Updated",
            timer: 1500,
            type: 'success',
            timerProgressBar: true
        })
        this.setState({ updateBranch: false, toggleModal: false })
    }

    toggleAccordion(tab) {
        const prevState = this.state.accordion;
        const state = prevState.map((x, index) => tab === index ? !x : false);
        this.setState({
            accordion: state,
        })
    }

    handleFiles = (event) => {
        // Check for the various File API support.
        let files = event.target.files[0];

        if (window.FileReader) {
            // FileReader are supported.
            this.getAsText(files);
        }
    }

    getAsText(fileToRead) {
        var reader = new FileReader();
        // Read file into memory as UTF-8      
        reader.readAsText(fileToRead);
        // Handle errors load
        reader.onload = this.fileReadingFinished;
        reader.onerror = this.errorHandler;
    }

    fileReadingFinished = (event) => {
        var csv = event.target.result;
        var result = Papa.parse(csv, { header: true, skipEmptyLines: true, })
        // console.log(result.data)
        this.setState({ newBranch: result.data, updateBranch: true })
    }

    errorHandler(event) {
        if (event.target.error.name === "NotReadableError") {
            alert("Cannot read file!");
        }
    }

    defaultFilterMethod = (filter, row, column) => {
        const id = filter.pivotId || filter.id;
        return row[id] !== undefined ? row[id].department === filter.value : true;
    };


    //convert Base64 String to Form File - to view and download  - ONLY ON EDIT REQUEST AND TASK DETAILS PAGE
    dataURLtoFile(dataurl, filename) {

        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    }


    //Convert to Base64 String  - ONLY ON CREATE AND EDIT REQUEST PAGE
    getBase64(file, callback) {
        let reader = new FileReader();
        reader.onload = function () {
            callback(reader.result)  //data:typelbase64, 43d4d23=

            //Use to return just the base64 string without MIMI type
            // var b64 = reader.result.replace(/^data:.+;base64,/, '')   //87576ef7365r73d=

        };
        reader.readAsDataURL(file)
    }

    //To be used inside handle File function to call the methods



    render() {

        const { notes } = this.state

        if (!this.state.isAdmin)
            return (<Card><CardBody><h4>Not Authorized</h4></CardBody></Card>)

        return (
            <Card>
                <CardHeader>
                    <h3>Administration</h3>
                </CardHeader>
                <CardBody>

                    <Card className="mb-4">
                        <CardHeader>
                            <Button block color="link" className="text-left m-0 p-0" onClick={() => this.toggleAccordion(0)}>
                                <h5 className="m-0 p-0">Change Notes</h5>
                            </Button>
                        </CardHeader>
                        <Collapse isOpen={this.state.accordion[0]} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
                            <CardBody className="px-0 py-3">
                                <Col className="mb-4">
                                    <Label>Notes :</Label>
                                    {notes.map((note, index) => (
                                        <Row key={index} >
                                            <Col>
                                                <InputGroup>
                                                    <Input disabled={!this.state.editable} value={note.chinese} onChange={this.handleChange(index, "chinese")} placeholder="Enter Notes in Chinese" type="textarea" rows="5" />&nbsp;&nbsp;
                                                    <Input disabled={!this.state.editable} value={note.english} onChange={this.handleChange(index, "english")} placeholder="Enter Notes in English" type="textarea" rows="5" />
                                                    {this.state.editable
                                                        ? <Button color="secondary" onClick={() => this.deleteNotes(index)}>Delete</Button>
                                                        : null}
                                                </InputGroup>
                                                <br />
                                            </Col>
                                        </Row>
                                    ))}
                                </Col>
                                <Col className="text-right">
                                    {this.state.editable
                                        ? <>
                                            <Button color="primary" onClick={this.addNotes}  >Add</Button>
                                            <Button color="success" onClick={this.putNotes}> Update </Button>
                                        </>
                                        : <Button color="info" onClick={this.toggleEdit}> Edit </Button>
                                    }
                                </Col>
                            </CardBody>
                        </Collapse>
                    </Card>
                    <Card className="mb-4">
                        <CardHeader>
                            <Button block color="link" className="text-left m-0 p-0" onClick={() => this.toggleAccordion(2)}>
                                <h5 className="m-0 p-0">Branch Company Chop</h5>
                            </Button>
                        </CardHeader>
                        <Collapse isOpen={this.state.accordion[2]} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
                            <CardBody>
                                <Col className="text-right mb-2">
                                    <Button className="mr-2" onClick={this.toggleModal} color="warning"> Upload CSV </Button>
                                    {/* <Button className="mr-2" color="danger"> Delete </Button> */}
                                </Col>
                                <Col className="mb-4">
                                    <ReactTable
                                        // {...this.props}
                                        data={this.state.branch}
                                        filterable
                                        defaultPageSize={10}
                                        className="-striped -highlight"
                                        defaultFilterMethod={this.defaultFilterMethod}
                                        columns={[
                                            {
                                                Header: 'Branch Name',
                                                accessor: 'name',
                                                style: { textAlign: "left" },
                                                filterMethod: (filter, row) =>
                                                    row[filter.id].startsWith(filter.value) &&
                                                    row[filter.id].endsWith(filter.value)
                                            }
                                        ]}
                                    />
                                </Col>
                            </CardBody>
                        </Collapse>
                    </Card>
                    <Card className="mb-4">
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
                    <Card className="mb-4">
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
                    <Modal size="lg" scrollable toggle={this.toggleModal} isOpen={this.state.showModal}>
                        <ModalBody>
                            <Col lg className="mb-3">
                                <CustomInput className="mb-2" type='file' id="csvInput" accept=".CSV" onChange={this.handleFiles} />
                                <Collapse ><Button color="info" block> Upload </Button></Collapse>
                            </Col>
                            <Col lg>
                                <Table hover bordered striped responsive size="sm">
                                    <thead>
                                        <tr>
                                            <td>id</td>
                                            <td>name</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.newBranch.map((id) =>
                                            <tr key={id.id}>
                                                <td>{id.id}</td>
                                                <td>{id.name}</td>
                                            </tr>)}
                                    </tbody>
                                </Table>
                            </Col>
                        </ModalBody>
                        <ModalFooter>
                            <Collapse isOpen={this.state.newBranch[1] !== ''} ><Button onClick={this.putBranch} color="info" block> Upload </Button></Collapse>
                            <Collapse isOpen={true}><Button onClick={this.toggleModal} color="danger" block> Cancel </Button></Collapse>
                        </ModalFooter>
                    </Modal>
                </CardBody>
            </Card>
        )
    }
}

export default Administration;