import React, { Component } from 'react';
import {
    Card, CardHeader, CardBody, CardFooter,
    FormGroup, Form, Label, Input, InputGroup, InputGroupAddon, InputGroupText,
    CustomInput
} from 'reactstrap';

class LicenseCreate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            licenseNames: [
                {
                    id: 1,
                    name: "test"
                },
                {
                    id: 2,
                    name: "test"
                },
                {
                    id: 3,
                    name: "test"
                },
                {
                    id: 4,
                    name: "test"
                },
                {
                    id: 5,
                    name: "test"
                },

            ],
            formData: {
                telephoneNum: "",
                licenseName: "",
            }
        }
    }

    handleChange = name => event => {
        let value = event.target.value
        this.setState(state => {
            let formData = this.state.formData
            formData[name] = value
            return formData
        })
    }

    render() {
        const { formData, licenseNames } = this.state
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
                                        <Input disabled value="12345789" id="prependedInput" size="16" type="text" />
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
                                    <Input id="department" size="16" type="text" />
                                </InputGroup>
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
                            </FormGroup>
                            <FormGroup>
                                <Label>License Purpose</Label>
                                <CustomInput type="radio" id="licensePurpose1" name="LVFP" label="城市备案 Local VRB Filling Purpose" />
                                <CustomInput type="radio" id="licensePurpose2" name="MFP" label="城抵押 Mortgage Filling Purpose" />
                                <CustomInput type="radio" id="licensePurpose3" name="PS" label="其他 Please specify:">
                                    <Input type="text" />
                                </CustomInput>
                            </FormGroup>
                            <FormGroup>
                                <Label>Select Document Type</Label>
                                <CustomInput type="radio" id="licensePurpose1" name="SC" label="城电子版 Scan Copy" />
                                <CustomInput type="radio" id="licensePurpose2" name="OC" label="城原件 Original Copy" />
                            </FormGroup>
                            <FormGroup>
                                <Label>Watermark</Label>
                                <CustomInput type="radio" id="licensePurpose3" name="PS" label="城电. Please specify watermark here:">
                                    <Input type="text" />
                                </CustomInput>
                                <CustomInput type="radio" id="licensePurpose3" name="PS" label="城原, No. Please specify the reason of not adding watermark:">
                                    <Input type="text" />
                                </CustomInput>
                            </FormGroup>
                            <FormGroup>
                                <Label>Return Date:</Label>
                                <Input type="text" />
                            </FormGroup>
                            <FormGroup>
                                <Label>Deliver Way</Label>
                                <CustomInput type="radio" id="licensePurpose1" name="SC" label="面对面城, Face to face" />
                                <CustomInput type="radio" id="licensePurpose2" name="OC" label="快递 Express: Express Number" />
                            </FormGroup>
                            <FormGroup>
                                <Label>Address</Label>
                                <Input type="text" />
                            </FormGroup>
                            <FormGroup>
                                <Label>Reciever</Label>
                                <Input type="text" />
                            </FormGroup>
                            <FormGroup>
                                <Label>Reciever Mobile Phone</Label>
                                <Input type="text" />
                            </FormGroup>
                            <FormGroup>
                                <Label>Senior Manager or above of requestor department</Label>
                                <Input type="text" />
                            </FormGroup>
                        </Form>
                    </CardBody>
                    <CardFooter>
                        <div className="form-actions" >

                        </div>
                    </CardFooter>
                </Card>
            </div>
        )
    }

}
export default LicenseCreate