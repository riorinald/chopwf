import React, { Component } from 'react';
import {
    Card, CardHeader, CardBody, CardFooter, Button,
    Row, Col, FormGroup, Label, CustomInput, InputGroup, Form,
    Collapse, Input, InputGroupAddon
} from 'reactstrap'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Axios from 'axios';
import config from '../../../config';
import Papa from 'papaparse';
import { format } from 'date-fns';
import "react-table/react-table.css"
import ReactTable from "react-table";
import Authorize from '../../../functions/Authorize' 
import Swal from 'sweetalert2';
import XLSX from 'xlsx'

class LicenseAdmin extends Component {
    constructor(props) {
        super(props)
        this.state = {
            exportFromDateView: "",
            exportToDateView: "",
            exportFromProfileDateView: "",
            exportToProfileDateView: "",
            collapse: 1,
            exportDate: {
                exportLogsFrom: "",
                exportLogsTo: "",
                exportProfileFrom: "",
                exportProfileTo: ""
            },
            inputLabel:"Choose File",
            csvFile: null,
            newLicenseAdmins: [{}],
            updateLicenseAdmins: [],
            headers: [],
            updateAdmins: false
        }
        this.toggleAccordion = this.toggleAccordion.bind(this)
        this.saveAllData = this.saveAllData.bind(this)
        this.getLicenseCSV = this.getLicenseCSV.bind(this)
    }

    getLicenseCSV() {
        Axios.get(`${config.url}/licenses/licensemanagement?companyId=${localStorage.getItem('legalEntity')}`, { headers: { Pragma: 'no-cache' } })
            .then(res => {
                //console.log(res.data)
                this.setState({ newLicenseAdmins: res.data.licenseManagementDisplayResponses, headers: res.data.headers })
            })
    }

    componentDidMount() {
        const legalEntity = this.props.legalName
        const adminEntity = Authorize.getCookies().licenseAdminCompanyIds
        const isAdmin = Authorize.check(legalEntity, adminEntity)
            if (isAdmin) {
                this.setState({ isAdmin: isAdmin })
        }
        this.getLicenseCSV()
    }

    handleFiles = (event) => {
        
        // Check for the various File API support.
        let files = event.target.files[0];
        
        if (files !== undefined){ // avoid error when no document selected
            let extension = files.name.split('.').pop()
            this.setState({ csvFile: files })
            // Axios.post(`${config.url}/licenses/licensemanagement?createdBy=${}`)
        
            if (window.FileReader) { // FileReader are supported.
            
                if (extension === "xlsx" | "xls" ){
                    this.getAsArrayBuffer(files)
                }
                else if (extension === "csv"){
                    this.getAsText(files);
                }
                else {
                    Swal.fire({
                        title: "Error reading file",
                        text: "Please attach valid file format.",
                        type: "warning",
                        timer: 3500,
                        timerProgressBar: true
                    })
                }
            }
            else{
                console.log("FileReader API not exist in browser")
            }
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

    getAsArrayBuffer(fileToRead){
        var reader = new FileReader();

        reader.readAsArrayBuffer(fileToRead);
        reader.onload = this.getXLSXtoCSV;
        reader.onerror = this.errorHandler;
    }


    getXLSXtoCSV = (file) => {
        if (file) {

            let arraybuffer = file.target.result;
            // console.log(file.currentTarget.result)
            let data = new Uint8Array(arraybuffer);

            let arr = []
            for(let i = 0; i !== data.length; ++i) arr[i] = String.fromCharCode(data[i]);
            let bstr = arr.join("");

            /* Call XLSX */
            let workbook = XLSX.read(bstr, {type:"binary"});

            /* DO SOMETHING WITH workbook HERE */
            let first_sheet_name = workbook.SheetNames[0];
            console.log(first_sheet_name)

            /* Get worksheet as JSON */
            let worksheet = workbook.Sheets[first_sheet_name];
            let CSV = XLSX.utils.sheet_to_csv(worksheet,{raw:true})
            // console.log(XLSX.utils.sheet_to_json(worksheet,{skipHeader:true}));

            let result = Papa.parse(CSV, { skipEmptyLines: 'greedy', })
            let header = result.data.shift()
            let validCSV = false
            
            header.forEach((value,index) => {
                let defaultHeader = this.state.headers[index] !== undefined ? this.state.headers[index].toUpperCase() : console.log("error no default header")
                validCSV = value.toUpperCase() === defaultHeader
            });
            
            if(validCSV){
                this.setState({
                    newLicenseAdmins: result.data,
                    updateLicenseAdmins: result.data,
                    inputLabel: this.state.csvFile.name,
                    updateAdmins: true
                })
            }
            else{
                Swal.fire({
                    title: "Excel file is not valid",
                    text: "Please attach valid excel file.",
                    type: "warning",
                    timer: 1500,
                    timerProgressBar: true
                })
                this.setState({
                    inputLabel: "Choose File",
                    updateAdmins: false,
                    csvFile: null
                })
            }
          }
          else {
            alert("No File detected! :( ")
          }
    }

    fileReadingFinished = (event) => {
        let csv = event.target.result;
        let result = Papa.parse(csv, { skipEmptyLines: 'greedy', })
        let header = result.data.shift()
        // let joined = this.state.newLicenseAdmins.concat(result.data)
        let validCSV = false
        //console.log(result)
        header.forEach((value,index) => {
            let defaultHeader = this.state.headers[index] !== undefined ? this.state.headers[index].toUpperCase() : console.log("error no default header")
                validCSV = value.toUpperCase() === defaultHeader
        });
        if(validCSV){
            this.setState({
                newLicenseAdmins: result.data,
                updateLicenseAdmins: result.data,
                inputLabel: this.state.csvFile.name,
                updateAdmins: true
            })
        }
        else{
            Swal.fire({
                title: "CSV file is not valid",
                text: "Please attach valid CSV file.",
                type: "warning",
                timer: 1500,
                timerProgressBar: true
            })
            this.setState({
                inputLabel: "Choose File",
                updateAdmins: false,
                csvFile: null
            })
        }
    }

    errorHandler(event) {
        if (event.target.error.name === "NotReadableError") {
            alert("Cannot read file!");
        }
    }

    dateChange = (name, view) => date => {
        let dates = ""
        if (date) {
            let tempDate = format(date, "yyyy-MM-dd").split('T')[0];//right
            dates = tempDate.replace(/-/g, "")
        }
        //console.log(name, dates)
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
        if (from !== "" && to !== "") {
            let url = `${config.url}/licenses?userId=${Authorize.getCookies().userId}&category=${category}&companyId=${localStorage.getItem('legalEntity')}&startDate=${from}&endDate=${to}`
            window.open(url, "_blank")
        }
        else {
            Swal.fire({
                type: "info",
                title: "Select from and to date",
                text: "Please select from and to date."
            })
        }
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
        let content = JSON.stringify(this.state.updateLicenseAdmins)
        let postData = new FormData()
        if ( csvFile === null){
            Swal.fire({
                title: "Please Attach a file",
                type: "warning",
                timer: 1500,
                timerProgressBar: true
            })
        }
        else {
            postData.append('csvcontent', content )
            // postData.append('Documents[0].Attachment.Name', csvFile.name)
            Axios.post(`${config.url}/licenses/licensemanagement?createdBy=${Authorize.getCookies().userId}&companyId=${localStorage.getItem('legalEntity')}`, postData)
                .then(res => {
                    //console.log(res)
                    Swal.fire({
                        title: "Updated",
                        type: "success",
                        timer: 1500,
                        timerProgressBar: true
                    })
                    this.setState({
                        inputLabel: "Choose File",
                        updateAdmins: false,
                        csvFile: null
                    })
                    this.getLicenseCSV()
                })
                .catch(err => {
                    Swal.fire({
                        title: "Error",
                        type: "error : "+ err,
                    })
                    console.log(err)
                })
        }
    }

    render() {

        const { isAdmin, exportFromDateView, newLicenseAdmins, exportToDateView, exportFromProfileDateView, exportToProfileDateView, collapse, inputLabel } = this.state
        if (!isAdmin){
            return (<Card><CardBody><h4>Not Authorized</h4></CardBody></Card>)
        }
        
        const getYear = date => {
            return date.getFullYear()
        }

        const year = (new Date()).getFullYear();
        const years = Array.from(new Array(2), (val, index) => index + year);
        const months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ];
        const getMonth = date => {
            let month = date.getMonth()
            return months[month]
        }

        return (
            <div>
                <h4>License Admin</h4>
                <Card>
                    <CardHeader>Administration</CardHeader>
                    <CardBody>
                        <Row>
                            <Col>
                                {/* <Card className="mb-4">
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
                                </Card> */}
                                <Card className="mb-4">
                                    <CardHeader>
                                        <Button block color="link" className="text-left m-0 p-0" onClick={() => this.toggleAccordion(1)}>
                                            <h5 className="m-0 p-0">Export Options</h5>
                                        </Button>
                                    </CardHeader>
                                    <Collapse isOpen={collapse === 1}>
                                        <CardBody>
                                            <h5><b>Export Logs</b></h5>
                                            <Row>
                                                <Col sm="3" >
                                                    <Label>From:</Label>&nbsp;
                                                    <FormGroup>
                                                        <DatePicker placeholderText="YYYY/MM/DD" popperPlacement="auto-center" showPopperArrow={false} todayButton="Today"
                                                            className="form-control" required dateFormat="yyyy/MM/dd"
                                                            renderCustomHeader={({
                                                                date,
                                                                changeYear,
                                                                changeMonth,
                                                                decreaseMonth,
                                                                increaseMonth,
                                                                prevMonthButtonDisabled,
                                                                nextMonthButtonDisabled
                                                            }) => (
                                                                    <div
                                                                        style={{
                                                                            margin: 10,
                                                                            display: "flex",
                                                                            justifyContent: "center"
                                                                        }}
                                                                    >
                                                                        <Button onClick={decreaseMonth} disabled={prevMonthButtonDisabled} >{`<`}</Button>
                                                                        <Input
                                                                            value={getYear(date)}
                                                                            onChange={({ target: { value } }) => changeYear(value)}
                                                                            type="select">
                                                                            {years.map(option => (
                                                                                <option key={option} value={option}>
                                                                                    {option}
                                                                                </option>
                                                                            ))}
                                                                        </Input>
                                                                        <Input value={getMonth(date)} onChange={({ target: { value } }) =>
                                                                            changeMonth(months.indexOf(value))
                                                                        } type="select">
                                                                            {months.map((option) => (
                                                                                <option key={option} value={option}>
                                                                                    {option}
                                                                                </option>
                                                                            ))}
                                                                        </Input>
                                                                        <Button onClick={increaseMonth} disabled={nextMonthButtonDisabled} >{`>`}</Button>

                                                                    </div>
                                                                )}
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
                                                            renderCustomHeader={({
                                                                date,
                                                                changeYear,
                                                                changeMonth,
                                                                decreaseMonth,
                                                                increaseMonth,
                                                                prevMonthButtonDisabled,
                                                                nextMonthButtonDisabled
                                                            }) => (
                                                                    <div
                                                                        style={{
                                                                            margin: 10,
                                                                            display: "flex",
                                                                            justifyContent: "center"
                                                                        }}
                                                                    >
                                                                        <Button onClick={decreaseMonth} disabled={prevMonthButtonDisabled} >{`<`}</Button>
                                                                        <Input
                                                                            value={getYear(date)}
                                                                            onChange={({ target: { value } }) => changeYear(value)}
                                                                            type="select">
                                                                            {years.map(option => (
                                                                                <option key={option} value={option}>
                                                                                    {option}
                                                                                </option>
                                                                            ))}
                                                                        </Input>
                                                                        <Input value={getMonth(date)} onChange={({ target: { value } }) =>
                                                                            changeMonth(months.indexOf(value))
                                                                        } type="select">
                                                                            {months.map((option) => (
                                                                                <option key={option} value={option}>
                                                                                    {option}
                                                                                </option>
                                                                            ))}
                                                                        </Input>
                                                                        <Button onClick={increaseMonth} disabled={nextMonthButtonDisabled} >{`>`}</Button>

                                                                    </div>
                                                                )}
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
                                                    <h5><b>Export Profile</b></h5>
                                                    <Row>
                                                        <Col sm="3" >
                                                            <Label>From:</Label> &nbsp;
                                                            <FormGroup>
                                                                <DatePicker placeholderText="YYYY/MM/DD" popperPlacement="auto-center" showPopperArrow={false} todayButton="Today"
                                                                    className="form-control" required dateFormat="yyyy/MM/dd"
                                                                    renderCustomHeader={({
                                                                        date,
                                                                        changeYear,
                                                                        changeMonth,
                                                                        decreaseMonth,
                                                                        increaseMonth,
                                                                        prevMonthButtonDisabled,
                                                                        nextMonthButtonDisabled
                                                                    }) => (
                                                                            <div
                                                                                style={{
                                                                                    margin: 10,
                                                                                    display: "flex",
                                                                                    justifyContent: "center"
                                                                                }}
                                                                            >
                                                                                <Button onClick={decreaseMonth} disabled={prevMonthButtonDisabled} >{`<`}</Button>
                                                                                <Input
                                                                                    value={getYear(date)}
                                                                                    onChange={({ target: { value } }) => changeYear(value)}
                                                                                    type="select">
                                                                                    {years.map(option => (
                                                                                        <option key={option} value={option}>
                                                                                            {option}
                                                                                        </option>
                                                                                    ))}
                                                                                </Input>
                                                                                <Input value={getMonth(date)} onChange={({ target: { value } }) =>
                                                                                    changeMonth(months.indexOf(value))
                                                                                } type="select">
                                                                                    {months.map((option) => (
                                                                                        <option key={option} value={option}>
                                                                                            {option}
                                                                                        </option>
                                                                                    ))}
                                                                                </Input>
                                                                                <Button onClick={increaseMonth} disabled={nextMonthButtonDisabled} >{`>`}</Button>

                                                                            </div>
                                                                        )}
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
                                                                    renderCustomHeader={({
                                                                        date,
                                                                        changeYear,
                                                                        changeMonth,
                                                                        decreaseMonth,
                                                                        increaseMonth,
                                                                        prevMonthButtonDisabled,
                                                                        nextMonthButtonDisabled
                                                                    }) => (
                                                                            <div
                                                                                style={{
                                                                                    margin: 10,
                                                                                    display: "flex",
                                                                                    justifyContent: "center"
                                                                                }}
                                                                            >
                                                                                <Button onClick={decreaseMonth} disabled={prevMonthButtonDisabled} >{`<`}</Button>
                                                                                <Input
                                                                                    value={getYear(date)}
                                                                                    onChange={({ target: { value } }) => changeYear(value)}
                                                                                    type="select">
                                                                                    {years.map(option => (
                                                                                        <option key={option} value={option}>
                                                                                            {option}
                                                                                        </option>
                                                                                    ))}
                                                                                </Input>
                                                                                <Input value={getMonth(date)} onChange={({ target: { value } }) =>
                                                                                    changeMonth(months.indexOf(value))
                                                                                } type="select">
                                                                                    {months.map((option) => (
                                                                                        <option key={option} value={option}>
                                                                                            {option}
                                                                                        </option>
                                                                                    ))}
                                                                                </Input>
                                                                                <Button onClick={increaseMonth} disabled={nextMonthButtonDisabled} >{`>`}</Button>

                                                                            </div>
                                                                        )}
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
                                        <Button block color="link" className="text-left m-0 p-0" onClick={() => { this.toggleAccordion(2); this.getLicenseCSV() }}>
                                            <h5 className="m-0 p-0">Registration for Long-term License Management in Dealership </h5>
                                        </Button>
                                    </CardHeader>
                                    <Collapse isOpen={collapse === 2}>
                                        <CardBody>
                                            <Row>
                                                <Col>
                                                    <FormGroup>
                                                        {/* <Label>License Admins</Label> */}
                                                        <InputGroup>
                                                            <CustomInput id="uploadCSV" accept=".xls, .xlsx" type="file" label={inputLabel} bsSize="lg" onChange={this.handleFiles} color="primary"></CustomInput>
                                                            <InputGroupAddon addonType="append">
                                                            <   Button color="success" onClick={this.saveAllData} >Save</Button>
                                                            </InputGroupAddon>
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
                                                                        Header: () => (
                                                                            <div
                                                                              style={{
                                                                                textAlign:"left",
                                                                                fontWeight: "bold"
                                                                              }}
                                                                            >{this.state.headers[index]}</div>),
                                                                        accessor: key,
                                                                        style: { textAlign: "left"},
                                                                        width: this.getColumnWidth(key, key)
                                                                    }
                                                                })}
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
                    </CardFooter>
                </Card>

            </div>
        )
    }

}
export default LicenseAdmin