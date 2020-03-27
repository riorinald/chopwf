import React, { Component } from 'react';
import {
    Card, CardBody, CardHeader, Col, Row,
    Input,
    Button,
    FormGroup,
    Label,
    Progress, UncontrolledTooltip,
    Badge,
    Modal, ModalBody, ModalFooter, ModalHeader, Spinner,
} from 'reactstrap';
import Axios from 'axios';
import config from '../../config';
import Swal from 'sweetalert2';
import ReactTable from "react-table";
import "react-table/react-table.css";
import Authorize from '../../functions/Authorize'
import { STU, LTU, LTI, CNIPS } from './viewDetails';
import { BSTU, BLTU, BLTI, BCNIPS } from './viewBranchDetails';

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
            isExpired: false,
            isLoading: false,
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
            this.setState({ page: this.props.match.params.page })
            this.getTaskDetails(this.props.location.state.taskId)
        }
    }

    async getTaskDetails(id) {
        this.setState({ loading: true })
        let userId = Authorize.getCookies().userId
        await Axios.get(`${config.url}/tasks/${id}?userid=${userId}`, { headers: { Pragma: 'no-cache' } }).then(res => {
            // await Axios.get(`https://localhost:44301/api/v1/tasks/${id}?userid=${userId}`).then(res => {

            if(res.data.actions.length === 0){
                //console.log('expired')
                this.setState({isExpired: true})
            }

            this.setState({ taskDetails: res.data, appType: res.data.applicationTypeId, loading: false })
            this.convertTaskDetails()
            //console.log(res.data)
        })
        // this.getUserDetails()

    }

    async getDocuments(taskId) {
        this.setState({isLoading: true, showModal: true})
        await Axios.get(`${config.url}/documents?category=normal&taskid=${taskId}`, { headers: { Pragma: 'no-cache' } })
        .then( res => {
            this.setState( state => ({
                isLoading: false,
                taskDetails:{
                ...state.taskDetails,
                documents: res.data
            }
            }))
        })
    }

    async getUserDetails() {
        this.setState({ loading: true })
        await Axios.get(`${config.url}/users/${this.state.taskDetails.histories[0].approvedBy}`, { headers: { Pragma: 'no-cache' } }).then(res => {
            this.setState({ userDetails: res.data, loading: false })
            //console.log(res.data)
        })
    }

    convertContractNums(nums) {
        return nums.join(", ")
    }

    setArray(data) {
        //console.log(Array.isArray(data))
        if(Array.isArray(data)){
            return data.join("; ")
        } else {
            return data
        }
    }

    convertBool(data){
        if (data === 'Y'){
            return 'Yes'
        }else{
            return 'No'
        }
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
        let regEx = dateValue.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')
        return regEx
    }



    approve(action) {
        let data = {
            userId: Authorize.getCookies().userId,
            comments: this.state.comments
        }

        Swal.fire({
            title: `Processing your Request ... `,
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
                        //console.log(res.data)

                        Swal.update({
                            title: res.data.message,
                            text: `The request has been ${res.data.message.toLowerCase()}.`,
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

    changeDeptHeads(heads) {
        let dh = ""
        heads.map(head => {
            return dh = dh + head.displayName + "; " ;
        })
        return dh
    }


    convertExpDate(dateValue) {
        let regEx = dateValue.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')
        return regEx;
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


    convertTaskDetails(){
        //console.log(this.setArray(this.state.taskDetails.departmentHeadsName))
        this.setState(prevState  =>({
            taskDetails:{
            ...prevState.taskDetails,
                returnDate: this.convertDate(this.state.taskDetails.returnDate),
                effectivePeriod: this.convertDate(this.state.taskDetails.effectivePeriod),
                isUseInOffice: this.convertBool(this.state.taskDetails.isUseInOffice),
                connectChop: this.convertBool(this.state.taskDetails.connectChop),
                departmentHeadsName: this.setArray(this.state.taskDetails.departmentHeadsName), 
                documentCheckByName: this.setArray(this.state.taskDetails.documentCheckByName)
            }
        }))
    }

    handleViews(appType) {
        if (this.state.taskDetails.branchId !== '') {
            switch (appType) {
                case 'STU':
                    return <BSTU taskDetails={this.state.taskDetails} />
                        ;
                case 'LTU':
                    return <BLTU taskDetails={this.state.taskDetails} />
                        ;
                case 'LTI':
                    return <BLTI taskDetails={this.state.taskDetails} />
                        ;
                case 'CNIPS':
                    return <BCNIPS taskDetails={this.state.taskDetails} />
                        ;
                default:
                    return <BSTU taskDetails={this.state.taskDetails} />
                        ;
            }
        }
        else {
            switch (appType) {
                case 'STU':
                    return <STU taskDetails={this.state.taskDetails} />
                        ;
                case 'LTU':
                    return <LTU taskDetails={this.state.taskDetails} />
                        ;
                case 'LTI':
                    return <LTI taskDetails={this.state.taskDetails} />
                        ;
                case 'CNIPS':
                    return <CNIPS taskDetails={this.state.taskDetails} />
                        ;
                default:
                    return <STU taskDetails={this.state.taskDetails} />
                        ;
            }
        }
    }


    blobToFile(theBlob: Blob, fileName: string): File {
       const b: any = theBlob;
       b.lastModifiedDate = new Date();
       b.name = fileName;
       return b;
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

        if (navigator.userAgent.indexOf('Edge') >= 0){
           var file = new Blob([u8arr], { type: mime });
           return this.blobToFile(file, filename);
        } else {
           return new File([u8arr], filename, { type: mime });
        }
        //return new File([u8arr], filename, { type: mime });
    }

    viewOrDownloadFile(documentId) {
        // if (b64 !== "") {
        let {b64, type, name} = ""
        Swal.fire({
            title: `Downloading the file ... `,
            type: "info",
            text: 'Please wait ...',
            footer: '',
            allowOutsideClick: false,
            // onClose: () => { this.goBack(true) },
            onBeforeOpen: () => {
                Swal.showLoading()
            },
            onOpen: () => {
                Axios.get(`${config.url}/documents/${documentId}`, { headers: { Pragma: 'no-cache' } })
                    .then(res => {
                        b64 = res.data.documentBase64String
                        type = res.data.documentFileType
                        name = res.data.documentFileName
                        
                        let file = this.dataURLtoFile(`data:${type};base64,${b64}`, name);
                        var blobUrl = new Blob([file], { type: type })
                        // Swal.update({
                        //     title: res.data.message,
                        //     text: `File Downloaded.`,
                        //     type: "success",
                        // })
                        Swal.close()
                        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                            window.navigator.msSaveOrOpenBlob(blobUrl, name)
                            return;
                        }
                        else {
                            window.open(URL.createObjectURL(file), "_blank")
                        }
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
        // Axios.get(`${config.url}/documents/${documentId}`, { headers: { Pragma: 'no-cache' } })
        // .then(res => {
        //     b64 = res.data.documentBase64String
        //     type = res.data.documentFileType
        //     name = res.data.documentFileName

        //     let file = this.dataURLtoFile(`data:${type};base64,${b64}`, name);
        //     var blobUrl = new Blob([file], { type: type })
        //     if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        //         window.navigator.msSaveOrOpenBlob(blobUrl, name)
        //         return;
        //     }
        //     else {
        //         window.open(URL.createObjectURL(file), "_blank")
        //     }
        //     // }
        //     // else {
        //     //     alert("BASE 64 String is empty !!!")
        //     // }
        // })
        // .catch(error => {
        //     if (error.response) {
        //         Swal.fire({
        //             title: "ERROR",
        //             html: error.response.data.message,
        //             type: "error"
        //         })
        //     }
        // })
    }

    render() {

        const { taskDetails, loading, showModal, page, appType, isExpired, isLoading } = this.state

        if (page === 'mypendingtask' && isExpired){
            return <>
                <Card className="animated fadeIn">
                    <CardBody>
                        <h5>Task is no longer in the pending list.</h5>
                    </CardBody>
                </Card>
                </>
        }
        return (
            <div className="animated fadeIn">
                {!loading ?
                    <Card className="animated fadeIn" >
                        <CardHeader>
                            {/* <Button onClick={this.goBack} > Back &nbsp; </Button>  {taskDetails.requestNum} */}
                            <Row className="align-items-left">
                                <Button className="mx-2" color="primary" onClick={() => this.goBack(this.state.updated)}><i className="fa fa-angle-left" /> Back </Button>
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
                                                color={
                                                    taskDetails.currentStatusId === "REJECTED" || taskDetails.currentStatusId === "SENDBACKED" ?
                                                        stage.state === "CURRENT" ?
                                                            "danger" :
                                                            stage.state === "FINISHED" ?
                                                                "success" :
                                                                "secondary" :
                                                        taskDetails.currentStatusId === "RECALLED" ?
                                                            stage.state === "CURRENT" ?
                                                                "primary" :
                                                                stage.state === "FINISHED" ?
                                                                    "success" :
                                                                    "secondary" :
                                                            stage.state === "CURRENT" ?
                                                                "warning" :
                                                                stage.state === "FINISHED" ?
                                                                    "success" :
                                                                    "secondary"
                                                }
                                                // color={stage.state === "CURRENT" ? "warning" : stage.state === "FINISHED" ? "success" : "secondary"}
                                                value={100 / (taskDetails.allStages.length)}> <div id={"status" + index} style={{ color: stage.state === "FINISHED" || stage.state === "CURRENT" ? "white" : "black" }} >{stage.statusName}</div>
                                            </Progress>
                                        </React.Fragment>

                                    )}
                                </Progress>
                            </Col>
                            <Row className="mb-3">
                                <Col xs="12" md lg><span className=" ml-3 display-5"> {taskDetails.requestNum}</span></Col>
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
                                <Col xs="12" sm="12" md lg className="ml-3 text-md-left text-center">
                                    <Row>
                                        {/* <Col xs={12} sm={12} md={4} lg={2}>
                                            <img src={taskDetails.createdByPhotoUrl} className="img-avaa img-responsive center-block" alt="picture" />
                                        </Col> */}
                                        <Col md><h5> {taskDetails.requestorUser.displayName} </h5>
                                            <Row>
                                                <Col md><h6> {taskDetails.requestorUser.departmentAbbr}, {taskDetails.requestorUser.companyId} </h6></Col>
                                            </Row>
                                            <Row>
                                                <Col xs={12} sm={12} md={6} lg={6}>
                                                    <h6><center className="boxs mr-4">APPLICANT</center></h6>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs="12" sm="12" md lg className="text-md-left text-center">
                                    <Row>
                                        <Col className="pl-0" md><h5><i className="fa fa-tablet mr-2" /> {taskDetails.requestorUser.telephoneNum} </h5></Col>
                                    </Row>
                                    <Row>
                                        <Col className="pl-0" md><h5><i className="fa fa-envelope mr-2" /> {taskDetails.requestorUser.email}</h5></Col>
                                    </Row>
                                </Col>
                            </Row>
                            {this.handleViews(appType)}
                            {/* <Row> */}
                            {/* <FormGroup> */}
                            <Col>
                                <Row>
                                    <Col className="mx-2 mb-2">
                                        <FormGroup>
                                            <Label className="row mx-1">Documents</Label>
                                            <Button color="primary" onClick={() => this.getDocuments(this.props.location.state.taskId)}>View Documents</Button>
                                        </FormGroup>

                                        <Modal color="info" size="xl" toggle={this.toggleView} isOpen={showModal} >
                                            <ModalHeader toggle={this.toggleView} className="center"> Documents </ModalHeader>
                                            <ModalBody>
                                                <ReactTable
                                                    data={taskDetails.documents}
                                                    sortable
                                                    loading={isLoading}
                                                    columns={[
                                                        {
                                                            Header: "#",
                                                            acessor: "index",
                                                            Cell: row => (
                                                                <div>{row.index + 1}</div>
                                                            ),
                                                            width: 40,
                                                            style: { textAlign: "center" }
                                                        },
                                                        {
                                                            Header: "Contract Number",
                                                            acessor: "contractNums",
                                                            Cell: row => (
                                                                <div> {this.convertContractNums(row.original.contractNums)} </div>
                                                            ),
                                                            // style: { textAlign: "center", 'whiteSpace': 'unset' },
                                                            width: 135,
                                                            show: appType === "CNIPS"
                                                        },
                                                        {
                                                            Header: "Document Name (English)",
                                                            accessor: "documentNameEnglish",
                                                            width: 250,
                                                            style: { 'whiteSpace': 'normal' }
                                                            // style: { textAlign: "center" },
                                                        },
                                                        {
                                                            Header: "Document Name (Chinese)",
                                                            accessor: "documentNameChinese",
                                                            width: 250,
                                                            style: { 'whiteSpace': 'normal' }
                                                            // style: { textAlign: "center" },
                                                        },
                                                        {
                                                            Header: "Expiry Date",
                                                            accessor: "expiryDate",
                                                            width: 250,
                                                            Cell: row => (
                                                                <div className="blobLink" onClick={() => this.viewOrDownloadFile(row.original.documentId)} >
                                                                    {this.convertExpDate(row.original.expiryDate)}
                                                                </div>
                                                            ),
                                                            show: appType === "LTU"
                                                        },
                                                        {
                                                            Header: "DH Approved",
                                                            accessor: "documentNameChinese",
                                                            Cell: row => (
                                                                <span className="blobLink" onClick={() => this.viewOrDownloadFile(row.original.documentId)} >
                                                                    {this.changeDeptHeads(row.original.departmentHeads)}
                                                                </span>

                                                            ),
                                                            show: appType === "LTU"
                                                        },

                                                        {
                                                            Header: "Attached Document",
                                                            accessor: "documentName",
                                                            Cell: row => (
                                                                <div className="blobLink" onClick={() => this.viewOrDownloadFile(row.original.documentId)} >{row.original.documentFileName}</div>
                                                            ),
                                                            show: appType !== "LTU"
                                                            // style: {textAlign: "center" },
                                                        },
                                                    ]}
                                                    defaultPageSize={10}
                                                />
                                            </ModalBody>
                                            <ModalFooter>
                                            </ModalFooter>
                                        </Modal>
                                    </Col>
                                </Row>
                            </Col>
                            {/* </FormGroup> */}
                            {/* </Row> */}
                            {page === "mypendingtask"
                                ? <div className="px-2 pt-2">
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
                                    <Col className="mx-3 mt-2"> <h4>Approval Histories</h4></Col>
                                </Row>
                                : null}

                            {taskDetails.histories.map((history, index) =>
                                <div key={index}>
                                    <hr></hr>
                                    <Row className="text-md-left text-center">
                                        {/* <Col xs="12" sm="12" md="2" lg="1">
                                            <img src={history.approvedByAvatarUrl} className="img-avaa img-responsive" alt="Avatar" />
                                        </Col> */}
                                        <Col  className="mx-3" sm md="10" lg>
                                            <h5>{history.approvedByName}<span> <Badge color={history.stateIndicatorColor.toLowerCase()}> {history.stateIndicator} </Badge></span></h5>
                                            <h6><Badge className="mb-1" color="light">{this.convertApprovedDate(history.approvedDate)}</Badge></h6>
                                            <Col className="p-0"> <p>{history.comments}</p> </Col>
                                        </Col>
                                    </Row>
                                </div>
                            )}

                        </CardBody>
                    </Card>
                    : 
                    <div className="animated fadeIn pt-3 text-center"><Spinner /> <br />Loading ...</div>
                }
            </div>
        )
    }
}

export default TaskDetails;