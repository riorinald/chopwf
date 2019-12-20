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
import Select from 'react-select'

class LicenseEditRequest extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            taskDetails: {},

            //get data from api
            licenseNames: [],
            seniorManagers: [],
            departments: [],

            returnDateView: null,

        }
        this.validator = new SimpleReactValidator({ autoForceUpdate: this, locale: 'en' });
        this.handleAgreeTerms = this.handleAgreeTerms.bind(this);
        this.goBack = this.goBack.bind(this)
    }

    componentDidMount() {
        if (this.props.location.state === undefined) {
            this.goBack()
        }
        else {
            this.getData('licenseNames');
            this.getData('seniorManagers');
            this.getData('departments');
            this.getTaskDetails(this.props.match.params.taskId)
        }
    }

    async getData(name) {
        const res = await Axios.get(`https://5dedc007b3d17b00146a1c5a.mockapi.io/details/${name}`)
        this.setState({ [name]: res.data })
    }

    async getTaskDetails(taskId) {
        this.setState({ loading: true })
        await Axios.get(`http://5de7307ab1ad690014a4e040.mockapi.io/licenseTask/${taskId}`)
            .then(res => {
                this.setState({ taskDetails: res.data, loading: false })
            })
        await Axios.get(`https://5b7aa3bb6b74010014ddb4f6.mockapi.io/application/2e4fb172-1eca-47d2-92fb-51fa4068a4b0/approval`)
            .then(res => {
                this.setState({ approvalHistories: res.data })
            })
    }

    handleChange = name => event => {
        let id = event.target.id
        if (this.state.taskDetails.isConfirm === "Y") {
            this.setState(state => {
                let taskDetails = this.state.taskDetails
                taskDetails.isConfirm = "N"
                return taskDetails
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
            let taskDetails = this.state.taskDetails
            taskDetails[name] = value
            return taskDetails
        })
    }

    handleRadio = name => event => {
        let id = event.target.id
        if (this.state.taskDetails.isConfirm === "Y") {
            this.setState(state => {
                let taskDetails = this.state.taskDetails
                taskDetails.isConfirm = "N"
                return taskDetails
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
            let taskDetails = this.state.taskDetails
            taskDetails[name] = value
            return taskDetails
        })
    }

    //convert Date
    dateChange = (name, view) => date => {
        let dates = ""
        if (date) {
            dates = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`
        }
        this.setState({ [view]: date });
        this.setState(state => {
            let taskDetails = this.state.taskDetails
            taskDetails[name] = dates
            return taskDetails
        })
    };

    handleAgreeTerms() {

    }

    goBack() {
        this.props.history.push({
            pathname: `/license/mypendingtask`
        })
    }

    render() {
        const { taskDetails, loading, licenseNames, returnDateView, departments, seniorManagers } = this.state
        return (
            <div>
                <h4>Edit Request</h4>
                {!loading
                    ? <Card className="animated fadeIn">
                        <CardHeader>
                            <Button className="mr-1" color="primary" onClick={() => this.goBack()}><i className="fa fa-angle-left" /> Back </Button>
                            &nbsp;&nbsp; EDIT REQUEST - {taskDetails.requestNumber}
                        </CardHeader>
                        <CardBody>
                            <Form className="form-horizontal">
                                <FormGroup>
                                    <Label>Employee Number</Label>
                                    <div className="controls">
                                        <InputGroup className="input-prepend">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>ID</InputGroupText>
                                            </InputGroupAddon>
                                            <Input disabled readOnly value={taskDetails.employeeNumber} id="prependedInput" size="16" type="text" />
                                        </InputGroup>
                                    </div>
                                </FormGroup>
                                <FormGroup>
                                    <Label>Telephone Number </Label>
                                    <InputGroup>
                                        <Input onChange={this.handleChange("telephoneNum")} value={taskDetails.telephoneNumber} id="telephoneNum" size="16" type="text" />
                                    </InputGroup>
                                </FormGroup>
                                <FormGroup>
                                    <Label>Department </Label>
                                    <InputGroup>
                                        <Input id="department" onChange={this.handleChange("department")} type="select">
                                            <option value="0">Please selet a department</option>
                                            {departments.map((dept, index) =>
                                                <option key={index} value={dept.id} > {dept.name} </option>
                                            )}
                                        </Input>
                                    </InputGroup>
                                    <small style={{ color: '#F86C6B' }} >{this.validator.message('Department', taskDetails.department, 'required')}</small>
                                </FormGroup>
                                <FormGroup>
                                    <Label>License Name </Label>
                                    <InputGroup>
                                        <Input id="licenseName" onChange={this.handleChange("licenseName")} type="select">
                                            <option value="0" >Please select a License Name</option>
                                            {licenseNames.map((license, index) =>
                                                <option key={index} value={license.id} > {license.name} </option>
                                            )}
                                        </Input>
                                    </InputGroup>
                                    <small style={{ color: '#F86C6B' }} >{this.validator.message('License Name', taskDetails.licenseName, 'required')}</small>
                                </FormGroup>

                                <FormGroup onChange={this.handleRadio("licensePurpose")} >
                                    <Label >License Purpose</Label>
                                    <CustomInput type="radio" id="licensePurpose1" name="licensePurpose" value="LVFP" label="城市备案 Local VRB Filling Purpose" />
                                    <CustomInput type="radio" id="licensePurpose2" name="licensePurpose" value="MFP" label="城抵押 Mortgage Filling Purpose" />
                                    <CustomInput type="radio" id="licensePurpose3" name="licensePurpose" value="PS" label="其他 Please specify:">
                                        <Collapse isOpen={taskDetails.licensePurpose === "PS"}>
                                            <Input id="specificPurpose" type="text" onChange={this.handleChange("specificPurpose")} value={taskDetails.specificPurpose} />
                                            {taskDetails.licensePurpose === "PS"
                                                ? <small style={{ color: '#F86C6B' }} >{this.validator.message('Specify Purpose', taskDetails.specificPurpose, 'required')}</small>
                                                : null}
                                        </Collapse>
                                    </CustomInput>
                                    <small style={{ color: '#F86C6B' }} >{this.validator.message('Purpose of License', taskDetails.licensePurpose, 'required')}</small>
                                </FormGroup>

                                <FormGroup onChange={this.handleChange("documentType")} >
                                    <Label>Select Document Type</Label>
                                    <CustomInput type="radio" id="documentType1" name="documentType" value="SC" label="城电子版 Scan Copy" />
                                    <CustomInput type="radio" id="documentType2" name="documentType" value="OC" label="城原件 Original Copy" />
                                    <small style={{ color: '#F86C6B' }} >{this.validator.message('Document Type', taskDetails.documentType, 'required')}</small>
                                </FormGroup>


                                <Collapse isOpen={taskDetails.documentType === "SC"}>
                                    <FormGroup onChange={this.handleRadio("isWatermark")}>
                                        <Label>Watermark</Label> <small>(To fulfill Legal’ s requirements, the scan copy of Licenses should be watermarked)</small>
                                        <CustomInput type="radio" id="watermark1" name="watermark" value="Y" about="watermark1" label="城电. Please specify watermark here:">
                                            <Collapse isOpen={taskDetails.isWatermark === "Y"}>
                                                <Input id="inputWatermark1" type="text" value={taskDetails.watermark} onChange={this.handleChange("watermark")} />
                                                {taskDetails.isWatermark === "Y"
                                                    ? <small style={{ color: '#F86C6B' }} >{this.validator.message('Watermark', taskDetails.watermark, 'required')}</small>
                                                    : null}
                                            </Collapse>
                                        </CustomInput>
                                        <CustomInput type="radio" id="watermark2" name="watermark" value="N" about="watermark2" label="城原, No. Please specify the reason of not adding watermark:">
                                            <Collapse isOpen={taskDetails.isWatermark === "N"}>
                                                <Input id="inputWatermark2" type="text" value={taskDetails.watermark} onChange={this.handleChange("watermark")} />
                                                {taskDetails.isWatermark === "N"
                                                    ? <small style={{ color: '#F86C6B' }} >{this.validator.message('Watermark', taskDetails.watermark, 'required')}</small>
                                                    : null}
                                            </Collapse>
                                        </CustomInput>
                                        {taskDetails.documentType === "SC"
                                            ? <small style={{ color: '#F86C6B' }} >{this.validator.message('Watermark', taskDetails.isWatermark, 'required')}</small>
                                            : null}
                                    </FormGroup>
                                </Collapse>

                                <Collapse isOpen={taskDetails.documentType === "OC"}>
                                    <FormGroup>
                                        <Label>Planned Return Date:</Label>
                                        <DatePicker id="returnDate" placeholderText="YYYY/MM/DD" popperPlacement="auto-center" todayButton="Today"
                                            className="form-control" required dateFormat="yyyy/MM/dd" withPortal
                                            showMonthDropdown
                                            showYearDropdown
                                            selected={returnDateView}
                                            onChange={this.dateChange("returnDate", "returnDateView")} />
                                        {taskDetails.documentType === "OC"
                                            ? <small style={{ color: '#F86C6B' }} >{this.validator.message('Return Date', taskDetails.returnDate, 'required')}</small>
                                            : null}
                                    </FormGroup>
                                </Collapse>


                                <FormGroup onChange={this.handleChange("deliverWay")} >
                                    <Label>Deliver Way</Label>
                                    <CustomInput type="radio" id="deliverWay1" name="deliverWay" value="F2F" label="面对面城, Face to face" />
                                    <CustomInput type="radio" id="deliverWay2" name="deliverWay" value="Express" label="快递 Express: Express Number" />
                                    <small style={{ color: '#F86C6B' }} >{this.validator.message('Delivery Way', taskDetails.deliverWay, 'required')}</small>
                                </FormGroup>

                                <FormGroup>
                                    <Label>Address</Label>
                                    <Input placeholder="Please specify Address" id="address" onChange={this.handleChange("address")} type="text" />
                                    <small style={{ color: '#F86C6B' }} >{this.validator.message('Address', taskDetails.address, 'required')}</small>
                                </FormGroup>

                                <FormGroup>
                                    <Label>Reciever</Label>
                                    <Input placeholder="Please specify Reciever" id="reciever" onChange={this.handleChange("reciever")} type="text" />
                                    <small style={{ color: '#F86C6B' }} >{this.validator.message('Reciever', taskDetails.reciever, 'required')}</small>
                                </FormGroup>

                                <FormGroup>
                                    <Label>Reciever Mobile Phone</Label>
                                    <Input placeholder={`Please specify Reciever's phone`} id="recieverPhone" onChange={this.handleChange("recieverPhone")} type="text" />
                                    <small style={{ color: '#F86C6B' }} >{this.validator.message(`Reciever's Phone`, taskDetails.recieverPhone, 'required')}</small>
                                </FormGroup>

                                <FormGroup>
                                    <Label>Senior Manager or above of requestor department</Label>
                                    <Select
                                        options={seniorManagers}
                                        onChange={this.handleSelectOption}
                                    />
                                    <small style={{ color: '#F86C6B' }} >{this.validator.message('Senior Manager', taskDetails.seniorManager, 'required')}</small>
                                </FormGroup>

                            </Form>
                            <Col md="16">
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
                            </Col>
                        </CardBody>
                        <CardFooter>
                            <div className="form-actions">
                                <Row>
                                    <Col className="d-flex justify-content-start">
                                        {taskDetails.isConfirm
                                            ? <Button type="submit" color="success" onClick={() => { this.submitRequest('Y') }}>Submit</Button>
                                            : <Button type="submit" color="success"
                                                // onMouseEnter={() => this.setState({ tooltipOpen: !this.state.tooltipOpen })}
                                                id="disabledSubmit" disabled >Submit</Button>}
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
