import React, { Component } from 'react';
import ReactTable from "react-table";
import "react-table/react-table.css"
import Axios from 'axios';
import {
    Card, CardBody, CardHeader, Table, Col, Row, CardFooter,
    Input,
    Button,
    FormGroup,
    Label,
    Progress, Badge, Spinner
} from 'reactstrap';

class LicenseTaskDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            taskDetails: {},
            approvalHistories: [],
            redirect: false,
            loading: false
        }
        this.goBack = this.goBack.bind(this)
    }

    componentDidMount() {
        if (this.props.location.state === undefined) {
            this.goBack()
        }
        else {
            this.getTaskDetails(this.props.match.params.taskId)
        }
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

    goBack() {
        this.props.history.push({
            pathname: '/license/mypendingtask'
        })
    }

    updated(action) {

    }


    render() {
        const { taskDetails, redirect, approvalHistories, loading } = this.state
        return (
            <div>
                {!loading ?
                    <Card className="animated fadeIn">
                        <CardHeader>
                            <Row className="align-items-left">
                                <Button className="mr-1" color="primary" onClick={() => this.goBack()}><i className="fa fa-angle-left" /> Back </Button>
                            </Row></CardHeader>
                        <CardBody>
                            <Row className="mb-3">
                                <Col xs="12" md lg><span className="display-5"> {taskDetails.requestNumber}</span></Col>
                                <Col sm="12 py-2" md lg>
                                    <Progress multi>
                                        <Progress bar color="green" value="50">{taskDetails.currentStatusName}</Progress>
                                        <Progress bar animated striped color="warning" value="50">{taskDetails.nextStatusName}</Progress>
                                    </Progress>
                                </Col>
                            </Row>
                            <Row className="mb-4">
                                <Col xs="12" sm="12" md lg className="text-md-left text-center">
                                    <Row>
                                        <Col xs={12} sm={12} md={4} lg={2}>
                                            <img src={'../../assets/img/avatars/5.jpg'} className="img-avaa img-responsive center-block" alt="admin@bootstrapmaster.com" />
                                        </Col>
                                        <Col md><h5> {taskDetails.employeeName} </h5>
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
                                        <Col md><h5><i className="fa fa-tablet mr-2" /> +86 10 {taskDetails.telephoneNum} </h5></Col>
                                    </Row>
                                    <Row>
                                        <Col md><h5><i className="fa fa-envelope mr-2" /> {taskDetails.email}</h5></Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Col className="mb-4">
                                <FormGroup row>
                                    <Col md lg>
                                        <Label>Employee Number</Label>
                                    </Col>
                                    <Col md lg>
                                        <Input disabled type="text" defaultValue={taskDetails.employeeNumber} name="text-input" placeholder="Text" />
                                    </Col>
                                    <Col md lg>
                                        <Label>Department</Label>
                                    </Col>
                                    <Col md lg>
                                        <Input disabled type="text" defaultValue={taskDetails.department} name="text-input" placeholder="Text" />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md lg>
                                        <Label>License Name</Label>
                                    </Col>
                                    <Col md lg>
                                        <Input disabled type="text" defaultValue={taskDetails.licenseName} name="text-input" placeholder="Text" />
                                    </Col>
                                    <Col md lg>
                                        <Label>Purpose</Label>
                                    </Col>
                                    <Col md lg>
                                        <Input disabled type="text" defaultValue={taskDetails.licensePurpose} name="text-input" placeholder="Text" />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md lg>
                                        <Label>Document Type</Label>
                                    </Col>
                                    <Col md lg>
                                        <Input disabled type="text" defaultValue={taskDetails.documentType} name="text-input" placeholder="Text" />
                                    </Col>
                                    <Col md lg>
                                        <Label>Planned Return Date</Label>
                                    </Col>
                                    <Col md lg>
                                        <Input disabled type="text" defaultValue={taskDetails.returnDate} name="text-input" placeholder="Text" />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md lg>
                                        <Label>Deliver Ways</Label>
                                    </Col>
                                    <Col md lg>
                                        <Input disabled type="text" defaultValue={taskDetails.deliverWays} name="text-input" placeholder="Text" />
                                    </Col>
                                    <Col md lg>
                                        <Label>Deliver to Address</Label>
                                    </Col>
                                    <Col md lg>
                                        <Input disabled type="text" defaultValue={taskDetails.address} name="text-input" placeholder="Text" />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md lg>
                                        <Label>Receiver</Label>
                                    </Col>
                                    <Col md lg>
                                        <Input disabled type="text" defaultValue={taskDetails.receiver} name="text-input" placeholder="Text" />
                                    </Col>
                                    <Col md lg>
                                        <Label>Return Ways</Label>
                                    </Col>
                                    <Col md lg>
                                        <Input disabled type="text" defaultValue={taskDetails.returnWays} name="text-input" placeholder="Text" />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md lg>
                                        <Label>Receiver Mobile Number</Label>
                                    </Col>
                                    <Col md lg>
                                        <Input disabled type="text" defaultValue={taskDetails.receiverPhone} name="text-input" placeholder="Text" />
                                    </Col>
                                    <Col md lg>
                                        <Label>Deliver Express Number</Label>
                                    </Col>
                                    <Col md lg>
                                        <Input disabled type="text" defaultValue={taskDetails.expressNumber} name="text-input" placeholder="Text" />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md lg>
                                        <Label>Senior Manager or above of Requestor Department</Label>
                                    </Col>
                                    <Col md lg>
                                        <Input disabled type="text" defaultValue={taskDetails.seniorManagerAbove} name="text-input" placeholder="Text" />
                                    </Col>
                                    <Col md lg>
                                        <Label>Return Express Number</Label>
                                    </Col>
                                    <Col md lg>
                                        <Input disabled type="text" defaultValue={taskDetails.returnExpressNumber} name="text-input" placeholder="Text" />
                                    </Col>
                                </FormGroup>
                            </Col>
                            <Row>
                                <Col> <h4>Comments</h4></Col>
                            </Row>
                            <Row>
                                <Col >
                                    <Input type="textarea" ></Input>
                                </Col>
                            </Row>
                            <Row>
                                <Col>&nbsp;</Col>
                            </Row>
                            <Row>
                                <Col md="1">
                                    <Button color="success" >Approve</Button>
                                </Col>
                                <Col>
                                    <Button color="danger" >Reject</Button>
                                </Col>
                            </Row>
                        </CardBody>
                        <CardFooter>
                            <Row><Col><h4>Approval History</h4></Col></Row>
                            {approvalHistories.map((history, index) =>
                                <div key={index}>
                                    <Row className="bottom-border"></Row>
                                    <Row>
                                        <Col md="1">
                                            <img src={history.avatar} className="img-avatar" alt="Avatar" />
                                        </Col>
                                        <Col md="8">
                                            <h5>{history.name} (000)<span> <Badge color="success">{history.status}</Badge></span></h5>
                                            <div><b>Approved On:</b> {history.updatedAt}</div>
                                            <small>{history.comments}</small>
                                        </Col>
                                    </Row>
                                </div>
                            )}
                        </CardFooter>
                    </Card>
                    : <div style={{ textAlign: "center" }} ><Spinner size="md" style={{ width: '3rem', height: '3rem' }} ></Spinner></div>
                }
            </div>)
    }
}

export default LicenseTaskDetails