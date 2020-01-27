import React, { Component, forwardRef } from 'react';
import {
    Card, CardBody, CardHeader, Col, Row,
    Input,
    Button, InputGroup

} from 'reactstrap';
import ReactTable from "react-table";
import "react-table/react-table.css"
import Axios from 'axios';
import config from '../../config';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import InputMask from "react-input-mask";


class MyPendingTasks extends Component {
    constructor(props) {
        super(props)
        this.state = {

            selectionChanged: false,
            rowEdit: null,
            rowIndex: null,
            value: "",
            editableRows: {},
            selectedRowIndex: [],
            toggleDetails: false,

            applicationTypes: [],
            chopTypes: [],

            filtered: [],
            totalPages: 1,
            page: 1,
            limit: 10,
            dateView1: "",

            show: true,
            dateView: null,

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

            //data retrieved from database
            pendingTasks: [],

            //data assigned on Row Selected 
            taskId: "",
            redirectToUrl: "",
            loading: false,
            departments: [],
            status: []
        }

        this.getPendingTasks = this.getPendingTasks.bind(this);
        this.search = this.search.bind(this)
        this.onFilteredChangeCustom = this.onFilteredChangeCustom.bind(this)
        this.getData = this.getData.bind(this);
        this.setFilter = this.setFilter.bind(this);
        this.redirectDetails = this.redirectDetails.bind(this);
        this.getStatusList = this.getStatusList.bind(this);
    }

    async componentDidMount() {
        await this.getData("applicationTypes", `${config.url}/apptypes`);
        await this.getData("chopTypes", `${config.url}/choptypes?companyid=${this.props.legalName}`);
        await this.getData("departments", `${config.url}/departments`);
        await this.getStatusList();
        // console.log(mounted)
        // if (mounted === 0) {
        await this.getPendingTasks(1, this.state.limit);
        // }
        // else {
        //     this.setState({ loading: !this.state.loading })
        //     this.setState({ pendingTasks: array, loading: !this.state.loading })
        // }
        // mounted = mounted + 1
    }

    async getStatusList() {
        const res = await Axios.get(`${config.url}/statuses?category=chop`, { headers: { Pragma: 'no-cache' } })
        this.setState({ status: res.data })
    }

    convertDate(dateValue) {
        let regEx = dateValue.replace(/(\d{4})(\d{2})(\d{2})/g, '$1/$2/$3')
        return regEx
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


    getDeptHeads(heads) {
        let dh = ""
        heads.map(head => {
            dh = dh + head + "; "
        })
        return dh
    }

    goToDetails(id, url) {
        this.props.history.push({
            pathname: url,
            state: { taskId: id }
        })
    }

    goToEditRequest(id) {
        this.props.history.push({
            pathname: 'mypendingtask/editrequest',
            state: { id: id }
        })
    }



    async getPendingTasks(pageNumber, pageSize) {
        this.setState({ loading: !this.state.loading })
        let userId = localStorage.getItem('userId')
        // let userId = "josh@otds.admin"
        let url = `${config.url}/tasks?category=pending&companyid=${this.props.legalName}&userid=${userId}&requestNum=${this.state.searchOption.requestNum}&applicationTypeId=${this.state.searchOption.applicationTypeName}&chopTypeId=${this.state.searchOption.chopTypeName}&departmentHeadName=${this.state.searchOption.departmentHeadName}&teamName=${this.state.searchOption.teamName}&documentCheckByName=${this.state.searchOption.documentCheckByName}&statusName=${this.state.searchOption.statusName}&createdDate=${this.state.searchOption.createdDate}&createdByName=${this.state.searchOption.createdByName}&departmentId=${this.state.searchOption.departmentId}&page=${pageNumber}&pagesize=${pageSize}`
        const response = await Axios.get(url, { headers: { Pragma: 'no-cache' } })
        this.setState({ pendingTasks: response.data.tasks, totalPages: response.data.pageCount, loading: !this.state.loading })
        // array = response.data

    }

    handleSearch = name => event => {
        let value = event.target.value
        if (name === "createdDate") {
            let temp = ""
            // for (let i = 0; i < value.length; i++) {
            //     if (i !== 4 && i !== 7 && i !== 10) {
            //         temp = temp + value[i]
            //     }
            // }
            // value = temp
        }
        const options = this.state.searchOption
        options[name] = value
        this.setState(state => {
            const searchOption = options
            return {
                searchOption
            }
        })
    }

    dateChange = (name, view) => date => {


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

    renderEditable = cellInfo => {
        const editable = this.state.editableRows[cellInfo.index];
        return (
            <div
                style={{ backgroundColor: editable ? "#fafafa" : null }}
                contentEditable={editable}
                suppressContentEditableWarning
                onBlur={e => {
                    const pendingTasks = [...this.state.pendingTasks];
                    pendingTasks[cellInfo.index][cellInfo.column.id] = e.target.innerText;
                    this.setState({ pendingTasks });
                }}
                dangerouslySetInnerHTML={{
                    __html: this.state.pendingTasks[cellInfo.index][cellInfo.column.id]
                }}
            />
        );
    };

    getColumnWidth = (accessor, headerText) => {
        let { pendingTasks } = this.state
        let max = 0
        const maxWidth = 260;
        const magicSpacing = 10;

        for (var i = 0; i < pendingTasks.length; i++) {
            if (pendingTasks[i] !== undefined && pendingTasks[i][accessor] !== null) {
                if (JSON.stringify(pendingTasks[i][accessor] || 'null').length > max) {
                    max = JSON.stringify(pendingTasks[i][accessor] || 'null').length;
                }
            }
        }

        return Math.min(maxWidth, Math.max(max, headerText.length) * magicSpacing);
    }

    search() {
        this.getPendingTasks(this.state.page, this.state.limit)
    }

    handleKeyDown = (e) => {
        if (e.key === "Enter") {
            this.getPendingTasks(this.state.page, this.state.limit)
        }
    }

    setFilter(filtered) {
        this.setState({ filtered: filtered })
    }

    redirectDetails(taskId, status, redirectUrl) {
        if (status === "DRAFT" || status === "RECALL" || status === "SENDBACK") {
            this.setState({ taskId: taskId, redirectToUrl: redirectUrl, toggleDetails: true, show: false })
        }
        else {
            this.setState({ taskId: taskId, redirectToUrl: redirectUrl, toggleDetails: false, show: false })
        }
    }

    render() {
        const { pendingTasks, totalPages } = this.state;
        const ref = React.createRef()
        const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
            <Button color="light" ref={ref} onClick={onClick}>
                {value}
            </Button>
        ))
        return (
            <div className="animated fadeIn">
                <h4>My Pending Tasks</h4>

                {/* {this.state.show? */}
                <Card onKeyDown={this.handleKeyDown} >
                    <CardHeader >
                        Pending Tasks <Button className="float-right" onClick={this.search} >Search</Button>
                    </CardHeader>
                    <CardBody >
                        <ReactTable
                            data={pendingTasks}
                            sortable
                            filterable
                            onFilteredChange={(filtered, column, value) => {
                                this.setFilter(filtered)
                                this.onFilteredChangeCustom(value, column.id || column.accessor);
                            }}
                            defaultFilterMethod={(filter, row, column) => {

                                const id = filter.pivotId || filter.id;
                                return row[id]
                            }}
                            getTheadFilterThProps={() => { return { style: { position: "inherit", overflow: "inherit" } } }}
                            defaultPageSize={this.state.limit}
                            manual
                            onPageChange={(e) => { this.setState({ page: e + 1 }, () => this.getPendingTasks(e + 1, this.state.limit)) }}
                            onPageSizeChange={(pageSize, page) => {
                                this.setState({ limit: pageSize, page: page + 1 });
                                this.getPendingTasks(page + 1, pageSize)
                            }}
                            loading={this.state.loading}
                            pages={totalPages}
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
                                                <option value="" >Please Select </option>
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
                                    Cell: this.renderEditable,
                                    filterMethod: (filter, row) => {
                                        return row[filter.id] === filter.value;
                                    },
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

                            getTrProps={(state, rowInfo) => {
                                if (rowInfo && rowInfo.row) {

                                    return {
                                        onClick: e => {
                                            this.setState({ rowIndex: rowInfo.index })
                                            // console.log("inside");
                                            // console.log(this.state.rowEdit)

                                            // console.log(`Index = ${ rowInfo.index } and Edit = ${ this.state.rowEdit } `)
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
                                            if (status === "DRAFTED" || status === "RECALLED" || status === "SENDBACK") {
                                                this.goToEditRequest(rowInfo.original.taskId)
                                            }
                                            else {
                                                this.goToDetails(rowInfo.original.taskId, `/mypendingtask/details/${rowInfo.original.applicationTypeId}`)
                                                // this.goToDetails(rowInfo.original.taskId, `/ mypendingtask / details / CNIPS`)
                                            }

                                        },
                                        style: {
                                            background:
                                                rowInfo.index === this.state.rowEdit ? "#00afec" : "white",
                                            color:
                                                rowInfo.index === this.state.rowEdit ? "white" : "black"
                                        }
                                    };
                                } else {
                                    if (this.state.rowInfo) {
                                        console.log(this.state.rowInfo)
                                    }
                                    else {
                                        return {};
                                    }
                                }
                            }}
                        />
                    </CardBody>
                </Card>
            </div>
        )
    }
}
export default MyPendingTasks;
