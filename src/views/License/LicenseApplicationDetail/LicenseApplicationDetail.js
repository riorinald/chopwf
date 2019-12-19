import React, { Component } from 'react';
// import ReactTable from "react-table";
// import "react-table/react-table.css"
import Axios from 'axios';
import {
    Card, CardBody, CardHeader, Table, Col, Row, CardFooter,
    Input,
    Button,
    FormGroup,
    Label,
    Progress, Badge, Spinner,
    UncontrolledTooltip
} from 'reactstrap';

class LicenseApplicationDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            taskDetails: {},
            approvalHistories: [],
            redirect: false,
            loading: true,
            page: ""
        }
        this.goBack = this.goBack.bind(this)
    }

    componentDidMount() {
        if (this.props.location.state === undefined) {
            this.goBack()
        }
        else {
            this.setState({ page: this.props.match.params.page })
            this.getTaskDetails(this.props.match.params.taskId)
        }
    }


    async getTaskDetails(taskId) {
        this.setState({ loading: true })
        await Axios.get(`http://192.168.1.47/echopx/api/v1/licenses/${taskId}?userId=${localStorage.getItem("userId")}`)
            .then(res => {
                console.log(res.data)
                this.setState({ taskDetails: res.data, loading: false })
            })
    }

    goBack() {
        console.log(`/license/${this.props.match.params.page}`)
        this.props.history.push({
            pathname: `/license/${this.props.match.params.page}`
        })
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    updated(action) {
        console.log(action)
    }


    render() {
        const { taskDetails, redirect, approvalHistories, loading, page } = this.state
        return (
            <div>
                {!loading ?
                    <Card className="animated fadeIn">
                        <CardHeader>
                            <Row className="align-items-left">
                                <Button className="mr-1" color="primary" onClick={() => this.goBack()}><i className="fa fa-angle-left" /> Back </Button>
                                {page === "myapplication" ? <div>
                                    {taskDetails.actions.map((action, index) =>
                                        <Button
                                            key={index}
                                            className="mr-1"
                                            color={action.action === "recall" ? "danger" : action.action === "copy" ? "light-blue" : "warning"}
                                        >
                                            <i className={action.action === " recall" ? "icon-loop" : action.action === "copy" ? "fa fa-copy" : "icon-bell"} />
                                            {action.actionName}
                                        </Button>
                                    )}
                                </div>
                                    : null}
                            </Row></CardHeader>
                        <CardBody>
                            <Row className="mb-3" >
                                <Col className="mb-4">
                                    <Progress multi>
                                        {taskDetails.allStages.map((stage, index) =>
                                            <React.Fragment key={index}>
                                                <UncontrolledTooltip placement="top" target={"status" + index}>{stage.statusName}</UncontrolledTooltip>
                                                <Progress
                                                    className={index !== taskDetails.allStages.lastIndex ? "mr-1" : ""}
                                                    bar
                                                    animated={stage.state === "CURRENT" ? true : false}
                                                    striped={stage.state === "FINISHED"}
                                                    color={stage.state === "CURRENT" ? "green" : stage.state === "FIRSTPENDING" ? "warning" : stage.state === "FINISHED" ? "secondary" : ""}
                                                    value={100 / taskDetails.allStages.length}> <div id={"status" + index} style={{ color: stage.state === "FINISHED" ? "black" : "white" }} >{stage.statusName}</div>
                                                </Progress>
                                            </React.Fragment>
                                        )}
                                    </Progress>
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col xs="12" md lg><span className="display-5"> {taskDetails.requestNum}</span></Col>
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
                                        <Input disabled type="text" defaultValue={taskDetails.employeeNum} name="text-input" placeholder="Text" />
                                    </Col>
                                    <Col md lg>
                                        <Label>Department</Label>
                                    </Col>
                                    <Col md lg>
                                        <Input disabled type="text" defaultValue={taskDetails.departmentName} name="text-input" placeholder="Text" />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md lg>
                                        <Label>License Name</Label>
                                    </Col>
                                    <Col md lg>
                                        {/* DEFAULT VALUE IS NOT ADDED - MISSING VALUE FROM API */}
                                        <Input disabled type="text" name="text-input" placeholder="Text" />
                                    </Col>
                                    <Col md lg>
                                        <Label>Purpose</Label>
                                    </Col>
                                    <Col md lg>
                                        <Input disabled type="text" defaultValue={taskDetails.purposeType} name="text-input" placeholder="Text" />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md lg>
                                        <Label>Document Type</Label>
                                    </Col>
                                    <Col md lg>
                                        <Input disabled type="text" defaultValue={taskDetails.documentTypeId === "OC" ? "Original Copy" : "Scanned Copy"} name="text-input" placeholder="Text" />
                                    </Col>
                                    {taskDetails.documentTypeId === "OC"
                                        ? <>
                                            <Col md lg>
                                                <Label>Planned Return Date</Label>
                                            </Col>
                                            <Col md lg>
                                                <Input disabled type="text" defaultValue={taskDetails.plannedReturnDate} name="text-input" placeholder="Text" />
                                            </Col>
                                        </>
                                        : <>
                                            <Col md lg>
                                                <Label> Watermark </Label>
                                            </Col>
                                            <Col md lg>
                                                <Input disabled type="text" defaultValue={taskDetails.watermark} name="text-input" placeholder="Text" />
                                            </Col>
                                        </>
                                    }
                                </FormGroup>
                                <FormGroup row>
                                    <Col md lg>
                                        <Label>Deliver Ways</Label>
                                    </Col>
                                    <Col md lg>
                                        <Input disabled type="text" defaultValue={taskDetails.deliverWayId} name="text-input" placeholder="Text" />
                                    </Col>
                                    <Col md lg>
                                        <Label>Delivery Address</Label>
                                    </Col>
                                    <Col md lg>
                                        <Input disabled type="text" defaultValue={taskDetails.expDeliveryAddress} name="text-input" placeholder="Text" />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md lg>
                                        <Label>Receiver</Label>
                                    </Col>
                                    <Col md lg>
                                        <Input disabled type="text" defaultValue={taskDetails.expDeliveryReceiver} name="text-input" placeholder="Text" />
                                    </Col>
                                    <Col md lg>
                                        <Label>Return Ways</Label>
                                    </Col>
                                    <Col md lg>
                                        {/* DEFAULT VALUE IS NOT ADDED - MISSING VALUE FROM API */}
                                        <Input disabled type="text" name="text-input" placeholder="Text" />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md lg>
                                        <Label>Receiver Mobile Number</Label>
                                    </Col>
                                    <Col md lg>
                                        <Input disabled type="text" defaultValue={taskDetails.expDeliveryMobileNo} name="text-input" placeholder="Text" />
                                    </Col>
                                    <Col md lg>
                                        <Label>Deliver Express Number</Label>
                                    </Col>
                                    <Col md lg>
                                        {/* DEFAULT VALUE IS NOT ADDED - MISSING VALUE FROM API */}
                                        <Input disabled type="text" name="text-input" placeholder="Text" />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md lg>
                                        <Label>Senior Manager or above of Requestor Department</Label>
                                    </Col>
                                    <Col md lg>
                                        {/* DEFAULT VALUE IS NOT ADDED - MISSING VALUE FROM API */}
                                        <Input disabled type="text" name="text-input" placeholder="Text" />
                                    </Col>
                                    <Col md lg>
                                        <Label>Return Express Number</Label>
                                    </Col>
                                    <Col md lg>
                                        {/* DEFAULT VALUE IS NOT ADDED - MISSING VALUE FROM API */}
                                        <Input disabled type="text" name="text-input" placeholder="Text" />
                                    </Col>
                                </FormGroup>
                            </Col>
                            {page === "mypendingtask"
                                ? <div>
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
                                        {taskDetails.actions.map((action, index) =>
                                            <Button className="mx-1" key={index} color={action.action === "approve" ? "success" : "danger"} onClick={() => this.updated(action.action)} > {action.actionName}</Button>
                                        )}

                                    </Row>
                                </div>
                                : null}
                        </CardBody>
                        <CardFooter>
                            <Row><Col><h4>Approval History</h4></Col></Row>
                            {taskDetails.histories.map((history, index) =>
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

export default LicenseApplicationDetail