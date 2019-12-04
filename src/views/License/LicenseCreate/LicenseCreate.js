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


class LicenseCreate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            //get data from api
            licenseNames: [
                {
                    id: 1,
                    name: "test"
                }
            ],
            //get data from api
            seniorManagers: [],

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
        this.submitRequest = this.submitRequest.bind(this);


    }

    //Mount
    componentDidMount() {
        this.getUserData();
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
        let dates = date.toISOString().substr(0, 10);
        // console.log(dates.replace(/-/g, ""))
        this.setState({ [view]: date });
        this.setState(state => {
            let formData = this.state.formData
            formData[name] = dates.replace(/-/g, "")
            return formData
        })
    };

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
        if (data.documentType === "OC") {
            keys = keys.concat("returnDate")
        }
        if (data.documentType === "SC") {
            keys = keys.concat("watermark1")
            keys = keys.concat("watermark2")
        }
        if (data.isWatermark === "Y") {
            keys = keys.concat("inputWatermark1")
        }
        if (data.isWatermark === "N") {
            keys = keys.concat("inputWatermark2")
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
                if (element.className === "form-control") {
                    element.className = "is-invalid form-control"
                }
                else if (element.className === "custom-control-input") {
                    element.className = "is-invalid custom-control-input"
                }

            }
        })
    }

    submitRequest() {

        //post to create request
        let postReq = new FormData();
        postReq.append("UserId", this.state.formData.userId);
        postReq.append("employeeNum", this.state.formData.employeeNum);
        postReq.append("telephoneNum", this.state.formData.telephoneNum);
        postReq.append("department", this.state.formData.department);
        postReq.append("licenseName", this.state.formData.licenseName);
        postReq.append("licensePurpose", this.state.formData.licensePurpose);
        postReq.append("specificPurpose", this.state.formData.specificPurpose);
        postReq.append("documentType", this.state.formData.documentType);
        postReq.append("isWatermark", this.state.formData.isWatermark);
        postReq.append("watermark", this.state.formData.watermark);
        postReq.append("returnDate", this.state.formData.returnDate);
        postReq.append("deliverWay", this.state.formData.deliverWay);
        postReq.append("address", this.state.formData.address);
        postReq.append("reciever", this.state.formData.reciever);
        postReq.append("recieverPhone", this.state.formData.recieverPhone);
        postReq.append("seniorManager", this.state.formData.seniorManager);
        postReq.append("isConfirm", this.state.formData.isConfirm);

        for (var pair of postReq.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }

    }

    render() {
        const { formData, licenseNames, returnDateView } = this.state
        this.validator.purgeFields();

        return (
            <div className="animated fadeIn">
                <h4>Create</h4>
                <Card>
                    <CardHeader>REQUEST LICENSE</CardHeader>
                    <CardBody>
                        <Form className="form-horizontal">
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
                                    <Input placeholder="Please specify department" id="department" onChange={this.handleChange("department")} size="16" type="text" />
                                </InputGroup>
                                <small style={{ color: '#F86C6B' }} >{this.validator.message('Department', formData.department, 'required')}</small>
                            </FormGroup>
                            <FormGroup>
                                <Label>License Name </Label>
                                <InputGroup>
                                    <Input id="licenseName" onChange={this.handleChange("licenseName")} defaultValue="0" type="select">
                                        <option value="0" >Please select a License Name</option>
                                        {licenseNames.map((license, index) =>
                                            <option key={index} value={license.id} > {license.name} </option>
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
                                <CustomInput type="radio" id="documentType1" name="documentType" value="SC" label="城电子版 Scan Copy" />
                                <CustomInput type="radio" id="documentType2" name="documentType" value="OC" label="城原件 Original Copy" />
                                <small style={{ color: '#F86C6B' }} >{this.validator.message('Document Type', formData.documentType, 'required')}</small>
                            </FormGroup>


                            <Collapse isOpen={formData.documentType === "SC"}>
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
                                    {formData.documentType === "SC"
                                        ? <small style={{ color: '#F86C6B' }} >{this.validator.message('Watermark', formData.isWatermark, 'required')}</small>
                                        : null}
                                </FormGroup>
                            </Collapse>

                            <Collapse isOpen={formData.documentType === "OC"}>
                                <FormGroup>
                                    <Label>Planned Return Date:</Label>
                                    <DatePicker id="returnDate" placeholderText="YYYY/MM/DD" popperPlacement="auto-center" todayButton="Today"
                                        className="form-control" required dateFormat="yyyy/MM/dd" withPortal
                                        showMonthDropdown
                                        showYearDropdown
                                        selected={returnDateView}
                                        onChange={this.dateChange("returnDate", "returnDateView")} />
                                    {formData.documentType === "OC"
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
                                <Input placeholder="Please specify Reciever" id="reciever" onChange={this.handleChange("reciever")} type="text" />
                                <small style={{ color: '#F86C6B' }} >{this.validator.message('Reciever', formData.reciever, 'required')}</small>
                            </FormGroup>

                            <FormGroup>
                                <Label>Reciever Mobile Phone</Label>
                                <Input placeholder={`Please specify Reciever's phone`} id="recieverPhone" onChange={this.handleChange("recieverPhone")} type="text" />
                                <small style={{ color: '#F86C6B' }} >{this.validator.message(`Reciever's Phone`, formData.recieverPhone, 'required')}</small>
                            </FormGroup>

                            <FormGroup>
                                <Label>Senior Manager or above of requestor department</Label>
                                <Input id="seniorManager" onChange={this.handleChange("seniorManager")} defaultValue="0" type="select">
                                    <option value="0" >Please select a senior manager</option>
                                    <option value="1" >Test</option>
                                </Input>
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
                                        ? <Button type="submit" onClick={this.submitRequest} color="success">Submit</Button>
                                        : <Button type="submit" disabled color="secondary">Submit</Button>
                                    }

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