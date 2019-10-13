import React, { Component } from 'react';
import carImg from "../../assets/img/carousel.png";
import editIcon from "../../assets/img/edit.png";
import deleteIcon from "../../assets/img/delete.png";
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
    ListGroupItem

} from 'reactstrap';
import { tsExpressionWithTypeArguments } from '@babel/types';

const test = (
    <h5> another example </h5>
);
class Instruction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            workflow: "MBAFC WORKFLOWS USER INSTRUCTIONS",
            summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse in dolor sapien./ Sed vitae massa eu ex finibus bibendum non id eros. Donec commodo facilisis luctus. Fusce mi sem, condimentum in diam et, ultrices malesuada lorem. Fusce vitae elit elit. Maecenas eu mi at tellus consequat scelerisque ac vitae mi. Nullam rutrum finibus sodales. Donec egestas aliquet dui, et laoreet lorem tempus eget. Duis cursus lacus quis venenatis venenatis. Proin luctus lacus ac tincidunt gravida. Praesent cursus at odio quis mattis. Nulla facilisi. Integer suscipit efficitur pulvinar. Nunc lacinia commodo neque at mollis. Aenean turpis arcu, pellentesque eget metus nec, ullamcorper congue felis.",
            applicantInstructions: ["Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                "Nulla nec sem accumsan lorem posuere euismod non vel nulla.",
                "Cras suscipit tortor quis vestibulum ullamcorper.",
                "Fusce nec mi et turpis molestie facilisis vel id odio.",
                "Nunc non mauris sit amet ipsum varius facilisis eu ut enim."],
            approverInstructions: ["Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                "Nulla nec sem accumsan lorem posuere euismod non vel nulla.",
                "Cras suscipit tortor quis vestibulum ullamcorper.",
                "Fusce nec mi et turpis molestie facilisis vel id odio.",
                "Nunc non mauris sit amet ipsum varius facilisis eu ut enim."],
            screenshots: [
                {
                    src: carImg,
                    altText: 'Slide 1',
                    caption: 'Slide 1'
                },
                {
                    src: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_15ba800aa20%20text%20%7B%20fill%3A%23444%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_15ba800aa20%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23666%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22247.3203125%22%20y%3D%22218.3%22%3ESecond%20slide%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E',
                    altText: 'Slide 2',
                    caption: 'Slide 2'
                },
                {
                    src: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_15ba800aa21%20text%20%7B%20fill%3A%23333%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_15ba800aa21%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23555%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22277%22%20y%3D%22218.3%22%3EThird%20slide%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E',
                    altText: 'Slide 3',
                    caption: 'Slide 3'
                }

            ],
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
    };

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener("resize", this.updateWindowDimensions.bind(this));
    }
    componentWillUnmount() {
        window.removeEventListener("resize", this.updateWindowDimensions.bind(this));
    }
    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
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


    render() {
        const applicantInstructions = this.state.applicantInstructions.map((instruction, index) =>
            <li key={index}>{instruction}</li>)
        const applicantInstructionsEditable = <div>{this.state.applicantInstructions.map((instruction, index) =>
            <li key={index}><Form style={{ display: "flex" }}><Input type="text" name="applicantInstructions" defaultValue={instruction}></Input><Button color="danger " onClick={() => this.deleteApplicantInstruction(index)}>Delete</Button></Form><br /></li>)}<Button onClick={this.addApplicantInstruction}>Add new instruction for applicants</Button></div>
        // <img onClick={() => this.deleteApplicantInstruction(index)} width="17px" height="17px" src={deleteIcon} />
        const approverInstructions = this.state.approverInstructions.map((instruction, index) =>
            <li key={index}>{instruction}</li>)
        const approverInstructionsEditable = <div>{this.state.approverInstructions.map((instruction, index) =>
            <li key={index}><Form style={{ display: "flex" }}><Input type="text" name="approverInstructions" defaultValue={instruction}></Input><Button color="danger " onClick={() => this.deleteApproverInstruction(index)}>Delete</Button></Form><br /></li>)}<Button onClick={this.addApproverInstruction}>Add new instruction for Approvers</Button></div>
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
            <Input style={{ height: "150px" }} type="textarea" name="summary" defaultValue={this.state.summary}></Input>
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
            <div><ListGroup>
                <ListGroupItem>Screenshot 1</ListGroupItem>
                <ListGroupItem>Screenshot 2</ListGroupItem>
                <ListGroupItem>Screenshot 3</ListGroupItem></ListGroup><br/>
                <Input type="file"></Input>
            </div>

        return (
            <div>
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