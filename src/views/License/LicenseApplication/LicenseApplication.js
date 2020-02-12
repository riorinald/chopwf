import React, { Component } from 'react';
import ReactTable from "react-table";
import "react-table/react-table.css"
import Axios from 'axios';
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
import config from '../../../config';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import theme from '../../theme.css'
import "react-datepicker/dist/react-datepicker.css";

class LicenseApplication extends Component {
    constructor(props) {
        super(props)
        this.state = {
            licenseApplication: [],
            taskDetails: [],
            approvalHistories: [],
            selectedRow: [],
            searchOption: {
                requestNum: "",
                licenseName: "",
                documentType: "",
                seniorManagerAbove: "",
                status: "",
                plannedReturnDate: "",
                createdDate: "",
                createdByName: "",
                departmentName: ""
            },
            totalPages: 1,
            page: 1,
            limit: 10,
            returnDateView: "",
            createdDateView: "",
            loading: false,
            filtered: [],
            seniorManagers: [],
            departments: [],
            licenseNames: [],
            statusName: []
        }
        this.onFilteredChangeCustom = this.onFilteredChangeCustom.bind(this)
        this.getLicenseApplications = this.getLicenseApplications.bind(this)

    }

    componentDidMount() {
        this.getLicenseApplications(this.state.page, this.state.limit)
        this.getLicenseNames();
        this.getData('seniorManagers');
        // this.getSeniorManagers();
        this.getData('departments');
        this.getStatusList();
    }

    async getLicenseNames() {

        const res = await Axios.get(`${config.url}/licensenames?companyId=${this.props.legalName}`, { headers: { Pragma: 'no-cache' } })
        this.setState({ licenseNames: res.data })
    }

    async getData(name) {
        let res = null
        if (name === "departments") {
            res = await Axios.get(`${config.url}/${name}`, { headers: { Pragma: 'no-cache' } })
        }
        else if (name === "seniorManagers") {
            res = await Axios.get(`${config.url}/users?category=normal&companyid=${this.props.legalName}&displayname=&userid=${localStorage.getItem("userId")}`,
                { headers: { Pragma: 'no-cache' } })
        }

        this.setState({ [name]: res.data })
    }
    goToDetails(taskId, status) {
        // if (status === "RECALLED" || status === "DRAFTED" || status === "SENDBACKED") {
        //     this.props.history.push({
        //         pathname: `admin-apps/edit`,
        //         state: { redirected: true, taskId: taskId }
        //     })
        // }
        // else {
        this.props.history.push({
            pathname: `admin-apps/details`,
            state: { redirected: true, taskId: taskId }
        })
        // }

    }

    async getLicenseApplications(page, pageSize) {
        const searchOption = this.state.searchOption
        this.setState({ loading: true })
        await Axios.get(`${config.url}/licenses?userId=${localStorage.getItem("userId")}&companyid=${this.props.legalName}&category=all&requestNum=${searchOption.requestNum}&licenseName=${searchOption.licenseName}&documentTypeName=${searchOption.documentType}&statusName=${searchOption.status}&createdDate=${searchOption.createdDate}&createdByName=${searchOption.createdByName}&plannedReturnDate=${searchOption.plannedReturnDate}&departmentname=${searchOption.departmentName}&page=${page}&pageSize=${pageSize}`,
            { headers: { Pragma: 'no-cache' } })
            .then(res => {
                this.setState({ licenseApplication: res.data.licenses, totalPages: res.data.pageCount, loading: false })
            })
    }

    async getStatusList() {
        const res = await Axios.get(`${config.url}/statuses?category=license`, { headers: { Pragma: 'no-cache' } })
        console.log(res.data)
        this.setState({ statusName: res.data })
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

    converManagers(data) {
        let temp = ""
        data.map(key => {
            temp = temp + key.label + "; "
        })
        return temp
    }


    getColumnWidth = (accessor, headerText) => {
        let { licenseApplication } = this.state
        let max = 0
        const maxWidth = 260;
        const magicSpacing = 10;

        for (var i = 0; i < licenseApplication.length; i++) {
            if (licenseApplication[i] !== undefined && licenseApplication[i][accessor] !== null) {
                if (JSON.stringify(licenseApplication[i][accessor] || 'null').length > max) {
                    max = JSON.stringify(licenseApplication[i][accessor] || 'null').length;
                }
            }
        }

        return Math.min(maxWidth, Math.max(max, headerText.length) * magicSpacing);
    }

    convertDate(dateValue) {
        let regEx = dateValue.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')
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
        })
        console.log(this.state.searchOption)
        // this.search()
    }

    handleKeyDown = (e) => {
        if (e.key === "Enter") {
            this.getLicenseApplications(1, this.state.limit)
        }
    }

    dateChange = (name, view) => date => {
        let dates = ""
        if (date) {
            let tempDate = format(date, "yyyy-MM-dd").split('T')[0];
            dates = tempDate.replace(/-/g, "")
        }
        this.setState({ [view]: date });
        this.setState(state => {
            let searchOption = this.state.searchOption
            searchOption[name] = dates
            return searchOption
        })
    };

    render() {
        const { licenseApplication, licenseNames, seniorManagers, departments, statusName, returnDateView, createdDateView, totalPages } = this.state
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
        return (
            <div className="animated fadeIn" >
                <h4>License Applications</h4>
                <Card onKeyDown={this.handleKeyDown}>

                    <CardHeader>License Applications <Button className="float-right" onClick={() => this.getLicenseApplications(1, this.state.limit)} >Search</Button></CardHeader>
                    <CardBody>
                        <ReactTable
                            data={licenseApplication}
                            filterable
                            getTheadFilterThProps={() => { return { style: { position: "inherit", overflow: "inherit" } } }}
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
                                    // Cell: this.renderEditable,
                                    style: { textAlign: "center" },
                                    width: this.getColumnWidth('requestNum', "Request Number")
                                },
                                {
                                    Header: "License Name",
                                    accessor: "licenseName",
                                    // Cell: this.renderEditable,
                                    width: this.getColumnWidth('licenseName', "License Name"),
                                    filterMethod: (filter, row) => {
                                        return row[filter.id] === filter.value;
                                    },
                                    Filter: ({ filter, onChange }) => {
                                        return (
                                            <Input type="select" value={this.state.searchOption.licenseName} onChange={this.handleSearch('licenseName')} >
                                                <option value="">Please Select a License Name</option>
                                                {licenseNames.map((name, index) =>
                                                    <option key={index} value={name.name}> {name.name} </option>
                                                )}
                                            </Input>

                                        )
                                    },
                                    style: { textAlign: "center" }
                                },
                                {

                                    Header: "Department",
                                    accessor: "departmentName",
                                    width: this.getColumnWidth('departmentName', "Department"),
                                    Cell: this.renderEditable,
                                    style: { textAlign: "center" },
                                },
                                {
                                    Header: "Document Type",
                                    accessor: "documentTypeName",
                                    // Cell: this.renderEditable,
                                    style: { textAlign: "center" },
                                    width: this.getColumnWidth('documentTypeName', "Document Type"),
                                    filterMethod: (filter, row) => {
                                        return row[filter.id] === filter.value;
                                    },
                                    Filter: ({ filter, onChange }) => {
                                        return (
                                            <Input type="select" value={this.state.searchOption.documentType} onChange={this.handleSearch('documentType')} >
                                                <option value="">Please Select a document Type</option>
                                                <option value="Scan Copy">Scan Copy</option>
                                                <option value="Original">Original Copy</option>
                                            </Input>
                                        )
                                    },
                                },
                                {
                                    Header: "Planned Return Date",
                                    accessor: "plannedReturnDate",
                                    width: this.getColumnWidth('plannedReturnDate', "Date Return Creation"),
                                    Cell: row => (
                                        <div> {this.convertDate(row.original.plannedReturnDate)} </div>
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
                                                selected={returnDateView}
                                                isClearable
                                                getTheadFilterThProps
                                                onChange={this.dateChange("plannedReturnDate", "returnDateView")}
                                            />
                                        )
                                    },
                                    style: { textAlign: "center" }
                                },
                                {
                                    Header: "Senior Manager or above of Requestor Department",
                                    accessor: `seniorManager`,
                                    width: this.getColumnWidth('seniorManager', "Senior Manager or above of Requestor Department"),
                                    Cell: row => (
                                        <div> {this.converManagers(row.original.seniorManagers)} </div>
                                    ),
                                    style: { textAlign: "center" },
                                    filterMethod: (filter, row) => {
                                        return row[filter.id] === filter.value;
                                    },
                                    Filter: ({ filter, onChange }) => {
                                        return (
                                            <Input type="select" value={this.state.searchOption.seniorManagerAbove} onChange={this.handleSearch('seniorManagerAbove')} >
                                                <option value="">Please Select a senior Manager</option>
                                                {seniorManagers.map((mgr, index) =>
                                                    <option key={index} value={mgr.displayName} > {mgr.displayName} </option>
                                                )}
                                            </Input>
                                        )
                                    },
                                },
                                {
                                    Header: "Status",
                                    accessor: "statusName",
                                    width: this.getColumnWidth('statusName', "Status"),
                                    filterMethod: (filter, row) => {
                                        return row[filter.id] === filter.value;
                                    },
                                    Filter: ({ filter, onChange }) => {
                                        return (
                                            <Input type="select" value={this.state.searchOption.status} onChange={this.handleSearch('status')} >
                                                <option value="">Please Select a status</option>
                                                {statusName.map((stat, index) =>
                                                    <option key={index} value={stat.statusName} > {stat.statusName} </option>
                                                )}
                                            </Input>
                                        )
                                    },
                                },
                                {
                                    Header: "Deliver Ways",
                                    accessor: "deliveryWayName",
                                    width: this.getColumnWidth('deliveryWayName', "Deliver Ways"),
                                    // Cell: this.renderEditable,
                                    filterable: false,
                                    style: { textAlign: "center" }
                                },
                                {
                                    Header: "Created By",
                                    accessor: "createdByName",
                                    width: this.getColumnWidth('createdByName', "Created By"),
                                    // Cell: this.renderEditable,
                                    filterMethod: (filter, row) => {
                                        return row[filter.id] === filter.value;
                                    },
                                    Filter: ({ filter, onChange }) => {
                                        return (
                                            <Input type="select" value={this.state.searchOption.createdByName} onChange={this.handleSearch('createdByName')} >
                                                <option value="">Please Select a name</option>
                                                {seniorManagers.map((mgr, index) =>
                                                    <option key={index} value={mgr.displayName} > {mgr.displayName} </option>
                                                )}
                                            </Input>
                                        )
                                    },
                                    style: { textAlign: "center" }
                                },
                                {
                                    Header: "Date of Creation",
                                    accessor: "createdDate",
                                    width: this.getColumnWidth('createdDate', "Date of Creation"),
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
                                                selected={createdDateView}
                                                isClearable
                                                getTheadFilterThProps
                                                onChange={this.dateChange("createdDate", "createdDateView")}
                                            />
                                        )
                                    },
                                    style: { textAlign: "center" }
                                },
                                {
                                    Header: "Delivery Express Number",
                                    accessor: "expDeliveryNumber",
                                    filterable: false,
                                    width: this.getColumnWidth('expDeliveryNumber', "Delivery Express Number"),
                                    // Cell: this.renderEditable,
                                    style: { textAlign: "center" }
                                },
                                {
                                    Header: "Return Express Number",
                                    accessor: "expReturnNumber",
                                    filterable: false,
                                    width: this.getColumnWidth('expReturnNumber', "Return Express Number"),
                                    // Cell: this.renderEditable,
                                    style: { textAlign: "center" }
                                },
                                {
                                    Header: "Return Ways",
                                    accessor: "returnWayName",
                                    width: this.getColumnWidth('returnWayName', "Return Ways"),
                                    filterable: false,
                                    // Cell: this.renderEditable,
                                    style: { textAlign: "center" }
                                }
                            ]}
                            defaultPageSize={this.state.limit}
                            manual
                            page={this.state.page - 1}
                            onPageChange={(e) => { this.setState({ page: e + 1 }, () => this.getLicenseApplications(e + 1, this.state.limit)) }}
                            onPageSizeChange={(pageSize, page) => {
                                this.setState({ limit: pageSize, page: page + 1 });
                                this.getLicenseApplications(page + 1, pageSize)
                            }}
                            className="-striped -highlight"
                            loading={this.state.loading}
                            pages={totalPages}
                            getTrProps={(state, rowInfo) => {
                                if (rowInfo && rowInfo.row) {
                                    return {
                                        onClick: e => {
                                            // console.log(rowInfo.original, rowInfo)
                                            // this.getTaskDetails(rowInfo.original.id)
                                            this.goToDetails(rowInfo.original.licenseId, rowInfo.original.statusId)
                                        },
                                        style: {
                                            background:
                                                rowInfo.index === this.state.rowEdit ? "#00afec" : "",
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
        )
    }

}
export default LicenseApplication