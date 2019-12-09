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
      page: 1,
      limit: 10,

      collapse: true,
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
      applicationDetail: {},
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
        createdByName: ""
      },

    }
    this.getApplications = this.getApplications.bind(this);
    this.goBack = this.goBack.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.exportLogs = this.exportLogs.bind(this);
    // this.dateChange = this.dateChange.bind(this);
  }
  componentDidMount() {
    this.getApplications();
    this.getData("applicationTypes", `${config.url}/apptypes`);
    this.getData("chopTypes", `${config.url}/choptypes?companyid=${this.props.legalName}`);

  }

  async getApplications() {
    this.setState({ loading: !this.state.loading })
    await Axios.get(`${config.url}/tasks?category=all&userid=${localStorage.getItem('userId')}&requestNum=${this.state.searchOption.requestNum}&applicationTypeName=${this.state.searchOption.applicationTypeName}&chopTypeName=${this.state.searchOption.chopTypeName}&departmentHeadName=${this.state.searchOption.departmentHeadName}&teamName=${this.state.searchOption.teamName}&documentCheckByName=${this.state.searchOption.documentCheckByName}&statusName=${this.state.searchOption.statusName}&createdDate=${this.state.searchOption.createdDate}&createdByName=${this.state.searchOption.createdByName}`).then(res => {
      this.setState({ applications: res.data, loading: !this.state.loading })
    })
  }

  async getAppDetails(id) {
    this.setState({ loading: !this.state.loading })
    // await Axios.get(`${config.url}/tasks/${id}?userid=${localStorage.getItem('userId')}`)
    await Axios.get(`${config.url}/tasks/5328c220-1f99-4da0-9e12-3e8d29441acd?userid=rio@otds.admin`)
      .then(res => {
        this.setState({ applicationDetail: res.data, collapse: !this.state.collapse })
      })
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


  goBack(didUpdate) {
    if (didUpdate === true) {
      this.getApplications()
      this.setState({ collapse: !this.state.collapse })
    }
    else {
      this.setState({ loading: !this.state.loading, collapse: !this.state.collapse })
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

  getDeptHeads(heads) {
    let dh = ""
    heads.map(head => {
      dh = dh + head + "; "
    })
    return dh
  }

  search = () => {
    this.getApplications()
  }

  convertDate(dateValue) {
    let regEx = dateValue.replace(/(\d{4})(\d{2})(\d{2})/g, '$1/$2/$3')
    return regEx
  }

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

  dateChange = (name, view) => date => {
    let dates = date.toISOString().substr(0, 10);
    // console.log(date)
    // console.log(dates)
    this.setState({ [view]: date, validDate: true });
    this.setState(state => {
      let exportDate = this.state.exportDate
      exportDate[name] = dates.replace(/-/g, "")
      // editData[name] = dates.replace(/-/g, "")
      return { exportDate }
    })
  };

  exportLogs() {
    let from = this.state.exportDate.exportFrom
    let to = this.state.exportDate.exportTo
    if (from !== "" && to !== "") {
      console.log(`Exporting Logs from ${this.convertDate(from)} to ${this.convertDate(to)}`)
      this.toggleModal()
      this.setState({ validDate: true })
    }
    else {
      this.setState({ validDate: false })
    }
  }

  goToDetails(id, url) {
    this.props.history.push({
      pathname: url,
      state: { taskId: id }
    })
  }

  render() {
    const { applications, collapse, selectedId, modal, exportFromDateView, exportToDateView, exportDate, validDate } = this.state
    // let columnData = Object.keys(applications[0])
    if (this.props.roleId === "REQUESTOR")
      return (<Card><CardBody><h4>Not Authorized</h4></CardBody></Card>)
    return (

      <div>
        <h3>Chop Applications</h3>
         <Card>
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
                    style: { textAlign: "center" },
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
                    style: { textAlign: "center" },
                    filterable: false
                  },
                  {
                    Header: "Document Check By",
                    accessor: "documentCheckByName",
                    width: this.getColumnWidth('documentCheckByName', "Document Check By"),
                    Cell: this.renderEditable,
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
                    style: { textAlign: "center" }
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
                        this.goToDetails(rowInfo.original.taskId, `/chopapps/details/${rowInfo.original.applicationTypeId}`)
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
          {/* :

          <ChopApplicationDetail
            wait={1000}
            applications={this.state.applicationDetail}
            id={selectedId}
            goBack={this.goBack}
            recall={this.recall} />
        } */}

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
                Please select From and To date !!!
              {/* </small> */}
              </div>
              : null
            }
            <Button color="primary" onClick={this.exportLogs}>Export Logs</Button>{' '}
            <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default ChopApplication;