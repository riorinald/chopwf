import React, { Component } from 'react';
import {
    Card, CardBody, CardHeader, Table, Col, Row,
    Input,
    Button,
    FormGroup,
    Label,
    Progress, Badge
} from 'reactstrap';


class MyPendingTasks extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        return (
            <div>
                <h4>MY PENDING TASKS</h4>
                <Row>
                    <Col sm={3}>
                        <Card>
                            <CardHeader>PENDING TASKS</CardHeader>
                            <CardBody>
                                <div style={{textAlign:"center"}} >Task Name</div>
                                <Table style={{ textAlign: "center" }} size="sm">
                                    <thead>
                                        <tr>
                                           
                                            {/* <th>Task Name</th> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><Input type="text" placeholder="Search Task Name"></Input></td>
                                        </tr>
                                        <tr>
                                            <td>Task 1</td>
                                        </tr>
                                        <tr>
                                            <td>Task 2</td>
                                        </tr>
                                        <tr>
                                            <td>Task 3</td>
                                        </tr>
                                        <tr>
                                            <td>Task 4</td>
                                        </tr>
                                        <tr>
                                            <td>Task 5</td>
                                        </tr>
                                        <tr>
                                            <td>Task 6</td>
                                        </tr>
                                        <tr>
                                            <td>Task 7</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md={9}>
                        {/* <Card>
                            <CardHeader>CHOP20190710114456219</CardHeader>
                            <CardBody>

                            </CardBody>
                        </Card> */}
                        <Card >
                            <CardHeader>CHOP20190710114456219</CardHeader>
                            <CardBody color="dark">
                                <Row noGutters={true}>
                                    <Col md="6"><span className="display-5">CHOP201907041648491019</span></Col>
                                    <Col md="6">
                                        <Progress multi>
                                            <Progress bar color="green" value="50">Department Head Reviewing</Progress>
                                            <Progress bar animated striped color="warning" value="50">Bring Original Document to EG for Chop</Progress>
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
                                            <Col md="5"><h5> Liu, ChenChen (685) </h5></Col>
                                            <Col md="5"><h5><i className="fa fa-tablet" />&nbsp; +86 10 12345678 </h5></Col>
                                        </Row>
                                        <Row >
                                            <Col md="4"><h6> DFS/CN, MBAFC </h6></Col>
                                        </Row>
                                        <Row >
                                            <Col md="3">
                                                <h6><center className="boxs">Applicant</center></h6>
                                            </Col>
                                            <Col md="2"></Col>
                                            <Col md="4"><h5><i className="fa fa-envelope" />&nbsp; chenchen@daimler.com</h5></Col>
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
                                                <Input type="text" id="text-input" name="text-input" placeholder="Text" />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="4">
                                                <Label htmlFor="text-input">Dept</Label>
                                            </Col>
                                            <Col xs="12" md="8">
                                                <Input type="text" id="text-input" name="text-input" placeholder="Text" />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="4">
                                                <Label htmlFor="text-input">Chop Type</Label>
                                            </Col>
                                            <Col xs="12" md="8">
                                                <Input type="text" id="text-input" name="text-input" placeholder="Text" />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="4">
                                                <Label htmlFor="text-input">Document Name</Label>
                                            </Col>
                                            <Col xs="12" md="8">
                                                <Input type="text" id="text-input" name="text-input" placeholder="Text" />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="4">
                                                <Label htmlFor="text-input">Use in Office or not</Label>
                                            </Col>
                                            <Col xs="12" md="8">
                                                <Input type="text" id="text-input" name="text-input" placeholder="Text" />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="4">
                                                <Label htmlFor="text-input">Pick Up By</Label>
                                            </Col>
                                            <Col xs="12" md="8">
                                                <Input type="text" id="text-input" name="text-input" placeholder="Text" />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="4">
                                                <Label htmlFor="text-input">Confirm</Label>
                                            </Col>
                                            <Col xs="12" md="8">
                                                <Input type="text" id="text-input" name="text-input" placeholder="Text" />
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                    <Col>
                                        <FormGroup row>
                                            <Col md="4">
                                                <Label htmlFor="text-input">Tel</Label>
                                            </Col>
                                            <Col xs="12" md="8">
                                                <Input type="text" id="text-input" name="text-input" placeholder="Text" />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="4">
                                                <Label htmlFor="text-input">Application Type</Label>
                                            </Col>
                                            <Col xs="12" md="8">
                                                <Input type="text" id="text-input" name="text-input" placeholder="Text" />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="4">
                                                <Label htmlFor="text-input">Purpose of Use</Label>
                                            </Col>
                                            <Col xs="12" md="8">
                                                <Input type="text" id="text-input" name="text-input" placeholder="Text" />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="4">
                                                <Label htmlFor="text-input">Number of Pages to Be Chopped </Label>
                                            </Col>
                                            <Col xs="12" md="8">
                                                <Input type="text" id="text-input" name="text-input" placeholder="Text" />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="4">
                                                <Label htmlFor="text-input">Address to</Label>
                                            </Col>
                                            <Col xs="12" md="8">
                                                <Input type="text" id="text-input" name="text-input" placeholder="Text" />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="4">
                                                <Label htmlFor="text-input">Remark (e.g. tel.)</Label>
                                            </Col>
                                            <Col xs="12" md="8">
                                                <Input type="text" id="text-input" name="text-input" placeholder="Text" />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="4">
                                                <Label htmlFor="text-input">Department Heads</Label>
                                            </Col>
                                            <Col xs="12" md="8">
                                                <Input type="text" id="text-input" name="text-input" placeholder="Text" />
                                            </Col>
                                        </FormGroup>

                                    </Col>
                                </Row>
                                <Row>
                                    <Col> <h4>Comments</h4></Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Input type="textarea"></Input>
                                    </Col>
                                </Row>
                                <br />
                                <Row>
                                    <Col  >
                                        <Button color="success">Approve</Button>&nbsp;
                                    <Button color="danger">Send Back</Button>&nbsp;
                                    <Button color="danger">Reject</Button>&nbsp;
                                    </Col>

                                </Row>
                                <Row><Col>
                                    &nbsp;
         </Col></Row>
                                <Row>
                                    <Col> <h4>Approval Histories</h4></Col>
                                </Row>
                                <Row className="bottom-border">&nbsp;</Row>
                                <Row>
                                    <Col md="1">
                                        <img src={'../../assets/img/avatars/5.jpg'} className="img-avatar" alt="admin@bootstrapmaster.com" />
                                    </Col>
                                    <Col md="8">
                                        <h5>lastname, firstname (000)<span> <Badge color="success">Status</Badge></span></h5>
                                        <small>dd/mm/yyyy 00:00 AM</small>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>


            </div>
        )
    }
}
export default MyPendingTasks;
