import React, { Component } from 'react';
import {
    Card, CardHeader, CardBody, CardFooter, Button,
    Row, Col, FormGroup, Label, CustomInput, InputGroup, Form,
    Collapse
} from 'reactstrap'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import theme from './theme.css'
import Axios from 'axios';
import config from '../../../config';
import Papa from 'papaparse';
import "react-table/react-table.css"
import ReactTable from "react-table";
import Swal from 'sweetalert2';



class LicenseAdmin extends Component {
    constructor(props) {
        super(props)
        this.state = {
            exportFromDateView: "",
            exportToDateView: "",
            exportFromProfileDateView: "",
            exportToProfileDateView: "",
            collapse: 3,
            exportDate: {
                exportLogsFrom: "",
                exportLogsTo: "",
                exportProfileFrom: "",
                exportProfileTo: ""
            },
            csvFile: null,
            newLicenseAdmins: [
                {}
            ],
            updateAdmins: false
        }
        this.toggleAccordion = this.toggleAccordion.bind(this)
        this.saveAllData = this.saveAllData.bind(this)
    }

    componentDidMount() {
        this.getLicenseCSV()
    }

    getLicenseCSV() {
        Axios.get(`${config.url}/licenses/licensemanagement`)
            .then(res => {
                this.setState({ newLicenseAdmins: res.data })
            })
    }

    handleFiles = (event) => {
        // Check for the various File API support.
        let files = event.target.files[0];
        this.setState({ csvFile: files })
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
        console.log(result.data)
        this.setState({ newLicenseAdmins: result.data, updateAdmins: true })
    }

    errorHandler(event) {
        if (event.target.error.name === "NotReadableError") {
            alert("Cannot read file!");
        }
    }

    dateChange = (name, view) => date => {

        let month = date.getMonth()

        let dates = ""
        if (date) {
            dates = `${date.getFullYear()}${month !== 10 && month !== 11 ? 0 : ""}${date.getMonth() + 1}${date.getDate()}`
        }
        console.log(name, dates)
        this.setState({ [view]: date, validDate: true });
        this.setState(state => {
            let exportDate = this.state.exportDate
            exportDate[name] = dates
            return { exportDate }
        })
    };



    exportLogs(category) {
        let from = category === "licenseLogs" ? this.state.exportDate.exportLogsFrom : this.state.exportDate.exportProfileFrom
        let to = category === "licenseLogs" ? this.state.exportDate.exportLogsTo : this.state.exportDate.exportProfileTo
        let url = `${config.url}/licenses?userId=${localStorage.getItem("userId")}&category=${category}&startDate=${from}&endDate=${to}`
        window.open(url, "_blank")
    }

    toggleAccordion(tab) {
        let newTab = tab === this.state.collapse ? 0 : tab
        this.setState({ collapse: newTab })
    }

    getColumnWidth = (accessor, headerText) => {
        let { newLicenseAdmins } = this.state
        let max = 0
        const maxWidth = 260;
        const magicSpacing = 10;

        for (var i = 0; i < newLicenseAdmins.length; i++) {
            if (newLicenseAdmins[i] !== undefined && newLicenseAdmins[i][accessor] !== null) {
                if (JSON.stringify(newLicenseAdmins[i][accessor] || 'null').length > max) {
                    max = JSON.stringify(newLicenseAdmins[i][accessor] || 'null').length;
                }
            }
        }

        return Math.min(maxWidth, Math.max(max, headerText.length) * magicSpacing);
    }

    saveAllData() {
        let { csvFile } = this.state
        let postData = new FormData()
        postData.append('Documents[0].Attachment.File', csvFile)
        postData.append('Documents[0].Attachment.Nam', csvFile.name)
        Axios.post(`${config.url}/licenses/licensemanagement?createdBy=${localStorage.getItem('userId')}`, postData)
            .then(res => {
                Swal.fire({
                    title: "Updated",
                    type: "success",
                    timer: 1500,
                    timerProgressBar: true
                })
                this.getLicenseCSV()
            })
            .catch(err => {
                Swal.fire({
                    title: "Error",
                    type: "error",
                    timer: 1500,
                    timerProgressBar: true
                })
                console.log(err)
            })
    }

    render() {

        const { exportFromDateView, newLicenseAdmins, exportToDateView, exportFromProfileDateView, exportToProfileDateView, collapse } = this.state

        return (
            <div>
                <h4>License Admin</h4>
                <Card>
                    <CardHeader>Administration</CardHeader>
                    <CardBody>
                        <Row>
                            <Col>
                                <Card className="mb-4">
                                    <CardHeader>
                                        <Button block color="link" className="text-left m-0 p-0" onClick={() => this.toggleAccordion(3)}>
                                            <h5 className="m-0 p-0">Update Departments </h5>
                                        </Button>
                                    </CardHeader>
                                    <Collapse isOpen={collapse === 3}>
                                        <CardBody>
                                            <Row>
                                                <Col>

                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Collapse>
                                </Card>
                                <Card className="mb-4">
                                    <CardHeader>
                                        <Button block color="link" className="text-left m-0 p-0" onClick={() => this.toggleAccordion(4)}>
                                            <h5 className="m-0 p-0">Update License Names </h5>
                                        </Button>
                                    </CardHeader>
                                    <Collapse isOpen={collapse === 4}>
                                        <CardBody>
                                            <Row>
                                                <Col>

                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Collapse>
                                </Card>
                                <Card className="mb-4">
                                    <CardHeader>
                                        <Button block color="link" className="text-left m-0 p-0" onClick={() => this.toggleAccordion(1)}>
                                            <h5 className="m-0 p-0">Export Options</h5>
                                        </Button>
                                    </CardHeader>
                                    <Collapse isOpen={collapse === 1}>
                                        <CardBody>
                                            <Label>Export Logs</Label>
                                            <Row>
                                                <Col sm="3" >
                                                    <Label>From:</Label>&nbsp;
                                                    <FormGroup>
                                                        <DatePicker placeholderText="YYYY/MM/DD" popperPlacement="auto-center" showPopperArrow={false} todayButton="Today"
                                                            className="form-control" required dateFormat="yyyy/MM/dd"
                                                            selected={exportFromDateView}
                                                            onChange={this.dateChange("exportLogsFrom", "exportFromDateView")}

                                                            showMonthDropdown
                                                            showYearDropdown
                                                            selectsStart
                                                            startDate={exportFromDateView}
                                                            endDate={exportToDateView}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col>
                                                    <Label>To:</Label>&nbsp;
                                            <FormGroup>
                                                        <DatePicker placeholderText="YYYY/MM/DD" popperPlacement="auto-center" showPopperArrow={false} todayButton="Today"
                                                            className="form-control" required dateFormat="yyyy/MM/dd"

                                                            showMonthDropdown
                                                            showYearDropdown
                                                            selected={exportToDateView}
                                                            onChange={this.dateChange("exportLogsTo", "exportToDateView")}
                                                            selectsEnd
                                                            endDate={exportToDateView}
                                                            minDate={exportFromDateView}
                                                            startDate={exportFromDateView}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                {/* </Row> */}
                                                {/* <Row> */}
                                                <Col>
                                                    <Button className="float-right" onClick={() => this.exportLogs("licenseLogs")} color="primary" >Export Logs</Button>
                                                </Col>
                                            </Row>
                                            <hr></hr>
                                            <Row>
                                                <Col>
                                                    <Label>Export Profile</Label>
                                                    <Row>
                                                        <Col sm="3" >
                                                            <Label>From:</Label> &nbsp;
                                            <FormGroup>
                                                                <DatePicker placeholderText="YYYY/MM/DD" popperPlacement="auto-center" showPopperArrow={false} todayButton="Today"
                                                                    className="form-control" required dateFormat="yyyy/MM/dd"
                                                                    selected={exportFromProfileDateView}
                                                                    onChange={this.dateChange("exportProfileFrom", "exportFromProfileDateView")}
                                                                    showMonthDropdown
                                                                    showYearDropdown
                                                                    selectsStart
                                                                    startDate={exportFromProfileDateView}
                                                                    endDate={exportToProfileDateView}
                                                                />
                                                            </FormGroup>
                                                        </Col>
                                                        <Col>
                                                            <Label>To:</Label>&nbsp;
                                            <FormGroup>
                                                                <DatePicker placeholderText="YYYY/MM/DD" popperPlacement="auto-center" showPopperArrow={false} todayButton="Today"
                                                                    className="form-control" required dateFormat="yyyy/MM/dd"

                                                                    showMonthDropdown
                                                                    showYearDropdown
                                                                    selected={exportToProfileDateView}
                                                                    onChange={this.dateChange("exportProfileTo", "exportToProfileDateView")}
                                                                    selectsEnd
                                                                    endDate={exportToProfileDateView}
                                                                    minDate={exportFromProfileDateView}
                                                                    startDate={exportFromProfileDateView}
                                                                />
                                                            </FormGroup>

                                                        </Col>
                                                        <Col>
                                                            <Button className="float-right" onClick={() => this.exportLogs("profileLogs")} color="primary" >Export Profile</Button>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>

                                        </CardBody>
                                    </Collapse>
                                </Card>
                                <Card className="mb-4">
                                    <CardHeader>
                                        <Button block color="link" className="text-left m-0 p-0" onClick={() => this.toggleAccordion(2)}>
                                            <h5 className="m-0 p-0">Update License Admins </h5>
                                        </Button>
                                    </CardHeader>
                                    <Collapse isOpen={collapse === 2}>
                                        <CardBody>
                                            <Row>
                                                <Col>
                                                    <FormGroup>
                                                        <Label>License Admins</Label>
                                                        <InputGroup>
                                                            <CustomInput id="uploadCSV" accept=".CSV" type="file" bsSize="lg" onChange={this.handleFiles} color="primary" />
                                                        </InputGroup>
                                                    </FormGroup>

                                                    <Collapse isOpen={newLicenseAdmins.length !== 0}>
                                                        <FormGroup>
                                                            <ReactTable
                                                                data={newLicenseAdmins}
                                                                defaultPageSize={10}
                                                                className="-striped -highlight"
                                                                columns={Object.keys(newLicenseAdmins[0]).map((key, index) => {
                                                                    return {
                                                                        Header: key,
                                                                        accessor: key,
                                                                        style: { textAlign: "left" },
                                                                        width: this.getColumnWidth(key, key)
                                                                    }
                                                                })}

                                                            // {[
                                                            //     {
                                                            //         Header: 'Demo',
                                                            //         accessor: 'policyID',
                                                            //         style: { textAlign: "left" }
                                                            //     }
                                                            // ]}
                                                            />
                                                        </FormGroup>
                                                    </Collapse>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Collapse>
                                </Card>

                            </Col>
                        </Row>
                    </CardBody>
                    <CardFooter>
                        <Button color="success" onClick={this.saveAllData} >Save</Button>
                    </CardFooter>
                </Card>

            </div>
        )
    }

}
export default LicenseAdmin