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
    UncontrolledTooltip, CustomInput, Collapse
} from 'reactstrap';
import config from '../../../config';
import Swal from 'sweetalert2';

class LicenseApplicationDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            taskDetails: {},
            approvalHistories: [],
            redirect: false,
            loading: true,
            page: "",
            comments: "",
            currentStatus: "",
            deliverWay: "",
            expressNumber: "",
            comments: "",
            documents: [],
        }
        this.goBack = this.goBack.bind(this)
        this.handleRadio = this.handleRadio.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.uploadDocument = this.uploadDocument.bind(this)
    }

    componentDidMount() {
        if (this.props.location.state === undefined) {
            this.goBack()
        }
        else {
            this.setState({ page: this.props.match.params.page })
            this.getTaskDetails(this.props.location.state.taskId)
        }
    }


    async getTaskDetails(taskId) {
        this.setState({ loading: true })
        await Axios.get(`http://192.168.1.47/echopx/api/v1/licenses/${taskId}?userId=${localStorage.getItem("userId")}`)
            .then(res => {
                console.log(res.data)
                let currentStatusArr = res.data.allStages.filter(stage => stage.state === "CURRENT")
                this.setState({ taskDetails: res.data, currentStatus: currentStatusArr[0].statusId, loading: false, })
            })
    }

    goBack() {
        console.log(`/license/${this.props.match.params.page}`)
        this.props.history.push({
            pathname: `/license/${this.props.match.params.page}`
        })
    }


    convertDate(dateValue) {
        let regEx = dateValue.replace(/(\d{4})(\d{2})(\d{2})/g, '$1/$2/$3')
        return regEx
    }

    convertMgrs(data) {
        let temp = ""
        data.map(key => {
            temp = temp + key.label + "; "
        })
        return temp
    }

    validate() {
        let valid = false
        if (this.state.currentStatus === "PENDINGLICENSEADMIN") {
            if (this.state.taskDetails.documentTypeId === "ORIGINAL") {
                if (this.state.deliverWay === "Express") {
                    if (this.state.expressNumber !== "") {
                        valid = true
                    }
                    else {
                        valid = false
                        Swal.fire({
                            title: "No Express Number",
                            html: "Please add Express Number !",
                            type: "warning"
                        })
                    }
                }
                else if (this.state.deliverWay === "F2F") {
                    valid = true
                }
                else {
                    valid = false
                    Swal.fire({
                        title: "No Delivery Way Selected",
                        html: "Please select a way of delivery !",
                        type: "warning"
                    })
                }
            }
            else if (this.state.taskDetails.documentTypeId === "SCANCOPY") {
                if (this.state.documents.length !== 0) {
                    valid = true
                }
                else {
                    valid = false
                    Swal.fire({
                        title: "No Documents attached",
                        html: "Please attach documents for approval !",
                        type: "warning"
                    })
                }
            }

            // else {
            //     valid = false
            //     Swal.fire({
            //         title: "No Delivery Way Selected",
            //         html: "Please select a way of delivery !",
            //         type: "warning"
            //     })
            // }
        }
        else if (this.state.currentStatus === "PENDINGREQUESTORRETURN") {
            if (this.state.taskDetails.documentTypeId === "ORIGINAL") {
                if (this.state.deliverWay === "Express") {
                    if (this.state.expressNumber !== "") {
                        valid = true
                    }
                    else {
                        valid = false
                        Swal.fire({
                            title: "No Express Number",
                            html: "Please add Express Number !",
                            type: "warning"
                        })
                    }
                }
                else if (this.state.deliverWay === "F2F") {
                    valid = true
                }
                else {
                    valid = false
                    Swal.fire({
                        title: "No Delivery Way Selected",
                        html: "Please select a way of delivery !",
                        type: "warning"
                    })
                }
            }
            else if (this.state.taskDetails.documentTypeId === "SCANCOPY") {
                valid = true
            }
        }

        return valid
    }

    updated(action) {
        console.log(action)
        let valid = false
        if (this.state.currentStatus === "PENDINGLICENSEADMIN" || this.state.currentStatus === "PENDINGREQUESTORRETURN") {

            if (action === "approve" || action === "requestorreturn") {
                valid = this.validate()
            }
            else {
                valid = true
            }
        }
        else {
            valid = true
        }
        let postReq = new FormData();
        postReq.append("UserId", localStorage.getItem("userId"));
        postReq.append("Comments", this.state.comments);
        postReq.append("ReturnWay", this.state.deliverWay);
        postReq.append("ExpressNumber", this.state.expressNumber);
        postReq.append("ExpressAddress", this.state.taskDetails.expDeliveryAddress);
        for (let i = 0; i < this.state.documents.length; i++) {
            postReq.append(`Documents[${i}].Attachment.File`, this.state.documents[i].file);
            postReq.append(`Documents[${i}].AttachmentName`, this.state.documents[i].fileName);

        }

        for (var pair of postReq.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }



        if (valid) {

            Axios.post(`${config.url}/licenses/${this.props.location.state.taskId}/${action}`, postReq, { headers: { 'Content-Type': 'multipart/form-data' } })
                .then(res => {
                    Swal.fire({
                        title: res.data.message,
                        html: `The request has been ${res.data.message}`,
                        type: "success",
                        onClose: () => { this.goBack(true) }
                    })
                })
                .catch(error => {
                    Swal.fire({
                        title: "ERROR",
                        html: error.response.data.message,
                        type: "error"
                    })
                })
        }

    }

    handleRadio(event) {
        let value = event.target.value
        if (value === "F2F" || value === "Express") {
            this.setState({ deliverWay: value })
        }
    }

    handleChange = name => event => {
        let value = event.target.value
        this.setState({ [name]: value })
    }

    convertApprovedDate(dateValue) {

        let regEx = dateValue.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\w{2})/g, '$1/$2/$3 $4:$5 $6')
        return regEx
    }

    uploadDocument(event) {
        if (event.target.files.length !== 0) {
            let valid = true
            let file = event.target.files[0]
            let fileName = file.name
            for (let i = 0; i < this.state.documents.length; i++) {
                if (this.state.documents[i].fileName === fileName) {
                    valid = false
                    break;
                }
                else {
                    valid = true
                }
            }
            if (valid) {
                let Url = URL.createObjectURL(file)

                let obj = {
                    file: file,
                    fileName: fileName,
                    url: Url
                }
                this.setState(state => {
                    const documents = this.state.documents.concat(obj)
                    return { documents }
                })
            }
            else {
                Swal.fire({
                    title: "Document Exists ",
                    html: `The document has already been added to the list !`,
                    type: "warning",
                })
            }
        }
    }


    render() {
        const { taskDetails, redirect, approvalHistories, loading, page, currentStatus, expressNumber, deliverWay, documents } = this.state
        return (
            <div>
                {!loading ?
                    <Card className="animated fadeIn">
                        <CardHeader>
                            <Row className="align-items-left">
                                <Button className="mr-1" color="primary" onClick={() => this.goBack()}><i className="fa fa-angle-left" /> Back </Button>
                                {page === "myapplication" ?
                                    currentStatus !== "PENDINGREQUESTORACK" && currentStatus !== "PENDINGREQUESTORRETURN"
                                        ? taskDetails.actions.map((action, index) =>
                                            <Button
                                                key={index}
                                                className="mr-1"
                                                color={action.action === "recall" ? "danger" : action.action === "copy" ? "light-blue" : "warning"}
                                                onClick={() => this.updated(action.action)}
                                            >
                                                <i className={action.action === " recall" ? "icon-loop" : action.action === "copy" ? "fa fa-copy" : "icon-bell"} />&nbsp;
                                                {action.actionName}
                                            </Button>
                                        )
                                        : null
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
                                                    color={stage.state === "CURRENT" ? "green" : stage.state === "FINISHED" ? "secondary" : "warning  "}
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
                                            <img src={taskDetails.histories[0].approvedByAvatarUrl} className="img-avaa img-responsive center-block" alt="picture" />
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
                                        <Input disabled type="text" defaultValue={taskDetails.employeeNum} name="text-input" placeholder="EMPTY DATA" />
                                    </Col>
                                    <Col md lg>
                                        <Label>Department</Label>
                                    </Col>
                                    <Col md lg>
                                        <Input disabled type="text" defaultValue={taskDetails.departmentName} name="text-input" placeholder="EMPTY DATA" />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md lg>
                                        <Label>License Name</Label>
                                    </Col>
                                    <Col md lg>
                                        <Input disabled type="text" name="text-input" value={taskDetails.licenseName} placeholder="EMPTY DATA" />
                                    </Col>
                                    <Col md lg>
                                        <Label>Purpose</Label>
                                    </Col>
                                    <Col md lg>
                                        <Input disabled type="text" defaultValue={taskDetails.purposeTypeName} name="text-input" placeholder="EMPTY DATA" />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md lg>
                                        <Label>Document Type</Label>
                                    </Col>
                                    <Col md lg>
                                        <Input disabled type="text" defaultValue={taskDetails.documentTypeName} name="text-input" placeholder="EMPTY DATA" />
                                    </Col>
                                    {taskDetails.documentTypeId === "ORIGINAL"
                                        ? <>
                                            <Col md lg>
                                                <Label>Planned Return Date</Label>
                                            </Col>
                                            <Col md lg>
                                                <Input disabled type="text" defaultValue={this.convertDate(taskDetails.plannedReturnDate)} name="text-input" placeholder="EMPTY DATA" />
                                            </Col>
                                        </>
                                        : <>
                                            <Col md lg>
                                                <Label> Watermark </Label>
                                            </Col>
                                            <Col md lg>
                                                <Input disabled type="text" defaultValue={taskDetails.watermark} name="text-input" placeholder="EMPTY DATA" />
                                            </Col>
                                        </>
                                    }
                                </FormGroup>
                                <FormGroup row>
                                    <Col md lg>
                                        <Label>Deliver Ways</Label>
                                    </Col>
                                    <Col md lg>
                                        <Input disabled type="text" defaultValue={taskDetails.deliveryWayName} name="text-input" placeholder="EMPTY DATA" />
                                    </Col>
                                    <Col md lg>
                                        <Label>Delivery Address</Label>
                                    </Col>
                                    <Col md lg>
                                        <Input disabled type="text" defaultValue={taskDetails.expDeliveryAddress} name="text-input" placeholder="EMPTY DATA" />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md lg>
                                        <Label>Receiver</Label>
                                    </Col>
                                    <Col md lg>
                                        <Input disabled type="text" defaultValue={taskDetails.expDeliveryReceiver} name="text-input" placeholder="EMPTY DATA" />
                                    </Col>
                                    <Col md lg>
                                        <Label>Deliver Express Number</Label>
                                    </Col>
                                    <Col md lg>
                                        <Input disabled type="text" value={taskDetails.expDeliveryNumber} name="text-input" placeholder="/" />
                                    </Col>

                                </FormGroup>
                                <FormGroup row>
                                    <Col md lg>
                                        <Label>Receiver Mobile Number</Label>
                                    </Col>
                                    <Col md lg>
                                        <Input disabled type="text" defaultValue={taskDetails.expDeliveryMobileNo} name="text-input" placeholder="EMPTY DATA" />
                                    </Col>
                                    <Col md lg>
                                        <Label>Return Way</Label>
                                    </Col>
                                    <Col md lg>
                                        <Input disabled type="text" value={taskDetails.returnWayName} name="text-input" placeholder="/" />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md lg>
                                        <Label>Senior Manager or above of Requestor Department</Label>
                                    </Col>
                                    <Col md lg>
                                        <Input disabled type="text" defaultValue={this.convertMgrs(taskDetails.seniorManagers)} name="text-input" placeholder="EMPTY DATA" />
                                    </Col>
                                    <Col md lg>
                                        <Label>Return Express Number</Label>
                                    </Col>
                                    <Col md lg>
                                        <Input disabled type="text" value={taskDetails.expReturnNumber} name="text-input" placeholder="/" />
                                    </Col>
                                </FormGroup>
                            </Col>
                            {page === "mypendingtask"
                                ? <div>
                                    {currentStatus === "PENDINGLICENSEADMIN"
                                        ?
                                        <Row>
                                            <Col>
                                                {taskDetails.documentTypeId === "ORIGINAL"
                                                    ?
                                                    <FormGroup onChange={this.handleRadio} >
                                                        <Label>Deliver Way</Label>
                                                        <CustomInput type="radio" id="deliverWay1" name="deliverWay" value="F2F" label="面对面城, Face to face" />
                                                        <CustomInput type="radio" id="deliverWay2" name="deliverWay" value="Express" label="快递 Express: Express Number">
                                                            <Collapse isOpen={deliverWay === "Express"}>
                                                                <Input id="expressNumber" onChange={this.handleChange("expressNumber")} value={expressNumber} type="number" placeholder="Please enter the Express Number" />
                                                                <Row> &nbsp; </Row>
                                                                <div>Reciever: {taskDetails.expDeliveryReceiver}</div>
                                                                <div>Address: {taskDetails.expDeliveryAddress}</div>
                                                                <div>Mobile No. : {taskDetails.expDeliveryMobileNo}</div>
                                                                <div>Express Number: {expressNumber} </div>

                                                            </Collapse>
                                                        </CustomInput>
                                                    </FormGroup>
                                                    :
                                                    <FormGroup>
                                                        <Label>Attach Document</Label>
                                                        <CustomInput id="docFileName" onChange={this.uploadDocument} type="file" bsSize="lg" color="primary" />
                                                        &nbsp;
                                                    <Collapse isOpen={documents.length !== 0}>
                                                            {documents.map((doc, index) =>
                                                                <div key={index} > <a href={doc.url} target='_blank' rel="noopener noreferrer">{doc.fileName}</a> </div>
                                                            )}
                                                        </Collapse>
                                                    </FormGroup>
                                                }
                                            </Col>
                                        </Row>
                                        : currentStatus === "PENDINGREQUESTORRETURN"
                                            ? <Row>
                                                <Col>
                                                    <FormGroup onChange={this.handleRadio} >
                                                        <Label>Return Way</Label>
                                                        <CustomInput type="radio" id="deliverWay1" name="deliverWay" value="F2F" label="面对面城, Face to face" />
                                                        <CustomInput type="radio" id="deliverWay2" name="deliverWay" value="Express" label="快递 Express: Express Number">
                                                            <Collapse isOpen={deliverWay === "Express"}>
                                                                <Input id="expressNumber" onChange={this.handleChange("expressNumber")} value={expressNumber} type="number" placeholder="Please enter the Express Number" />
                                                                <Row> &nbsp; </Row>
                                                                {/* <div>Reciever: </div>
                                                                <div>Address: </div>
                                                                <div>Mobile No. :</div> */}
                                                                <div>Express Number: {expressNumber} </div>

                                                            </Collapse>
                                                        </CustomInput>

                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            : null
                                    }
                                    <Row>
                                        <Col> <h4>Comments</h4></Col>
                                    </Row>
                                    <Row>
                                        <Col >
                                            <Input onChange={this.handleChange("comments")} type="textarea" ></Input>
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
                                : page === "myapplication"
                                    ? <div>
                                        {currentStatus === "PENDINGREQUESTORRETURN"
                                            ? <Row>
                                                <Col>
                                                    <FormGroup onChange={this.handleRadio} >
                                                        <Label>Return Way</Label>
                                                        <CustomInput type="radio" id="deliverWay1" name="deliverWay" value="F2F" label="面对面城, Face to face" />
                                                        <CustomInput type="radio" id="deliverWay2" name="deliverWay" value="Express" label="快递 Express: Express Number">
                                                            <Collapse isOpen={deliverWay === "Express"}>
                                                                <Input id="expressNumber" onChange={this.handleChange("expressNumber")} value={expressNumber} type="number" placeholder="Please enter the Express Number" />
                                                                <Row> &nbsp; </Row>
                                                                {/* <div>Reciever: </div>
                                                            <div>Address: </div>
                                                            <div>Mobile No. :</div> */}
                                                                <div>Express Number: {expressNumber} </div>

                                                            </Collapse>
                                                        </CustomInput>

                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            : null}
                                        {currentStatus === "PENDINGREQUESTORACK" || currentStatus === "PENDINGREQUESTORRETURN"
                                            ?
                                            taskDetails.actions.map((action, index) =>
                                                <Button
                                                    key={index}
                                                    className="mr-1"
                                                    color="success"
                                                    onClick={() => this.updated(action.action)}
                                                >
                                                    {action.actionName}
                                                </Button>
                                            )
                                            : null}

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
                                            <img src={history.approvedByAvatarUrl} className="img-avatar" alt="Avatar" />
                                        </Col>
                                        <Col md="8">
                                            <h5>{history.approvedByName} (000)<span> <Badge color="success">{history.approvalStatus}</Badge></span></h5>
                                            <div><b>Approved On:</b> {this.convertApprovedDate(history.approvedDate)}</div>
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