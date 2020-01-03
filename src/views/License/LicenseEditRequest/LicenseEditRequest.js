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
} from 'reactstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import SimpleReactValidator from 'simple-react-validator';
import AsyncSelect from 'react-select/async';
import config from '../../../config'
import axios from 'axios'
import makeAnimated from 'react-select/animated';
import Swal from 'sweetalert2';



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
        const res = await axios.get(`${config.url}/licensenames?companyId=${this.props.legalName}`)
        this.setState({ licenseNames: res.data })
    }

    async getData(name) {
        let res = await axios.get(`${config.url}/${name}`)
        this.setState({ [name]: res.data })
    }

    async getSeniorManagers() {
        await axios.get(`${config.url}/users?category=normal&companyid=${this.props.legalName}&displayname=&userid=${localStorage.getItem("userId")}`)
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
    }

    convertDateView(date) {
        if (date === "" || date === "/") {
            return new Date()
        }
        else {
            let regEx = date.replace(/(\d{4})(\d{2})(\d{2})/g, '$1/$2/$3')
            return new Date(regEx)
        }
    }

    async getTaskDetails(taskId) {
        this.setState({ loading: true })
        await Axios.get(`${config.url}/licenses/${taskId}?userId=${localStorage.getItem('userId')}`)
            .then(res => {
                let temp = res.data
                if (temp.documentTypeId === "ORIGINAL") {
                    temp.needWatermark = ""
                }
                this.setState({ taskDetails: temp, loading: false, returnDateView: this.convertDateView(res.data.plannedReturnDate) })
            })
    }

    handleChange = name => event => {
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
        let value = event.target.value
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
        let month = date.getMonth()

        let dates = ""
        if (date) {
            dates = `${date.getFullYear()}${month !== 10 && month !== 11 ? 0 : ""}${date.getMonth() + 1}${date.getDate()}`
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
            "expDeliveryMobileNo", "documentType1", "documentType2"
        ]

        if (data.purposeType === "PS") {
            keys = keys.filter(key => key !== "licensePurpose1" && key !== "licensePurpose2" && key !== "licensePurpose3")
            keys = keys.concat("purposeComment")
        }
        else {
            keys = keys.filter(key => key !== "purposeComment")
            keys = keys.concat("licensePurpose1", "licensePurpose2", "licensePurpose3")
        }

        if (data.documentTypeId === "ORIGINAL") {
            keys = keys.concat("plannedReturnDate")
        }
        else {
            keys = keys.filter(key => key !== "plannedReturnDate")
        }

        if (data.documentTypeId === "SCANCOPY") {
            keys = keys.concat("watermark1")
            keys = keys.concat("watermark2")
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


    getOption(person) {
        let i = 0
        if (person !== "") {
            this.state.seniorManagersList.map((head, index) => {
                if (head.value === person) {
                    i = index
                }
            })
        }
        else {
            i = null
        }
        return i
    }

    handleAgreeTerms(event) {
        this.validate()
        if (this.validator.allValid()) {
            this.submitRequest("Y")
        }
        else {
            // alert("Invalid Fields")
            this.validator.showMessages()
            this.forceUpdate()
        }
    }

    submitRequest(isSubmitted) {
        let postReq = new FormData();
        postReq.append("UserId", localStorage.getItem("userId"));
        postReq.append("EmployeeNumber", this.state.taskDetails.employeeNum);
        postReq.append("TelephoneNumber", this.state.taskDetails.telephoneNum);
        postReq.append("CompanyId", this.props.legalName);
        postReq.append("DepartmentId", this.state.taskDetails.departmentId);
        postReq.append("LicenseName", this.state.taskDetails.licenseNameId);
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
        await axios.put(`${config.url}/licenses/${this.state.taskDetails.licenseId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then(res => {
                if (isSubmitted === "Y") {
                    Swal.fire({
                        title: res.data.status === 200 ? 'Request Submitted' : "",
                        text: 'Request Number : ' + res.data.requestNum,
                        footer: 'Your request is being processed and is waiting for the approval',
                        type: 'success',
                        onClose: () => { this.goBack() }
                    })
                }
                else {
                    Swal.fire({
                        title: res.data.status === 200 ? 'Request Saved' : '',
                        text: 'Request Number : ' + res.data.requestNum,
                        footer: 'Your request is saved as draft.',
                        type: 'info',
                        onClose: () => { this.goBack() }
                    })
                }
            })
    }

    async deleteTask() {
        await axios.delete(`${config.url}/licenses/${this.state.taskDetails.licenseId}`).then(res => {
            Swal.fire({
                title: "REQUEST DELETED",
                html: res.data.message,
                type: "success",
                onClose: () => { this.goBack() }
            })
        })
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
        const { taskDetails, loading, licenseNames, returnDateView, departments, seniorManagersList } = this.state
        this.validator.purgeFields();

        const filterColors = (inputValue) => {
            return seniorManagersList.filter(i =>
                i.label.toLowerCase().includes(inputValue.toLowerCase())
            );
        };


        const loadOptions = (inputValue, callback) => {

            callback(filterColors(inputValue));
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
                            <Form className="form-horizontal">
                                <FormGroup>
                                    <Label>Request Number</Label>
                                    <InputGroup>
                                        <Input disabled value={taskDetails.requestNum}></Input>
                                    </InputGroup>
                                </FormGroup>
                                <FormGroup>
                                    <Label>Employee Number</Label>
                                    <div className="controls">
                                        <InputGroup className="input-prepend">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>ID</InputGroupText>
                                            </InputGroupAddon>
                                            <Input disabled readOnly value={taskDetails.employeeNum} id="prependedInput" size="16" type="text" />
                                        </InputGroup>
                                    </div>
                                </FormGroup>
                                <FormGroup>
                                    <Label>Telephone Number </Label>
                                    <InputGroup>
                                        <Input onChange={this.handleChange("telephoneNum")} value={taskDetails.telephoneNum} id="telephoneNum" size="16" type="text" />
                                    </InputGroup>
                                </FormGroup>
                                <FormGroup>
                                    <Label>Department </Label>
                                    <InputGroup>
                                        <Input id="departmentId" onChange={this.handleChange("departmentId")} value={taskDetails.departmentId} type="select">
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
                                        <Input id="licenseNameId" onChange={this.handleChange("licenseNameId")} value={taskDetails.licenseNameId} type="select">
                                            <option value="" >Please select a License Name</option>
                                            {licenseNames.map((license, index) =>
                                                <option key={index} value={license.licenseNameId} > {license.name} </option>
                                            )}
                                        </Input>
                                    </InputGroup>
                                    <small style={{ color: '#F86C6B' }} >{this.validator.message('License Name', taskDetails.licenseNameId, 'required')}</small>
                                </FormGroup>

                                <FormGroup onChange={this.handleRadio("purposeType")} >
                                    <Label >License Purpose</Label>
                                    <CustomInput type="radio" id="licensePurpose1" name="purposeType" defaultChecked={taskDetails.purposeType === "LVFP"} value="LVFP" label="城市备案 Local VRB Filling Purpose" />
                                    <CustomInput type="radio" id="licensePurpose2" name="purposeType" defaultChecked={taskDetails.purposeType === "MFP"} value="MFP" label="城抵押 Mortgage Filling Purpose" />
                                    <CustomInput type="radio" id="licensePurpose3" name="purposeType" defaultChecked={taskDetails.purposeType === "PS"} value="PS" label="其他 Please specify:">
                                        <Collapse isOpen={taskDetails.purposeType === "PS"}>
                                            <Input id="purposeComment" type="text" onChange={this.handleChange("purposeComment")} value={taskDetails.purposeComment} />
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
                                        <Label>Watermark</Label> <small>(To fulfill Legal’ s requirements, the scan copy of Licenses should be watermarked)</small>
                                        <CustomInput defaultChecked={taskDetails.needWatermark === "Y"} type="radio" id="watermark1" name="watermark" value="Y" about="watermark1" label="Yes, Please specify watermark here:">
                                            <Collapse isOpen={taskDetails.needWatermark === "Y"}>
                                                <Input id="inputWatermark1" type="text" value={taskDetails.watermark} onChange={this.handleChange("watermark")} />
                                                {taskDetails.needWatermark === "Y"
                                                    ? <small style={{ color: '#F86C6B' }} >{this.validator.message('Watermark', taskDetails.watermark, 'required')}</small>
                                                    : null}
                                            </Collapse>
                                        </CustomInput>
                                        <CustomInput defaultChecked={taskDetails.needWatermark === "N"} type="radio" id="watermark2" name="watermark" value="N" about="watermark2" label="No, Please specify the reason of not adding watermark:">
                                            <Collapse isOpen={taskDetails.needWatermark === "N"}>
                                                <Input id="inputWatermark2" type="text" value={taskDetails.watermark} onChange={this.handleChange("watermark")} />
                                                {taskDetails.needWatermark === "N"
                                                    ? <small style={{ color: '#F86C6B' }} >{this.validator.message('Watermark', taskDetails.watermark, 'required')}</small>
                                                    : null}
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
                                            showMonthDropdown
                                            showYearDropdown
                                            selected={returnDateView}
                                            onChange={this.dateChange("plannedReturnDate", "returnDateView")} />
                                        {taskDetails.documentTypeId === "OC"
                                            ? <small style={{ color: '#F86C6B' }} >{this.validator.message('Return Date', taskDetails.plannedReturnDate, 'required')}</small>
                                            : null}
                                    </FormGroup>
                                </Collapse>


                                <FormGroup onChange={this.handleChange("deliverWayId")} >
                                    <Label>Deliver Way</Label>
                                    <CustomInput type="radio" id="deliverWay1" defaultChecked={taskDetails.deliverWayId === "F2F"} name="deliverWayId" value="F2F" label="面对面城, Face to face" />
                                    <CustomInput type="radio" id="deliverWay2" defaultChecked={taskDetails.deliverWayId === "EXPRESS"} name="deliverWayId" value="Express" label="快递 Express: Express Number" />
                                    <small style={{ color: '#F86C6B' }} >{this.validator.message('Delivery Way', taskDetails.deliverWayId, 'required')}</small>
                                </FormGroup>

                                <FormGroup>
                                    <Label>Address</Label>
                                    <Input placeholder="Please specify Address" id="expDeliveryAddress" onChange={this.handleChange("expDeliveryAddress")} value={taskDetails.expDeliveryAddress} type="text" />
                                    <small style={{ color: '#F86C6B' }} >{this.validator.message('Address', taskDetails.expDeliveryAddress, 'required')}</small>
                                </FormGroup>

                                <FormGroup>
                                    <Label>Reciever</Label>
                                    <AsyncSelect
                                        id="expDeliveryReceiver"
                                        loadOptions={loadOptions}
                                        isClearable
                                        value={seniorManagersList[this.getOption(taskDetails.expDeliveryReceiver)]}
                                        onChange={this.handleSelectReciever}
                                        menuPortalTarget={document.body}
                                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                    />
                                    <small style={{ color: '#F86C6B' }} >{this.validator.message('Reciever', taskDetails.expDeliveryReceiver, 'required')}</small>
                                </FormGroup>

                                <FormGroup>
                                    <Label>Reciever Mobile Phone</Label>
                                    <Input placeholder={`Please specify Reciever's phone`} id="expDeliveryMobileNo" value={taskDetails.expDeliveryMobileNo} onChange={this.handleChange("expDeliveryMobileNo")} type="text" />
                                    <small style={{ color: '#F86C6B' }} >{this.validator.message(`Reciever's Phone`, taskDetails.expDeliveryMobileNo, 'required')}</small>
                                </FormGroup>

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
                            {/* <Col md="16">
                                <FormGroup check>
                                    <FormGroup>
                                        <CustomInput
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={taskDetails.isConfirm === "Y"}
                                            onChange={this.handleAgreeTerms}
                                            id="confirm" value="option1">
                                            <Label className="form-check-label" check >
                                                By ticking the box, I confirm that I hereby acknowledge that I must comply the internal Policies and Guidelines &
                                                regarding chop management and I will not engage in any inappropriate chop usage and other inappropriate action
                      </Label>
                                        </CustomInput>
                                    </FormGroup>
                                </FormGroup>
                            </Col> */}
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
