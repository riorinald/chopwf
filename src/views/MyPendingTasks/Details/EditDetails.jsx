import React from 'react';
import {
    Card, CardBody, CardHeader, Table, Col, Row, CardFooter,
    Input,
    Button,
    FormGroup,
    Label,
    Progress,
    Badge,
    Collapse,
    Form, InputGroup, InputGroupAddon, InputGroupText, FormFeedback,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    CustomInput,
} from 'reactstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { addDays } from 'date-fns';
import ReactDataGrid from 'react-data-grid';
import InputMask from "react-input-mask";
import deleteBin from '../../../assets/img/deletebin.png'
import { AppSwitch } from '@coreui/react';
import AsyncSelect from 'react-select/async';
import makeAnimated from 'react-select/animated';
import config from '../../../config';



const notes = <p>如您需申请人事相关的证明文件包括但不限于“在职证明”，“收入证明”，“离职证明”以及员工福利相关的申请材料等，请直接通过邮件提交您的申请至人力资源部。如对申请流程有任何疑问或问题，请随时联系HR。
  For HR related certificates including but not limited to the certificates of employment, income, resignation and benefits-related application materials, please submit your requests to HR department by email directly.
  If you have any questions regarding the application process, please feel free to contact HR. </p>;

const reactSelectControl = {
    control: styles => ({ ...styles, borderColor: '#F86C6B', boxShadow: '0 0 0 0px #F86C6B', ':hover': { ...styles[':hover'], borderColor: '#F86C6B' } }),
    menuPortal: base => ({ ...base, zIndex: 9999 })
}

const animatedComponents = makeAnimated();

const defaultColumnProperties = {
    resizable: true
};

const docHeaders = [
    { key: 'documentNameEnglish', name: 'Document Name (English)' },
    { key: 'documentNameChinese', name: 'Document Name (Chinese)' },
    { key: 'expiryDate', name: 'Expiry Date' },
    { key: 'dhApproved', name: 'DH Approved' },
].map(c => ({ ...c, ...defaultColumnProperties }))

let rendered = 0

const EditDetails = props => {

    let deptHeadsTemp = props.deptHeads

    const filterColors = (inputValue) => {
        return deptHeadsTemp.filter(i =>
            i.label.toLowerCase().includes(inputValue.toLowerCase())
        );
    };

    const loadOptionsDept = (inputValue, callback) => {
        callback(filterColors(inputValue));

    }

    let selected = props.requestForm.departmentHeads
    let selectedDeptHeads = []
    selected.map(select => {
        let temp = ""
        for (let i = 0; i < deptHeadsTemp.length; i++) {
            if (select === deptHeadsTemp[i].value) {
                temp = deptHeadsTemp[i]
                selectedDeptHeads.push(temp)
                break;
            }
        }
    })

    // console.log(rendered)
    if (rendered === 0) {
        props.getData("departments", `${config.url}/departments`)
        props.getDeptHeads()
        props.getData("chopTypes", `${config.url}/choptypes?companyid=${props.legalName}&apptypeid=${props.requestForm.applicationTypeId}`);
        if (props.requestForm.applicationTypeId === "LTU") {
            this.getDocuments(props.legalName, props.requestForm.departmentId, props.requestForm.chopTypeId, props.requestForm.teamId)

            if (props.requestForm.departmentId !== "" && props.requestForm.chopTypeId !== "" && props.requestForm.teamId !== "") {
                this.getDocuments(props.legalName, props.requestForm.departmentId, props.requestForm.chopTypeId, props.requestForm.teamId)
            }
        }
    }
    rendered = rendered + 1


    return <div>
        <Card >
            <CardHeader> <Button onClick={props.collapse} > Back </Button> &nbsp; EDIT REQUEST - {props.requestForm.requestNum} </CardHeader>
            <CardBody color="dark">
                <FormGroup>
                    <h5>NOTES :</h5>
                    {notes}
                </FormGroup>
                <Form className="form-horizontal">
                    <FormGroup>
                        <Label>Request Number</Label>
                        <InputGroup>
                            <Input disabled value={props.requestForm.requestNum}></Input>
                        </InputGroup>
                    </FormGroup>
                    <FormGroup>
                        <Label>Employee Number
                        <span> <i> &ensp; Requestor of chop usage needs to be permanent staff. Intern or external staff's application will NOT be accepted</i> </span>
                        </Label>
                        <div className="controls">
                            <InputGroup className="input-prepend">
                                <InputGroupAddon addonType="prepend">
                                    <InputGroupText>ID</InputGroupText>
                                </InputGroupAddon>
                                <Input disabled id="prependedInput" value={props.requestForm.employeeNum} size="16" type="text" />
                            </InputGroup>
                            {/* <p className="help-block">Here's some help text</p> */}
                        </div>
                    </FormGroup>
                    <FormGroup>
                        <Label>Tel. </Label>
                        <InputGroup>
                            <Input onChange={props.handleChange("telNumber")} value={props.requestForm.telephoneNum} id="appendedInput" size="16" type="text" />
                        </InputGroup>
                    </FormGroup>
                    <FormGroup>
                        <Label>Dept</Label>
                        <Input id="deptSelected" type="select" value={props.requestForm.departmentId} onChange={props.handleChange("departmentId")} name="dept">
                            {props.departments.map((option, index) => (
                                <option value={option.deptId} key={option.deptId}>
                                    {option.deptName}

                                </option>
                            ))}
                        </Input>
                        <FormFeedback>Invalid Departement Selected</FormFeedback>
                    </FormGroup>
                    <FormGroup>
                        <Label>Application Type</Label>
                        <Input disabled type="text"
                            id="appTypeSelected" value={props.requestForm.applicationTypeName} name="appType">
                        </Input>
                    </FormGroup>

                    {props.requestForm.applicationTypeId === "LTU"
                        ? <FormGroup>
                            <Label>Effective Period</Label>
                            {/* <Input type="date" onChange={this.handleChange("effectivePeriod")} id="effectivePeriod"></Input> */}
                            <DatePicker id="effectivePeriod" placeholderText="YYYY/MM/DD" popperPlacement="auto-center" showPopperArrow={false} todayButton="Today"
                                className="form-control" required dateFormat="yyyy/MM/dd" withPortal
                                peekNextMonth
                                showMonthDropdown
                                showYearDropdown
                                selected={props.dateView1}
                                onChange={props.dateChange("effectivePeriod", "dateView1")}
                                minDate={new Date()} maxDate={addDays(new Date(), 365)} />
                            <FormFeedback>Invalid Date Selected</FormFeedback>
                        </FormGroup>
                        : ""
                    }
                    {/* {props.requestForm.applicationTypeId === "LTU"
                        ? <FormGroup>
                            <Label>Entitled Team</Label>
                            <InputGroup>
                                <Input onChange={props.handleChange("teamId")} defaultValue={props.taskDetail.teamName} type="select">
                                    {props.teams.map((team, index) =>
                                        <option key={index} value={team.teamId}>{team.teamName}</option>
                                    )}
                                </Input>
                                <FormFeedback>Invalid Entitled Team Selected</FormFeedback>
                            </InputGroup>
                        </FormGroup>
                        : ""
                    } */}
                    <FormGroup>
                        <Label>Chop Type</Label>
                        <Input type="select" id="chopTypeSelected"
                            // onClick={() => { props.getChopTypes(props.legalName, props.taskDetail.appTypeSelected) }}
                            onChange={props.handleChange("chopTypeId")} defaultValue={props.requestForm.chopTypeId} name="chopType" >
                            {props.chopTypes.map((option, id) => (
                                <option key={option.chopTypeId} value={option.chopTypeId}>{option.chopTypeName}</option>
                            ))}

                        </Input>
                        <FormFeedback>Invalid Chop Type Selected</FormFeedback>
                    </FormGroup>


                    <FormGroup check={false}>
                        <Label>Document Name</Label>
                        {props.requestForm.applicationTypeId === "LTU"
                            ? <div>
                                <InputGroup >
                                    <InputGroupAddon addonType="prepend">
                                        <Button color="primary" onClick={props.selectDocument}>Select Documents</Button>
                                    </InputGroupAddon>
                                    <Input id="documentTableLTU" disabled />
                                    <FormFeedback>Invalid Input a valid Document Name</FormFeedback>
                                </InputGroup>
                                <Modal color="info" size="xl" toggle={props.selectDocument} isOpen={props.showDoc} >
                                    <ModalHeader className="center"> Select Documents </ModalHeader>
                                    <ModalBody>
                                        <ReactDataGrid
                                            columns={docHeaders}
                                            rowGetter={i => props.documents[i]}
                                            rowsCount={props.documents.length}
                                            minWidth={1100}
                                            rowScrollTimeout={null}
                                            enableRowSelect={true}
                                            onRowSelect={props.addDocCheck}
                                            onColumnResize={(idx, width) =>
                                                console.log('Column' + idx + ' has been resized to ' + width)}
                                            minColumnWidth={100}


                                        />
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="primary" block size="md" onClick={() => { props.addDocumentLTU(); props.selectDocument() }}>  Add </Button>
                                    </ModalFooter>
                                </Modal>

                                <Collapse isOpen={props.requestForm.documentNames.length !== 0}>
                                    <div>
                                        <br />
                                        <Label>Documents</Label>
                                        <Table bordered>
                                            <thead>
                                                <tr>
                                                    <th>No.</th>
                                                    <th>Document Name (English)</th>
                                                    <th>Document Name (Chinese)</th>
                                                    <th>Expiry Date</th>
                                                    <th>DH Approved</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {props.requestForm.documentNames.map((document, index) =>
                                                    <tr key={index}>
                                                        <th>{index + 1}</th>
                                                        <th>{document.documentNameEnglish}</th>
                                                        <th>{document.documentNameChinese}</th>
                                                        <th id="viewDoc">
                                                            <a href={document.documentUrl} target='_blank' rel="noopener noreferrer">{document.expiryDate}</a>
                                                        </th>
                                                        <th id="viewDoc">
                                                            <a href={document.documentUrl} target='_blank' rel="noopener noreferrer">{document.dhApproved}</a>
                                                        </th>
                                                        <th><img width="25px" onClick={() => props.deleteDocument("documentTableLTU", index)} src={deleteBin} /></th>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </Table>
                                    </div>
                                </Collapse>
                            </div>
                            : <div id="documentTableLTI">
                                <Row form>

                                    {props.requestForm.applicationTypeId === "CNIPS"
                                        ? <Col ><FormGroup>
                                            <InputMask placeholder="enter contract number" mask="*-*-*-9999-9999" className="form-control" defaultValue={props.requestForm.contractNum} onChange={props.handleChange("contractNum")}></InputMask>
                                        </FormGroup></Col>
                                        : ""}

                                    <Col md>
                                        <FormGroup>
                                            {/* <Label>English Name</Label> */}
                                            <Input value={props.editRequestForm.engName} onChange={props.handleDocumentChange("engName")} type="text" name="textarea-input" id="docName" rows="3" placeholder="please describe in English" />
                                        </FormGroup>
                                    </Col>
                                    <Col md>
                                        <FormGroup>
                                            {/* <Label>Chinese Name</Label> */}
                                            <Input value={props.editRequestForm.cnName} onChange={props.handleDocumentChange("cnName")} type="text" name="textarea-input" id="cnName" rows="3" placeholder="please describe in Chinese" />
                                        </FormGroup>
                                    </Col>
                                    <Col md>
                                        <FormGroup>
                                            {/* <Label>File Name</Label> */}
                                            <CustomInput id="docFileName" onChange={props.uploadDocument} type="file" bsSize="lg" color="primary" label={props.editRequestForm.docAttachedName} />
                                        </FormGroup>
                                    </Col>
                                    <Col xl={1}>
                                        <FormGroup>
                                            {/* <Label></Label> */}
                                            <Button block onClick={props.addDocumentLTI}>Add</Button>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Collapse isOpen={props.requestForm.documentNames.length !== 0}>
                                    <div>
                                        <Table bordered>
                                            <thead>
                                                <tr>
                                                    <th>No.</th>
                                                    <th>Document Name in English</th>
                                                    <th>Document Name in Chinese</th>
                                                    <th>Attached File</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {props.requestForm.documentNames.map((document, index) =>
                                                    <tr key={index}>
                                                        <th>{index + 1}</th>
                                                        <th>{document.documentNameEnglish}</th>
                                                        <th>{document.documentNameChinese}</th>
                                                        <th id="viewDoc">
                                                            <a href={document.documentUrl} target='_blank' rel="noopener noreferrer">{document.documentName}</a>
                                                        </th>
                                                        <th><img width="25px" onClick={() => props.deleteDocument("documentTableLTI", index)} src={deleteBin} /></th>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </Table></div>
                                </Collapse>
                            </div>}
                    </FormGroup>
                    <FormGroup>
                        <Label>Purpose of Use</Label>
                        <InputGroup>
                            <Input onChange={props.handleChange("purposeOfUse")} value={props.requestForm.purposeOfUse} placeholder="Enter the Purpose of Use" type="textarea" name="textarea-input" id="purposeOfUse" rows="3" />
                            <FormFeedback>Please input the purpose of use</FormFeedback>
                        </InputGroup>
                    </FormGroup>

                    {!props.requestForm.applicationTypeId === "LTI"
                        ? <FormGroup>
                            <Label>Connecting Chop (骑缝章) </Label>
                            <Row />
                            <AppSwitch dataOn={'yes'} onChange={props.toggleConnection} checked={props.requestForm.connectChop === "Y"} dataOff={'no'} className={'mx-1'} variant={'3d'} color={'primary'} outline={'alt'} label></AppSwitch>
                        </FormGroup>
                        : ""}
                    <FormGroup>
                        <Label>Number of Pages to Be Chopped</Label>
                        <InputGroup>
                            <Input onChange={props.handleChange("numOfPages")} value={props.requestForm.numOfPages} id="numOfPages" size="16" type="number" min="0" />
                            <FormFeedback>Invalid Number of pages </FormFeedback>
                        </InputGroup>
                    </FormGroup>

                    <FormGroup>
                        <Label>Use in Office or Not</Label>
                        <Row />
                        <AppSwitch onChange={props.toggleUIO} checked={props.requestForm.isUseInOffice === "Y"} id="useOff" className={'mx-1'} variant={'3d'} color={'primary'} outline={'alt'} label dataOn={'yes'} dataOff={'no'} />
                    </FormGroup>
                    <Collapse isOpen={!props.editRequestForm.collapseUIO}>
                        <FormGroup visibelity="false" >
                            <Label>Return Date</Label>
                            <Row />
                            <DatePicker id="returnDate" placeholderText="YYYY/MM/DD" popperPlacement="auto-center" showPopperArrow={false} todayButton="Today"
                                className="form-control" required dateFormat="yyyy/MM/dd" withPortal
                                selected={props.dateView2}
                                onChange={props.dateChange("returnDate", "dateView2")}
                                minDate={new Date()} maxDate={addDays(new Date(), 365)} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Responsible Person <i className="fa fa-user" /></Label>
                            <AsyncSelect id="resPerson"
                                classNamePrefix="rs"
                                loadOptions={loadOptionsDept}
                                value={deptHeadsTemp[props.requestForm.responsiblePersonOption]}
                                onChange={props.handleSelectOption("responsiblePerson")}
                                menuPortalTarget={document.body}
                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                            />
                        </FormGroup>
                    </Collapse>
                    <FormGroup>
                        <Label>Address to</Label>
                        <InputGroup>
                            <Input onChange={props.handleChange("addressTo")} value={props.requestForm.addressTo} type="textarea" name="textarea-input" id="addressTo" rows="5" placeholder="Documents will be addressed to" />
                            <FormFeedback>Invalid person to address to</FormFeedback>
                        </InputGroup>
                    </FormGroup>
                    <FormGroup>
                        <Label>Pick Up By <i className="fa fa-user" /> </Label>
                        <AsyncSelect
                            id="pickUpBy"
                            loadOptions={loadOptionsDept}
                            value={deptHeadsTemp[props.requestForm.pickUpByOption]}
                            onChange={props.handleSelectOption("pickUpBy")}
                            menuPortalTarget={document.body}
                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                        />
                        <InputGroup>
                            <FormFeedback>Please enter a valid name to search</FormFeedback>
                        </InputGroup>
                    </FormGroup>
                    <FormGroup>
                        <Label>Remark</Label>
                        <InputGroup>
                            <Input onChange={props.handleChange("remark")} value={props.requestForm.remark} id="remarks" size="16" type="textbox" placeholder="Please enter the remarks" />
                            <FormFeedback>Please add remarks</FormFeedback>
                        </InputGroup>
                    </FormGroup>

                    {props.requestForm.applicationTypeId === "CNIPS"
                        ? <FormGroup>
                            <Label>Contract Signed By: <i className="fa fa-user" /></Label>
                            <small> &ensp; Please fill in the DHs who signed the contract and keep in line with MOA; If for Direct Debit Agreements, Head of FGS and Head of Treasury are needed for approval</small>
                            <Row>
                                <Col>
                                    <AsyncSelect
                                        id="contractSign1"
                                        loadOptions={loadOptionsDept}
                                        value={deptHeadsTemp[props.requestForm.contractSignedByFirstPersonOption]}
                                        onChange={props.handleSelectOption("contractSignedByFirstPerson")}
                                        menuPortalTarget={document.body}
                                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                    />
                                    <InputGroup>
                                    </InputGroup>
                                </Col>
                                <Col>
                                    <AsyncSelect
                                        id="contractSign2"
                                        loadOptions={loadOptionsDept}
                                        value={deptHeadsTemp[props.requestForm.contractSignedBySecondPersonOption]}
                                        onChange={props.handleSelectOption("contractSignedBySecondPerson")}
                                        menuPortalTarget={document.body}
                                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                    />
                                    <InputGroup>
                                    </InputGroup>
                                </Col>
                            </Row>
                        </FormGroup>

                        : props.requestForm.applicationTypeId === "LTU"
                            ? <FormGroup>
                                <Label>Document Check By <i className="fa fa-user" /></Label>
                                <AsyncSelect
                                    id="docCheckBySelected"
                                    menuPortalTarget={document.body}
                                    onChange={props.handleSelectOption("documentCheckBy")}
                                    loadOptions={loadOptionsDept}
                                    value={deptHeadsTemp[props.requestForm.documentCheckByOption]}
                                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }} />
                            </FormGroup>
                            : <FormGroup>
                                <Label>Department Heads <i className="fa fa-user" /></Label>
                                <small> &ensp; If you apply for {props.legalName} Company Chop, then Department Head shall be from {props.legalName} entity</small>
                                <AsyncSelect
                                    id="deptHeadSelected"
                                    loadOptions={loadOptionsDept}
                                    isMulti
                                    value={selectedDeptHeads}
                                    onChange={props.handleSelectOption("departmentHeads")}
                                    menuPortalTarget={document.body}
                                    components={animatedComponents}
                                    styles={props.requestForm.deptHeadSelected === null ? reactSelectControl : ""} />
                                {props.requestForm.deptHeadSelected === null
                                    ? <small style={{ color: '#F86C6B' }}>Please select a Department Head</small>
                                    : ""
                                }
                            </FormGroup>
                    }

                    <Col md="16">
                        <FormGroup check>
                            <FormGroup>
                                <CustomInput
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={props.requestForm.isConfirm}
                                    onChange={props.handleAgreeTerm}
                                    // onClick={this.isValid}
                                    id="confirm" value="option1">
                                    <Label className="form-check-label" check >
                                        By ticking the box, I confirm that I hereby acknowledge that I must comply the internal Policies and Guidelines &
                                        regarding chop management and I will not engage in any inappropriate chop usage and other inappropriate action
                      </Label>
                                </CustomInput>
                            </FormGroup>
                        </FormGroup>
                    </Col>
                </Form>
            </CardBody>
            <CardFooter>
                <div className="form-actions">
                    <Row>
                        {props.requestForm.isConfirm
                            ? <Button type="submit" color="success" onClick={() => { props.submitRequest('Y') }}>Submit</Button>
                            : <Button type="submit" color="success"
                                // onMouseEnter={() => this.setState({ tooltipOpen: !this.state.tooltipOpen })}
                                id="disabledSubmit" disabled >Submit</Button>}
                        {/* <Tooltip placement="left" isOpen={this.state.tooltipOpen} target="disabledSubmit"> */}
                        {/* please confirm the agree terms </Tooltip> */}
                        <span>&nbsp;</span>
                        <Button type="submit" color="primary" onClick={() => { props.submitRequest('N') }}>Save</Button>
                    </Row>

                    {/* </div>
            <div className="form-actions"> */}
                </div>
            </CardFooter>
        </Card>
    </div>
}

export default EditDetails;