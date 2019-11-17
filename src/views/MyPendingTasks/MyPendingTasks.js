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
    DetailCNIPS,
    EditDetails

} from './Details';
import Swal from 'sweetalert2';




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

            departments: [],
            applicationTypes: [],
            chopTypes: [],
            documents: [],
            deptHeads: [],

            filtered: [],

            showDoc: false,
            selectedDocs: [],
            dateView1: "",
            dateView2: "",

            editRequestForm: {
                engName: "",
                cnName: "",
                docSelected: null,
                docAttachedName: "",
                collapseUIO: true,
                isConnect: false,
            },

            requestForm: {},

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
            taskDetailId: "",
        }

        this.getPendingTasks = this.getPendingTasks.bind(this);
        this.search = this.search.bind(this)
        this.onFilteredChangeCustom = this.onFilteredChangeCustom.bind(this)
        this.togglCollapse = this.togglCollapse.bind(this);
        this.approve = this.approve.bind(this)
        this.addDocumentLTI = this.addDocumentLTI.bind(this);
        this.deleteDocument = this.deleteDocument.bind(this);
        this.handleSelectOption = this.handleSelectOption.bind(this);
        this.toggleUIO = this.toggleUIO.bind(this);
        this.getDeptHeads = this.getDeptHeads.bind(this);
        this.getData = this.getData.bind(this);
        this.selectDocument = this.selectDocument.bind(this);

    }
    togglCollapse() {
        this.setState({
            collapse: !this.state.collapse
        })
    }

    toggleUIO() {
        this.setState(state => {
            let editRequestForm = this.state.editRequestForm
            let requestForm = this.state.requestForm
            editRequestForm.collapseUIO = !editRequestForm.collapseUIO
            if (editRequestForm.collapseUIO) {
                requestForm.isUseInOffice = "Y"
            }
            else {
                requestForm.isUseInOffice = "N"
            }

            return { editRequestForm, requestForm }
        })
    }

    async componentDidMount() {
        await this.getData("applicationTypes", `${config.url}/apptypes`);
        await this.getData("chopTypes", `${config.url}/choptypes?companyid=${this.props.legalName}`);
        await this.getPendingTasks();
    }

    async getDeptHeads() {
        this.setState({ deptHeads: [] })
        await Axios.get(`${config.url}/users?companyid=${this.props.legalName}&excludeuserid=${localStorage.getItem('userId')}`)
            .then(res => {
                for (let i = 0; i < res.data.length; i++) {
                    const obj = { value: res.data[i].userId, label: res.data[i].displayName }
                    this.setState(state => {
                        const deptHeads = this.state.deptHeads.concat(obj)
                        return {
                            deptHeads
                        }
                    })
                }
            })
    }

    convertDate(dateValue){
        let regEx = dateValue.replace(/(\d{4})(\d{2})(\d{2})/g, '$1,$2,$3')
        return new Date(regEx);
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

    async getTaskDetails(id) {
        await this.getData("departments", `${config.url}/departments`)
        await this.getDeptHeads()
        await Axios.get(`${config.url}/tasks/${id}`)
            .then(res => {
                let temporary = res.data
                // temporary.departmentHeads = ["anthony@otds.admin", "aaron@otds.admin", "josh@otds.admin"]
                // temporary.applicationTypeId = "STU"
                // temporary.applicationTypeName = "Short-term Use"
                // temporary.effectivePeriod = "20131011"
                // this.setState({dateView2: temporary.returnDate, dateView1: temporary.effectivePeriod})
                if (temporary.applicationTypeId === "LTU") {
                    if (temporary.departmentId !== "" && temporary.chopTypeId !== "" && temporary.teamId !== "") {
                        this.getDocuments(this.props.legalName, temporary.departmentId, temporary.chopTypeId, temporary.teamId)
                    }
                }

                this.state.deptHeads.map((head, index) => {

                    if (head.value === temporary.responsiblePerson) {
                        temporary.responsiblePersonOption = index
                    }
                    if (head.value === temporary.pickUpBy) {
                        temporary.pickUpByOption = index
                    }
                    if (head.value === temporary.contractSignedByFirstPerson) {
                        temporary.contractSignedByFirstPersonOption = index
                    }
                    if (head.value === temporary.contractSignedBySecondPerson) {
                        temporary.contractSignedBySecondPersonOption = index
                    }
                    if (head.value === temporary.documentCheckBy) {
                        temporary.documentCheckByOption = index
                    }
                })
                this.setState({ requestForm: temporary })
                this.getData("chopTypes", `${config.url}/choptypes?companyid=${this.props.legalName}&apptypeid=${temporary.applicationTypeId}`);
            })
        this.setState({ collapse: true })

    }



    async getPendingTasks() {
        this.setState({ pendingTasks: [] })
        let url = `${config.url}/tasks?userid=${localStorage.getItem('userId')}&requestNum=${this.state.searchOption.requestNum}&applicationTypeName=${this.state.searchOption.applicationTypeName}&chopTypeName=${this.state.searchOption.chopTypeName}&departmentHeadName=${this.state.searchOption.departmentHeadName}&teamName=${this.state.searchOption.teamName}&documentCheckByName=${this.state.searchOption.documentCheckByName}&statusName=${this.state.searchOption.statusName}&createdDate=${this.state.searchOption.createdDate}&createdByName=${this.state.searchOption.createdByName}`
        await Axios.get(url)
            .then(res => {
                let result = res.data
                result.map(task => {
                    const obj = task
                    obj.docNameEngArray = task.documentNameEnglish
                    obj.docNameCnArray = task.documentNameChinese
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

    async getDocuments(companyId, deptId, chopTypeId, teamId) {
        let tempDocs = []

        let url = `${config.url}/documents?companyid=` + companyId + '&departmentid=' + deptId + '&choptypeid=' + chopTypeId + '&teamid=' + teamId;
        try {
            await Axios.get(url).then(res => {
                tempDocs = res.data
            })
        } catch (error) {
            console.error(error)
        }
        tempDocs.map((doc, index) => {
            const keys = Object.keys(doc)
            const obj = {}
            obj.id = index
            for (let i = 0; i < keys.length; i++) {
                if (keys[i] === "departmentHeads") {
                    let dhApproved = ""
                    doc.departmentHeads.map(dh => {
                        dhApproved = dhApproved + dh.displayName + '; '
                    })
                    obj.dhApproved = dhApproved
                }
                else if (keys[i] === "expiryDate") {
                    let tempDate = doc[keys[i]]
                    let expiryDate = ""
                    for (let p = 0; p < tempDate.length; p++) {
                        if (p === 4 || p === 6) {
                            expiryDate = expiryDate + '/'
                        }
                        expiryDate = expiryDate + tempDate[p]

                    }
                    obj[keys[i]] = expiryDate
                }
                else {
                    obj[keys[i]] = doc[keys[i]]
                }
            }
            this.setState(state => {
                const documents = state.documents.concat(obj)

                return {
                    documents
                }
            })
        })
    }

    selectDocument() {
        if (this.state.documents.length === 0) {
            Swal.fire({
                title: "No Documents",
                html: 'No documents to select from!',
                type: "warning"
            })
        }
        else {
            this.setState({ showDoc: !this.state.showDoc })

        }
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
        console.log(action + "" + this.state.taskDetailId)
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

    handleChange = name => event => {
        console.log(name + " + " + event.target.value)
        let value = event.target.value
        this.setState(state => {
            let requestForm = this.state.requestForm
            requestForm[name] = value
            return { requestForm };

        })
    }

    handleDocumentChange = name => event => {
        console.log(name + " + " + event.target.value)
        let value = event.target.value
        this.setState(state => {
            let editRequestForm = this.state.editRequestForm
            editRequestForm[name] = value
            return { editRequestForm };

        })
    }

    uploadDocument = event => {
        if (event.target.files[0]) {
            let file = event.target.files[0]
            let fileName = event.target.files[0].name
            this.setState(state => {
                let editRequestForm = this.state.editRequestForm
                editRequestForm.docSelected = file
                editRequestForm.docAttachedName = fileName
                return { editRequestForm }
            })
        }
    }

    addDocumentLTI() {
        var maxNumber = 45;
        var rand = Math.floor((Math.random() * maxNumber) + 1);
        if (this.state.editRequestForm.docSelected !== null) {
            const obj = {
                // documentId: "dd66ea7c-773e-4312-827a-8fd3437472be",
                requestId: "2efa8500-636a-495a-aaed-8140761df10a",
                documentName: this.state.editRequestForm.docAttachedName,
                documentCode: "",
                description: "",
                created: "",
                updated: "",
                documentType: "",
                documentUrl: URL.createObjectURL(this.state.editRequestForm.docSelected),
                expiryDate: null,
                departmentHeads: null,
                documentId: rand,
                documentNameEnglish: this.state.editRequestForm.engName,
                documentNameChinese: this.state.editRequestForm.cnName,
                docSelected: this.state.editRequestForm.docSelected
            }

            this.setState(state => {
                let requestForm = this.state.requestForm
                requestForm.documentNames.push(obj)
                return { requestForm }
            }, console.log(this.state.requestForm))
        }
    }

    addDocCheck(row) {
        this.setState({ selectedDocs: row })
    }

    deleteDocument(table, i) {
        this.setState(state => {
            if (table === "documentTableLTU") {
                let requestForm = this.state.requestForm
                requestForm.documentNames = requestForm.documentNames.filter((item, index) => i !== index)
                return { requestForm }
            }
            else if (table === "documentTableLTI") {
                let requestForm = this.state.requestForm
                requestForm.documentNames = requestForm.documentNames.filter((item, index) => i !== index)
                return { requestForm }
            }
        })
    }

    toggleConnection() {
        this.setState(state => {
            let requestForm = this.state.requestForm
            let editRequestForm = this.state.editRequestForm
            editRequestForm.isConnect = !editRequestForm.isConnect
            if (editRequestForm.isConnect) {
                requestForm.connectChop = "Y"
            }
            else {
                requestForm.connectChop = "N"
            }
            return { editRequestForm, requestForm }
        })
    }



    handleSelectOption = sname => newValue => {
        if (sname === "departmentHeads") {
            let value = []
            newValue.map(val => {
                value.push(val.value)
            })
            this.setState(state => {
                let requestForm = this.state.requestForm
                requestForm[sname] = value
                return { requestForm }
            })
        }
        else {
            this.setState(state => {
                let requestForm = this.state.requestForm
                this.state.deptHeads.map((head, index) => {
                    if (head.value === newValue.value) {
                        requestForm[sname + "Option"] = index
                    }
                })
                requestForm[sname] = newValue.value
                return { requestForm }
            })
        }
    }

    async handleAgreeTerm(event) {
        // await this.validate()
        // for (let i = 0; i < this.state.reqInfo.length; i++) {
        //     if (this.state.reqInfo[i].valid) {
        //         this.setState({ valid: true })
        //     }
        //     else {
        //         this.setState({ valid: false })
        //         break;
        //     }
        // }
        // if (this.state.valid && this.state.inOffice) {
        //     this.setState({ agreeTerms: true })
        // }
    }

    submitRequest(isSubmitted) {

    }

    dateChange = (name, view) => date => {
        let dates = date.toISOString().substr(0, 10);
        console.log(date)
        console.log(dates)
        this.setState({
            [view]: date
        });
        this.setState(state => {
            let requestForm = this.state.requestForm
            requestForm[name] = dates.replace(/-/g, "")
            return requestForm
        })
    };


    checkAppType() {
        let appType = this.state.requestForm.applicationTypeId
        let status = this.state.requestForm.currentStatusId
        if (status === "DRAFT" || status === "RECALL" || status === "SENDBACK") {

            return <EditDetails
                legalName={this.props.legalName}
                departments={this.state.departments}
                appTypes={this.state.applicationTypes}
                chopTypes={this.state.chopTypes}
                collapse={this.togglCollapse}
                requestForm={this.state.requestForm}
                documents={this.state.documents}
                editRequestForm={this.state.editRequestForm}
                handleChange={this.handleChange}
                handleDocumentChange={this.handleDocumentChange}
                selectDocument={this.selectDocument}
                showDoc={this.state.showDoc}
                uploadDocument={this.uploadDocument}
                addDocumentLTI={this.addDocumentLTI}
                deleteDocument={this.deleteDocument}
                toggleConnection={this.toggleConnection}
                toggleUIO={this.toggleUIO}
                deptHeads={this.state.deptHeads}
                handleSelectOption={this.handleSelectOption}
                handleAgreeTerm={this.handleAgreeTerm}
                submitRequest={this.submitRequest}
                addDocCheck={this.addDocCheck}
                dateView1={this.state.dateView1}
                dateView2={this.state.dateView2}
                dateChange={this.dateChange} />
        }
        else {
            switch (appType) {
                case 'STU':
                    return <DetailSTU
                        legalName={this.props.legalName}
                        taskDetail={this.state.requestForm}
                        collapse={this.togglCollapse}
                        approve={this.approve} />
                        ;
                case 'LTU':
                    return <DetailLTU
                        taskDetail={this.state.requestForm}
                        collapse={this.togglCollapse}
                        approve={this.approve} />
                        ;
                case 'LTI':
                    return <DetailLTI
                        taskDetail={this.state.requestForm}
                        collapse={this.togglCollapse}
                        approve={this.approve} />
                        ;
                case 'CNIPS':
                    return <DetailCNIPS
                        taskDetail={this.state.requestForm}
                        collapse={this.togglCollapse}
                        approve={this.approve} />
                        ;
            }
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

                                                this.getTaskDetails(rowInfo.original.requestId)
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
                    {this.checkAppType()}
                </Collapse>
                {/* </Col> */}

                {/* </Row> */}


            </div>
        )
    }
}
export default MyPendingTasks;
