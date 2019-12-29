import React, { Component } from 'react';
import {
    Card, CardHeader, CardBody, CardFooter,
    FormGroup, Form, Label, Input, InputGroup, InputGroupAddon, InputGroupText,
    CustomInput,
    Col, Row, Button,
    Collapse
} from 'reactstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import config from '../../../config';
import SimpleReactValidator from 'simple-react-validator';
import Select from 'react-select'
import Swal from 'sweetalert2';
import AsyncSelect from 'react-select/async';
import makeAnimated from 'react-select/animated';


const animatedComponents = makeAnimated();
const reactSelectControl = {
    control: styles => ({ ...styles, borderColor: '#F86C6B', boxShadow: '0 0 0 0px #F86C6B', ':hover': { ...styles[':hover'], borderColor: '#F86C6B' } }),
    menuPortal: base => ({ ...base, zIndex: 9999 })
}

class LicenseCreate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            //get data from api
            licenseNames: [],
            seniorManagers: [],
            departments: [],

            //data to submit
            formData: {
                userId: "",
                employeeNum: "",
                telephoneNum: "",
                department: "",
                licenseName: "",
                licensePurpose: "",
                specificPurpose: "",
                documentType: "",
                isWatermark: "",
                watermark: "",
                returnDate: "",
                deliverWay: "",
                address: "",
                reciever: "",
                recieverPhone: "",
                seniorManager: "",
                isConfirm: "N"
            },

            validateForm: ["telephoneNum", "department", "licenseName", "licensePurpose1", "licensePurpose2", "licensePurpose3", "documentType1", "documentType2", "deliverWay1", "deliverWay2", "address", "reciever", "recieverPhone", "seniorManager"],


            returnDateView: null,
        }

        this.validator = new SimpleReactValidator({ autoForceUpdate: this, locale: 'en' });
        this.handleAgreeTerms = this.handleAgreeTerms.bind(this);
        this.handleSelectOption = this.handleSelectOption.bind(this);
        this.submitRequest = this.submitRequest.bind(this);
        this.handleSelectReciever = this.handleSelectReciever.bind(this);
        this.formRef = React.createRef()
    }

    //Mount
    componentDidMount() {
        this.getUserData();
        // this.getData('licenseNames');
        // this.getData('seniorManagers');
        this.getLicenseNames();
        this.getSeniorManagers();
        this.getData('departments');
    }

    async getLicenseNames() {
        const res = await axios.get(`${config.url}/licensenames?companyId=${this.props.legalName}`)
        this.setState({ licenseNames: res.data })
    }

    async getData(name) {
        let res = await axios.get(`${config.url}/${name}`)
        this.setState({ [name]: res.data })
    }

    //Get User Infromation from database
    async getUserData() {
        let ticket = localStorage.getItem('ticket')
        let userId = localStorage.getItem('userId')
        const res = await axios.get(`${config.url}/users/` + userId, { headers: { 'ticket': ticket } })
        this.setState(state => {
            let formData = this.state.formData
            formData.userId = userId
            formData.employeeNum = res.data.employeeNum
            formData.telephoneNum = res.data.telephoneNum
            return formData
        })
    }

    async getSeniorManagers() {
        console.log(`${config.url}/users?category=normal&companyid=${this.props.legalName}&displayname=&userid=${localStorage.getItem("userId")}`)
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
                this.setState({ seniorManagers: arr1 })
            })
    }

    async postData(formData, isSubmitted) {
        await axios.post(`${config.url}/licenses`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then(res => {
                if (isSubmitted === "Y") {
                    Swal.fire({
                        title: res.data.status === 200 ? 'Request Submitted' : "",
                        text: 'Request Number : ' + res.data.requestNum,
                        footer: 'Your request is being processed and is waiting for the approval',
                        type: 'success',
                        onClose: () => { this.formReset() }
                    })
                }
                else {
                    Swal.fire({
                        title: res.data.status === 200 ? 'Request Saved' : '',
                        text: 'Request Number : ' + res.data.requestNum,
                        footer: 'Your request is saved as draft.',
                        type: 'info',
                        onClose: () => { this.formReset() }
                    })
                }
            })
    }


    handleSelectOption(event) {
        // console.log(event)
        let value = event ? event : null
        var element = document.getElementById("seniorManager")
        if (value) {
            element.className = "css-2b097c-container"
        }
        else {
            element.className = "notValid css-2b097c-container"
        }
        this.setState(state => {
            let formData = this.state.formData
            formData.seniorManager = value
            return formData
        })

    }

    //Updating Values onChange
    handleChange = name => event => {
        let id = event.target.id
        if (this.state.formData.isConfirm === "Y") {
            this.setState(state => {
                let formData = this.state.formData
                formData.isConfirm = "N"
                return formData
            })
        }
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
            let formData = this.state.formData
            formData[name] = value
            return formData
        })
    }

    handleRadio = name => event => {
        let id = event.target.id
        if (this.state.formData.isConfirm === "Y") {
            this.setState(state => {
                let formData = this.state.formData
                formData.isConfirm = "N"
                return formData
            })
        }

        let value = ""
        if (name === "isWatermark") {
            document.getElementById("watermark1").className = "custom-control-input"
            document.getElementById("watermark2").className = "custom-control-input"
            if (event.target.id === "inputWatermark1" || event.target.id === "inputWatermark2") {
                value = event.target.id === "inputWatermark1" ? "Y" : "N"
            }
            else if (event.target.id === "watermark1" || event.target.id === "watermark2") {
                value = event.target.id === "watermark1" ? "Y" : "N"
            }
        }
        else if (name === "licensePurpose") {
            document.getElementById("licensePurpose1").className = "custom-control-input"
            document.getElementById("licensePurpose2").className = "custom-control-input"
            document.getElementById("licensePurpose3").className = "custom-control-input"
            value = event.target.id === "specificPurpose" ? "PS" : event.target.value
        }

        this.setState(state => {
            let formData = this.state.formData
            formData[name] = value
            return formData
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
            let formData = this.state.formData
            formData[name] = dates
            return formData
        })
    };

    handleSelectReciever(event) {
        this.setState(state => {
            let formData = this.state.formData
            formData.reciever = event.value
            return formData
        })
    }

    //validation
    handleAgreeTerms(event) {
        let checked = event.target.checked
        this.validate()
        if (this.validator.allValid()) {
            this.setState(state => {
                let formData = this.state.formData
                formData.isConfirm = "Y"
                return formData
            })
        }
        else {
            // alert("Invalid Fields")
            this.validator.showMessages()
            this.forceUpdate()
        }

    }

    validate() {
        let data = this.state.formData
        let keys = this.state.validateForm
        if (data.licensePurpose === "PS") {
            keys = keys.filter(key => key !== "licensePurpose1" && key !== "licensePurpose2" && key !== "licensePurpose3")
            keys = keys.concat("specificPurpose")
        }
        if (data.documentType === "ORIGINAL") {
            keys = keys.concat("returnDate")
        }
        else {
            keys = keys.filter(key => key !== "returnDate")
        }
        if (data.documentType === "SCANCOPY") {
            keys = keys.concat("watermark1")
            keys = keys.concat("watermark2")
        }
        else {
            keys = keys.filter(key => key !== "watermark1" || key !== "watermark2")
        }
        if (data.isWatermark === "Y") {
            keys = keys.concat("inputWatermark1")
        }
        else {
            keys = keys.filter(key => key !== "inputWatermark1")
        }
        if (data.isWatermark === "N") {
            keys = keys.concat("inputWatermark2")
        }
        else {
            keys = keys.filter(key => key !== "inputWatermark2")
        }
        keys.map(key => {
            var element = document.getElementById(key)
            if (key === "deliverWay1" || key === "deliverWay2") {
                if (!data.deliverWay) {
                    document.getElementById("deliverWay1").className = "is-invalid custom-control-input"
                    document.getElementById("deliverWay2").className = "is-invalid custom-control-input"
                }
            }
            else if (key === "licensePurpose1" || key === "licensePurpose2" || key === "licensePurpose3") {
                if (!data.licensePurpose) {
                    document.getElementById("licensePurpose1").className = "is-invalid custom-control-input"
                    document.getElementById("licensePurpose2").className = "is-invalid custom-control-input"
                    document.getElementById("licensePurpose3").className = "is-invalid custom-control-input"
                }
            }
            else if (key === "documentType1" || key === "documentType2") {
                if (!data.documentType) {
                    document.getElementById("documentType1").className = "is-invalid custom-control-input"
                    document.getElementById("documentType2").className = "is-invalid custom-control-input"
                }
            }
            else if (key === "watermark1" || key === "watermark2" || key === "inputWatermark1" || key === "inputWatermark2") {
                if (!data.isWatermark) {
                    document.getElementById("watermark1").className = "is-invalid custom-control-input"
                    document.getElementById("watermark2").className = "is-invalid custom-control-input"
                }
                if (!data.watermark) {
                    document.getElementById("inputWatermark1").className = "is-invalid form-control"
                    document.getElementById("inputWatermark2").className = "is-invalid form-control"
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

    submitRequest(isSubmitted) {
        //post to create request
        let postReq = new FormData();
        postReq.append("UserId", this.state.formData.userId);
        postReq.append("EmployeeNumber", this.state.formData.employeeNum);
        postReq.append("TelephoneNumber", this.state.formData.telephoneNum);
        postReq.append("CompanyId", this.props.legalName);
        postReq.append("DepartmentId", this.state.formData.department);
        postReq.append("LicenseName", this.state.formData.licenseName);
        postReq.append("PurposeType", this.state.formData.licensePurpose);
        postReq.append("PurposeComment", this.state.formData.specificPurpose);
        postReq.append("DocumentTypeId", this.state.formData.documentType);
        postReq.append("NeedWatermark", this.state.formData.isWatermark === "" ? "N" : this.state.formData.isWatermark);
        postReq.append("Watermark", this.state.formData.watermark);
        postReq.append("PlannedReturnDate", this.state.formData.returnDate);
        postReq.append("DeliverWayId", this.state.formData.deliverWay);
        postReq.append("isSubmitted", isSubmitted);
        // postReq.append("SeniorManager", this.state.formData.seniorManager);
        // postReq.append("LicenseAdmin", "quincy@otds.admin");
        postReq.append("isConfirm", this.state.formData.isConfirm);
        postReq.append("ExpDeliveryAddress", this.state.formData.address);
        postReq.append("ExpDeliveryReciever", this.state.formData.reciever);
        postReq.append("ExpDeliveryMobileNo", this.state.formData.recieverPhone);

        for (let i = 0; i < this.state.formData.seniorManager.length; i++) {
            postReq.append(`SeniorManagers[${i}]`, this.state.formData.seniorManager[i].value);
        }

        for (var pair of postReq.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }

        this.postData(postReq, isSubmitted)

    }

    formReset() {
        this.formRef.current.reset()
        window.location.reload();
    }

    render() {
        const { formData, licenseNames, returnDateView, seniorManagers, departments } = this.state
        this.validator.purgeFields();


        const filterColors = (inputValue) => {
            return seniorManagers.filter(i =>
                i.label.toLowerCase().includes(inputValue.toLowerCase())
            );
        };


        const loadOptions = (inputValue, callback) => {

            callback(filterColors(inputValue));
        }

        return (
            <div className="animated fadeIn">
                <h4>Create</h4>
                <Card>
                    <CardHeader>REQUEST LICENSE</CardHeader>
                    <CardBody>
                        <Form className="form-horizontal" innerRef={this.formRef}>
                            <FormGroup>
                                <Label>Employee Number</Label>
                                <div className="controls">
                                    <InputGroup className="input-prepend">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>ID</InputGroupText>
                                        </InputGroupAddon>
                                        <Input disabled value={formData.employeeNum} id="prependedInput" size="16" type="text" />
                                    </InputGroup>
                                </div>
                            </FormGroup>
                            <FormGroup>
                                <Label>Telephone Number </Label>
                                <InputGroup>
                                    <Input onChange={this.handleChange("telephoneNum")} value={formData.telephoneNum} id="telephoneNum" size="16" type="text" />
                                </InputGroup>
                            </FormGroup>
                            <FormGroup>
                                <Label>Department </Label>
                                <InputGroup>
                                    <Input id="department" onChange={this.handleChange("department")} defaultValue="0" type="select">
                                        <option value="0">Please selet a department</option>
                                        {departments.map((dept, index) =>
                                            <option key={index} value={dept.deptId.toUpperCase()} > {dept.deptName} </option>
                                        )}
                                    </Input>
                                </InputGroup>
                                <small style={{ color: '#F86C6B' }} >{this.validator.message('Department', formData.department, 'required')}</small>
                            </FormGroup>
                            <FormGroup>
                                <Label>License Name </Label>
                                <InputGroup>
                                    <Input id="licenseName" onChange={this.handleChange("licenseName")} defaultValue="0" type="select">
                                        <option value="0" >Please select a License Name</option>
                                        {licenseNames.map((license, index) =>
                                            <option key={index} value={license.licenseNameId} > {license.name} </option>
                                        )}
                                    </Input>
                                </InputGroup>
                                <small style={{ color: '#F86C6B' }} >{this.validator.message('License Name', formData.licenseName, 'required')}</small>
                            </FormGroup>

                            <FormGroup onChange={this.handleRadio("licensePurpose")} >
                                <Label >License Purpose</Label>
                                <CustomInput type="radio" id="licensePurpose1" name="licensePurpose" value="LVFP" label="城市备案 Local VRB Filling Purpose" />
                                <CustomInput type="radio" id="licensePurpose2" name="licensePurpose" value="MFP" label="城抵押 Mortgage Filling Purpose" />
                                <CustomInput type="radio" id="licensePurpose3" name="licensePurpose" value="PS" label="其他 Please specify:">
                                    <Collapse isOpen={formData.licensePurpose === "PS"}>
                                        <Input id="specificPurpose" type="text" onChange={this.handleChange("specificPurpose")} value={formData.specificPurpose} />
                                        {formData.licensePurpose === "PS"
                                            ? <small style={{ color: '#F86C6B' }} >{this.validator.message('Specify Purpose', formData.specificPurpose, 'required')}</small>
                                            : null}
                                    </Collapse>
                                </CustomInput>
                                <small style={{ color: '#F86C6B' }} >{this.validator.message('Purpose of License', formData.licensePurpose, 'required')}</small>
                            </FormGroup>

                            <FormGroup onChange={this.handleChange("documentType")} >
                                <Label>Select Document Type</Label>
                                <CustomInput type="radio" id="documentType1" name="documentType" value="SCANCOPY" label="城电子版 Scan Copy" />
                                <CustomInput type="radio" id="documentType2" name="documentType" value="ORIGINAL" label="城原件 Original Copy" />
                                <small style={{ color: '#F86C6B' }} >{this.validator.message('Document Type', formData.documentType, 'required')}</small>
                            </FormGroup>


                            <Collapse isOpen={formData.documentType === "SCANCOPY"}>
                                <FormGroup onChange={this.handleRadio("isWatermark")}>
                                    <Label>Watermark</Label> <small>(To fulfill Legal’ s requirements, the scan copy of Licenses should be watermarked)</small>
                                    <CustomInput type="radio" id="watermark1" name="watermark" value="Y" about="watermark1" label="城电. Please specify watermark here:">
                                        <Collapse isOpen={formData.isWatermark === "Y"}>
                                            <Input id="inputWatermark1" type="text" value={formData.watermark} onChange={this.handleChange("watermark")} />
                                            {formData.isWatermark === "Y"
                                                ? <small style={{ color: '#F86C6B' }} >{this.validator.message('Watermark', formData.watermark, 'required')}</small>
                                                : null}
                                        </Collapse>
                                    </CustomInput>
                                    <CustomInput type="radio" id="watermark2" name="watermark" value="N" about="watermark2" label="城原, No. Please specify the reason of not adding watermark:">
                                        <Collapse isOpen={formData.isWatermark === "N"}>
                                            <Input id="inputWatermark2" type="text" value={formData.watermark} onChange={this.handleChange("watermark")} />
                                            {formData.isWatermark === "N"
                                                ? <small style={{ color: '#F86C6B' }} >{this.validator.message('Watermark', formData.watermark, 'required')}</small>
                                                : null}
                                        </Collapse>
                                    </CustomInput>
                                    {formData.documentType === "SCANCOPY"
                                        ? <small style={{ color: '#F86C6B' }} >{this.validator.message('Watermark', formData.isWatermark, 'required')}</small>
                                        : null}
                                </FormGroup>
                            </Collapse>

                            <Collapse isOpen={formData.documentType === "ORIGINAL"}>
                                <FormGroup>
                                    <Label>Planned Return Date:</Label>
                                    <DatePicker id="returnDate" placeholderText="YYYY/MM/DD" popperPlacement="auto-center" todayButton="Today"
                                        className="form-control" required dateFormat="yyyy/MM/dd" withPortal
                                        showMonthDropdown
                                        showYearDropdown
                                        selected={returnDateView}
                                        onChange={this.dateChange("returnDate", "returnDateView")} />
                                    {formData.documentType === "ORIGINAL"
                                        ? <small style={{ color: '#F86C6B' }} >{this.validator.message('Return Date', formData.returnDate, 'required')}</small>
                                        : null}
                                </FormGroup>
                            </Collapse>


                            <FormGroup onChange={this.handleChange("deliverWay")} >
                                <Label>Deliver Way</Label>
                                <CustomInput type="radio" id="deliverWay1" name="deliverWay" value="F2F" label="面对面城, Face to face" />
                                <CustomInput type="radio" id="deliverWay2" name="deliverWay" value="Express" label="快递 Express: Express Number" />
                                <small style={{ color: '#F86C6B' }} >{this.validator.message('Delivery Way', formData.deliverWay, 'required')}</small>
                            </FormGroup>

                            <FormGroup>
                                <Label>Address</Label>
                                <Input placeholder="Please specify Address" id="address" onChange={this.handleChange("address")} type="text" />
                                <small style={{ color: '#F86C6B' }} >{this.validator.message('Address', formData.address, 'required')}</small>
                            </FormGroup>

                            <FormGroup>
                                <Label>Reciever</Label>
                                <AsyncSelect
                                    id="reciever"
                                    loadOptions={loadOptions}
                                    isClearable
                                    onChange={this.handleSelectReciever}
                                    menuPortalTarget={document.body}
                                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                />
                                {/* <Input placeholder="Please specify Reciever" id="reciever" onChange={this.handleChange("reciever")} type="text" /> */}
                                <small style={{ color: '#F86C6B' }} >{this.validator.message('Reciever', formData.reciever, 'required')}</small>
                            </FormGroup>

                            <FormGroup>
                                <Label>Reciever Mobile Phone</Label>
                                <Input placeholder={`Please specify Reciever's phone`} id="recieverPhone" onChange={this.handleChange("recieverPhone")} type="text" />
                                <small style={{ color: '#F86C6B' }} >{this.validator.message(`Reciever's Phone`, formData.recieverPhone, 'required')}</small>
                            </FormGroup>

                            <FormGroup>
                                <Label>Senior Manager or above of requestor department</Label>
                                <AsyncSelect
                                    id="seniorManager"
                                    loadOptions={loadOptions}
                                    isMulti
                                    // onBlur={this.checkDepartment}
                                    onChange={this.handleSelectOption}
                                    menuPortalTarget={document.body}
                                    components={animatedComponents}
                                    styles={formData.seniorManager === null ? reactSelectControl : ""} />
                                {/* <Select
                                    id="seniorManager"
                                    options={seniorManagers}
                                    isClearable
                                    onChange={this.handleSelectOption}
                                /> */}
                                <small style={{ color: '#F86C6B' }} >{this.validator.message('Senior Manager', formData.seniorManager, 'required')}</small>
                            </FormGroup>

                        </Form>
                        <Col md="16">
                            <FormGroup check>
                                <FormGroup>
                                    <CustomInput
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={formData.isConfirm === "Y"}
                                        onChange={this.handleAgreeTerms}
                                        id="confirm" value="option1">
                                        <Label className="form-check-label" check >
                                            By ticking the box, I confirm that I hereby acknowledge that I must comply the internal Policies and Guidelines &
                                            regarding chop management and I will not engage in any inappropriate chop usage and other inappropriate action
                      </Label>
                                    </CustomInput>
                                </FormGroup>
                            </FormGroup>
                        </Col>
                    </CardBody>
                    <CardFooter>
                        <div className="form-actions" >
                            <Row noGutters className="float-left">
                                <Col className="mr-2" >
                                    {formData.isConfirm === "Y"
                                        ? <Button className="mr-2" type="submit" onClick={() => this.submitRequest("Y")} color="success">Submit</Button>
                                        : <Button className="mr-2" type="submit" disabled color="secondary">Submit</Button>
                                    }
                                    <Button type="submit" onClick={() => this.submitRequest("N")} color="primary" > Save </Button>

                                </Col>
                            </Row>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        )
    }

}
export default LicenseCreate