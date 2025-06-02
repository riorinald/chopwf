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
import theme from '../theme.css'
import ReactTable from "react-table";
import "react-table/react-table.css"
// import ChopApplicationDetail from './ChopApplicationDetail';
import Axios from 'axios';
import config from '../../config';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {Authorize, CommonFn} from '../../functions/'

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
      createdDateView:"",

      searchOption: {
        page:"chopApplications",
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
      departments: [],
      status: [],
      isAdmin: false

    }
    this.getApplications = this.getApplications.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.exportLogs = this.exportLogs.bind(this);
    this.onFilteredChangeCustom = this.onFilteredChangeCustom.bind(this)
    // this.dateChange = this.dateChange.bind(this);
  }
  componentDidMount() {
    const legalEntity = this.props.legalName
    const adminEntity = Authorize.getCookies().chopKeeperCompanyIds
    const isAdmin = Authorize.check(legalEntity, adminEntity)
    const searchOption = Authorize.getCookie('searchOption')
    
      if (isAdmin) {
        this.setState({ isAdmin: isAdmin })
        if(searchOption && searchOption.page === "chopApplications"){
          this.setState({
              searchOption: searchOption,
              createdDateView: CommonFn.convertDate(searchOption.createdDate)
          }, () => {this.getApplications(1, this.state.limit)
          })
      }
      else{
          this.getApplications(this.state.page, this.state.limit)
      }
        this.getData("applicationTypes", `${config.url}/apptypes`);
        this.getData("chopTypes", `${config.url}/choptypes?companyid=${this.props.legalName}`);
        this.getData("departments", `${config.url}/departments`);
        this.getStatusList();
      }
  }

  componentWillMount() {
    Authorize.delCookie('searchOption')
  }

  async getApplications(pageNumber, pageSize) {
    this.setState({ loading: !this.state.loading })
    await Axios.get(`${config.url}/tasks?category=all&userid=${Authorize.getCookies().userId}&companyid=${this.props.legalName}&requestNum=${this.state.searchOption.requestNum}&applicationTypeId=${this.state.searchOption.applicationTypeName}&chopTypeId=${this.state.searchOption.chopTypeName}&departmentHeadName=${this.state.searchOption.departmentHeadName}&teamName=${this.state.searchOption.teamName}&documentCheckByName=${this.state.searchOption.documentCheckByName}&statusName=${this.state.searchOption.statusName}&createdDate=${this.state.searchOption.createdDate}&createdByName=${this.state.searchOption.createdByName}&departmentname=${this.state.searchOption.departmentName}&page=${pageNumber}&pagesize=${pageSize}`,
      { headers: { Pragma: 'no-cache' } }).then(res => {
        this.setState({ applications: res.data.tasks, loading: !this.state.loading, totalPages: res.data.pageCount === 0 ? 1 : res.data.pageCount })
        // console.log(res.data)
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
      this.getApplications(1, this.state.limit)
    }
  }

  search = () => {
    this.getApplications(1, this.state.limit)
  }

  clearSearch = () => {
    Authorize.delCookie('searchOption')
    this.setState({
        page: 1,
        searchOption: {
            page:"chopApplications",
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
        }
    }, () => {this.getApplications(1, this.state.limit)} 
    )
  }

  convertDate(dateValue) {
    let regEx = dateValue.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')
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
    }
    // ,console.log(this.state.searchOption)
    )
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


  searchDateChange = (name, view) => date => {


    let dates = ""
    if (date) {
      let month = date.getMonth()
      dates = `${date.getFullYear()}${month !== 10 && month !== 11 ? 0 : ""}${date.getMonth() + 1}${date.getDate()}`
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

  dateChange = (name, view) => date => {
    let month = date.getMonth()

    let dates = ""
    if (date) {
      let tempDate = format(date, "yyyy-MM-dd").split('T')[0];
      dates = tempDate.replace(/-/g, "")
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
    // console.log(from, to)
    if (from !== "" && to !== "") {
      let url = `${config.url}/tasks?category=export&startdate=${from}&enddate=${to}&userid=${Authorize.getCookies().userId}&companyid=${localStorage.getItem('legalEntity')}`
      window.open(url, "_blank")
      console.log(`Exporting Logs from ${from} to ${to}`)
      // await Axios.get(`${config.url}/tasks?category=export&startdate=${from}&enddate=${to}&userid=${Authorize.getCookies().userId}`)
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
      state: { taskId: id, searchOption: this.state.searchOption}
    })
  }

  render() {
    const { isAdmin, applications, modal, exportFromDateView, exportToDateView, exportDate, validDate, totalPages } = this.state
    // let columnData = Object.keys(applications[0])
    const getYear = date => {
      return date.getFullYear()
    }

    const year = (new Date()).getFullYear();
    const years = Array.from(new Array(3), (val, index) => index + (year - 1));
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    const getMonth = date => {
      let month = date.getMonth()
      return months[month]
    }
    if (!isAdmin){
      return(
        <Card>
          <CardBody>
            <h4>Not Authorized</h4>
          </CardBody>
        </Card>)
    }
    return (
      <div>
        <h3>Chop Applications</h3>
        <Card onKeyDown={this.handleKeyDown}>
          <CardHeader>
            Chop Applications
              <Button color="primary" className="float-right" onClick={this.toggleModal} > Export Logs <i class="fa fa-file-text ml-1"></i></Button>
              <Button className="float-right mr-2" onClick={this.clearSearch} > Reset <i className="icon-reload"></i></Button>
              <Button className="float-right mr-2" onClick={this.search} > Search <i className="icon-magnifier ml-1"></i> </Button>
          </CardHeader>
          <CardBody>
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
                  filterMethod: (filter, row) => {
                    return row[filter.id] === filter.value;
                  },
                  Filter: ({ filter, onChange }) => {
                    return (
                      <DatePicker placeholderText="YYYY/MM/DD" popperPlacement="auto-center" showPopperArrow={false} todayButton="Today"
                        className="form-control" dateFormat="yyyy/MM/dd"
                        renderCustomHeader={({
                          date,
                          changeYear,
                          changeMonth,
                          decreaseMonth,
                          increaseMonth,
                          prevMonthButtonDisabled,
                          nextMonthButtonDisabled
                        }) => (
                            <div
                              style={{
                                margin: 10,
                                display: "flex",
                                justifyContent: "center"
                              }}
                            >
                              <Button onClick={decreaseMonth} disabled={prevMonthButtonDisabled} >{`<`}</Button>
                              <Input
                                value={getYear(date)}
                                onChange={({ target: { value } }) => changeYear(value)}
                                type="select">
                                {years.map(option => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </Input>
                              <Input value={getMonth(date)} onChange={({ target: { value } }) =>
                                changeMonth(months.indexOf(value))
                              } type="select">
                                {months.map((option) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </Input>
                              <Button onClick={increaseMonth} disabled={nextMonthButtonDisabled} >{`>`}</Button>

                            </div>
                          )}
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        selected={this.state.createdDateView}
                        isClearable
                        getTheadFilterThProps
                        onChange={this.searchDateChange("createdDate", "createdDateView")}
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
                }
              ]}
              defaultPageSize={this.state.limit}
              manual
              page={this.state.page - 1}
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
          <ModalHeader toggle={this.toggleModal} >Export Logs</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label>Select Date Range</Label>
              <Row className="px-1">
                <Col className="px-2">
                  <Label>From:</Label>
                  <DatePicker placeholderText="YYYY/MM/DD" popperPlacement="auto-center" showPopperArrow={false} todayButton="Today"
                    className="form-control mx-1" required dateFormat="yyyy/MM/dd"
                    renderCustomHeader={({
                      date,
                      changeYear,
                      changeMonth,
                      decreaseMonth,
                      increaseMonth,
                      prevMonthButtonDisabled,
                      nextMonthButtonDisabled
                    }) => (
                        <div
                          style={{
                            margin: 10,
                            display: "flex",
                            justifyContent: "center"
                          }}
                        >
                          <Button onClick={decreaseMonth} disabled={prevMonthButtonDisabled} >{`<`}</Button>
                          <Input
                            value={getYear(date)}
                            onChange={({ target: { value } }) => changeYear(value)}
                            type="select">
                            {years.map(option => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </Input>
                          <Input value={getMonth(date)} onChange={({ target: { value } }) =>
                            changeMonth(months.indexOf(value))
                          } type="select">
                            {months.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </Input>
                          <Button onClick={increaseMonth} disabled={nextMonthButtonDisabled} >{`>`}</Button>

                        </div>
                      )}
                    selected={exportFromDateView}
                    onChange={this.dateChange("exportFrom", "exportFromDateView")}

                    showMonthDropdown
                    showYearDropdown
                    selectsStart
                    startDate={exportFromDateView}
                    endDate={exportToDateView}
                  />
                </Col>
                <Col className="px-2">
                  <Label>To:</Label>
                  <DatePicker placeholderText="YYYY/MM/DD" popperPlacement="auto-center" showPopperArrow={false} todayButton="Today"
                    className="form-control mx-1" required dateFormat="yyyy/MM/dd"
                    renderCustomHeader={({
                      date,
                      changeYear,
                      changeMonth,
                      decreaseMonth,
                      increaseMonth,
                      prevMonthButtonDisabled,
                      nextMonthButtonDisabled
                    }) => (
                        <div
                          style={{
                            margin: 10,
                            display: "flex",
                            justifyContent: "center"
                          }}
                        >
                          <Button onClick={decreaseMonth} disabled={prevMonthButtonDisabled} >{`<`}</Button>
                          <Input
                            value={getYear(date)}
                            onChange={({ target: { value } }) => changeYear(value)}
                            type="select">
                            {years.map(option => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </Input>
                          <Input value={getMonth(date)} onChange={({ target: { value } }) =>
                            changeMonth(months.indexOf(value))
                          } type="select">
                            {months.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </Input>
                          <Button onClick={increaseMonth} disabled={nextMonthButtonDisabled} >{`>`}</Button>

                        </div>
                      )}
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
            <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default ChopApplication;


