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
// import LicenseTaskDetails from './LicenseTaskDetails'

class LicenseApplication extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pendingTasks: [],
            taskDetails: [],
            approvalHistories: [],
            selectedRow: [],
            searchOption: {},
            loading: false,
            filtered: [],
        }
    }

    componentDidMount() {
        this.getPendingTasks()
    }

    goToDetails(taskId) {
        this.props.history.push({
            pathname: `admin-apps/${taskId}`,
            state: { redirected: true }
        })

    }

    async getPendingTasks() {
        this.setState({ loading: true })
        await Axios.get(`http://5de7307ab1ad690014a4e040.mockapi.io/licenseTask`)
            .then(res => {
                this.setState({ pendingTasks: res.data, loading: false })
            })
    }




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
        })
        this.getPendingTasks()
    }

    render() {
        const { pendingTasks } = this.state
        return (
            <div>
                <h4>My Pending Tasks</h4>
                <Card className="animated fadeIn">
                    <CardHeader>MY PENDING TASKS</CardHeader>
                    <CardBody>
                        <ReactTable
                            data={pendingTasks}
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
                                    accessor: "requestNumber",
                                    // Cell: this.renderEditable,
                                    style: { textAlign: "center" },
                                    width: this.getColumnWidth('requestNumber', "Request Number")
                                },
                                {
                                    Header: "Licese Name",
                                    accessor: "licenseName",
                                    // Cell: this.renderEditable,
                                    width: this.getColumnWidth('licenseName', "Licese Name"),
                                    filterMethod: (filter, row) => {
                                        return row[filter.id] === filter.value;
                                    },
                                    Filter: ({ filter, onChange }) => {
                                        return (
                                            <Input type="select" value={this.state.searchOption} onChange={this.handleSearch('licenseName')} >
                                                <option value="">Please Select</option>
                                            </Input>

                                        )
                                    },
                                    style: { textAlign: "center" }
                                },
                                {
                                    Header: "Document Type",
                                    accessor: "documentType",
                                    // Cell: this.renderEditable,
                                    style: { textAlign: "center" },
                                    width: this.getColumnWidth('documentType', "Document Type"),
                                    filterMethod: (filter, row) => {
                                        return row[filter.id] === filter.value;
                                    },
                                    Filter: ({ filter, onChange }) => {
                                        return (
                                            <Input type="select" value={this.state.searchOption} onChange={this.handleSearch('documentType')} >
                                                <option value="0">Please Select</option>
                                                <option value="1">Scanned Copy</option>
                                                <option value="2">Original Copy</option>
                                            </Input>
                                        )
                                    },
                                },
                                {
                                    Header: "Planned Return Date",
                                    accessor: "returnDate",
                                    width: this.getColumnWidth('returnDate', "Date Return Creation"),
                                    Cell: row => (
                                        <div> {this.convertDate(row.original.returnDate)} </div>
                                    ),
                                    style: { textAlign: "center" }
                                },
                                {
                                    Header: "Senior Manager or above of Requestor Department",
                                    accessor: `seniorManagerAbove`,
                                    width: this.getColumnWidth('seniorManagerAbove', "Senior Manager or above of Requestor Department"),
                                    Cell: row => (
                                        <div> {row.original.seniorManagerAbove} </div>
                                    ),
                                    style: { textAlign: "center" },
                                    filterMethod: (filter, row) => {
                                        return row[filter.id] === filter.value;
                                    },
                                    Filter: ({ filter, onChange }) => {
                                        return (
                                            <Input type="select" value={this.state.searchOption} onChange={this.handleSearch('seniorManagerAbove')} >
                                                <option value="0">Please Select</option>
                                            </Input>
                                        )
                                    },
                                },
                                {
                                    Header: "Deliver Ways",
                                    accessor: "deliverWays",
                                    width: this.getColumnWidth('deliverWays', "Deliver Ways"),
                                    // Cell: this.renderEditable,
                                    style: { textAlign: "center" }
                                },
                                {
                                    Header: "Express Number",
                                    accessor: "expressNumber",
                                    width: this.getColumnWidth('expressNumber', "Express Number"),
                                    // Cell: this.renderEditable,
                                    style: { textAlign: "center" }
                                },
                                {
                                    Header: "Return Ways",
                                    accessor: "returnWays",
                                    width: this.getColumnWidth('returnWays', "Return Ways"),
                                    // Cell: this.renderEditable,
                                    style: { textAlign: "center" }
                                }
                            ]}
                            defaultPageSize={10}
                            // pages={this.state.page}
                            // manual
                            // onPageChange={(e)=>{this.setState({page: e})}}
                            // canNextpage={true}
                            className="-striped -highlight"
                            loading={this.state.loading}
                            getTrProps={(state, rowInfo) => {
                                if (rowInfo && rowInfo.row) {
                                    return {
                                        onClick: e => {
                                            // console.log(rowInfo.original, rowInfo)
                                            // this.getTaskDetails(rowInfo.original.id)
                                            this.goToDetails(rowInfo.original.id)
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