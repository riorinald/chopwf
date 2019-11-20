import React from 'react';
import {
    Card, CardBody, CardHeader, Table, Col, Row,
    Input,
    Button,
    FormGroup,
    Label,
    Progress,
    Badge,
    Modal, ModalBody, ModalFooter, ModalHeader
} from 'reactstrap';
import ReactTable from "react-table";
import ApprovalHistory from './ApproveHistory';
import Axios from 'axios';
import config from '../../config';

class ApplicationDetail extends React.Component {
constructor(props){
super(props)
this.state ={
    applications: [],
    appHistory: []
    }
}
componentDidMount(){
    // Axios.get(`${config.url}/tasks/${this.props.id}?userid=${localStorage.getItem('userId')}`)
    //         .then(res => {
    //             this.setState({ applications : res.data})
    //         })
    // Axios.get(`https://5b7aa3bb6b74010014ddb4f6.mockapi.io/application/${this.props.location.state.taskId}`)
    //     .then(res => {
    //         this.setState({ applications : res.data})
    //     })
    Axios.get(`https://5b7aa3bb6b74010014ddb4f6.mockapi.io/application/${this.props.id}/approval`)
        .then(res => {
            this.setState({ appHistory : res.data})
        })
}
    render(){

        return(
            <Card className="animated fadeIn">
            <CardHeader>
                <Row className=" align-items-left">
                  <Button className="mr-1" color="primary" onClick={this.props.goBack}><i className="fa fa-angle-left" /> Back </Button>
                  <Button className="mr-1" color="danger" ><i className="icon-loop" /> Recall </Button>
                  <Button className="mr-1" color="warning"><i className="icon-bell" />Remind Task Owner </Button>
                  <Button className="mr-1" color="success"><i className="icon-plus" /> Extend </Button>
              </Row></CardHeader>
            <CardBody color="dark">
                <Row noGutters={true}>
                    <Col md="6"><span className="display-5"> {this.props.applications.requestNum}</span></Col>
                    <Col md="6">
                        <Progress multi>
                            <Progress bar color="green" value="50">{this.props.applications.statusId}</Progress>
                            <Progress bar animated striped color="warning" value="50">{this.props.applications.nextStatusName}</Progress>
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
                            <Col md="5"><h5> {this.props.applications.createdBy} </h5></Col>
                            <Col md="5"><h5><i className="fa fa-tablet" />&nbsp; +86 10 {this.props.applications.telephoneNo} </h5></Col>
                        </Row>
                        <Row >
                            <Col md="4"><h6> DFS/CN, MBAFC </h6></Col>
                        </Row>
                        <Row >
                            <Col md="3">
                                <h6><center className="boxs">Applicant</center></h6>
                            </Col>
                            <Col md="2"></Col>
                            <Col md="4"><h5><i className="fa fa-envelope" />&nbsp; {this.props.applications.employeeId}</h5></Col>
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
                                <Input disabled type="text" defaultValue={this.props.applications.employeeNum} id="text-input" name="text-input" placeholder="Text" />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col md="4">
                                <Label htmlFor="text-input">Dept</Label>
                            </Col>
                            <Col xs="12" md="8">
                                <Input disabled type="text" defaultValue={this.props.applications.departmentName} id="text-input" name="text-input" placeholder="Text" />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col md="4">
                                <Label htmlFor="text-input">Chop Type</Label>
                            </Col>
                            <Col xs="12" md="8">
                                <Input disabled type="text" id="text-input" defaultValue={this.props.applications.chopTypeId} name="text-input" placeholder="Text" />
                            </Col>
                        </FormGroup>
                        {this.props.applications.branchName !== ""
                            ? <FormGroup row>
                                <Col md="4">
                                    <Label htmlFor="text-input">Branch Company Chop</Label>
                                </Col>
                                <Col xs="12" md="8">
                                    <Input disabled type="text" id="text-input" defaultValue={this.props.applications.branchName} name="text-input" placeholder="Text" />
                                </Col>
                            </FormGroup>
                            : ""
                        }

                        <FormGroup row>
                            <Col md="4">
                                <Label htmlFor="text-input">Connecting Chop</Label>
                            </Col>
                            <Col xs="12" md="8">
                                <Input disabled type="text" defaultValue={this.props.applications.connectChop === "Y" ? "Yes" : "No"} id="text-input" name="text-input" placeholder="Text" />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col md="4">
                                <Label htmlFor="text-input">Pick Up By</Label>
                            </Col>
                            <Col xs="12" md="8">
                                <Input disabled type="text" id="text-input" defaultValue={this.props.applications.pickUpBy} name="text-input" placeholder="Text" />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col md="4">
                                <Label htmlFor="text-input">Confirm</Label>
                            </Col>
                            <Col xs="12" md="8">
                                <Input disabled type="text" id="text-input" defaultValue={this.props.applications.isConfirm === "Y" ? "Yes" : "No"} name="text-input" placeholder="Text" />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col md="4">
                                <Label htmlFor="text-input">Purpose of Use</Label>
                            </Col>
                            <Col xs="12" md="8">
                                <Input disabled type="text" defaultValue={this.props.applications.purposeOfUse} id="text-input" name="text-input" placeholder="Text" />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col md="4">
                                <Label htmlFor="text-input">Number of Pages to Be Chopped </Label>
                            </Col>
                            <Col xs="12" md="8">
                                <Input disabled type="text" defaultValue={this.props.applications.numOfPages} id="text-input" name="text-input" placeholder="Text" />
                            </Col>
                        </FormGroup>
                        {this.props.applications.isUseInOffice === "N"
                            ? <FormGroup row>
                                <Col md="4">
                                    <Label htmlFor="text-input">Address to</Label>
                                </Col>
                                <Col xs="12" md="8">
                                    <Input disabled type="text" defaultValue={this.props.applications.addressTo} id="text-input" name="text-input" placeholder="Text" />
                                </Col>
                            </FormGroup>

                            : ""}
                    </Col>
                    <Col>
                        <FormGroup row>
                            <Col md="4">
                                <Label htmlFor="text-input">Tel</Label>
                            </Col>
                            <Col xs="12" md="8">
                                <Input disabled type="text" defaultValue={this.props.applications.telephoneNum} id="text-input" name="text-input" placeholder="Text" />
                            </Col>
                        </FormGroup>

                        <FormGroup row>
                            <Col md="4">
                                <Label htmlFor="text-input">Application Type</Label>
                            </Col>
                            <Col xs="12" md="8">
                                <Input disabled type="text" defaultValue={this.props.applications.applicationTypeName} id="text-input" name="text-input" placeholder="Text" />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col md="4">
                                <Label htmlFor="text-input">Effective Period</Label>
                            </Col>
                            <Col xs="12" md="8">
                                <Input disabled type="text" defaultValue={this.props.applications.effectivePeriod} id="text-input" name="text-input" placeholder="Text" />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col md="4">
                                <Label htmlFor="text-input">Use in Office or not</Label>
                            </Col>
                            <Col xs="12" md="8">
                                <Input disabled type="text" id="text-input" defaultValue={this.props.applications.isUseInOffice === "Y" ? "Yes" : "No"} name="text-input" placeholder="Text" />
                            </Col>
                        </FormGroup>
                        {this.props.applications.isUseInOffice === "N"
                            ? <FormGroup row>
                                <Col md="4">
                                    <Label htmlFor="text-input">Return Date</Label>
                                </Col>
                                <Col xs="12" md="8">
                                    <Input disabled type="text" id="text-input" defaultValue={this.props.applications.returnDate} name="text-input" placeholder="Text" />
                                </Col>
                            </FormGroup>

                            : ""}
                        {this.props.applications.isUseInOffice === "N"
                            ? <FormGroup row>
                                <Col md="4">
                                    <Label htmlFor="text-input">Responsible Person</Label>
                                </Col>
                                <Col xs="12" md="8">
                                    <Input disabled type="text" id="text-input" defaultValue={this.props.applications.responsiblePersonNameName} name="text-input" placeholder="Text" />
                                </Col>
                            </FormGroup>

                            : ""}

                        {this.props.applications.isUseInOffice === "Y"
                            ? <FormGroup row>
                                <Col md="4">
                                    <Label htmlFor="text-input">Address to</Label>
                                </Col>
                                <Col xs="12" md="8">
                                    <Input disabled type="text" defaultValue={this.props.applications.addressTo} id="text-input" name="text-input" placeholder="Text" />
                                </Col>
                            </FormGroup>

                            : ""}


                        <FormGroup row>
                            <Col md="4">
                                <Label htmlFor="text-input">Remark (e.g. tel.)</Label>
                            </Col>
                            <Col xs="12" md="8">
                                <Input disabled type="text" defaultValue={this.props.applications.remark} id="text-input" name="text-input" placeholder="Text" />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col md="4">
                                <Label htmlFor="text-input">Document Check By</Label>
                            </Col>
                            <Col xs="12" md="8">
                                <Input disabled type="text" defaultValue={this.props.applications.documentCheckByName} id="text-input" name="text-input" placeholder="Text" />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col md="4">
                                <Label htmlFor="text-input">Entitled Team</Label>
                            </Col>
                            <Col xs="12" md="8">
                                <Input disabled type="text" defaultValue={this.props.applications.teamName} id="text-input" name="text-input" placeholder="Text" />
                            </Col>
                        </FormGroup>

                    </Col>
                </Row>
                <Row>
                    <FormGroup>
                        <Col>
                            <Label htmlFor="text-input">Documents</Label>
                        </Col>
                        <Col>

                            <Button color="primary" onClick={this.props.toggleView}>View Documents</Button>

                            <Modal color="info" size="xl" toggle={this.props.toggleView} isOpen={this.props.showModal} >
                                <ModalHeader className="center"> Documents </ModalHeader>
                                <ModalBody>
                                    <ReactTable
                                        data={this.props.applications.documentNames}
                                        sortable
                                        columns={[
                                            {
                                                Header: "#",
                                                Cell: row => (
                                                    <div>{row.index + 1}</div>
                                                ),
                                                width: 40,
                                                style: { textAlign: "center" }
                                            },
                                            {
                                                Header: "Document Name (English)",
                                                accessor: "documentNameEnglish",
                                                width: 250,
                                                style: { textAlign: "center" },
                                            },
                                            {
                                                Header: "Document Name (Chinese)",
                                                accessor: "documentNameChinese",
                                                width: 250,
                                                style: { textAlign: "center" },
                                            },
                                            {
                                                Header: "Attached Document",
                                                accessor: "documentName",
                                                Cell: row => (
                                                    <a href={row.original.documentUrl} target='_blank' rel="noopener noreferrer">{row.original.documentName}</a>
                                                ),
                                                style: { textAlign: "center" },
                                            },
                                        ]}
                                        defaultPageSize={5}
                                    />
                                </ModalBody>
                                <ModalFooter>
                                </ModalFooter>
                            </Modal>
                        </Col>
                    </FormGroup>
                </Row>
                <Row><Col><h4>Approval History</h4></Col></Row>
                {this.state.appHistory.map(id => <ApprovalHistory appHistory={id} key={id.id}/> )}
            </CardBody>
        </Card>
        )
    }
}

export default ApplicationDetail;