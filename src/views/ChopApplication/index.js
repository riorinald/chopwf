import React, { Component } from 'react';
import {
  Badge,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Progress,
  Modal, ModalHeader, ModalBody, ModalFooter,
  Col,
  Button,
  Label,
  FormGroup,
  Input,
  Row
} from 'reactstrap';
import ReactTable from "react-table";
import "react-table/react-table.css"
// import ChopApplicationDetail from './ChopApplicationDetail';
import Axios from 'axios';
import config from '../../config';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { CSVLink, CSVDownload } from "react-csv";

class ChopApplication extends Component {
  constructor(props) {
    super(props)
    this.state = {

      selectionChanged: false,
      rowEdit: null,
      value: "",
      editableRows: {},
      selectedRowIndex: [],
      applicationTypes: [],
      chopTypes: [],

      loading: false,
      page: 0,
      limit: 10,
      totalPages: 3,

      modal: false,

      filtered: [],

      exportFromDateView: "",
      exportToDateView: "",
      exportDate: {
        exportFrom: "",
        exportTo: ""
      },
      validDate: true,

      applications: [],
      selectedId: null,

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
        departmentId: ""
      },
      departments: [],
      status: []

    }
    this.getApplications = this.getApplications.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.exportLogs = this.exportLogs.bind(this);
    this.onFilteredChangeCustom = this.onFilteredChangeCustom.bind(this)
    // this.dateChange = this.dateChange.bind(this);
  }
  componentDidMount() {
    this.getApplications(1, this.state.limit);
    this.getData("applicationTypes", `${config.url}/apptypes`);
    this.getData("chopTypes", `${config.url}/choptypes?companyid=${this.props.legalName}`);
    this.getData("departments", `${config.url}/departments`);

    this.getStatusList();

  }

  async getApplications(pageNumber, pageSize) {
    this.setState({ loading: !this.state.loading })
    await Axios.get(`${config.url}/tasks?category=all&userid=${localStorage.getItem('userId')}&companyid=${this.props.legalName}&requestNum=${this.state.searchOption.requestNum}&applicationTypeId=${this.state.searchOption.applicationTypeName}&chopTypeId=${this.state.searchOption.chopTypeName}&departmentHeadName=${this.state.searchOption.departmentHeadName}&teamName=${this.state.searchOption.teamName}&documentCheckByName=${this.state.searchOption.documentCheckByName}&statusName=${this.state.searchOption.statusName}&createdDate=${this.state.searchOption.createdDate}&createdByName=${this.state.searchOption.createdByName}&departmentId=${this.state.searchOption.departmentId}&page=${pageNumber}&pagesize=${pageSize}`,
      { headers: { Pragma: 'no-cache' } }).then(res => {
        this.setState({ applications: res.data.tasks, loading: !this.state.loading, totalPages: res.data.pageCount === 0 ? 1 : res.data.pageCount })
        console.log(res.data)
      })
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

  async getStatusList() {
    const res = await Axios.get(`${config.url}/statuses?category=chop`, { headers: { Pragma: 'no-cache' } })
    this.setState({ status: res.data })
  }

  getDeptHeads(heads) {
    let dh = ""
    heads.map(head => {
      dh = dh + head + "; "
    })
    return dh
  }

  handleKeyDown = (e) => {
    if (e.key === "Enter") {
      this.getApplications(this.state.page, this.state.limit)
    }
  }

  search = () => {
    this.getApplications(this.state.page, this.state.limit)
  }

  convertDate(dateValue) {
    let regEx = dateValue.replace(/(\d{4})(\d{2})(\d{2})/g, '$1/$2/$3')
    return regEx
  }

  getCurrentDate() {
    var tempDate = new Date();
    var date = tempDate.getFullYear() + '' + (tempDate.getMonth() + 1) + '' + tempDate.getDate();
    return date
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

  handleSearch = name => event => {
    const options = this.state.searchOption
    options[name] = event.target.value
    this.setState(state => {
      const searchOption = options
      return {
        searchOption
      }
    }, console.log(this.state.searchOption))
  }

  toggleModal() {
    this.setState({ modal: !this.state.modal })
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

  dateChange = (name, view) => date => {
    let month = date.getMonth()

    let dates = ""
    if (date) {
      dates = `${date.getFullYear()}${month !== 10 && month !== 11 ? 0 : ""}${date.getMonth() + 1}${date.getDate()}`
    }
    this.setState({ [view]: date, validDate: true });
    this.setState(state => {
      let exportDate = this.state.exportDate
      exportDate[name] = dates
      return { exportDate }
    })
  };

  async exportLogs() {
    let from = this.state.exportDate.exportFrom
    let to = this.state.exportDate.exportTo
    console.log(from, to)
    if (from !== "" && to !== "") {
      let url = `${config.url}/tasks?category=export&startdate=${from}&enddate=${to}&userid=${localStorage.getItem('userId')}`
      window.open(url, "_blank")
      console.log(`Exporting Logs from ${from} to ${to}`)
      // await Axios.get(`${config.url}/tasks?category=export&startdate=${from}&enddate=${to}&userid=${localStorage.getItem('userId')}`)
      //   .then(res => {
      //     // console.log(res.data.fileContents)
      //   })
      this.toggleModal()
      this.setState({ validDate: true })
      return true;

    }
    else {
      this.setState({ validDate: false })
      return false;
    }
  }

  goToDetails(id, url) {
    this.props.history.push({
      pathname: url,
      state: { taskId: id }
    })
  }

  render() {
    const { applications, modal, exportFromDateView, exportToDateView, exportDate, validDate, totalPages } = this.state
    // let columnData = Object.keys(applications[0])
    if (this.props.roleId === "REQUESTOR")
      return (<Card><CardBody><h4>Not Authorized</h4></CardBody></Card>)
    return (

      <div>
        <h3>Chop Applications</h3>
        <Card onKeyDown={this.handleKeyDown}>
          <CardHeader>
            Chop Applications
              <Button className="float-right" onClick={this.search} >Search</Button>
            <div className="float-right">&nbsp;&nbsp;&nbsp;</div>
            <Button color="primary" className="float-right" onClick={this.toggleModal} >Export Logs</Button>
          </CardHeader>
          <CardBody>
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
                  style: { textAlign: "center" },
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
                  filterMethod: (filter, row) => {
                    return row[filter.id] === filter.value;
                  },
                  Filter: ({ filter, onChange }) => {
                    return (
                      <Input type="select" value={this.state.searchOption.departmentId} onChange={this.handleSearch('departmentId')} >
                        <option value="" > Please Select </option>
                        {this.state.departments.map((dept, index) =>
                          <option key={index} value={dept.deptId} >{dept.deptName}</option>
                        )}
                      </Input>

                    )
                  },
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
                        <option value="" > Please Select </option>
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
                  style: { textAlign: "center" }
                },
                {
                  Header: "Created By",
                  accessor: "createdByName",
                  width: this.getColumnWidth('createdByName', "Created By"),
                  Cell: this.renderEditable,
                  style: { textAlign: "center" }
                }
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
              // onFetchData={(state, instance) => {
              //   console.log(state.page, state.pageSize)
              //   // this.setState({loading: true})
              //   this.setState({ page: state.page + 1, limit: state.pageSize })
              //   this.getApplications(state.page + 1, state.pageSize)
              //   // this.setState({page: state.page, limit: state.pageSize})
              // }}


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
                      this.goToDetails(rowInfo.original.taskId, `/chopapps/details`)
                      this.setState({ selectedId: rowInfo.original.taskId })
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


        <Modal isOpen={modal} toggle={this.toggleModal}>
          <ModalHeader >Export Logs</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label>Select Date Range</Label>
              <Row>
                <Col>
                  <Label>From:</Label>
                  <DatePicker placeholderText="YYYY/MM/DD" popperPlacement="auto-center" showPopperArrow={false} todayButton="Today"
                    className="form-control" required dateFormat="yyyy/MM/dd"
                    selected={exportFromDateView}
                    onChange={this.dateChange("exportFrom", "exportFromDateView")}

                    showMonthDropdown
                    showYearDropdown
                    selectsStart
                    startDate={exportFromDateView}
                    endDate={exportToDateView}
                  />
                </Col>
                <Col>
                  <Label>To:</Label>
                  <DatePicker placeholderText="YYYY/MM/DD" popperPlacement="auto-center" showPopperArrow={false} todayButton="Today"
                    className="form-control" required dateFormat="yyyy/MM/dd"

                    showMonthDropdown
                    showYearDropdown
                    selected={exportToDateView}
                    onChange={this.dateChange("exportTo", "exportToDateView")}
                    selectsEnd
                    endDate={exportToDateView}
                    minDate={exportFromDateView}
                    startDate={exportFromDateView}
                  />
                </Col>
              </Row>

            </FormGroup>
            {exportDate.exportFrom !== "" & exportDate.exportTo !== ""
              ? <div>Export logs from <b>{this.convertDate(exportDate.exportFrom)}</b> to <b>{this.convertDate(exportDate.exportTo)}</b> </div>
              : null
            }



          </ModalBody>
          <ModalFooter>
            {!validDate
              ? <div
                // >
                //   <small 
                style={{ color: "red" }} >
                Please select From and To date!
              {/* </small> */}
              </div>
              : null
            }
            <Button color="primary" onClick={this.exportLogs} >Export Logs</Button>
            {/* <CSVLink
              data={applications}
              filename={`CHOP${this.props.legalName}${this.getCurrentDate()}.csv`}
              className="btn btn-primary"
              target="_blank"
              onClick={() => {
                return this.exportLogs()
              }}
            >
              Export Logs </CSVLink> */}
            {/* <Button color="primary" onClick={this.exportLogs}>Export Logs</Button>{' '} */}
            <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default ChopApplication;


