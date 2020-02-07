import React, { Component } from 'react';
import {
    Card, CardBody, CardHeader, Table, Col, Row, CardFooter,
    Input,
    Button,
    FormGroup,
    Label,
    Collapse,
    Form,
    InputGroup,
    InputGroupAddon,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    CustomInput,
    Spinner,
    Badge,
    Progress,
    UncontrolledTooltip,

} from 'reactstrap';
import config from '../../config';
import Axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { addDays, format } from 'date-fns';
import InputMask from "react-input-mask";
import deleteBin from '../../assets/img/deletebin.png'
import { AppSwitch } from '@coreui/react';
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import Swal from 'sweetalert2';
import ReactTable from "react-table";
import "react-table/react-table.css"
import selectTableHOC from "react-table/lib/hoc/selectTable";
import PropTypes from "prop-types";
// import { resetMounted } from '../MyPendingTasks/MyPendingTasks';
import SimpleReactValidator from 'simple-react-validator';
import LegalEntity from '../../context';
import TextareaAutosize from 'react-autosize-textarea';




const SelectTable = selectTableHOC(ReactTable);




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

            noteInfo: [],

            loading: true,
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
                documents: [],
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
                effectivePeriod: "",
            },

            selectedOption:{},

            modal: false,
            validateForm: [],
            viewContract: false,

            branches: [],

            contractNumber: "",
            conNum: [],
            inputMask: [],

            isValid: false,
            editRequestForm: {
                engName: "",
                cnName: "",
                docSelected: null,
                docAttachedName: "",
                collapseUIO: true,
                isConnect: false,
                contractNumbers: []
            },


            showDoc: false,
            selectedDocs: [],

            invalidEnglish: false,
            invalidChinese: false,
            invalidNumberOfPages: false,

            docCheckBy: [],
            deptHeads: [],
            usersList: [],
            selectedDeptHeads: [],
            selectedDocCheckBy: [],
            dateView1: null,
            dateView2: new Date(),
            departments: [],
            appTypes: [],
            chopTypes: [],
            documents: [],
            teams: [],
            msgTooltip: '[I / S ]-[ A / L / IA / R ]-[ O / P / S] \n e.g "S-A-O-9999-9999"',
            ioTooltip: false,
            tempDocument: [],
            contractValid: true,
            contractNumNotes: "",
            contractError: "",
            checkDetails: { deptTempSelected: "null", chopTypeTempSelected: "null", teamTempSelected: "null" },
            wrongDocError: ""
        }
        this.getTaskDetails = this.getTaskDetails.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.goBack = this.goBack.bind(this)
        this.handleDocumentChange = this.handleDocumentChange.bind(this);
        this.toggleConnection = this.toggleConnection.bind(this);
        this.toggleUIO = this.toggleUIO.bind(this);
        this.addDocumentLTI = this.addDocumentLTI.bind(this);
        this.addDocumentLTU = this.addDocumentLTU.bind(this);
        this.getDocuments = this.getDocuments.bind(this);
        this.selectDocument = this.selectDocument.bind(this);
        this.handleAgreeTerm = this.handleAgreeTerm.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
        this.addContract = this.addContract.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.handleContractNumber = this.handleContractNumber.bind(this);
        this.hideDoc = this.hideDoc.bind(this);
        this.checkforChinese = this.checkforChinese.bind(this);

        this.formRef = React.createRef()
    }

    componentDidMount() {
        if (this.props.location.state !== undefined) {
            this.getDeptHeads("deptHeads")
            this.getDeptHeads("usersList")
            this.getTaskDetails(this.props.location.state.id)
            this.getNotes()
        }
        else {
            this.props.history.push({
                pathname: `/${this.props.match.params.page}`
            })
        }
        this.validator = new SimpleReactValidator();
        this.setContractNotes()
    }


    getNotes() {
        Axios.get(`${config.url}/notes/0`)
            .then(res => {
                let tempNotes = res.data.noteContent.split('%')
                for (let i = 0; i < tempNotes.length; i++) {
                    let obj = {
                        chinese: tempNotes[i].split('#')[0],
                        english: tempNotes[i].split('#')[1]
                    }
                    this.setState({
                        noteInfo: this.state.noteInfo.concat(obj)
                    })
                }
            })
    }

    setContractNotes() {
        switch (this.props.legalName) {
            case "MBAFC":
                this.setState({ contractNumNotes: "Enter Contract Number, e.g. I-A-P-2020-1035" })
                break;
            case "MBLC":
                this.setState({ contractNumNotes: "Enter Contract Number, e.g. I-L-P-2020-1035" })
                break;
            case "MBIA":
                this.setState({ contractNumNotes: "Enter Contract Number, e.g. I-IA-P-2020-1035" })
                break;
            case "DMT":
                this.setState({ contractNumNotes: "Enter Contract Number, e.g. I-R-P-2020-1035" })
                break;
            default:
                break;
        }
    }

    async getDocCheckBy(deptId, teamId, chopTypeId, callback) {
        console.log("getting lvl4 users")
        await Axios.get(`${config.url}/users?category=lvlfour&departmentid=${deptId}&teamid=${teamId}&choptypeid=${chopTypeId}&companyid=${this.props.legalName}&userid=${localStorage.getItem('userId')}`,
            { headers: { Pragma: 'no-cache' } }).then(res => {
                let arr = []
                for (let i = 0; i < res.data.length; i++) {
                    const obj = { value: res.data[i].userId, label: res.data[i].displayName }
                    arr.push(obj)
                }
                this.setState({ docCheckBy: arr })
            })
        callback()
    }

    async getDeptHeads(category) {
        this.setState({ deptHeads: [] })
        let url = ""
        if (category === "deptHeads") {
            url = `${config.url}/users?category=normal&companyid=${this.props.legalName}&userid=${localStorage.getItem('userId')}`
        }
        else {
            url = `${config.url}/users?category=normal&companyid=${this.props.legalName}`
        }
        await Axios.get(url, { headers: { Pragma: 'no-cache' } })
            .then(res => {
                let arr1 = []
                for (let i = 0; i < res.data.length; i++) {
                    const obj = { value: res.data[i].userId, label: res.data[i].displayName }
                    arr1.push(obj)
                }
                this.setState({
                    [category]: arr1
                })
            })
    }

    async getTeams(deptId) {
        let url = `${config.url}/teams?companyid=` + this.props.legalName + "&departmentId=" + deptId
        await Axios.get(url, { headers: { Pragma: 'no-cache' } }).then(res => {
            this.setState({ teams: res.data })
        })
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

    changeSelect = () => {
        console.log("poyi")
        this.setState({
            modal: !this.state.modal,
        });
        // document.getElementById("chopTypeId").value = "0"
        this.setState(state => {
            const taskDetails = this.state.taskDetails
            taskDetails.chopTypeId = ""
            return { taskDetails }
        })
    }

    async deleteTask() {
        // console.log(this.state.taskDetails.taskId)
        // resetMounted.setMounted()
        Swal.fire({
            title: `Deleting your Request ... `,
            type: "info",
            text: '',
            footer: '',
            allowOutsideClick: false,
            onClose: () => { this.props.history.push({ pathname: `/${this.props.match.params.page}` }) },
            onBeforeOpen: () => {
                Swal.showLoading()
            },
            onOpen: () => {
                Axios.delete(`${config.url}/tasks/${this.state.taskDetails.taskId}`)
                    .then(res => {

                        Swal.update({
                            title: "Request Deleted",
                            text: `The request has been deleted.`, //${res.data.message}
                            type: "success",

                        })
                        Swal.hideLoading()
                    })
                    .catch(error => {
                        if (error.response) {
                            Swal.fire({
                                title: "ERROR",
                                html: error.response.data.message,
                                type: "error"
                            })
                        }
                    })
            }
        })

        // Axios.delete(`${config.url}/tasks/${this.state.taskDetails.taskId}`).then(res => {
        //     // console.log(res.data)

        //     Swal.fire({
        //         title: "REQUEST DELETED",
        //         html: res.data.message,
        //         type: "success",
        //         onClose: () => { this.props.history.push({ pathname: `/${this.props.match.params.page}` }) }
        //     })
        // })
    }

    convertExpDate(dateValue) {
        let regEx = dateValue.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')
        return regEx;
    }

    convertDate(dateValue, view) {
        console.log(dateValue)
        let regEx = ""
        let dateView = null
        if (dateValue !== "00010101" && dateValue !== "" && dateValue !== "/") {
            regEx = dateValue.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')
            dateView = new Date(regEx)
            console.log(dateView)
        }

        this.setState({ [view]: dateView })
    }

    getDocCheckByOption(person) {
        let i = 0
        if (person.length === 1) {
            this.state.docCheckBy.map((head, index) => {
                if (head.value === person[0]) {
                    i = index
                    this.setState({ selectedDocCheckBy: head.value })
                }
            })
        }
        else {

            i = null
        }
        return i
    }

    getOptionAllUsers(person) {
        let i = {}
        if (person !== "") {
            this.state.usersList.map((head, index) => {
                if (head.value === person) {
                    i = head
                }
            })
        }
        else {
            i = null
        }
        return i
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
        const response = await Axios.get(`${config.url}/tasks/${id}?userid=${localStorage.getItem('userId')}`, { headers: { Pragma: 'no-cache' } })
        let temporary = response.data
        if (temporary.departmentId !== "") {
            this.getTeams(temporary.departmentId)
        }
        // if (temporary.returnDate !== "") {
        // }
        if (temporary.returnDate !== '') {
            this.convertDate(temporary.returnDate, 'dateView2')
        }
        temporary.responsiblePersonOption = this.getOptionAllUsers(temporary.responsiblePerson)
        temporary.pickUpByOption = this.getOptionAllUsers(temporary.pickUpBy)

        //CNIPS
        if (temporary.applicationTypeId === "CNIPS") {
            temporary.contractSignedByFirstPersonOption = this.getOptionAllUsers(temporary.contractSignedByFirstPerson)
            temporary.contractSignedBySecondPersonOption = this.getOptionAllUsers(temporary.contractSignedBySecondPerson)
        }

        //LTU
        else if (temporary.applicationTypeId === "LTU") {
            if (temporary.teamId !== "" && temporary.departmentId !== "") {
                this.getDocCheckBy(temporary.departmentId, temporary.teamId, temporary.chopTypeId, (callback) => {
                    temporary.docCheckByOption = temporary.documentCheckBy.length !== 0 ? this.getDocCheckByOption(temporary.documentCheckBy) : null
                    temporary.documentCheckBy = temporary.documentCheckBy.length !== 0 ? this.getSelected(temporary.documentCheckBy) : null
                })
            }
        }

        else if (temporary.applicationTypeId === "LTI") {

            this.setSelectedDocCheckBy(temporary.documentCheckBy)
            if (temporary.effectivePeriod !== "") {
                this.convertDate(temporary.effectivePeriod, 'dateView1')
            }
        }

        this.setState(state => {
            let editRequestForm = this.state.editRequestForm
            editRequestForm.collapseUIO = temporary.isUseInOffice === "Y" ? true : false
        })
        this.setSelectedDeptHead(temporary.departmentHeads)


        await this.getData("departments", `${config.url}/departments`)
        await this.getData("appTypes", `${config.url}/appTypes`)
        await this.getData("chopTypes", `${config.url}/choptypes?companyid=${this.props.legalName}&apptypeid=${temporary.applicationTypeId}`);
        if (temporary.chopTypeId === "BCSCHOP") {
            await this.getData("branches", `${config.url}/branches?companyid=${this.props.legalName}`)
            await this.getDocCheckBy(response.data.departmentId, response.data.teamId, response.data.chopTypeId, (callback) => { })
        }

        if (temporary.applicationTypeId === "LTU") {
            if (temporary.departmentId !== "" && temporary.chopTypeId !== "" && temporary.teamId !== "") {
                // this.getDocuments(this.props.legalName, temporary.departmentId, temporary.chopTypeId, temporary.teamId, (callback) => {

                // })
            }
        }
        temporary.departmentId = temporary.departmentId.toLowerCase()
        // console.log(temporary.requestorUser)
        this.setState({ selectedOption: {documentCheckBy:temporary.documentCheckBy}, taskDetails: temporary, tempDocument: temporary.documents, loading: false })
        console.log(temporary)

    }

    getSelected(person) {
        let obj = {}
        if (person.length === 1) {
            this.state.docCheckBy.map((head, index) => {
                if (head.value === person[0]) {
                    obj = head
                    this.setState({ selectedDocCheckBy: head.value })
                }
            })
        }
        else {

            obj = null
        }
        return obj
    }

    setValidForm() {
        let details = Object.keys(this.state.taskDetails)

        let apptypeId = this.state.taskDetails.applicationTypeId
        details = details.filter(function (item) {
            return item !== "taskId" && item !== "telephoneNum" && item !== "companyId" && item !== "requestNum" && item !== "employeeName" && item !== "employeeNum" && item !== "email" && item !== "departmentName" && item !== "chopTypeName" && item !== "departmentName" && item !== "applicationTypeName" && item !== "applicationTypeId" && item !== "responsiblePersonName" && item !== "contractSignedByFirstPersonName" && item !== "contractSignedBySecondPersonName" && item !== "documentCheckByName" && item !== "isConfirm" && item !== "newReturnDate" && item !== "reasonForExtension" && item !== "currentStatusId" && item !== "currentStatusName" && item !== "nextStatusId" && item !== "nextStatusName" && item !== "teamName" && item !== "actions" && item !== "histories" && item !== "responsiblePersonOption" && item !== "pickUpByOption" && item !== "branchName" && item !== "connectChop" && item !== "isUseInOffice" && item !== "allStages" && item !== "docCheckByOption" && item !== "createdBy" && item !== "createdByPhotoUrl" && item !== "contractSignedByFirstPersonOption" && item !== "contractSignedBySecondPersonOption" && item !== "departmentHeadsName" && item !== "pickUpByName" && item !== "requestorUser" && item !== "selectedOption"
        })

        switch (apptypeId) {
            case "STU":
                details = details.filter(function (item) {
                    return item !== "effectivePeriod" && item !== "teamId" && item !== "documentCheckBy" && item !== "contractSignedByFirstPerson" && item !== "contractSignedBySecondPerson" && item !== "branchId"
                })
                break;
            case "LTI":
                details = details.filter(function (item) {
                    return item !== "teamId" && item !== "contractSignedByFirstPerson" && item !== "contractSignedBySecondPerson" && item !== "branchId" && item !== "connectChop"
                })
                break;
            case "LTU":
                details = details.filter(function (item) {
                    return item !== "effectivePeriod" && item !== "departmentHeads" && item !== "branchId" && item !== "contractSignedByFirstPerson" && item !== "contractSignedBySecondPerson"
                })
                break;
            case "CNIPS":
                details = details.filter(function (item) {
                    return item !== "effectivePeriod" && item !== "teamId" && item !== "documentCheckBy" && item !== "branchId" && item !== "departmentHeads"
                })
                break;
            default:
                break;
        }
        this.setState({ validateForm: details })
    }

    changeDeptHeads(heads) {
        let dh = ""
        heads.map(head => {
            dh = dh + head.displayName + '; '
        })
        return dh
    }


    async getDocuments(companyId, deptId, chopTypeId, teamId, callback) {

        //change to 2nd URL -  1st URL for dev
        // let url = `${config.url}/documents?companyid=mbafc&departmentid=itafc&choptypeid=comchop&teamid=mbafcit`
        //

        let url = `${config.url}/documents?companyid=` + companyId + '&departmentid=' + deptId + '&choptypeid=' + chopTypeId + '&teamid=' + teamId;
        // console.log(url)
        try {
            await Axios.get(url, { headers: { Pragma: 'no-cache' } }).then(res => {
                this.setState({ documents: res.data })
                callback(res.data.length)
            })
        } catch (error) {
            callback(false)
            console.error(error)
        }
    }

    goBack() {
        this.props.history.push(`/${this.props.match.params.page}`)
    }

    filterColors = (inputValue) => {
        return this.state.deptHeads.filter(i =>
            i.label.toLowerCase().includes(inputValue.toLowerCase())
        );
    };
    filterColors1 = (inputValue) => {
        return this.state.usersList.filter(i =>
            i.value !== this.state.taskDetails.contractSignedBySecondPerson && i.label.toLowerCase().includes(inputValue.toLowerCase())
        );
    };

    filterColors2 = (inputValue) => {
        return this.state.usersList.filter(i =>
            i.value !== this.state.taskDetails.contractSignedByFirstPerson && i.label.toLowerCase().includes(inputValue.toLowerCase())
        );
    };

    filterDocCheck = (inputValue) => {
        return this.state.docCheckBy.filter(i =>
            i.label.toLowerCase().includes(inputValue.toLowerCase())
        );
    };

    filterAllUsers = (inputValue) => {
        return this.state.usersList.filter(i =>
            i.label.toLowerCase().includes(inputValue.toLowerCase())
        );
    }

    loadAllUsers = (inputValue, callback) => {
        callback(this.filterAllUsers(inputValue));
    }

    loadOptionsDept = (inputValue, callback) => {
        callback(this.filterColors(inputValue));

    }
    loadOptionsDeptContract1 = (inputValue, callback) => {
        callback(this.filterColors1(inputValue));

    }
    loadOptionsDeptContract2 = (inputValue, callback) => {
        callback(this.filterColors2(inputValue));

    }

    loadOptionsDocCheck = (inputValue, callback) => {
        callback(this.filterDocCheck(inputValue));
    }


    setSelectedDocCheckBy(docCheck) {
        let selected = docCheck
        selected.map(select => {
            let temp = ""
            let l = this.state.usersList.length
            for (let i = 0; i < l; i++) {
                if (select === this.state.usersList[i].value) {
                    temp = this.state.usersList[i]
                    this.setState(state => {
                        const selectedDocCheckBy = this.state.selectedDocCheckBy.concat(temp)
                        return {
                            selectedDocCheckBy
                        }
                    })
                    break;
                }
            }
        })
        console.log(this.state.selectedDocCheckBy)
    }

    toggle = name => event => {
        this.setState({
            [name]: !this.state[name],
        });

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

    toggleModal() {
        this.setState({
            modal: !this.state.modal,
        });
    }

    handleUserChange = name => event => {
        this.setState(state => {
            let taskDetails = this.state.taskDetails
            taskDetails.isConfirm = "N"
            return taskDetails
        })
        let value = event.target.value
        this.setState(state => {
            let taskDetails = this.state.taskDetails
            taskDetails.requestorUser[name] = value
            return taskDetails
        })
        if (event.target.value) {

            event.target.className = "form-control"
        }
        else {
            event.target.className = "is-invalid form-control"
        }
    }

    handleChange = name => event => {
        // console.log(this.state.taskDetails.documentCheckBy[this.state.taskDetails.docCheckByOption])
        let value = event.target.value

        this.setState(state => {
            let taskDetails = this.state.taskDetails
            taskDetails.isConfirm = "N"
            return taskDetails
        })
        if (name === "departmentId") {
            this.getTeams(event.target.value)
            // this.setState(state => {
            //     let taskDetails = this.state.taskDetails

            //     return taskDetails
            // })
            console.log(this.state.taskDetails.applicationTypeId)
            if (this.state.taskDetails.applicationTypeId === "LTU") {
                this.setState({ docCheckBy: [] })
                this.setState(state => {
                    const taskDetails = this.state.taskDetails
                    taskDetails.documents = []
                    taskDetails.teamId = ""
                    taskDetails.documentCheckBy = []
                    taskDetails.docCheckByOption = ""
                    this.state.selectedOption.documentCheckBy = null
                    return { taskDetails }
                })
            }
        }
        else if (name === "teamId") {
            // console.log(this.state.taskDetails.applicationTypeId)
            if (this.state.taskDetails.applicationTypeId === "LTU") {
                this.setState(state => {
                    let taskDetails = this.state.taskDetails
                    taskDetails.documentCheckBy = []
                    taskDetails.documents = []
                    taskDetails.docCheckByOption = ""
                    this.state.selectedOption.documentCheckBy = null
                    return taskDetails
                })
                this.getDocCheckBy(this.state.taskDetails.departmentId, event.target.value, this.state.taskDetails.chopTypeId, (callback) => { })
            }
        }
        else if (name === "applicationTypeId") {
            // this.formRef.current.reset()
            this.setState(state => {
                let taskDetails = this.state.taskDetails
                let editRequestForm = this.state.editRequestForm
                taskDetails.documents = []
                taskDetails.departmentId = ""
                taskDetails.chopTypeId = ""
                taskDetails.branchId = ""
                taskDetails.effectivePeriod = ""
                taskDetails.returnDate = ""
                taskDetails.purposeOfUse = ""
                taskDetails.numOfPages = ""
                taskDetails.addressTo = ""
                taskDetails.remark = ""
                taskDetails.teamId = ""
                taskDetails.pickUpBy = ""
                taskDetails.pickUpByOption = null
                taskDetails.responsiblePerson = ""
                taskDetails.responsiblePersonOption = null
                taskDetails.contractSignedBySecondPerson = ""
                taskDetails.contractSignedBySecondPersonOption = null
                taskDetails.contractSignedByFirstPerson = ""
                taskDetails.contractSignedByFirstPersonOption = null
                taskDetails.documentCheckBy = ""
                taskDetails.selectedOption = null
                taskDetails.selectedDeptHeads = []
                taskDetails.departmentHeads = []
                taskDetails.isUseInOffice = "Y"
                editRequestForm.collapseUIO = true
                return { taskDetails, editRequestForm }
            })
            this.setState({ dateView1: null, dateView2: null })
            this.getData("chopTypes", `${config.url}/choptypes?companyid=${this.props.legalName}&apptypeid=${event.target.value}`);
        }

        else if (name === "chopTypeId") {

            // if (this.state.taskDetails.teamId !== "" && this.state.taskDetails.applicationTypeId === "LTI") {
            //     this.getDocCheckBy(this.state.taskDetails.departmentId, this.state.taskDetails.teamId, event.target.value, (callback) => { })
            // }
            console.log(this.state.taskDetails.applicationTypeId)
            if (event.target.value === "CONCHOP") {
                this.toggleModal();
            }
            if (this.state.taskDetails.applicationTypeId === "LTU") {
                this.getDocCheckBy(this.state.taskDetails.departmentId, this.state.taskDetails.teamId, event.target.value, (callback) => { })
                this.setState(state => {
                    let taskDetails = this.state.taskDetails
                    taskDetails.documents = []
                    taskDetails.documentCheckBy = []
                    taskDetails.docCheckByOption = ""
                    this.state.selectedOption.documentCheckBy = null
                    return taskDetails
                })
            }

            if (event.target.value === "BCSCHOP") {
                this.getData("branches", `${config.url}/branches?companyid=${this.props.legalName}`)
            }
        }
        else if (name === "numOfPages") {
            if (value.length > 9) {
                this.setState({ invalidNumberOfPages: true })
                // event.target.className = "form-control is-invalid"
            }
            else {
                this.setState(state => {
                    let { taskDetails, invalidNumberOfPages } = this.state
                    taskDetails[name] = value
                    invalidNumberOfPages = false
                    return { taskDetails, invalidNumberOfPages }
                })
                // event.target.className = "form-control"
            }
        }

        if (event.target.value) {
            event.target.className = "form-control"
        }
        else {
            event.target.className = "is-invalid form-control"
        }

        if (name !== "numOfPages") {
            this.setState(state => {
                let taskDetails = this.state.taskDetails
                taskDetails[name] = value
                return { taskDetails };
            })
        }
    }

    checkforChinese(event) {
        let value = event.target.value
        if (value.match(/[\u4E00-\u9FFF\u3400-\u4DFF\uF900-\uFAFF]+/g)) {
            this.setState({ engName: this.state.engName, invalidEnglish: true })
            event.target.className = "form-control is-invalid"
        }
        else {
            event.target.className = "form-control"
            this.setState({ engName: value, invalidEnglish: false })
        }
    }

    handleDocumentChange = name => event => {
        let value = event.target.value
        //Handle engName
        if (name === "engName") {
            if (value.match(/[\u4E00-\u9FFF\u3400-\u4DFF\uF900-\uFAFF]+/g)) {
                this.setState(state => {
                    let { editRequestForm, invalidEnglish } = this.state
                    editRequestForm[name] = this.state.editRequestForm[name]
                    invalidEnglish = true
                    return { editRequestForm, invalidEnglish };

                })
                // this.setState({ engName: this.state.engName, invalidEnglish: true })
                event.target.className = "form-control is-invalid"
            }
            else {
                // event.target.className = "form-control"
                this.setState(state => {
                    let { editRequestForm, invalidEnglish } = this.state
                    editRequestForm[name] = value
                    invalidEnglish = false
                    return { editRequestForm, invalidEnglish };

                })
                // this.setState({ engName: value, invalidEnglish: false })
            }
        }

        //Handle cnName
        else if (name === "cnName") {
            // console.log(value.match(/^[A-Za-z]/))
            // if (value.match(/^[A-Za-z0-9_]+$/gm)) {
            // if (value.match(/[A-Za-z]+/g)) {
            // this.setState(state => {
            // let { editRequestForm, invalidChinese } = this.state
            // editRequestForm[name] = this.state.editRequestForm[name]
            // invalidChinese = true
            // return { editRequestForm, invalidChinese };

            // })
            // event.target.className = "form-control is-invalid"
            // }
            // else {
            this.setState(state => {
                let { editRequestForm, invalidChinese } = this.state
                editRequestForm[name] = value
                invalidChinese = false
                return { editRequestForm, invalidChinese };

            })
            // event.target.className = "form-control"
            // }
            // }
        }
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
        let ext = ["ipg", "png", "xls", "xlsm", "xlsx", "email", "jpeg", "txt", "rtf", "tiff", "tif", "doc", "docx", "pdf", "pdfx", "bmp"]
        let valid = false
        if (event.target.files[0]) {
            let last = event.target.files[0].name.split('.').length
            let extension = event.target.files[0].name.split('.')[last - 1]
            for (let i = 0; i < ext.length; i++) {
                if (ext[i] === extension || ext[i].toUpperCase() === extension) {
                    valid = true
                    break;
                }
                else {
                    valid = false
                }
            }
            if (valid) {
                let file = event.target.files[0]
                let fileName = event.target.files[0].name
                this.setState(state => {
                    let editRequestForm = this.state.editRequestForm
                    editRequestForm.docSelected = file
                    editRequestForm.docAttachedName = fileName
                    return { editRequestForm }
                })
                this.setState({ wrongDocError: "" })
            }
            else {
                this.setState({ wrongDocError: "Please attach a valid document !" })
            }

        }
        event.target.value = null
    }

    deleteContractNumber(i) {
        this.setState(state => {
            const editRequestForm = this.state.editRequestForm
            editRequestForm.contractNumbers = editRequestForm.contractNumbers.filter((item, index) => i !== index)
            return {
                editRequestForm
            }
        })
    }

    async validateContractNumber() {
        let doc = this.state.taskDetails.documents
        let contractError = []
        try {
            let validateConNum = await this.validateConNum();
            if (this.state.editRequestForm.docSelected === null) {
                contractError.push("Please Select a valid Document.<br />")
            }
            if (this.state.editRequestForm.engName === "") {
                contractError.push("Please input name in english.<br />")
            }
            if (this.state.editRequestForm.contractNumber === "") {
                contractError.push("Please input a valid Contract Number.<br />")
            }
            if (this.state.editRequestForm.contractNumber !== "" && validateConNum === false) {
                contractError.push(this.state.contractError + ".<br />")
                contractError.push(this.state.contractNumNotes)
            }
            if (contractError.length === 0 && validateConNum === true) {
                for (let i = 0; i < doc.length; i++) {
                    if (doc[i].documentFileName === this.state.editRequestForm.docAttachedName && doc[i].contractNums[0] === this.state.contractNumber) {
                        contractError.push("Document and contract number already exists in the list")
                        break
                    }
                    else {
                        contractError = []
                    }
                }
            }
        }
        catch (e) {
            console.log(e, contractError)
        }
        finally {
            return contractError
        }
    }

    convertApprovedDate(dateValue) {

        let regEx = dateValue.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\w{2})/g, '$1/$2/$3 $4:$5 $6')
        return regEx
    }

    addDocumentLTI() {
        var maxNumber = 45;
        var rand = Math.floor((Math.random() * maxNumber) + 1);
        var tempDate = new Date();
        var date = tempDate.getDate() + '/' + (tempDate.getMonth() + 1) + '/' + tempDate.getFullYear() + ' ' + tempDate.getHours() + ':' + tempDate.getMinutes() + ':' + tempDate.getSeconds();
        // console.log(this.state.editRequestForm.docSelected)
        let valid = true
        let errorMessage = []
        let doc = this.state.taskDetails.documents
        let typeValid = false

        if (this.state.editRequestForm.docSelected === null) {
            errorMessage.push("Please select a valid document.<br />")
        }
        if (this.state.isLTI) {
            if (this.state.editRequestForm.engName === "") {
                errorMessage.push("Please input document name in English.<br />")
                typeValid = false
            }
            if (this.state.editRequestForm.cnName === "") {
                errorMessage.push("Please input document name in Chinese.<br />")
                typeValid = false
            }
            if (this.state.invalidChinese === true) {
                errorMessage.push("Please input document name in Chinese with Chinese character.<br />")
                typeValid = false
            }
            else {
                typeValid = true
            }
        }
        else {
            if (this.state.editRequestForm.engName === "") {
                errorMessage.push("Please input document name in english.<br />")
                typeValid = false
            }
            if (this.state.invalidEnglish === true) {
                errorMessage.push("Please input document name in English with English character.<br />")
                typeValid = false
            }
            else {
                typeValid = false
            }
        }
        if (errorMessage.length !== 0) {
            console.log(errorMessage)
            Swal.fire({
                title: "Invalid",
                html: errorMessage.join('\n\n'),
                type: "warning",
                width: "550px"
            })
        }
        else {
            for (let i = 0; i < doc.length; i++) {
                if (doc[i].docName === this.state.editRequestForm.docAttachedName) {
                    valid = false
                    break
                }
                else {
                    valid = true
                }
            }
            if (valid) {
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
                    documentFileType: this.state.editRequestForm.docSelected.type,
                    documentBase64String: "",
                    expiryDate: null,
                    departmentHeads: null,
                    documentId: rand,
                    documentNameEnglish: this.state.editRequestForm.engName,
                    documentNameChinese: this.state.editRequestForm.cnName,
                    docSelected: this.state.editRequestForm.docSelected
                }

                this.getBase64(this.state.editRequestForm.docSelected, (result) => {
                    obj.documentBase64String = result
                })

                console.log(obj)

                this.setState(state => {
                    let { taskDetails, invalidChinese, invalidEnglish } = this.state
                    taskDetails.documents.push(obj)
                    invalidChinese = false
                    invalidEnglish = false
                    return { taskDetails, invalidChinese, invalidEnglish }
                })

                document.getElementById("documents").className = ""

                this.setState(state => {
                    let { editRequestForm } = this.state
                    editRequestForm.docAttachedName = ""
                    editRequestForm.docSelected = null
                    editRequestForm.engName = ""
                    editRequestForm.cnName = ""
                    return editRequestForm
                })
            }
            else {
                Swal.fire({
                    title: "Document Exists",
                    html: 'The selected document already exists in the List',
                    type: "warning"
                })
            }
        }

    }

    addDocumentLTU() {
        if (this.state.selectedDocs.length !== 0) {
            document.getElementById("documentTableLTU").className = "form-control"
            this.setState(state => {
                let taskDetails = this.state.taskDetails
                taskDetails.documents = this.state.selectedDocs
                return taskDetails
            })
        }
        else {
            this.setState(state => {
                let taskDetails = this.state.taskDetails
                taskDetails.documents = []
                return taskDetails
            })
        }

        // this.state.selectedDocs.map(doc => {
        //     this.setState(state => {
        //         let taskDetails = this.state.taskDetails
        //         taskDetails.documents = taskDetails.documents.concat(doc)
        //         return { taskDetails }
        //     })
        // })
    }


    addDocumentCNIPS = () => {
        var maxNumber = 45;
        var rand = Math.floor((Math.random() * maxNumber) + 1);
        var tempDate = new Date();
        var date = tempDate.getDate() + '/' + (tempDate.getMonth() + 1) + '/' + tempDate.getFullYear() + ' ' + tempDate.getHours() + ':' + tempDate.getMinutes() + ':' + tempDate.getSeconds();
        let conName = [this.state.contractNumber]
        let contractError = ["error"];
        this.validateContractNumber()
            .then(data => {
                contractError = data
                if (contractError.length === 0) {
                    const obj = {
                        taskId: this.state.taskDetails.taskId,
                        documentFileName: this.state.editRequestForm.docAttachedName,
                        documentCode: "",
                        contractNumber: this.state.editRequestForm.contractNumber,
                        description: "",
                        created: date,
                        updated: "",
                        documentType: "",
                        documentUrl: URL.createObjectURL(this.state.editRequestForm.docSelected),
                        documentFileType: this.state.editRequestForm.docSelected.type,
                        documentBase64String: "",
                        expiryDate: null,
                        departmentHeads: null,
                        documentId: rand,
                        documentNameEnglish: this.state.editRequestForm.engName,
                        documentNameChinese: this.state.editRequestForm.cnName,
                        docSelected: this.state.editRequestForm.docSelected,
                        contractNums: [this.state.contractNumber]
                    }
                    this.setState(state => {
                        let { taskDetails, invalidChinese, invalidEnglish } = this.state
                        taskDetails.documents.push(obj)
                        return { taskDetails }
                    })

                    this.setState(state => {
                        let { editRequestForm } = this.state
                        editRequestForm.docAttachedName = ""
                        editRequestForm.contractNumbers = ""
                        editRequestForm.docSelected = null
                        editRequestForm.engName = ""
                        editRequestForm.cnName = ""
                        return editRequestForm
                    })
                    this.setState({ contractValid: true, contractNumber: "", conNum: [] })

                    document.getElementById("documents").className = ""
                }
                else {
                    Swal.fire({
                        title: "Invalid",
                        html: contractError.join('\n\n'),
                        type: "warning",
                        width: "500px"
                    })
                }
            })
    }


    handleInputMask = () => {

        // let value = ("" + event.target.value).toUpperCase();
        let first = /(?!.*[A-HJ-QT-Z])[IS]/;
        let third = /(?!.*[A-NQRT-Z])[PSO]/;
        let digit = /[0-9]/;
        let center = /[A-Za-z]/;
        let mask = []
        switch (this.props.match.params.company) {
            case 'MBIA':
                mask = [first, "-", center, "-", third, "-", digit, digit, digit, digit, "-", digit, digit, digit, digit];
                break;
            case 'MBLC':
                mask = [first, "-", center, "-", third, "-", digit, digit, digit, digit, "-", digit, digit, digit, digit];
                break;
            case 'MBAFC':
                mask = [first, "-", center, "-", third, "-", digit, digit, digit, digit, "-", digit, digit, digit, digit];
                break;
            case 'DMT':
                mask = [first, "-", center, "-", third, "-", digit, digit, digit, digit, "-", digit, digit, digit, digit];
                break;
            default:
                mask = [first, "-", center, "-", third, "-", digit, digit, digit, digit, "-", digit, digit, digit, digit];
                break;
        }
        this.setState({
            inputMask: mask
        });
    }


    deleteDocument(table, i) {
        this.setState(state => {
            if (table === "documentTableLTU") {
                let taskDetails = this.state.taskDetails
                taskDetails.documents = taskDetails.documents.filter((item, index) => i !== index)
                return { taskDetails }
            }
            else if (table === "documentTableLTI") {
                let taskDetails = this.state.taskDetails
                taskDetails.documents = taskDetails.documents.filter((item, index) => i !== index)
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

    validateConNum() {
        const first = /(?!.*[A-HJ-QT-Z])[IS]/i;
        const second = /[LIAR]/
        const third = /(?!.*[A-NQRT-Z])[PSO]/i;
        let digit = /[0-9]/;
        let valid = false
        let value = this.state.contractNumber
        let { isFirst, isSecond, isThird, isDigit, isdigit1 } = false;

        if (first.test(value[0])) {
            isFirst = true
        } else {
            let message = "First value should be I / S"
            this.setState({ contractValid: false, contractError: message })
        }
        if (isFirst && second.test(value[2])) {
            isSecond = true
        } else if (isFirst) {
            let message = "Second value should be A / L / IA / R"
            this.setState({ contractValid: false, contractError: message })
        }

        if (isSecond && value[3] === 'A') {
            if (third.test(value[5])) {
                isThird = true
            } else {
                let message = "Third value should be O / P / S"
                this.setState({ contractValid: false, contractError: message })
            }

            for (let i = 7; i < 11; i++) {
                isDigit = digit.test(value[i])
                if (isThird && !isDigit) {
                    console.log("error", value[i], i)
                    let message = "Please input 4 digits of year"
                    this.setState({ contractValid: false, contractError: message })
                    break;
                }
                else if (i === 9) {
                    isdigit1 = true
                }
                if (value.length === 16) {
                    for (let i = 12; i < 16; i++) {
                        isDigit = digit.test(value[i])
                        if (!isDigit) {
                            console.log("error", value[i], i)
                            let message = "Please input last 4 digits"
                            this.setState({ contractValid: false, contractError: message })
                            break;
                        }
                        else {
                            valid = true
                            this.setState({ contractValid: true, contractError: "" })
                        }
                    }
                }
                if (value.length === 15) {
                    for (let i = 12; i < 15; i++) {
                        isDigit = digit.test(value[i])
                        if (!isDigit) {
                            console.log("error", value[i], i)
                            let message = "Please input last 4 digits"
                            this.setState({ contractValid: false, contractError: message })
                            break;
                        }
                        else {
                            valid = true
                            this.setState({ contractValid: true, contractError: "" })
                        }
                    }
                }
            }
            if (isThird && isdigit1 && value.length < 15) {
                console.log('last digit should be 4')
                let message = "Please input last 4 digits"
                this.setState({ contractValid: false, contractError: message })
            }
            if (isThird && isdigit1 && value.length > 16) {
                valid = false
                let message = "Invalid contract format"
                this.setState({ contractValid: false, contractError: message })
            }
        }

        if (isSecond && value[2] !== 'I') {
            if (third.test(value[4])) {
                isThird = true
            } else {
                let message = "Third value should be O / P / S"
                this.setState({ contractValid: false, contractError: message })
            }
            for (let i = 6; i <= 9; i++) {
                isDigit = digit.test(value[i])
                if (isThird && !isDigit) {
                    console.log("error", value[i], i, value, value.length)
                    let message = "Please input 4 digits of year"
                    this.setState({ contractValid: false, contractError: message })
                    break;
                }
                else if (i === 9) {
                    isdigit1 = true
                }
            }

            if (value.length === 15) {

                for (let i = 12; i < 14; i++) {
                    isDigit = digit.test(value[i])
                    if (!isDigit) {
                        console.log("error", value[i], i)
                        let message = "Please input last 4 digits"
                        this.setState({ contractValid: false, contractError: message })
                        break;
                    }
                    else {
                        valid = true
                        this.setState({ contractValid: true, contractError: "" })
                    }
                }
            }
            if (value.length === 14) {
                for (let i = 12; i < 13; i++) {
                    isDigit = digit.test(value[i])
                    if (!isDigit) {
                        console.log("error", value[i], i)
                        let message = "Please input last 4 digits"
                        this.setState({ contractValid: false, contractError: message })
                        break;
                    }
                    else {
                        valid = true
                        this.setState({ contractValid: true, contractError: "" })
                    }
                }
            }
            if (isThird && isdigit1 && value.length < 14) {
                console.log('last digit should be 4')
                let message = "Please input last 4 digits"
                this.setState({ contractValid: false, contractError: message })
            }
        }
        if (isThird && isdigit1 && value.length > 16) {
            valid = false
            let message = "Invalid contract format"
            this.setState({ contractValid: false, contractError: message })
        }
        if (isSecond && value[2] === 'I' && value[3] !== 'A' && value[3] !== undefined) {
            console.log('please input IA')
            let message = "Please input IA instead of I" + value[3]
            this.setState({ contractValid: false, contractError: message })
        } else if (isSecond && value[2] === 'I' && value[3] !== 'A') {
            let message = "Third value should be A / L / IA / R"
            this.setState({ contractValid: false, contractError: message })
        }

        return valid
    }

    addContract(event) {
        let valid = this.validateConNum()
        let digit = /[0-9]/;
        let value = this.state.contractNumber
        if (valid) {
            if (this.props.match.params.company === "MBIA") {
                if (!digit.test(this.state.contractNumber[15])) {
                    value = this.state.contractNumber.substr(0, 15)
                }
            }
            else {
                if (!digit.test(this.state.contractNumber[14])) {
                    value = this.state.contractNumber.substr(0, 14)
                }

            }

            this.setState(state => ({
                conNum: [...state.conNum, value]
            })
            )
            this.setState({ contractNumber: "" }, this.toggle('viewContract'))
        }
        else {
            Swal.fire({
                title: "Invalid Contract Number",
                html: 'Please input a new valid Contract Number!',
                type: "warning"
            })
        }
    }



    handleSelectOption = sname => newValue => {
        this.setState(state => {
            let taskDetails = this.state.taskDetails
            taskDetails.isConfirm = "N"
            return taskDetails
        })
        if (sname === "documentCheckBy1") {
            var element = document.getElementById("documentCheckBy")
            element.classList.contains("form-control")
                ? element.className = "is-valid form-control"
                : element.className = "isValid"
        }
        else {
            var element = document.getElementById(sname)
            element.classList.contains("form-control")
                ? element.className = "is-valid form-control"
                : element.className = "isValid"
        }

        if (sname === "departmentHeads" || sname === "documentCheckBy") {
            let value = []
            if (sname === "departmentHeads") {
                this.setState({ selectedDeptHeads: newValue })
            }
            else {
                this.setState({ selectedDocCheckBy: newValue })
            }
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

        else if (sname === "documentCheckBy1") {
            let value = []
            let option = ""
            if (newValue) {
                value.push(newValue.value)
                option = this.getDocCheckByOption(value)
            }
            // console.log(option)
            // console.log(this.state.docCheckBy)
            this.setState(state => {
                let taskDetails = this.state.taskDetails
                this.state.selectedOption.documentCheckBy = newValue
                taskDetails.documentCheckBy = value
                taskDetails.docCheckByOption = option
                return { taskDetails }
            }, () => console.log(this.state.selectedOption.documentCheckBy))
        }

        else if (sname === "responsiblePerson" || sname === "pickUpBy" || sname === "contractSignedByFirstPerson" || sname === "contractSignedBySecondPerson") {
            if (newValue) {
                this.setState(state => {
                    let taskDetails = this.state.taskDetails
                    this.state.usersList.map(head => {
                        if (head.value === newValue.value) {
                            taskDetails[sname + "Option"] = head
                        }
                    })
                    taskDetails[sname] = newValue.value
                    return { taskDetails }
                })
            }
            else {
                this.setState(state => {
                    let taskDetails = this.state.taskDetails
                    taskDetails[sname + "Option"] = null
                    taskDetails[sname] = ""
                    return taskDetails
                })
            }
        }
        else {
            if (newValue) {
                this.setState(state => {
                    let taskDetails = this.state.taskDetails
                    this.state.deptHeads.map((head, index) => {
                        if (head.value === newValue.value) {
                            taskDetails[sname + "Option"] = index
                        }
                    })
                    taskDetails[sname] = newValue.value
                    return { taskDetails }
                }, console.log(this.state.taskDetails.contractSignedByFirstPerson))
            }
            else {
                this.setState(state => {
                    let taskDetails = this.state.taskDetails
                    taskDetails[sname + "Option"] = ""
                    taskDetails[sname] = ""
                    return taskDetails
                })
            }
        }
    }

    dateChange = (name, view) => date => {
        let dates = ""
        if (date) {
            let tempDate = format(date, "yyyy-MM-dd").split('T')[0];//right
            dates = tempDate.replace(/-/g, "")
        }
        console.log(dates)
        this.setState({
            [view]: date
        });
        this.setState(state => {
            let taskDetails = this.state.taskDetails
            taskDetails[name] = dates
            return { taskDetails }
        })
    };

    dateChanged(date) {
        let dates = date.toISOString().substr(0, 10);
        return dates.replace(/-/g, "")
    }

    async selectDocument() {
        document.getElementById('selectDocuments').blur()
        let { taskDetails } = this.state
        let errorMessage = []
        Swal.fire({
            title: "Retrieving",
            html: 'Please wait while we retrive the list of documents available.',
            type: "info",
            onBeforeOpen: () => {
                Swal.showLoading()
            },
            onOpen: () => {
                if (taskDetails.departmentId === "") {
                    errorMessage.push("Please select the Department.<br />")
                }
                if (taskDetails.chopTypeId === "") {
                    errorMessage.push("Please select Chop Type.<br />")
                }
                if (taskDetails.teamId === "") {
                    errorMessage.push("Please select Team.<br />")
                }
                console.log(errorMessage)
                if (errorMessage.length !== 0) {
                    Swal.update({
                        title: "Field Required",
                        html: errorMessage.join('\n\n'),
                        type: "warning"
                    })
                    Swal.hideLoading()
                }
                else {
                    this.getDocuments(this.props.legalName, taskDetails.departmentId, taskDetails.chopTypeId, taskDetails.teamId, (numberOfDocuments) => {
                        if (numberOfDocuments === 0) {
                            Swal.update({
                                title: "No Documents",
                                html: 'There is no Documents in this appliction. ',
                                type: "warning"
                            })
                            Swal.hideLoading()
                        }
                        else {
                            // Swal.hideLoading();
                            Swal.close();
                            this.setState({ showDoc: true })
                        }
                    })
                }
            }
        })
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
        this.setState({ selectAll, selection, selectedDocs });
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
                // console.log("It was in this row:", rowInfo);
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

        Swal.fire({
            title: `Creating your Request ... `,
            type: "info",
            text: '',
            footer: '',
            allowOutsideClick: false,
            showConfirmButton: true,
            onClose: () => { this.props.history.push(`/${this.props.match.params.page}`) },
            onBeforeOpen: () => {
                Swal.showLoading()
            },
            onOpen: () => {
                Axios.put(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
                    .then(res => {

                        Swal.update({
                            title: res.data.status === 200 ? isSubmitted === "Y" ? 'Request Submitted' : "Request Saved" : "",
                            text: 'Request Number : ' + res.data.requestNum,
                            footer: isSubmitted === "Y" ? 'Your request is being processed and is waiting for the approval' : 'Your request is saved as draft.',
                            type: isSubmitted === "Y" ? "success" : "info",

                        })
                        Swal.hideLoading()
                    })
                    .catch(error => {
                        console.log(error.response.data)
                        let stat = error.response.data.status !== "failed" && error.response.data.status !== "error"
                        let msg = ""
                        if (stat) {
                            if (error.response.data.errors) {
                                let keys = Object.keys(error.response.data.errors)
                                keys.map((key, index) => {
                                    msg = index + 1 + '.' + ' ' + msg + error.response.data.errors[key]
                                })
                            }
                            else if (error.response.data.message) {
                                msg = error.response.data.message
                            }
                        }

                        else {
                            msg = "Validation Errors occured"
                        }
                        Swal.update({
                            title: "ERROR",
                            text: msg,
                            type: 'error'
                        })
                        Swal.hideLoading()
                    })
            }
        })

        // await Axios.put(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        //     .then(res => {
        //         if (isSubmitted === 'N') {
        //             Swal.fire({
        //                 title: res.data.status === 200 ? 'Request Saved' : '',
        //                 text: 'Request Number : ' + res.data.requestNum,
        //                 footer: 'Your request is saved as a draft',
        //                 type: 'info',
        //                 onClose: () => {
        //                     this.props.history.push(`/${this.props.match.params.page}`)
        //                 }
        //             })

        //         }
        //         if (isSubmitted === 'Y') {
        //             Swal.fire({
        //                 title: res.data.status === 200 ? 'Request Submitted' : "",
        //                 text: 'Request Number : ' + res.data.requestNum,
        //                 footer: 'Your request is being processed and is waiting for the approval',
        //                 type: 'success',
        //                 onClose: () => {
        //                     this.props.history.push(`/${this.props.match.params.page}`)
        //                 }

        //             })

        //         }
        //     })
        //     .catch(error => {
        //         console.log(error.response.data)
        //         let stat = error.response.data.status !== "failed" && error.response.data.status !== "error"
        //         let msg = ""
        //         if (stat) {
        //             if (error.response.data.errors) {
        //                 let keys = Object.keys(error.response.data.errors)
        //                 keys.map((key, index) => {
        //                     msg = index + 1 + '.' + ' ' + msg + error.response.data.errors[key]
        //                 })
        //             }
        //             else if (error.response.data.message) {
        //                 msg = error.response.data.message
        //             }
        //         }

        //         else {
        //             msg = "Validation Errors occured"
        //         }
        //         Swal.fire({
        //             title: stat ? error.response.data.title : "ERROR",
        //             text: msg,
        //             type: 'error'
        //         })
        //     })
    }

    async validate() {
        let details = this.state.validateForm
        if (this.state.taskDetails.isUseInOffice === "Y") {
            details = details.filter(item => item !== "responsiblePerson" && item !== "returnDate")
        }
        // console.log(details)
        let tempCheck = 0
        for (let i = 0; i < details.length; i++) {
            console.log(details[i])
            var element = document.getElementById(details[i])
            if (this.state.taskDetails[details[i]] === "" || this.state.taskDetails[details[i]].length === 0) {
                console.log(this.state.taskDetails[details[i]])
                if (tempCheck === 0) {
                    element.focus()
                }
                tempCheck = 1
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
        // for (let i = 0; i < details.length; i++) {
        //     if (this.state.taskDetails[details[i]] === "" || this.state.taskDetails[details[i]].length === 0) {
        //         this.setState({ isValid: false })
        //         break;
        //     }
        //     else {
        //         this.setState({ isValid: true })
        //     }
        // }
    }

    async handleAgreeTerm(event) {
        let checked = event.target.checked
        await this.setValidForm()
        if (this.state.taskDetails.applicationTypeId !== "") {
            await this.validate()
            if (this.validator.allValid()) {
                this.setState(state => {
                    let taskDetails = this.state.taskDetails
                    if (checked) { taskDetails.isConfirm = "Y" }
                    return { taskDetails }
                })
            } else {
                this.validator.showMessages();
                this.forceUpdate()
            }
        }
        else {
            Swal.fire({
                title: "Application Type not Selected",
                html: 'Please select an application type to continue!',
                type: "warning"
            })
        }

        // console.log(this.state.isValid)
        // console.log(this.validator.allValid())

    }

    async submitRequest(isSubmitted) {

        let returnDate = this.state.taskDetails.returnDate ? this.state.taskDetails.returnDate : ""

        let userId = localStorage.getItem('userId')
        let postReq = new FormData();
        postReq.append("UserId", userId);
        postReq.append("EmployeeNum", this.state.taskDetails.requestorUser.employeeNum);
        postReq.append("TelephoneNum", this.state.taskDetails.requestorUser.telephoneNum);
        postReq.append("CompanyId", this.props.legalName);
        postReq.append("DepartmentId", this.state.taskDetails.departmentId);
        postReq.append("ApplicationTypeId", this.state.taskDetails.applicationTypeId);
        // postReq.append("ContractNum", "");
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
        postReq.append("ContractSignedByFirstPerson", this.state.taskDetails.contractSignedByFirstPerson);
        postReq.append("ContractSignedBySecondPerson", this.state.taskDetails.contractSignedBySecondPerson);
        postReq.append("EffectivePeriod", this.state.taskDetails.effectivePeriod);
        postReq.append("IsSubmitted", isSubmitted);
        postReq.append("isConnectChop", this.state.taskDetails.connectChop);
        postReq.append("BranchId", this.state.taskDetails.branchId)

        // if (this.state.taskDetails.documentCheckBy.length === 0) {
        //     postReq.append(`DocumentCheckBy[0]`, "");
        // }

        for (let i = 0; i < this.state.taskDetails.documentCheckBy.length; i++) {
            postReq.append(`DocumentCheckBy[${i}]`, this.state.taskDetails.documentCheckBy[i]);
        }



        if (this.state.taskDetails.applicationTypeId === "LTU") {
            let documents = this.state.taskDetails.documents
            console.log(documents)
            // if (documents === this.state.tempDocument) {
            // documents = []
            // }
            for (let i = 0; i < documents.length; i++) {
                postReq.append(`DocumentIds[${i}]`, documents[i].documentId);
            }
        }
        else {
            let def = 0
            let temp = 0
            let exist = false
            for (let i = 0; i < this.state.taskDetails.documents.length; i++) {
                if (this.state.taskDetails.documents[i].documentId.length === 36) {
                    postReq.append(`DocumentIds[${i}]`, this.state.taskDetails.documents[i].documentId)
                    def = i
                    exist = true
                }
                else {
                    if (exist) {
                        temp = (i - def) - 1
                    }
                    else {
                        temp = i
                    }

                    let documentSelected = this.state.taskDetails.documents[i].docSelected !== undefined ? this.state.taskDetails.documents[i].docSelected : {}
                    postReq.append(`Documents[${temp}].Attachment.File`, documentSelected);
                    postReq.append(`Documents[${temp}].DocumentNameEnglish`, this.state.taskDetails.documents[i].documentNameEnglish);
                    postReq.append(`Documents[${temp}].DocumentNameChinese`, this.state.taskDetails.documents[i].documentNameChinese);
                    for (let j = 0; j < this.state.taskDetails.documents[i].contractNums.length; j++) {
                        postReq.append(`Documents[${temp}].ContractNums[${j}]`, this.state.taskDetails.documents[i].contractNums[j]);
                    }
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
            // resetMounted.setMounted()
        }
        else {
            //if all valid = isConfirmed || All Fields are filled
            // console.log(this.state.taskDetails)
            this.postData(postReq, isSubmitted)
            // resetMounted.setMounted()
        }
    }

    hideDoc() {
        this.setState({ showDoc: false })
    }

    dataURLtoFile(dataurl, filename) {
        console.log(dataurl.split(','))
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new File([u8arr], filename, { type: mime });
    }

    viewOrDownloadFile(b64, type, name, url) {
        if (b64 !== "") {
            let file = this.dataURLtoFile(`data:${type};base64,${b64}`, name);
            var blobUrl = new Blob([file], { type: type })
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(blobUrl, name)
                return;
            }
            else {
                window.open(url, "_blank")
            }
        }
        else {
            alert("BASE 64 String is empty !!!")
        }
    }

    getBase64(file, callback) {
        let reader = new FileReader();
        reader.onload = function () {
            callback(reader.result.replace(/^data:.+;base64,/, ''))
        };
        reader.readAsDataURL(file)
    }

    handleContractNumber(event) {
        let value = event.target.value.toUpperCase();
        let valid = false
        if (/^[IS]/.test(value)) {
            valid = true
        }
        else {
            var errorMsg = "First Charcter should be I or S "
            value = ""
            valid = false
        }
        this.setState({ contractValid: valid, contractError: errorMsg, contractNumber: value })
    }



    render() {
        const { taskDetails, appTypes, dateView1, deptHeads, usersList, docCheckBy, selectedDeptHeads, selectedDocCheckBy, editRequestForm, noteInfo } = this.state

        this.validator.purgeFields();

        return (
            <LegalEntity.Consumer>{
                ContextValue => (
                    <div style={{ fontFamily: "sans-serif" }}>
                        {!this.state.loading ?
                            <Card className="animated fadeIn">
                                <CardHeader>
                                    <Button onClick={() => this.goBack()}>Back</Button> &nbsp;
                             Edit Request <small>- {taskDetails.requestNum}</small>
                                </CardHeader>
                                <CardBody color="dark">
                                    {taskDetails.currentStatusId === "SENDBACKED" || taskDetails.currentStatusId === "RECALLED"
                                        ? <Row>
                                            <Col className="mb-4" onClick={() => this.setState({ progressModal: !this.state.progressModal })}>
                                                <Progress multi>
                                                    {taskDetails.allStages.map((stage, index) =>

                                                        <React.Fragment key={index}>
                                                            <UncontrolledTooltip placement="top" target={"status" + index}>{stage.statusName}</UncontrolledTooltip>
                                                            <Progress
                                                                className={index !== taskDetails.allStages.lastIndex ? "mr-1" : ""}
                                                                bar
                                                                animated={stage.state === "CURRENT" ? true : false}
                                                                striped={stage.state !== "CURRENT"}
                                                                color=
                                                                {
                                                                    taskDetails.currentStatusId === "SENDBACKED" ?
                                                                        stage.state === "CURRENT" ?
                                                                            "danger" :
                                                                            stage.state === "FINISHED" ?
                                                                                "success" :
                                                                                "secondary" :
                                                                        taskDetails.currentStatusId === "RECALLED" ?
                                                                            stage.state === "CURRENT" ?
                                                                                "primary" :
                                                                                stage.state === "FINISHED" ?
                                                                                    "success" :
                                                                                    "secondary" :
                                                                            stage.state === "CURRENT" ?
                                                                                "warning" :
                                                                                stage.state === "FINISHED" ?
                                                                                    "success" :
                                                                                    "secondary"
                                                                }

                                                                // color={stage.state === "CURRENT" ? "warning" : stage.state === "FINISHED" ? "success" : "secondary"}
                                                                value={100 / (taskDetails.allStages.length)}> <div id={"status" + index} style={{ color: stage.state === "FINISHED" || stage.state === "CURRENT" ? "white" : "black" }} >{stage.statusName}</div>
                                                            </Progress>
                                                        </React.Fragment>

                                                    )}
                                                </Progress>
                                            </Col>
                                        </Row>
                                        : null
                                    }
                                    <FormGroup>
                                        <h5><b>NOTES :</b></h5>
                                        <ol id="notes" className="font-weight-bold">
                                            {this.state.noteInfo.map((info, index) => (
                                                <li key={index} >
                                                    <p> {info.chinese} </p>
                                                    <p> {info.english} </p>
                                                </li>
                                            ))}
                                        </ol>
                                    </FormGroup>
                                    <Form innerRef={this.formRef} className="form-horizontal">
                                        <FormGroup>
                                            <Label>Request Number</Label>
                                            <InputGroup>
                                                <Input disabled value={taskDetails.requestNum}></Input>
                                            </InputGroup>
                                        </FormGroup>

                                        <FormGroup>
                                            <Label>Tel. </Label>
                                            <InputGroup>
                                                <Input onChange={this.handleUserChange("telephoneNum")} name="telephoneNum" value={taskDetails.requestorUser.telephoneNum} id="telephoneNum" size="16" type="text" />
                                            </InputGroup>
                                            <InputGroup>
                                                <small style={{ color: '#F86C6B' }} >{this.validator.message('Telephone Number', taskDetails.requestorUser.telephoneNum, 'required')}</small>
                                            </InputGroup>
                                        </FormGroup>

                                        <FormGroup>
                                            <Label>Dept.</Label>
                                            <Input id="departmentId" type="select" value={taskDetails.departmentId} onChange={this.handleChange("departmentId")} name="dept">
                                                <option value="" >Please select </option>
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
                                            <Input type="select" id="appTypeSelected" onChange={this.handleChange("applicationTypeId")} value={taskDetails.applicationTypeId} name="appType">
                                                <option value="" disabled>Please select </option>
                                                {appTypes.map((type, index) =>
                                                    <option key={index} value={type.appTypeId} > {type.appTypeName} </option>
                                                )}
                                            </Input>
                                        </FormGroup>

                                        <Collapse isOpen={taskDetails.applicationTypeId === "LTI"}>
                                            <FormGroup>
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
                                                    {taskDetails.applicationTypeId === "LTI"
                                                        ? <small style={{ color: '#F86C6B' }} >{this.validator.message('Effective Period', taskDetails.effectivePeriod, 'required')}</small>
                                                        : null}
                                                </InputGroup>
                                            </FormGroup>
                                        </Collapse>
                                        <Collapse isOpen={taskDetails.applicationTypeId === "LTU" || taskDetails.applicationTypeId === "LTI"} >
                                            <FormGroup>
                                                <Label>Entitled Team</Label>
                                                <InputGroup>
                                                    <Input id="teamId" onChange={this.handleChange("teamId")} value={taskDetails.teamId} type="select">
                                                        <option value="" disabled>Please select </option>
                                                        {this.state.teams.map((team, index) =>
                                                            <option key={index} value={team.teamId}>{team.teamName}</option>
                                                        )}
                                                    </Input>
                                                    {/* <FormFeedback>Invalid Entitled Team Selected</FormFeedback> */}
                                                </InputGroup>
                                                <InputGroup>
                                                    {taskDetails.applicationTypeId === "LTI"
                                                        ? <small style={{ color: '#F86C6B' }} >{this.validator.message('Entitled Team', taskDetails.teamId, 'required')}</small>
                                                        : null}
                                                </InputGroup>
                                            </FormGroup>
                                        </Collapse>
                                        <FormGroup>
                                            <Label>Chop Type</Label>
                                            <Input type="select" id="chopTypeId"
                                                // onClick={() => { props.getChopTypes(props.legalName, props.taskDetails.appTypeSelected) }}
                                                onChange={this.handleChange("chopTypeId")} value={taskDetails.chopTypeId} name="chopType" >
                                                <option disabled value="" >Please select </option>
                                                {this.state.chopTypes.map((option, id) => (
                                                    <option key={option.chopTypeId} value={option.chopTypeId}>{option.chopTypeName}</option>
                                                ))}

                                            </Input>
                                            <InputGroup>
                                                <small style={{ color: '#F86C6B' }} >{this.validator.message('Chop Type', taskDetails.chopTypeId, 'required')}</small>
                                            </InputGroup>
                                            {/* <FormFeedback>Invalid Chop Type Selected</FormFeedback> */}
                                        </FormGroup>
                                        {taskDetails.chopTypeId === "BCSCHOP" && this.state.branches !== []
                                            ? <FormGroup>
                                                <Label>Branch Company Chop</Label>
                                                <Input onChange={this.handleChange("branchId")} type="select" value={taskDetails.branchId}>
                                                    <option value="" disabled>Please specify your Branch Company Chop</option>
                                                    {this.state.branches.map((branch, index) =>
                                                        <option value={branch.branchId} key={index}>{branch.branchName}</option>
                                                    )}
                                                </Input>
                                            </FormGroup>
                                            : ""
                                        }


                                        <FormGroup check={false}>
                                            <Label>Document Name</Label>
                                            {taskDetails.applicationTypeId === "LTU"
                                                ? <div id="documents" >
                                                    <InputGroup id="documentTableLTU" >
                                                        <InputGroupAddon addonType="prepend">
                                                            <Button id="selectDocuments" color="primary" onClick={this.selectDocument}>Select Documents</Button>
                                                        </InputGroupAddon>
                                                        {/* <Input id="documentTableLTU" disabled /> */}
                                                        {/* <FormFeedback>Invalid Input a valid Document Name</FormFeedback> */}
                                                    </InputGroup>
                                                    <InputGroup>
                                                        {taskDetails.applicationTypeId === "LTU"
                                                            ? <small style={{ color: '#F86C6B' }} >{this.validator.message('Documents', taskDetails.documents, 'required')}</small>
                                                            : null}
                                                    </InputGroup>
                                                    <Modal color="info" size="xl" toggle={this.hideDoc} isOpen={this.state.showDoc} >
                                                        <ModalHeader toggle={this.hideDoc} className="center"> Select Documents </ModalHeader>
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
                                                                            <div className="blobLink" onClick={() => this.viewOrDownloadFile(this.dataURLtoFile(`data:${row.original.documentFileType};base64,${row.original.documentBase64String}`, row.original.documentFileName))} >
                                                                                {this.convertExpDate(row.original.expiryDate)}
                                                                            </div>
                                                                        ),
                                                                        // style: { textAlign: "center" },
                                                                    },
                                                                    {
                                                                        Header: 'DH Approved',
                                                                        accessor: 'departmentHeads',
                                                                        Cell: row => (
                                                                            <div className="blobLink" onClick={() => this.viewOrDownloadFile(this.dataURLtoFile(`data:${row.original.documentFileType};base64,${row.original.documentBase64String}`, row.original.documentFileName))} >
                                                                                {this.changeDeptHeads(row.original.departmentHeads)}
                                                                            </div>

                                                                        ),
                                                                        // style: { textAlign: "center" },
                                                                    },
                                                                ]}
                                                                keyField="documentId"

                                                            />
                                                        </ModalBody>
                                                        <ModalFooter>
                                                            <Button color="primary" block size="md" onClick={() => { this.addDocumentLTU(); this.hideDoc() }}>  Add </Button>
                                                        </ModalFooter>
                                                    </Modal>

                                                    <Collapse isOpen={taskDetails.documents.length !== 0}>
                                                        <div>
                                                            <br />
                                                            <Label>Documents</Label>
                                                            {/* <div className="tableWrap"> */}
                                                            <Table hover bordered responsive size="sm">
                                                                <thead>
                                                                    <tr>
                                                                        <th className="smallTd" >No.</th>
                                                                        <th>Document Name (English)</th>
                                                                        <th>Document Name (Chinese)</th>
                                                                        <th>Expiry Date</th>
                                                                        <th>DH Approved</th>
                                                                        <th className="smallTd" ></th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {taskDetails.documents.map((document, index) =>
                                                                        <tr key={index}>
                                                                            <td className="smallTd" >{index + 1}</td>
                                                                            <td>{document.documentNameEnglish}</td>
                                                                            <td>{document.documentNameChinese}</td>
                                                                            <td id="viewDoc">
                                                                                <div className="blobLink" onClick={() => this.viewOrDownloadFile(document.documentBase64String, document.documentFileType, document.documentFileName, document.documentUrl)} > {this.convertExpDate(document.expiryDate)} </div>
                                                                                {/* <a href={document.documentUrl} target='_blank' rel="noopener noreferrer">{this.convertExpDate(document.expiryDate)}</a> */}
                                                                            </td>
                                                                            <td id="viewDoc">
                                                                                <div className="blobLink" onClick={() => this.viewOrDownloadFile(document.documentBase64String, document.documentFileType, document.documentFileName, document.documentUrl)} > {this.changeDeptHeads(document.departmentHeads)} </div>
                                                                                {/* <a href={document.documentUrl} target='_blank' rel="noopener noreferrer">{this.changeDeptHeads(document.departmentHeads)}</a> */}
                                                                            </td>
                                                                            <td className="smallTd" ><img width="25px" onClick={() => this.deleteDocument("documentTableLTU", index)} src={deleteBin} /></td>
                                                                        </tr>
                                                                    )}
                                                                </tbody>
                                                            </Table>
                                                            {/* </div> */}
                                                        </div>
                                                    </Collapse>
                                                </div>
                                                : <div id="documents">
                                                    <Row form>

                                                        {taskDetails.applicationTypeId === "CNIPS"
                                                            ? <Col  >
                                                                <FormGroup>
                                                                    <InputGroup>
                                                                        <Input autoComplete="off" type="text" value={this.state.contractNumber} onChange={this.handleContractNumber} id="contractNumber" placeholder={this.state.contractNumNotes}></Input>
                                                                    </InputGroup>
                                                                    {!this.state.contractValid
                                                                        ? <small style={{ color: '#F86C6B' }} > {this.state.contractError} </small>
                                                                        : null
                                                                    }
                                                                </FormGroup>
                                                            </Col>
                                                            : ""}

                                                        <Col md>
                                                            <FormGroup>
                                                                {/* <Label>English Name</Label> */}
                                                                <Input value={editRequestForm.engName} onBlur={this.checkforChinese} onChange={this.handleDocumentChange("engName")} type="text" name="textarea-input" id="docName" maxLength="500" rows="3" placeholder="Please describe in English" />
                                                                {this.state.invalidEnglish
                                                                    ? <small style={{ color: '#F86C6B' }}> Please input only English characters </small>
                                                                    : null
                                                                }
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md>
                                                            <FormGroup>
                                                                {/* <Label>Chinese Name</Label> */}
                                                                <Input value={editRequestForm.cnName} onChange={this.handleDocumentChange("cnName")} type="text" name="textarea-input" id="cnName" rows="3" maxLength="500" placeholder="Please describe in Chinese (Optional)" />
                                                                {this.state.invalidChinese
                                                                    ? <small style={{ color: '#F86C6B' }}> Please input only Chinese characters </small>
                                                                    : null
                                                                }
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md>
                                                            <FormGroup>
                                                                {/* <Label>File Name</Label> */}
                                                                <CustomInput
                                                                    accept=".ipg, .png, .xls, .xlsm, .xlsx, .email, .jpeg, .txt, .rtf, .tiff, .tif, .doc, docx, .pdf, .pdfx, .bmp"
                                                                    id="docFileName" onChange={this.uploadDocument} type="file" bsSize="lg" color="primary" label={editRequestForm.docAttachedName} />
                                                                <small style={{ color: '#F86C6B' }} > {this.state.wrongDocError} </small>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col xl={1}>
                                                            <FormGroup>
                                                                {taskDetails.applicationTypeId === "CNIPS"
                                                                    ? <Button block onClick={this.addDocumentCNIPS}>Add</Button>
                                                                    : <Button block onClick={this.addDocumentLTI}>Add</Button>
                                                                }
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                    <InputGroup>
                                                        {taskDetails.applicationTypeId !== "LTU"
                                                            ? <small style={{ color: '#F86C6B' }} >{this.validator.message('Documents', taskDetails.documents, 'required')}</small>
                                                            : null}
                                                    </InputGroup>
                                                    <Collapse isOpen={taskDetails.documents.length !== 0}>
                                                        <div className="tableWrap">
                                                            <Table hover bordered responsive size="sm">
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
                                                                    {taskDetails.documents.map((document, index) =>
                                                                        <tr key={index}>
                                                                            <td className="smallTd">{index + 1}</td>
                                                                            {taskDetails.applicationTypeId === "CNIPS"
                                                                                ? <td> {document.contractNums.map((number, index) =>
                                                                                    <div key={index} > {number} </div>
                                                                                )} </td>
                                                                                : null}
                                                                            <td className="descTd">{document.documentNameEnglish}</td>
                                                                            <td className="descTd">{document.documentNameChinese}</td>
                                                                            <td id="viewDoc">
                                                                                <div className="blobLink" onClick={() => this.viewOrDownloadFile(document.documentBase64String, document.documentFileType, document.documentFileName, document.documentUrl)} > {document.documentFileName} </div>
                                                                                {/* <a href={document.documentUrl} target='_blank' rel="noopener noreferrer">{document.documentFileName}</a> */}
                                                                            </td>
                                                                            <td className="smallTd"><img width="25px" onClick={() => this.deleteDocument("documentTableLTI", index)} src={deleteBin} /></td>
                                                                        </tr>
                                                                    )}
                                                                </tbody>
                                                            </Table>
                                                        </div>
                                                    </Collapse>
                                                </div>}
                                        </FormGroup>

                                        <FormGroup>
                                            <Label>Purpose of Use</Label>
                                            <InputGroup>
                                                <TextareaAutosize maxLength={500} onChange={this.handleChange("purposeOfUse")} value={taskDetails.purposeOfUse} placeholder="Enter the Purpose of Use" className="form-control" name="textarea-input" id="purposeOfUse" />
                                                {/* <FormFeedback>Please input the purpose of use</FormFeedback> */}
                                            </InputGroup>
                                            <InputGroup>
                                                <small style={{ color: '#F86C6B' }} >{this.validator.message('Purpose Of Use', taskDetails.purposeOfUse, 'required')}</small>
                                            </InputGroup>
                                        </FormGroup>

                                        <Collapse isOpen={taskDetails.applicationTypeId !== "LTI"}>


                                            <FormGroup>
                                                <Label>Number of Pages to Be Chopped</Label>
                                                <InputGroup>
                                                    <Input onChange={this.handleChange("numOfPages")} value={taskDetails.numOfPages} id="numOfPages" size="16" type="number" min="0" />
                                                </InputGroup>
                                                <InputGroup>
                                                    {this.state.invalidNumberOfPages
                                                        ? <small style={{ color: '#F86C6B' }} >Number of pages cannot be more than 9</small>
                                                        : null
                                                    }
                                                    {taskDetails.applicationTypeId !== "LTI"
                                                        ? <small style={{ color: '#F86C6B' }} >{this.validator.message('Number of Pages to be Chopped', taskDetails.numOfPages, 'required')}</small>
                                                        : null}
                                                </InputGroup>
                                            </FormGroup>

                                            <FormGroup>
                                                <Label>Connecting Chop (骑缝章) </Label>
                                                <Row />
                                                <AppSwitch id="connectChop" dataOn={'yes'} onChange={this.toggleConnection} checked={taskDetails.connectChop === "Y"} dataOff={'no'} className={'mx-1'} variant={'3d'} color={'primary'} outline={'alt'} label></AppSwitch>

                                            </FormGroup>
                                        </Collapse>

                                        <Collapse isOpen={taskDetails.applicationTypeId !== "LTU" && taskDetails.applicationTypeId !== "LTI"}>
                                            <FormGroup>
                                                <Label>Use in Office</Label>
                                                <Row />
                                                <AppSwitch onChange={this.toggleUIO} checked={taskDetails.isUseInOffice === "Y"} id="useOff" className={'mx-1'} variant={'3d'} color={'primary'} outline={'alt'} label dataOn={'yes'} dataOff={'no'} />
                                            </FormGroup>
                                        </Collapse>

                                        <Collapse isOpen={!editRequestForm.collapseUIO}>
                                            <FormGroup visibelity="false" >
                                                <Label>Return Date</Label>
                                                <Row />
                                                <DatePicker id="returnDate" placeholderText="YYYY/MM/DD" popperPlacement="auto-center" showPopperArrow={false} todayButton="Today"
                                                    className="form-control" required dateFormat="yyyy/MM/dd" withPortal
                                                    selected={this.state.dateView2}
                                                    isClearable
                                                    onChange={this.dateChange("returnDate", "dateView2")}
                                                    minDate={new Date()} maxDate={addDays(new Date(), 30)} />
                                            </FormGroup>
                                            {!editRequestForm.collapseUIO
                                                ? <InputGroup>
                                                    <small style={{ color: '#F86C6B' }} >{this.validator.message('Return Date', taskDetails.returnDate, 'required')}</small>
                                                </InputGroup> : null}

                                            <FormGroup>
                                                <Label>Responsible Person <i className="fa fa-user" /></Label>
                                                <AsyncSelect id="responsiblePerson"
                                                    classNamePrefix="rs"
                                                    loadOptions={this.loadAllUsers}
                                                    isClearable
                                                    value={taskDetails.responsiblePersonOption}
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
                                                <Input maxLength={200} onChange={this.handleChange("addressTo")} value={taskDetails.addressTo} type="textarea" name="textarea-input" id="addressTo" rows="3" placeholder="Documents will be addressed to" />
                                                {/* <FormFeedback>Invalid person to address to</FormFeedback> */}
                                            </InputGroup>
                                            <InputGroup>
                                                <small style={{ color: '#F86C6B' }} >{this.validator.message('Address To', taskDetails.addressTo, 'required')}</small>
                                            </InputGroup>
                                        </FormGroup>

                                        <Collapse isOpen={taskDetails.applicationTypeId !== "LTI"}>
                                            <FormGroup>
                                                <Label>Pick Up By <i className="fa fa-user" /> </Label>
                                                <AsyncSelect
                                                    id="pickUpBy"
                                                    loadOptions={this.loadAllUsers}
                                                    isClearable
                                                    value={taskDetails.pickUpByOption}
                                                    onChange={this.handleSelectOption("pickUpBy")}
                                                    menuPortalTarget={document.body}
                                                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                />
                                                <InputGroup>
                                                    {taskDetails.applicationTypeId !== "LTI"
                                                        ? <small style={{ color: '#F86C6B' }} >{this.validator.message('Pick Up By', taskDetails.pickUpBy, 'required')}</small>
                                                        : null}
                                                </InputGroup>

                                            </FormGroup>
                                        </Collapse>

                                        <FormGroup>
                                            <Label>Remark <small className="ml-2"> Please enter the remarks, e.g. telephone number of pick up person.</small> </Label>
                                            <InputGroup>
                                                <TextareaAutosize maxLength={500} onChange={this.handleChange("remark")} value={taskDetails.remark} id="remark" size="16" className="form-control" placeholder="Please enter the remarks, e.g. telephone number of pick up person." />
                                                {/* <FormFeedback>Please add remarks</FormFeedback> */}
                                            </InputGroup>
                                            <InputGroup>
                                                <small style={{ color: '#F86C6B' }} >{this.validator.message('Remark', taskDetails.remark, 'required')}</small>
                                            </InputGroup>
                                        </FormGroup>

                                        <Collapse isOpen={taskDetails.applicationTypeId === "LTI" || taskDetails.applicationTypeId === "LTU"}>
                                            <FormGroup>
                                                <Label>Document Check By <i className="fa fa-user" /> PB7 or above</Label>
                                                {taskDetails.applicationTypeId === "LTI" ?
                                                    <AsyncSelect
                                                        id="documentCheckBy"
                                                        loadOptions={this.loadAllUsers}
                                                        isMulti={true}
                                                        value={selectedDocCheckBy}
                                                        onChange={this.handleSelectOption("documentCheckBy")}
                                                        menuPortalTarget={document.body}
                                                        components={animatedComponents}
                                                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                    />
                                                    :
                                                    <Select
                                                        id="documentCheckBy"
                                                        options={docCheckBy}
                                                        isClearable
                                                        value={this.state.selectedOption.documentCheckBy}
                                                        menuPortalTarget={document.body}
                                                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                        onChange={this.handleSelectOption("documentCheckBy1")}
                                                    />
                                                }
                                                <InputGroup>
                                                    {taskDetails.applicationTypeId === "LTI" || taskDetails.applicationTypeId === "LTU"
                                                        ? <small style={{ color: '#F86C6B' }} >{this.validator.message('Document Check By', taskDetails.documentCheckBy, 'required')}</small>
                                                        : null}
                                                </InputGroup>
                                            </FormGroup>
                                        </Collapse>

                                        <Collapse isOpen={taskDetails.applicationTypeId === "CNIPS"}>
                                            <FormGroup>
                                                <Label>Contract Signed By: <i className="fa fa-user" /></Label>
                                                <small className="ml-2"> Please fill in the DHs who signed the contract and keep in line with MOA; If for Direct Debit Agreements, Head of FGS and Head of Treasury are needed for approval.</small>
                                                <Row>
                                                    <Col className="py-2" xs={12} md={6} lg={6}>
                                                        <AsyncSelect
                                                            id="contractSignedByFirstPerson"
                                                            isClearable
                                                            loadOptions={this.loadOptionsDeptContract1}
                                                            value={taskDetails.contractSignedByFirstPersonOption}
                                                            onChange={this.handleSelectOption("contractSignedByFirstPerson")}
                                                            menuPortalTarget={document.body}
                                                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                        />
                                                        <InputGroup>
                                                            {taskDetails.applicationTypeId === "CNIPS"
                                                                ? <small style={{ color: '#F86C6B' }} >{this.validator.message('Contract Signed By: ', taskDetails.contractSignedByFirstPerson, 'required')}</small>
                                                                : null}
                                                        </InputGroup>
                                                    </Col>
                                                    <Col className="py-2" xs={12} md={6} lg={6}>
                                                        <AsyncSelect
                                                            id="contractSignedBySecondPerson"
                                                            isClearable
                                                            loadOptions={this.loadOptionsDeptContract2}
                                                            value={taskDetails.contractSignedBySecondPersonOption}
                                                            onChange={this.handleSelectOption("contractSignedBySecondPerson")}
                                                            menuPortalTarget={document.body}
                                                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                        />
                                                        <InputGroup>
                                                            {taskDetails.applicationTypeId === "CNIPS"
                                                                ? <small style={{ color: '#F86C6B' }} >{this.validator.message('Contract Signed By: ', taskDetails.contractSignedBySecondPerson, 'required')}</small>
                                                                : null}
                                                        </InputGroup>
                                                    </Col>
                                                </Row>
                                            </FormGroup>
                                        </Collapse>

                                        {/* <Collapse isOpen={taskDetails.applicationTypeId === "LTU"}>
                                    <FormGroup>
                                        <Label>Document Check By <i className="fa fa-user" /></Label>
                                        <AsyncSelect
                                            id="documentCheckBy"
                                            menuPortalTarget={document.body}
                                            onChange={this.handleSelectOption("documentCheckBy1")}
                                            loadOptions={this.loadOptionsDocCheck}
                                            value={docCheckBy[taskDetails.docCheckByOption]}
                                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }} />
                                        <InputGroup>
                                            <small style={{ color: '#F86C6B' }} >{this.validator.message('Document Check By', taskDetails.documentCheckBy, 'required')}</small>
                                        </InputGroup>
                                    </FormGroup>
                                </Collapse> */}

                                        <Collapse isOpen={taskDetails.applicationTypeId === "STU" || taskDetails.applicationTypeId === "LTI" || taskDetails.applicationTypeId === ""}>
                                            <FormGroup>
                                                <Label>Department Heads <i className="fa fa-user" /></Label>
                                                <small> &ensp; If you apply for {this.props.legalName} Company Chop, then Department Head shall be from {this.legalName} entity.</small>
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
                                                    {taskDetails.applicationTypeId === "STU" || taskDetails.applicationTypeId === "LTI"
                                                        ? <small style={{ color: '#F86C6B' }} >{this.validator.message('Department Heads', taskDetails.departmentHeads, 'required')}</small>
                                                        : null}
                                                </InputGroup>
                                            </FormGroup>
                                        </Collapse>

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
                                                        <Label onClick={this.handleAgreeTerm} className="form-check-label" check >
                                                            By ticking the box, I confirm that I hereby acknowledge that I must comply the internal Policies and Guidelines
                                                            regarding chop management and I will not engage in any inappropriate chop usage and other inappropriate action.
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
                                            <Col className="d-flex justify-content-start">
                                                {taskDetails.isConfirm === "Y"
                                                    ? <Button type="submit" color="success" onClick={() => { this.submitRequest('Y') }}>Submit</Button>
                                                    : <Button type="submit" color="success"
                                                        // onMouseEnter={() => this.setState({ tooltipOpen: !this.state.tooltipOpen })}
                                                        id="disabledSubmit" disabled >Submit</Button>}
                                                {/* <Tooltip placement="left" isOpen={this.state.tooltipOpen} target="disabledSubmit"> */}
                                                {/* please confirm the agree terms </Tooltip> */}
                                                <span>&nbsp;</span>
                                                <Button type="submit" color="primary" onClick={() => { this.submitRequest('N') }}>Save</Button>
                                            </Col>
                                            <Col className="d-flex justify-content-end">
                                                <Button onClick={this.deleteTask} color="danger" >Delete</Button>
                                            </Col>
                                        </Row>
                                        {taskDetails.histories.length !== 0 ? <hr></hr> : null}
                                        <Row>
                                            <Col>
                                                {taskDetails.histories.length !== 0
                                                    ? <>
                                                        <Row>
                                                            <Col><h4>Approval Histories</h4></Col>
                                                        </Row>
                                                        {taskDetails.histories.map((history, index) =>
                                                            <div key={index}>
                                                                <hr></hr>
                                                                <Row className="text-md-left text-center">
                                                                    <Col sm md="10" lg>
                                                                        <h5>{history.approvedByName}<span> <Badge color={history.stateIndicatorColor.toLowerCase()}>{history.stateIndicator}</Badge></span></h5>
                                                                        <h6><Badge className="mb-1" color="light">{this.convertApprovedDate(history.approvedDate)}</Badge></h6>
                                                                        <Col className="p-0"> <p>{history.comments}</p> </Col>
                                                                    </Col>
                                                                </Row>
                                                            </div>
                                                        )}
                                                    </>
                                                    : null
                                                }
                                            </Col>
                                        </Row>
                                    </div>
                                </CardFooter>
                            </Card>
                            : <div className="animated fadeIn pt-1 text-center" ><Spinner /></div>
                        }
                        <Modal backdrop="static" color="info" isOpen={this.state.modal} toggle={this.toggleModal} className={'modal-info ' + this.props.className} >
                            <ModalHeader className="center" toggle={this.changeSelect}> Contract Chop </ModalHeader>
                            <ModalBody>
                                <div>
                                    {ContextValue.legalEntity.contractChop}
                                    <p className="h6">Do you confirm to apply Contract Chop for your documents?</p>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="success" onClick={this.toggleModal} size="md"> Yes </Button>
                                <Button color="secondary" onClick={this.changeSelect} size="md"> No </Button>
                            </ModalFooter>
                        </Modal>
                    </div>
                )
            }
            </LegalEntity.Consumer>
        )
    }
}
export default EditRequest; 