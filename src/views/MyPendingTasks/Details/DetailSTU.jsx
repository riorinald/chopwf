import React from 'react';
import {
    Card, CardBody, CardHeader, Table, Col, Row,
    Input,
    Button,
    FormGroup,
    Label,
    Progress,
    Badge,
    Modal, ModalBody, ModalFooter, ModalHeader
} from 'reactstrap';
import ReactTable from "react-table";
import "react-table/react-table.css"

let rendered = 0

const DetailSTU = (props) => {

    if (rendered === 0) {
       props.getTaskDetails(props.taskId)
    }
    rendered = rendered + 1

    return <div>
        <Card >
            <CardHeader> <Button onClick={props.collapse} > Back &nbsp; </Button>  {props.taskDetail.requestNum} </CardHeader>
            <CardBody color="dark">
                <Row noGutters={true}>
                    <Col md="6"><span className="display-5"> {props.taskDetail.requestNum}</span></Col>
                    <Col md="6">
                        <Progress multi>
                            <Progress bar color="green" value="50">{props.taskDetail.currentStatusName}</Progress>
                            <Progress bar animated striped color="warning" value="50">{props.taskDetail.nextStatusName}</Progress>
                        </Progress>
                    </Col>
                </Row>
                <Row>&nbsp;</Row>
                <Row>
                    <Col md="1">
                        <img src={'../../assets/img/avatars/5.jpg'} className="img-avaa" alt="admin@bootstrapmaster.com" />
                    </Col>
                    <Col>
                        <Row>
                            <Col md="5"><h5> {props.taskDetail.employeeName} </h5></Col>
                            <Col md="5"><h5><i className="fa fa-tablet" />&nbsp; {props.taskDetail.telephoneNum} </h5></Col>
                        </Row>
                        <Row >
                            <Col md="4"><h6> DFS/CN, {props.legalName} </h6></Col>
                        </Row>
                        <Row >
                            <Col md="3">
                                <h6><center className="boxs">Applicant</center></h6>
                            </Col>
                            <Col md="2"></Col>
                            <Col md="4"><h5><i className="fa fa-envelope" />&nbsp; {props.taskDetail.email}</h5></Col>
                        </Row>
                    </Col>
                </Row>
                <Row><Col>
                    &nbsp;
         </Col></Row>
                <Row>
                    <Col>
                        <FormGroup row>
                            <Col md="4">
                                <Label htmlFor="text-input">Employee Number</Label>
                            </Col>
                            <Col xs="12" md="8">
                                <Input disabled type="text" value={props.taskDetail.employeeNum} id="text-input" name="text-input" placeholder="Text" />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col md="4">
                                <Label htmlFor="text-input">Dept</Label>
                            </Col>
                            <Col xs="12" md="8">
                                <Input disabled type="text" value={props.taskDetail.departmentName} id="text-input" name="text-input" placeholder="Text" />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col md="4">
                                <Label htmlFor="text-input">Chop Type</Label>
                            </Col>
                            <Col xs="12" md="8">
                                <Input disabled type="text" id="text-input" value={props.taskDetail.chopTypeName} name="text-input" placeholder="Text" />
                            </Col>
                        </FormGroup>
                        {props.taskDetail.branchName !== ""
                            ? <FormGroup row>
                                <Col md="4">
                                    <Label htmlFor="text-input">Branch Company Chop</Label>
                                </Col>
                                <Col xs="12" md="8">
                                    <Input disabled type="text" id="text-input" value={props.taskDetail.branchName} name="text-input" placeholder="Text" />
                                </Col>
                            </FormGroup>
                            : ""
                        }

                        <FormGroup row>
                            <Col md="4">
                                <Label htmlFor="text-input">Use in Office or not</Label>
                            </Col>
                            <Col xs="12" md="8">
                                <Input disabled type="text" id="text-input" value={props.taskDetail.isUseInOffice === "Y" ? "Yes" : "No"} name="text-input" placeholder="Text" />
                            </Col>
                        </FormGroup>
                        {props.taskDetail.isUseInOffice === "N"
                            ? <FormGroup row>
                                <Col md="4">
                                    <Label htmlFor="text-input">Return Date</Label>
                                </Col>
                                <Col xs="12" md="8">
                                    <Input disabled type="text" id="text-input" value={props.taskDetail.returnDate} name="text-input" placeholder="Text" />
                                </Col>
                            </FormGroup>

                            : ""}
                        {props.taskDetail.isUseInOffice === "N"
                            ? <FormGroup row>
                                <Col md="4">
                                    <Label htmlFor="text-input">Responsible Person</Label>
                                </Col>
                                <Col xs="12" md="8">
                                    <Input disabled type="text" id="text-input" value={props.taskDetail.responsiblePersonNameName} name="text-input" placeholder="Text" />
                                </Col>
                            </FormGroup>

                            : ""}

                        <FormGroup row>
                            <Col md="4">
                                <Label htmlFor="text-input">Pick Up By</Label>
                            </Col>
                            <Col xs="12" md="8">
                                <Input disabled type="text" id="text-input" value={props.taskDetail.pickUpBy} name="text-input" placeholder="Text" />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col md="4">
                                <Label htmlFor="text-input">Confirm</Label>
                            </Col>
                            <Col xs="12" md="8">
                                <Input disabled type="text" id="text-input" value={props.taskDetail.isConfirm === "Y" ? "Yes" : "No"} name="text-input" placeholder="Text" />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col md="4">
                                <Label htmlFor="text-input">Tel</Label>
                            </Col>
                            <Col xs="12" md="8">
                                <Input disabled type="text" value={props.taskDetail.telephoneNum} id="text-input" name="text-input" placeholder="Text" />
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col>

                        <FormGroup row>
                            <Col md="4">
                                <Label htmlFor="text-input">Application Type</Label>
                            </Col>
                            <Col xs="12" md="8">
                                <Input disabled type="text" value={props.taskDetail.applicationTypeName} id="text-input" name="text-input" placeholder="Text" />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col md="4">
                                <Label htmlFor="text-input">Connecting Chop</Label>
                            </Col>
                            <Col xs="12" md="8">
                                <Input disabled type="text" value={props.taskDetail.connectChop === "Y" ? "Yes" : "No"} id="text-input" name="text-input" placeholder="Text" />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col md="4">
                                <Label htmlFor="text-input">Purpose of Use</Label>
                            </Col>
                            <Col xs="12" md="8">
                                <Input disabled type="text" value={props.taskDetail.purposeOfUse} id="text-input" name="text-input" placeholder="Text" />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col md="4">
                                <Label htmlFor="text-input">Number of Pages to Be Chopped </Label>
                            </Col>
                            <Col xs="12" md="8">
                                <Input disabled type="text" value={props.taskDetail.numOfPages} id="text-input" name="text-input" placeholder="Text" />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col md="4">
                                <Label htmlFor="text-input">Address to</Label>
                            </Col>
                            <Col xs="12" md="8">
                                <Input disabled type="text" value={props.taskDetail.addressTo} id="text-input" name="text-input" placeholder="Text" />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col md="4">
                                <Label htmlFor="text-input">Remark (e.g. tel.)</Label>
                            </Col>
                            <Col xs="12" md="8">
                                <Input disabled type="text" value={props.taskDetail.remark} id="text-input" name="text-input" placeholder="Text" />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col md="4">
                                <Label htmlFor="text-input">Department Heads</Label>
                            </Col>
                            <Col xs="12" md="8">
                                <Input disabled type="text" value={props.taskDetail.departmentHeadName} id="text-input" name="text-input" placeholder="Text" />
                            </Col>
                        </FormGroup>

                    </Col>
                </Row>
                <Row>
                    <FormGroup>
                        <Col>
                            <Label htmlFor="text-input">Documents</Label>
                        </Col>
                        <Col>

                            <Button color="primary" onClick={props.toggleView}>View Documents</Button>

                            <Modal color="info" size="xl" toggle={props.toggleView} isOpen={props.showModal} >
                                <ModalHeader className="center"> Documents </ModalHeader>
                                <ModalBody>
                                    <ReactTable
                                        data={props.taskDetail.documentNames}
                                        sortable
                                        columns={[
                                            {
                                                Header: "#",
                                                Cell: row => (
                                                    <div>{row.index + 1}</div>
                                                ),
                                                width: 40,
                                                style: { textAlign: "center" }
                                            },
                                            {
                                                Header: "Document Name (English)",
                                                accessor: "documentNameEnglish",
                                                width: 250,
                                                style: { textAlign: "center" },
                                            },
                                            {
                                                Header: "Document Name (Chinese)",
                                                accessor: "documentNameChinese",
                                                width: 250,
                                                style: { textAlign: "center" },
                                            },
                                            {
                                                Header: "Attached Document",
                                                accessor: "documentName",
                                                Cell: row => (
                                                <a href={row.original.documentUrl} target='_blank' rel="noopener noreferrer">{row.original.documentName}</a>
                                                ),
                                                style: { textAlign: "center" },
                                            },
                                        ]}
                                        defaultPageSize={5}
                                    />
                                </ModalBody>
                                <ModalFooter>
                                </ModalFooter>
                            </Modal>
                        </Col>
                    </FormGroup>
                </Row>
                <Row>
                    <Col> <h4>Comments</h4></Col>
                </Row>
                <Row>
                    <Col>
                        <Input type="textarea"></Input>
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col  >
                        <Button color="success" onClick={() => props.approve("approve")} >Approve</Button>&nbsp;
                                    <Button color="danger" onClick={() => props.approve("sendBack")} >Send Back</Button>&nbsp;
                                    <Button color="danger" onClick={() => props.approve("reject")}>Reject</Button>&nbsp;
                                    </Col>

                </Row>
                <Row><Col>
                    &nbsp;
         </Col></Row>
                <Row>
                    <Col> <h4>Approval Histories</h4></Col>
                </Row>
                <Row className="bottom-border">&nbsp;</Row>
                <Row>
                    <Col md="1">
                        <img src={'../../assets/img/avatars/5.jpg'} className="img-avatar" alt="admin@bootstrapmaster.com" />
                    </Col>
                    <Col md="8">
                        <h5>lastname, firstname (000)<span> <Badge color="success">Status</Badge></span></h5>
                        <small>dd/mm/yyyy 00:00 AM</small>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    </div >

}

export default DetailSTU;