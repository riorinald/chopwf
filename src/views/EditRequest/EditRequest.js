import React, { Component } from 'react';
import {
    Card, CardBody, CardHeader, Table, Col, Row, CardFooter,
    Input,
    Button,
    FormGroup,
    Label,
    Progress,
    Badge,
    Collapse,
    Form, InputGroup, InputGroupAddon, InputGroupText, FormFeedback,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    CustomInput,
} from 'reactstrap';
import config from '../../config';
import Axios from 'axios';
import { Redirect } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { addDays } from 'date-fns';
import ReactDataGrid from 'react-data-grid';
import InputMask from "react-input-mask";
import deleteBin from '../../assets/img/deletebin.png'
import { AppSwitch } from '@coreui/react';
import AsyncSelect from 'react-select/async';
import makeAnimated from 'react-select/animated';
import Swal from 'sweetalert2';
import ReactTable from "react-table";
import "react-table/react-table.css"
import selectTableHOC from "react-table/lib/hoc/selectTable";
import PropTypes from "prop-types";
import { resetMounted } from '../MyPendingTasks/MyPendingTasks';



const SelectTable = selectTableHOC(ReactTable);



const notes = <p>如您需申请人事相关的证明文件包括但不限于“在职证明”，“收入证明”，“离职证明”以及员工福利相关的申请材料等，请直接通过邮件提交您的申请至人力资源部。如对申请流程有任何疑问或问题，请随时联系HR。
  For HR related certificates including but not limited to the certificates of employment, income, resignation and benefits-related application materials, please submit your requests to HR department by email directly.
  If you have any questions regarding the application process, please feel free to contact HR. </p>;

const reactSelectControl = {
    control: styles => ({ ...styles, borderColor: '#F86C6B', boxShadow: '0 0 0 0px #F86C6B', ':hover': { ...styles[':hover'], borderColor: '#F86C6B' } }),
    menuPortal: base => ({ ...base, zIndex: 9999 })
}

const animatedComponents = makeAnimated();

class EditRequest extends Component {
    static defaultProps = {
        keyField: "documentId"
    };

    static propTypes = {
        keyField: PropTypes.string
    };
    constructor(props) {
        super(props)
        this.state = {
            selectAll: false,
            selection: [],

            taskDetails: {
                taskId: "",
                requestNum: "",
                employeeName: "",
                employeeNum: "",
                email: "",
                telephoneNum: "",
                departmentId: "",
                departmentName: "",
                chopTypeId: "",
                chopTypeName: " ",
                branchId: "",
                branchName: "",
                applicationTypeId: "",
                applicationTypeName: " ",
                documentNames: [],
                purposeOfUse: "",
                connectChop: "",
                numOfPages: "",
                isUseInOffice: "",
                returnDate: "",
                responsiblePerson: "",
                addressTo: "",
                pickUpBy: "",
                remark: "",
                departmentHeads: [],
                contractSignedByFirstPerson: "",
                contractSignedByFirstPersonName: "",
                contractSignedBySecondPerson: "",
                contractSignedBySecondPersonName: " ",
                documentCheckBy: "",
                documentCheckByName: "",
                isConfirm: "",
                newReturnDate: "",
                reasonForExtension: "",
                currentStatusId: "",
                currentStatusName: "",
                nextStatusId: "",
                nextStatusName: "",
                teamId: "",
                teamName: "",
                effectivePeriod: ""
            },

            editRequestForm: {
                engName: "",
                cnName: "",
                docSelected: null,
                docAttachedName: "",
                collapseUIO: true,
                isConnect: false,
            },

            editData: { documentNames: [] },

            showDoc: false,
            selectedDocs: [],

            redirectToPendingTasks: false,
            deptHeads: [],
            selectedDeptHeads: [],
            dateView1: "",
            dateView2: "",
            departments: [],
            chopTypes: [],
            documents: [],
        }
        this.getTaskDetails = this.getTaskDetails.bind(this);
        this.redirectToPendingTasks = this.redirectToPendingTasks.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleDocumentChange = this.handleDocumentChange.bind(this);
        this.toggleConnection = this.toggleConnection.bind(this);
        this.toggleUIO = this.toggleUIO.bind(this);
        // this.addDocCheck = this.addDocCheck.bind(this);
        this.addDocumentLTI = this.addDocumentLTI.bind(this);
        this.addDocumentLTU = this.addDocumentLTU.bind(this);
        this.getDocuments = this.getDocuments.bind(this);
        this.selectDocument = this.selectDocument.bind(this);
        this.handleAgreeTerm = this.handleAgreeTerm.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
    }

    componentDidMount() {
        this.getDeptHeads()
        if (this.props.location.state !== undefined) {
            this.getTaskDetails(this.props.location.state.id)
        }
        // console.log(this.state.taskDetails.applicationTypeId)
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

    async deleteTask() {
        Swal.fire({
            title: "REQUEST DELETED",
            html: 'The request has been deleted',
            type: "success",
            onClose: () => { this.setState({ redirectToPendingTasks: true }) }
        })

    }

    convertExpDate(dateValue) {
        let regEx = dateValue.replace(/(\d{4})(\d{2})(\d{2})/g, '$1/$2/$3')
        return regEx;
    }

    convertDate(dateValue, view) {
        let regEx = dateValue.replace(/(\d{4})(\d{2})(\d{2})/g, '$1,$2,$3')
        this.setState({ [view]: new Date(regEx) })
        // return new Date(regEx);
    }

    getOption(person) {
        let i = 0
        // console.log(this.state.deptHeads)
        this.state.deptHeads.map((head, index) => {
            if (head.value === person) {
                i = index
            }
        })
        return i
    }


    async getTaskDetails(id) {
        let temporary = ""
        await Axios.get(`${config.url}/tasks/${id}?userid=${localStorage.getItem('userId')}`)
            .then(res => {
                temporary = res.data
            })
        // temporary.applicationTypeId = "LTU"
        // temporary.effectivePeriod = "20191130"
        // console.log(temporary.effectivePeriod)

        temporary.returnDate = temporary.returnDate !== "" ? this.convertDate(temporary.returnDate, 'dateView2') : ""

        temporary.responsiblePersonOption = this.getOption(temporary.responsiblePerson)
        temporary.pickUpByOption = this.getOption(temporary.pickUpBy)
        // console.log(this.getOption(temporary.pickUpBy))
        if (temporary.applicationTypeId === "CNIPS") {
            temporary.contractSignedByFirstPersonOption = this.getOption(temporary.contractSignedByFirstPerson)
            temporary.contractSignedBySecondPersonOption = this.getOption(temporary.contractSignedBySecondPerson)
        }
        else if (temporary.applicationTypeId === "LTU") {
            temporary.effectivePeriod = temporary.effectivePeriod !== "" ? this.convertDate(temporary.effectivePeriod, 'dateView1') : null
            temporary.documentCheckByOption = this.getOption(temporary.documentCheckBy)
        }

        this.setState(state => {
            let editRequestForm = this.state.editRequestForm
            editRequestForm.collapseUIO = temporary.isUseInOffice === "Y" ? true : false
        })
        this.setSelectedDeptHead(temporary.departmentHeads)

        await this.getData("departments", `${config.url}/departments`)
        await this.getData("chopTypes", `${config.url}/choptypes?companyid=${this.props.legalName}&apptypeid=${temporary.applicationTypeId}`);
        // if (temporary.applicationTypeId === "LTU") {

        //     //remove this - only for dev
        //     this.getDocuments(this.props.legalName, temporary.departmentId, temporary.chopTypeId, temporary.teamId)
        //     //

        //     if (temporary.departmentId !== "" && temporary.chopTypeId !== "" && temporary.teamId !== "") {
        //         this.getDocuments(this.props.legalName, temporary.departmentId, temporary.chopTypeId, temporary.teamId)
        //     }
        // }
        this.setState({ taskDetails: temporary })
    }

    changeDeptHeads(heads) {
        let dh = ""
        heads.map(head => {
            dh = dh + head + "; "
        })
        return dh
    }


    async getDocuments(companyId, deptId, chopTypeId, teamId) {

        //change to 2nd URL -  1st URL for dev
        let url = `${config.url}/documents?companyid=mbafc&departmentid=itafc&choptypeid=comchop&teamid=mbafcit`
        //

        // let url = `${config.url}/documents?companyid=` + companyId + '&departmentid=' + deptId + '&choptypeid=' + chopTypeId + '&teamid=' + teamId;
        try {
            await Axios.get(url).then(res => {
                this.setState({ documents: res.data })
            })
        } catch (error) {
            console.error(error)
        }
    }

    redirectToPendingTasks() {
        this.setState({ redirectToPendingTasks: true })
    }

    filterColors = (inputValue) => {
        return this.state.deptHeads.filter(i =>
            i.label.toLowerCase().includes(inputValue.toLowerCase())
        );
    };

    loadOptionsDept = (inputValue, callback) => {
        callback(this.filterColors(inputValue));

    }

    setSelectedDeptHead(deptHeads) {
        let selected = deptHeads
        selected.map(select => {
            let temp = ""
            for (let i = 0; i < this.state.deptHeads.length; i++) {
                if (select === this.state.deptHeads[i].value) {
                    temp = this.state.deptHeads[i]
                    this.setState(state => {
                        const selectedDeptHeads = this.state.selectedDeptHeads.concat(temp)
                        return {
                            selectedDeptHeads
                        }
                    })
                    break;
                }
            }
        })
    }

    handleChange = name => event => {
        // console.log(name + " + " + event.target.value)
        let value = event.target.value
        this.setState(state => {
            let taskDetails = this.state.taskDetails
            let editData = this.state.editData
            taskDetails[name] = value
            editData[name] = value
            return { taskDetails, editData };

        })
    }

    handleDocumentChange = name => event => {
        // console.log(name + " + " + event.target.value)
        let value = event.target.value
        this.setState(state => {
            let editRequestForm = this.state.editRequestForm
            editRequestForm[name] = value
            return { editRequestForm };

        })
    }

    toggleUIO() {
        this.setState(state => {
            let editRequestForm = this.state.editRequestForm
            let taskDetails = this.state.taskDetails
            let editData = this.state.editData
            editRequestForm.collapseUIO = !editRequestForm.collapseUIO
            if (editRequestForm.collapseUIO) {
                taskDetails.isUseInOffice = "Y"
                editData.isUseInOffice = "Y"
            }
            else {
                taskDetails.isUseInOffice = "N"
                editData.isUseInOffice = "N"
            }

            return { editRequestForm, taskDetails, editData }
        })
    }

    uploadDocument = event => {
        if (event.target.files[0]) {
            let file = event.target.files[0]
            console.log(file)
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
        var tempDate = new Date();
        var date = tempDate.getDate() + '/' + (tempDate.getMonth() + 1) + '/' + tempDate.getFullYear() + ' ' + tempDate.getHours() + ':' + tempDate.getMinutes() + ':' + tempDate.getSeconds();
        console.log(this.state.editRequestForm.docSelected)
        if (this.state.editRequestForm.docSelected !== null) {
            const obj = {
                // documentId: "dd66ea7c-773e-4312-827a-8fd3437472be",
                taskId: this.state.taskDetails.taskId,
                documentName: this.state.editRequestForm.docAttachedName,
                documentCode: "",
                contractNumber: this.state.editRequestForm.contractNum,
                description: "",
                created: date,
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
                let taskDetails = this.state.taskDetails
                let editData = this.state.editData
                taskDetails.documentNames.push(obj)
                // editData.documentNames = []
                editData.documentNames.push(obj)
                return { taskDetails, editData }
            })
        }
    }
    addDocumentLTU() {
        this.state.selectedDocs.map(doc => {
            this.setState(state => {
                let editData = this.state.editData
                let taskDetails = this.state.taskDetails
                taskDetails.documentNames = taskDetails.documentNames.concat(doc)
                // editData.documentNames = []
                editData.documentNames = editData.documentNames.concat(doc)
                return { taskDetails, editData }
            })
        })
    }

    // addDocCheck(row) {
    //     this.setState({ selectedDocs: row })
    // console.log(row)
    // console.log(index)
    // let checked = false
    // this.setState(state => {
    //     // const documents = state.documents.map(doc=>{

    //     // })
    //     let documents = state.documents
    //     documents[index].isChecked = !state.documents[index].isChecked
    //     if (documents[index].isChecked) {
    //         checked = true
    //     }
    //     else {
    //         checked = false
    //     }
    //     return documents
    // })
    // if (checked) {
    //     this.setState({ selectedDocs: row }, console.log(this.state.selectedDocs))
    // }
    // else {
    //     this.setState({ selectedDocs: [] }, console.log(this.state.selectedDocs))
    // }

    // }

    deleteDocument(table, i) {
        this.setState(state => {
            if (table === "documentTableLTU") {
                let taskDetails = this.state.taskDetails
                let editData = this.state.editData
                taskDetails.documentNames = taskDetails.documentNames.filter((item, index) => i !== index)
                editData.documentNames = editData.documentNames.filter((item, index) => i !== index)
                return { taskDetails, editData }
            }
            else if (table === "documentTableLTI") {
                let taskDetails = this.state.taskDetails
                let editData = this.state.editData
                taskDetails.documentNames = taskDetails.documentNames.filter((item, index) => i !== index)
                editData.documentNames = editData.documentNames.filter((item, index) => i !== index)
                return { taskDetails, editData }
            }
        })
    }

    toggleConnection() {
        this.setState(state => {
            let taskDetails = this.state.taskDetails
            let editData = this.state.editData
            let editRequestForm = this.state.editRequestForm
            editRequestForm.isConnect = !editRequestForm.isConnect
            if (editRequestForm.isConnect) {
                taskDetails.connectChop = "Y"
                editData.connectChop = "Y"
            }
            else {
                taskDetails.connectChop = "N"
                editData.connectChop = "N"
            }
            return { editRequestForm, taskDetails, editData }
        })
    }



    handleSelectOption = sname => newValue => {
        if (sname === "departmentHeads") {
            let value = []
            this.setState({ selectedDeptHeads: newValue })
            if (newValue) {
                newValue.map(val => {
                    value.push(val.value)
                })
            }
            // console.log(value)
            this.setState(state => {
                let taskDetails = this.state.taskDetails
                let editData = this.state.editData
                taskDetails[sname] = value
                editData[sname] = value
                return { taskDetails, editData }
            })
        }
        else {
            this.setState(state => {
                let taskDetails = this.state.taskDetails
                let editData = this.state.editData
                this.state.deptHeads.map((head, index) => {
                    if (head.value === newValue.value) {
                        taskDetails[sname + "Option"] = index
                    }
                })
                taskDetails[sname] = newValue.value
                editData[sname] = newValue.value
                return { taskDetails, editData }
            })
        }
    }

    dateChange = (name, view) => date => {
        let dates = date.toISOString().substr(0, 10);
        // console.log(date)
        // console.log(dates)
        this.setState({
            [view]: date
        });
        this.setState(state => {
            let taskDetails = this.state.taskDetails
            let editData = this.state.editData
            taskDetails[name] = dates.replace(/-/g, "")
            editData[name] = dates.replace(/-/g, "")
            return { taskDetails, editData }
        })
    };

    async selectDocument() {
        await this.getDocuments(this.props.legalName, this.state.taskDetails.departmentId, this.state.taskDetails.chopTypeId, this.state.taskDetails.teamId)
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

    toggleSelection = (key, shift, row) => {
        // start off with the existing state
        let selection = [...this.state.selection];
        let selectedDocs = [...this.state.selectedDocs];
        const keyIndex = selection.indexOf(key);

        // check to see if the key exists
        if (keyIndex >= 0) {
            // it does exist so we will remove it using destructing
            selection = [
                ...selection.slice(0, keyIndex),
                ...selection.slice(keyIndex + 1)
            ];
            selectedDocs = [
                ...selectedDocs.slice(0, keyIndex),
                ...selectedDocs.slice(keyIndex + 1)
            ];
        } else {
            // it does not exist so add it
            selectedDocs.push(row)
            selection.push(key);
        }
        // update the state
        this.setState({ selection, selectedDocs });
    };

    /**
     * Toggle all checkboxes for select table
     */
    toggleAll = () => {
        const { keyField } = this.props;
        const selectAll = !this.state.selectAll;
        const selection = [];
        const selectedDocs = [];

        if (selectAll) {
            // we need to get at the internals of ReactTable
            const wrappedInstance = this.checkboxTable.getWrappedInstance();
            // the 'sortedData' property contains the currently accessible records based on the filter and sort
            const currentRecords = wrappedInstance.getResolvedState().sortedData;
            // we just push all the IDs onto the selection array
            currentRecords.forEach(item => {
                selection.push(`select-${item._original[keyField]}`);
                selectedDocs.push(item._original)
            });
        }
        this.setState({ selectAll, selection, selectedDocs }, console.log(this.state.selectedDocs));
    };

    /**
     * Whether or not a row is selected for select table
     */
    isSelected = key => {
        return this.state.selection.includes(`select-${key}`);
    };

    rowFn = (state, rowInfo, column, instance) => {
        const { selection } = this.state;

        return {
            onClick: (e) => {
                console.log("It was in this row:", rowInfo);
            },
            style: {
                background:
                    rowInfo &&
                    selection.includes(`select-${rowInfo.original.documentId}`)
            }
        };
    };

    async postData(formData, isSubmitted) {
        let url = `${config.url}/tasks/${this.props.location.state.id}`
        await Axios.put(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then(res => {
                if (isSubmitted === 'N') {
                    Swal.fire({
                        title: res.data.status,
                        text: 'Request Saved ',
                        footer: 'Your request is saved as a draft',
                        type: 'info',
                        onClose: () => {
                            this.setState({ redirectToPendingTasks: true })
                            // this.props.history.push('/mypendingtask')
                        }
                    })

                }
                if (isSubmitted === 'Y') {
                    Swal.fire({
                        title: res.data.status,
                        text: 'Request Submitted',
                        footer: 'Your request is being processed and is waiting for the approval',
                        type: 'success',
                        onClose: () => {
                            // this.props.history.push('/mypendingtask')
                            this.setState({ redirectToPendingTasks: true })
                        }

                    })

                }
            })
            .catch(error => {
                let stat = error.response.data.status !== "failed"
                let msg = ""
                if (stat) {
                    let keys = Object.keys(error.response.data.errors)
                    keys.map((key, index) => {
                        msg = index + 1 + '.' + ' ' + msg + error.response.data.errors[key]
                    })
                }
                else {
                    msg = "Validation Errors occured"
                }
                Swal.fire({
                    title: stat ? error.response.data.title : "ERROR",
                    text: msg,
                    type: 'error'
                })
            })
        // } catch (error) {
        //     console.log()
        //     Swal.fire({
        //         title: "ERROR",
        //         text: error,
        //         type: 'error',
        //     })
        //     // console.log(error);
        // }
    }

    async handleAgreeTerm(event) {


    }

    async submitRequest(isSubmitted) {

        let returnDate = this.state.taskDetails.returnDate === undefined ? "00010101" : this.state.taskDetails.returnDate

        let userId = localStorage.getItem('userId')
        let postReq = new FormData();
        postReq.append("UserId", userId);
        postReq.append("EmployeeNum", this.state.taskDetails.employeeNum);
        postReq.append("TelephoneNum", this.state.taskDetails.telephoneNum);
        postReq.append("CompanyId", this.props.legalName);
        postReq.append("DepartmentId", this.state.taskDetails.departmentId);
        postReq.append("ApplicationTypeId", this.state.taskDetails.applicationTypeId);
        postReq.append("ContractNum", "");
        postReq.append("ChopTypeId", this.state.taskDetails.chopTypeId);
        postReq.append("TeamId", this.state.taskDetails.teamId);
        postReq.append("PurposeOfUse", this.state.taskDetails.purposeOfUse);
        postReq.append("NumOfPages", this.state.taskDetails.numOfPages);
        postReq.append("IsUseInOffice", this.state.taskDetails.isUseInOffice);
        postReq.append("AddressTo", this.state.taskDetails.addressTo);
        postReq.append("PickUpBy", this.state.taskDetails.pickUpBy);
        postReq.append("Remark", this.state.taskDetails.remark);
        postReq.append("IsConfirmed", this.state.taskDetails.isConfirm);
        postReq.append("ReturnDate", returnDate);
        postReq.append("ResponsiblePerson", this.state.taskDetails.responsiblePerson);
        postReq.append("ContracySignedByFirstPerson", this.state.taskDetails.contractSignedByFirstPerson);
        postReq.append("ContractSignedBySecondPerson", this.state.taskDetails.contractSignedBySecondPerson);
        postReq.append("EffectivePeriod", this.state.taskDetails.effectivePeriod);
        postReq.append("IsSubmitted", isSubmitted);
        postReq.append("isConnectChop", this.state.taskDetails.connectChop);
        postReq.append("BranchId", this.state.taskDetails.branchId)
        postReq.append("DocumentCheckBy", this.state.taskDetails.documentCheckBy)
        // postReq.append(`DocumentIds[0]`, "");


        if (this.state.taskDetails.applicationTypeId === "LTU") {
            for (let i = 0; i < this.state.taskDetails.documentNames.length; i++) {
                postReq.append(`DocumentIds[${i}]`, this.state.taskDetails.documentNames[i].documentId);
            }
        }
        else {
            for (let i = 0; i < this.state.taskDetails.documentNames.length; i++) {
                if (this.state.taskDetails.documentNames[i].documentId.length === 36) {
                    postReq.append(`DocumentIds[${i}]`, this.state.taskDetails.documentNames[i].documentId)
                }
                else {
                    let documentSelected = this.state.taskDetails.documentNames[i].docSelected !== undefined ? this.state.taskDetails.documentNames[i].docSelected : {}
                    postReq.append(`Documents[${i}].Attachment.File`, documentSelected);
                    postReq.append(`Documents[${i}].DocumentNameEnglish`, this.state.taskDetails.documentNames[i].documentNameEnglish);
                    postReq.append(`Documents[${i}].DocumentNameChinese`, this.state.taskDetails.documentNames[i].documentNameChinese);
                }


            }

        }
        //multiple dept. Heads
        for (let i = 0; i < this.state.taskDetails.departmentHeads.length; i++) {
            postReq.append(`DepartmentHeads[${i}]`, this.state.taskDetails.departmentHeads[i]);
        }

        for (var pair of postReq.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }


        if (isSubmitted === "N") {
            this.postData(postReq, isSubmitted)
            resetMounted.setMounted()
        }
        else {
            //if all valid = isConfirmed || All Fields are filled
            // console.log(this.state.taskDetails)
            this.postData(postReq, isSubmitted)
            resetMounted.setMounted()
        }
    }




    render() {
        const { redirectToPendingTasks, taskDetails, dateView1, deptHeads, selectedDeptHeads, editRequestForm } = this.state

        return (
            <div>
                {this.props.location.state === undefined
                    ? <Redirect to={'/mypendingtask'} />
                    // this.props.history.push('/mypendingtask')
                    : <Card className="animated fadeIn">
                        <CardHeader>
                            <Button onClick={this.redirectToPendingTasks}>Back</Button> &nbsp;
                             EDIT REQUEST - {taskDetails.requestNum}
                        </CardHeader>
                        <CardBody color="dark">
                            <FormGroup>
                                <h5>NOTES :</h5>
                                {notes}
                            </FormGroup>
                            <Form className="form-horizontal">
                                <FormGroup>
                                    <Label>Request Number</Label>
                                    <InputGroup>
                                        <Input disabled value={taskDetails.requestNum}></Input>
                                    </InputGroup>
                                </FormGroup>
                                <FormGroup>
                                    <Label>Employee Number
                        <span> <i> &ensp; Requestor of chop usage needs to be permanent staff. Intern or external staff's application will NOT be accepted</i> </span>
                                    </Label>
                                    <div className="controls">
                                        <InputGroup className="input-prepend">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>ID</InputGroupText>
                                            </InputGroupAddon>
                                            <Input disabled id="prependedInput" value={taskDetails.employeeNum} size="16" type="text" />
                                        </InputGroup>
                                        {/* <p className="help-block">Here's some help text</p> */}
                                    </div>
                                </FormGroup>
                                <FormGroup>
                                    <Label>Tel. </Label>
                                    <InputGroup>
                                        <Input onChange={this.handleChange("telephoneNum")} value={taskDetails.telephoneNum} id="appendedInput" size="16" type="text" />
                                    </InputGroup>
                                </FormGroup>
                                <FormGroup>
                                    <Label>Dept</Label>
                                    <Input id="deptSelected" type="select" value={taskDetails.departmentId} onChange={this.handleChange("departmentId")} name="dept">
                                        {this.state.departments.map((option, index) => (
                                            <option value={option.deptId} key={option.deptId}>
                                                {option.deptName}

                                            </option>
                                        ))}
                                    </Input>
                                    <FormFeedback>Invalid Departement Selected</FormFeedback>
                                </FormGroup>
                                <FormGroup>
                                    <Label>Application Type</Label>
                                    <Input disabled type="text"
                                        id="appTypeSelected" value={taskDetails.applicationTypeName} name="appType">
                                    </Input>
                                </FormGroup>

                                {taskDetails.applicationTypeId === "LTU"
                                    ? <FormGroup>
                                        <Label>Effective Period</Label>
                                        {/* <Input type="date" onChange={this.handleChange("effectivePeriod")} id="effectivePeriod"></Input> */}
                                        <DatePicker id="effectivePeriod" placeholderText="YYYY/MM/DD" popperPlacement="auto-center" showPopperArrow={false} todayButton="Today"
                                            className="form-control" required dateFormat="yyyy/MM/dd" withPortal
                                            peekNextMonth
                                            showMonthDropdown
                                            showYearDropdown
                                            selected={dateView1}
                                            onChange={this.dateChange("effectivePeriod", "dateView1")}
                                            minDate={new Date()} maxDate={addDays(new Date(), 365)} />
                                        <FormFeedback>Invalid Date Selected</FormFeedback>
                                    </FormGroup>
                                    : ""
                                }
                                <FormGroup>
                                    <Label>Chop Type</Label>
                                    <Input type="select" id="chopTypeSelected"
                                        // onClick={() => { props.getChopTypes(props.legalName, props.taskDetails.appTypeSelected) }}
                                        onChange={this.handleChange("chopTypeId")} value={taskDetails.chopTypeId} name="chopType" >
                                        {this.state.chopTypes.map((option, id) => (
                                            <option key={option.chopTypeId} value={option.chopTypeId}>{option.chopTypeName}</option>
                                        ))}

                                    </Input>
                                    <FormFeedback>Invalid Chop Type Selected</FormFeedback>
                                </FormGroup>


                                <FormGroup check={false}>
                                    <Label>Document Name</Label>
                                    {taskDetails.applicationTypeId === "LTU"
                                        ? <div>
                                            <InputGroup >
                                                <InputGroupAddon addonType="prepend">
                                                    <Button color="primary" onClick={this.selectDocument}>Select Documents</Button>
                                                </InputGroupAddon>
                                                <Input id="documentTableLTU" disabled />
                                                <FormFeedback>Invalid Input a valid Document Name</FormFeedback>
                                            </InputGroup>
                                            <Modal color="info" size="xl" toggle={this.selectDocument} isOpen={this.state.showDoc} >
                                                <ModalHeader className="center"> Select Documents </ModalHeader>
                                                <ModalBody>
                                                    <SelectTable
                                                        {...this.props}
                                                        data={this.state.documents}
                                                        ref={r => (this.checkboxTable = r)}
                                                        toggleSelection={this.toggleSelection}
                                                        selectAll={this.state.selectAll}
                                                        // selectType="checkbox"
                                                        toggleAll={this.toggleAll}
                                                        isSelected={this.isSelected}
                                                        getTrProps={this.rowFn}
                                                        defaultPageSize={5}
                                                        columns={[
                                                            {
                                                                Header: 'Document Name (English)',
                                                                accessor: 'documentNameEnglish',
                                                                style: { textAlign: "center" },
                                                            },
                                                            {
                                                                Header: 'Document Name (Chinese)',
                                                                accessor: 'documentNameChinese',
                                                                style: { textAlign: "center" },
                                                            },
                                                            {
                                                                Header: 'Expiry Date',
                                                                accessor: 'expiryDate',
                                                                Cell: row => (
                                                                    <div> {this.convertExpDate(row.original.expiryDate)} </div>
                                                                ),
                                                                style: { textAlign: "center" },
                                                            },
                                                            {
                                                                Header: 'DH Approved',
                                                                accessor: 'departmentHeads',
                                                                Cell: row => (
                                                                    <div> {this.changeDeptHeads(row.original.departmentHeads)} </div>
                                                                ),
                                                                style: { textAlign: "center" },
                                                            },
                                                        ]}
                                                        keyField="documentId"

                                                    />
                                                </ModalBody>
                                                <ModalFooter>
                                                    <Button color="primary" block size="md" onClick={() => { this.addDocumentLTU(); this.selectDocument() }}>  Add </Button>
                                                </ModalFooter>
                                            </Modal>

                                            <Collapse isOpen={taskDetails.documentNames.length !== 0}>
                                                <div>
                                                    <br />
                                                    <Label>Documents</Label>
                                                    <Table bordered>
                                                        <thead>
                                                            <tr>
                                                                <th>No.</th>
                                                                <th>Document Name (English)</th>
                                                                <th>Document Name (Chinese)</th>
                                                                <th>Expiry Date</th>
                                                                <th>DH Approved</th>
                                                                <th></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {taskDetails.documentNames.map((document, index) =>
                                                                <tr key={index}>
                                                                    <th>{index + 1}</th>
                                                                    <th>{document.documentNameEnglish}</th>
                                                                    <th>{document.documentNameChinese}</th>
                                                                    <th id="viewDoc">
                                                                        <a href={document.documentUrl} target='_blank' rel="noopener noreferrer">{this.convertExpDate(document.expiryDate)}</a>
                                                                    </th>
                                                                    <th id="viewDoc">
                                                                        <a href={document.documentUrl} target='_blank' rel="noopener noreferrer">{this.changeDeptHeads(document.departmentHeads)}</a>
                                                                    </th>
                                                                    <th><img width="25px" onClick={() => this.deleteDocument("documentTableLTU", index)} src={deleteBin} /></th>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </Table>
                                                </div>
                                            </Collapse>
                                        </div>
                                        : <div id="documentTableLTI">
                                            <Row form>

                                                {taskDetails.applicationTypeId === "CNIPS"
                                                    ? <Col ><FormGroup>
                                                        <InputMask placeholder="enter contract number" mask="*-*-*-9999-9999" className="form-control" defaultValue={taskDetails.contractNum} onChange={this.handleDocumentChange("contractNum")}></InputMask>
                                                    </FormGroup></Col>
                                                    : ""}

                                                <Col md>
                                                    <FormGroup>
                                                        {/* <Label>English Name</Label> */}
                                                        <Input value={editRequestForm.engName} onChange={this.handleDocumentChange("engName")} type="text" name="textarea-input" id="docName" rows="3" placeholder="please describe in English" />
                                                    </FormGroup>
                                                </Col>
                                                <Col md>
                                                    <FormGroup>
                                                        {/* <Label>Chinese Name</Label> */}
                                                        <Input value={editRequestForm.cnName} onChange={this.handleDocumentChange("cnName")} type="text" name="textarea-input" id="cnName" rows="3" placeholder="please describe in Chinese" />
                                                    </FormGroup>
                                                </Col>
                                                <Col md>
                                                    <FormGroup>
                                                        {/* <Label>File Name</Label> */}
                                                        <CustomInput id="docFileName" onChange={this.uploadDocument} type="file" bsSize="lg" color="primary" label={editRequestForm.docAttachedName} />
                                                    </FormGroup>
                                                </Col>
                                                <Col xl={1}>
                                                    <FormGroup>
                                                        {/* <Label></Label> */}
                                                        <Button block onClick={this.addDocumentLTI}>Add</Button>
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Collapse isOpen={taskDetails.documentNames.length !== 0}>
                                                <div>
                                                    <table>
                                                        <thead>
                                                            <tr>
                                                                <th className="smallTd" >No.</th>
                                                                {taskDetails.applicationTypeId === "CNIPS" ? <th>Contract Number</th> : null}
                                                                <th>Document Name in English</th>
                                                                <th>Document Name in Chinese</th>
                                                                <th>Attached File</th>
                                                                <th className="smallTd"></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {taskDetails.documentNames.map((document, index) =>
                                                                <tr key={index}>
                                                                    <td className="smallTd">{index + 1}</td>
                                                                    {taskDetails.applicationTypeId === "CNIPS" ? <td> {document.contractNum} </td> : null}
                                                                    <td>{document.documentNameEnglish}</td>
                                                                    <td>{document.documentNameChinese}</td>
                                                                    <td id="viewDoc">
                                                                        <a href={document.documentUrl} target='_blank' rel="noopener noreferrer">{document.documentFileName}</a>
                                                                    </td>
                                                                    <td className="smallTd"><img width="25px" onClick={() => this.deleteDocument("documentTableLTI", index)} src={deleteBin} /></td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </Collapse>
                                        </div>}
                                </FormGroup>
                                <FormGroup>
                                    <Label>Purpose of Use</Label>
                                    <InputGroup>
                                        <Input onChange={this.handleChange("purposeOfUse")} value={taskDetails.purposeOfUse} placeholder="Enter the Purpose of Use" type="textarea" name="textarea-input" id="purposeOfUse" rows="3" />
                                        <FormFeedback>Please input the purpose of use</FormFeedback>
                                    </InputGroup>
                                </FormGroup>

                                {!taskDetails.applicationTypeId === "LTI"
                                    ? <FormGroup>
                                        <Label>Connecting Chop (骑缝章) </Label>
                                        <Row />
                                        <AppSwitch dataOn={'yes'} onChange={this.toggleConnection} checked={taskDetails.connectChop === "Y"} dataOff={'no'} className={'mx-1'} variant={'3d'} color={'primary'} outline={'alt'} label></AppSwitch>
                                    </FormGroup>
                                    : ""}
                                <FormGroup>
                                    <Label>Number of Pages to Be Chopped</Label>
                                    <InputGroup>
                                        <Input onChange={this.handleChange("numOfPages")} value={taskDetails.numOfPages} id="numOfPages" size="16" type="number" min="0" />
                                        <FormFeedback>Invalid Number of pages </FormFeedback>
                                    </InputGroup>
                                </FormGroup>

                                <FormGroup>
                                    <Label>Use in Office or Not</Label>
                                    <Row />
                                    <AppSwitch onChange={this.toggleUIO} checked={taskDetails.isUseInOffice === "Y"} id="useOff" className={'mx-1'} variant={'3d'} color={'primary'} outline={'alt'} label dataOn={'yes'} dataOff={'no'} />
                                </FormGroup>
                                <Collapse isOpen={!editRequestForm.collapseUIO }>
                                    <FormGroup visibelity="false" >
                                        <Label>Return Date</Label>
                                        <Row />
                                        <DatePicker id="returnDate" placeholderText="YYYY/MM/DD" popperPlacement="auto-center" showPopperArrow={false} todayButton="Today"
                                            className="form-control" required dateFormat="yyyy/MM/dd" withPortal
                                            selected={this.state.dateView2}
                                            onChange={this.dateChange("returnDate", "dateView2")}
                                            minDate={new Date()} maxDate={addDays(new Date(), 365)} />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>Responsible Person <i className="fa fa-user" /></Label>
                                        <AsyncSelect id="resPerson"
                                            classNamePrefix="rs"
                                            loadOptions={this.loadOptionsDept}
                                            value={deptHeads[taskDetails.responsiblePersonOption]}
                                            onChange={this.handleSelectOption("responsiblePerson")}
                                            menuPortalTarget={document.body}
                                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                        />
                                    </FormGroup>
                                </Collapse>
                                <FormGroup>
                                    <Label>Address to</Label>
                                    <InputGroup>
                                        <Input onChange={this.handleChange("addressTo")} value={taskDetails.addressTo} type="textarea" name="textarea-input" id="addressTo" rows="5" placeholder="Documents will be addressed to" />
                                        <FormFeedback>Invalid person to address to</FormFeedback>
                                    </InputGroup>
                                </FormGroup>
                                <FormGroup>
                                    <Label>Pick Up By <i className="fa fa-user" /> </Label>
                                    <AsyncSelect
                                        id="pickUpBy"
                                        loadOptions={this.loadOptionsDept}
                                        value={deptHeads[taskDetails.pickUpByOption]}
                                        onChange={this.handleSelectOption("pickUpBy")}
                                        menuPortalTarget={document.body}
                                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                    />
                                    <InputGroup>
                                        <FormFeedback>Please enter a valid name to search</FormFeedback>
                                    </InputGroup>
                                </FormGroup>
                                <FormGroup>
                                    <Label>Remark</Label>
                                    <InputGroup>
                                        <Input onChange={this.handleChange("remark")} value={taskDetails.remark} id="remarks" size="16" type="textbox" placeholder="Please enter the remarks" />
                                        <FormFeedback>Please add remarks</FormFeedback>
                                    </InputGroup>
                                </FormGroup>

                                {taskDetails.applicationTypeId === "CNIPS"
                                    ? <FormGroup>
                                        <Label>Contract Signed By: <i className="fa fa-user" /></Label>
                                        <small> &ensp; Please fill in the DHs who signed the contract and keep in line with MOA; If for Direct Debit Agreements, Head of FGS and Head of Treasury are needed for approval</small>
                                        <Row>
                                            <Col>
                                                <AsyncSelect
                                                    id="contractSign1"
                                                    loadOptions={this.loadOptionsDept}
                                                    value={deptHeads[taskDetails.contractSignedByFirstPersonOption]}
                                                    onChange={this.handleSelectOption("contractSignedByFirstPerson")}
                                                    menuPortalTarget={document.body}
                                                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                />
                                                <InputGroup>
                                                </InputGroup>
                                            </Col>
                                            <Col>
                                                <AsyncSelect
                                                    id="contractSign2"
                                                    loadOptions={this.loadOptionsDept}
                                                    value={deptHeads[taskDetails.contractSignedBySecondPersonOption]}
                                                    onChange={this.handleSelectOption("contractSignedBySecondPerson")}
                                                    menuPortalTarget={document.body}
                                                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                />
                                                <InputGroup>
                                                </InputGroup>
                                            </Col>
                                        </Row>
                                    </FormGroup>

                                    : taskDetails.applicationTypeId === "LTU"
                                        ? <FormGroup>
                                            <Label>Document Check By <i className="fa fa-user" /></Label>
                                            <AsyncSelect
                                                id="docCheckBySelected"
                                                menuPortalTarget={document.body}
                                                onChange={this.handleSelectOption("documentCheckBy")}
                                                loadOptions={this.loadOptionsDept}
                                                value={deptHeads[taskDetails.documentCheckByOption]}
                                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }} />
                                        </FormGroup>
                                        : <FormGroup>
                                            <Label>Department Heads <i className="fa fa-user" /></Label>
                                            <small> &ensp; If you apply for {this.legalName} Company Chop, then Department Head shall be from {this.legalName} entity</small>
                                            <AsyncSelect
                                                id="deptHeadSelected"
                                                loadOptions={this.loadOptionsDept}
                                                isMulti
                                                value={selectedDeptHeads}
                                                onChange={this.handleSelectOption("departmentHeads")}
                                                menuPortalTarget={document.body}
                                                components={animatedComponents}
                                                styles={taskDetails.deptHeadSelected === null ? reactSelectControl : ""} />
                                            {taskDetails.deptHeadSelected === null
                                                ? <small style={{ color: '#F86C6B' }}>Please select a Department Head</small>
                                                : ""
                                            }
                                        </FormGroup>
                                }

                                <Col md="16">
                                    <FormGroup check>
                                        <FormGroup>
                                            <CustomInput
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={taskDetails.isConfirm === "Y"}
                                                onChange={this.handleAgreeTerm}
                                                onClick={this.isValid}
                                                id="confirm" value="option1">
                                                <Label className="form-check-label" check >
                                                    By ticking the box, I confirm that I hereby acknowledge that I must comply the internal Policies and Guidelines &
                                                    regarding chop management and I will not engage in any inappropriate chop usage and other inappropriate action
                      </Label>
                                            </CustomInput>
                                        </FormGroup>
                                    </FormGroup>
                                </Col>
                            </Form>
                        </CardBody>
                        <CardFooter>
                            <div className="form-actions">
                                <Row>
                                    <Col md={11}>
                                        {taskDetails.isConfirm
                                            ? <Button type="submit" color="success" onClick={() => { this.submitRequest('Y') }}>Submit</Button>
                                            : <Button type="submit" color="success"
                                                // onMouseEnter={() => this.setState({ tooltipOpen: !this.state.tooltipOpen })}
                                                id="disabledSubmit" disabled >Submit</Button>}
                                        {/* <Tooltip placement="left" isOpen={this.state.tooltipOpen} target="disabledSubmit"> */}
                                        {/* please confirm the agree terms </Tooltip> */}
                                        <span>&nbsp;</span>
                                        <Button type="submit" color="primary" onClick={() => { this.submitRequest('N') }}>Save</Button>
                                    </Col>
                                    <Col>
                                        <Button onClick={this.deleteTask} color="danger" >Delete</Button>
                                    </Col>
                                </Row>


                            </div>
                        </CardFooter>
                    </Card>
                }

                {redirectToPendingTasks ? this.props.history.push('/mypendingtask') : ""}

            </div>
        )
    }
}
export default EditRequest; 