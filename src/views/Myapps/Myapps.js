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
import ApplicationDetail from './ApplicationDetail';
import { Redirect } from 'react-router-dom';
import { resetMounted } from '../MyPendingTasks/MyPendingTasks'


class Myapps extends Component {
  constructor(props) {
    super(props)
    this.state = {

      selectionChanged: false,
      rowEdit: null,
      value: "",
      editableRows: {},
      selectedRowIndex: [],

      loading: false,
      page: 1,
      limit: 10,

      collapse: true,

      applications: [],
      selectedApplication: [],
      applicationDetail: []

    }
    this.getApplications = this.getApplications.bind(this);
    this.goBack = this.goBack.bind(this);
    this.recall = this.recall.bind(this);
  }
  componentDidMount() {
    this.getApplications();
    resetMounted.setMounted();

  }

  async getApplications() {
    this.setState({ loading: !this.state.loading })
    await Axios.get(`https://5b7aa3bb6b74010014ddb4f6.mockapi.io/application`).then(res => {
      // await Axios.get(`http://192.168.1.47/echopx/api/v1/tasks?userid=rio@otds.admin`).then(res => {
      this.setState({ applications: res.data, loading: !this.state.loading })
    })
    // console.log(this.state.applications)
    // console.log(Object.keys(this.state.applications[0]))
  }

  async getAppDetails(id) {
    this.setState({ loading: !this.state.loading })
    // let id = this.state.selectedApplication.taskId
    await Axios.get(`https://5b7aa3bb6b74010014ddb4f6.mockapi.io/application/${id}`)
      .then(res => {
        this.setState({
          applicationDetail: res.data, collapse: !this.state.collapse
        })
      })
  }

  goBack() {
    this.setState({ loading: !this.state.loading, collapse: !this.state.collapse })
  }
  recall(){
    console.log("recall")
 }

  getColumnWidth = (accessor, headerText) => {
    let { applications } = this.state
    let max = 0
    const maxWidth = 260;
    const magicSpacing = 10;

    for (var i = 0; i < applications.length; i++) {
        if (applications[i] !== undefined && applications[i][accessor] !== null) {
            if (JSON.stringify(applications[i][accessor] || 'null').length > max) {
                max = JSON.stringify(applications[i][accessor] || 'null').length;
            }
        }
    }

    return Math.min(maxWidth, Math.max(max, headerText.length) * magicSpacing);
}

  render() {
    const { applications, collapse, selectedApplication } = this.state
    // let columnData = Object.keys(applications[0])
    return (
      <div>
        <h4>My Applications</h4>
        {this.state.collapse ?
          <Card >
            <CardHeader>MY APPLICATIONS <Button className="float-right" onClick={this.search} >Search</Button>
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
                    width: this.getColumnWidth('requestNum', "Request Number"),
                    style: { textAlign: "center" }
                  },
                  {
                    Header: "Application Type",
                    accessor: "apptypeId",
                    Cell: this.renderEditable,
                    width: this.getColumnWidth('apptypeId', "Application Type"),
                    style: { textAlign: "center" }
                  },
                  {
                    Header: "Chop Type",
                    accessor: "chopTypeId",
                    Cell: this.renderEditable,
                    width: this.getColumnWidth('chopTypeId', "Chop Type"),
                    style: { textAlign: "center" }
                  },
                  // {
                  //   Header: "Document Description",
                  //   accessor: "documentDescription",
                  //   Cell: this.renderEditable,
                  // width: this.getColumnWidth('applicationTypeName', "Application Type"),
                  //   style: { textAlign: "center" },
                  //   filterable: false
                  // },
                  {
                    Header: "Document Check By",
                    accessor: "docCheckBy",
                    Cell: this.renderEditable,
                    width: this.getColumnWidth('docCheckBy', "Document Check By"),
                    style: { textAlign: "center", 'whiteSpace': 'unset' }
                  },
                  {
                    Header: "Department Heads",
                    accessor: "deptHead",
                    Cell: this.renderEditable,
                  width: this.getColumnWidth('applicationTypeName', "Application Type"),
                    style: { textAlign: "center" },
                    filterable: false
                  },
                  {
                    Header: "Team",
                    accessor: "teamId",
                    Cell: this.renderEditable,
                    width: this.getColumnWidth('teamId', "Team"),
                    style: { textAlign: "center" }
                  },
                  {
                    Header: "Pick Up By",
                    accessor: "pickUpBy",
                    Cell: this.renderEditable,
                    width: this.getColumnWidth('pickUpBy', "Pick Up By"),
                    style: { textAlign: "center" }
                  },
                  {
                    Header: "Created By",
                    accessor: "createdBy",
                    Cell: this.renderEditable,
                    width: this.getColumnWidth('createdBy', "Application Type"),
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
                        this.getAppDetails(rowInfo.original.taskId)
                        this.setState({ selectedApplication: rowInfo.original })

                        // this.setState({ collapse: !this.state.collapse })
                        // console.log(this.state.rowEdit);
                        // this.props.history.push(`/${selectedApplication.taskId}`, {id: selectedApplication.id})
                      },
                      style: {
                        background:
                          rowInfo.index === this.state.rowEdit ? "#00afec" : "white",
                        color:
                          rowInfo.index === this.state.rowEdit ? "white" : "black"
                      },
                    };
                  } else {
                    return {};
                  }
                }}
              />
            </CardBody>
          </Card>
          :
          //  this.props.history.push({pathname:`myapps/${this.state.selectedApplication.requestNum}`, state :{data: this.state.applicationDetail, goBack:this.goBack}})
          <ApplicationDetail
            wait={1000}
            applications={this.state.applicationDetail}
            id={selectedApplication.taskId}
            goBack={this.goBack}
            recall={this.recall} />
        }
      </div>
    );
  }
}

export default Myapps;