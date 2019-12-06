import React, { Component } from 'react';
import {
    Card, CardBody, CardHeader, Table, Col, Row,
    Input,
    Button,
    FormGroup,
    Label,
    Progress, UncontrolledTooltip,
    Badge,
    Modal, ModalBody, ModalFooter, ModalHeader,
} from 'reactstrap';
import Axios from 'axios';
import config from '../../config';
import Swal from 'sweetalert2';
import ReactTable from "react-table";
import "react-table/react-table.css"
import { resetMounted } from '../MyPendingTasks/MyPendingTasks'



class TaskDetails extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showModal: false,
            taskDetails: null,
            comments: "",
            loading: true,
            page: "",
            appType: ""
        }

        this.goBack = this.goBack.bind(this)
        this.toggleView = this.toggleView.bind(this)
        this.handleChange = this.handleChange.bind(this)

    }

    componentDidMount() {
        if (this.props.location.state === undefined) {
            this.goBack(false)
        }
        else {
            this.setState({ page: this.props.match.params.page, appType: this.props.match.params.appid })
            this.getTaskDetails(this.props.location.state.taskId)
        }
    }

    async getTaskDetails(id) {
        this.setState({ loading: true })
        let userId = localStorage.getItem('userId')
        await Axios.get(`${config.url}/tasks/${id}?userid=${userId}`).then(res => {
            this.setState({ taskDetails: res.data, loading: false })
        })

    }


    setArray = () => {
        let result = this.state.taskDetails.departmentHeads
        return result.join("; ")
    }

    goBack(updated) {
        if (updated) {
            resetMounted.setMounted()
        }
        this.props.history.push({
            pathname: `/${this.props.match.params.page}`
        })
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    convertApprovedDate(dateValue) {

        let regEx = dateValue.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\w{2})/g, '$1/$2/$3 $4:$5 $6')
        return regEx
    }

    approve(action) {
        let data = {
            userId: localStorage.getItem('userId'),
            comments: this.state.comments
        }

        Axios.post(`${config.url}/tasks/${this.state.taskDetails.taskId}/${action}`, data, { headers: { 'Content-Type': 'application/json' } })
            .then(res => {
                Swal.fire({
                    title: res.data.message,
                    html: `The request has been ${res.data.message}`,
                    type: "success",
                    onAfterClose: this.goBack(true)
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

    handleChange(event) {
        this.setState({ comments: event.target.value })
    }

    toggleView() {
        this.setState({ showModal: !this.state.showModal })
    }




    render() {

        const { taskDetails, loading, showModal, page, appType } = this.state

        return (
            <div className="animated fadeIn">
                {!loading ?
                    <Card className="animated fadeIn" >
                        <CardHeader>
                            {/* <Button onClick={this.goBack} > Back &nbsp; </Button>  {taskDetails.requestNum} */}
                            <Row className="align-items-left">
                                <Button className="ml-1 mr-1" color="primary" onClick={() => this.goBack(false)}><i className="fa fa-angle-left" /> Back </Button>
                                {page === "myapps" ?
                                    taskDetails.actions.map(((action, index) =>
                                        <span key={index}>
                                            <Button className="mr-1" color={action.action === "recall" ? "danger" : action.action === "copy" ? "light-blue" : "warning"} onClick={() => { this.approve(action.action) }}><i className="icon-loop" /> {action.action === "copy" ? `${this.capitalize(action.action)} as Draft` : action.action === "remind" ? `${this.capitalize(action.action)} Task Owner` : this.capitalize(action.action)}  </Button>
                                        </span>
                                    ))
                                    : null}
                            </Row>
                        </CardHeader>
                        <CardBody color="dark">
                            <Row noGutters={true}>
                                <Col md="6"><span className="display-5"> {taskDetails.requestNum}</span></Col>
                                <Col md="6">
                                    <Progress multi>
                                        <Progress bar color="green" value="50">{taskDetails.currentStatusName}</Progress>
                                        <Progress bar animated striped color="warning" value="50">{taskDetails.nextStatusName}</Progress>
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
                                        <Col md="5"><h5> {taskDetails.employeeName} </h5></Col>
                                        <Col md="5"><h5><i className="fa fa-tablet" />&nbsp; {taskDetails.telephoneNum} </h5></Col>
                                    </Row>
                                    <Row >
                                        <Col md="4"><h6> DFS/CN, {this.props.legalName} </h6></Col>
                                    </Row>
                                    <Row >
                                        <Col md="3">
                                            <h6><center className="boxs">Applicant</center></h6>
                                        </Col>
                                        <Col md="2"></Col>
                                        <Col md="4"><h5><i className="fa fa-envelope" />&nbsp; {taskDetails.email}</h5></Col>
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
                                            <Input disabled type="text" value={taskDetails.employeeNum} id="text-input" name="text-input" placeholder="Text" />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="4">
                                            <Label htmlFor="text-input">Dept</Label>
                                        </Col>
                                        <Col xs="12" md="8">
                                            <Input disabled type="text" value={taskDetails.departmentName} id="text-input" name="text-input" placeholder="Text" />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="4">
                                            <Label htmlFor="text-input">Chop Type</Label>
                                        </Col>
                                        <Col xs="12" md="8">
                                            <Input disabled type="text" id="text-input" value={taskDetails.chopTypeName} name="text-input" placeholder="Text" />
                                        </Col>
                                    </FormGroup>
                                    {taskDetails.branchName !== ""
                                        ? <FormGroup row>
                                            <Col md="4">
                                                <Label htmlFor="text-input">Branch Company Chop</Label>
                                            </Col>
                                            <Col xs="12" md="8">
                                                <Input disabled type="text" id="text-input" value={taskDetails.branchName} name="text-input" placeholder="Text" />
                                            </Col>
                                        </FormGroup>
                                        : ""
                                    }
                                    {appType !== "LTI" ?
                                        <div>
                                            <FormGroup row>
                                                <Col md="4">
                                                    <Label htmlFor="text-input">Use in Office or not</Label>
                                                </Col>
                                                <Col xs="12" md="8">
                                                    <Input disabled type="text" id="text-input" value={taskDetails.isUseInOffice === "Y" ? "Yes" : "No"} name="text-input" placeholder="Text" />
                                                </Col>
                                            </FormGroup>
                                            {taskDetails.isUseInOffice === "N"
                                                ? <div>
                                                    <FormGroup row>
                                                        <Col md="4">
                                                            <Label htmlFor="text-input">Return Date</Label>
                                                        </Col>
                                                        <Col xs="12" md="8">
                                                            <Input disabled type="text" id="text-input" value={taskDetails.returnDate} name="text-input" placeholder="Text" />
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup row>
                                                        <Col md="4">
                                                            <Label htmlFor="text-input">Responsible Person</Label>
                                                        </Col>
                                                        <Col xs="12" md="8">
                                                            <Input disabled type="text" id="text-input" value={taskDetails.responsiblePersonNameName} name="text-input" placeholder="Text" />
                                                        </Col>
                                                    </FormGroup>
                                                </div>

                                                : ""}
                                        </div>
                                        : null}
                                    {appType === "LTU" || appType === "LTI"
                                        ? <FormGroup row>
                                            <Col md="4">
                                                <Label htmlFor="text-input">Effective Period</Label>
                                            </Col>
                                            <Col xs="12" md="8">
                                                <Input disabled type="text" value={taskDetails.effectivePeriod} id="text-input" name="text-input" placeholder="Text" />
                                            </Col>
                                        </FormGroup>
                                        : null
                                    }


                                    {appType === "LTU" || appType === "LTI"
                                        ? <FormGroup row>
                                            <Col md="4">
                                                <Label htmlFor="text-input">Entitled Team</Label>
                                            </Col>
                                            <Col xs="12" md="8">
                                                <Input disabled type="text" value={taskDetails.teamName} id="text-input" name="text-input" placeholder="Text" />
                                            </Col>
                                        </FormGroup>
                                        : null
                                    }

                                    <FormGroup row>
                                        <Col md="4">
                                            <Label htmlFor="text-input">Pick Up By</Label>
                                        </Col>
                                        <Col xs="12" md="8">
                                            <Input disabled type="text" id="text-input" value={taskDetails.pickUpBy} name="text-input" placeholder="Text" />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="4">
                                            <Label htmlFor="text-input">Confirm</Label>
                                        </Col>
                                        <Col xs="12" md="8">
                                            <Input disabled type="text" id="text-input" value={taskDetails.isConfirm === "Y" ? "Yes" : "No"} name="text-input" placeholder="Text" />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="4">
                                            <Label htmlFor="text-input">Tel</Label>
                                        </Col>
                                        <Col xs="12" md="8">
                                            <Input disabled type="text" value={taskDetails.telephoneNum} id="text-input" name="text-input" placeholder="Text" />
                                        </Col>
                                    </FormGroup>
                                    {appType === "LTI"
                                        ? taskDetails.isUseInOffice === "N"
                                            ? <FormGroup row>
                                                <Col md="4">
                                                    <Label htmlFor="text-input">Purpose of Use</Label>
                                                </Col>
                                                <Col xs="12" md="8">
                                                    <Input disabled type="text" value={taskDetails.purposeOfUse} id="text-input" name="text-input" placeholder="Text" />
                                                </Col>
                                            </FormGroup>
                                            : null
                                        : null}
                                    {appType === "CNIPS"
                                        ? taskDetails.isUseInOffice === "Y"
                                            ? <FormGroup row>
                                                <Col md="4">
                                                    <Label htmlFor="text-input">Purpose of Use</Label>
                                                </Col>
                                                <Col xs="12" md="8">
                                                    <Input disabled type="text" value={taskDetails.purposeOfUse} id="text-input" name="text-input" placeholder="Text" />
                                                </Col>
                                            </FormGroup> : "" : ""}
                                </Col>
                                <Col>

                                    <FormGroup row>
                                        <Col md="4">
                                            <Label htmlFor="text-input">Application Type</Label>
                                        </Col>
                                        <Col xs="12" md="8">
                                            <Input disabled type="text" value={taskDetails.applicationTypeName} id="text-input" name="text-input" placeholder="Text" />
                                        </Col>
                                    </FormGroup>
                                    {appType !== "LTI" ?
                                        <FormGroup row>
                                            <Col md="4">
                                                <Label htmlFor="text-input">Connecting Chop</Label>
                                            </Col>
                                            <Col xs="12" md="8">
                                                <Input disabled type="text" value={taskDetails.connectChop === "Y" ? "Yes" : "No"} id="text-input" name="text-input" placeholder="Text" />
                                            </Col>
                                        </FormGroup>
                                        : null}

                                    {appType === "LTI" ?
                                        <div>
                                            <FormGroup row>
                                                <Col md="4">
                                                    <Label htmlFor="text-input">Use in Office or not</Label>
                                                </Col>
                                                <Col xs="12" md="8">
                                                    <Input disabled type="text" id="text-input" value={taskDetails.isUseInOffice === "Y" ? "Yes" : "No"} name="text-input" placeholder="Text" />
                                                </Col>
                                            </FormGroup>
                                            {taskDetails.isUseInOffice === "N"
                                                ? <div>
                                                    <FormGroup row>
                                                        <Col md="4">
                                                            <Label htmlFor="text-input">Return Date</Label>
                                                        </Col>
                                                        <Col xs="12" md="8">
                                                            <Input disabled type="text" id="text-input" value={taskDetails.returnDate} name="text-input" placeholder="Text" />
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup row>
                                                        <Col md="4">
                                                            <Label htmlFor="text-input">Responsible Person</Label>
                                                        </Col>
                                                        <Col xs="12" md="8">
                                                            <Input disabled type="text" id="text-input" value={taskDetails.responsiblePersonNameName} name="text-input" placeholder="Text" />
                                                        </Col>
                                                    </FormGroup>
                                                </div>

                                                : ""}
                                        </div>
                                        : null}
                                    {appType === "LTI"
                                        ? taskDetails.isUseInOffice === "Y"
                                            ? <FormGroup row>
                                                <Col md="4">
                                                    <Label htmlFor="text-input">Purpose of Use</Label>
                                                </Col>
                                                <Col xs="12" md="8">
                                                    <Input disabled type="text" value={taskDetails.purposeOfUse} id="text-input" name="text-input" placeholder="Text" />
                                                </Col>
                                            </FormGroup>
                                            : null
                                        : appType === "CNIPS"
                                            ? taskDetails.isUseInOffice === "N"
                                                ? <FormGroup row>
                                                    <Col md="4">
                                                        <Label htmlFor="text-input">Purpose of Use</Label>
                                                    </Col>
                                                    <Col xs="12" md="8">
                                                        <Input disabled type="text" value={taskDetails.purposeOfUse} id="text-input" name="text-input" placeholder="Text" />
                                                    </Col>
                                                </FormGroup> : "" : <FormGroup row>
                                                <Col md="4">
                                                    <Label htmlFor="text-input">Purpose of Use</Label>
                                                </Col>
                                                <Col xs="12" md="8">
                                                    <Input disabled type="text" value={taskDetails.purposeOfUse} id="text-input" name="text-input" placeholder="Text" />
                                                </Col>
                                            </FormGroup>
                                    }
                                    <FormGroup row>
                                        <Col md="4">
                                            <Label htmlFor="text-input">Number of Pages to Be Chopped </Label>
                                        </Col>
                                        <Col xs="12" md="8">
                                            <Input disabled type="text" value={taskDetails.numOfPages} id="text-input" name="text-input" placeholder="Text" />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="4">
                                            <Label htmlFor="text-input">Address to</Label>
                                        </Col>
                                        <Col xs="12" md="8">
                                            <Input disabled type="textarea" value={taskDetails.addressTo} id="text-input" name="text-input" placeholder="Text" />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="4">
                                            <Label htmlFor="text-input">Remark (e.g. tel.)</Label>
                                        </Col>
                                        <Col xs="12" md="8">
                                            <Input disabled type="text" value={taskDetails.remark} id="text-input" name="text-input" placeholder="Text" />
                                        </Col>
                                    </FormGroup>
                                    {appType === "CNIPS"
                                        ? <div>
                                            <FormGroup row>
                                                <Col md="4">
                                                    <Label htmlFor="text-input">Contract Signed By (First Person) :  </Label>
                                                </Col>
                                                <Col xs="12" md="8">
                                                    <Input disabled type="text" value={taskDetails.contractSignedByFirstPersonName} id="text-input" name="text-input" placeholder="Text" />
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="4">
                                                    <Label htmlFor="text-input">Contract Signed By (Second Person) :  </Label>
                                                </Col>
                                                <Col xs="12" md="8">
                                                    <Input disabled type="text" value={taskDetails.contractSignedBySecondPersonName} id="text-input" name="text-input" placeholder="Text" />
                                                </Col>
                                            </FormGroup>
                                        </div>
                                        : appType === "LTU"
                                            ? <FormGroup row>
                                                <Col md="4">
                                                    <Label htmlFor="text-input">Document Check By</Label>
                                                </Col>
                                                <Col xs="12" md="8">
                                                    <Input disabled type="text" value={taskDetails.documentCheckByName} id="text-input" name="text-input" placeholder="Text" />
                                                </Col>
                                            </FormGroup>
                                            : <FormGroup row>
                                                <Col md="4">
                                                    <Label htmlFor="text-input">Department Heads</Label>
                                                </Col>
                                                <Col id="deptHead" xs="12" md="8">
                                                    <Input disabled type="text" value={this.setArray()} id="text-input" name="text-input" placeholder="Text" />
                                                    <UncontrolledTooltip placement="right" target="deptHead">{this.setArray()}</UncontrolledTooltip>
                                                </Col>
                                            </FormGroup>
                                    }



                                </Col>
                            </Row>
                            <Row>
                                <FormGroup>
                                    <Col>
                                        <Label htmlFor="text-input">Documents</Label>
                                    </Col>
                                    <Col>

                                        <Button color="primary" onClick={this.toggleView}>View Documents</Button>

                                        <Modal color="info" size="xl" toggle={this.toggleView} isOpen={showModal} >
                                            <ModalHeader className="center"> Documents </ModalHeader>
                                            <ModalBody>
                                                <ReactTable
                                                    data={taskDetails.documentNames}
                                                    sortable
                                                    columns={[
                                                        {
                                                            Header: "#",
                                                            Cell: row => (
                                                                <div>{row.index + 1}</div>
                                                            ),
                                                            width: 40,
                                                            // style: { textAlign: "center" }
                                                        },
                                                        {
                                                            Header: "Document Name (English)",
                                                            accessor: "documentNameEnglish",
                                                            width: 250,
                                                            // style: { textAlign: "center" },
                                                        },
                                                        {
                                                            Header: "Document Name (Chinese)",
                                                            accessor: "documentNameChinese",
                                                            width: 250,
                                                            // style: { textAlign: "center" },
                                                        },
                                                        {
                                                            Header: "Attached Document",
                                                            accessor: "documentName",
                                                            Cell: row => (
                                                                <a href={row.original.documentUrl} target='_blank' rel="noopener noreferrer">{row.original.documentFileName}</a>
                                                            ),
                                                            // style: { textAlign: "center" },
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
                            {page === "mypendingtask"
                                ? <div>
                                    <Row>
                                        <Col> <h4>Comments</h4></Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Input type="textarea" onChange={this.handleChange}></Input>
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        {taskDetails.actions.map((action, index) =>
                                            <Col key={index} sm={1}>
                                                <Button color={action.action === "approve" ? "success" : "danger"} onClick={() => this.approve(action.action)} > {this.capitalize(action.action)}</Button>
                                            </Col>
                                        )}
                                    </Row>
                                    <Row>
                                        <Col>&nbsp;</Col>
                                    </Row>
                                </div>
                                : null}

                            <Row>
                                <Col> <h4>Approval Histories</h4></Col>
                            </Row>


                            {taskDetails.histories.map((history, index) =>
                                <div key={index}>
                                    <Row className="bottom-border"></Row>
                                    <Row>
                                        <Col md="1">
                                            <img src={history.approvedByAvatarUrl} className="img-avatar" alt="Avatar" />
                                        </Col>
                                        <Col md="8">
                                            <h5>{history.approvedByName} (000)<span> <Badge color="success">{history.approvalStatus}</Badge></span></h5>
                                            <div><b>Approved On:</b>  {this.convertApprovedDate(history.approvedDate)} </div>
                                            <small>{history.comments}</small>
                                        </Col>
                                    </Row>
                                </div>
                            )}

                        </CardBody>
                    </Card>
                    : null}
            </div>
        )
    }
}

export default TaskDetails;