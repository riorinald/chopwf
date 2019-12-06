import React, { Component } from 'react';
import {
    Card, CardBody, CardHeader, Table, Col, Row, CardFooter,
    Input,
    Button,
    FormGroup,
    Label,
    Collapse,
    Form, InputGroup, InputGroupAddon, InputGroupText, FormFeedback,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    CustomInput,
    Spinner
} from 'reactstrap';
import config from '../../config';
import Axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { addDays } from 'date-fns';
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
import SimpleReactValidator from 'simple-react-validator';




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
        this.validator = new SimpleReactValidator({
            autoForceUpdate: this
        });
        this.state = {
            selectAll: false,
            selection: [],

            loading: false,
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

            validateForm: [],

            isValid: false,

            editRequestForm: {
                engName: "",
                cnName: "",
                docSelected: null,
                docAttachedName: "",
                collapseUIO: true,
                isConnect: false,
            },


            showDoc: false,
            selectedDocs: [],

            deptHeads: [],
            selectedDeptHeads: [],
            dateView1: "",
            dateView2: "",
            departments: [],
            chopTypes: [],
            documents: [],
            teams: [],
        }
        this.getTaskDetails = this.getTaskDetails.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.redirectToPendingTasks = this.redirectToPendingTasks.bind(this)
        this.handleDocumentChange = this.handleDocumentChange.bind(this);
        this.toggleConnection = this.toggleConnection.bind(this);
        this.toggleUIO = this.toggleUIO.bind(this);
        this.addDocumentLTI = this.addDocumentLTI.bind(this);
        this.addDocumentLTU = this.addDocumentLTU.bind(this);
        this.getDocuments = this.getDocuments.bind(this);
        this.selectDocument = this.selectDocument.bind(this);
        this.handleAgreeTerm = this.handleAgreeTerm.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
    }

    componentDidMount() {
        if (this.props.location.state !== undefined) {
            this.getDeptHeads()
            this.getTaskDetails(this.props.location.state.id)
        }
        else {
            this.props.history.push({
                pathname: '/mypendingtask'
            })
        }
        this.validator = new SimpleReactValidator();
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

    async getTeams(deptId) {
        let url = `${config.url}/teams?companyid=` + this.props.legalName + "&departmentId=" + deptId
        await Axios.get(url).then(res => {
            this.setState({ teams: res.data })
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
        console.log(this.state.taskDetails.taskId)
        resetMounted.setMounted()
        Axios.delete(`${config.url}/tasks/${this.state.taskDetails.taskId}`).then(res => {
            console.log(res.data)

            Swal.fire({
                title: "REQUEST DELETED",
                html: res.data.message,
                type: "success",
                onClose: () => { this.props.history.push({ pathname: '/mypendingtask' }) }
            })
        })
    }

    convertExpDate(dateValue) {
        let regEx = dateValue.replace(/(\d{4})(\d{2})(\d{2})/g, '$1/$2/$3')
        return regEx;
    }

    convertDate(dateValue, view) {
        let regEx = dateValue.replace(/(\d{4})(\d{2})(\d{2})/g, '$1,$2,$3')
        this.setState({ [view]: new Date(regEx) })
        return new Date(regEx);
    }

    getOption(person) {
        let i = 0
        if (person !== "") {
            this.state.deptHeads.map((head, index) => {
                if (head.value === person) {
                    i = index
                }
            })
        }
        else {
            i = null
        }
        return i
    }


    async getTaskDetails(id) {
        this.setState({ loading: true })
        const response = await Axios.get(`${config.url}/tasks/${id}?userid=${localStorage.getItem('userId')}`)
        let temporary = response.data
        if (temporary.departmentId !== "") {
            this.getTeams(temporary.departmentId)
        }

        temporary.returnDate = temporary.returnDate !== "" ? this.convertDate(temporary.returnDate, 'dateView2') : ""
        temporary.responsiblePersonOption = this.getOption(temporary.responsiblePerson)
        temporary.pickUpByOption = this.getOption(temporary.pickUpBy)

        //CNIPS
        if (temporary.applicationTypeId === "CNIPS") {
            temporary.contractSignedByFirstPersonOption = this.getOption(temporary.contractSignedByFirstPerson)
            temporary.contractSignedBySecondPersonOption = this.getOption(temporary.contractSignedBySecondPerson)
        }

        //LTU
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

        if (temporary.applicationTypeId === "LTU") {
            if (temporary.departmentId !== "" && temporary.chopTypeId !== "" && temporary.teamId !== "") {
                this.getDocuments(this.props.legalName, temporary.departmentId, temporary.chopTypeId, temporary.teamId)
            }
        }

        this.setState({ taskDetails: temporary, loading: false })
    }

    setValidForm() {
        let details = Object.keys(this.state.taskDetails)
        let apptypeId = this.state.taskDetails.applicationTypeId
        details = details.filter(function (item) {
            return item !== "taskId" && item !== "requestNum" && item !== "employeeName" && item !== "employeeNum" && item !== "email" && item !== "departmentName" && item !== "chopTypeName" && item !== "departmentName" && item !== "applicationTypeName" && item !== "applicationTypeId" && item !== "responsiblePersonName" && item !== "contractSignedByFirstPersonName" && item !== "contractSignedBySecondPersonName" && item !== "documentCheckByName" && item !== "isConfirm" && item !== "newReturnDate" && item !== "reasonForExtension" && item !== "currentStatusId" && item !== "currentStatusName" && item !== "nextStatusId" && item !== "nextStatusName" && item !== "teamName" && item !== "actions" && item !== "histories" && item !== "responsiblePersonOption" && item !== "pickUpByOption" && item !== "branchName" && item !== "connectChop" && item !== "isUseInOffice"
        })

        if (apptypeId === "STU") {
            details = details.filter(function (item) {
                return item !== "effectivePeriod" && item !== "teamId" && item !== "documentCheckBy" && item !== "contractSignedByFirstPerson" && item !== "contractSignedBySecondPerson" && item !== "branchId"
            })
        }
        else if (apptypeId === "LTI") {
            details = details.filter(function (item) {
                return item !== "teamId" && item !== "documentCheckBy" && item !== "contractSignedByFirstPerson" && item !== "contractSignedBySecondPerson" && item !== "branchId" && item !== "connectChop"
            })
        }
        else if (apptypeId === "CNIPS") {
            details = details.filter(function (item) {
                return item !== "effectivePeriod" && item !== "teamId" && item !== "documentCheckBy" && item !== "contractSignedByFirstPerson" && item !== "contractSignedBySecondPerson" && item !== "branchId"
            })
        }
        else {
            details = details.filter(function (item) {
                return item !== "effectivePeriod" && item !== "departmentHeads" && item !== "branchId" && item !== "contractSignedByFirstPerson" && item !== "contractSignedBySecondPerson"
            })
        }

        this.setState({ validateForm: details })
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
        // let url = `${config.url}/documents?companyid=mbafc&departmentid=itafc&choptypeid=comchop&teamid=mbafcit`
        //

        let url = `${config.url}/documents?companyid=` + companyId + '&departmentid=' + deptId + '&choptypeid=' + chopTypeId + '&teamid=' + teamId;
        try {
            await Axios.get(url).then(res => {
                this.setState({ documents: res.data })
            })
        } catch (error) {
            console.error(error)
        }
    }

    redirectToPendingTasks() {
        this.props.history.push('/mypendingtask')
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
        if (name === "departmentId") {
            this.getTeams(event.target.value)
        }
        if (event.target.value) {

            event.target.className = "is-valid form-control"
        }
        else {
            event.target.className = "is-invalid form-control"
        }
        // console.log(name + " + " + event.target.value)
        let value = event.target.value
        this.setState(state => {
            let taskDetails = this.state.taskDetails
            taskDetails[name] = value
            return { taskDetails };

        })
    }

    handleDocumentChange = name => event => {
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
            editRequestForm.collapseUIO = !editRequestForm.collapseUIO
            if (editRequestForm.collapseUIO) {
                taskDetails.isUseInOffice = "Y"
            }
            else {
                taskDetails.isUseInOffice = "N"
            }

            return { editRequestForm, taskDetails }
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
                taskId: this.state.taskDetails.taskId,
                documentFileName: this.state.editRequestForm.docAttachedName,
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
                taskDetails.documentNames.push(obj)
                return { taskDetails }
            })
        }
    }
    addDocumentLTU() {
        this.state.selectedDocs.map(doc => {
            this.setState(state => {
                let taskDetails = this.state.taskDetails
                taskDetails.documentNames = taskDetails.documentNames.concat(doc)
                return { taskDetails }
            })
        })
    }


    deleteDocument(table, i) {
        this.setState(state => {
            if (table === "documentTableLTU") {
                let taskDetails = this.state.taskDetails
                taskDetails.documentNames = taskDetails.documentNames.filter((item, index) => i !== index)
                return { taskDetails }
            }
            else if (table === "documentTableLTI") {
                let taskDetails = this.state.taskDetails
                taskDetails.documentNames = taskDetails.documentNames.filter((item, index) => i !== index)
                return { taskDetails }
            }
        })
    }

    toggleConnection() {
        this.setState(state => {
            let taskDetails = this.state.taskDetails
            let editRequestForm = this.state.editRequestForm
            editRequestForm.isConnect = !editRequestForm.isConnect
            if (editRequestForm.isConnect) {
                taskDetails.connectChop = "Y"
            }
            else {
                taskDetails.connectChop = "N"
            }
            return { editRequestForm, taskDetails }
        })
    }



    handleSelectOption = sname => newValue => {

        var element = document.getElementById(sname)
        element.classList.contains("form-control")
            ? element.className = "is-valid form-control"
            : element.className = "isValid"

        if (sname === "departmentHeads") {
            let value = []
            this.setState({ selectedDeptHeads: newValue })
            if (newValue) {
                newValue.map(val => {
                    value.push(val.value)
                })
            }
            this.setState(state => {
                let taskDetails = this.state.taskDetails
                taskDetails[sname] = value
                return { taskDetails }
            })
        }
        else {
            this.setState(state => {
                let taskDetails = this.state.taskDetails
                this.state.deptHeads.map((head, index) => {
                    if (head.value === newValue.value) {
                        taskDetails[sname + "Option"] = index
                    }
                })
                taskDetails[sname] = newValue.value
                return { taskDetails }
            })
        }
    }

    dateChange = (name, view) => date => {
        let dates = date.toISOString().substr(0, 10);
        this.setState({
            [view]: date
        });
        this.setState(state => {
            let taskDetails = this.state.taskDetails
            taskDetails[name] = dates.replace(/-/g, "")
            return { taskDetails }
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
                        title: "SAVED",
                        text: 'Request Saved ',
                        footer: 'Your request is saved as a draft',
                        type: 'info',
                        onClose: () => {
                            this.props.history.push('/mypendingtask')
                        }
                    })

                }
                if (isSubmitted === 'Y') {
                    Swal.fire({
                        title: "SUBMITTED",
                        text: 'Request Submitted',
                        footer: 'Your request is being processed and is waiting for the approval',
                        type: 'success',
                        onClose: () => {
                            this.props.history.push('/mypendingtask')
                        }

                    })

                }
            })
            .catch(error => {
                console.log(error.response.data)
                let stat = error.response.data.status !== "failed" && error.response.data.status !== "error"
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
    }

    async validate() {
        let details = this.state.validateForm
        if (this.state.taskDetails.isUseInOffice === "Y") {
            details = details.filter(item => item !== "responsiblePerson" && item !== "returnDate")
        }
        for (let i = 0; i < details.length; i++) {
            // console.log(details[i])
            // console.log(this.state.taskDetails[details[i]])
            var element = document.getElementById(details[i])
            if (this.state.taskDetails[details[i]] === "" || this.state.taskDetails[details[i]].length === 0) {
                element.classList.contains("form-control")
                    ? element.className = "is-invalid form-control"
                    : element.className = "notValid"
            }
            else {
                element.classList.contains("form-control")
                    ? element.className = "is-valid form-control"
                    : element.className = "isValid"
            }
        }
        for (let i = 0; i < details.length; i++) {
            if (this.state.taskDetails[details[i]] === "" || this.state.taskDetails[details[i]].length === 0) {
                this.setState({ isValid: false })
                break;
            }
            else {
                this.setState({ isValid: true })
            }
        }
    }

    async handleAgreeTerm(event) {
        let checked = event.target.checked
        await this.setValidForm()
        await this.validate()
        // console.log(this.state.isValid)
        // console.log(this.validator.allValid())
        if (this.state.isValid && this.validator.allValid()) {
            this.setState(state => {
                let taskDetails = this.state.taskDetails
                if (checked) { taskDetails.isConfirm = "Y" }
                return { taskDetails }
            })
        } else {
            this.validator.showMessages();
            // rerender to show messages for the first time
            // you can use the autoForceUpdate option to do this automatically`
            this.forceUpdate()
        }
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
        const { taskDetails, dateView1, deptHeads, selectedDeptHeads, editRequestForm } = this.state

        this.validator.purgeFields();

        return (
            <div>
                {!this.state.loading ?
                    <Card className="animated fadeIn">
                        <CardHeader>
                            <Button onClick={() => this.redirectToPendingTasks()}>Back</Button> &nbsp;
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
                                        <Input onChange={this.handleChange("telephoneNum")} name="telephoneNum" value={taskDetails.telephoneNum} id="telephoneNum" size="16" type="text" />
                                    </InputGroup>
                                    <InputGroup>
                                        <small style={{ color: '#F86C6B' }} >{this.validator.message('Telephone Number', taskDetails.telephoneNum, 'required|numeric')}</small>
                                    </InputGroup>
                                </FormGroup>
                                <FormGroup>
                                    <Label>Dept</Label>
                                    <Input id="departmentId" type="select" value={taskDetails.departmentId} onChange={this.handleChange("departmentId")} name="dept">
                                        <option value="" >Please select a department</option>
                                        {this.state.departments.map((option, index) => (
                                            <option value={option.deptId} key={option.deptId}>
                                                {option.deptName}

                                            </option>
                                        ))}
                                    </Input>
                                    <InputGroup>
                                        <small style={{ color: '#F86C6B' }} >{this.validator.message('Department', taskDetails.departmentId, 'required')}</small>
                                    </InputGroup>
                                    {/* <FormFeedback>Invalid Departement Selected</FormFeedback> */}
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
                                        {/* <FormFeedback>Invalid Date Selected</FormFeedback> */}
                                        <InputGroup>
                                            <small style={{ color: '#F86C6B' }} >{this.validator.message('Effective Period', taskDetails.effectivePeriod, 'required')}</small>
                                        </InputGroup>
                                    </FormGroup>
                                    : null
                                }
                                {taskDetails.applicationTypeId === "LTU"
                                    ? <FormGroup>
                                        <Label>Entitled Team</Label>
                                        <InputGroup>
                                            <Input id="teamId" onChange={this.handleChange("teamId")} value={taskDetails.teamId} type="select">
                                                <option value="0" disabled>Please select a team</option>
                                                {this.state.teams.map((team, index) =>
                                                    <option key={index} value={team.teamId}>{team.teamName}</option>
                                                )}
                                            </Input>
                                            {/* <FormFeedback>Invalid Entitled Team Selected</FormFeedback> */}
                                        </InputGroup>
                                    </FormGroup>
                                    : null
                                }
                                <FormGroup>
                                    <Label>Chop Type</Label>
                                    <Input type="select" id="chopTypeId"
                                        // onClick={() => { props.getChopTypes(props.legalName, props.taskDetails.appTypeSelected) }}
                                        onChange={this.handleChange("chopTypeId")} value={taskDetails.chopTypeId} name="chopType" >
                                        <option value="" >Please select a Chop Type</option>
                                        {this.state.chopTypes.map((option, id) => (
                                            <option key={option.chopTypeId} value={option.chopTypeId}>{option.chopTypeName}</option>
                                        ))}

                                    </Input>
                                    <InputGroup>
                                        <small style={{ color: '#F86C6B' }} >{this.validator.message('Chop Type', taskDetails.chopTypeId, 'required')}</small>
                                    </InputGroup>
                                    {/* <FormFeedback>Invalid Chop Type Selected</FormFeedback> */}
                                </FormGroup>


                                <FormGroup check={false}>
                                    <Label>Document Name</Label>
                                    {taskDetails.applicationTypeId === "LTU"
                                        ? <div id="documentNames">
                                            <InputGroup >
                                                <InputGroupAddon addonType="prepend">
                                                    <Button color="primary" onClick={this.selectDocument}>Select Documents</Button>
                                                </InputGroupAddon>
                                                <Input id="documentTableLTU" disabled />
                                                {/* <FormFeedback>Invalid Input a valid Document Name</FormFeedback> */}
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
                                        : <div id="documentNames">
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
                                <InputGroup>
                                    <small style={{ color: '#F86C6B' }} >{this.validator.message('Document Names', taskDetails.documentNames, 'required')}</small>
                                </InputGroup>
                                <FormGroup>
                                    <Label>Purpose of Use</Label>
                                    <InputGroup>
                                        <Input onChange={this.handleChange("purposeOfUse")} value={taskDetails.purposeOfUse} placeholder="Enter the Purpose of Use" type="textarea" name="textarea-input" id="purposeOfUse" rows="3" />
                                        {/* <FormFeedback>Please input the purpose of use</FormFeedback> */}
                                    </InputGroup>
                                    <InputGroup>
                                        <small style={{ color: '#F86C6B' }} >{this.validator.message('Purpose Of Use', taskDetails.purposeOfUse, 'required')}</small>
                                    </InputGroup>
                                </FormGroup>

                                {!taskDetails.applicationTypeId === "LTI"
                                    ? <FormGroup>
                                        <Label>Connecting Chop (骑缝章) </Label>
                                        <Row />
                                        <AppSwitch id="connectChop" dataOn={'yes'} onChange={this.toggleConnection} checked={taskDetails.connectChop === "Y"} dataOff={'no'} className={'mx-1'} variant={'3d'} color={'primary'} outline={'alt'} label></AppSwitch>
                                        <InputGroup>
                                            <small style={{ color: '#F86C6B' }} >{this.validator.message('Connecting Chop', taskDetails.connectChop, 'required')}</small>
                                        </InputGroup>
                                    </FormGroup>
                                    : ""}
                                <FormGroup>
                                    <Label>Number of Pages to Be Chopped</Label>
                                    <InputGroup>
                                        <Input onChange={this.handleChange("numOfPages")} value={taskDetails.numOfPages} id="numOfPages" size="16" type="number" min="0" />
                                        {/* <FormFeedback>Invalid Number of pages </FormFeedback> */}
                                    </InputGroup>
                                    <InputGroup>
                                        <small style={{ color: '#F86C6B' }} >{this.validator.message('Number of Pages', taskDetails.numOfPages, 'required')}</small>
                                    </InputGroup>
                                </FormGroup>

                                <FormGroup>
                                    <Label>Use in Office or Not</Label>
                                    <Row />
                                    <AppSwitch onChange={this.toggleUIO} checked={taskDetails.isUseInOffice === "Y"} id="useOff" className={'mx-1'} variant={'3d'} color={'primary'} outline={'alt'} label dataOn={'yes'} dataOff={'no'} />
                                </FormGroup>

                                <Collapse isOpen={!editRequestForm.collapseUIO}>
                                    <FormGroup visibelity="false" >
                                        <Label>Return Date</Label>
                                        <Row />
                                        <DatePicker id="returnDate" placeholderText="YYYY/MM/DD" popperPlacement="auto-center" showPopperArrow={false} todayButton="Today"
                                            className="form-control" required dateFormat="yyyy/MM/dd" withPortal
                                            selected={this.state.dateView2}
                                            onChange={this.dateChange("returnDate", "dateView2")}
                                            minDate={new Date()} maxDate={addDays(new Date(), 365)} />
                                    </FormGroup>
                                    {!editRequestForm.collapseUIO ? <InputGroup>
                                        <small style={{ color: '#F86C6B' }} >{this.validator.message('Return Date', taskDetails.returnDate, 'required')}</small>
                                    </InputGroup> : null}

                                    <FormGroup>
                                        <Label>Responsible Person <i className="fa fa-user" /></Label>
                                        <AsyncSelect id="responsiblePerson"
                                            classNamePrefix="rs"
                                            loadOptions={this.loadOptionsDept}
                                            value={deptHeads[taskDetails.responsiblePersonOption]}
                                            onChange={this.handleSelectOption("responsiblePerson")}
                                            menuPortalTarget={document.body}
                                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                        />
                                    </FormGroup>
                                    {!editRequestForm.collapseUIO ?
                                        <InputGroup>
                                            <small style={{ color: '#F86C6B' }} >{this.validator.message('Responsible Person', taskDetails.responsiblePerson, 'required')}</small>
                                        </InputGroup> : null}
                                </Collapse>
                                <FormGroup>
                                    <Label>Address to</Label>
                                    <InputGroup>
                                        <Input onChange={this.handleChange("addressTo")} value={taskDetails.addressTo} type="textarea" name="textarea-input" id="addressTo" rows="5" placeholder="Documents will be addressed to" />
                                        {/* <FormFeedback>Invalid person to address to</FormFeedback> */}
                                    </InputGroup>
                                    <InputGroup>
                                        <small style={{ color: '#F86C6B' }} >{this.validator.message('Address To', taskDetails.addressTo, 'required')}</small>
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
                                        <small style={{ color: '#F86C6B' }} >{this.validator.message('Pick Up By', taskDetails.pickUpBy, 'required')}</small>
                                    </InputGroup>
                                    <InputGroup>
                                        {/* <FormFeedback>Please enter a valid name to search</FormFeedback> */}
                                    </InputGroup>
                                </FormGroup>
                                <FormGroup>
                                    <Label>Remark</Label>
                                    <InputGroup>
                                        <Input onChange={this.handleChange("remark")} value={taskDetails.remark} id="remark" size="16" type="textbox" placeholder="Please enter the remarks" />
                                        {/* <FormFeedback>Please add remarks</FormFeedback> */}
                                    </InputGroup>
                                    <InputGroup>
                                        <small style={{ color: '#F86C6B' }} >{this.validator.message('Remark', taskDetails.remark, 'required')}</small>
                                    </InputGroup>
                                </FormGroup>

                                {taskDetails.applicationTypeId === "CNIPS"
                                    ? <FormGroup>
                                        <Label>Contract Signed By: <i className="fa fa-user" /></Label>
                                        <small> &ensp; Please fill in the DHs who signed the contract and keep in line with MOA; If for Direct Debit Agreements, Head of FGS and Head of Treasury are needed for approval</small>
                                        <Row>
                                            <Col>
                                                <AsyncSelect
                                                    id="contractSignedByFirstPerson"
                                                    loadOptions={this.loadOptionsDept}
                                                    value={deptHeads[taskDetails.contractSignedByFirstPersonOption]}
                                                    onChange={this.handleSelectOption("contractSignedByFirstPerson")}
                                                    menuPortalTarget={document.body}
                                                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                />
                                                <InputGroup>
                                                    <small style={{ color: '#F86C6B' }} >{this.validator.message('Contract Signed By ', taskDetails.contractSignedByFirstPerson, 'required')}</small>
                                                </InputGroup>
                                            </Col>
                                            <Col>
                                                <AsyncSelect
                                                    id="contractSignedBySecondPerson"
                                                    loadOptions={this.loadOptionsDept}
                                                    value={deptHeads[taskDetails.contractSignedBySecondPersonOption]}
                                                    onChange={this.handleSelectOption("contractSignedBySecondPerson")}
                                                    menuPortalTarget={document.body}
                                                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                />
                                                <InputGroup>
                                                    <small style={{ color: '#F86C6B' }} >{this.validator.message('Contract Signed By', taskDetails.contractSignedBySecondPerson, 'required')}</small>
                                                </InputGroup>
                                            </Col>
                                        </Row>
                                    </FormGroup>

                                    : taskDetails.applicationTypeId === "LTU"
                                        ? <FormGroup>
                                            <Label>Document Check By <i className="fa fa-user" /></Label>
                                            <AsyncSelect
                                                id="documentCheckBy"
                                                menuPortalTarget={document.body}
                                                onChange={this.handleSelectOption("documentCheckBy")}
                                                loadOptions={this.loadOptionsDept}
                                                value={deptHeads[taskDetails.documentCheckByOption]}
                                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }} />
                                            <InputGroup>
                                                <small style={{ color: '#F86C6B' }} >{this.validator.message('Document Check By', taskDetails.documentCheckBy, 'required')}</small>
                                            </InputGroup>
                                        </FormGroup>
                                        : <FormGroup>
                                            <Label>Department Heads <i className="fa fa-user" /></Label>
                                            <small> &ensp; If you apply for {this.legalName} Company Chop, then Department Head shall be from {this.legalName} entity</small>
                                            <AsyncSelect
                                                id="departmentHeads"
                                                loadOptions={this.loadOptionsDept}
                                                isMulti
                                                value={selectedDeptHeads}
                                                onChange={this.handleSelectOption("departmentHeads")}
                                                menuPortalTarget={document.body}
                                                components={animatedComponents}
                                                styles={taskDetails.deptHeadSelected === null ? reactSelectControl : ""} />
                                            <InputGroup>
                                                <small style={{ color: '#F86C6B' }} >{this.validator.message('Department Head', taskDetails.departmentHeads, 'required')}</small>
                                            </InputGroup>
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
                    : <div className="animated fadeIn pt-1 text-center" ><Spinner /></div>
                }
            </div>
        )
    }
}
export default EditRequest; 