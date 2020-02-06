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
import { format } from 'date-fns';
// import ApplicationDetail from './ApplicationDetail';
import { Redirect } from 'react-router-dom';
// import { resetMounted } from '../MyPendingTasks/MyPendingTasks'
import theme from '../theme.css'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

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
      totalPages: 1,
      page: 1,
      limit: 10,


      username: localStorage.getItem('userId'),

      applications: [],
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
        createdByName: "",
        departmentName: ""
      },

      status: [],
      departments: []

    }
    this.getApplications = this.getApplications.bind(this);
    this.goBack = this.goBack.bind(this);
  }

  componentDidMount() {
    this.getApplications(1, this.state.limit);
    // resetMounted.setMounted();

    this.getData("applicationTypes", `${config.url}/apptypes`);
    this.getData("chopTypes", `${config.url}/choptypes?companyid=${this.props.legalName}`);
    this.getData("departments", `${config.url}/departments`);
    this.getStatusList();
  }

  async getStatusList() {
    const res = await Axios.get(`${config.url}/statuses?category=chop`, { headers: { Pragma: 'no-cache' } })
    this.setState({ status: res.data })
  }

  async getApplications(pageNumber, pageSize) {
    this.setState({ loading: true })
    // await Axios.get(`https://5b7aa3bb6b74010014ddb4f6.mockapi.io/application`).then(res => {
    await Axios.get(`${config.url}/tasks?category=requestor&userid=${this.state.username}&companyid=${this.props.legalName}&requestNum=${this.state.searchOption.requestNum}&applicationTypeId=${this.state.searchOption.applicationTypeName}&chopTypeId=${this.state.searchOption.chopTypeName}&departmentHeadName=${this.state.searchOption.departmentHeadName}&teamName=${this.state.searchOption.teamName}&documentCheckByName=${this.state.searchOption.documentCheckByName}&statusName=${this.state.searchOption.statusName}&createdDate=${this.state.searchOption.createdDate}&createdByName=${this.state.searchOption.createdByName}&departmentname=${this.state.searchOption.departmentName}&page=${pageNumber}&pagesize=${pageSize}`,
      { headers: { Pragma: 'no-cache' } })
      .then(res => {
        this.setState({ applications: res.data.tasks, totalPages: res.data.pageCount, loading: false })
        console.log(res.data)
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
    this.getApplications(1, this.state.limit)
  }

  onKeyPressed = (e) => {
    if (e.key === "Enter") {
      this.getApplications(this.state.page, this.state.limit)
    }
  }

  goBack(didUpdate) {
    if (didUpdate === true) {
      this.getApplications(this.state.page, this.state.limit)
    }
    else {
      this.setState({ loading: !this.state.loading })
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
      const response = await Axios.get(url, { headers: { Pragma: 'no-cache' } });
      this.setState({
        [state]: response.data
      })
    } catch (error) {
      console.error(error);
    }
  }

  convertDate(dateValue) {
    let regEx = dateValue.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')
    return regEx
  }

  dateChange = (name, view) => date => {


    let dates = ""
    if (date) {
      let tempDate = format(date, "yyyy-MM-dd").split('T')[0];
      dates = tempDate.replace(/-/g, "")
    }

    // console.log(this.state.page, this.state.limit)
    this.setState({ [view]: date });
    this.setState(prevState => ({
      searchOption: {
        ...prevState.searchOption,
        [name]: dates
      }
    }))
    // this.getPendingTasks(this.state.page, this.state.limit)
  };


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
    const { applications, totalPages } = this.state
    // let columnData = Object.keys(applications[0])
    return (
      <div className="animated fadeIn">
        <h4>My Applications</h4>
        <Card>
          <CardHeader>My Applications <Button className="float-right" onClick={this.search} >Search</Button>
          </CardHeader>
          <CardBody onKeyDown={this.onKeyPressed}>
            <ReactTable
              data={applications}
              filterable
              onFilteredChange={(filtered, column, value) => {
                this.setState({ filtered: filtered })
                this.onFilteredChangeCustom(value, column.id || column.accessor);
              }}
              getTheadFilterThProps={() => { return { style: { position: "inherit", overflow: "inherit" } } }}
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
                        <option value="">Please Select </option>
                        {this.state.applicationTypes.map(type =>
                          <option key={type.appTypeId} value={type.appTypeId} >{type.appTypeName}</option>
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
                  style: { textAlign: "center", whiteSpace: 'unset' },
                  width: this.getColumnWidth('chopTypeName', "Chop Type"),
                  filterMethod: (filter, row) => {
                    return row[filter.id] === filter.value;
                  },
                  Filter: ({ filter, onChange }) => {
                    return (
                      <Input type="select" value={this.state.searchOption.chopTypeName} onChange={this.handleSearch('chopTypeName')} >
                        <option value="">Please Select </option>
                        {this.state.chopTypes.map(type =>
                          <option key={type.chopTypeId} value={type.chopTypeId} >{type.chopTypeName}</option>
                        )}
                      </Input>

                    )
                  },
                },
                {

                  Header: "Document Name (EN)",
                  accessor: "documentNameEnglish",
                  width: this.getColumnWidth('documentNameEnglish', "Document Name (EN)"),
                  // Cell: this.renderEditable,
                  Cell: row => (
                    <div> <span title={this.getDeptHeads(row.original.documentNameEnglish)} >{this.getDeptHeads(row.original.documentNameEnglish)}</span> </div>
                  ),
                  style: { textAlign: "center" },
                  filterable: false
                },
                {

                  Header: "Document Name (CN)",
                  accessor: "documentNameChinese",
                  width: this.getColumnWidth('documentNameChinese', "Document Name (CN)"),
                  // Cell: this.renderEditable,
                  Cell: row => (
                    <div> <span title={this.getDeptHeads(row.original.documentNameChinese)}>{this.getDeptHeads(row.original.documentNameChinese)}</span> </div>
                  ),
                  style: { textAlign: "center" },
                  filterable: false
                },
                {

                  Header: "Department",
                  accessor: "departmentName",
                  width: this.getColumnWidth('departmentName', "Department"),
                  Cell: this.renderEditable,
                  style: { textAlign: "center" },
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
                  Header: "Document Check By",
                  accessor: "documentCheckByName",
                  width: this.getColumnWidth('documentCheckByName', "Document Check By"),
                  Cell: row => (
                    <div> {this.getDeptHeads(row.original.documentCheckByName)} </div>
                  ),
                  style: { textAlign: "center" }
                },
                {
                  Header: "Status",
                  accessor: "statusName",
                  width: this.getColumnWidth('statusName', "Status"),
                  Cell: row => (
                    <div><span title={row.original.statusName}>{row.original.statusName}</span></div>
                  ),
                  style: { textAlign: "center" },
                  Filter: ({ filter, onChange }) => {
                    return (
                      <Input type="select" value={this.state.searchOption.statusName} onChange={this.handleSearch('statusName')} >
                        <option value="" >Please Select </option>
                        {this.state.status.map((stat, index) =>
                          <option key={index} value={stat.statusName} >{stat.statusName}</option>
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
                  filterMethod: (filter, row) => {
                    return row[filter.id] === filter.value;
                  },
                  Filter: ({ filter, onChange }) => {
                    return (
                      <DatePicker placeholderText="YYYY/MM/DD" popperPlacement="auto-center" showPopperArrow={false} todayButton="Today"
                        className="form-control" dateFormat="yyyy/MM/dd"
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        selected={this.state.dateView1}
                        isClearable
                        getTheadFilterThProps
                        onChange={this.dateChange("createdDate", "dateView1")}
                      />
                    )
                  },
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
              manual
              onPageChange={(e) => { this.setState({ page: e + 1 }, () => this.getApplications(e + 1, this.state.limit)) }}
              onPageSizeChange={(pageSize, page) => {
                this.setState({ limit: pageSize, page: page + 1 });
                this.getApplications(page + 1, pageSize)
              }}
              loading={this.state.loading}
              pages={totalPages}
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
                        this.goToDetails(rowInfo.original.taskId, `/myapps/details`)
                      }

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
      </div>
    );
  }
}

export default Myapps;