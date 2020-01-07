import React, { Component } from 'react';
// import carImg from "../../assets/img/carousel.png";
import editIcon from "../../assets/img/edit.png";
import {
    Card,
    CardBody,
    Form,
    FormGroup,
    Input,
    Button,
    Row,
    Label,
    Carousel,
    CarouselItem,
    CarouselControl,
    CarouselIndicators,
    CarouselCaption,
    CardHeader,
    ListGroup,
    ListGroupItem,
    CustomInput

} from 'reactstrap';
import { tsExpressionWithTypeArguments } from '@babel/types';
import Axios from 'axios';
import config from '../../config';

class Instruction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            instructions: {},
            workflow: `${this.props.legalName} WORKFLOWS USER INSTRUCTIONS`,
            summary: "",
            applicantInstructions: [],
            approverInstructions: [],
            screenshots: [],
            activeIndex: 0,
            height: 0,
            width: 0,
            editable: false
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.next = this.next.bind(this);
        this.next = this.next.bind(this);
        this.previous = this.previous.bind(this);
        this.goToIndex = this.goToIndex.bind(this);
        this.onExiting = this.onExiting.bind(this);
        this.onExited = this.onExited.bind(this);
        this.makeEditable = this.makeEditable.bind(this);
        this.getInstructions = this.getInstructions.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleFileUpload = this.handleFileUpload.bind(this);
    };

    componentDidMount() {
        this.getInstructions()
        this.getUserInstructions()
        this.updateWindowDimensions();
        window.addEventListener("resize", this.updateWindowDimensions.bind(this));
    }
    componentWillUnmount() {
        window.removeEventListener("resize", this.updateWindowDimensions.bind(this));
    }
    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    async getUserInstructions() {
        const res = await Axios.get(`${config.url}/userinstructions/chop`)
        console.log(res.data)
    }

    async getInstructions() {
        const response = await Axios.get('http://5b7aa3bb6b74010014ddb4f6.mockapi.io/config/2')
        let instructions = response.data
        this.setState({ summary: instructions.summary, applicantInstructions: instructions.section1, approverInstructions: instructions.section2 })
        instructions.screenshot.map((shot, index) => {
            let obj = {
                name: `Screenshot ${index + 1}`,
                src: shot,
                altText: `Slide ${index + 1}`,
                caption: `Slide ${index + 1}`
            }
            this.setState(state => {
                const screenshots = state.screenshots.concat(obj)
                return {
                    screenshots
                }
            })

        })
    }

    onExiting() {
        this.animating = true;
    }

    onExited() {
        this.animating = false;
    }

    next() {
        if (this.animating) return;
        const nextIndex = this.state.activeIndex === this.state.screenshots.length - 1 ? 0 : this.state.activeIndex + 1;
        this.setState({ activeIndex: nextIndex });
    }

    previous() {
        if (this.animating) return;
        const nextIndex = this.state.activeIndex === 0 ? this.state.screenshots.length - 1 : this.state.activeIndex - 1;
        this.setState({ activeIndex: nextIndex });
    }

    goToIndex(newIndex) {
        if (this.animating) return;
        this.setState({ activeIndex: newIndex });
    }

    makeEditable() {
        if (this.state.editable) {
            console.log("Instructions updated")
            //codes to update instructions to the database
        }
        this.setState({ editable: !this.state.editable })
    }

    addApplicantInstruction = () => {
        this.setState(state => {
            const applicantInstructions = state.applicantInstructions.concat('Please input the new instructions for Applicants')
            return {
                applicantInstructions
            }
        })
    }
    deleteApplicantInstruction = i => {
        this.setState(state => {
            const applicantInstructions = state.applicantInstructions.filter((item, index) => i !== index);
            return {
                applicantInstructions
            }
        })
    }
    addApproverInstruction = () => {
        this.setState(state => {
            const approverInstructions = state.approverInstructions.concat('Please input the new instructions for Approvers')
            return {
                approverInstructions
            }
        })
    }
    deleteApproverInstruction = i => {
        this.setState(state => {
            const approverInstructions = state.approverInstructions.filter((item, index) => i !== index);
            return {
                approverInstructions
            }
        })
    }

    handleChange(event) {
        let name = event.target.name
        this.setState({ [name]: event.target.value })
    }

    handleList = index => event => {
        let name = event.target.name
        let value = event.target.value
        if (name === "applicantInstructions") {
            this.setState(state => {
                const applicantInstructions = this.state.applicantInstructions
                applicantInstructions[index] = value
                return applicantInstructions
            })

        }
        else {
            this.setState(state => {
                const approverInstructions = this.state.approverInstructions
                approverInstructions[index] = value
                return approverInstructions
            })
        }
    }

    handleFileUpload(event) {
        let file = null
        if (event.target.files[0]) {
            file = URL.createObjectURL(event.target.files[0])
        }
        let length = this.state.screenshots.length + 1
        const obj = {
            name: `Screenshot ${length}`,
            src: file,
            altText: `Slide ${length}`,
            caption: `Slide ${length}`
        }
        this.setState(state => {
            const screenshots = this.state.screenshots.concat(obj)
            return {
                screenshots
            }
        })
    }

    render() {
        const applicantInstructions = this.state.applicantInstructions.map((instruction, index) =>
            <li key={index + "applicant"}>{instruction}</li>)
        const applicantInstructionsEditable = <div>{this.state.applicantInstructions.map((instruction, index) =>
            <li key={index + "applicant"}><Form style={{ display: "flex" }}><Input onChange={this.handleList(index)} type="text" name="applicantInstructions" value={instruction}></Input><Button color="danger " onClick={() => this.deleteApplicantInstruction(index)}>Delete</Button></Form><br /></li>)}<Button onClick={this.addApplicantInstruction}>Add new instruction for applicants</Button></div>
        // <img onClick={() => this.deleteApplicantInstruction(index)} width="17px" height="17px" src={deleteIcon} />
        const approverInstructions = this.state.approverInstructions.map((instruction, index) =>
            <li key={index + "approver"}>{instruction}</li>)
        const approverInstructionsEditable = <div>{this.state.approverInstructions.map((instruction, index) =>
            <li key={index + "approver"}><Form style={{ display: "flex" }}><Input type="text" name="approverInstructions" defaultValue={instruction}></Input><Button color="danger " onClick={() => this.deleteApproverInstruction(index)}>Delete</Button></Form><br /></li>)}<Button onClick={this.addApproverInstruction}>Add new instruction for Approvers</Button></div>
        // const { activeIndex } = this.state;
        const slides = this.state.screenshots.map((item) => {
            return (
                <CarouselItem
                    onExiting={this.onExiting}
                    onExited={this.onExited}
                    key={item.src}
                >
                    <img src={item.src} alt={item.altText} width={this.state.width - 320} height={this.state.height - 150} />
                    <CarouselCaption captionText={item.caption} captionHeader={item.caption} />
                </CarouselItem>
            );
        });
        const summary = this.state.summary;
        const summaryEditable = <Form>
            <Label>Edit User Instructions</Label>
            <Input style={{ height: "150px" }} type="textarea" onChange={this.handleChange} name="summary" value={this.state.summary}></Input>
        </Form>
        const Edit = <img onClick={this.makeEditable} width="20px" src={editIcon} />
        const Apply = <Button color="success" onClick={this.makeEditable}>APPLY</Button>
        const Screenshots = <Carousel
            activeIndex={this.state.activeIndex}
            next={this.next}
            previous={this.previous}
        >
            <CarouselIndicators items={this.state.screenshots} activeIndex={this.state.activeIndex} onClickHandler={this.goToIndex} />
            {slides}
            <CarouselControl direction="prev" directionText="Previous" onClickHandler={this.previous} />
            <CarouselControl direction="next" directionText="Next" onClickHandler={this.next} />
        </Carousel>
        const editScreenShots =
            <div>
                <ListGroup>
                    {this.state.screenshots.map((shot, index) =>
                        <ListGroupItem key={index} > {shot.name} </ListGroupItem>
                    )}
                </ListGroup><br />
                <CustomInput id="screenshot" type="file" onChange={this.handleFileUpload} ></CustomInput>
            </div>

        return (
            <div className="animated fadeIn">
                <h2>User Instructions</h2>
                <Card >
                    <CardHeader><h5 style={{ float: "left" }}>{this.state.workflow}</h5>
                        <div style={{ float: "right" }}>
                            {!this.state.editable ? Edit : Apply}
                        </div>
                    </CardHeader>

                    <CardBody>
                        {/* <div className=""> */}
                        <div className="">{!this.state.editable ? summary : summaryEditable}</div>
                        <br />
                        <h3>Applicant</h3>
                        <div>Applicant is referring to the person who created the request in the system</div>
                        <br />
                        <ul>{!this.state.editable ? applicantInstructions : applicantInstructionsEditable}</ul>
                        <br />
                        <h3>Approvers</h3>
                        <div>Applicant is referring to the person who created the request in the system</div>
                        <br />
                        <ul>{!this.state.editable ? approverInstructions : approverInstructionsEditable}</ul>
                        <br />
                        <h3>Screenshots</h3>
                        <div>{!this.state.editable ? Screenshots : editScreenShots}</div>
                        <br />
                    </CardBody>
                </Card>
            </div>
        )
    }

}
export default Instruction;