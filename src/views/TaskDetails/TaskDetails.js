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
import "react-table/react-table.css";
import {STU,LTU,LTI,CNIPS} from './viewDetails';
import {BSTU,BLTU,BLTI,BCNIPS} from './viewBranchDetails';
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
                            text: `The request has been approved`,
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

    handleViews(appType){
        if( this.state.taskDetails.branchId !== ''){
            switch (appType) {
                case 'STU':
                    return <BSTU setArray={this.setArray} taskDetails={this.state.taskDetails}/>
                    ;
                case 'LTU':
                    return <BLTU setArray={this.setArray} taskDetails={this.state.taskDetails}/>
                    ;
                case 'LTI':
                    return <BLTI setArray={this.setArray} taskDetails={this.state.taskDetails}/>
                    ;
                case 'CNIPS':
                    return <BCNIPS setArray={this.setArray} taskDetails={this.state.taskDetails}/>
                    ;
                default:
                    return <BSTU setArray={this.setArray} taskDetails={this.state.taskDetails}/>
                    ;    
            }
        }
        else {
            switch (appType) {
                case 'STU':
                    return <STU setArray={this.setArray} taskDetails={this.state.taskDetails}/>
                    ;
                case 'LTU':
                    return <LTU setArray={this.setArray} taskDetails={this.state.taskDetails}/>
                    ;
                case 'LTI':
                    return <LTI setArray={this.setArray} taskDetails={this.state.taskDetails}/>
                    ;
                case 'CNIPS':
                    return <CNIPS setArray={this.setArray} taskDetails={this.state.taskDetails}/>
                    ;
                default:
                    return <STU setArray={this.setArray} taskDetails={this.state.taskDetails}/>
                    ;    
            }
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
        const viewDetail = null 

        return (
            <div className="animated fadeIn">
                {!loading ?
                    <Card className="animated fadeIn" >
                        <CardHeader>
                            {/* <Button onClick={this.goBack} > Back &nbsp; </Button>  {taskDetails.requestNum} */}
                            <Row className="align-items-left">
                                <Button className="ml-1 mr-1" color="primary" onClick={() => this.goBack(this.state.updated)}><i className="fa fa-angle-left" /> Back </Button>
                                {page === "myapps"
                                    ? taskDetails.actions.map(((action, index) =>
                                        <span key={index}>
                                            {this.handleButton(action)}
                                        </span>
                                    ))
                                    : null
                                }
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
                                                striped={stage.state !== "CURRENT"}
                                                color={stage.state === "CURRENT" ? "warning" : stage.state === "FINISHED" ? "success" : "secondary"}
                                                value={100 / (taskDetails.allStages.length)}> <div id={"status" + index} style={{ color: stage.state === "FINISHED" || stage.state === "CURRENT" ? "white" : "black" }} >{stage.statusName}</div>
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
                            <Row className="mb-4">
                                <Col xs="12" sm="12" md lg className="text-md-left text-center">
                                    <Row>
                                        {/* <Col xs={12} sm={12} md={4} lg={2}>
                                            <img src={taskDetails.createdByPhotoUrl} className="img-avaa img-responsive center-block" alt="picture" />
                                        </Col> */}
                                        <Col md><h5> {taskDetails.requestorUser.displayName} </h5>
                                            <Row>
                                                <Col md><h6> DFS/CN, {taskDetails.requestorUser.companyCode} </h6></Col>
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
                                        <Col md><h5><i className="fa fa-tablet mr-2" /> {taskDetails.requestorUser.telephoneNum} </h5></Col>
                                    </Row>
                                    <Row>
                                        <Col md><h5><i className="fa fa-envelope mr-2" /> {taskDetails.requestorUser.email}</h5></Col>
                                    </Row>
                                </Col>
                            </Row>
                                {this.handleViews(appType)}
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

                                    {page === "mypendingtask"
                                        ? <Row className="mb-4">
                                            <Col>
                                                {taskDetails.actions.map((action, index) =>
                                                    <React.Fragment key={index}>
                                                        {action.action !== "copy" && action.action !== "recall" && action.action !== "remind"
                                                            ? <Button className="mx-1" key={index} color={action.action !== "reject" && action.action !== "sendback" ? "success" : "danger"} onClick={() => this.approve(action.action)} > {action.actionName}</Button>
                                                            : null}
                                                    </React.Fragment>
                                                )}
                                            </Col>
                                        </Row>
                                        : null
                                    }
                                </div>
                                : null}

                            {taskDetails.histories.length !== 0
                                ? <Row>
                                    <Col> <h4>Approval Histories</h4></Col>
                                </Row>
                                : null}

                            {taskDetails.histories.map((history, index) =>
                                <div key={index}>
                                    <hr></hr>
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
                    </Card>
                    : null
                }
            </div>
        )
    }
}

export default TaskDetails;