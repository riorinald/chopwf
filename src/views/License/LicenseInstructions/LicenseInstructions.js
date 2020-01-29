import React, { Component } from 'react';
// import carImg from "../../assets/img/carousel.png";
import editIcon from "../../../assets/img/edit.png";
import {
    Card,
    CardBody,
    Form,
    FormGroup,
    Input,
    Button,
    Row,
    Col,
    Label,
    Carousel,
    CarouselItem,
    CarouselControl,
    CarouselIndicators,
    CarouselCaption,
    CardHeader,
    ListGroup,
    ListGroupItem,
    CustomInput,
    InputGroup,
    Collapse

} from 'reactstrap';
import { tsExpressionWithTypeArguments } from '@babel/types';
import Axios from 'axios';
import config from '../../../config';

class LicenseInstruction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            workflow: `${this.props.legalName} WORKFLOW USER GUIDE`,
            applicantInstructions: [],
            approverInstructions: [],
            screenshots: [],
            activeIndex: 0,
            height: 0,
            width: 0,
            editable: false,
            b64String: "",
            userGuideFile: null
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.makeEditable = this.makeEditable.bind(this);
        this.getUserInstructions = this.getUserInstructions.bind(this);
        this.viewOrDownloadFile = this.viewOrDownloadFile.bind(this);
        this.handleFileUpload = this.handleFileUpload.bind(this);
    };

    async componentDidMount() {
        // this.getInstructions()
        await this.getUserInstructions("USERINSTRUCTIONS", "b64String")
        // await this.getUserInstructions("APPLICANT", "applicantInstructions")
        // await this.getUserInstructions("APPROVERS", "approverInstructions")
        this.updateWindowDimensions();
        window.addEventListener("resize", this.updateWindowDimensions.bind(this));
    }
    componentWillUnmount() {
        window.removeEventListener("resize", this.updateWindowDimensions.bind(this));
    }
    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    async getUserInstructions(sectionId, name) {
        const res = await Axios.get(`${config.url}/userinstructions/license/${sectionId}`, { headers: { Pragma: 'no-cache' } })
        this.setState({ [name]: res.data.sectionData, userGuideFile: this.dataURLtoFile(res.data.sectionData, "User guide") })
        // console.log(res.data)
    }


    makeEditable() {
        if (this.state.editable) {
            alert("Instructions updated")
            //codes to update instructions to the database
            this.updateInstructions("USERINSTRUCTIONS", this.state.b64String)
            // this.updateInstructions("APPLICANT")
            // this.updateInstructions("APPROVERS")
        }
        this.setState({ editable: !this.state.editable })
    }

    getBase64(file, callback) {
        let reader = new FileReader();
        reader.onload = function () {
            callback(reader.result)
        };
        reader.readAsDataURL(file)
    }

    handleFileUpload(event) {
        let file = null
        if (event.target.files[0]) {
            this.getBase64(event.target.files[0], (result) => {
                this.setState({ b64String: result })
                // 
            })
        }
    }

    dataURLtoFile(dataurl, filename) {
        if (dataurl !== "") {
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
        else
            return ""
    }

    async updateInstructions(sectionId, b64) {
        console.log(b64)
        let newFormData = new FormData()

        newFormData.append("sectionData", b64)

        await Axios.put(`${config.url}/userInstructions/license/${sectionId}/${localStorage.getItem('userId')}`, newFormData).then(res => {
        })
    }

    viewOrDownloadFile() {

        if (this.state.b64String !== "") {
            var arr = this.state.b64String.split(','),
                mime = arr[0].match(/:(.*?);/)[1]
            let file = this.state.userGuideFile
            var blobUrl = new Blob([file], { type: mime })
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(blobUrl, "User Guide")
                return;
            }
            else {
                window.open(URL.createObjectURL(this.state.userGuideFile), "_blank")
            }
        }
        else {
            alert("BASE 64 String is empty !!!")
        }
    }

    render() {
        const Edit = <img onClick={this.makeEditable} width="20px" src={editIcon} />
        const Apply = <Button color="primary" onClick={this.makeEditable}>APPLY</Button>

        return (
            <div className="animated fadeIn">
                <h2>User Guide</h2>
                <Card >
                    <CardHeader><h5 style={{ float: "left" }}>{this.state.workflow}</h5>
                        {localStorage.getItem('viewAdminLicense') === "true"
                            ? <div style={{ float: "right" }}>
                                {!this.state.editable ? Edit : Apply}
                            </div>
                            : null}
                    </CardHeader>

                    <CardBody>
                        <Collapse isOpen={this.state.editable}>
                            <Form>
                                <FormGroup>
                                    <Label>Add new user guide</Label>
                                    <CustomInput label="User Guide" id="userGuideUpload" onChange={this.handleFileUpload} type="file" accept=".pdf" />
                                </FormGroup>
                            </Form>
                        </Collapse>
                        <Collapse isOpen={!this.state.editable}>
                            <Row>
                                <Col style={{ textAlign: "center" }} >
                                    <img style={{ cursor: "pointer", textAlign: "center" }} onClick={this.viewOrDownloadFile} src="https://img.icons8.com/dotty/80/000000/user-manual.png" />
                                    <div><Label>User Guide</Label></div>
                                </Col>
                            </Row>
                        </Collapse>
                    </CardBody>
                </Card>
            </div>
        )
    }

}
export default LicenseInstruction;