import React, { Component } from 'react';
// import ReactTable from "react-table";
// import "react-table/react-table.css"
import Axios from 'axios';
import {
    Card, CardBody, CardHeader, Table, Col, Row, CardFooter,
    Input,
    FormFeedback,
    Button,
    FormGroup,
    InputGroup,
    Label,
    Progress, Badge, Spinner,
    UncontrolledTooltip, CustomInput, Collapse
} from 'reactstrap';
import config from '../../../config';
import Swal from 'sweetalert2';
import TextareaAutosize from 'react-autosize-textarea';


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
            wrongDocError: "",
            currentStatus: "",
            deliverWay: "",
            expressNumber: "",
            invalidExpress: false,
            documents: [],
            fields: []
        }
        this.goBack = this.goBack.bind(this)
        this.handleRadio = this.handleRadio.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.uploadDocument = this.uploadDocument.bind(this)
        this.dataURLtoFile = this.dataURLtoFile.bind(this)
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
        await Axios.get(`${config.url}/licenses/${taskId}?userId=${localStorage.getItem("userId")}`, { headers: { Pragma: 'no-cache' } })
            .then(res => {
                console.log(res.data)
                this.setState({ taskDetails: res.data, currentStatus: res.data.currentStatusId, loading: false, })



                /// TESTING - ANAND //
                // let obj = { label: "", value: "" }
                let arr = []
                let keys = ["telephoneNum", "departmentName", "licenseName", "purposeType", "documentTypeName", "plannedReturnDate"
                    , "needWatermark", "watermark", "deliveryWayName", "expDeliveryAddress", "expDeliveryReceiver"
                    , "expDeliveryMobileNo",  "seniorManagers","licenseAdminDeliverWay","expDeliveryNumber", "returnWayName","expReturnNumber"]
                keys.map(key => {
                    var obj = {}
                    switch (key) {
                        case "telephoneNum":
                            obj.label = "Tel."
                            obj.value = res.data[key]
                            arr.push(obj)
                            break;
                        case "departmentName":
                            obj.label = "Department"
                            obj.value = res.data[key]
                            arr.push(obj)
                            break;
                        case "licenseName":
                            obj.label = "License Name"
                            obj.value = res.data[key]
                            arr.push(obj)
                            break;
                        case "purposeType":
                            obj.label = "Purpose"
                            obj.value = res.data[key] === "PS" ? res.data.purposeComment : res.data.purposeTypeName
                            arr.push(obj)
                            break;
                        case "documentTypeName":
                            obj.label = "Document Type"
                            obj.value = res.data[key]
                            arr.push(obj)
                            break;
                        case "plannedReturnDate":
                            obj.label = "Planned Return Date"
                            obj.value = res.data.plannedReturnDate !== "/" ? this.convertDate(res.data[key]) : ""
                            arr.push(obj)
                            break;
                        case "needWatermark":
                            if (res.data.documentTypeId === "SCANCOPY") {
                                obj.label = "Watermark"
                                obj.value = res.data[key] === "Y" ? res.data.watermark : "No Watermark"
                                arr.push(obj)
                            }
                            break;
                        case "watermark":
                            if (res.data.documentTypeId === "SCANCOPY" && res.data.needWatermark === "N") {
                                obj.label = "Reason for no watermark"
                                obj.value = res.data[key]
                                arr.push(obj)
                            }
                            break;
                        case "deliveryWayName":
                            if (res.data.documentTypeId === "ORIGINAL") {
                                obj.label = "Deliver Way"
                                obj.value = res.data[key]
                                arr.push(obj)
                            }
                            break;
                        case "expDeliveryAddress":
                            if (res.data.documentTypeId === "ORIGINAL") {
                                // if (res.data.deliverWay === "Express") {
                                obj.label = "Address"
                                obj.value = res.data[key]
                                arr.push(obj)
                                // }
                            }
                            break;
                        case "expDeliveryReceiver":
                            if (res.data.documentTypeId === "ORIGINAL") {
                                // if (res.data.deliverWay === "Express") {
                                obj.label = "Reciever"
                                obj.value = res.data[key]
                                arr.push(obj)
                                // }
                            }
                            break;
                        case "expDeliveryNumber":
                            if (res.data.documentTypeId === "ORIGINAL" ) {
                                // if (res.data.deliverWay === "Express") {
                                obj.label = "Deliver Express Number"
                                obj.value = res.data[key]
                                arr.push(obj)
                                // }
                            }
                            break;
                        case "expDeliveryMobileNo":
                            if (res.data.documentTypeId === "ORIGINAL") {
                                obj.label = "Receiver Mobile Phone"
                                obj.value = res.data[key]
                                arr.push(obj)
                            }
                            break;
                        case "returnWayName":
                            if (res.data.documentTypeId === "ORIGINAL") {
                                obj.label = "Return Way"
                                obj.value = res.data[key]
                                arr.push(obj)
                            }
                            break;
                        case "seniorManagers":
                            obj.label = "Senior Manager or above of requestor department"
                            obj.value = this.convertMgrs(res.data[key])
                            arr.push(obj)
                            break;
                        case "expReturnNumber":
                            if (res.data.documentTypeId === "ORIGINAL") {
                                obj.label = "Return Express Number"
                                obj.value = res.data[key]
                                arr.push(obj)
                            }
                            break;
                        case "licenseAdminDeliverWay":
                            if (res.data.documentTypeId === "ORIGINAL") {
                                obj.label = "License Admin Deliver Way"
                                obj.value = res.data[key]
                                arr.push(obj)
                            }
                            break;
                        default :
                            obj.value = res.data[key]
                            arr.push(obj)
                            break;
                    }
                })
                this.setState({ fields: arr })
                console.log(arr)
                //TESTING -- ANAND//
            })
    }

    goBack() {
        console.log(`/license/${this.props.match.params.page}`)
        this.props.history.push({
            pathname: `/license/${this.props.match.params.page}`
        })
    }


    convertDate(dateValue) {
        let regEx = dateValue.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')
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
        if (this.state.currentStatus === "PENDINGLICENSEADMINACKLENDOUT" || this.state.currentStatus === "PENDINGLICENSEADMIN") {
            if (this.state.taskDetails.documentTypeId === "ORIGINAL") {
                if (this.state.deliverWay === "Express") {
                    if (this.state.expressNumber !== "") {
                        valid = true
                    }
                    else {
                        valid = false
                        // Swal.fire({
                        //     title: "No Express Number",
                        //     html: "Please add express number !",
                        //     type: "warning"
                        // })
                        this.setState({ invalidExpress: true })
                    }
                }
                else if (this.state.deliverWay === "F2F") {
                    valid = true
                }
                else {
                    valid = false
                    Swal.fire({
                        title: "No Deliver Way Selected",
                        html: "Please select a way of deliver. ",
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
                        html: "Please attach documents for approval.",
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
                        // Swal.fire({
                        //     title: "No Express Number",
                        //     html: "Please add express number !",
                        //     type: "warning"
                        // })
                        this.setState({ invalidExpress: true })
                    }
                }
                else if (this.state.deliverWay === "F2F") {
                    valid = true
                }
                else {
                    valid = false
                    Swal.fire({
                        title: "No Return Way Selected",
                        html: "Please select a way of return.",
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
        let valid = true
        let deliverWay = this.state.deliverWay
        if (this.state.currentStatus === "PENDINGLICENSEADMINACKLENDOUT" || this.state.currentStatus === "PENDINGLICENSEADMIN" || this.state.currentStatus === "PENDINGREQUESTORRETURN") {
            if (action === "licenseadminacklendout" || action === "requestorreturn" || action === "approve") {
                valid = this.validate()
            }
            else {
                if (action === "reject" || action === "sendback") {
                    deliverWay = ""
                }
                valid = true
            }
        }
        else {
            valid = true
        }
        let postReq = new FormData();
        postReq.append("UserId", localStorage.getItem("userId"));
        postReq.append("Comments", this.state.comments);
        postReq.append("ReturnWay", deliverWay);
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

            Swal.fire({
                title: `Please wait while your request is being processed ... `,
                type: "info",
                text: '',
                footer: '',
                allowOutsideClick: false,
                onClose: () => { this.goBack(true) },
                onBeforeOpen: () => {
                    Swal.showLoading()
                },
                onOpen: () => {
                    Axios.post(`${config.url}/licenses/${this.props.location.state.taskId}/${action}`, postReq, { headers: { 'Content-Type': 'multipart/form-data' } })
                        .then(res => {

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
        this.setState({ invalidExpress: false, [name]: value })
    }

    /*handleChangeExpress = name => event => {
        let value = event.target.value
        let id = event.target.id
        this.setState(state => {
            let taskDetails = this.state.taskDetails
            taskDetails[name] = value
            return taskDetails
        })
    }*/

    convertApprovedDate(dateValue) {

        let regEx = dateValue.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\w{2})/g, '$1/$2/$3 $4:$5 $6')
        return regEx
    }

    uploadDocument(event) {
        let ext = config.allowedExtension
        let extValid = false
        if (event.target.files.length !== 0) {
            let last = event.target.files[0].name.split('.').length
            let extension = event.target.files[0].name.split('.')[last - 1]
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
            for (let i = 0; i < ext.length; i++) {
                if (ext[i] === extension || ext[i].toUpperCase() === extension) {
                    extValid = true
                    break;
                }
                else {
                    extValid = false
                }
            }
            if (valid && extValid) {
                let Url = URL.createObjectURL(file)

                let obj = {
                    file: file,
                    fileName: fileName,
                    url: Url
                }
                this.setState({ wrongDocError: "" })
                this.setState(state => {
                    const documents = this.state.documents.concat(obj)
                    return { documents }
                })
            }
            else {
                if (!valid) {
                    Swal.fire({
                        title: "Document Exists ",
                        html: `The document has already been added to the list !`,
                        type: "warning",
                    })
                }
                else if (!extValid) {
                    this.setState({ wrongDocError: "Please attach a valid document !" })
                }
            }
        }
    }

    viewOrDownloadFile(file) {
        var blobUrl = new Blob([file], { type: file.type })
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blobUrl, file.name)
            return;
        }
        else {
            window.open(URL.createObjectURL(file), "_blank")
        }
    }


    dataURLtoFile(dataurl, filename) {
        console.log(dataurl.split(','))
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



    render() {
        const { taskDetails, loading, page, currentStatus, expressNumber, deliverWay, documents, invalidExpress } = this.state
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
                                        : taskDetails.actions.map((action, index) =>
                                            action.action === "copy" ?
                                                <Button key={index}
                                                    className="mr-1"
                                                    color="info"
                                                    onClick={() => this.updated(action.action)}
                                                >
                                                    {action.actionName}
                                                </Button>
                                                : null
                                        )
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
                                                    striped={true}
                                                    color={
                                                        taskDetails.currentStatusId === "REJECTED" || taskDetails.currentStatusId === "SENDBACKED" ?
                                                            stage.state === "CURRENT" ?
                                                                "danger" :
                                                                stage.state === "FINISHED" ?
                                                                    "success"
                                                                    : "secondary"
                                                            : taskDetails.currentStatusId === "RECALLED" ?
                                                                stage.state === "CURRENT" ?
                                                                    "primary" :
                                                                    stage.state === "FINISHED" ?
                                                                        "success"
                                                                        : "secondary"
                                                                : stage.state === "CURRENT" ?
                                                                    "warning" :
                                                                    stage.state === "FINISHED" ?
                                                                        "success" :
                                                                        "secondary"
                                                    }
                                                    // color={stage.state === "CURRENT" ? "warning" : stage.state === "FINISHED" ? "green" : "secondary  "}
                                                    value={100 / taskDetails.allStages.length}> <div id={"status" + index} style={{ color: stage.state === "FINISHED" ? "white" : stage.state === "CURRENT" ? "white" : "black" }} >{stage.statusName}</div>
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
                                        {/* <Col xs={12} sm={12} md={4} lg={2}>
                                            <img src={taskDetails.histories[0].approvedByAvatarUrl} className="img-avaa img-responsive center-block" alt="picture" />
                                        </Col> */}
                                        <Col md><h5> {taskDetails.requestorUser.displayName} </h5>
                                            <Row>
                                                <Col md><h6> {taskDetails.departmentAbbr},  {taskDetails.requestorUser.companyId} </h6></Col>
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
                                        <Col md><h5><i className="fa fa-tablet mr-2" />{taskDetails.requestorUser.telephoneNum} </h5></Col>
                                    </Row>
                                    <Row>
                                        <Col md><h5><i className="fa fa-envelope mr-2" /> {taskDetails.email}</h5></Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                {this.state.fields.map((field, i) => (
                                    field.value !== "" ?
                                    <Col key={i} sm="6">
                                        <Row style={{ marginBottom: "15px" }} >
                                            <Col sm="6">
                                                <Label>{field.label}</Label>
                                            </Col>
                                            <Col sm="6">
                                                <TextareaAutosize className="form-control" disabled type="text" defaultValue={field.value} name="text-input" placeholder="/" />
                                            </Col>
                                        </Row>
                                    </Col>
                                    : console.log( "excluded: ", field)
                                    )
                                )}
                            </Row>



                            {page === "mypendingtask"
                                ? <div>
                                    {currentStatus === "PENDINGLICENSEADMINACKLENDOUT" || currentStatus === "PENDINGLICENSEADMIN"
                                        ?
                                        <Row>
                                            <Col>
                                                {taskDetails.documentTypeId === "ORIGINAL"
                                                    ?
                                                    <FormGroup onChange={this.handleRadio} >
                                                        <Label>Deliver Way</Label>
                                                        <CustomInput type="radio" id="deliverWay1" name="deliverWay" value="F2F" label="面对面 Face to face" />
                                                        <CustomInput type="radio" id="deliverWay2" name="deliverWay" value="Express" label="快递 Express">
                                                            <Collapse className="mt-1" isOpen={deliverWay === "Express"}>
                                                                <Label>Express Number</Label>
                                                                <Input invalid={invalidExpress} id="expressNumber" onChange={this.handleChange("expressNumber")} value={expressNumber} type="text" placeholder="Please enter the Express Number" />
                                                                <FormFeedback>Express Number is required.</FormFeedback>
                                                                <Row> &nbsp; </Row>
                                                            </Collapse>
                                                        </CustomInput>
                                                    </FormGroup>
                                                    :
                                                    <FormGroup>
                                                        <Label>Attach Document</Label>
                                                        <CustomInput
                                                            accept=".jpg, .png, .xls, .xlsm, .xlsx, .msg, .jpeg, .txt, .rtf, .tiff, .tif, .doc, .docx, .pdf, .pdfx, .bmp"
                                                            id="docFileName" onChange={this.uploadDocument} type="file" bsSize="lg" color="primary" />
                                                        &nbsp; <small style={{ color: '#F86C6B' }} > {this.state.wrongDocError} </small>
                                                        <Collapse isOpen={documents.length !== 0}>
                                                            {documents.map((doc, index) =>
                                                                <div key={index} style={{ color: "blue", cursor: "pointer" }} onClick={() => this.viewOrDownloadFile(doc.file)}> {doc.fileName} </div>
                                                            )}
                                                        </Collapse>
                                                    </FormGroup>
                                                }
                                            </Col>
                                        </Row>
                                        : taskDetails.requestorUser.userId === localStorage.getItem('userId')
                                            ?
                                            currentStatus === "PENDINGREQUESTORRETURN"
                                                ? <Row>
                                                    <Col>
                                                        <FormGroup onChange={this.handleRadio} >
                                                            <Label>Return Way</Label>
                                                            <CustomInput type="radio" id="deliverWay1" name="deliverWay" value="F2F" label="面对面 Face to face" />
                                                            <CustomInput type="radio" id="deliverWay2" name="deliverWay" value="Express" label="快递 Express">
                                                                <Collapse className="mt-1" isOpen={deliverWay === "Express"}>
                                                                    <Label>Express Number</Label>
                                                                    <Input invalid={invalidExpress} id="expressNumber" onChange={this.handleChange("expressNumber")} value={expressNumber} type="text" placeholder="Please enter the Express Number" />
                                                                    <FormFeedback>Express Number field is required.</FormFeedback>
                                                                    <Row> &nbsp; </Row>
                                                                </Collapse>
                                                            </CustomInput>

                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                                : null
                                            : null}

                                    < Row >
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
                                        <Col>
                                            {taskDetails.actions.map((action, index) =>
                                                action.action !== "copy" ?
                                                    <Button className="mx-1" key={index} color={action.action !== "reject" && action.action !== "sendback" ? "success" : "danger"} onClick={() => this.updated(action.action)} > {action.actionName}</Button>
                                                    : null
                                            )}
                                        </Col>
                                    </Row>
                                </div>

                                : page === "mypendingtask"
                                    ? <div>
                                        {currentStatus === "PENDINGREQUESTORRETURN"
                                            ? <Row>
                                                <Col>
                                                    <FormGroup onChange={this.handleRadio} >
                                                        <Label>Return Way</Label>
                                                        <CustomInput type="radio" id="deliverWay1" name="deliverWay" value="F2F" label="面对面 Face to face" />
                                                        <CustomInput type="radio" id="deliverWay2" name="deliverWay" value="Express" label="快递 Express">
                                                            <Collapse className="mt-1" isOpen={deliverWay === "Express"}>
                                                                <Label>Express Number</Label>
                                                                <Input invalid={invalidExpress} id="expressNumber" onChange={this.handleChange("expressNumber")} value={expressNumber} type="text" placeholder="Please enter the Express Number" />
                                                                <FormFeedback>Express Number field is required.</FormFeedback>
                                                                <Row> &nbsp; </Row>
                                                            </Collapse>
                                                        </CustomInput>

                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            :
                                            null}
                                        {page === "mypendingtask" && currentStatus === "PENDINGREQUESTORACK" || currentStatus === "PENDINGREQUESTORRETURN"
                                            ?
                                            taskDetails.actions.map((action, index) =>
                                                action.action !== "copy"
                                                    ? <Button
                                                        key={index}
                                                        className="mr-1"
                                                        color="success"
                                                        onClick={() => this.updated(action.action)}
                                                    >
                                                        {action.actionName}
                                                    </Button>
                                                    : null
                                            )
                                            : null}

                                    </div>
                                    :
                                    null}
                        </CardBody>
                        <CardFooter>
                            {taskDetails.histories.length !== 0
                                ? <Row><Col><h4>Approval History</h4></Col></Row>
                                : null}
                            {taskDetails.histories.map((history, index) =>
                                <div key={index}>
                                    <hr></hr>
                                    <Row>
                                        {/* <Col md="1">
                                            <img src={history.approvedByAvatarUrl} className="img-avatar" alt="Avatar" />
                                        </Col> */}
                                        <Col md="8">
                                            <h5>{history.approvedByName}<span> <Badge color={history.stateIndicatorColor.toLowerCase()}>{history.stateIndicator}</Badge></span></h5>
                                            <div>{this.convertApprovedDate(history.approvedDate)}</div>
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