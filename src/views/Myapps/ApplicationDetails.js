import React from 'react';
import {
    Card, CardBody, CardHeader, Table, Col, Row,
    Input,
    Button,
    FormGroup,
    Label,
    Progress,
    Spinner, UncontrolledTooltip,
    Modal, ModalBody, ModalFooter, ModalHeader
} from 'reactstrap';
import ReactTable from "react-table";
import ApprovalHistory from './ApproveHistory';
import Axios from 'axios';
import config from '../../config';
import Swal from 'sweetalert2';

class ApplicationDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            applications: [],
            appHistory: [],
            loading: false,
            updated: false,
            showModal: false
        }
    }
    // componentDidMount() {
    //     this.setState({ loading: true })
    //     Axios.get(`https://5b7aa3bb6b74010014ddb4f6.mockapi.io/application/2e4fb172-1eca-47d2-92fb-51fa4068a4b0/approval`)
    //         .then(res => {
    //             this.setState({ appHistory: res.data, loading: false })
    //         })
    // }

    setArray = () => {
        let result = this.props.applications.departmentHeads
        return result.join("; ")
    }

    toggleView = () => {
        this.setState({ showModal: !this.state.showModal })
    }

    postAction = (action) => {
        let data = {
            userId: localStorage.getItem('userId')}

        Axios.post(`${config.url}/tasks/${this.props.id}/${action}`, data, { headers: { 'Content-Type': 'application/json' } })
        .then(res => {
            Swal.fire({
            title: res.data.message,
            html: res.data.message,
            type: "success"
            })
        .then((result) => {
            if (result.value) {
                this.setState({ updated: true })
                }
            })
        })
        .catch(error => {
            Swal.fire({
            title: "ERROR",
            html: error.response.data.message,
            type: "error"
            })
            console.log(error.response.data)
        })
    }

    handleButton(action){
        switch(action.action){
            case 'recall':
                return <Button className="mr-1" color="danger" onClick={() => { this.postAction(action.action) }}><i className="icon-loop" /> Recall </Button>
                ; 
            case 'copy' :
                return <Button className="mr-1" color="light-blue" onClick={() => { this.postAction(action.action) }}><i className="fa fa-copy" /> Copy as Draft </Button> 
                ;
            case 'remind' :
                return <Button className="mr-1" color="warning" onClick={() => { this.postAction(action.action) }}><i className="icon-bell" />Remind Task Owner </Button>
                ;
        }
    }

    render() {
        return (
            <Card className="animated fadeIn">
                <CardHeader>
                    <Row className="align-items-left">
                        <Button className="ml-1 mr-1" color="primary" onClick={() => this.props.goBack(this.state.updated)}><i className="fa fa-angle-left" /> Back </Button>
                        {this.props.applications.actions.map(((action, index) =>
                        <span key={index}>
                            {this.handleButton(action)}
                        </span>
                        ))}
                        {/* <Button className="mr-1" color="danger" onClick={() => { this.updated('Recalled') }}><i className="icon-loop" /> Recall </Button>
                        <Button className="mr-1" color="warning" onClick={() => { this.updated('Reminded to Owner') }}><i className="icon-bell" />Remind Task Owner </Button>
                        <Button className="mr-1" color="success" onClick={()=>{this.updated('Extended')}}><i className="icon-plus" /> Extend </Button> */}
                    </Row></CardHeader>
                <CardBody>
                    <Row className="mb-3">
                        <Col xs="12" md lg><span className="display-5"> {this.props.applications.requestNum}</span></Col>
                        <Col sm="12 py-2" md lg>
                            <Progress multi>
                                <Progress bar color="green" value="50">{this.props.applications.currentStatusName}</Progress>
                                <Progress bar animated striped color="warning" value="50">{this.props.applications.nextStatusName}</Progress>
                            </Progress>
                        </Col>
                    </Row>
                    <Row className="mb-4">
                        <Col xs="12" sm="12" md lg className="text-md-left text-center">
                            <Row>
                                <Col xs={12} sm={12} md={4} lg={2}>
                                    <img src={'../../assets/img/avatars/5.jpg'} className="img-avaa img-responsive center-block" alt="admin@bootstrapmaster.com" />
                                </Col>
                                <Col md><h5> {this.props.applications.employeeName} </h5>
                                    <Row>
                                        <Col md><h6> DFS/CN, MBAFC </h6></Col>
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
                                <Col md><h5><i className="fa fa-tablet mr-2" /> +86 10 {this.props.applications.telephoneNum} </h5></Col>
                            </Row>
                            <Row>
                                <Col md><h5><i className="fa fa-envelope mr-2" /> {this.props.applications.email}</h5></Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormGroup row>
                                <Col md lg>
                                    <Label htmlFor="text-input">Employee Number</Label>
                                </Col>
                                <Col md="12" lg="8">
                                    <Input disabled type="text" defaultValue={this.props.applications.telephoneNum} id="text-input" name="text-input" placeholder="/" />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Col md lg>
                                    <Label htmlFor="text-input">Dept</Label>
                                </Col>
                                <Col md="12" lg="8">
                                    <Input disabled type="text" defaultValue={this.props.applications.departmentName} id="text-input" name="text-input" placeholder="/" />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Col md lg>
                                    <Label htmlFor="text-input">Application Type</Label>
                                </Col>
                                <Col md="12" lg="8">
                                    <Input disabled type="text" defaultValue={this.props.applications.applicationTypeName} id="text-input" name="text-input" placeholder="/" />
                                </Col>
                            </FormGroup>
                            {this.props.applications.branchName !== ""
                                ? <FormGroup row>
                                    <Col md lg>
                                        <Label htmlFor="text-input">Branch Company Chop</Label>
                                    </Col>
                                    <Col md="12" lg="8">
                                        <Input disabled type="text" id="text-input" defaultValue={this.props.applications.branchName} name="text-input" placeholder="/" />
                                    </Col>
                                </FormGroup>
                                : ""
                            }

                            {this.props.type === "STU" || this.props.type === "CNIPS"
                                ?
                                <FormGroup row>
                                    <Col md lg>
                                        <Label htmlFor="text-input">Connecting Chop</Label>
                                    </Col>
                                    <Col md="12" lg="8">
                                        <Input disabled type="text" defaultValue={this.props.applications.connectChop === "Y" ? "Yes" : "No"} id="text-input" name="text-input" placeholder="/" />
                                    </Col>
                                </FormGroup>
                                : null
                            }
                            <FormGroup row>
                                <Col md lg>
                                    <Label htmlFor="text-input">Pick Up By</Label>
                                </Col>
                                <Col md="12" lg="8">
                                    <Input disabled type="text" id="text-input" defaultValue={this.props.applications.pickUpBy} name="text-input" placeholder="/" />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Col md lg>
                                    <Label htmlFor="text-input">Purpose of Use</Label>
                                </Col>
                                <Col md="12" lg="8">
                                    <Input disabled type="text" defaultValue={this.props.applications.purposeOfUse} id="text-input" name="text-input" placeholder="/" />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Col md lg>
                                    <Label htmlFor="text-input">Confirm</Label>
                                </Col>
                                <Col md="12" lg="8">
                                    <Input disabled type="text" id="text-input" defaultValue={this.props.applications.isConfirm === "Y" ? "Yes" : "No"} name="text-input" placeholder="/" />
                                </Col>
                            </FormGroup>
                            {this.props.type === "STU" || this.props.type === "CNIPS"
                                ? <FormGroup row>
                                    <Col md lg>
                                        <Label htmlFor="text-input">Number of Pages to Be Chopped </Label>
                                    </Col>
                                    <Col md="12" lg="8">
                                        <Input disabled type="text" defaultValue={this.props.applications.numOfPages} id="text-input" name="text-input" placeholder="/" />
                                    </Col>
                                </FormGroup>
                                : null
                            }
                            {this.props.type !== "STU" && this.props.type !== "CNIPS"
                                ? <div>
                                    {this.props.applications.isUseInOffice === "N"
                                        ? <FormGroup row>
                                            <Col md lg>
                                                <Label htmlFor="text-input">Address to</Label>
                                            </Col>
                                            <Col md="12" lg="8">
                                                <Input disabled type="text" defaultValue={this.props.applications.addressTo} id="text-input" name="text-input" placeholder="/" />
                                            </Col>
                                        </FormGroup>

                                        : ""}
                                    {/* {this.props.applications.isUseInOffice === "N"
                                ?  */}
                                    <FormGroup row>
                                        <Col md lg>
                                            <Label htmlFor="text-input">Tel</Label>
                                        </Col>
                                        <Col md="12" lg="8">
                                            <Input disabled type="text" defaultValue={this.props.applications.telephoneNum} id="text-input" name="text-input" placeholder="/" />
                                        </Col>
                                    </FormGroup>

                                    {/* : ""} */}
                                    <FormGroup row>
                                        <Col md lg>
                                            <Label htmlFor="text-input">Remark (e.g. tel.)</Label>
                                        </Col>
                                        <Col md="12" lg="8">
                                            <Input disabled type="text" defaultValue={this.props.applications.remark} id="text-input" name="text-input" placeholder="/" />
                                        </Col>
                                    </FormGroup>
                                </div>
                                : null}

                        </Col>
                        <Col>
                            {this.props.type === "STU" || this.props.type === "CNIPS"
                                ? <div>
                                    {this.props.applications.isUseInOffice === "N"
                                        ? <FormGroup row>
                                            <Col md lg>
                                                <Label htmlFor="text-input">Address to</Label>
                                            </Col>
                                            <Col id="addressTo" md="12" lg="8">
                                                <Input disabled type="text" defaultValue={this.props.applications.addressTo} id="text-input" name="text-input" placeholder="/" />
                                                <UncontrolledTooltip placement="right" target="addressTo">{this.props.applications.addressTo}</UncontrolledTooltip>
                                            </Col>
                                        </FormGroup>

                                        : ""}
                                    {/* {this.props.applications.isUseInOffice === "N"
                                ?  */}
                                    <FormGroup row>
                                        <Col md lg>
                                            <Label htmlFor="text-input">Tel</Label>
                                        </Col>
                                        <Col md="12" lg="8">
                                            <Input disabled type="text" defaultValue={this.props.applications.telephoneNum} id="text-input" name="text-input" placeholder="/" />
                                        </Col>
                                    </FormGroup>

                                    {/* : ""} */}
                                    <FormGroup row>
                                        <Col md lg>
                                            <Label htmlFor="text-input">Remark (e.g. tel.)</Label>
                                        </Col>
                                        <Col md="12" lg="8">
                                            <Input disabled type="text" defaultValue={this.props.applications.remark} id="text-input" name="text-input" placeholder="/" />
                                        </Col>
                                    </FormGroup>
                                </div>
                                : null}
                            {this.props.applications.isUseInOffice === "Y"
                                ? <FormGroup row>
                                    <Col md lg>
                                        <Label htmlFor="text-input">Tel</Label>
                                    </Col>
                                    <Col md="12" lg="8">
                                        <Input disabled type="text" defaultValue={this.props.applications.telephoneNum} id="text-input" name="text-input" placeholder="/" />
                                    </Col>
                                </FormGroup>

                                : ""}

                            <FormGroup row>
                                <Col md lg>
                                    <Label htmlFor="text-input">Chop Type</Label>
                                </Col>
                                <Col md="12" lg="8">
                                    <Input disabled type="text" id="text-input" defaultValue={this.props.applications.chopTypeId} name="text-input" placeholder="/" />
                                </Col>
                            </FormGroup>
                            {this.props.type === "LTU" || this.props.type === "LTI"
                                ?
                                <FormGroup row>
                                    <Col md lg>
                                        <Label htmlFor="text-input">Effective Period</Label>
                                    </Col>
                                    <Col md="12" lg="8">
                                        <Input disabled type="text" defaultValue={this.props.applications.effectivePeriod} id="text-input" name="text-input" placeholder="/" />
                                    </Col>
                                </FormGroup>
                                : null}
                            <FormGroup row>
                                <Col md lg>
                                    <Label htmlFor="text-input">Use in Office or not</Label>
                                </Col>
                                <Col md="12" lg="8">
                                    <Input disabled type="text" id="text-input" defaultValue={this.props.applications.isUseInOffice === "Y" ? "Yes" : "No"} name="text-input" placeholder="/" />
                                </Col>
                            </FormGroup>
                            {this.props.applications.isUseInOffice === "N"
                                ? <FormGroup row>
                                    <Col md lg>
                                        <Label htmlFor="text-input">Return Date</Label>
                                    </Col>
                                    <Col md="12" lg="8">
                                        <Input disabled type="text" id="text-input" defaultValue={this.props.applications.returnDate} name="text-input" placeholder="/" />
                                    </Col>
                                </FormGroup>

                                : ""}
                            {this.props.applications.isUseInOffice === "N"
                                ? <FormGroup row>
                                    <Col md lg>
                                        <Label htmlFor="text-input">Responsible Person</Label>
                                    </Col>
                                    <Col md="12" lg="8">
                                        <Input disabled type="text" id="text-input" defaultValue={this.props.applications.responsiblePersonNameName} name="text-input" placeholder="/" />
                                    </Col>
                                </FormGroup>

                                : ""}

                            {this.props.applications.isUseInOffice === "Y"
                                ? <FormGroup row>
                                    <Col md lg>
                                        <Label htmlFor="text-input">Address to</Label>
                                    </Col>
                                    <Col id="addressTo" md="12" lg="8">
                                        <Input disabled type="text" defaultValue={this.props.applications.addressTo} id="text-input" name="text-input" placeholder="/" />
                                        <UncontrolledTooltip placement="right" target="addressTo">{this.props.applications.addressTo}</UncontrolledTooltip>
                                    </Col>
                                </FormGroup>

                                : ""}

                            {this.props.type === "LTU" || this.props.type === "LTI"
                                ? <FormGroup row>
                                    <Col md="4">
                                        <Label htmlFor="text-input">Entitled Team</Label>
                                    </Col>
                                    <Col xs="12" md="8">
                                        <Input disabled type="text" value={this.props.applications.teamName} id="text-input" name="text-input" placeholder="/" />
                                    </Col>
                                </FormGroup>
                                : null
                            }



                            {this.props.type === "STU" || this.props.type === "LTI"
                                ? <FormGroup row>
                                    <Col md lg>
                                        <Label htmlFor="text-input">Department Heads</Label>

                                    </Col>
                                    <Col id="deptHead" md="12" lg="8">
                                        <Input disabled type="text" defaultValue={this.setArray()} id="text-input" name="text-input" placeholder="/" />
                                        <UncontrolledTooltip placement="right" target="deptHead">{this.setArray()}</UncontrolledTooltip>
                                    </Col>
                                </FormGroup>
                                : null
                            }
                            {this.props.type === "LTI" || this.props.type === "LTU"
                                ? <FormGroup row>
                                    <Col md lg>
                                        <Label htmlFor="text-input">Document Check By</Label>
                                    </Col>
                                    <Col md="12" lg="8">
                                        <Input disabled type="text" defaultValue={this.props.applications.documentCheckByName} id="text-input" name="text-input" placeholder="/" />
                                    </Col>
                                </FormGroup>
                                : null
                            }
                            {this.props.type === "CNIPS"

                                ? <div><FormGroup row>
                                    <Col md="4">
                                        <Label htmlFor="text-input">Contract Signed By (First Person) :  </Label>
                                    </Col>
                                    <Col xs="12" md="8">
                                        <Input disabled type="text" value={this.props.applications.contractSignedByFirstPersonName} id="text-input" name="text-input" placeholder="/" />
                                    </Col>
                                </FormGroup>
                                    <FormGroup row>
                                        <Col md="4">
                                            <Label htmlFor="text-input">Contract Signed By (Second Person) :  </Label>
                                        </Col>
                                        <Col xs="12" md="8">
                                            <Input disabled type="text" value={this.props.applications.contractSignedBySecondPersonName} id="text-input" name="text-input" placeholder="/" />
                                        </Col>
                                    </FormGroup>
                                </div>
                                : null
                            }



                        </Col>
                    </Row>
                    <Row>
                        <FormGroup>
                            <Col>
                                <Label htmlFor="text-input">Documents</Label>
                            </Col>
                            <Col>

                                <Button color="primary" onClick={this.toggleView}>View Documents</Button>

                                <Modal color="info" size="xl" toggle={this.toggleView} isOpen={this.state.showModal} >
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
                                                    style: { textAlign: "left", 'whiteSpace': 'unset' },
                                                },
                                                {
                                                    Header: "Document Name (Chinese)",
                                                    accessor: "documentNameChinese",
                                                    width: 250,
                                                    style: { textAlign: "left", 'whiteSpace': 'unset' },
                                                },
                                                {
                                                    Header: "Attached Document",
                                                    accessor: "documentName",
                                                    Cell: row => (
                                                        <a href={row.original.documentUrl} target='_blank' rel="noopener noreferrer">{row.original.documentFileName}</a>
                                                    ),
                                                    style: { textAlign: "left" },
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
                    {this.state.loading
                        ? <div><Spinner type="grow" /><Spinner type="grow" /><Spinner type="grow" /></div>
                        : this.props.applications.histories.map((history, index) => <ApprovalHistory histories={history} key={index} />)}
                </CardBody>
            </Card>
        )
    }
}

export default ApplicationDetail;