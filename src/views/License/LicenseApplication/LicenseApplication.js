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


class LicenseApplication extends Component {
    constructor(props) {
        super(props)
        this.state = {
            licenseApplication: [],
            taskDetails: [],
            approvalHistories: [],
            selectedRow: [],
            searchOption: { licenseName: "", documentType: "", seniorManagerAbove: "", status: "" },
            loading: false,
            filtered: [],
            seniorManagers: [],
            departments: [],
            licenseNames: [],
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
        this.onFilteredChangeCustom = this.onFilteredChangeCustom.bind(this)

    }

    componentDidMount() {
        this.getData('licenseNames');
        this.getData('seniorManagers');
        // this.getSeniorManagers();
        this.getData('departments');
    }

    async getData(name) {
        let res = null
        if (name === "departments") {
            res = await Axios.get(`${config.url}/${name}`)
        }
        else if (name === "seniorManagers") {
            res = await Axios.get(`${config.url}/users?category=normal&companyid=${this.props.legalName}&displayname=&userid=${localStorage.getItem("userId")}`)
        }
        else {
            res = await Axios.get(`https://5dedc007b3d17b00146a1c5a.mockapi.io/details/${name}`)
        }
        this.setState({ [name]: res.data })
    }

    goToDetails(taskId) {
        this.props.history.push({
            pathname: `admin-apps/${taskId}`,
            state: { redirected: true }
        })

    }

    async getLicenseApplications() {
        this.setState({ loading: true })
        await Axios.get(`${config.url}/licenses?userId=${localStorage.getItem("userId")}&category=all`)
            .then(res => {
                this.setState({ licenseApplication: res.data, loading: false })
            })
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
        this.getLicenseApplications()
    }

    handleKeyDown = (e) => {
        if (e.key === "Enter") {
            this.getLicenseApplications()
        }
    }

    render() {
        const { licenseApplication, licenseNames, seniorManagers, departments, status } = this.state
        return (
            <div className="animated fadeIn" >
                <h4>License Applications</h4>
                <Card onKeyDown={this.handleKeyDown}>
                    <CardHeader>LICENSE APPLICATIONS <Button className="float-right" onClick={this.getLicenseApplications} >Search</Button></CardHeader>
                    <CardBody>
                        <ReactTable
                            data={licenseApplication}
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
                                    // Cell: this.renderEditable,
                                    style: { textAlign: "center" },
                                    width: this.getColumnWidth('requestNum', "Request Number")
                                },
                                {
                                    Header: "License Name",
                                    accessor: "licenseName",
                                    // Cell: this.renderEditable,
                                    width: this.getColumnWidth('licenseName', "Licese Name"),
                                    filterMethod: (filter, row) => {
                                        return row[filter.id] === filter.value;
                                    },
                                    Filter: ({ filter, onChange }) => {
                                        return (
                                            <Input type="select" value={this.state.searchOption.licenseName} onChange={this.handleSearch('licenseName')} >
                                                <option disabled value="">Please Select a License Name</option>
                                                {licenseNames.map((name, index) =>
                                                    <option key={index} value={name.name}> {name.name} </option>
                                                )}
                                            </Input>

                                        )
                                    },
                                    style: { textAlign: "center" }
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
                                                <option disabled value="">Please Select a document Type</option>
                                                <option value="1">Scanned Copy</option>
                                                <option value="2">Original Copy</option>
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
                                    style: { textAlign: "center" }
                                },
                                {
                                    Header: "Senior Manager or above of Requestor Department",
                                    accessor: `seniorManager`,
                                    width: this.getColumnWidth('seniorManager', "Senior Manager or above of Requestor Department"),
                                    // Cell: row => (
                                    //     <div> {row.original.seniorManager} </div>
                                    // ),
                                    style: { textAlign: "center" },
                                    filterMethod: (filter, row) => {
                                        return row[filter.id] === filter.value;
                                    },
                                    Filter: ({ filter, onChange }) => {
                                        return (
                                            <Input type="select" value={this.state.searchOption.status} onChange={this.handleSearch('seniorManagerAbove')} >
                                                <option disabled value="">Please Select a senior Manager</option>
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
                                            <Input type="select" value={this.state.searchOption.status} onChange={this.handleSearch('seniorManagerAbove')} >
                                                <option disabled value="">Please Select a status</option>
                                                {status.map((stat, index) =>
                                                    <option key={index} value={stat} > {stat} </option>
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
                                    style: { textAlign: "center" }
                                },
                                {
                                    Header: "Express Number",
                                    accessor: "plannedReturnDate",
                                    width: this.getColumnWidth('plannedReturnDate', "Express Number"),
                                    // Cell: this.renderEditable,
                                    style: { textAlign: "center" }
                                },
                                {
                                    Header: "Return Ways",
                                    accessor: "plannedReturnDate",
                                    width: this.getColumnWidth('plannedReturnDate', "Return Ways"),
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
                                            this.goToDetails(rowInfo.original.licenseId)
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