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
                res.data.map(task => {
                    let docName = ""
                    let dh = ""
                    let date = ""
                    task.documentName.map(doc => {
                        docName = docName + doc + '; '
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
                    obj.documentName = docName
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

    search() {
        console.log(this.state.searchOption)
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
                                        style: { textAlign: "center" }
                                    },
                                    {
                                        Header: "Application Type",
                                        accessor: "applicationTypeName",
                                        Cell: this.renderEditable,
                                        filterMethod: (filter, row) => {
                                            return row[filter.id] === filter.value;
                                        },
                                        Filter: ({ filter, onChange }) => {
                                            return (
                                                <Input type="select" value={this.state.searchOption.applicationTypeName} onChange={this.handleSearch('applicationTypeName')} defaultValue={""} >
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
                                        filterMethod: (filter, row) => {
                                            return row[filter.id] === filter.value;
                                        },
                                        Filter: ({ filter, onChange }) => {
                                            return (
                                                <Input type="select" value={this.state.searchOption.chopTypeName} onChange={this.handleSearch('chopTypeName')} defaultValue={""} >
                                                    <option value="">Please Select a Chop Type</option>
                                                    {this.state.chopTypes.map(type =>
                                                        <option key={type.chopTypeId} value={type.chopTypeName} >{type.chopTypeName}</option>
                                                    )}
                                                </Input>

                                            )
                                        },
                                    },
                                    {

                                        Header: "Document Name",
                                        accessor: "documentName",
                                        Cell: this.renderEditable,
                                        style: { textAlign: "center" },
                                        filterable: false
                                    },
                                    {
                                        Header: "Document Check By",
                                        accessor: "documentCheckByName",
                                        Cell: this.renderEditable,
                                        style: { textAlign: "center" }
                                    },
                                    {
                                        Header: "Department Head",
                                        accessor: "departmentHeadName",
                                        Cell: this.renderEditable,
                                        style: { textAlign: "center" }
                                    },
                                    {
                                        Header: "Entitled Team",
                                        accessor: "teamName",
                                        Cell: this.renderEditable,
                                        style: { textAlign: "center" }
                                    },
                                    {
                                        Header: "Status",
                                        accessor: "statusName",
                                        Cell: this.renderEditable,
                                        style: { textAlign: "center" }
                                    },
                                    {
                                        Header: "Date of Creation",
                                        accessor: "createdDate",
                                        Cell: this.renderEditable,
                                        style: { textAlign: "center" }
                                    },
                                    {
                                        Header: "Created By",
                                        accessor: "createdByName",
                                        Cell: this.renderEditable,
                                        style: { textAlign: "center" }
                                    },


                                    // ]
                                    // }
                                ]}
                                defaultPageSize={20}
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
                    <Card >
                        <CardHeader> <Button onClick={() => this.setState({ collapse: false })} > Back </Button>  {this.state.taskDetail.requestNum} </CardHeader>
                        <CardBody color="dark">
                            <Row noGutters={true}>
                                <Col md="6"><span className="display-5"> {this.state.taskDetail.requestNum}</span></Col>
                                <Col md="6">
                                    <Progress multi>
                                        <Progress bar color="green" value="50">Department Head Reviewing</Progress>
                                        <Progress bar animated striped color="warning" value="50">Bring Original Document to EG for Chop</Progress>
                                    </Progress>
                                </Col>
                            </Row>
                            <Row>&nbsp;</Row>
                            <Row>
                                <Col md="1">
                                    <img src={'../../assets/img/avatars/5.jpg'} className="img-avaa" alt="admin@bootstrapmaster.com" />
                                </Col>
                                <Col>
                                    <Row>
                                        <Col md="5"><h5> Liu, ChenChen (685) </h5></Col>
                                        <Col md="5"><h5><i className="fa fa-tablet" />&nbsp; +86 10 12345678 </h5></Col>
                                    </Row>
                                    <Row >
                                        <Col md="4"><h6> DFS/CN, MBAFC </h6></Col>
                                    </Row>
                                    <Row >
                                        <Col md="3">
                                            <h6><center className="boxs">Applicant</center></h6>
                                        </Col>
                                        <Col md="2"></Col>
                                        <Col md="4"><h5><i className="fa fa-envelope" />&nbsp; chenchen@daimler.com</h5></Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row><Col>
                                &nbsp;
         </Col></Row>
                            <Row>
                                <Col>
                                    <FormGroup row>
                                        <Col md="4">
                                            <Label htmlFor="text-input">Employee Number</Label>
                                        </Col>
                                        <Col xs="12" md="8">
                                            <Input disabled type="text" value={this.state.taskDetail.employeeNum} id="text-input" name="text-input" placeholder="Text" />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="4">
                                            <Label htmlFor="text-input">Dept</Label>
                                        </Col>
                                        <Col xs="12" md="8">
                                            <Input disabled type="text" value={this.state.taskDetail.dept} id="text-input" name="text-input" placeholder="Text" />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="4">
                                            <Label htmlFor="text-input">Chop Type</Label>
                                        </Col>
                                        <Col xs="12" md="8">
                                            <Input disabled type="text" id="text-input" value={this.state.taskDetail.chopTypeName} name="text-input" placeholder="Text" />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="4">
                                            <Label htmlFor="text-input">Document Name</Label>
                                        </Col>
                                        <Col xs="12" md="8">
                                            <Input disabled type="text" id="text-input" value={this.state.taskDetail.documentName} name="text-input" placeholder="Text" />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="4">
                                            <Label htmlFor="text-input">Use in Office or not</Label>
                                        </Col>
                                        <Col xs="12" md="8">
                                            <Input disabled type="text" id="text-input" value={this.state.taskDetail.useInOffice} name="text-input" placeholder="Text" />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="4">
                                            <Label htmlFor="text-input">Pick Up By</Label>
                                        </Col>
                                        <Col xs="12" md="8">
                                            <Input disabled type="text" id="text-input" value={this.state.taskDetail.pickUpBy} name="text-input" placeholder="Text" />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="4">
                                            <Label htmlFor="text-input">Confirm</Label>
                                        </Col>
                                        <Col xs="12" md="8">
                                            <Input disabled type="text" id="text-input" value={this.state.taskDetail.pickUpBy} name="text-input" placeholder="Text" />
                                        </Col>
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <FormGroup row>
                                        <Col md="4">
                                            <Label htmlFor="text-input">Tel</Label>
                                        </Col>
                                        <Col xs="12" md="8">
                                            <Input disabled type="text" value={this.state.taskDetail.telNumber} id="text-input" name="text-input" placeholder="Text" />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="4">
                                            <Label htmlFor="text-input">Application Type</Label>
                                        </Col>
                                        <Col xs="12" md="8">
                                            <Input disabled type="text" value={this.state.taskDetail.applicationTypeName} id="text-input" name="text-input" placeholder="Text" />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="4">
                                            <Label htmlFor="text-input">Purpose of Use</Label>
                                        </Col>
                                        <Col xs="12" md="8">
                                            <Input disabled type="text" value={this.state.taskDetail.purposeOfUse} id="text-input" name="text-input" placeholder="Text" />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="4">
                                            <Label htmlFor="text-input">Number of Pages to Be Chopped </Label>
                                        </Col>
                                        <Col xs="12" md="8">
                                            <Input disabled type="text" value={this.state.taskDetail.numOfPages} id="text-input" name="text-input" placeholder="Text" />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="4">
                                            <Label htmlFor="text-input">Address to</Label>
                                        </Col>
                                        <Col xs="12" md="8">
                                            <Input disabled type="text" value={this.state.taskDetail.addressTo} id="text-input" name="text-input" placeholder="Text" />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="4">
                                            <Label htmlFor="text-input">Remark (e.g. tel.)</Label>
                                        </Col>
                                        <Col xs="12" md="8">
                                            <Input disabled type="text" value={this.state.taskDetail.remark} id="text-input" name="text-input" placeholder="Text" />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="4">
                                            <Label htmlFor="text-input">Department Heads</Label>
                                        </Col>
                                        <Col xs="12" md="8">
                                            <Input disabled type="text" value={this.state.taskDetail.departmentHeadName} id="text-input" name="text-input" placeholder="Text" />
                                        </Col>
                                    </FormGroup>

                                </Col>
                            </Row>
                            <Row>
                                <Col> <h4>Comments</h4></Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Input type="textarea"></Input>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col  >
                                    <Button color="success" onClick={() => this.approve("approve")} >Approve</Button>&nbsp;
                                    <Button color="danger" onClick={() => this.approve("sendBack")} >Send Back</Button>&nbsp;
                                    <Button color="danger" onClick={() => this.approve("reject")}>Reject</Button>&nbsp;
                                    </Col>

                            </Row>
                            <Row><Col>
                                &nbsp;
         </Col></Row>
                            <Row>
                                <Col> <h4>Approval Histories</h4></Col>
                            </Row>
                            <Row className="bottom-border">&nbsp;</Row>
                            <Row>
                                <Col md="1">
                                    <img src={'../../assets/img/avatars/5.jpg'} className="img-avatar" alt="admin@bootstrapmaster.com" />
                                </Col>
                                <Col md="8">
                                    <h5>lastname, firstname (000)<span> <Badge color="success">Status</Badge></span></h5>
                                    <small>dd/mm/yyyy 00:00 AM</small>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Collapse>
                {/* </Col> */}

                {/* </Row> */}


            </div>
        )
    }
}
export default MyPendingTasks;
