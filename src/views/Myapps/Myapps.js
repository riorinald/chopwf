import React, { Component } from 'react';
import {
  Badge,
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
} from 'reactstrap';
import ReactTable from "react-table";
import "react-table/react-table.css"
import Axios from 'axios';
import config from '../../config';
// import ApplicationDetail from './ApplicationDetail';
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
      limit: 20,

      collapse: true,

      username: localStorage.getItem('userId'),

      applications: [],
      selectedApplication: [],
      applicationDetail: [],
      applicationTypeId: "",

      applicationTypes: [],
      chopTypes: [],
      filtered: [],

      searchOption: {
        requestNum: "",
        applicationTypeName: "",
        chopTypeName: "",
        departmentHeadName: "",
        teamName: "",
        documentCheckByName: "",
        statusName: "",
        createdDate: "",
        createdByName: ""
      },

      status: [
        "Recall",
        "Pending for Document check by (L4 or above) Approval ",
        "Pending for Department Head Approval",
        "Bring the Original Documents for Chop",
        "Pending for Chop Owner Approval",
        "Send Back to Requestor",
        "Rejected",
        "Pending for Chop Keeper Acknowledge Lend Out",
        "Pending Chop Keeper Acknowledge Return",
        "Completed",
        "Draft",
        "Pending Requestor Return/Extension",
        "Pending Department Head Approval for Extension",
        "Pending Chop Keeper Approval for extension",
        "Pending Chop Owner Approval for extension",
        "Chop request expired after 30 days",
        "Pending Requestor Return"
      ]

    }
    this.getApplications = this.getApplications.bind(this);
    this.goBack = this.goBack.bind(this);
  }

  componentDidMount() {
    this.getApplications();
    resetMounted.setMounted();

    this.getData("applicationTypes", `${config.url}/apptypes`);
    this.getData("chopTypes", `${config.url}/choptypes?companyid=${this.props.legalName}`);
  }

  async getApplications() {
    this.setState({ loading: true })
    // await Axios.get(`https://5b7aa3bb6b74010014ddb4f6.mockapi.io/application`).then(res => {
    await Axios.get(`${config.url}/tasks?category=requestor&userid=${this.state.username}&requestNum=${this.state.searchOption.requestNum}&applicationTypeName=${this.state.searchOption.applicationTypeName}&chopTypeName=${this.state.searchOption.chopTypeName}&departmentHeadName=${this.state.searchOption.departmentHeadName}&teamName=${this.state.searchOption.teamName}&documentCheckByName=${this.state.searchOption.documentCheckByName}&statusName=${this.state.searchOption.statusName}&createdDate=${this.state.searchOption.createdDate}&createdByName=${this.state.searchOption.createdByName}`)
      .then(res => {
        this.setState({ applications: res.data.tasks, loading: false })
      })
    // console.log(this.state.applications) 
    // console.log(Object.keys(this.state.applications[0]))
  }

  async getAppDetails(id) {
    this.setState({ loading: !this.state.loading })
    // let id = this.state.selectedApplication.taskId
    // await Axios.get(`https://5b7aa3bb6b74010014ddb4f6.mockapi.io/application/${id}`)
    await Axios.get(`${config.url}/tasks/${id}?userid=${this.state.username}`)
      .then(res => {
        let detail = res.data
        // detail.applicationTypeId = "CNIPS"
        this.setState({
          applicationDetail: detail, collapse: !this.state.collapse, applicationTypeId: detail.applicationTypeId
        })

      })
  }

  goToEditRequest(id) {
    this.props.history.push({
      pathname: 'myapps/editrequest',
      state: { id: id }
    })
  }

  goToDetails(id, url) {
    this.props.history.push({
      pathname: url,
      state: { taskId: id }
    })
  }

  search = () => {
    this.getApplications()
  }

  onKeyPressed = (e) => {
    if (e.key === "Enter") {
      this.getApplications()
    }
  }

  goBack(didUpdate) {
    if (didUpdate === true) {
      this.getApplications()
      this.setState({ collapse: !this.state.collapse })
    }
    else {
      this.setState({ loading: !this.state.loading, collapse: !this.state.collapse })
    }
  }

  handleSearch = name => event => {
    const options = this.state.searchOption
    options[name] = event.target.value
    this.setState(state => {
      const searchOption = options
      return {
        searchOption
      }
    },
      // console.log(this.state.searchOption)\
    )
    this.getApplications()
  }

  getDeptHeads(heads) {
    let dh = ""
    heads.map(head => {
      dh = dh + head + "; "
    })
    return dh
  }

  async getData(state, url) {
    try {
      const response = await Axios.get(url);
      this.setState({
        [state]: response.data
      })
    } catch (error) {
      console.error(error);
    }
  }

  convertDate(dateValue) {
    let regEx = dateValue.replace(/(\d{4})(\d{2})(\d{2})/g, '$1/$2/$3')
    return regEx
  }


  onFilteredChangeCustom = (value, accessor) => {
    this.setState(state => {
      const searchOption = state.searchOption
      searchOption[accessor] = value
      return {
        searchOption
      }
    })
    let filtered = this.state.filtered;
    let insertNewFilter = 1;
    if (filtered.length) {
      filtered.forEach((filter, i) => {
        if (filter["id"] === accessor) {
          if (value === "" || !value.length) filtered.splice(i, 1);
          else filter["value"] = value;

          insertNewFilter = 0;
        }
      });
    }

    if (insertNewFilter) {
      filtered.push({ id: accessor, value: value });
    }

    this.setState({ filtered: filtered });
  };

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
      <div className="animated fadeIn">
        <h4>My Applications</h4>
        {/* {this.state.collapse ? */}
        <Card>
          <CardHeader>MY APPLICATIONS <Button className="float-right" onClick={this.search} >Search</Button>
          </CardHeader>
          <CardBody onKeyDown={this.onKeyPressed}>
            <ReactTable
              data={applications}
              filterable
              onFilteredChange={(filtered, column, value) => {
                this.setState({ filtered: filtered })
                this.onFilteredChangeCustom(value, column.id || column.accessor);
              }}
              defaultFilterMethod={(filter, row, column) => {
                const id = filter.pivotId || filter.id;
                return row[id]
              }}
              defaultSorted={[{
                id: "createdDate",
                desc: true
              }]}
              columns={[
                {
                  Header: "Request Number",
                  accessor: "requestNum",
                  Cell: this.renderEditable,
                  style: { textAlign: "center" },
                  width: this.getColumnWidth('requestNum', "Request Number")
                },
                {
                  Header: "Application Type",
                  accessor: "applicationTypeName",
                  Cell: this.renderEditable,
                  width: this.getColumnWidth('applicationTypeName', "Application Type"),
                  filterMethod: (filter, row) => {
                    return row[filter.id] === filter.value;
                  },
                  Filter: ({ filter, onChange }) => {
                    return (
                      <Input type="select" value={this.state.searchOption.applicationTypeName} onChange={this.handleSearch('applicationTypeName')} >
                        <option value="">Please Select</option>
                        {this.state.applicationTypes.map(type =>
                          <option key={type.appTypeId} value={type.appTypeName} >{type.appTypeName}</option>
                        )}
                      </Input>

                    )
                  },
                  style: { textAlign: "center" }
                },
                {
                  Header: "Chop Type",
                  accessor: "chopTypeName",
                  Cell: this.renderEditable,
                  style: { textAlign: "center" },
                  width: this.getColumnWidth('chopTypeName', "Chop Type"),
                  filterMethod: (filter, row) => {
                    return row[filter.id] === filter.value;
                  },
                  Filter: ({ filter, onChange }) => {
                    return (
                      <Input type="select" value={this.state.searchOption.chopTypeName} onChange={this.handleSearch('chopTypeName')} >
                        <option value="">Please Select</option>
                        {this.state.chopTypes.map(type =>
                          <option key={type.chopTypeId} value={type.chopTypeName} >{type.chopTypeName}</option>
                        )}
                      </Input>

                    )
                  },
                },
                {

                  Header: "Document Name English",
                  accessor: "documentNameEnglish",
                  width: this.getColumnWidth('documentNameEnglish', "Document Name English"),
                  // Cell: this.renderEditable,
                  Cell: row => (
                    <div> {this.getDeptHeads(row.original.documentNameEnglish)} </div>
                  ),
                  style: { textAlign: "center", 'whiteSpace': 'unset' },
                  filterable: false
                },
                {

                  Header: "Document Name Chinese",
                  accessor: "documentNameChinese",
                  width: this.getColumnWidth('documentNameChinese', "Document Name Chinese"),
                  // Cell: this.renderEditable,
                  Cell: row => (
                    <div> {this.getDeptHeads(row.original.documentNameChinese)} </div>
                  ),
                  style: { textAlign: "center", 'whiteSpace': 'unset' },
                  filterable: false
                },
                {
                  Header: "Document Check By",
                  accessor: " ",
                  width: this.getColumnWidth('documentCheckByName', "Document Check By"),
                  Cell: row => (
                    <div> {this.getDeptHeads(row.original.documentCheckByName)} </div>
                  ),
                  style: { textAlign: "center" }
                },
                {
                  Header: "Department Head",
                  accessor: `departmentHeadName`,
                  width: this.getColumnWidth('departmentHeadName', "Department Head"),
                  // Cell: this.renderEditable,
                  Cell: row => (
                    <div> {this.getDeptHeads(row.original.departmentHeadName)} </div>
                  ),
                  style: { textAlign: "center" }
                },
                {
                  Header: "Entitled Team",
                  accessor: "teamName",
                  width: this.getColumnWidth('teamName', "Entitled Team"),
                  Cell: this.renderEditable,
                  style: { textAlign: "center" }
                },
                {
                  Header: "Status",
                  accessor: "statusName",
                  width: this.getColumnWidth('statusName', "Status"),
                  Cell: this.renderEditable,
                  style: { textAlign: "center" },
                  Filter: ({ filter, onChange }) => {
                    return (
                      <Input type="select" value={this.state.searchOption.statusName} onChange={this.handleSearch('statusName')} >
                        <option value="" >Please Select a status</option>
                        {this.state.status.map((stat, index) =>
                          <option key={index} value={stat} >{stat}</option>
                        )}
                      </Input>

                    )
                  },
                },
                {
                  Header: "Date of Creation",
                  accessor: "createdDate",
                  width: this.getColumnWidth('createdDate', "Date of Creation"),
                  // Cell: this.renderEditable,
                  Cell: row => (
                    <div> {this.convertDate(row.original.createdDate)} </div>
                  ),
                  style: { textAlign: "center" }
                },
                {
                  Header: "Created By",
                  accessor: "createdByName",
                  width: this.getColumnWidth('createdByName', "Created By"),
                  Cell: this.renderEditable,
                  style: { textAlign: "center" }
                },
                {
                  Header: "New Return Date",
                  accessor: "newReturnDate",
                  filterable: false,
                  width: this.getColumnWidth('newReturnDate', "New Return Date"),
                  // Cell: this.renderEditable,
                  Cell: row => (
                    <div> {this.convertDate(row.original.newReturnDate)} </div>
                  ),
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
                      let status = rowInfo.original.statusId
                      if (status === "DRAFTED" || status === "RECALLED" || status === "SENDBACKED") {
                        this.goToEditRequest(rowInfo.original.taskId)
                      }
                      else {
                        this.goToDetails(rowInfo.original.taskId, `/myapps/details/${rowInfo.original.applicationTypeId}`)
                      }


                      this.setState({ selectedApplication: rowInfo.original })


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
        {/* :
          //  this.props.history.push({pathname:`myapps/${this.state.selectedApplication.requestNum}`, state :{data: this.state.applicationDetail, goBack:this.goBack}})
          <ApplicationDetail
            wait={1000}
            applications={this.state.applicationDetail}
            type={this.state.applicationTypeId}
            id={selectedApplication.taskId}
            goBack={this.goBack}
            recall={this.recall} />
        } */}
      </div>
    );
  }
}

export default Myapps;