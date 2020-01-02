import React, { Component } from 'react';
import {
    Card, CardHeader, CardBody, CardFooter, Button,
    Row, Col, FormGroup, Label, CustomInput, InputGroup
} from 'reactstrap'
import theme from './theme.css'

class LicenseAdmin extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    // uploadCSV(event) {
    //     console.log(event.target)
    //     let files = event.target.files[0]
    //     if (event.target.files[0]) {
    //         if (window.FileReader) {
    //             // FileReader are supported.
    //             this.getAsText(files);
    //         }

    //     }
    //     else {
    //         console.log("no file selected")
    //     }
    // }

    // getAsText(fileToRead) {
    //     var reader = new FileReader();
    //     // Read file into memory as UTF-8      
    //     reader.readAsText(fileToRead);
    //     // Handle errors load
    //     reader.onload = this.fileReadingFinished;
    //     reader.onerror = this.errorHandler;
    // }

    // fileReadingFinished = (event) => {
    //     var csv = event.target.result;
    //     var result = Papa.parse(csv, {header: true, skipEmptyLines: true,})
    //     console.log(result.data)
    //     this.setState({newBranch: result.data, updateBranch: true})
    // }

    // errorHandler(event) {
    //     if (event.target.error.name === "NotReadableError") {
    //         alert("Cannot read file!");
    //     }
    // }F

    render() {
        return (
            <div>
                <h4>License Admin</h4>
                <Card>
                    <CardHeader>Administration</CardHeader>
                    <CardBody>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Label>Update License Admins</Label>
                                    <InputGroup>
                                        <CustomInput id="uploadCSV" type="file" bsSize="lg" onChange={this.uploadCSV} color="primary" />
                                    </InputGroup>
                                </FormGroup>
                            </Col>
                        </Row>
                    </CardBody>
                    <CardFooter>
                        <Button color="success" >Save</Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

}
export default LicenseAdmin