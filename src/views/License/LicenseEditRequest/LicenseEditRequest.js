import React, { Component } from 'react'
import Axios from 'axios'
import {
    Button,
    CustomInput,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Col,
    Collapse,
    Form,
    FormGroup,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Label,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Row,
    FormFeedback,
    Table,
    Tooltip,
    UncontrolledTooltip,
    Badge,
    Progress
} from 'reactstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { addDays } from 'date-fns';
import SimpleReactValidator from 'simple-react-validator';
import AsyncSelect from 'react-select/async';
import config from '../../../config'
import axios from 'axios'
import makeAnimated from 'react-select/animated';
import Swal from 'sweetalert2';
import Authorize from '../../../functions/Authorize'




const animatedComponents = makeAnimated();
const reactSelectControl = {
    control: styles => ({ ...styles, borderColor: '#F86C6B', boxShadow: '0 0 0 0px #F86C6B', ':hover': { ...styles[':hover'], borderColor: '#F86C6B' } }),
    menuPortal: base => ({ ...base, zIndex: 9999 })
}

class LicenseEditRequest extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            taskDetails: {},

            //get data from api
            licenseNames: [],
            seniorManagersList: [],
            departments: [],
            receivers: [],

            returnDateView: new Date(),

        }
        this.validator = new SimpleReactValidator({ autoForceUpdate: this, locale: 'en' });
        this.handleAgreeTerms = this.handleAgreeTerms.bind(this);
        this.goBack = this.goBack.bind(this)
        this.handleSelectOption = this.handleSelectOption.bind(this)
        this.handleSelectReciever = this.handleSelectReciever.bind(this)
        this.deleteTask = this.deleteTask.bind(this)
    }

    componentDidMount() {
        if (this.props.location.state === undefined) {
            this.goBack()
        }
        else {
            this.getLicenseNames();
            this.getSeniorManagers();
            this.getData('departments');
        }


        this.getTaskDetails(this.props.location.state.taskId)

    }
    async getLicenseNames() {
        const res = await axios.get(`${config.url}/licensenames?companyId=${this.props.legalName}`, { headers: { Pragma: 'no-cache' } })
        this.setState({ licenseNames: res.data })
    }

    async getData(name) {
        let res = await axios.get(`${config.url}/${name}`, { headers: { Pragma: 'no-cache' } })
        this.setState({ [name]: res.data })
    }

    async getSeniorManagers() {
        await axios.get(`${config.url}/users?category=normal&companyid=${this.props.legalName}&displayname=&userid=${Authorize.getCookies().userId}`,
            { headers: { Pragma: 'no-cache' } })
            .then(res => {
                let arr1 = []
                res.data.map(mgr => {
                    let obj = {
                        value: mgr.userId,
                        label: mgr.displayName
                    }
                    arr1.push(obj)
                })
                this.setState({ seniorManagersList: arr1 })
            })
        await axios.get(`${config.url}/users?category=normal&companyid=${this.props.legalName}`,
            { headers: { Pragma: 'no-cache' } })
            .then(res => {
                let arr1 = []
                res.data.map(mgr => {
                    let obj = {
                        value: mgr.userId,
                        label: mgr.displayName
                    }
                    arr1.push(obj)
                })
                this.setState({ receivers: arr1 })
            })
    }

    convertDateView(date) {
        if (date)
        //     === "" || date === "/") {
        //     return new Date()
        // }
        // else 
        {
            let regEx = date.replace(/(\d{4})(\d{2})(\d{2})/g, '$1/$2/$3')
            return new Date(regEx)
        }
    }

    convertApprovedDate(dateValue) {

        let regEx = dateValue.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\w{2})/g, '$1/$2/$3 $4:$5 $6')
        return regEx
    }


    async getTaskDetails(taskId) {
        this.setState({ loading: true })
        await Axios.get(`${config.url}/licenses/${taskId}?userId=${Authorize.getCookies().userId}`,
            { headers: { Pragma: 'no-cache' } })
            .then(res => {
                let temp = res.data
                if (temp.documentTypeId === "ORIGINAL") {
                    temp.needWatermark = ""
                }
                temp.plannedReturnDate = temp.plannedReturnDate === "/" ? null : temp.plannedReturnDate
                console.log(temp)
                this.setState({ taskDetails: temp, loading: false, returnDateView: this.convertDateView(res.data.plannedReturnDate) })
            })
    }

    handleChange = name => event => {
        let value = event.target.value
        let id = event.target.id
        var element = document.getElementById(id)
        if (id === "deliverWay1" || id === "deliverWay2") {
            document.getElementById('deliverWay1').className = "custom-control-input"
            document.getElementById('deliverWay2').className = "custom-control-input"
        }
        else if (id === "documentType1" || id === "documentType2") {
            document.getElementById('documentType1').className = "custom-control-input"
            document.getElementById('documentType2').className = "custom-control-input"
        }
        else {
            element.className = "form-control"
        }

        // if (name === "documentTypeId") {
        //     if (value === "ORIGINAL") {
        //         if (this.state.taskDetails.plannedReturnDate === "/") {
        //             this.setState(state => {
        //                 let taskDetails = this.state.taskDetails
        //                 taskDetails.plannedReturnDate = ""
        //                 return taskDetails
        //             })
        //         }
        //     }
        // }

        this.setState(state => {
            let taskDetails = this.state.taskDetails
            taskDetails[name] = value
            return taskDetails
        })
    }

    handleRadio = name => event => {
        let id = event.target.id

        let value = ""
        if (name === "needWatermark") {
            document.getElementById("watermark1").className = "custom-control-input"
            document.getElementById("watermark2").className = "custom-control-input"
            if (event.target.id === "inputWatermark1" || event.target.id === "inputWatermark2") {
                value = event.target.id === "inputWatermark1" ? "Y" : "N"
            }
            else if (event.target.id === "watermark1" || event.target.id === "watermark2") {
                value = event.target.id === "watermark1" ? "Y" : "N"
            }
        }
        else if (name === "purposeType") {
            document.getElementById("licensePurpose1").className = "custom-control-input"
            document.getElementById("licensePurpose2").className = "custom-control-input"
            document.getElementById("licensePurpose3").className = "custom-control-input"
            value = event.target.id === "purposeComment" ? "PS" : event.target.value
        }

        this.setState(state => {
            let taskDetails = this.state.taskDetails
            taskDetails[name] = value
            return taskDetails
        })
    }

    //convert Date
    dateChange = (name, view) => date => {
        let month = ""
        let tempDate = ""
        let dates = ""
        if (date) {
            month = date.getMonth()
            tempDate = date.getDate()
            dates = `${date.getFullYear()}${month !== 10 && month !== 11 ? 0 : ""}${date.getMonth() + 1}${tempDate.toLocaleString().length === 1 ? 0 : ""}${tempDate}`
        }
        this.setState({ [view]: date });
        this.setState(state => {
            let taskDetails = this.state.taskDetails
            taskDetails[name] = dates
            return taskDetails
        })
    };

    handleSelectOption(event) {
        // console.log(event)
        let value = event ? event : []
        console.log(value)
        var element = document.getElementById("seniorManagers")
        if (value.length !== 0) {
            element.className = "css-2b097c-container"
        }
        else {
            element.className = "notValid css-2b097c-container"
        }
        this.setState(state => {
            let taskDetails = this.state.taskDetails
            taskDetails.seniorManagers = value
            return taskDetails
        })

    }

    validate() {
        let data = this.state.taskDetails
        let keys = ["telephoneNum", "licenseNameId", "departmentId", "seniorManagers", "expDeliveryAddress", "expDeliveryReceiver",
            "expDeliveryMobileNo", "documentType1", "documentType2", "plannedReturnDate", "watermark1", "watermark2", "deliverWay1", "deliverWay2"
        ]

        if (data.purposeType === "PS") {
            keys = keys.filter(key => key !== "licensePurpose1" && key !== "licensePurpose2" && key !== "licensePurpose3")
            keys = keys.concat("purposeComment")
        }
        else {
            keys = keys.filter(key => key !== "purposeComment")
            keys = keys.concat("licensePurpose1", "licensePurpose2", "licensePurpose3")
        }

        // if (data.documentTypeId === "ORIGINAL") {
        //     keys = keys.concat("deliveryWay1")
        //     keys = keys.concat("deliveryWay2")
        // }
        // else {
        //     keys = keys.filter(key => key !== "deliveryWay1")
        //     keys = keys.filter(key => key !== "deliveryWay2")
        // }

        if (data.documentTypeId === "SCANCOPY") {
            // keys = keys.concat("watermark1")
            // keys = keys.concat("watermark2")
            if (data.needWatermark === "Y") {
                keys = keys.concat("inputWatermark1")
            }
            else {
                keys = keys.filter(key => key !== "inputWatermark1")
            }
            if (data.needWatermark === "N") {
                keys = keys.concat("inputWatermark2")
            }
            else {
                keys = keys.filter(key => key !== "inputWatermark2")
            }
        }
        else {
            keys = keys.filter(key => key !== "watermark1" || key !== "watermark2")
        }
        keys.map(key => {
            console.log(key)
            var element = document.getElementById(key)
            if (key === "deliverWay1" || key === "deliverWay2") {
                if (!data.deliverWayId) {
                    document.getElementById("deliverWay1").className = "is-invalid custom-control-input"
                    document.getElementById("deliverWay2").className = "is-invalid custom-control-input"
                }
            }
            else if (key === "licensePurpose1" || key === "licensePurpose2" || key === "licensePurpose3") {
                if (!data.purposeType) {
                    document.getElementById("licensePurpose1").className = "is-invalid custom-control-input"
                    document.getElementById("licensePurpose2").className = "is-invalid custom-control-input"
                    document.getElementById("licensePurpose3").className = "is-invalid custom-control-input"
                }
            }
            else if (key === "documentType1" || key === "documentType2") {
                if (!data.documentTypeId) {
                    document.getElementById("documentType1").className = "is-invalid custom-control-input"
                    document.getElementById("documentType2").className = "is-invalid custom-control-input"
                }
            }
            else if (key === "watermark1" || key === "watermark2" || key === "inputWatermark1" || key === "inputWatermark2") {
                if (!data.needWatermark) {
                    document.getElementById("watermark1").className = "is-invalid custom-control-input"
                    document.getElementById("watermark2").className = "is-invalid custom-control-input"
                }
                if (!data.watermark) {
                    document.getElementById("inputWatermark1").className = "is-invalid form-control"
                    document.getElementById("inputWatermark2").className = "is-invalid form-control"
                }
            }
            else if (key === "seniorManagers") {
                if (data.seniorManagers.length === 0) {
                    element.className = "notValid css-2b097c-container"
                }
                else {
                    element.className = "css-2b097c-container"
                }
            }
            else if (!data[key]) {
                if (element.className === "form-control" || element.className === "is-invalid form-control") {
                    element.className = "is-invalid form-control"
                }
                else if (element.className === "custom-control-input" || element.className === "is-invalid custom-control-input") {
                    element.className = "is-invalid custom-control-input"
                }
                else {
                    element.className = "notValid css-2b097c-container"
                }

            }
        })
    }

    getReciever(person) {
        let i = 0
        if (person !== "") {
            this.state.receivers.map((head, index) => {
                if (head.label === person) {
                    i = index
                }
            })
        }
        else {
            i = null
        }
        return i
    }


    // getOption(person) {
    //     let i = 0
    //     if (person !== "") {
    //         this.state.seniorManagersList.map((head, index) => {
    //             if (head.label === person) {
    //                 i = index
    //             }
    //         })
    //     }
    //     else {
    //         i = null
    //     }
    //     return i
    // }

    handleAgreeTerms() {
        let { taskDetails } = this.state
        this.validate()
        let valid = taskDetails.documentTypeId === "SCANCOPY" ? taskDetails.needWatermark !== "" ? taskDetails.watermark !== "" ? true : false : false : true
        if (this.validator.allValid() && valid) {
            console.log("All Valid")
            this.submitRequest("Y")
        }
        // if (this.validator.allValid()) {
        //     
        // }
        else {
            this.validator.showMessages()
            this.forceUpdate()
        }
    }

    submitRequest(isSubmitted) {
        let postReq = new FormData();
        postReq.append("UserId", Authorize.getCookies().userId);
        postReq.append("EmployeeNumber", this.state.taskDetails.employeeNum);
        postReq.append("TelephoneNumber", this.state.taskDetails.telephoneNum);
        postReq.append("CompanyId", this.props.legalName);
        postReq.append("DepartmentId", this.state.taskDetails.departmentId);
        postReq.append("LicenseNameId", this.state.taskDetails.licenseNameId);
        postReq.append("PurposeType", this.state.taskDetails.purposeType);
        postReq.append("PurposeComment", this.state.taskDetails.purposeComment);
        postReq.append("DocumentTypeId", this.state.taskDetails.documentTypeId);
        postReq.append("NeedWatermark", this.state.taskDetails.needWatermark === "" ? "N" : this.state.taskDetails.needWatermark);
        postReq.append("Watermark", this.state.taskDetails.watermark);
        postReq.append("PlannedReturnDate", this.state.taskDetails.plannedReturnDate);
        postReq.append("DeliverWayId", this.state.taskDetails.deliverWayId);
        postReq.append("isSubmitted", isSubmitted);
        // postReq.append("SeniorManager", this.state.taskDetails.seniorManager);
        // postReq.append("LicenseAdmin", this.state.taskDetails.licenseAdmins);
        postReq.append("isConfirm", this.state.taskDetails.isConfirm);
        postReq.append("ExpDeliveryAddress", this.state.taskDetails.expDeliveryAddress);
        postReq.append("ExpDeliveryReceiver", this.state.taskDetails.expDeliveryReceiver);
        postReq.append("ExpDeliveryMobileNo", this.state.taskDetails.expDeliveryMobileNo);

        for (let i = 0; i < this.state.taskDetails.seniorManagers.length; i++) {
            postReq.append(`SeniorManagers[${i}]`, this.state.taskDetails.seniorManagers[i].value);
        }

        for (var pair of postReq.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }

        this.postData(postReq, isSubmitted)
    }

    async postData(formData, isSubmitted) {
        Swal.fire({
            title: `Creating your Request ... `,
            type: "info",
            text: '',
            footer: '',
            allowOutsideClick: false,
            onClose: () => { this.goBack() },
            onBeforeOpen: () => {
                Swal.showLoading()
            },
            onOpen: () => {
                axios.put(`${config.url}/licenses/${this.state.taskDetails.licenseId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
                    .then(res => {

                        Swal.update({
                            title: res.data.status === 200 ? isSubmitted === "Y" ? 'Request Submitted' : "Request Saved" : "",
                            text: 'Request Number : ' + res.data.requestNum,
                            footer: isSubmitted === "Y" ? 'Your request is being processed and is waiting for the approval' : 'Your request is saved as draft.',
                            type: isSubmitted === "Y" ? "success" : "info",

                        })
                        Swal.hideLoading()
                    })
                    .catch(error => {
                        let err = "Please contact the IT Admin !"
                        let err2 = []
                        let err3 = ""
                        if (error.response.data) {
                            console.log(error.response)
                            let keys = Object.keys(error.response.data.errors)
                            err = keys.join(',')
                            keys.map(key => {
                                // console.log(error.response.data.errors[key].join(','))
                                err2.push(error.response.data.errors[key].join(','))
                            })
                            err3 = err2.join(';')
                        }
                        else if (error.response.message) {
                            err3 = error.response.message
                        }
                        Swal.hideLoading()
                        Swal.update({
                            title: "Error",
                            type: "error",
                            text: err,
                            html: err3,

                        })
                    })
            }
        })
        // await axios.put(`${config.url}/licenses/${this.state.taskDetails.licenseId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        //     .then(res => {
        //         if (isSubmitted === "Y") {
        //             Swal.fire({
        //                 title: res.data.status === 200 ? 'Request Submitted' : "",
        //                 text: 'Request Number : ' + res.data.requestNum,
        //                 footer: 'Your request is being processed and is waiting for the approval',
        //                 type: 'success',
        //                 onClose: () => { this.goBack() }
        //             })
        //         }
        //         else {
        //             Swal.fire({
        //                 title: res.data.status === 200 ? 'Request Saved' : '',
        //                 text: 'Request Number : ' + res.data.requestNum,
        //                 footer: 'Your request is saved as draft.',
        //                 type: 'info',
        //                 onClose: () => { this.goBack() }
        //             })
        //         }
        //     })
    }

    async deleteTask() {
        Swal.fire({
            title: `Deleting your Request ... `,
            type: "info",
            text: '',
            footer: '',
            allowOutsideClick: false,
            onClose: () => { this.goBack() },
            onBeforeOpen: () => {
                Swal.showLoading()
            },
            onOpen: () => {
                axios.delete(`${config.url}/licenses/${this.state.taskDetails.licenseId}`)
                    .then(res => {

                        Swal.update({
                            title: "Request Deleted",
                            text: `The request has been deleted.`,
                            type: "success",

                        })
                        Swal.hideLoading()
                    })
                    .catch(error => {
                        if (error.response) {
                            Swal.fire({
                                title: "ERROR",
                                html: error.response.data.message,
                                type: "error"
                            })
                        }
                    })
            }
        })
        // await axios.delete(`${config.url}/licenses/${this.state.taskDetails.licenseId}`).then(res => {
        //     Swal.fire({
        //         title: "REQUEST DELETED",
        //         html: res.data.message,
        //         type: "success",
        //         onClose: () => { this.goBack() }
        //     })
        // })
    }

    handleSelectReciever(event) {
        let value = event ? event.value : ""
        var element = document.getElementById("expDeliveryReceiver")
        if (value !== "") {
            element.className = "css-2b097c-container"
        }
        else {
            element.className = "notValid css-2b097c-container"
        }
        this.setState(state => {
            let taskDetails = this.state.taskDetails
            taskDetails.expDeliveryReceiver = value
            return taskDetails
        })
    }

    goBack() {
        this.props.history.push({
            pathname: `/license/${this.props.match.params.page}`
        })
    }

    render() {
        const { taskDetails, loading, licenseNames, returnDateView, departments, seniorManagersList, receivers } = this.state
        this.validator.purgeFields();

        const filterColors = (inputValue) => {
            return seniorManagersList.filter(i =>
                i.label.toLowerCase().includes(inputValue.toLowerCase())
            );
        };


        const loadOptions = (inputValue, callback) => {

            callback(filterColors(inputValue));
        }

        const filterReceiver = (inputValue) => {
            return receivers.filter(i =>
                i.label.toLowerCase().includes(inputValue.toLowerCase())
            );
        }

        const loadReciever = (inputValue, callback) => {
            callback(filterReceiver(inputValue));
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
                <h4>Edit Request</h4>
                {!loading
                    ? <Card className="animated fadeIn">
                        <CardHeader>
                            <Button className="mr-1" color="secondary" onClick={() => this.goBack()}><i className="fa fa-angle-left" /> Back </Button>
                            &nbsp;&nbsp; EDIT REQUEST - {taskDetails.requestNum}
                        </CardHeader>
                        <CardBody>
                            {taskDetails.currentStatusId === "SENDBACKED" || taskDetails.currentStatusId === "RECALLED"
                                ? <Row>
                                    <Col className="mb-4">
                                        <Progress multi>
                                            {taskDetails.allStages.map((stage, index) =>

                                                <React.Fragment key={index}>
                                                    <UncontrolledTooltip placement="top" target={"status" + index}>{stage.statusName}</UncontrolledTooltip>
                                                    <Progress
                                                        className={index !== taskDetails.allStages.lastIndex ? "mr-1" : ""}
                                                        bar
                                                        animated={stage.state === "CURRENT" ? true : false}
                                                        striped={stage.state !== "CURRENT"}
                                                        color=
                                                        {
                                                            taskDetails.currentStatusId === "SENDBACKED" ?
                                                                stage.state === "CURRENT" ?
                                                                    "danger" :
                                                                    stage.state === "FINISHED" ?
                                                                        "success" :
                                                                        "secondary" :
                                                                taskDetails.currentStatusId === "RECALLED" ?
                                                                    stage.state === "CURRENT" ?
                                                                        "primary" :
                                                                        stage.state === "FINISHED" ?
                                                                            "success" :
                                                                            "secondary" :
                                                                    stage.state === "CURRENT" ?
                                                                        "warning" :
                                                                        stage.state === "FINISHED" ?
                                                                            "success" :
                                                                            "secondary"
                                                        }
                                                        // color={stage.state === "CURRENT" ? "warning" : stage.state === "FINISHED" ? "success" : "secondary"}
                                                        value={100 / (taskDetails.allStages.length)}> <div id={"status" + index} style={{ color: stage.state === "FINISHED" || stage.state === "CURRENT" ? "white" : "black" }} >{stage.statusName}</div>
                                                    </Progress>
                                                </React.Fragment>

                                            )}
                                        </Progress>
                                    </Col>
                                </Row>
                                : null
                            }
                            <Form className="form-horizontal">
                                <FormGroup>
                                    <Label>Request Number</Label>
                                    <InputGroup>
                                        <Input disabled value={taskDetails.requestNum}></Input>
                                    </InputGroup>
                                </FormGroup>
                                <FormGroup>
                                    <Label>Telephone Number </Label>
                                    <InputGroup>
                                        <Input onChange={this.handleChange("telephoneNum")} value={taskDetails.telephoneNum} id="telephoneNum" size="16" type="text" autoComplete="off"/>
                                    </InputGroup>
                                </FormGroup>
                                <FormGroup>
                                    <Label>Department </Label>
                                    <InputGroup>
                                        <Input id="departmentId" onWheel={event => { event.preventDefault(); }} onChange={this.handleChange("departmentId")} value={taskDetails.departmentId} type="select" onWheel={event => { event.preventDefault(); }}>
                                            <option value="">Please selet a department</option>
                                            {departments.map((dept, index) =>
                                                <option key={index} value={dept.deptId} > {dept.deptName} </option>
                                            )}
                                        </Input>
                                    </InputGroup>
                                    <small style={{ color: '#F86C6B' }} >{this.validator.message('Department', taskDetails.departmentId, 'required')}</small>
                                </FormGroup>
                                <FormGroup>
                                    <Label>License Name </Label>
                                    <InputGroup>
                                        <Input id="licenseNameId" onWheel={event => { event.preventDefault(); }} onChange={this.handleChange("licenseNameId")} value={taskDetails.licenseNameId} type="select" onWheel={event => { event.preventDefault(); }}>
                                            <option value="" >Please select a License Name</option>
                                            {licenseNames.map((license, index) =>
                                                <option key={index} value={license.licenseNameId} > {license.name} </option>
                                            )}
                                        </Input>
                                    </InputGroup>
                                    <small style={{ color: '#F86C6B' }} >{this.validator.message('License Name', taskDetails.licenseNameId, 'required')}</small>
                                </FormGroup>

                                <FormGroup onChange={this.handleRadio("purposeType")} >
                                    <Label >Purpose</Label>
                                    <CustomInput type="radio" id="licensePurpose1" name="purposeType" defaultChecked={taskDetails.purposeType === "LVFP"} value="LVFP" label="城市备案 Local VRB Filling Purpose" />
                                    <CustomInput type="radio" id="licensePurpose2" name="purposeType" defaultChecked={taskDetails.purposeType === "MFP"} value="MFP" label="城抵押 Mortgage Filling Purpose" />
                                    <CustomInput type="radio" id="licensePurpose3" name="purposeType" defaultChecked={taskDetails.purposeType === "PS"} value="PS" label="其他 Please specify:">
                                        <Collapse isOpen={taskDetails.purposeType === "PS"}>
                                            <Input id="purposeComment" type="text" maxLength={500} onChange={this.handleChange("purposeComment")} value={taskDetails.purposeComment} autoComplete="off"/>
                                            {taskDetails.purposeType === "PS"
                                                ? <small style={{ color: '#F86C6B' }} >{this.validator.message('Specify Purpose', taskDetails.purposeComment, 'required')}</small>
                                                : null}
                                        </Collapse>
                                    </CustomInput>
                                    <small style={{ color: '#F86C6B' }} >{this.validator.message('Purpose of License', taskDetails.purposeType, 'required')}</small>
                                </FormGroup>

                                <FormGroup onChange={this.handleChange("documentTypeId")} >
                                    <Label>Select Document Type</Label>
                                    <CustomInput defaultChecked={taskDetails.documentTypeId === "SCANCOPY"} type="radio" id="documentType1" name="documentTypeId" value="SCANCOPY" label="电子版 Scan Copy" />
                                    <CustomInput defaultChecked={taskDetails.documentTypeId === "ORIGINAL"} type="radio" id="documentType2" name="documentTypeId" value="ORIGINAL" label="原件 Original Copy" />
                                    <small style={{ color: '#F86C6B' }} >{this.validator.message('Document Type', taskDetails.documentTypeId, 'required')}</small>
                                </FormGroup>


                                <Collapse isOpen={taskDetails.documentTypeId === "SCANCOPY"}>
                                    <FormGroup onChange={this.handleRadio("needWatermark")}>
                                        <Label>Watermark</Label> <small>(To fulfill Legal’ s requirements, the scan copy of Licenses should be watermarked.)</small>
                                        <CustomInput defaultChecked={taskDetails.needWatermark === "Y"} type="radio" id="watermark1" name="watermark" value="Y" about="watermark1" label="Yes. Please specify watermark here:">
                                            <Collapse isOpen={taskDetails.needWatermark === "Y"}>
                                                <Input id="inputWatermark1" type="text" maxLength={500} value={taskDetails.watermark} onChange={this.handleChange("watermark")} autoComplete="off"/>
                                                {taskDetails.documentTypeId === "SCANCOPY"
                                                    ? taskDetails.needWatermark === "Y"
                                                        ? <small style={{ color: '#F86C6B' }} > {this.validator.message('Watermark', taskDetails.watermark, 'required')}</small>
                                                        : null
                                                    : null
                                                }
                                            </Collapse>
                                        </CustomInput>
                                        <CustomInput defaultChecked={taskDetails.needWatermark === "N"} type="radio" id="watermark2" name="watermark" value="N" about="watermark2" label="No. Please specify the reason of not adding watermark:">
                                            <Collapse isOpen={taskDetails.needWatermark === "N"}>
                                                <Input id="inputWatermark2" type="text" maxLength={500} value={taskDetails.watermark} onChange={this.handleChange("watermark")} autoComplete="off"/>
                                                {taskDetails.documentTypeId === "SCANCOPY"
                                                    ? taskDetails.needWatermark === "N"
                                                        ? <small style={{ color: '#F86C6B' }} >{this.validator.message('Watermark', taskDetails.watermark, 'required')}</small>
                                                        : null
                                                    : null
                                                }
                                            </Collapse>
                                        </CustomInput>
                                        {taskDetails.documentTypeId === "SCANCOPY"
                                            ? <small style={{ color: '#F86C6B' }} >{this.validator.message('Watermark', taskDetails.needWatermark, 'required')}</small>
                                            : null}
                                    </FormGroup>
                                </Collapse>

                                <Collapse isOpen={taskDetails.documentTypeId === "ORIGINAL"}>
                                    <FormGroup>
                                        <Label>Planned Return Date:</Label>
                                        <DatePicker id="plannedReturnDate" placeholderText="YYYY/MM/DD" popperPlacement="auto-center" todayButton="Today"
                                            className="form-control" required dateFormat="yyyy/MM/dd" withPortal
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
                                            minDate={new Date()}
                                            isClearable
                                            maxDate={addDays(new Date(), 30)}
                                            selected={returnDateView}
                                            onChange={this.dateChange("plannedReturnDate", "returnDateView")} />
                                        {taskDetails.documentTypeId === "ORIGINAL"
                                            ? <small style={{ color: '#F86C6B' }} >{this.validator.message('Return Date', taskDetails.plannedReturnDate, 'required')}</small>
                                            : null}
                                    </FormGroup>



                                    <FormGroup onChange={this.handleChange("deliverWayId")} >
                                        <Label>Deliver Way</Label>
                                        <CustomInput type="radio" id="deliverWay1" defaultChecked={taskDetails.deliverWayId === "F2F"} name="deliverWayId" value="F2F" label="面对面 Face to face" />
                                        <CustomInput type="radio" id="deliverWay2" defaultChecked={taskDetails.deliverWayId === "EXPRESS"} name="deliverWayId" value="EXPRESS" label="快递 Express" />
                                        {taskDetails.documentTypeId === "ORIGINAL"
                                            ? <small style={{ color: '#F86C6B' }} >{this.validator.message('Delivery Way', taskDetails.deliverWayId, 'required')}</small>
                                            : null}
                                    </FormGroup>


                                    <Collapse isOpen={taskDetails.deliverWayId === "EXPRESS"}>
                                        <FormGroup>
                                            <Label>Address</Label>
                                            <Input maxLength="500" placeholder="Please specify Address" id="expDeliveryAddress" onChange={this.handleChange("expDeliveryAddress")} value={taskDetails.expDeliveryAddress} type="text" autoComplete="off"/>
                                            {taskDetails.documentTypeId === "ORIGINAL"
                                                ? taskDetails.deliverWayId === "EXPRESS"
                                                    ? <small style={{ color: '#F86C6B' }} >{this.validator.message('Address', taskDetails.expDeliveryAddress, 'required')}</small>
                                                    : null
                                                : null
                                            }
                                        </FormGroup>


                                        <FormGroup>
                                            <Label>Receiver</Label>
                                            <Input maxLength="500" type="text" id="expDeliveryReceiver" onChange={this.handleChange("expDeliveryReceiver")} placeholder="Please specify receiver" value={taskDetails.expDeliveryReceiver} autoComplete="off" />
                                            {taskDetails.documentTypeId === "ORIGINAL"
                                                ? taskDetails.deliverWayId === "EXPRESS"
                                                    ? <small style={{ color: '#F86C6B' }} >{this.validator.message('Reciever', taskDetails.expDeliveryReceiver, 'required')}</small>
                                                    : null
                                                : null
                                            }
                                        </FormGroup>

                                        <FormGroup>
                                            <Label>Reciever Mobile Phone</Label>
                                            {/* <input type="number" id="phoneNumber"></input> */}
                                            <Input maxLength="500" placeholder={`Please specify Reciever's phone`} id="expDeliveryMobileNo" value={taskDetails.expDeliveryMobileNo} onChange={this.handleChange("expDeliveryMobileNo")} type="text" autoComplete="off"/>
                                            {taskDetails.documentTypeId === "ORIGINAL"
                                                ? taskDetails.deliverWayId === "EXPRESS"
                                                    ? <small style={{ color: '#F86C6B' }} >{this.validator.message(`Reciever's Phone`, taskDetails.expDeliveryMobileNo, 'required')}</small>
                                                    : null
                                                : null
                                            }
                                        </FormGroup>
                                    </Collapse>
                                </Collapse>
                                <FormGroup>
                                    <Label>Senior Manager or above of requestor department</Label>
                                    <AsyncSelect
                                        id="seniorManagers"
                                        loadOptions={loadOptions}
                                        isMulti
                                        value={taskDetails.seniorManagers}
                                        // onBlur={this.checkDepartment}
                                        onChange={this.handleSelectOption}
                                        menuPortalTarget={document.body}
                                        components={animatedComponents}
                                        styles={taskDetails.seniorManagers === null ? reactSelectControl : ""} />
                                    <small style={{ color: '#F86C6B' }} >{this.validator.message('Senior Manager', taskDetails.seniorManagers, 'required')}</small>
                                </FormGroup>

                            </Form>
                        </CardBody>
                        <CardFooter>
                            <div className="form-actions">
                                <Row>
                                    <Col className="d-flex justify-content-start">
                                        {/* {taskDetails.isConfirm === "Y"
                                            ?  */}
                                        <Button type="submit" color="success" onClick={() => { this.handleAgreeTerms() }}>Submit</Button>
                                        {/* : <Button type="submit" color="success" */}
                                        {/* // onMouseEnter={() => this.setState({ tooltipOpen: !this.state.tooltipOpen })} */}
                                        {/* id="disabledSubmit" disabled >Submit</Button>} */}
                                        {/* <Tooltip placement="left" isOpen={this.state.tooltipOpen} target="disabledSubmit"> */}
                                        {/* please confirm the agree terms </Tooltip> */}
                                        <span>&nbsp;</span>
                                        <Button type="submit" color="primary" onClick={() => { this.submitRequest('N') }}>Save</Button>
                                    </Col>
                                    <Col className="d-flex justify-content-end">
                                        <Button onClick={this.deleteTask} color="danger" >Delete</Button>
                                    </Col>
                                </Row>
                                {taskDetails.histories ? <hr></hr> : null}
                                <Row>
                                    <Col>
                                        {taskDetails.histories ?
                                            taskDetails.histories.length !== 0
                                                ? <>
                                                    <Row>
                                                        <Col><h4>Approval Histories</h4></Col>
                                                    </Row>
                                                    {taskDetails.histories.map((history, index) =>
                                                        <div key={index}>
                                                            <hr></hr>
                                                            <Row className="text-md-left text-center">
                                                                <Col sm md="10" lg>
                                                                    <h5>{history.approvedByName}<span> <Badge color={history.stateIndicatorColor.toLowerCase()}>{history.stateIndicator}</Badge></span></h5>
                                                                    <h6><Badge className="mb-1" color="light">{this.convertApprovedDate(history.approvedDate)}</Badge></h6>
                                                                    <Col className="p-0"> <p>{history.comments}</p> </Col>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    )}
                                                </>
                                                : null
                                            : null}

                                    </Col>
                                </Row>


                            </div>
                        </CardFooter>
                    </Card>
                    : null
                }
            </div>
        )
    }
}

export default LicenseEditRequest
