import React, { Component } from 'react';
import {
    Card, CardBody, CardHeader, Table, Col, Row,
    Input,
    Button,
    FormGroup,
    Label,
    Progress,
    Badge,
    Collapse
} from 'reactstrap';
import ReactTable from "react-table";
import "react-table/react-table.css"
import Axios from 'axios';
import config from '../../config';
import { access } from 'fs';
import {
    DetailSTU,
    DetailLTU,
    DetailLTI,
    DetailCNIPS
} from './Details';



class MyPendingTasks extends Component {
    constructor(props) {
        super(props)
        this.state = {

            selectionChanged: false,
            rowEdit: null,
            value: "",
            editableRows: {},
            selectedRowIndex: [],
            collapse: false,

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

            //data retrieved from database
            pendingTasks: [],

            //data assigned on Row Selected 
            taskDetail: {}
        }

        this.getPendingTasks = this.getPendingTasks.bind(this);
        this.search = this.search.bind(this)
        this.onFilteredChangeCustom = this.onFilteredChangeCustom.bind(this)
        this.togglCollapse = this.togglCollapse.bind(this);
    }
    togglCollapse() {
        this.setState({
            collapse : !this.state.collapse
        })
    }

    async componentDidMount() {
        await this.getData("applicationTypes", `${config.url}/apptypes`);
        await this.getData("chopTypes", `${config.url}/choptypes`);
        this.getPendingTasks();
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

    async getPendingTasks() {
        this.setState({ pendingTasks: [] })
        let url = `${config.url}/tasks?userid=${localStorage.getItem('userId')}&requestNum=${this.state.searchOption.requestNum}&applicationTypeName=${this.state.searchOption.applicationTypeName}&chopTypeName=${this.state.searchOption.chopTypeName}&departmentHeadName=${this.state.searchOption.departmentHeadName}&teamName=${this.state.searchOption.teamName}&documentCheckByName=${this.state.searchOption.documentCheckByName}&statusName=${this.state.searchOption.statusName}&createdDate=${this.state.searchOption.createdDate}&createdByName=${this.state.searchOption.createdByName}`
        await Axios.get(url)
            .then(res => {
                let result = res.data
                result.map(task => {
                    let docNameEng = ""
                    let docNameCn = ""
                    let dh = ""
                    let date = ""
                    task.documentNameEnglish.map(doc => {
                        docNameEng = docNameEng + doc + '; '
                    })
                    task.documentNameChinese.map(doc => {
                        docNameCn = docNameCn + doc + '; '
                    })
                    task.departmentHeadName.map(head => {
                        dh = dh + head + '; '
                    })
                    for (let i = 0; i < task.createdDate.length; i++) {
                        if (i === 4 || i === 6) {
                            date = date + '/'
                        }
                        date = date + task.createdDate[i]
                    }
                    const obj = task
                    obj.documentNameEnglish = docNameEng
                    obj.documentNameChinese = docNameCn
                    obj.departmentHeadName = dh
                    obj.createdDate = date
                    this.setState(state => {
                        const pendingTasks = this.state.pendingTasks.concat(obj)
                        return {
                            pendingTasks
                        }
                    })

                })


            })
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

    approve(action) {
        console.log(action + "" + this.state.taskDetail.requestNum)
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

    checkAppType(appType) {
        switch(appType){
            case 'Short-term use' :  
                return <DetailSTU 
                        taskDetail={this.state.taskDetail}
                        collapse={this.togglCollapse}/>
                ;
            case 'Long-term use':
                return <DetailLTU
                        taskDetail={this.state.taskDetail}
                        collapse={this.togglCollapse}/>
                ;
            case 'Long-term initiation':
                return <DetailLTI
                        taskDetail={this.state.taskDetail}
                        collapse={this.togglCollapse}/>
                ;
            case 'Contract non-IPS':
                return <DetailCNIPS
                        taskDetail={this.state.taskDetail}
                        collapse={this.togglCollapse}/>
                ;
        }
    }

    
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

    render() {
        const { pendingTasks } = this.state;

        return (
            <div>
                <h4>MY PENDING TASKS</h4>
                {/* <Row> */}
                {/* <Col sm={3}> */}
                <Collapse isOpen={!this.state.collapse}>
                    <Card>
                        <CardHeader >
                            <Row>
                                <Col lg={11} >PENDING TASKS</Col>
                                <Col style={{ display: "flex" }}>
                                    <Button onClick={this.search} >Search</Button>
                                </Col>
                            </Row>

                        </CardHeader>
                        <CardBody>
                            <ReactTable
                                data={pendingTasks}
                                sortable
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
                                        Cell: this.renderEditable,
                                        style: { textAlign: "center" },
                                        filterable: false
                                    },
                                    {

                                        Header: "Document Name Chinese",
                                        accessor: "documentNameChinese",
                                        width: this.getColumnWidth('documentNameChinese', "Document Name Chinese"),
                                        Cell: this.renderEditable,
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
                                        accessor: "departmentHeadName",
                                        width: this.getColumnWidth('departmentHeadName', "Department Head"),
                                        Cell: this.renderEditable,
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
                                        Cell: this.renderEditable,
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
                                        Cell: this.renderEditable,
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

                                                // console.log(rowInfo.original);
                                                this.setState({ taskDetail: rowInfo.original, collapse: true })
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
                </Collapse>
                <Collapse isOpen={this.state.collapse}>
                    {this.checkAppType(this.state.taskDetail.applicationTypeName)}
                </Collapse>
                {/* </Col> */}

                {/* </Row> */}


            </div>
        )
    }
}
export default MyPendingTasks;
