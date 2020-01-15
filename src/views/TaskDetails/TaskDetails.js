import React, { Component } from 'react';
import {
    Card, CardBody, CardHeader, CardFooter, Table, Col, Row,
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
// import { resetMounted } from '../MyPendingTasks/MyPendingTasks'



class TaskDetails extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showModal: false,
            progressModal: false,
            taskDetails: null,
            userDetails: {},
            comments: "",
            loading: true,
            page: "",
            appType: "",
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
        await Axios.get(`${config.url}/tasks/${id}?userid=${userId}`, { headers: { Pragma: 'no-cache' } }).then(res => {
            // await Axios.get(`https://localhost:44301/api/v1/tasks/${id}?userid=${userId}`).then(res => {
            this.setState({ taskDetails: res.data, loading: false })
            console.log(res.data)
        })
        // this.getUserDetails()

    }

    async getUserDetails() {
        this.setState({ loading: true })
        await Axios.get(`${config.url}/users/${this.state.taskDetails.histories[0].approvedBy}`, { headers: { Pragma: 'no-cache' } }).then(res => {
            this.setState({ userDetails: res.data, loading: false })
            console.log(res.data)
        })
    }

    convertContractNums(nums) {
        return nums.join(", ")
    }

    setArray(data) {
        return data.join("; ")
    }

    // setArray = () => {
    //     let result = this.state.taskDetails.departmentHeads
    //     return result.join("; ")
    // }

    goBack(updated) {
        if (updated) {
            // resetMounted.setMounted()
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

    convertDate(dateValue) {
        let regEx = dateValue.replace(/(\d{4})(\d{2})(\d{2})/g, '$1/$2/$3')
        return regEx
    }



    approve(action) {
        let data = {
            userId: localStorage.getItem('userId'),
            comments: this.state.comments
        }

        Swal.fire({
            title: `Creating your Request ... `,
            type: "info",
            text: '',
            footer: '',
            allowOutsideClick: false,
            onClose: () => { this.goBack(true) },
            onBeforeOpen: () => {
                Swal.showLoading()
            },
            onOpen: () => {
                Axios.post(`${config.url}/tasks/${this.state.taskDetails.taskId}/${action}`, data, { headers: { 'Content-Type': 'application/json' } })
                    .then(res => {

                        Swal.update({
                            title: res.data.message,
                            text: `The request has been ${res.data.message}`,
                            type: "success",

                        })
                        Swal.hideLoading()
                    })
                    .catch(error => {
                        if (error.response) {
                            Swal.fire({
                                title: "ERROR",
                                html: error.response.data.message,
                                type: "error"
                            })
                        }
                    })
            }
        })


        // Axios.post(`${config.url}/tasks/${this.state.taskDetails.taskId}/${action}`, data, { headers: { 'Content-Type': 'application/json' } })
        //     .then(res => {
        //         Swal.fire({
        //             title: res.data.message,
        //             html: `The request has been ${res.data.message}`,
        //             type: "success",
        //             onClose: () => { this.goBack(true) }
        //         })
        //     })
        //     .catch(error => {
        //         if (error.response) {
        //             Swal.fire({
        //                 title: "ERROR",
        //                 html: error.response.data.message,
        //                 type: "error"
        //             })
        //         }
        //     })


    }

    handleChange(event) {
        this.setState({ comments: event.target.value })
    }

    toggleView() {
        this.setState({ showModal: !this.state.showModal })
    }


    handleButton(action) {
        switch (action.action) {
            case 'recall':
                return <Button className="mr-1" color="danger" onClick={() => { this.approve(action.action) }}><i className="icon-loop" /> Recall </Button>
                    ;
            case 'copy':
                return <Button className="mr-1" color="light-blue" onClick={() => { this.approve(action.action) }}><i className="fa fa-copy" /> Copy as Draft </Button>
                    ;
            case 'remind':
                return <Button className="mr-1" color="warning" onClick={() => { this.approve(action.action) }}><i className="icon-bell" />Remind Task Owner </Button>
                    ;
            default:
                return null
        }
    }

    dataURLtoFile(dataurl, filename) {

        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new File([u8arr], filename, { type: mime });
    }

    viewOrDownloadFile(b64, type, name) {
        if (b64 !== "") {
            let file = this.dataURLtoFile(`data:${type};base64,${b64}`, name);
            var blobUrl = new Blob([file], { type: type })
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(blobUrl, name)
                return;
            }
            else {
                window.open(URL.createObjectURL(file), "_blank")
            }
        }
        else {
            alert("BASE 64 String is empty !!!")
        }
    }

    render() {

        const { taskDetails, userDetails, loading, showModal, page, appType } = this.state
        return (
            <div className="animated fadeIn">
                {!loading ?
                    <Card className="animated fadeIn" >
                        <CardHeader>
                            {/* <Button onClick={this.goBack} > Back &nbsp; </Button>  {taskDetails.requestNum} */}
                            <Row className="align-items-left">
                                <Button className="ml-1 mr-1" color="primary" onClick={() => this.goBack(this.state.updated)}><i className="fa fa-angle-left" /> Back </Button>
                                {taskDetails.actions.map(((action, index) =>
                                    <span key={index}>
                                        {this.handleButton(action)}
                                    </span>
                                ))}
                            </Row>
                        </CardHeader>
                        <CardBody color="dark">
                            <Col className="mb-4" onClick={() => this.setState({ progressModal: !this.state.progressModal })}>
                                <Progress multi>
                                    {taskDetails.allStages.map((stage, index) =>
                                        <React.Fragment key={index}>
                                            <UncontrolledTooltip placement="top" target={"status" + index}>{stage.statusName}</UncontrolledTooltip>
                                            <Progress
                                                className={index !== taskDetails.allStages.lastIndex ? "mr-1" : ""}
                                                bar
                                                animated={stage.state === "CURRENT" ? true : false}
                                                striped={stage.state === "FINISHED"}
                                                color={stage.state === "CURRENT" ? "green" : stage.state === "FINISHED" ? "secondary" : "warning"}
                                                value={100 / taskDetails.allStages.length}> <div id={"status" + index} style={{ color: stage.state === "FINISHED" ? "black" : "white" }} >{stage.statusName}</div>
                                            </Progress>
                                        </React.Fragment>
                                    )}
                                </Progress>
                            </Col>
                            <Row className="mb-3">
                                <Col xs="12" md lg><span className="display-5"> {taskDetails.requestNum}</span></Col>
                            </Row>
                            <Row>
                                {/* <Col> */}
                                {/* <div className="container" >
                            {this.state.demo.map(dem =>
                                <div>TESTING</div>
                            )}
                        </div> */}
                                {/* </Col> */}

                            </Row>
                            <Modal style={{ maxWidth: 1500 }} size="xl" color="info" toggle={() => this.setState({ progressModal: !this.state.progressModal })} isOpen={this.state.progressModal} >
                                <ModalBody>
                                    <Col style={{ width: "100%" }} >
                                        <Progress multi style={{ height: "5rem" }}>
                                            {taskDetails.allStages.map((stage, index) =>
                                                <React.Fragment key={index}>
                                                    <UncontrolledTooltip placement="top" target={"status" + index}>{stage.statusName}</UncontrolledTooltip>
                                                    <Progress style={{ height: "5rem" }}
                                                        className={index !== taskDetails.allStages.lastIndex ? "mr-1" : ""}
                                                        bar
                                                        animated={stage.state === "CURRENT" ? true : false}
                                                        striped={stage.state === "FINISHED"}
                                                        color={stage.state === "CURRENT" ? "green" : stage.state === "FIRSTPENDING" ? "warning" : stage.state === "FINISHED" ? "secondary" : ""}
                                                        value={100 / taskDetails.allStages.length}> <div className="text-break" id={"status" + index} style={{ wordWrap: "break-word", color: stage.state === "FINISHED" ? "black" : "white" }} >{stage.statusName}</div>
                                                    </Progress>
                                                </React.Fragment>
                                            )}
                                        </Progress>
                                    </Col>
                                </ModalBody>
                            </Modal>

                            <Row className="mb-4">
                                <Col xs="12" sm="12" md lg className="text-md-left text-center">
                                    <Row>
                                        {/* <Col xs={12} sm={12} md={4} lg={2}>
                                            <img src={taskDetails.createdByPhotoUrl} className="img-avaa img-responsive center-block" alt="picture" />
                                        </Col> */}
                                        <Col md><h5> {taskDetails.employeeName} </h5>
                                            <Row>
                                                <Col md><h6> DFS/CN, {taskDetails.companyId} </h6></Col>
                                            </Row>
                                            <Row>
                                                <Col xs={12} sm={12} md={6} lg={6}>
                                                    <h6><center className="boxs">APPLICANT</center></h6>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs="12" sm="12" md lg className="text-md-left text-center">
                                    <Row>
                                        <Col md><h5><i className="fa fa-tablet mr-2" /> {taskDetails.telephoneNum} </h5></Col>
                                    </Row>
                                    <Row>
                                        <Col md><h5><i className="fa fa-envelope mr-2" /> {taskDetails.email}</h5></Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <FormGroup row >
                                        <Col md="4" className="d-flex align-items-center" >
                                            <Label>Employee Number</Label>
                                        </Col>
                                        <Col xs="12" md="8">
                                            <Input disabled type="text" value={taskDetails.employeeNum} id="employeeNum" name="employeeNum" placeholder="/" />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row >
                                        <Col md="4" className="d-flex align-items-center" >
                                            <Label>Dept</Label>
                                        </Col>
                                        <Col xs="12" md="8">
                                            <Input disabled type="text" value={taskDetails.departmentName} id="departmentName" name="departmentName" placeholder="/" />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row >
                                        <Col md="4" className="d-flex align-items-center" >
                                            <Label>Chop Type</Label>
                                        </Col>
                                        <Col xs="12" md="8">
                                            <Input disabled type="text" value={taskDetails.chopTypeName} id="chopTypeName" name="chopTypeName" placeholder="/" />
                                        </Col>
                                    </FormGroup>
                                    {taskDetails.branchName !== ""
                                        ? <FormGroup row >
                                            <Col md="4" className="d-flex align-items-center" >
                                                <Label>Branch Company Chop</Label>
                                            </Col>
                                            <Col xs="12" md="8">
                                                <Input disabled type="text" value={taskDetails.branchName} id="branchName" name="branchName" placeholder="/" />
                                            </Col>
                                        </FormGroup>
                                        : ""
                                    }
                                    {appType === "LTI" ?
                                        <div>
                                            <FormGroup row >
                                                <Col md="4" className="d-flex align-items-center" >
                                                    <Label>Use in Office or not</Label>
                                                </Col>
                                                <Col xs="12" md="8">
                                                    <Input disabled type="text" value={taskDetails.isUseInOffice === "Y" ? "Yes" : "No"} id="isUseInOffice" name="isUseInOffice" placeholder="/" />
                                                </Col>
                                            </FormGroup>
                                            {taskDetails.isUseInOffice === "N"
                                                ? <div>
                                                    <FormGroup row >
                                                        <Col md="4" className="d-flex align-items-center" >
                                                            <Label>Return Date</Label>
                                                        </Col>
                                                        <Col xs="12" md="8">
                                                            <Input disabled type="text" value={this.convertDate(taskDetails.returnDate)} id="returnDate" name="returnDate" placeholder="/" />
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup row >
                                                        <Col md="4" className="d-flex align-items-center" >
                                                            <Label>Responsible Person</Label>
                                                        </Col>
                                                        <Col xs="12" md="8">
                                                            <Input disabled type="text" value={taskDetails.responsiblePersonName} id="responsiblePersonName" name="responsiblePersonName" placeholder="/" />
                                                        </Col>
                                                    </FormGroup>
                                                </div>

                                                : ""}
                                        </div>
                                        : null}
                                    {appType !== "LTI" ?
                                        <FormGroup row >
                                            <Col md="4" className="d-flex align-items-center" >
                                                <Label>Connecting Chop</Label>
                                            </Col>
                                            <Col xs="12" md="8">
                                                <Input disabled type="text" value={taskDetails.connectChop === "Y" ? "Yes" : "No"} id="connectChop" name="connectChop" placeholder="/" />
                                            </Col>
                                        </FormGroup>
                                        : null}

                                    {appType !== "LTI" ?
                                        <>
                                            <FormGroup row >
                                                <Col md="4" className="d-flex align-items-center" >
                                                    <Label>Use in Office or not</Label>
                                                </Col>
                                                <Col xs="12" md="8">
                                                    <Input disabled type="text" value={taskDetails.isUseInOffice === "Y" ? "Yes" : "No"} id="isUseInOffice" name="isUseInOffice" placeholder="/" />
                                                </Col>
                                            </FormGroup>
                                            {taskDetails.isUseInOffice === "N"
                                                ? <FormGroup row >
                                                    <Col md="4" className="d-flex align-items-center" >
                                                        <Label>Return Date</Label>
                                                    </Col>
                                                    <Col xs="12" md="8">
                                                        <Input disabled type="text" value={this.convertDate(taskDetails.returnDate)} id="returnDate" name="returnDate" placeholder="/" />
                                                    </Col>
                                                </FormGroup>
                                                : ""}
                                        </>
                                        : null}

                                    {appType !== "LTI"
                                        ? <FormGroup row >
                                            <Col md="4" className="d-flex align-items-center" >
                                                <Label>Pick Up By</Label>
                                            </Col>
                                            <Col xs="12" md="8">
                                                <Input disabled type="text" value={taskDetails.pickUpByName} id="pickUpBy" name="pickUpBy" placeholder="EMPTY DATA" />
                                            </Col>
                                        </FormGroup>
                                        : null}


                                    {appType === "LTI"
                                        ? <FormGroup row >
                                            <Col md="4" className="d-flex align-items-center" >
                                                <Label>Effective Period</Label>
                                            </Col>
                                            <Col xs="12" md="8">
                                                <Input disabled type="text" value={this.convertDate(taskDetails.effectivePeriod)} id="effectivePeriod" name="effectivePeriod" placeholder="/" />
                                            </Col>
                                        </FormGroup>
                                        : null
                                    }


                                    {appType === "LTU" || appType === "LTI"
                                        ? <FormGroup row >
                                            <Col md="4" className="d-flex align-items-center" >
                                                <Label>Entitled Team</Label>
                                            </Col>
                                            <Col xs="12" md="8">
                                                <Input disabled type="text" value={taskDetails.teamName} id="teamName" name="teamName" placeholder="EMPTY DATA" />
                                            </Col>
                                        </FormGroup>
                                        : null
                                    }
                                    {appType === 'CNIPS'
                                        ? <FormGroup row >
                                            <Col md="4" className="d-flex align-items-center" >
                                                <Label>Contract Signed By (First Person) :  </Label>
                                            </Col>
                                            <Col xs="12" md="8">
                                                <Input disabled type="text" value={taskDetails.contractSignedByFirstPersonName} id="contractSignedByFirstPersonName" name="contractSignedByFirstPersonName" placeholder="/" />
                                            </Col>
                                        </FormGroup>
                                        : ''}
                                    {appType === 'LTU'
                                        ? ''
                                        : <FormGroup row >
                                            <Col md="4" className="d-flex align-items-center" >
                                                <Label>Confirm</Label>
                                            </Col>
                                            <Col xs="12" md="8">
                                                <Input disabled type="text" value={taskDetails.isConfirm === "Y" ? "Yes" : "No"} id="isConfirm" name="isConfirm" placeholder="/" />
                                            </Col>
                                        </FormGroup>
                                    }
                                </Col>
                                <Col>
                                    <FormGroup row >
                                        <Col md="4" className="d-flex align-items-center" >
                                            <Label>Tel</Label>
                                        </Col>
                                        <Col xs="12" md="8">
                                            <Input disabled type="text" value={taskDetails.telephoneNum} id="telephoneNum" name="telephoneNum" placeholder="/" />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row >
                                        <Col md="4" className="d-flex align-items-center" >
                                            <Label>Application Type</Label>
                                        </Col>
                                        <Col xs="12" md="8">
                                            <Input disabled type="text" value={taskDetails.applicationTypeName} id="applicationTypeName" name="applicationTypeName" placeholder="/" />
                                        </Col>
                                    </FormGroup>
                                    {appType === "LTI"
                                        ? taskDetails.isUseInOffice === "N"
                                            ? <FormGroup row >
                                                <Col md="4" className="d-flex align-items-center" >
                                                    <Label>Purpose of Use</Label>
                                                </Col>
                                                <Col xs="12" md="8">
                                                    <Input disabled type="text" value={taskDetails.purposeOfUse} id="purposeOfUse" name="purposeOfUse" placeholder="/" />
                                                </Col>
                                            </FormGroup>
                                            : null
                                        : null}
                                    {appType === "CNIPS"
                                        ? taskDetails.isUseInOffice === "Y"
                                            ? <FormGroup row >
                                                <Col md="4" className="d-flex align-items-center" >
                                                    <Label>Purpose of Use</Label>
                                                </Col>
                                                <Col xs="12" md="8">
                                                    <Input disabled type="text" value={taskDetails.purposeOfUse} id="purposeOfUse" name="purposeOfUse" placeholder="/" />
                                                </Col>
                                            </FormGroup> : "" : ""}
                                    {appType === "LTI"
                                        ? taskDetails.isUseInOffice === "Y"
                                            ? <FormGroup row >
                                                <Col md="4" className="d-flex align-items-center" >
                                                    <Label>Purpose of Use</Label>
                                                </Col>
                                                <Col xs="12" md="8">
                                                    <Input disabled type="text" value={taskDetails.purposeOfUse} id="purposeOfUse" name="purposeOfUse" placeholder="/" />
                                                </Col>
                                            </FormGroup>
                                            : null
                                        : appType === "CNIPS"
                                            ? taskDetails.isUseInOffice === "N"
                                                ? <FormGroup row >
                                                    <Col md="4" className="d-flex align-items-center" >
                                                        <Label>Purpose of Use</Label>
                                                    </Col>
                                                    <Col xs="12" md="8">
                                                        <Input disabled type="textarea" value={taskDetails.purposeOfUse} id="purposeOfUse" name="purposeOfUse" placeholder="/" />
                                                    </Col>
                                                </FormGroup> : "" : <FormGroup row >
                                                <Col md="4" className="d-flex align-items-center" >
                                                    <Label>Purpose of Use</Label>
                                                </Col>
                                                <Col xs="12" md="8">
                                                    <Input disabled type="textarea" value={taskDetails.purposeOfUse} id="purposeOfUse" name="purposeOfUse" placeholder="/" />
                                                </Col>
                                            </FormGroup>
                                    }
                                    {appType !== "LTI"
                                        ? <FormGroup row >
                                            <Col md="4" className="d-flex align-items-center" >
                                                <Label>No. of Pages to Be Chopped </Label>
                                            </Col>
                                            <Col xs="12" md="8">
                                                <Input disabled type="text" value={taskDetails.numOfPages} id="numOfPages" name="numOfPages" placeholder="/" />
                                            </Col>
                                        </FormGroup>
                                        : null}
                                    <FormGroup row >
                                        <Col md="4" className="d-flex align-items-center" >
                                            <Label>Address to</Label>
                                        </Col>
                                        <Col xs="12" md="8">
                                            <Input disabled type="textarea" value={taskDetails.addressTo} id="addressTo" name="addressTo" placeholder="/" />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row >
                                        <Col md="4" className="d-flex align-items-center" >
                                            <Label>Remark (e.g. tel.)</Label>
                                        </Col>
                                        <Col xs="12" md="8">
                                            <Input disabled type="text" value={taskDetails.remark} id="remark" name="remark" placeholder="/" />
                                        </Col>
                                    </FormGroup>
                                    {appType === "LTI"
                                        ? <FormGroup row >
                                            <Col md="4" className="d-flex align-items-center" >
                                                <Label>Document Check By</Label>
                                            </Col>
                                            <Col id="docCheck" xs="12" md="8">
                                                <Input disabled type="text" value={this.setArray(taskDetails.documentCheckByName)} id="documentCheckByName" name="documentCheckByName" placeholder="/" />
                                                <UncontrolledTooltip placement="right" target="docCheck">{this.setArray(taskDetails.documentCheckByName)}</UncontrolledTooltip>
                                            </Col>
                                        </FormGroup>
                                        : null
                                    }
                                    {taskDetails.isUseInOffice === "N"
                                        ? <FormGroup row >
                                            <Col md="4" className="d-flex align-items-center" >
                                                <Label>Responsible Person</Label>
                                            </Col>
                                            <Col xs="12" md="8">
                                                <Input disabled type="text" value={taskDetails.responsiblePersonName} id="responsiblePersonName" name="responsiblePersonName" placeholder="/" />
                                            </Col>
                                        </FormGroup>
                                        : null}
                                    {appType === "CNIPS"
                                        ? <FormGroup row >
                                            <Col md="4" className="d-flex align-items-center" >
                                                <Label>Contract Signed By (Second Person) :  </Label>
                                            </Col>
                                            <Col xs="12" md="8">
                                                <Input disabled type="text" value={taskDetails.contractSignedBySecondPersonName} id="contractSignedBySecondPersonName" name="contractSignedBySecondPersonName" placeholder="/" />
                                            </Col>
                                        </FormGroup>
                                        : appType === "LTU"
                                            ? <FormGroup row >
                                                <Col md="4" className="d-flex align-items-center" >
                                                    <Label>Document Check By</Label>
                                                </Col>
                                                <Col xs="12" md="8">
                                                    <Input disabled type="text" value={taskDetails.documentCheckByName} id="documentCheckByName" name="documentCheckByName" placeholder="/" />
                                                </Col>
                                            </FormGroup>
                                            :
                                            <FormGroup row >
                                                <Col md="4" className="d-flex align-items-center" >
                                                    <Label>Department Heads</Label>
                                                </Col>
                                                <Col id="deptHead" xs="12" md="8">
                                                    <Input disabled type="textarea" value={this.setArray(taskDetails.departmentHeadsName)} id="departmentHeadsName" name="departmentHeadsName" placeholder="/" />
                                                    <UncontrolledTooltip placement="right" target="deptHead">{this.setArray(taskDetails.departmentHeadsName)}</UncontrolledTooltip>
                                                </Col>
                                            </FormGroup>
                                    }
                                    {appType === 'LTU'
                                        ? <FormGroup row >
                                            <Col md="4" className="d-flex align-items-center" >
                                                <Label>Confirm</Label>
                                            </Col>
                                            <Col xs="12" md="8">
                                                <Input disabled type="text" value={taskDetails.isConfirm === "Y" ? "Yes" : "No"} id="isConfirm" name="isConfirm" placeholder="/" />
                                            </Col>
                                        </FormGroup>
                                        : ''
                                    }






                                </Col>
                            </Row>
                            <Row>
                                <FormGroup>
                                    <Col>
                                        <Label>Documents</Label>
                                    </Col>
                                    <Col>

                                        <Button color="primary" onClick={this.toggleView}>View Documents</Button>

                                        <Modal color="info" size="xl" toggle={this.toggleView} isOpen={showModal} >
                                            <ModalHeader className="center"> Documents </ModalHeader>
                                            <ModalBody>
                                                <ReactTable
                                                    data={taskDetails.documents}
                                                    sortable
                                                    columns={[
                                                        {
                                                            Header: "#",
                                                            acessor: "index",
                                                            Cell: row => (
                                                                <div>{row.index + 1}</div>
                                                            ),
                                                            width: 40,
                                                            // style: { textAlign: "center" }
                                                        },
                                                        {
                                                            Header: "Contract Number",
                                                            acessor: "contractNums",
                                                            Cell: row => (
                                                                <div> {this.convertContractNums(row.original.contractNums)} </div>
                                                            ),
                                                            style: { textAlign: "center", 'whiteSpace': 'unset' },
                                                            width: 135,
                                                            show: appType === "CNIPS"
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
                                                                <div style={{ cursor: "pointer", color: "blue" }} onClick={() => this.viewOrDownloadFile(row.original.documentBase64String, row.original.documentFileType, row.original.documentFileName)} >{row.original.documentFileName}</div>
                                                            ),
                                                            // style: { textAlign: "center" },
                                                        },
                                                    ]}
                                                    defaultPageSize={10}
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
                                    <Row className="mb-2">
                                        <Col>
                                            <Input type="textarea" onChange={this.handleChange}></Input>
                                        </Col>
                                    </Row>

                                    <Row className="mb-4">
                                        <Col>
                                            {taskDetails.actions.map((action, index) =>
                                                <Button className="mx-1" key={index} color={action.action === "approve" ? "success" : "danger"} onClick={() => this.approve(action.action)} > {action.actionName}</Button>
                                            )}
                                        </Col>
                                    </Row>
                                </div>
                                : null}

                            <Row>
                                <Col> <h4>Approval Histories</h4></Col>
                            </Row>


                            {taskDetails.histories.map((history, index) =>
                                <div key={index}>
                                    <Row className="bottom-border"></Row>
                                    <Row className="text-md-left text-center">
                                        {/* <Col xs="12" sm="12" md="2" lg="1">
                                            <img src={history.approvedByAvatarUrl} className="img-avaa img-responsive" alt="Avatar" />
                                        </Col> */}
                                        <Col sm md="10" lg>
                                            <h5>{history.approvedByName}<span> <Badge color="success">{history.approvalStatus}</Badge></span></h5>
                                            <h6><Badge className="mb-1" color="light">{this.convertApprovedDate(history.approvedDate)}</Badge></h6>
                                            <Col className="p-0"> <p>{history.comments}</p> </Col>
                                        </Col>
                                    </Row>
                                </div>
                            )}

                        </CardBody>
                        {/* <CardFooter>
                            <Row>
                                <Col xs="1" >
                                    <div style={{ width: "10px", height: "10px", background: "#c8ced3" }} ></div>
                                </Col>
                                <Col>
                                    <div>Finished Stage</div>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="1" >
                                    <div style={{ width: "10px", height: "10px", background: "#4dbd74" }} >  </div>
                                </Col>
                                <Col>
                                    <div>Current Stage</div>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="1" >
                                    <div style={{ width: "10px", height: "10px", background: "#ffc107" }} >  </div>
                                </Col>
                                <Col>
                                    <div>Next Stage</div>
                                </Col>
                            </Row>
                        </CardFooter> */}
                    </Card>
                    : null
                }
            </div>
        )
    }
}

export default TaskDetails;