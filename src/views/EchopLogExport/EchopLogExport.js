import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Card, Form, FormGroup, Label, Input, Button, Col, Row, CardBody, CardHeader, ModalBody, Modal, ModalHeader, ModalFooter } from 'reactstrap';
import config from '../../config';
import Authorize from '../../functions/Authorize';

class EchopLogExport extends Component {
    constructor(props) {
        super(props);

        this.state = {
            startDate: new Date(),
            endDate: new Date()
        };
    };

    componentDidMount() {
        const userId = Authorize.getCookies().userId;
    }

    handleChangeStart = date => {
        this.setState({
            startDate: date,
        });
    }

    handleChangeEnd = date => {
        this.setState({
            endDate: date
        });
    }

    handleExport = () => {
        // console.log("Start Date: " + this.state.startDate);
        // console.log("End Date: " + this.state.endDate);        
        console.log("Base Url: " + process.env.REACT_APP_API_BASE_URL);

        let formattedStartDate = this.state.startDate.getFullYear() + "-" + (('0' + (this.state.startDate.getMonth() + 1)).slice(-2)) + "-" + ('0' + this.state.startDate.getDate()).slice(-2);

        let formattedEndDate = this.state.endDate.getFullYear() + "-" + (('0' + (this.state.endDate.getMonth() + 1)).slice(-2)) + "-" + ('0' + this.state.endDate.getDate()).slice(-2);

        // console.log("Formatted Start Date: " + formattedStartDate);
        // console.log("Formatted End Date: " + formattedEndDate);

        let url = `${config.url}/echoplogexports` + "?startdate=" + formattedStartDate + "&enddate=" + formattedEndDate;
        window.open(url, "_blank");
    }

    render() {
        return (
            <div>
                <Modal size="md" centered isOpen={true}>                    
                    <ModalHeader cssModule={{'modal-title': 'w-100 text-center'}}>eChop Log Export</ModalHeader>
                    <ModalBody>
                        <Form>
                            <ul>
                                <li>Please input valid start date and end date.</li>
                                <li>Click the Export button to get the exported excel file.</li>
                                <li>New tab will be open and browser will automatically download the excel file.</li>
                            </ul>
                            <FormGroup row>
                                <Label for="startDate" sm={4}>Start Date</Label>
                                <Col sm={8}>
                                    <DatePicker
                                        autoComplete="off"
                                        className="form-control"
                                        selected={this.state.startDate}
                                        onChange={this.handleChangeStart}
                                        dateFormat="yyyy-MM-dd"
                                        placeholderText="YYYY-MM-DD"
                                    />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="endDate" sm={4}>End Date</Label>
                                <Col sm={8}>
                                    <DatePicker
                                        autoComplete="off"
                                        className="form-control"
                                        selected={this.state.endDate}
                                        onChange={this.handleChangeEnd}
                                        dateFormat="yyyy-MM-dd"
                                        placeholderText="YYYY-MM-DD"
                                    />
                                </Col>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Input
                            className="btn btn-primary"
                            type="submit"
                            value="Export"
                            onClick={() => this.handleExport()}
                        >
                        </Input>
                    </ModalFooter>
                </Modal>             
            </div>
        );
    }
}

export default EchopLogExport;