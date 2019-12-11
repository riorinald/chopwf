import React, { Component } from 'react';
import { AppSwitch } from '@coreui/react';
import axios from 'axios';
import Swal from 'sweetalert2';
import theme from './theme.css'
import deleteBin from '../../assets/img/deletebin.png'
import InputMask from "react-input-mask";
import AsyncSelect from 'react-select/async';
import makeAnimated from 'react-select/animated';
import SimpleReactValidator from 'simple-react-validator';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { addDays } from 'date-fns';
import config from '../../config';
import { STU, LTU, LTI, CNIPS } from '../../config/validation';
import { resetMounted } from '../MyPendingTasks/MyPendingTasks'
import ReactTable from "react-table";
import "react-table/react-table.css"
import selectTableHOC from "react-table/lib/hoc/selectTable";
import PropTypes from "prop-types";
import LegalEntity from '../../context';
// import Skeleton from 'react-loading-skeleton';

import {
  Badge,
  Button,
  CustomInput,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Collapse,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  FormFeedback,
  Table,
  Tooltip,
  UncontrolledTooltip,
} from 'reactstrap';


const SelectTable = selectTableHOC(ReactTable);

const animatedComponents = makeAnimated();


class Create extends Component {

  static defaultProps = {
    keyField: "documentId"
  };

  static propTypes = {
    keyField: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {

      selectAll: false,
      selection: [],

      legalName: this.props.legalName,
      //retrieve from department Types Table
      department: [],
      //retrieve from application types table
      applicationTypes: [],
      //retrieve from chop types table
      chopTypes: [],

      //retrieve from DH table
      deptHead: [],
      teams: [],
      branches: [],
      collapse: true,
      modal: false,
      valid: false,
      inOffice: false,

      users: [],
      docCheckBy: [],

      CNIPS: false,

      userId: "",

      //data to be created inside Request Table
      employeeId: 0,    //retrieved from user Info
      telNumber: 0,      //retrieved from user Info
      contractNum: "",
      deptSelected: "",
      appTypeSelected: "",
      chopTypeSelected: "",
      returnDate: "",
      resPerson: "",
      purposeOfUse: "",
      numOfPages: 0,
      addressTo: "",
      pickUpBy: "",
      remarks: "",
      deptHeadSelected: [],
      docCheckByLTI: [],
      contractSign1: "",
      contractSign2: "",
      effectivePeriod: "",
      selectedFiles: [],
      fileName: "Choose File",
      teamSelected: "",
      connectingChop: false,
      docCheckBySelected: "",
      branchSelected: "",

      documentTableLTI: [],
      documentTableLTU: [],
      selectedDocs: [],
      documents: [],

      agreeTerms: false,
      showBranches: false,

      engName: "",
      cnName: "",
      docSelected: null,
      docAttachedName: "Choose File",

      showDoc: false,
      hover: false,

      isSTU: false,
      isLTU: false,
      isLTI: false,
      isCNIPS: false,

      tooltipOpen: false,

      dateView1: "",
      dateView2: "",

      reqInfo: [
        { id: "deptSelected", valid: false },
        { id: "appTypeSelected", valid: false },
        { id: "chopTypeSelected", valid: false },
        { id: "purposeOfUse", valid: false },
        { id: "numOfPages", valid: false },
        { id: "addressTo", valid: false },
        { id: "pickUpBy", valid: false },
        { id: "remarks", valid: false },
        { id: "deptHeadSelected", valid: false },
        { id: "documentTableLTI", valid: false },
      ],
      noteInfo: [],
      inputMasak: "*-aa-*-9999-9999",
      selectInfo: ''

    };


    //binding method for button
    this.toggle = this.toggle.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.handleAgreeTerm = this.handleAgreeTerm.bind(this);
    this.submitRequest = this.submitRequest.bind(this);
    this.validate = this.validate.bind(this);
    this.addDocumentLTI = this.addDocumentLTI.bind(this);
    this.addDocumentLTU = this.addDocumentLTU.bind(this);
    this.toggleHover = this.toggleHover.bind(this);
    this.handleSelectOption = this.handleSelectOption.bind(this);
    this.isValid = this.isValid.bind(this);
    this.checkDept = this.checkDept.bind(this);
    this.validator = new SimpleReactValidator({ autoForceUpdate: this, locale: 'en' });
    this.formRef = React.createRef()
    this.selectDocument = this.selectDocument.bind(this);
    this.toggleConnection = this.toggleConnection.bind(this)
    this.getDocuments = this.getDocuments.bind(this)
  };

  componentDidMount() {

    this.getData("noteInfo", 'http://5b7aa3bb6b74010014ddb4f6.mockapi.io/config/1');
    this.getUserData();
    this.getData("department", `${config.url}/departments`);
    this.getData("applicationTypes", `${config.url}/apptypes`);
    this.getData("chopTypes", `${config.url}/choptypes?companyid=` + this.props.legalName);
    resetMounted.setMounted()


  }

  componentWillReceiveProps() {
    this.forceUpdate()
  }

  validate() {
    for (let i = 0; i < this.state.reqInfo.length; i++) {
      if (this.state[this.state.reqInfo[i].id].length >= 1 && this.state[this.state.reqInfo[i].id] !== "") {
        this.setState(state => {
          const reqInfo = state.reqInfo.map((item, j) => {
            if (j === i) {
              var element = document.getElementById(this.state.reqInfo[i].id)
              element.classList.contains("form-control")
                ? element.className = "is-valid form-control"
                : element.className = "isValid"
              return { id: item.id, valid: true }
            }
            else { return item }
          })
          return { reqInfo }
        })
      }
      else {
        this.setState(state => {
          const reqInfo = state.reqInfo.map((item, j) => {
            if (j === i) {
              var element = document.getElementById(item.id)
              element.classList.contains("form-control")
                ? element.className = "is-invalid form-control"
                : element.className = "notValid"
              return { id: item.id, name: item.name, valid: false }
            }
            else { return item }
          })
          return { reqInfo }
        })
      }
    }
    if (!this.state.collapse) {
      let dateValid = false;
      let resValid = false;
      if (this.state.returnDate !== "") {
        document.getElementById("returnDate").className = "is-valid form-control"
        dateValid = true
      }
      else {
        document.getElementById("returnDate").className = "is-invalid form-control"
        dateValid = false
      }
      if (this.state.resPerson !== "") {
        document.getElementById("resPerson").className = "isValid"
        resValid = true
      }
      else {
        document.getElementById("resPerson").className = "notValid"
        resValid = false
      }
      if (dateValid && resValid) {
        this.setState({ inOffice: true })
      }
      else {
        this.setState({ inOffice: false })
      }
    }
    else {
      this.setState({ inOffice: true })
    }
  }

  checkDept() {
    if (this.state.deptSelected === "") {
      Swal.fire({
        type: 'info',
        label: 'required',
        text: 'department is required to show list of department Head'
      })
    }
  }

  async handleAgreeTerm(event) {
    await this.validate()
    for (let i = 0; i < this.state.reqInfo.length; i++) {
      if (this.state.reqInfo[i].valid) {
        this.setState({ valid: true })
      }
      else {
        this.setState({ valid: false })
        break;
      }
    }
    if (this.state.valid && this.state.inOffice) {
      this.setState({ agreeTerms: true })
    }
  }

  async isValid() {
    await this.validate()
    for (let i = 0; i < this.state.reqInfo.length; i++) {
      if (this.state.reqInfo[i].valid) {
        this.setState({ valid: true })
      }
      else {
        this.setState({ valid: false, agreeTerms: false })
        break;
      }
    }
    if (this.state.valid && this.state.inOffice) {
      this.setState({ agreeTerms: true })
    }
  }

  async submitRequest(isSubmitted) {
    let useInOffice = "Y"
    let isConnectChop = "N"
    let IsConfirmed = "N"

    useInOffice = this.state.collapse ? "Y" : "N"
    isConnectChop = this.state.connectingChop ? "Y" : "N"
    IsConfirmed = this.state.agreeTerms ? "Y" : "N"

    let postReq = new FormData();
    postReq.append("UserId", this.state.userId);
    postReq.append("EmployeeNum", this.state.employeeId);
    postReq.append("TelephoneNum", this.state.telNumber);
    postReq.append("CompanyId", this.props.legalName);
    postReq.append("DepartmentId", this.state.deptSelected);
    postReq.append("ApplicationTypeId", this.state.appTypeSelected);
    postReq.append("ContractNum", this.state.contractNum);
    postReq.append("ChopTypeId", this.state.chopTypeSelected);
    postReq.append("TeamId", this.state.teamSelected);
    postReq.append("PurposeOfUse", this.state.purposeOfUse);
    postReq.append("NumOfPages", this.state.numOfPages);
    postReq.append("IsUseInOffice", useInOffice);
    postReq.append("AddressTo", this.state.addressTo);
    postReq.append("PickUpBy", this.state.pickUpBy);
    postReq.append("Remark", this.state.remarks);
    postReq.append("IsConfirmed", IsConfirmed);
    postReq.append("ReturnDate", this.state.returnDate);
    postReq.append("ResponsiblePerson", this.state.resPerson);
    postReq.append("ContractSignedByFirstPerson", this.state.contractSign1);
    postReq.append("ContractSignedBySecondPerson", this.state.contractSign2);
    postReq.append("EffectivePeriod", this.state.effectivePeriod);
    postReq.append("IsSubmitted", isSubmitted);
    postReq.append("isConnectChop", isConnectChop);
    postReq.append("BranchId", this.state.branchSelected)
    postReq.append("DocumentCheckBy", this.state.docCheckBySelected)

    for (let i = 0; i < this.state.documentTableLTI.length; i++) {
      postReq.append(`Documents[${i}].Attachment.File`, this.state.documentTableLTI[i].docSelected);
      postReq.append(`Documents[${i}].DocumentNameEnglish`, this.state.documentTableLTI[i].engName);
      postReq.append(`Documents[${i}].DocumentNameChinese`, this.state.documentTableLTI[i].cnName);

    }

    for (let i = 0; i < this.state.documentTableLTU.length; i++) {
      postReq.append(`DocumentIds[${i}]`, this.state.documentTableLTU[i].documentId);
    }


    //multiple dept. Heads
    for (let i = 0; i < this.state.deptHeadSelected.length; i++) {
      postReq.append(`DepartmentHeads[${i}]`, this.state.deptHeadSelected[i].value);
    }

    for (let i = 0; i < this.state.docCheckByLTI.length; i++) {
      postReq.append(`DocumentCheckBy[${i}]`, this.state.docCheckByLTI[i].value);
    }


    for (var pair of postReq.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }


    if (isSubmitted === 'N' && this.validator.allValid()) {
      this.postData(postReq, isSubmitted)
    }
    else if (this.validator.allValid() === false) {
      Swal.fire({
        type: 'info',
        title: 'required',
        text: 'The application type field is required'
        // Object.values(JSON.parse(JSON.stringify(this.validator.getErrorMessages())))
      })
      this.validator.showMessages();
    }

    else if (this.state.valid && this.state.inOffice) {
      this.postData(postReq, isSubmitted)
    }

  }

  checkDepartment = () => {
    if (this.state.deptSelected === "") {
      this.setState({ selectInfo: 'please select the Department' })
    } else {
      this.setState({ selectInfo: '' })
    }
  }

  //toggle useInOffice
  toggle() {
    this.setState({
      collapse: !this.state.collapse,
    });

  }
  toggleConnection() {
    this.setState({ connectingChop: !this.state.connectingChop })
  }
  //toggle Modal
  toggleModal() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  toggleHover() {
    this.setState({ hover: !this.state.hover })
  }

  changeSelect = () => {
    this.setState({
      modal: !this.state.modal,
    });
    document.getElementById("chopTypeSelected").value = "0"
  }

  Axios
  async getData(state, url) {
    try {
      const response = await axios.get(url);
      this.setState({
        [state]: response.data
      })
    } catch (error) {
      console.error(error);
    }
  }

  async getDocuments(companyId, deptId, chopTypeId, teamId) {
    // let url = `${config.url}/documents?companyid=mbafc&departmentid=itafc&choptypeid=comchop&teamid=mbafcit`
    let url = `${config.url}/documents?companyid=` + companyId + '&departmentid=' + deptId + '&choptypeid=' + chopTypeId + '&teamid=' + teamId;

    try {
      await axios.get(url).then(res => {
        this.setState({ documents: res.data })
      })
    } catch (error) {
      console.error(error)
    }
  }

  async postData(formData, isSubmitted) {
    try {
      await axios.post(`${config.url}/tasks`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        .then(res => {
          if (isSubmitted === 'N') {
            Swal.fire({
              title: res.data.status === 200 ? 'Request Saved' : '',
              text: 'Request Number : ' + res.data.requestNum,
              footer: 'Your request is saved as draft.',
              type: 'info',
              onClose: () => { this.formReset() }
            })
          }
          if (isSubmitted === 'Y') {
            Swal.fire({
              title: res.data.status === 200 ? 'Request Submitted' : "",
              text: 'Request Number : ' + res.data.requestNum,
              footer: 'Your request is being processed and is waiting for the approval',
              type: 'success',
              onClose: () => { this.formReset() }
            })
          }
        })
    } catch (error) {
      if (error.response && isSubmitted === 'N') {
        Swal.fire({
          title: error.response.statusText,
          text: error.response.data.message,
          footer: JSON.stringify(error.response.data),
          type: 'error',
        })
      }
      if (error.response && isSubmitted === 'Y') {
        Swal.fire({
          title: error.response.statusText,
          text: JSON.stringify(error.response.data),
          footer: 'traceId : ' + error.response.data.traceId,
          type: 'error',
        })
      }
      console.error(error.response);
    }
  }

  formReset() {
    this.formRef.current.reset()
    window.location.reload();
  }
  convertExpDate(dateValue) {
    let regEx = dateValue.replace(/(\d{4})(\d{2})(\d{2})/g, '$1/$2/$3')
    return regEx;
  }
  changeDeptHeads(heads) {
    let dh = ""
    heads.map(head => {
      dh = dh + head + "; "
    })
    return dh
  }

  async getUserData() {
    let ticket = localStorage.getItem('ticket')
    let userId = localStorage.getItem('userId')
    // let userId = "josh@otds.admin"
    // let userId = "daniel@otds.admin"
    await axios.get(`${config.url}/users/` + userId, { headers: { 'ticket': ticket } })
      .then(res => {
        this.setState({ employeeId: res.data.employeeNum, telNumber: res.data.telephoneNum, userId: userId })
      })
  }

  async getDeptHead(companyId) {

    await axios.get(`${config.url}/users?companyid=` + companyId + '&displayname=&excludeuserid=' + this.state.userId)
      .then(res => {
        this.setState({ deptHead: res.data })
      })
  }

  async getDocCheckBy(displayName) {
    await axios.get(`${config.url}/users?displayname=` + displayName + '&excludeuserid=' + this.state.userId)
      .then(res => {
        this.setState({ docCheckBy: res.data })
      })
  }

  async getTeams(deptId) {
    let url = `${config.url}/teams?companyid=` + this.props.legalName + "&departmentId=" + deptId
    await axios.get(url).then(res => {
      this.setState({ teams: res.data })
    })
  }

  async getChopTypes(companyId, appTypeId) {
    await axios.get(`${config.url}/choptypes?companyid=` + companyId + '&apptypeid=' + appTypeId)
      .then(res => {
        this.setState({ chopTypes: res.data })
      })
  }

  //handle value on changes
  handleChange = name => event => {

    //APPLICATION TYPE
    if (name === "appTypeSelected") {

      //Clear Doc Table and agreeTerms
      this.setState({ documentTableLTI: [], documentTableLTU: [], agreeTerms: false })

      //Update Chop Types
      this.getChopTypes(this.props.legalName, event.target.value)

      //LONG TERM INITIATION
      if (event.target.value === "LTI") {
        this.setState({
          isSTU: false,
          isLTU: false,
          isLTI: true,
          isCNIPS: false,
          reqInfo: LTI
        })
        if (this.state.deptSelected !== "") {
          this.getTeams(this.state.deptSelected)
        }
      }

      //LONG TERM USE
      else if (event.target.value === "LTU") {
        this.setState({
          isSTU: false,
          isLTU: true,
          isLTI: false,
          isCNIPS: false,
          reqInfo: LTU
        })
        this.getDocCheckBy("")

        if (this.state.deptSelected !== "") {
          this.getTeams(this.state.deptSelected)
          if (this.state.teamSelected !== "" && this.state.chopTypeSelected !== "" && this.state.deptSelected !== "") {
            this.getDocuments(this.props.legalName, this.state.deptSelected, this.state.chopTypeSelected, this.state.teamSelected)
          }
        }
      }

      //SHORT - TERM USE
      else if (event.target.value === "STU") {
        this.setState({
          isSTU: true,
          isLTU: false,
          isLTI: false,
          isCNIPS: false,
          reqInfo: STU
        })
      }

      //CONTRACT NON - IPS
      else if (event.target.value === "CNIPS") {
        this.setState({
          isSTU: false,
          isLTU: false,
          isLTI: false,
          isCNIPS: true,
          reqInfo: CNIPS
        })
      }
    }

    //CHOP TYPE
    else if (name === "chopTypeSelected") {
      if (this.state.deptSelected !== "" && this.state.teamSelected !== "" && this.state.isLTU) {
        this.getDocuments(this.props.legalName, this.state.deptSelected, event.target.value, this.state.teamSelected)
      }

      if (event.target.value === "BCSCHOP") {
        this.setState({ showBranches: true })
        this.getData("branches", `${config.url}/branches?companyid=mblc`)
      }

      else {
        this.setState({ showBranches: false })
      }

      if (event.target.value === "CONCHOP") {
        this.toggleModal();
      }


    }

    //DEPARTMENT
    else if (name === "deptSelected") {
      this.getDeptHead(this.props.legalName)
      if (this.state.isLTU || this.state.isLTI) {
        this.getTeams(event.target.value)
      }
      if (this.state.teamSelected !== "" && this.state.chopTypeSelected !== "" && this.state.isLTU) {
        this.getDocuments(this.props.legalName, event.target.value, this.state.chopTypeSelected, this.state.teamSelected)
      }
    }

    //ENTITLED TEAM
    else if (name === "teamSelected") {
      if (this.state.chopTypeSelected !== "" && this.state.isLTU) {
        this.getDocuments(this.props.legalName, this.state.deptSelected, this.state.chopTypeSelected, event.target.value)
      }
    }

    this.setState({
      [name]: event.target.value
    },
      () => { this.checkDepartment() }
    );
    if (event.target.value) {
      event.target.className = "form-control"
    }


    else {
      event.target.className = "is-invalid form-control"
    }
  };


  handleInputMask = (event) => {
    let value = ("" + event.target.value).toUpperCase();
    this.setState({
      contractNum: value
    });
    if (/^..[ALRalr]/.test(event.target.value)) {
      this.setState({
        inputMasak: "*-a-*-9999-9999",
      });
    }
    else {
      this.setState({
        inputMasak: "*-aa-*-9999-9999",
      });
    }
  }


  deleteDocument(table, i) {
    this.setState(state => {
      if (table === "documentTableLTU") {
        const documentTableLTU = state.documentTableLTU.filter((item, index) => i !== index)
        return {
          documentTableLTU
        }
      }
      else if (table === "documentTableLTI") {
        const documentTableLTI = state.documentTableLTI.filter((item, index) => i !== index)
        return {
          documentTableLTI
        }
      }
    })
  }

  addDocumentLTI() {
    var maxNumber = 45;
    var rand = Math.floor((Math.random() * maxNumber) + 1);
    let valid = true
    let doc = this.state.documentTableLTI
    if (this.state.docSelected !== null) {

      for (let i = 0; i < doc.length; i++) {
        console.log(doc[i].engName, doc[i].cnName, doc[i].docName)
        if (doc[i].engName === this.state.engName && doc[i].cnName === this.state.cnName && doc[i].docName === this.state.docAttachedName) {
          valid = false
          break
        }
        else {
          valid = true
        }
      }

      if (valid) {
        const obj = {
          id: rand,
          engName: this.state.engName,
          cnName: this.state.cnName,
          docSelected: this.state.docSelected,
          docName: this.state.docAttachedName,
          docURL: URL.createObjectURL(this.state.docSelected),
        }

        this.setState(state => {
          const documentTableLTI = state.documentTableLTI.concat(obj)

          return {
            documentTableLTI
          }
        })
        this.setState({ engName: "", cnName: "", docSelected: null, docAttachedName: "" })
      }
      else {
        Swal.fire({
          title: "Document Exists",
          html: 'The selected document already exists!',
          type: "warning"
        })
      }

    }
  }

  addDocumentLTU() {
    if (this.state.selectedDocs.length !== 0) {
      this.setState({ documentTableLTU: this.state.selectedDocs })
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

  uploadDocument = event => {
    if (event.target.files[0]) {
      this.setState({
        docSelected: event.target.files[0],
        docAttachedName: event.target.files[0].name

      })
    }
  }

  handleSelectOption = sname => newValue => {
    if (sname === "deptHeadSelected" || sname === "docCheckByLTI") {
      this.setState({ [sname]: newValue })
    }
    else {
      this.setState({ [sname]: newValue.value })
    }
  }

  // addDocCheck(row) {
  //   this.setState({ selectedDocs: row })
  // }

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

  dateChange = (name, view) => date => {
    let dates = date.toISOString().substr(0, 10);
    console.log(dates)
    this.setState({
      [name]: dates.replace(/-/g, ""),
      [view]: date
    });
  };

  //scroll To Function
  // scrollToRef = (ref) => window.scrollTo(0, ref)

  render() {
    const deptHeads = []
    const docCheckByUsers = []
    var pointer;
    const { hover, docCheckBy, deptHead } = this.state;
    for (let i = 0; i < deptHead.length; i++) {
      const obj = { value: deptHead[i].userId, label: deptHead[i].displayName }
      deptHeads.push(obj)
    }
    docCheckBy.map(doc => {
      const obj = { value: doc.userId, label: doc.displayName }
      docCheckByUsers.push(obj)
    })

    if (hover) {
      pointer = { cursor: 'pointer' }
    }
    else {
      pointer = {}
    }

    const reactSelectControl = {
      control: styles => ({ ...styles, borderColor: '#F86C6B', boxShadow: '0 0 0 0px #F86C6B', ':hover': { ...styles[':hover'], borderColor: '#F86C6B' } }),
      menuPortal: base => ({ ...base, zIndex: 9999 })
    }

    const filterColors = (inputValue) => {
      return deptHeads.filter(i =>
        i.label.toLowerCase().includes(inputValue.toLowerCase())
      );
    };

    const filterDocCheck = (inputValue) => {
      return docCheckByUsers.filter(i =>
        i.label.toLowerCase().includes(inputValue.toLowerCase())
      );
    }

    const loadOptions = (inputValue, callback) => {

      callback(filterColors(inputValue));

    }

    const loadDocCheckBy = (inputValue, callback) => {
      callback(filterDocCheck(inputValue));
    }


    const DocTable = <div className="tableWrap">
      <Table hover bordered responsive size="sm">
        <thead>
          <tr>
            <th className="smallTd" >No.</th>
            <th>Document Name in English</th>
            <th>Document Name in Chinese</th>
            <th>Attached File</th>
            <th className="smallTd"></th>
          </tr>
        </thead>
        <tbody>
          {this.state.documentTableLTI.map((document, index) =>
            <tr key={index}>
              <td className="smallTd">{index + 1}</td>
              <td><div>{document.engName}</div></td>
              <td><div>{document.cnName}</div></td>
              <td id="viewDoc">
                <a href={document.docURL} target='_blank' rel="noopener noreferrer">{document.docName}</a>
              </td>
              <td className="smallTd"><img style={pointer} width="25px" onClick={() => this.deleteDocument("documentTableLTI", index)} onMouseOver={this.toggleHover} src={deleteBin} /></td>
            </tr>
          )}
        </tbody>
      </Table>

    </div>

    const documentForLTI =
      <div id="documentTableLTI">
        <Row form>

          {this.state.isCNIPS
            ? <Col ><FormGroup>
              <InputMask placeholder="enter contract number" mask={this.state.inputMasak} className="form-control" value={this.state.contractNum} onChange={this.handleInputMask}></InputMask>
            </FormGroup></Col>
            : ""}

          <Col md>
            <FormGroup>
              {/* <Label>English Name</Label> */}
              <Input value={this.state.engName} onChange={this.handleChange("engName")} type="text" name="textarea-input" id="docName" rows="3" placeholder="please describe in English" />
            </FormGroup>
          </Col>
          <Col md>
            <FormGroup>
              {/* <Label>Chinese Name</Label> */}
              <Input value={this.state.cnName} onChange={this.handleChange("cnName")} type="text" name="textarea-input" id="cnName" rows="3" placeholder="please describe in Chinese" />
            </FormGroup>
          </Col>
          <Col md>
            <FormGroup>
              {/* <Label>File Name</Label> */}
              <CustomInput id="docFileName" onChange={this.uploadDocument} type="file" bsSize="lg" color="primary" label={this.state.docAttachedName} />
            </FormGroup>
          </Col>
          <Col xl={1}>
            <FormGroup>
              {/* <Label></Label> */}
              <Button id="addDocs" block onClick={this.addDocumentLTI}>Add</Button>
            </FormGroup>
          </Col>
        </Row>
        <Collapse isOpen={this.state.documentTableLTI.length !== 0}>
          {DocTable}
        </Collapse>
      </div>



    const documentForLTU =
      <div>
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

        <Collapse isOpen={this.state.documentTableLTU.length !== 0}>
          {/* <div> */}
          <br />

          <div className="tableWrap">
            <Table hover bordered responsive size="sm">
              <thead>
                <tr>
                  <th className="smallTd" >No.</th>
                  <th>Document Name (English)</th>
                  <th>Document Name (Chinese)</th>
                  <th>Expiry Date</th>
                  <th>DH Approved</th>
                  <th className="smallTd"></th>
                </tr>
              </thead>
              <tbody>
                {this.state.documentTableLTU.map((document, index) =>
                  <tr key={index}>
                    <th>{index + 1}</th>
                    <th>{document.documentNameEnglish}</th>
                    <th>{document.documentNameChinese}</th>
                    <th id="viewDoc">
                      <a href={document.documentUrl} target='_blank' rel="noopener noreferrer">{document.expiryDate}</a>
                    </th>
                    <th id="viewDoc">
                      <a href={document.documentUrl} target='_blank' rel="noopener noreferrer">{document.dhApproved}</a>
                    </th>
                    <th><img style={pointer} width="25px" onClick={() => this.deleteDocument("documentTableLTU", index)} onMouseOver={this.toggleHover} src={deleteBin} /></th>
                  </tr>
                )}
              </tbody>
            </Table>

          </div>

        </Collapse>
      </div>

    return (
      <LegalEntity.Consumer>{
        ContextValue => (
          <div className="animated fadeIn">
            <h4>Create</h4>
            <Card>
              <CardHeader>CREATE NEW REQUEST</CardHeader>
              <CardBody>
                <FormGroup>
                  <h5>NOTES :</h5>
                  {/* {this.state.noteInfo.notes || <Skeleton count={3}/>} */}
                  {this.state.noteInfo.notes}
                </FormGroup>
                <Form className="form-horizontal" innerRef={this.formRef}>
                  <FormGroup>
                    <Label>Employee Number
                        <span> <i> &ensp; Requestor of chop usage needs to be permanent staff. Intern or external staff's application will NOT be accepted</i> </span>
                    </Label>
                    <div className="controls">
                      <InputGroup className="input-prepend">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>ID</InputGroupText>
                        </InputGroupAddon>
                        <Input disabled ref={this.employeeId} onChange={this.handleChange("employeeId")} value={this.state.employeeId} id="prependedInput" size="16" type="text" />
                      </InputGroup>
                    </div>
                  </FormGroup>
                  <FormGroup>
                    <Label>Tel. </Label>
                    <InputGroup>
                      <Input ref={this.telNumber} value={this.state.telNumber} onChange={this.handleChange("telNumber")} id="appendedInput" size="16" type="text" />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup>
                    <Label>Dept</Label>
                    <Input id="deptSelected" type="select" onChange={this.handleChange("deptSelected")} defaultValue="0" name="dept">
                      <option disabled value="0">Please Select . . .</option>

                      {this.state.department.map((option, index) => (
                        <option value={option.deptId} key={option.deptId}>
                          {option.deptName}

                        </option>
                      ))}
                    </Input>
                    <FormFeedback>Invalid Departement Selected</FormFeedback>
                  </FormGroup>
                  <FormGroup>
                    <Label>Application Type</Label>
                    <Input ref={this.appTypeSelected} type="select"
                      onChange={this.handleChange("appTypeSelected")} id="appTypeSelected" defaultValue="0" name="select"
                      onBlur={() => this.validator.showMessageFor('aplicationType')}>
                      <option disabled value="0">Please Select . . .</option>
                      {this.state.applicationTypes.map((option, id) => (

                        <option value={option.appTypeId} key={option.appTypeId}>{option.appTypeName}</option>

                      ))}
                    </Input>
                    <FormFeedback>Invalid Application Type Selected</FormFeedback>
                    <FormFeedback valid={this.validator.fieldValid('aplicationType')}>
                      {this.validator.message('aplicationType', this.state.appTypeSelected, 'required')}</FormFeedback>
                  </FormGroup>

                  <Collapse isOpen={this.state.isLTI}>
                    <FormGroup>
                      <Label>Entitled Team</Label>
                      <InputGroup>
                        <Input id="teamSelected" onChange={this.handleChange("teamSelected")} defaultValue="0" type="select">
                          <option value="0" disabled>Please select a team</option>
                          {this.state.teams.map((team, index) =>
                            <option key={index} value={team.teamId}>{team.teamName}</option>
                          )}
                        </Input>
                        <FormFeedback>Invalid Entitled Team Selected</FormFeedback>
                      </InputGroup>
                    </FormGroup>
                    <Label>Effective Period</Label>
                    {/* <Input type="date" onChange={this.handleChange("effectivePeriod")} id="effectivePeriod"></Input> */}
                    <DatePicker id="effectivePeriod" placeholderText="YYYY/MM/DD" popperPlacement="auto-center" showPopperArrow={false} todayButton="Today"
                      className="form-control" required dateFormat="yyyy/MM/dd" withPortal
                      peekNextMonth
                      showMonthDropdown
                      showYearDropdown
                      selected={this.state.dateView1}
                      onChange={this.dateChange("effectivePeriod", "dateView1")}
                      minDate={new Date()} maxDate={addDays(new Date(), 365)} />
                    <FormFeedback>Invalid Date Selected</FormFeedback>
                  </Collapse>

                  <Collapse isOpen={this.state.isLTU}>
                    <FormGroup>
                      <Label>Entitled Team</Label>
                      <InputGroup>
                        <Input id="teamSelected" onChange={this.handleChange("teamSelected")} defaultValue="0" type="select">
                          <option value="0" disabled>Please select a team</option>
                          {this.state.teams.map((team, index) =>
                            <option key={index} value={team.teamId}>{team.teamName}</option>
                          )}
                        </Input>
                        <FormFeedback>Invalid Entitled Team Selected</FormFeedback>
                      </InputGroup>
                    </FormGroup>
                  </Collapse>

                  <FormGroup>
                    <Label>Chop Type</Label>
                    <Input ref={this.chopTypeSelected} type="select" id="chopTypeSelected"
                      onClick={() => { this.getChopTypes(this.props.legalName, this.state.appTypeSelected) }}
                      onChange={this.handleChange("chopTypeSelected")} defaultValue="0" name="chopType" >
                      <option disabled value="0">Please Select ..</option>
                      {this.state.chopTypes.map((option, id) => (
                        <option key={option.chopTypeId} value={option.chopTypeId}>{option.chopTypeName}</option>
                      ))}

                    </Input>
                    <FormFeedback>Invalid Chop Type Selected</FormFeedback>
                  </FormGroup>
                  {this.state.showBranches
                    ? <FormGroup>
                      <Label>Branch Company Chop</Label>
                      <Input type="select" defaultValue="0">
                        <option onChange={this.handleChange("branchSelected")} value="0" disabled>Please specify your Brand Company Chop</option>
                        {this.state.branches.map((branch, index) =>
                          <option value={branch.branchId} key={index}>{branch.branchName}</option>
                        )}
                      </Input>
                    </FormGroup>
                    : ""
                  }

                  <FormGroup check={false}>
                    <Label>Document Name</Label>
                    {this.state.isLTU ? documentForLTU : documentForLTI}
                  </FormGroup>
                  <FormGroup>
                    <Label>Purpose of Use</Label>
                    <InputGroup>
                      <Input maxLength={500} ref={this.purposeOfUse} onChange={this.handleChange("purposeOfUse")} placeholder="Enter the Purpose of Use" type="textarea" name="textarea-input" id="purposeOfUse" rows="3" />
                      <FormFeedback>Please input the purpose of use</FormFeedback>
                    </InputGroup>
                  </FormGroup>
                  {!this.state.isLTI
                    ? <FormGroup>
                      <Label>Connecting Chop (骑缝章) </Label>
                      <Row />
                      <AppSwitch dataOn={'yes'} onChange={this.toggleConnection} checked={this.state.connectingChop} dataOff={'no'} className={'mx-1'} variant={'3d'} color={'primary'} outline={'alt'} label></AppSwitch>
                    </FormGroup>
                    : ""}

                  <FormGroup>
                    <Label>Number of Pages to Be Chopped</Label>
                    <InputGroup>
                      <Input ref={this.numOfPages} onChange={this.handleChange("numOfPages")} id="numOfPages" size="16" type="number" min='0' max='10' />
                      <FormFeedback>Invalid Number of pages </FormFeedback>
                    </InputGroup>
                  </FormGroup>
                  <Collapse isOpen={!this.state.isLTI && !this.state.isLTU}>
                    <FormGroup>
                      <Label>Use in Office</Label>
                      <Row />
                      <AppSwitch onChange={this.toggle} checked={this.state.collapse} id="useOff" className={'mx-1'} variant={'3d'} color={'primary'} outline={'alt'} defaultChecked label dataOn={'yes'} dataOff={'no'} />
                    </FormGroup>
                  </Collapse>

                  <Collapse isOpen={!this.state.collapse}>
                    <FormGroup visibelity="false" >
                      <Label>Return Date</Label>
                      <Row />
                      <DatePicker id="returnDate" placeholderText="YYYY/MM/DD" popperPlacement="auto-center" showPopperArrow={false} todayButton="Today"
                        className="form-control" required dateFormat="yyyy/MM/dd" withPortal
                        selected={this.state.dateView2}
                        onChange={this.dateChange("returnDate", "dateView2")}
                        minDate={new Date()} maxDate={addDays(new Date(), 30)} />
                      {/* <Input onClickOutside type="date" id="returnDate" onChange={this.handleChange("returnDate")} name="date-input" /> */}
                    </FormGroup>
                    <FormGroup>
                      <Label>Responsible Person <i className="fa fa-user" /></Label>
                      <AsyncSelect id="resPerson"
                        onBlur={this.checkDepartment}
                        classNamePrefix="rs"
                        loadOptions={loadOptions}
                        onChange={this.handleSelectOption("resPerson")}
                        menuPortalTarget={document.body}
                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                      />
                    </FormGroup>
                  </Collapse>
                  <FormGroup>
                    <Label>Address to</Label>
                    <InputGroup>
                      <Input maxLength={200} ref={this.addressTo} onChange={this.handleChange("addressTo")} type="textarea" name="textarea-input" id="addressTo" rows="5" placeholder="Documents will be addressed to" />
                      <FormFeedback>Invalid person to address to</FormFeedback>
                    </InputGroup>
                  </FormGroup>
                  <FormGroup>
                    <Label>Pick Up By <i className="fa fa-user" /> </Label>
                    <Badge color="danger" className="ml-2">{this.state.selectInfo}</Badge>
                    <AsyncSelect
                      id="pickUpBy"
                      loadOptions={loadOptions}
                      onBlur={this.checkDepartment}
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
                      <Input maxLength={500} ref={this.remarks} onChange={this.handleChange("remarks")} id="remarks" size="16" type="textbox" placeholder="Please enter the remarks" />
                      <FormFeedback>Please add remarks</FormFeedback>
                    </InputGroup>
                  </FormGroup>

                  {this.state.isLTI
                    ? <FormGroup>
                      <Label>Document Check By <i className="fa fa-user" /></Label><AsyncSelect
                        id="docCheckByLTI"
                        loadOptions={loadOptions}
                        isMulti
                        onChange={this.handleSelectOption("docCheckByLTI")}
                        menuPortalTarget={document.body}
                        components={animatedComponents}
                        styles={this.state.deptHeadSelected === null ? reactSelectControl : ""}
                      /> </FormGroup>
                    : null}

                  {this.state.isCNIPS
                    ? <FormGroup>
                      <Label>Contract Signed By: <i className="fa fa-user" /></Label>
                      <small> &ensp; Please fill in the DHs who signed the contract and keep in line with MOA; If for Direct Debit Agreements, Head of FGS and Head of Treasury are needed for approval</small>
                      <Row>
                        <Col>
                          <AsyncSelect
                            id="contractSign1"
                            onBlur={this.checkDepartment}
                            loadOptions={loadOptions}
                            onChange={this.handleSelectOption("contractSign1")}
                            menuPortalTarget={document.body}
                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                          />
                          <InputGroup>
                          </InputGroup>
                        </Col>
                        <Col>
                          <AsyncSelect
                            id="contractSign2"
                            onBlur={this.checkDepartment}
                            loadOptions={loadOptions}
                            onChange={this.handleSelectOption("contractSign2")}
                            menuPortalTarget={document.body}
                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                          />
                          <InputGroup>
                          </InputGroup>
                        </Col>
                      </Row>
                    </FormGroup>

                    : this.state.isLTU
                      ? <FormGroup>
                        <Label>Document Check By <i className="fa fa-user" /></Label>
                        <AsyncSelect id="docCheckBySelected" menuPortalTarget={document.body} onChange={this.handleSelectOption("docCheckBySelected")}
                          loadOptions={loadDocCheckBy} styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }} />
                      </FormGroup>
                      : <FormGroup>
                        <Label>Department Heads <i className="fa fa-user" /></Label>
                        <small> &ensp; If you apply for {this.props.legalName} Company Chop, then Department Head shall be from {this.props.legalName} entity</small>
                        <Badge color="danger" className="ml-2">{this.state.selectInfo}</Badge>
                        <AsyncSelect
                          id="deptHeadSelected"
                          loadOptions={loadOptions}
                          isMulti
                          onBlur={this.checkDepartment}
                          onChange={this.handleSelectOption("deptHeadSelected")}
                          menuPortalTarget={document.body}
                          components={animatedComponents}
                          styles={this.state.deptHeadSelected === null ? reactSelectControl : ""} />
                        {this.state.deptHeadSelected === null
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
                          checked={this.state.agreeTerms}
                          onChange={this.handleAgreeTerm}
                          // onClick={this.isValid}
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
                <div className="form-actions" >
                  <Row className="align-items-left">
                    <Col>
                      {this.state.agreeTerms
                        ? <Button className="mr-2" id="submit" type="submit" color="success" onClick={() => { this.submitRequest('Y') }}>Submit</Button>
                        : <Button className="mr-2" id="disabledSubmit" type="submit" color="success" disabled
                          onMouseEnter={() => this.setState({ tooltipOpen: !this.state.tooltipOpen })} >Submit</Button>}
                      <Tooltip placement="left" isOpen={this.state.tooltipOpen} target="disabledSubmit">please confirm the agree terms</Tooltip>
                      <Button id="saveAction" type="submit" color="primary" onClick={() => { this.submitRequest('N') }}>Save</Button>
                      <UncontrolledTooltip placement="right" target="saveAction">Save current task as draft</UncontrolledTooltip>
                    </Col>
                  </Row>
                  {/* </div>
            <div className="form-actions"> */}
                </div>
              </CardFooter>
            </Card>
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
          </div >
        )}
      </LegalEntity.Consumer>
    );
  }
}



export default Create;