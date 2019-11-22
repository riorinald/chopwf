import React, { Component } from 'react';
import {
    Card, CardBody, CardHeader, Col, Row,
    Input,
    Button,

} from 'reactstrap';
import ReactTable from "react-table";
import "react-table/react-table.css"
import Axios from 'axios';
import config from '../../config';
import { Redirect } from 'react-router-dom'

let mounted = 0
let array = []

export const resetMounted = {
    setMounted(){
        mounted = 0
    }
}

class MyPendingTasks extends Component {
    constructor(props) {
        super(props)
        this.state = {

            selectionChanged: false,
            rowEdit: null,
            value: "",
            editableRows: {},
            selectedRowIndex: [],
            toggleDetails: false,

            applicationTypes: [],
            chopTypes: [],

            filtered: [],



            show: true,

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

            //data retrieved from database
            pendingTasks: [],

            //data assigned on Row Selected 
            taskId: "",
            appTypeId:"",
            redirectToUrl: "",
            loading: false,
        }

        this.getPendingTasks = this.getPendingTasks.bind(this);
        this.search = this.search.bind(this)
        this.onFilteredChangeCustom = this.onFilteredChangeCustom.bind(this)
        this.getData = this.getData.bind(this);
    }

    async componentDidMount() {
        await this.getData("applicationTypes", `${config.url}/apptypes`);
        await this.getData("chopTypes", `${config.url}/choptypes?companyid=${this.props.legalName}`);
        console.log(mounted)
        if (mounted === 0) {
            this.getPendingTasks();
        }
        else {
            this.setState({pendingTasks: array})
        }
        mounted = mounted + 1
    }

    convertDate(dateValue) {
        let regEx = dateValue.replace(/(\d{4})(\d{2})(\d{2})/g, '$1/$2/$3')
        return regEx
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


    getDeptHeads(heads) {
        let dh = ""
        heads.map(head => {
            dh = dh + head + "; "
        })
        return dh
    }



    async getPendingTasks() {
        this.setState({ loading: !this.state.loading })
        let url = `${config.url}/tasks?userid=${localStorage.getItem('userId')}&requestNum=${this.state.searchOption.requestNum}&applicationTypeName=${this.state.searchOption.applicationTypeName}&chopTypeName=${this.state.searchOption.chopTypeName}&departmentHeadName=${this.state.searchOption.departmentHeadName}&teamName=${this.state.searchOption.teamName}&documentCheckByName=${this.state.searchOption.documentCheckByName}&statusName=${this.state.searchOption.statusName}&createdDate=${this.state.searchOption.createdDate}&createdByName=${this.state.searchOption.createdByName}`
        const response = await Axios.get(url)
        this.setState({ pendingTasks: response.data, loading: !this.state.loading })
        array = response.data
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
        this.getPendingTasks()
    }

    handleKeyDown = (e) => {
        if (e.key === "Enter") {
            this.getPendingTasks()
        }
    }

    render() {
        const { pendingTasks } = this.state;
        return (
            <div>
                <h4>MY PENDING TASKS</h4>

                {/* {this.state.show? */}
                <Card className="animated fadeIn">
                    <CardHeader >
                        <Row>
                            <Col lg={11} >PENDING TASKS</Col>
                            <Col style={{ display: "flex" }}>
                                <Button onClick={this.search} >Search</Button>
                            </Col>
                        </Row>

                    </CardHeader>
                    <CardBody onKeyDown={this.handleKeyDown} >
                        <ReactTable
                            data={pendingTasks}
                            sortable
                            filterable
                            loading={this.state.loading}
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
                                                <option value="">Please Select an application Type</option>
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
                                                <option value="">Please Select a Chop Type</option>
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
                            defaultPageSize={10}
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
                                            this.setState({ taskId: rowInfo.original.taskId, appTypeId:rowInfo.original.applicationTypeId,  redirectToUrl: `mypendingtask/details` })

                                            let status = rowInfo.original.statusId
                                            if (status === "DRAFT" || status === "RECALL" || status === "SENDBACK") {
                                            // if (status === "PENDINGDEPTHEAD") {
                                            //     this.setState({ toggleDetails: true, show: false })
                                            }
                                            else {
                                                this.setState({ toggleDetails: false, show: false })
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
                                    return {};
                                }
                            }}
                        />
                    </CardBody>
                </Card>
                {this.state.toggleDetails
                    ? <Redirect to={{
                        pathname: 'editrequest',
                        state: { id: this.state.taskId }
                    }} />
                    : !this.state.show
                        ? <Redirect to={{
                            pathname: this.state.redirectToUrl,
                            state: { id: this.state.taskId, appTypeId: this.state.appTypeId }
                        }} />
                        : null
                }
            </div>
        )
    }
}
export default MyPendingTasks;
