import React, { Component } from 'react';
import {
  Badge,
  Card,
  CardHeader,
  CardBody,
  Progress,
  Col,
  Button,
  Label,
  FormGroup,
  Input,
  Row,
  Collapse
} from 'reactstrap';
import ReactTable from "react-table";
import "react-table/react-table.css"
import Axios from 'axios';
import config from '../../config';

class ChopApplication extends Component {
  constructor(props) {
    super(props)
    this.state = {

      selectionChanged: false,
      rowEdit: null,
      value: "",
      editableRows: {},
      selectedRowIndex: [],
     
      loading:false,
      page:1,
      limit:10,

      collapse: false,

      applications: [],
      selectedApplication: []

    }
    this.getApplications = this.getApplications.bind(this);
    this.goBack = this.goBack.bind(this);
  }
  componentDidMount() {
    this.getApplications();

  }

  async getApplications() {
    this.setState({loading:!this.state.loading})
    // await Axios.get(`https://5b7aa3bb6b74010014ddb4f6.mockapi.io/application?page=${this.state.page}&limit=${this.state.limit}`).then(res => {    
    await Axios.get(`https://5b7aa3bb6b74010014ddb4f6.mockapi.io/application?page=`).then(res => {
      this.setState({ applications: res.data, loading: !this.state.loading })
    })
    // console.log(this.state.applications)
    // console.log(Object.keys(this.state.applications[0]))
  }

  goBack() {
    this.setState({collapse: false})
  }

  render() {
    const { applications, collapse, selectedApplication } = this.state
    // let columnData = Object.keys(applications[0])

    return (
      <div>
        <h3>My Applications</h3>
        <Collapse isOpen={!collapse}>
          <Card>
            <CardHeader>
              Applications
          </CardHeader>
            <CardBody>
              <ReactTable
                data={applications}
                filterable
                columns={[
                  {
                    Header: "Request Number",
                    accessor: "requestNum",
                    Cell: this.renderEditable,
                    style: { textAlign: "center" }
                  },
                  {
                    Header: "Application Type",
                    accessor: "apptypeId",
                    Cell: this.renderEditable,
                    style: { textAlign: "center" }
                  },
                  {
                    Header: "Chop Type",
                    accessor: "chopTypeId",
                    Cell: this.renderEditable,
                    style: { textAlign: "center" }
                  }, {
                    Header: "Company Name",
                    accessor: "companyId",
                    Cell: this.renderEditable,
                    style: { textAlign: "center" }
                  },
                  {
                    Header: "Document Description",
                    accessor: "documentDescription",
                    Cell: this.renderEditable,
                    style: { textAlign: "center" },
                    filterable: false
                  },
                  {
                    Header: "Document Check By",
                    accessor: "docCheckBy",
                    Cell: this.renderEditable,
                    style: { textAlign: "center" }
                  },
                  {
                    Header: "Department Heads",
                    accessor: "deptHead",
                    Cell: this.renderEditable,
                    style: { textAlign: "center" },
                    filterable: false
                  },
                  {
                    Header: "Status",
                    accessor: "status",
                    Cell: this.renderEditable,
                    style: { textAlign: "center" }
                  },
                  {
                    Header: "Created",
                    accessor: "createdBy",
                    Cell: this.renderEditable,
                    style: { textAlign: "center" }
                  },
                  {
                    Header: "Created By",
                    accessor: "createdBy",
                    Cell: this.renderEditable,
                    style: { textAlign: "center" }
                  },
                ]}
                defaultPageSize={this.state.limit}
                // pages={this.state.page}
                // manual
                // onPageChange={(e)=>{this.setState({page: e})}}
                // canNextpage={true}
                loading={this.state.loading}
                getTrProps={(state, rowInfo) => {
                  if (rowInfo && rowInfo.row) {
                    return {
                      onClick: e => {
                        // console.log("inside");
                        // console.log(this.state.rowEdit)

                        if (rowInfo.index !== this.state.rowEdit) {
                          this.setState({
                            rowEdit: rowInfo.index,
                            selectedRowIndex: rowInfo.original,
                            selectionChanged: this.state.selectionChanged
                              ? false
                              : true
                          });
                        } else {

                          this.setState({
                            rowEdit: null
                          });
                        }
                        // console.log(rowInfo.original);
                        this.setState({ selectedApplication: rowInfo.original, collapse: true })
                        // console.log(this.state.rowEdit);

                      },
                      style: {
                        background:
                          rowInfo.index === this.state.rowEdit ? "#00afec" : "white",
                        color:
                          rowInfo.index === this.state.rowEdit ? "white" : "black"
                      }
                    };
                  } else {
                    return {};
                  }
                }}
              />
            </CardBody>
          </Card>
        </Collapse>
        <Collapse isOpen={collapse}>

          <Card >
            <CardHeader >
              <Row className="align-items-left">
                <Col xs="auto">

                  <Button color="primary" onClick={this.goBack}><i className="fa fa-angle-left" /> Back </Button>
                </Col>
                <Col xs={{ size: 'auto' }}>
                  <Button color="danger"><i className="icon-loop" /> Reacall </Button>
                </Col>
                <Col xs="auto" >
                  <Button color="warning"><i className="icon-bell" />Rremind Task Owner </Button>
                </Col>

              </Row>
            </CardHeader>
            <CardBody color="dark">
              <Row noGutters={true}>
                <Col md="6"><span className="display-5">{selectedApplication.requestNo}</span></Col>
                <Col md="6">
                  <Progress multi>
                    <Progress bar animated striped color="warning" defaultValue="50">Department Head Reviewing</Progress>
                    <Progress bar color="secondary" defaultValue="50">Bring Original Document to EG for Chop</Progress>
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
                      <Input type="text" id="text-input" name="text-input"  placeholder="Text" />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="4">
                      <Label htmlFor="text-input">Dept</Label>
                    </Col>
                    <Col xs="12" md="8">
                      <Input type="text" id="text-input" defaultValue={selectedApplication.deptId} name="text-input" placeholder="Text" />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="4">
                      <Label htmlFor="text-input">Chop Type</Label>
                    </Col>
                    <Col xs="12" md="8">
                      <Input type="text" id="text-input" defaultValue={selectedApplication.chopTypeId} name="text-input" placeholder="Text" />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="4">
                      <Label htmlFor="text-input">Document Name</Label>
                    </Col>
                    <Col xs="12" md="8">
                      <Input type="text" id="text-input" defaultValue={selectedApplication.documentName} name="text-input" placeholder="Text" />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="4">
                      <Label htmlFor="text-input">Use in Office or not</Label>
                    </Col>
                    <Col xs="12" md="8">
                      <Input type="text" id="text-input" defaultValue={selectedApplication.useInOffice === "N" ? "No" : "Yes"} name="text-input" placeholder="Text" />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="4">
                      <Label htmlFor="text-input">Pick Up By</Label>
                    </Col>
                    <Col xs="12" md="8">
                      <Input type="text" id="text-input" defaultValue={selectedApplication.pickUpBy} name="text-input" placeholder="Text" />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="4">
                      <Label htmlFor="text-input">Department Heads</Label>
                    </Col>
                    <Col xs="12" md="8">
                      <Input type="text" id="text-input" defaultValue={selectedApplication.deptHead} name="text-input" placeholder="Text" />
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
                      <Input type="text" id="text-input" defaultValue={selectedApplication.appTypeId} name="text-input" placeholder="Text" />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="4">
                      <Label htmlFor="text-input">Purpose of Use</Label>
                    </Col>
                    <Col xs="12" md="8">
                      <Input type="text" id="text-input" defaultValue={selectedApplication.purposeOfUse} name="text-input" placeholder="Text" />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="4">
                      <Label htmlFor="text-input">Number of Pages to Be Chopped </Label>
                    </Col>
                    <Col xs="12" md="8">
                      <Input type="text" id="text-input" defaultValue={selectedApplication.noOfPages} name="text-input" placeholder="Text" />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="4">
                      <Label htmlFor="text-input">Address to</Label>
                    </Col>
                    <Col xs="12" md="8">
                      <Input type="text" id="text-input" defaultValue={selectedApplication.addressTo} name="text-input" placeholder="Text" />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="4">
                      <Label htmlFor="text-input">Remark (e.g. tel.)</Label>
                    </Col>
                    <Col xs="12" md="8">
                      <Input type="text" id="text-input" defaultValue={selectedApplication.remark} name="text-input" placeholder="Text" />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="4">
                      <Label htmlFor="text-input">confirm</Label>
                    </Col>
                    <Col xs="12" md="8">
                      <Input type="text" id="text-input" name="text-input" placeholder="Text" />
                    </Col>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col> <h4>Attachments</h4></Col>
              </Row>
              <Row>
                <Col><i className="cui-paperclip" /> Chop Use Workflow BRD.Docx</Col>
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

        </Collapse>

      </div>
    );
  }
}

export default ChopApplication;