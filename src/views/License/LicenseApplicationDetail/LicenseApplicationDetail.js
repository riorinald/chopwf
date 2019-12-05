import React from 'react';
import {
    Card, CardBody, CardHeader, Table, Col, Row,
    Input,
    Button,
    FormGroup,
    Label,
    Progress,
    Spinner, UncontrolledTooltip,
    Modal, ModalBody, ModalFooter, ModalHeader
} from 'reactstrap';
import ReactTable from "react-table";
import Axios from 'axios';
import Swal from 'sweetalert2';
import LicenseApprovalHistories from './LicenseApprovalHistories';

// class LicenseApplicationDetail extends React.Component {
//     constructor(props) {
//         super(props)
//         this.state = {

//         }
//     }
const LicenseApplicationDetail = (props) => {
    // render() {
    //     return(

    return <div>
                <Card className="animated fadeIn">
                <CardHeader>
                    <Row className="align-items-left">
                        <Button className="mr-1" color="primary" onClick={() => props.goBack(this.state.updated)}><i className="fa fa-angle-left" /> Back </Button>
                        <Button className="mr-1" color="danger" onClick={() => { this.updated('Recalled') }}><i className="icon-loop" /> Recall </Button>
                        <Button className="mr-1" color="light-blue" onClick={() => { this.updated('Copy As Draft') }}><i className="fa fa-copy" /> Copy as Draft </Button>                        
                        <Button className="mr-1" color="warning" onClick={() => { this.updated('Reminded to Owner') }}><i className="icon-bell" />Remind Task Owner </Button>
                        {/* <Button className="mr-1" color="success" onClick={()=>{this.updated('Extended')}}><i className="icon-plus" /> Extend </Button> */}
                    </Row></CardHeader>
                <CardBody>
                    <Row className="mb-4">
                        <Col xs="12" md lg><span className="display-5"> {props.applications.requestNumber}</span></Col>
                        <Col sm="12 py-2" md lg>
                            <Progress multi>
                                <Progress bar color="green" value="50">{props.applications.currentStatusName}</Progress>
                                <Progress bar animated striped color="warning" value="50">{props.applications.nextStatusName}</Progress>
                            </Progress>
                        </Col>
                    </Row>
                    <Row className="mb-5">
                        <Col xs="12" sm="12" md lg className="text-md-left text-center">
                            <Row>
                                <Col xs={12} sm={12} md={4} lg={2}>
                                    <img src={'../../assets/img/avatars/5.jpg'} className="img-avaa img-responsive center-block" alt="admin@bootstrapmaster.com" />
                                </Col>
                                <Col md><h5> {props.applications.employeeName} </h5>
                                    <Row>
                                        <Col md><h6> DFS/CN, MBAFC </h6></Col>
                                    </Row>
                                    <Row>
                                        <Col xs={12} sm={12} md={6} lg={6}>
                                            <h6><center className="boxs">Applicant</center></h6>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs="12" sm="12" md lg className="text-md-left text-center">
                            <Row>
                                <Col md><h5><i className="fa fa-tablet mr-2" /> +86 10 {props.applications.telephoneNum} </h5></Col>
                            </Row>
                            <Row>
                                <Col md><h5><i className="fa fa-envelope mr-2" /> {props.applications.email}</h5></Col>
                            </Row>
                        </Col>
                    </Row>
                    <Col className="mb-5">
                        <FormGroup row className="mb-0 mb-md-4">
                            <Col md lg>
                                <Label>Employee Number</Label>
                            </Col>
                            <Col md lg>
                                <Input disabled type="text" defaultValue={props.applications.employeeNumber} name="text-input" placeholder="Text" />
                            </Col>
                            <Col md lg>
                                <Label>Department</Label>
                            </Col>
                            <Col md lg>
                                <Input disabled type="text" defaultValue={props.applications.department} name="text-input" placeholder="Text" />
                            </Col>
                        </FormGroup>
                        <FormGroup row className="mb-0 mb-md-4">
                            <Col md lg>
                                <Label>License Name</Label>
                            </Col>
                            <Col md lg>
                                <Input disabled type="text" defaultValue={props.applications.licenseName} name="text-input" placeholder="Text" />
                            </Col>
                            <Col md lg>
                                <Label>Purpose</Label>
                            </Col>
                            <Col md lg>
                                <Input disabled type="text" defaultValue={props.applications.licensePurpose} name="text-input" placeholder="Text" />
                            </Col>
                        </FormGroup>
                        <FormGroup row className="mb-0 mb-md-4">
                            <Col md lg>
                                <Label>Document Type</Label>
                            </Col>
                            <Col md lg>
                                <Input disabled type="text" defaultValue={props.applications.documentType} name="text-input" placeholder="Text" />
                            </Col>
                            <Col md lg>
                                <Label>Planned Return Date</Label>
                            </Col>
                            <Col md lg>
                                <Input disabled type="text" defaultValue={props.applications.returnDate} name="text-input" placeholder="Text" />
                            </Col>
                        </FormGroup>
                        <FormGroup row className="mb-0 mb-md-4">
                            <Col md lg>
                                <Label>Deliver Ways</Label>
                            </Col>
                            <Col md lg>
                                <Input disabled type="text" defaultValue={props.applications.deliverWays} name="text-input" placeholder="Text" />
                            </Col>
                            <Col md lg>
                                <Label>Deliver to Address</Label>
                            </Col>
                            <Col md lg>
                                <Input disabled type="text" defaultValue={props.applications.address} name="text-input" placeholder="Text" />
                            </Col>
                        </FormGroup>
                        <FormGroup row className="mb-0 mb-md-4">
                            <Col md lg>
                                <Label>Receiver</Label>
                            </Col>
                            <Col md lg>
                                <Input disabled type="text" defaultValue={props.applications.receiver} name="text-input" placeholder="Text" />
                            </Col>
                            <Col md lg>
                                <Label>Return Ways</Label>
                            </Col>
                            <Col md lg>
                                <Input disabled type="text" defaultValue={props.applications.returnWays} name="text-input" placeholder="Text" />
                            </Col>
                        </FormGroup>
                        <FormGroup row className="mb-0 mb-md-4">
                            <Col md lg>
                                <Label>Receiver Mobile Number</Label>
                            </Col>
                            <Col md lg>
                                <Input disabled type="text" defaultValue={props.applications.receiverPhone} name="text-input" placeholder="Text" />
                            </Col>
                            <Col md lg>
                                <Label>Deliver Express Number</Label>
                            </Col>
                            <Col md lg>
                                <Input disabled type="text" defaultValue={props.applications.expressNumber} name="text-input" placeholder="Text" />
                            </Col>
                        </FormGroup>
                        <FormGroup row className="mb-0 mb-md-4">
                            <Col md lg>
                                <Label>Senior Manager or above of Requestor Department</Label>
                            </Col>
                            <Col md lg>
                                <Input disabled type="text" defaultValue={props.applications.seniorManagerAbove} name="text-input" placeholder="Text" />
                            </Col>
                            <Col md lg>
                                <Label>Return Express Number</Label>
                            </Col>
                            <Col md lg>
                                <Input disabled type="text" defaultValue={props.applications.returnExpressNumber} name="text-input" placeholder="Text" />
                            </Col>
                        </FormGroup>
                    </Col>
                    <Row><Col><h4>Approval History</h4></Col></Row>
                    { props.appHistory.map(id => <LicenseApprovalHistories appHistory={id} key={id.id} />)}
                </CardBody>
            </Card>
            </div>
}

export default LicenseApplicationDetail;