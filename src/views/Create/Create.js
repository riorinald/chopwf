import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { AppSwitch } from '@coreui/react';
import axios from 'axios';
import Swal from 'sweetalert2';
import theme from './theme.css'
import deleteBin from '../../assets/img/deletebin.png'
import InputMask from "react-input-mask";
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import makeAnimated from 'react-select/animated';
import SimpleReactValidator from 'simple-react-validator';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { addDays, format } from 'date-fns';
import config from '../../config';
import { STU, LTU, LTI, CNIPS } from '../../config/validation';
// import { resetMounted } from '../MyPendingTasks/MyPendingTasks'
import ReactTable from "react-table";
import "react-table/react-table.css"
import selectTableHOC from "react-table/lib/hoc/selectTable";
import PropTypes from "prop-types";
import LegalEntity from '../../context';

import Authorize from '../../functions/Authorize'
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
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupText,
  InputGroupAddon,
  InputGroupButtonDropdown,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Table,
  Tooltip,
  UncontrolledTooltip,
} from 'reactstrap';
import { userInfo } from '../../context/UserInfo';


const SelectTable = selectTableHOC(ReactTable);

const animatedComponents = makeAnimated();


// var NewFormData = require('formdata-polyfill')

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
      //retrieve userList
      userList: [],
      teams: [],
      branches: [],
      viewContract: false,
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
      numOfPages: "",
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

      selectedOption: {},

      documentTableLTI: [],
      documentTableLTU: [],
      documentTableCNIPS: [],
      selectedDocs: [],
      documents: [],

      agreeTerms: false,
      showBranches: false,

      contractNumber: "",
      conNum: [],
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

      invalidEnglish: false,
      invalidChinese: false,
      invalidNumberOfPages: false,
      contractValid: true,

      checkDetails: {},
      wrongDocError: "",

      reqInfo: [
        { id: "deptSelected", valid: false },
        { id: "appTypeSelected", valid: false },
        { id: "chopTypeSelected", valid: false },
        { id: "purposeOfUse", valid: false },
        { id: "addressTo", valid: false },
        { id: "pickUpBy", valid: false },
        { id: "numOfPages", valid: false },
        { id: "remarks", valid: false },
        { id: "deptHeadSelected", valid: false },
        { id: "documentTableLTI", valid: false },
      ],
      validateForm: [],
      noteInfo: [],
      mask: [/(?!.*[A-HJ-QT-Z])[IS]/i, "-", /[A-Z]/i, /[A]/i, "-", /(?!.*[A-NQRT-Z])[PSO]/i, "-", /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, "-", /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/],
      // mask: "a-a-a-9999-9999",
      selectInfo: '',
      inputMask: { mask: "a-a-a-9999-9999" },
      msgTooltip: '[I / S ]-[ A / L / IA / R ]-[ O / P / S] \n e.g "S-A-O-9999-9999"',
      ioTooltip: false,
      contractNumNotes: "",
      contractError: ""

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
    this.checkDept = this.checkDept.bind(this);

    this.validator = new SimpleReactValidator({ autoForceUpdate: this, locale: 'en' });
    this.formRef = React.createRef()
    this.selectDocument = this.selectDocument.bind(this);
    this.hideDoc = this.hideDoc.bind(this);
    this.toggleConnection = this.toggleConnection.bind(this);
    this.getDocuments = this.getDocuments.bind(this);
    this.setContractNotes = this.setContractNotes.bind(this);
  };

  componentDidMount() {
    this.getUserData();
    this.getData("department", `${config.url}/departments`);
    this.getData("applicationTypes", `${config.url}/apptypes`);
    this.getData("chopTypes", `${config.url}/choptypes?companyid=` + this.props.legalName);
    // resetMounted.setMounted()
    this.setContractNotes();
    this.getNotes()


  }

  getNotes() {
    axios.get(`${config.url}/notes/0`)
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


  validate() {
    let { validateForm } = this.state
    if (validateForm.length === 0) {
      Swal.fire({
        title: 'Appliction Type Required',
        type: 'info',
        label: 'required',
        text: 'Please select an Application Type to get started !'
      })
    }
    let tempCheck = 0
    for (let i = 0; i < validateForm.length; i++) {
      let field = this.state[validateForm[i]]
      var element = document.getElementById(validateForm[i])

      //add any conditions for validation below
      if (field.length !== 0 && field !== "") {
        element.classList.contains("form-control")
          ? element.className = "is-valid form-control"
          : element.className = "isValid"
        // console.log(`${validateForm[i]} is Valid`)
      }
      else {
        if (tempCheck === 0) {
          element.focus()
        }
        tempCheck = 1
        element.classList.contains("form-control")
          ? element.className = "is-invalid form-control"
          : element.className = "notValid"
        console.log(`${validateForm[i]} is INVALID`)
      }

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

    if (this.state.validateForm.length !== 0) {
      if (this.validator.allValid()) {
        console.log("All Valid")
        this.setState({ agreeTerms: true })
      }
      else {
        // alert("Invalid Fields")
        this.validator.showMessages()
        this.forceUpdate()
      }
    }

  }



  async submitRequest(isSubmitted) {

    const userCookie = Authorize.getCookies()

    console.log("SUBMIT")
    let useInOffice = "Y"
    let isConnectChop = "N"
    let IsConfirmed = "N"

    useInOffice = this.state.collapse ? "Y" : "N"
    isConnectChop = this.state.connectingChop ? "Y" : "N"
    IsConfirmed = this.state.agreeTerms ? "Y" : "N"
    let postReq = new FormData();
    postReq.append("UserId", userCookie.userId);
    postReq.append("EmployeeNum", this.state.employeeId);
    postReq.append("TelephoneNum", this.state.telNumber);
    postReq.append("CompanyId", this.props.legalName);
    postReq.append("DepartmentId", this.state.deptSelected);
    postReq.append("ApplicationTypeId", this.state.appTypeSelected);
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

    //Single Document Check By in LTU
    if (this.state.isLTU) {
      postReq.append("DocumentCheckBy[0]", this.state.docCheckBySelected)
    }
    //Multiple Document CHeck By in LTI
    else if (this.state.isLTI) {
      for (let i = 0; i < this.state.docCheckByLTI.length; i++) {
        postReq.append(`DocumentCheckBy[${i}]`, this.state.docCheckByLTI[i].value);
      }
    }

    //for newly added documents in STU and LTI
    for (let i = 0; i < this.state.documentTableLTI.length; i++) {
      postReq.append(`Documents[${i}].Attachment.File`, this.state.documentTableLTI[i].docSelected);
      postReq.append(`Documents[${i}].DocumentNameEnglish`, this.state.documentTableLTI[i].engName);
      postReq.append(`Documents[${i}].DocumentNameChinese`, this.state.documentTableLTI[i].cnName);
    }


    //for newly added documents in CNIPS
    for (let i = 0; i < this.state.documentTableCNIPS.length; i++) {
      postReq.append(`Documents[${i}].Attachment.File`, this.state.documentTableCNIPS[i].docSelected);
      postReq.append(`Documents[${i}].DocumentNameEnglish`, this.state.documentTableCNIPS[i].engName);
      postReq.append(`Documents[${i}].DocumentNameChinese`, this.state.documentTableCNIPS[i].cnName);
      for (let j = 0; j < this.state.documentTableCNIPS[i].contractNumbers.length; j++) {
        postReq.append(`Documents[${i}].ContractNums[${j}]`, this.state.documentTableCNIPS[i].contractNumbers[j]);
      }
    }

    //for existing documents in LTU
    for (let i = 0; i < this.state.documentTableLTU.length; i++) {
      postReq.append(`DocumentIds[${i}]`, this.state.documentTableLTU[i].documentId);
    }


    //multiple dept. Heads
    for (let i = 0; i < this.state.deptHeadSelected.length; i++) {
      postReq.append(`DepartmentHeads[${i}]`, this.state.deptHeadSelected[i].value);
    }

    //console for dev
    for (var pair of postReq.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }


    // if (isSubmitted === 'N' && this.validator.allValid()) {
    this.postData(postReq, isSubmitted)
    // }
    // else if (this.validator.allValid() === false) {
    // console.log("Some fields are empty")
    // Swal.fire({
    //   type: 'info',
    //   title: 'required',
    //   text: 'The application type field is required'
    // Object.values(JSON.parse(JSON.stringify(this.validator.getErrorMessages())))
    // })
    // this.validator.showMessages();
    // }

    // else if (this.state.valid && this.state.inOffice) {
    // this.postData(postReq, isSubmitted)
    // }

  }

  checkDepartment = () => {
    if (this.state.deptSelected === "") {
      this.setState({ selectInfo: 'Please select department' })
    } else {
      this.setState({ selectInfo: '' })
    }
  }

  //toggle useInOffice
  toggle = name => event => {
    if (name === "collapse") {
      this.setState({ agreeTerms: false })
      let form = this.state.validateForm
      if (!this.state.collapse) {
        form = form.filter(id => id !== "resPerson" && id !== "returnDate")
      }
      else {
        form = form.concat("resPerson")
        form = form.concat("returnDate")
      }
      this.setState({ validateForm: form })
      // console.log(form)
    }
    this.setState({
      [name]: !this.state[name],
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
      const response = await axios.get(url, { headers: { Pragma: 'no-cache' } });
      this.setState({
        [state]: response.data
      })
    } catch (error) {
      console.error(error);
    }
  }

  async getDocuments(companyId, deptId, chopTypeId, teamId, callback) {
    // let url = `${config.url}/documents?companyid=mbafc&departmentid=itafc&choptypeid=comchop&teamid=mbafcit`

    let url = `${config.url}/documents?companyid=` + companyId + '&departmentid=' + deptId + '&choptypeid=' + chopTypeId + '&teamid=' + teamId;
    try {
      await axios.get(url, { headers: { Pragma: 'no-cache' } }).then(res => {
        this.setState({ documents: res.data })
        console.log(res.data.length)
        callback(res.data.length)
      })
    } catch (error) {
      console.error(error)
      callback("No Documents")
    }
  }

  async postData(formData, isSubmitted) {
    // console.log(document.getElementById("remarks"))
    let elementId = (isSubmitted === 'Y') ? "submit" : "saveAction"
    document.getElementById(elementId).blur()
    let showError = false

    Swal.fire({
      title: `Creating your Request ... `,
      type: "info",
      text: '',
      footer: '',
      allowOutsideClick: false,
      showConfirmButton: true,
      onClose: () => { if (!showError) { this.formReset() } },
      onBeforeOpen: () => {
        Swal.showLoading()
      },
      onOpen: () => {
        axios.post(`${config.url}/tasks`, formData)
          .then(res => {
            showError = false
            Swal.update({
              title: res.data.status === 200 ? isSubmitted === "Y" ? 'Request Submitted' : "Request Saved" : "",
              text: 'Request Number : ' + res.data.requestNum,
              footer: isSubmitted === "Y" ? 'Your request is being processed and is waiting for the approval' : 'Your request is saved as draft.',
              type: isSubmitted === "Y" ? "success" : "info",

            })
            Swal.hideLoading()
          })
          .catch(error => {
            showError = true
            let err = "Please contact the IT Admin !"
            let err2 = []
            let err3 = ""
            if (error.response) {
              console.log(error.response)
              err3 = error.response.message
              // let keys = Object.keys(error.response.data.errors)
              // err = keys.join(',')
              // keys.map(key => {
              // console.log(error.response.data.errors[key].join(','))
              // err2.push(error.response.data.errors[key].join(','))
              // })
              // err3 = err2.join(';')
            }
            Swal.update({
              title: "Error",
              type: "error",
              text: err,
              html: err3,

            })
            Swal.hideLoading()

          })
      }
    })
  }

  formReset() {
    this.formRef.current.reset()
    window.location.reload();
  }

  formRes() {
    this.formRef.current.reset()
  }

  convertExpDate(dateValue) {
    let regEx = dateValue.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')
    return regEx;
  }
  changeDeptHeads(heads) {
    let dh = ""
    heads.map(head => {
      dh = dh + head.displayName + "; "
    })
    return dh
  }

  async getUserData() {
    let ticket = localStorage.getItem('ticket')
    let userId = Authorize.getCookies().userId
    // let userId = "josh@otds.admin"
    // let userId = "daniel@otds.admin"
    await axios.get(`${config.url}/users/` + userId, { headers: { Pragma: 'no-cache', 'ticket': ticket } })
      .then(res => {
        this.setState({ employeeId: res.data.employeeNum, telNumber: res.data.telephoneNum, userId: userId })
      })
  }

  async getUsers() {
    await axios.get(`${config.url}/users?category=normal`, { headers: { Pragma: 'no-cache' } })
      .then(res => {
        this.setState({ userList: res.data })
      })
  }

  async getDeptHead(companyId) {
    // console.log(`${config.url}/users?category=normal&companyid=${companyId}&displayname=&userid=${this.state.userId}`)
    await axios.get(`${config.url}/users?category=normal&companyid=${companyId}&displayname=&userid=${this.state.userId}`, { headers: { Pragma: 'no-cache' } })
      .then(res => {
        this.setState({ deptHead: res.data })
      })
  }

  async getDocCheckBy(chopType, teamId) {
    console.log("Get document check by users")
    await axios.get(`${config.url}/users?category=lvlfour&companyid=${this.props.legalName}&departmentid=${this.state.deptSelected}&teamid=${teamId}&choptypeid=${chopType}&displayname=&userid=${this.state.userId}`,
      { headers: { Pragma: 'no-cache' } })
      .then(res => {
        this.setState({ docCheckBy: res.data })
      })
  }

  async getTeams(deptId) {
    let url = `${config.url}/teams?companyid=` + this.props.legalName + "&departmentId=" + deptId
    await axios.get(url, { headers: { Pragma: 'no-cache' } }).then(res => {
      this.setState({ teams: res.data })
    })
  }

  async getChopTypes(companyId, appTypeId) {
    await axios.get(`${config.url}/choptypes?companyid=${companyId}&apptypeid=${appTypeId}`, { headers: { Pragma: 'no-cache' } })
      .then(res => {
        this.setState({ chopTypes: res.data })
      })
  }

  setValidateForm(appType) {
    let form = [
      "deptSelected", "appTypeSelected", "effectivePeriod", "chopTypeSelected",
      "purposeOfUse", "addressTo", "pickUpBy", "numOfPages", "remarks", "deptHeadSelected",
      "documentTableLTI", "teamSelected", "docCheckBySelected", "contractSign1", "contractSign2",
      "documentTableLTU", "docCheckByLTI", "documentTableCNIPS"
    ]
    switch (appType) {
      case "STU":
        form = form.filter(id => id !== "effectivePeriod" && id !== "teamSelected" && id !== "docCheckBySelected" && id !== "contractSign1" && id !== "contractSign2" && id !== "documentTableLTU" && id !== "docCheckByLTI" && id !== "documentTableCNIPS")
        break;
      case "LTU":
        form = form.filter(id => id !== "effectivePeriod" && id !== "contractSign1" && id !== "contractSign2" && id !== "documentTableLTI" && id !== "deptHeadSelected" && id !== "docCheckByLTI" && id !== "documentTableCNIPS")
        break;
      case "LTI":
        form = form.filter(id => id !== "numOfPages" && id !== "pickUpBy" && id !== "contractSign1" && id !== "contractSign2" && id !== "documentTableLTU" && id !== "docCheckBySelected" && id !== "documentTableCNIPS")
        break;
      case "CNIPS":
        form = form.filter(id => id !== "effectivePeriod" && id !== "teamSelected" && id !== "docCheckBySelected" && id !== "deptHeadSelected" && id !== "documentTableLTU" && id !== "docCheckByLTI" && id !== "documentTableLTI")
        break;

      default:
        break;
    }
    this.setState({ validateForm: form })
    // console.log(form)
  }

  //handle value on changes
  handleChange = name => event => {
    //APPLICATION TYPE
    let value = event.target.value
    this.setState({ agreeTerms: false })
    if (name === "appTypeSelected") {
      this.setValidateForm(event.target.value)
      //Clear Doc Table and agreeTerms
      this.setState({ documentTableCNIPS: [], documentTableLTI: [], documentTableLTU: [] })

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
          reqInfo: LTU,

        })

        // if (this.state.deptSelected !== "") {
        this.getTeams(this.state.deptSelected)
        // if (this.state.teamSelected !== "" && this.state.chopTypeSelected !== "" && this.state.deptSelected !== "") {
        // this.getDocuments(this.props.legalName, this.state.deptSelected, this.state.chopTypeSelected, this.state.teamSelected, (callback) => {

        // })
        // }
        // }
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
      console.log(event.target.value)
      this.setState({ selectedOption: { docCheckBySelected: null }, docCheckBySelected: "", documentTableCNIPS: [], documentTableLTI: [], documentTableLTU: [] })
      if (this.state.deptSelected !== "" && this.state.teamSelected !== "" && this.state.isLTU) {
        this.getDocCheckBy(event.target.value, this.state.teamSelected)
        // this.getDocuments(this.props.legalName, this.state.deptSelected, event.target.value, this.state.teamSelected, (callback) => {
        // })
        this.getDocCheckBy(event.target.value, this.state.teamSelected)
      }
      this.setState({ documentTableCNIPS: [], documentTableLTI: [] })
      // if (this.state.deptSelected !== "" && this.state.teamSelected !== "" && this.state.isLTU) {
      // this.getDocCheckBy(event.target.value, this.state.teamSelected)
      // this.getDocuments(this.props.legalName, this.state.deptSelected, event.target.value, this.state.teamSelected, (callback) => {
      // })
      // }

      if (event.target.value === "BCSCHOP") {
        this.setState({ showBranches: true })
        this.getData("branches", `${config.url}/branches?companyid=${this.props.legalName}`)
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
      if (this.state.isLTU) {
        this.setState({
          selectedOption: { docCheckBySelected: null }, docCheckBySelected: "", documentTableLTU: []
        })
        this.getDocCheckBy(this.state.chopTypeSelected, this.state.teamSelected)
      }
      this.getDeptHead(this.props.legalName)
      this.getUsers();
      this.setState({ teamSelected: "", documentTableCNIPS: [], documentTableLTI: [] })
      if (this.state.isLTU || this.state.isLTI) {
        this.getTeams(event.target.value)
      }
      // if (this.state.teamSelected !== "" && this.state.chopTypeSelected !== "" && this.state.isLTU) {
      //   this.getDocuments(this.props.legalName, event.target.value, this.state.chopTypeSelected, this.state.teamSelected, (callback) => {

      //   })
      // }
    }

    //ENTITLED TEAM
    else if (name === "teamSelected") {
      this.setState({ selectedOption: { docCheckBySelected: null }, docCheckBySelected: "", documentTableCNIPS: [], documentTableLTI: [], documentTableLTU: [] })
      if (this.state.chopTypeSelected !== "" && this.state.isLTU) {
        this.getDocCheckBy(this.state.chopTypeSelected, event.target.value)
        this.handleSelectOption('docCheckBySelected')
      }
      this.setState({ documentTableCNIPS: [], documentTableLTI: [] })
      // if (this.state.chopTypeSelected !== "" && this.state.isLTU) {
      // this.getDocCheckBy(this.state.chopTypeSelected, event.target.value)
      // }
      // console.log(event.target.value)
    }

    //Handle engName
    else if (name === "engName") {
      if (value.match(/[\u4E00-\u9FFF\u3400-\u4DFF\uF900-\uFAFF]+/g)) {
        value = this.state.eng
        this.setState({ invalidEnglish: true })
        event.target.className = "d-block is-invalid"
      }
      else {
        value = value
        this.setState({ invalidEnglish: false })
        event.target.className = "d-block is-valid "
      }
    }

    //Handle cnName
    else if (name === "cnNameLTI") {
      if (value.match(/[\u4E00-\u9FFF\u3400-\u4DFF\uF900-\uFAFF]+/g)) {
        this.setState({ cnName: value, invalidChinese: false })
        event.target.className = "d-block is-valid form-control"
      }
      else {
        this.setState({ cnName: value, invalidChinese: true })
        event.target.className = "d-block form-control is-invalid"
        console.warn("chinese invalid")
      }
    }

    else if (name === "numOfPages") {
      if (/[a-z]/i.test(value) | value.length > 9) {
        value = this.state.numOfPages
        this.setState({ invalidNumberOfPages: true })
        event.target.className = "is-invalidform-control"
      }
      else {
        value = value
        this.setState({ invalidNumberOfPages: false })
        event.target.className = "form-control"
      }
    }

    this.setState({ [name]: value },
      () => { this.checkDepartment() }
    );

    if (value) {
      event.target.className = "form-control"
    }
    else {
      event.target.className = "is-invalid form-control"
    }
  };


  handlemask = () => {
    // let value = ("" + event.target.value).toUpperCase();
    let first = /(?!.*[A-HJ-QT-Z])[IS]/;
    let third = /(?!.*[A-NQRT-Z])[PSO]/;
    let digit = /[0-9]/;
    let center = /[IALR]/;
    let centers = /[A]/;
    let mask = [first, "-", center, centers, "-", third, "-", digit, digit, digit, digit, "-", digit, digit, digit, digit]
    // switch (this.props.match.params.company) {
    //   case 'MBIA':
    //     mask = [first, "-", center, "-", third, "-", digit, digit, digit, digit, "-", digit, digit, digit, digit];
    //     break;
    //   case 'MBLC':
    //     mask = [first, "-", center, "-", third, "-", digit, digit, digit, digit, "-", digit, digit, digit, digit];
    //     break;
    //   case 'MBAFC':
    //     mask = [first, "-", center, "-", third, "-", digit, digit, digit, digit, "-", digit, digit, digit, digit];
    //     break;
    //   case 'CAR2GO':
    //     mask = [first, "-", center, "-", third, "-", digit, digit, digit, digit, "-", digit, digit, digit, digit];
    //     break;
    //   default:
    //     mask = [first, "-", center, "-", third, "-", digit, digit, digit, digit, "-", digit, digit, digit, digit];
    //     break;
    // }

    this.setState({
      mask: mask, viewContract: true
    });
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
        if (i === 10 && value[11] === '-') {
          isdigit1 = true
        }
        else {
          let message = "Please add ( - ) after 4 digits of year"
          this.setState({ contractValid: false, contractError: message })
        }
        if (isdigit1 && value.length === 16) {
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
        if (isdigit1 && value.length === 15) {
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
        if (i === 9 && value[10] === '-') {
          console.log(i, value[i])
          isdigit1 = true
        }
        else {
          let message = "Please add ( - ) after 4 digits of year"
          this.setState({ contractValid: false, contractError: message })
        }
      }

      if (isdigit1 && value.length === 15) {

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
      if (isdigit1 && value.length === 14) {
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


  handleContractNumber = (event) => {

    // let mask = [/(?!.*[A-HJ-QT-Z])[IS]/i, "-", /[IALR]/i, /[A]/i, "-", /(?!.*[A-NQRT-Z])[PSO]/i, "-", /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, "-", /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/]
    // let masks = [/(?!.*[A-HJ-QT-Z])[IS]/i, "-", /[IALR]/i, "-", /(?!.*[A-NQRT-Z])[PSO]/i, "-", /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, "-", /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/]

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

  deleteContract(i) {
    this.setState(state => {
      const conNum = state.conNum.filter((item, index) => i !== index)
      return {
        conNum
      }
    })
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
      else if (table === "documentTableCNIPS") {
        const documentTableCNIPS = state.documentTableCNIPS.filter((item, index) => i !== index)
        return {
          documentTableCNIPS
        }
      }
    })
  }

  addDocumentLTI() {

    var maxNumber = 45;
    var rand = Math.floor((Math.random() * maxNumber) + 1);
    let valid = true
    let typeValid = false
    let doc = this.state.documentTableLTI
    let errorMessage = []

    if (this.state.docSelected === null) {
      errorMessage.push("Please select a valid document.<br />")
    }
    if (this.state.isLTI) {
      if (this.state.engName === "") {
        errorMessage.push("Please input document name in English.<br />")
        typeValid = false
      }
      if (this.state.cnName === "") {
        errorMessage.push("Please input document name in Chinese.<br />")
        typeValid = false
      }
      if (this.state.invalidEnglish === true) {
        errorMessage.push("Please input document name in English with English character.<br />")
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
      if (this.state.engName === "") {
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
        if (doc[i].docName === this.state.docAttachedName) {
          valid = false
          break
        } else {
          valid = true
        }
      }
      if (valid) {
        const obj = {
          id: rand,
          conNum: this.state.conNum,
          engName: this.state.engName,
          cnName: this.state.cnName,
          docSelected: this.state.docSelected,
          docName: this.state.docAttachedName,
          docURL: URL.createObjectURL(this.state.docSelected),
        }
        this.getBase64(this.state.docSelected, (result) => {
          obj.documentBase64String = result
        })

        console.log(obj.docURL)
        this.setState({
          invalidEnglish: false, invalidChinese: false
        })
        this.setState(state => {
          const documentTableLTI = state.documentTableLTI.concat(obj)
          return {
            documentTableLTI
          }
        })
        document.getElementById("documentTableLTI").className = ""
        this.setState({ engName: "", cnName: "", docSelected: null, docAttachedName: "" })
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

  getBase64(file, callback) {
    let reader = new FileReader();
    reader.onload = function () {
      callback(reader.result.replace(/^data:.+;base64,/, ''))
    };
    reader.readAsDataURL(file)
  }

  async validateContractNumber() {
    let doc = this.state.documentTableCNIPS
    let contractError = []
    try {
      let validateConNum = await this.validateConNum();
      if (this.state.docSelected === null) {
        contractError.push("Please select a valid document.<br />")
      }
      if (this.state.engName === "") {
        contractError.push("Please input name in english.<br />")
      }
      if (this.state.contractNumber === "") {
        contractError.push("Please input a valid Contract Number.<br />")
      }
      if (this.state.contractNumber !== "" && validateConNum === false) {
        contractError.push(this.state.contractError + ".<br />")
        contractError.push(this.state.contractNumNotes)
      }
      if (contractError.length === 0 && validateConNum === true) {
        for (let i = 0; i < doc.length; i++) {
          if (doc[i].docName === this.state.docAttachedName && doc[i].conNum[0] === this.state.contractNumber) {
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

  addDocumentCNIPS = () => {
    var maxNumber = 45;
    var rand = Math.floor((Math.random() * maxNumber) + 1);
    let conName = [this.state.contractNumber]
    let contractError = ["error"];
    this.validateContractNumber()
      .then(data => {
        contractError = data
        if (contractError.length === 0) {
          const obj = {
            id: rand,
            conNum: conName,
            engName: this.state.engName,
            cnName: this.state.cnName,
            docSelected: this.state.docSelected,
            docName: this.state.docAttachedName,
            docURL: URL.createObjectURL(this.state.docSelected),
            contractNumbers: conName
          }

          this.setState(state => {
            const documentTableCNIPS = state.documentTableCNIPS.concat(obj)

            return {
              documentTableCNIPS
            }
          })
          this.setState({ contractValid: true, contractNumber: "", engName: "", cnName: "", docSelected: null, docAttachedName: "", conNum: [] })
          document.getElementById("documentTableCNIPS").className = ""
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

  addDocumentLTU() {
    if (this.state.selectedDocs.length !== 0) {
      this.setState({ documentTableLTU: this.state.selectedDocs })
      document.getElementById("documentTableLTU").className = ""
    }
    else {
      this.setState({ documentTableLTU: [] })
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
    let ext = ["ipg", "png", "xls", "xlsm", "xlsx", "email", "jpeg", "txt", "rtf", "tiff", "tif", "doc", "docx", "pdf", "pdfx", "bmp"]
    let valid = false
    if (event.target.files[0]) {
      let last = event.target.files[0].name.split('.').length
      let extension = event.target.files[0].name.split('.')[last - 1]
      console.log(extension)
      for (let i = 0; i < ext.length; i++) {
        if (ext[i] === extension) {
          valid = true
          break;
        }
        else {
          valid = false
        }
      }
      if (valid) {
        this.setState({
          docSelected: event.target.files[0],
          docAttachedName: event.target.files[0].name,
          wrongDocError: ""
        })
      }
      else {
        this.setState({ wrongDocError: "Please attach a valid document !" })
      }
    }
    event.target.value = null
  }

  handleSelectOption = sname => newValue => {
    console.log(sname, newValue)

    if (newValue) {
      if (sname === "deptHeadSelected" || sname === "docCheckByLTI") {
        if (newValue) {
          this.setState({ selectedOption: { [sname]: newValue }, [sname]: newValue })
          document.getElementById(sname).clasname = "css-2b097c-container"
        }
        else {
          this.setState({ [sname]: [] })
        }

      }
      else {
        if (newValue.value) {
          document.getElementById(sname).className = "css-2b097c-container"
        }
        this.setState({ selectedOption: { [sname]: newValue }, [sname]: newValue.value })
      }
    }
    else {
      if (sname === "deptHeadSelected" || sname === "docCheckByLTI") {
        this.setState({ selectedOption: { [sname]: newValue }, [sname]: [] })
      }
      else {
        this.setState({ selectedOption: { [sname]: newValue }, [sname]: "" })
      }
    }

  }

  // addDocCheck(row) {
  //   this.setState({ selectedDocs: row })
  // }
  hideDoc() {
    this.setState({ showDoc: false })
  }

  selectDocument() {
    document.getElementById('selectDocuments').blur()
    let { deptSelected, teamSelected, chopTypeSelected, checkDetails } = this.state
    let errorMessage = []
    // if (this.state.documents.length !== 0) {
    // if (checkDetails.deptTempSelected === deptSelected && checkDetails.chopTypeTempSelected === chopTypeSelected && checkDetails.teamTempSelected === teamSelected) {
    //   this.setState({ showDoc: true })
    // }
    // else {
    Swal.fire({
      title: "Retrieving",
      html: 'Please wait while we retrive the list of documents available.',
      type: "info",
      onBeforeOpen: () => {
        Swal.showLoading()
      },
      onOpen: () => {
        if (deptSelected === "") {
          errorMessage.push("Please select the Department.<br />")
        }
        if (chopTypeSelected === "") {
          errorMessage.push("Please select Chop Type.<br />")
        }
        if (teamSelected === "") {
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
          this.getDocuments(this.props.legalName, deptSelected, chopTypeSelected, teamSelected, (numberOfDocuments) => {
            if (numberOfDocuments === 0) {
              Swal.update({
                title: "No Documents",
                html: 'there is no Documents in this appliction. ',
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

  dateChange = (name, view) => date => {
    let dates = ""
    if (date) {
      let tempDate = format(date, "yyyy-MM-dd").split('T')[0];//right
      dates = tempDate.replace(/-/g, "")
    }
    this.setState({
      [name]: dates,
      [view]: date
    });
  };

  //scroll To Function
  // scrollToRef = (ref) => window.scrollTo(0, ref)

  viewOrDownloadFile(file) {
    if (file) {
      var blobUrl = new Blob([file], { type: file.type })
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blobUrl, file.name)
        return;
      }
      else {
        window.open(URL.createObjectURL(file), "_blank")
      }
    }
    else {
      alert("No File detected! :( ")
    }
  }

  dataURLtoFile(dataurl, filename) {
    if (dataurl !== "") {
      var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      console.log(mime)

      return new File([u8arr], filename, { type: mime });
    }
    else {
      alert("BASE64 String is empty :(")
      return null
    }
  }

  render() {
    this.validator.purgeFields();
    const deptHeads = []
    const docCheckByUsers = []
    const userLists = []
    var pointer;
    const { hover, docCheckBy, deptHead, userList } = this.state;
    for (let i = 0; i < deptHead.length; i++) {
      const obj = { value: deptHead[i].userId, label: deptHead[i].displayName }
      deptHeads.push(obj)
    }
    for (let i = 0; i < userList.length; i++) {
      const obj = { value: userList[i].userId, label: userList[i].displayName }
      userLists.push(obj)
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

    const getYear = date => {
      console.log(date.getFullYear())
      return date.getFullYear()
    }

    const year = (new Date()).getFullYear();
    const years = Array.from(new Array(2), (val, index) => index + year);
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    const getMonth = date => {
      let month = date.getMonth()
      return months[month]
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

    const filterUsers = (inputValue) => {
      return userLists.filter(i =>
        i.label.toLowerCase().includes(inputValue.toLowerCase())
      );
    };

    const filterDocCheck = (inputValue) => {
      return docCheckByUsers.filter(i => i.label.toLowerCase().includes(inputValue.toLowerCase())
      );
    }

    const filterContract1 = (inputValue) => {
      return userLists.filter(i =>
        i.value !== this.state.contractSign2 && i.label.toLowerCase().includes(inputValue.toLowerCase())
      );
    }

    const filterContract2 = (inputValue) => {
      return userLists.filter(i =>
        i.value !== this.state.contractSign1 && i.label.toLowerCase().includes(inputValue.toLowerCase())
      );
    }

    const loadOptionsContract2 = (inputValue, callback) => {
      callback(filterContract2(inputValue));
    }

    const loadOptionsContract1 = (inputValue, callback) => {
      callback(filterContract1(inputValue));
    }


    const loadOptions = (inputValue, callback) => {

      callback(filterColors(inputValue));

    }

    const loadUsers = (inputValue, callback) => {

      callback(filterUsers(inputValue));

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
              <td className="descTd">{document.engName}</td>
              <td className="descTd">{document.cnName}</td>
              <td id="viewDoc">
                <div className="blobLink" onClick={() => this.viewOrDownloadFile(document.docSelected)} > {document.docName} </div>
              </td>
              <td className="smallTd"><img style={pointer} width="25px" onClick={() => this.deleteDocument("documentTableLTI", index)} onMouseOver={this.toggleHover} src={deleteBin} /></td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>

    const CNIPSTable = <div id="documentTableCNIPS" className="tableWrap">
      <Table hover bordered responsive size="sm">
        <thead>
          <tr>
            <th className="smallTd" >No.</th>
            <th>Contract Number</th>
            <th>Contract Name in English</th>
            <th>Contract Name in Chinese</th>
            <th>Attached File</th>
            <th className="smallTd"></th>
          </tr>
        </thead>
        <tbody>
          {this.state.documentTableCNIPS.map((document, index) =>
            <tr key={index}>
              <td className="smallTd">{index + 1}</td>
              {/* <td className="mediumTd">{document.conNum.map(((item, index) => (<div key={index}>{item};</div>)))}</td> */}
              <td className="mediumTd">{document.conNum}</td>
              <td className="descTd">{document.engName}</td>
              <td className="descTd">{document.cnName}</td>
              <td id="viewDoc">
                <div className="blobLink" onClick={() => this.viewOrDownloadFile(document.docSelected)} > {document.docName} </div>
              </td>
              <td className="smallTd"><img style={pointer} width="25px" onClick={() => this.deleteDocument("documentTableCNIPS", index)} onMouseOver={this.toggleHover} src={deleteBin} /></td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>

    const documentForLTI =
      <>
        <div id={this.state.isCNIPS ? "documentTableCNIPS" : "documentTableLTI"}>
          <Row form>

            {this.state.isCNIPS
              ? <Col >
                <FormGroup>
                  {/* <InputGroup> */}
                  {/* <InputGroupButtonDropdown direction="down" addonType="prepend" isOpen={this.state.viewContract} toggle={this.toggle('viewContract')}>
                      <DropdownToggle><i className="fa fa-list-ul" /></DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem header><center>List of Contract Number added</center></DropdownItem>
                        {this.state.conNum !== ""
                          ? this.state.conNum.map((
                            (conNum, index) => (
                              <span key={index}>
                                <DropdownItem style={{ cursor: 'default' }}>{conNum} <span style={{ cursor: 'pointer' }} onClick={() => this.deleteContract(index)} className="float-right"><i className="mx-0 fa fa-trash" /></span></DropdownItem>
                              </span>
                            )))
                          : <DropdownItem header><center>List of Contract Number added</center></DropdownItem>
                        }

                      </DropdownMenu>
                    </InputGroupButtonDropdown> */}
                  {/* <Tooltip toggle={this.toggle('ioTooltip')} placement="bottom" isOpen={this.state.ioTooltip} target="contractNumber">
                    {this.state.msgTooltip} </Tooltip> */}


                  {/* <Input type="text"
                    autoComplete="off" autoCapitalize="character" 
                    name="contractNumber" id="contractNumber" className="form-control"
                    placeholder="Enter Contract Number" 
                    onChange={this.handleContractNumber} value={this.state.contractNumber}
                    /> */}

                  <Input autoComplete="off" type="text"
                    value={this.state.contractNumber}
                    onChange={this.handleContractNumber} id="contractNumber"
                    placeholder={this.state.contractNumNotes}></Input>

                  {!this.state.contractValid
                    ? <small style={{ color: '#F86C6B' }} > {this.state.contractError} </small>
                    : null
                  }


                </FormGroup></Col>
              : ""}


            <Col md>
              <FormGroup>
                <Input invalid={this.state.invalidEnglish} autoComplete="off" value={this.state.engName}
                  onChange={this.handleChange("engName")} type="text" maxLength="500" name="textarea-input" id="docName" rows="3" placeholder="Please describe in English" />
                {this.state.invalidEnglish
                  ? <small style={{ color: '#F86C6B' }}> Please input only English characters </small>
                  : null}
              </FormGroup>
            </Col>
            <Col md>
              <FormGroup>
                {this.state.isLTI ?
                  <>
                    <Input autoComplete="off" value={this.state.cnName} onChange={this.handleChange("cnNameLTI")} type="text" maxLength="500" name="textarea-input" id="cnName" rows="3"
                      placeholder="Please describe in Chinese" />
                    {this.state.invalidChinese
                      ? <small style={{ color: '#F86C6B' }}> Please input only Chinese characters </small>
                      : null}
                  </>
                  :
                  <Input autoComplete="off" value={this.state.cnName} onChange={this.handleChange("cnName")} type="text" maxLength="500" name="textarea-input" id="cnName" rows="3"
                    placeholder="Please describe in Chinese (optional)" />
                }
              </FormGroup>
            </Col>
            <Col md>
              <FormGroup>
                {/* <Label>File Name</Label> */}
                <CustomInput id="docFileName" onChange={this.uploadDocument}
                  accept=".ipg, .png, .xls, .xlsm, .xlsx, .email, .jpeg, .txt, .rtf, .tiff, .tif, .doc, .docx, .pdf, .pdfx, .bmp"
                  type="file" bsSize="lg" color="primary" label={this.state.docAttachedName} />
                <small style={{ color: '#F86C6B' }} > {this.state.wrongDocError} </small>
              </FormGroup>
            </Col>
            <Col xl={1}>
              <FormGroup>
                {this.state.isCNIPS
                  ? <Button id="addDocs" block onClick={this.addDocumentCNIPS}>Add</Button>
                  : <Button id="addDocs" block onClick={this.addDocumentLTI}>Add</Button>
                }
              </FormGroup>
            </Col>
          </Row>


          <Collapse isOpen={this.state.documentTableLTI.length !== 0 || this.state.documentTableCNIPS.length !== 0}>
            {this.state.isCNIPS ? CNIPSTable : DocTable}
          </Collapse>
        </div>

        {this.state.isCNIPS
          ? <small style={{ color: '#F86C6B' }} >{this.validator.message('Documents', this.state.documentTableCNIPS, 'required')}</small>
          : this.state.isLTI || this.state.isSTU
            ? <small style={{ color: '#F86C6B' }} >{this.validator.message('Documents', this.state.documentTableLTI, 'required')}</small>
            : null
        }
      </>



    const documentForLTU =
      <div>
        <InputGroup id="documentTableLTU"  >
          <InputGroupAddon addonType="prepend">
            <Button color="primary" id="selectDocuments" onClick={this.selectDocument}>Select Documents</Button>
          </InputGroupAddon>
          {/* <div  id="documentTableLTU" /> */}
        </InputGroup>
        <InputGroup>
          {this.state.isLTU
            ? <small style={{ color: '#F86C6B' }} >{this.validator.message('Documents', this.state.documentTableLTU, 'required')}</small>
            : null}
        </InputGroup>
        <Modal color="info" size="xl" toggle={this.hideDoc} isOpen={this.state.showDoc} >
          <ModalHeader toggle={this.hideDoc} className="center"> Select Documents  </ModalHeader>
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
                  // style: { textAlign: "center" },
                },
                {
                  Header: 'Document Name (Chinese)',
                  accessor: 'documentNameChinese',
                  // style: { textAlign: "center" },
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
                    <td>{index + 1}</td>
                    <td>{document.documentNameEnglish}</td>
                    <td>{document.documentNameChinese}</td>
                    <td id="viewDoc">
                      <div className="blobLink" onClick={() => this.viewOrDownloadFile(this.dataURLtoFile(`data:${document.documentFileType};base64,${document.documentBase64String}`, document.documentFileName))} >
                        {this.convertExpDate(document.expiryDate)}
                      </div>
                      {/* <a href={document.documentUrl} target='_blank' rel="noopener noreferrer">{this.convertExpDate(document.expiryDate)}</a> */}
                    </td>
                    <td id="viewDoc">
                      <div className="blobLink" onClick={() => this.viewOrDownloadFile(this.dataURLtoFile(`data:${document.documentFileType};base64,${document.documentBase64String}`, document.documentFileName))} >
                        {this.changeDeptHeads(document.departmentHeads)}
                      </div>
                      {/* <a href={document.documentUrl} target='_blank' rel="noopener noreferrer">{this.changeDeptHeads(document.departmentHeads)}</a> */}
                    </td>
                    <td><img style={pointer} width="25px" onClick={() => this.deleteDocument("documentTableLTU", index)} onMouseOver={this.toggleHover} src={deleteBin} /></td>
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
          <div style={{ fontFamily: "sans-serif" }} className="animated fadeIn">
            <h4>Create</h4>
            <Card>
              <CardHeader>Create New Request</CardHeader>
              <CardBody>
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
                <Form className="form-horizontal" innerRef={this.formRef}>
                  {/* <FormGroup>
                    <Label>Employee Number
                        <span> <i> &ensp; Requestor of chop usage needs to be permanent staff. Intern or external staff's application will NOT be accepted.</i> </span>
                    </Label>
                    <div className="controls">
                      <InputGroup className="input-prepend">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>ID</InputGroupText>
                        </InputGroupAddon>
                        <Input disabled ref={this.employeeId} onChange={this.handleChange("employeeId")} value={this.state.employeeId} id="prependedInput" size="16" type="text" />
                      </InputGroup>
                    </div>
                  </FormGroup> */}
                  <FormGroup>
                    <Label>Tel. </Label>
                    <InputGroup>
                      <Input ref={this.telNumber} value={this.state.telNumber} onChange={this.handleChange("telNumber")} id="appendedInput" size="16" type="text" />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup>
                    <Label>Dept.</Label>
                    <Input id="deptSelected" type="select" onChange={this.handleChange("deptSelected")} defaultValue="0" name="dept">
                      <option disabled value="0">Please select . . .</option>
                      {this.state.department.map((option, index) => (
                        <option value={option.deptId} label={option.dept} key={option.deptId}>
                          {option.deptName}
                        </option>
                      ))}
                    </Input>
                    {/* <Select id="deptSelected"
                      onChange={this.handleSelectOption("deptSelected")}
                      options={this.state.department.map((option, index) => {
                        return { value: option.deptId, label: option.deptName }
                      }
                      )}
                      placeholder="Please Select..."
                      isSearchable={false}
                      menuPortalTarget={document.body}
                      styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }} /> */}
                    <small style={{ color: '#F86C6B' }} >{this.validator.message('Department', this.state.deptSelected, 'required')}</small>
                  </FormGroup>
                  <FormGroup>
                    <Label>Application Type</Label>
                    <Input ref={this.appTypeSelected} type="select"
                      onChange={this.handleChange("appTypeSelected")} id="appTypeSelected" defaultValue="0" name="select"
                      onBlur={() => this.validator.showMessageFor('aplicationType')}>
                      <option disabled value="0">Please select . . .</option>
                      {this.state.applicationTypes.map((option, id) => (

                        <option value={option.appTypeId} key={option.appTypeId}>{option.appTypeName}</option>

                      ))}
                    </Input>
                    <small style={{ color: '#F86C6B' }} >{this.validator.message('Application Type', this.state.appTypeSelected, 'required')}</small>
                  </FormGroup>

                  <Collapse isOpen={this.state.isLTI}>
                    <FormGroup>
                      <Label>Effective Period</Label>
                      <DatePicker autoComplete="off" id="effectivePeriod" placeholderText="YYYY/MM/DD" popperPlacement="auto-center" showPopperArrow={false} todayButton="Today"
                        className="form-control" required dateFormat="yyyy/MM/dd" withPortal
                        renderCustomHeader={({
                          date,
                          changeYear,
                          changeMonth,
                          decreaseMonth,
                          increaseMonth,
                          prevMonthButtonDisabled,
                          nextMonthButtonDisabled
                        }) => (
                            <div
                              style={{
                                margin: 10,
                                display: "flex",
                                justifyContent: "center"
                              }}
                            >
                              <Button onClick={decreaseMonth} disabled={prevMonthButtonDisabled} >{`<`}</Button>
                              <Input
                                value={getYear(date)}
                                onChange={({ target: { value } }) => changeYear(value)}
                                type="select">
                                {years.map(option => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </Input>
                              <Input value={getMonth(date)} onChange={({ target: { value } }) =>
                                changeMonth(months.indexOf(value))
                              } type="select">
                                {months.map((option) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </Input>
                              <Button onClick={increaseMonth} disabled={nextMonthButtonDisabled} >{`>`}</Button>

                            </div>
                          )}
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        selected={this.state.dateView1}
                        onChange={this.dateChange("effectivePeriod", "dateView1")}
                        minDate={new Date()} maxDate={addDays(new Date(), 365)} />
                      {this.state.isLTI
                        ? <small style={{ color: '#F86C6B' }} >{this.validator.message('Effective Period', this.state.effectivePeriod, 'required')}</small>
                        : null}
                    </FormGroup>
                  </Collapse>

                  <Collapse isOpen={this.state.isLTI || this.state.isLTU}>
                    <FormGroup>
                      <Label>Entitled Team</Label>
                      <small className="ml-2">Please select your team's name from dropdown list, if your team is not included, please contact respective chop keeper. </small>
                      <Input id="teamSelected" name="team" onChange={this.handleChange("teamSelected")} value={this.state.teamSelected} type="select">
                        <option value="" disabled>Please select a team</option>
                        {this.state.teams.map((team, index) =>
                          <option key={index} value={team.teamId}>{team.teamName}</option>
                        )}
                      </Input>
                      {this.state.isLTI || this.state.isLTU
                        ? <small style={{ color: '#F86C6B' }} >{this.validator.message('Entitled Team', this.state.teamSelected, 'required')}</small>
                        : null}
                    </FormGroup>
                  </Collapse>


                  {/* 
                  <Collapse isOpen={this.state.isLTU}>
                    <FormGroup>
                      <Label>Entitled Team</Label>
                      <Input id="teamSelected" name="team" onChange={this.handleChange("teamSelected")} defaultValue="0" type="select">
                        <option value="0" disabled>Please select a team</option>
                        {this.state.teams.map((team, index) =>
                          <option key={index} value={team.teamId}>{team.teamName}</option>
                        )}
                      </Input>
                      {this.state.isLTU
                        ? <small style={{ color: '#F86C6B' }} >{this.validator.message('Entitled Team', this.state.teamSelected, 'required')}</small>
                        : null}
                    </FormGroup>
                  </Collapse> */}

                  <FormGroup>
                    <Label>Chop Type</Label>
                    <Input ref={this.chopTypeSelected} type="select" id="chopTypeSelected"
                      onClick={() => { this.getChopTypes(this.props.legalName, this.state.appTypeSelected) }}
                      onChange={this.handleChange("chopTypeSelected")} defaultValue="0" name="chopType" >
                      <option disabled value="0">Please select ..</option>
                      {this.state.chopTypes.map((option, id) => (
                        <option key={option.chopTypeId} value={option.chopTypeId}> {this.props.legalName} {option.chopTypeName}</option>
                      ))}

                    </Input>
                    <small style={{ color: '#F86C6B' }} >{this.validator.message('Chop Type', this.state.chopTypeSelected, 'required')}</small>
                  </FormGroup>

                  {this.state.showBranches
                    ? <FormGroup>
                      <Label>Branch Company Chop</Label>
                      <Input onChange={this.handleChange("branchSelected")} type="select" defaultValue="0">
                        <option value="0" disabled>Please specify your Branch Company Chop</option>
                        {this.state.branches.map((branch, index) =>
                          <option value={branch.branchId} key={index}>{branch.branchName}</option>
                        )}
                      </Input>
                      <small style={{ color: '#F86C6B' }} >{this.validator.message('Branch Company Chop', this.state.branchSelected, 'required')}</small>
                    </FormGroup>
                    : ""
                  }

                  <FormGroup check={false}>
                    {this.state.isCNIPS
                      ? <><Label>Contract Name</Label><small className="ml-2">Please upload the sign-off sheet of your contract.</small></>
                      : <Label>Document Name</Label>
                    }
                    {this.state.isLTU ? documentForLTU : documentForLTI}

                  </FormGroup>

                  <FormGroup>
                    <Label>Purpose of Use</Label>
                    <InputGroup>
                      <Input maxLength={500} spellCheck="true" ref={this.purposeOfUse} onChange={this.handleChange("purposeOfUse")} placeholder="Enter the Purpose of Use" type="textarea" name="textarea-input" id="purposeOfUse" rows="3" />
                    </InputGroup>
                    <small style={{ color: '#F86C6B' }} >{this.validator.message('Purpose of Use', this.state.purposeOfUse, 'required')}</small>
                  </FormGroup>
                  <Collapse isOpen={!this.state.isLTI}>
                    <FormGroup>
                      <Label>Number of Pages to Be Chopped</Label>
                      <InputGroup>
                        <Input ref={this.numOfPages} value={this.state.numOfPages} onChange={this.handleChange("numOfPages")} id="numOfPages" size="16" type="number" min='0' max='10' />
                      </InputGroup>
                      {this.state.invalidNumberOfPages
                        ? <small style={{ color: '#F86C6B' }} >Number of pages cannot be more than 9</small>
                        : null
                      }
                      {!this.state.isLTI
                        ? <small style={{ color: '#F86C6B' }} >{this.validator.message('Number of Pages to Be Chopped', this.state.numOfPages, 'required')}</small>
                        : null}
                    </FormGroup>
                    <FormGroup>
                      <Label>Connecting Chop (骑缝章) </Label>
                      <Row />
                      <AppSwitch dataOn={'yes'} onChange={this.toggleConnection} checked={this.state.connectingChop} dataOff={'no'} className={'mx-1'} variant={'3d'} color={'primary'} outline={'alt'} label></AppSwitch>
                    </FormGroup>
                  </Collapse>

                  {/* {!this.state.isLTI
                    ? <FormGroup>
                      <Label>Connecting Chop (骑缝章) </Label>
                      <Row />
                      <AppSwitch dataOn={'yes'} onChange={this.toggleConnection} checked={this.state.connectingChop} dataOff={'no'} className={'mx-1'} variant={'3d'} color={'primary'} outline={'alt'} label></AppSwitch>
                    </FormGroup>
                    : ""} */}

                  <Collapse isOpen={!this.state.isLTI && !this.state.isLTU}>
                    <FormGroup>
                      <Label>Use in Office</Label>
                      <Row />
                      <AppSwitch onChange={this.toggle('collapse')} checked={this.state.collapse} id="useOff" className={'mx-1'} variant={'3d'} color={'primary'} outline={'alt'} defaultChecked label dataOn={'yes'} dataOff={'no'} />
                    </FormGroup>
                  </Collapse>

                  <Collapse isOpen={!this.state.collapse && !this.state.isLTI && !this.state.isLTU}>
                    <FormGroup visibelity="false" >
                      <Label>Return Date</Label>
                      <Row />
                      <DatePicker autoComplete="off" id="returnDate" placeholderText="YYYY/MM/DD" popperPlacement="auto-center" showPopperArrow={false} todayButton="Today"
                        className="form-control" required dateFormat="yyyy/MM/dd"
                        selected={this.state.dateView2}
                        onChange={this.dateChange("returnDate", "dateView2")}
                        minDate={new Date()} maxDate={addDays(new Date(), 30)} />
                      {!this.state.collapse
                        ? <small style={{ color: '#F86C6B' }} >{this.validator.message('Return Date', this.state.returnDate, 'required')}</small>
                        : null}
                    </FormGroup>

                    <FormGroup>
                      <Label>Responsible Person <i className="fa fa-user" /></Label>
                      <Badge color="danger" className="ml-2">{this.state.selectInfo}</Badge>
                      <AsyncSelect id="resPerson"
                        onBlur={this.checkDepartment}
                        isClearable
                        classNamePrefix="rs"
                        loadOptions={loadUsers}
                        onChange={this.handleSelectOption("resPerson")}
                        menuPortalTarget={document.body}
                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                      />
                      {!this.state.collapse
                        ? <small style={{ color: '#F86C6B' }} >{this.validator.message('Responsible Person', this.state.resPerson, 'required')}</small>
                        : null}
                    </FormGroup>
                  </Collapse>

                  <FormGroup>
                    <Label>Address to</Label>
                    <InputGroup>
                      <Input maxLength={200} ref={this.addressTo} onChange={this.handleChange("addressTo")} type="textarea" name="textarea-input" id="addressTo" rows="5" placeholder="Documents will be addressed to" />
                    </InputGroup>
                    <small style={{ color: '#F86C6B' }} >{this.validator.message('Address To', this.state.addressTo, 'required')}</small>
                  </FormGroup>

                  <Collapse isOpen={!this.state.isLTI} >
                    < FormGroup >
                      <Label>Pick Up By <i className="fa fa-user" /> </Label>
                      <Badge color="danger" className="ml-2">{this.state.selectInfo}</Badge>
                      <AsyncSelect
                        id="pickUpBy"
                        isClearable
                        loadOptions={loadUsers}
                        isClearable
                        onBlur={this.checkDepartment}
                        onChange={this.handleSelectOption("pickUpBy")}
                        menuPortalTarget={document.body}
                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                      />
                      <InputGroup>
                        {!this.state.isLTI
                          ? <small style={{ color: '#F86C6B' }} >{this.validator.message('Pick Up By', this.state.pickUpBy, 'required')}</small>
                          : null}
                      </InputGroup>
                    </FormGroup>
                  </Collapse>

                  <FormGroup>
                    <Label>Remark <small className="ml-2"> Please enter the remarks, e.g. telephone number of pick up person.</small> </Label>
                    <InputGroup>
                      <Input autoComplete="off" maxLength={500} ref={this.remarks} onChange={this.handleChange("remarks")} id="remarks" size="16" type="textbox" placeholder="Please enter the remarks" />
                    </InputGroup>
                    <small style={{ color: '#F86C6B' }} >{this.validator.message('Remark', this.state.remarks, 'required')}</small>
                  </FormGroup>

                  {this.state.isLTI
                    ? <FormGroup>
                      <Label>Document Check By <i className="fa fa-user" /> PB7 or above </Label>
                      <Badge color="danger" className="ml-2">{this.state.selectInfo}</Badge>
                      <AsyncSelect
                        id="docCheckByLTI"
                        loadOptions={loadUsers}
                        isMulti
                        onChange={this.handleSelectOption("docCheckByLTI")}
                        menuPortalTarget={document.body}
                        components={animatedComponents}
                        styles={this.state.deptHeadSelected === null ? reactSelectControl : ""}
                      />
                      <InputGroup>
                        {this.state.isLTI
                          ? <small style={{ color: '#F86C6B' }} >{this.validator.message('Department', this.state.deptSelected, 'required')}</small>
                          : null}
                      </InputGroup>
                    </FormGroup>
                    : null}

                  {this.state.isCNIPS
                    ? <FormGroup>
                      <Label>Contract Signed By: <i className="fa fa-user" /></Label>
                      <small className="ml-2"> Please fill in the DHs who signed the contract and keep in line with MOA; If for Direct Debit Agreements, Head of FGS and Head of Treasury are needed for approval.</small>
                      <Badge color="danger" className="ml-2">{this.state.selectInfo}</Badge>
                      <Row>
                        <Col className="py-2" xs={12} md={6} lg={6}>
                          <AsyncSelect
                            id="contractSign1"
                            onBlur={this.checkDepartment}
                            loadOptions={loadOptionsContract1}
                            onChange={this.handleSelectOption("contractSign1")}
                            menuPortalTarget={document.body}
                            isClearable
                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                          />
                          <InputGroup>
                            {this.state.isCNIPS
                              ? <small style={{ color: '#F86C6B' }} >{this.validator.message('Contract Signed By ', this.state.contractSign1, 'required')}</small>
                              : null}
                          </InputGroup>
                        </Col>
                        <Col className="py-2" xs={12} md={6} lg={6}>
                          <AsyncSelect
                            id="contractSign2"
                            onBlur={this.checkDepartment}
                            loadOptions={loadOptionsContract2}
                            onChange={this.handleSelectOption("contractSign2")}
                            menuPortalTarget={document.body}
                            isClearable
                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                          />
                          <InputGroup>
                            {this.state.isCNIPS
                              ? <small style={{ color: '#F86C6B' }} >{this.validator.message('Contract Signed By ', this.state.contractSign2, 'required')}</small>
                              : null}
                          </InputGroup>
                        </Col>
                      </Row>
                    </FormGroup>

                    : this.state.isLTU
                      ? <FormGroup>
                        <Label>Document Check By <i className="fa fa-user" /></Label>
                        <Badge color="danger" className="ml-2">{this.state.selectInfo}</Badge>
                        <Select
                          id="docCheckBySelected"
                          options={docCheckByUsers}
                          isClearable
                          // key={`my_unique_select_key__${docCheckBySelected}`}
                          value={this.state.selectedOption.docCheckBySelected}
                          menuPortalTarget={document.body}
                          styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                          onChange={this.handleSelectOption("docCheckBySelected")}
                        />
                        {/* <AsyncSelect id="docCheckBySelected" menuPortalTarget={document.body} onChange={this.handleSelectOption("docCheckBySelected")}
                          loadOptions={loadDocCheckBy} styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }} /> */}
                        <InputGroup>
                          {this.state.isLTU
                            ? <small style={{ color: '#F86C6B' }} >{this.validator.message('Document Check By ', this.state.docCheckBySelected, 'required')}</small>
                            : null}
                        </InputGroup>
                      </FormGroup>
                      : <FormGroup>
                        <Label>Department Heads <i className="fa fa-user" /></Label>
                        {this.props.legalName === 'DMT' ? null :
                          <small className="ml-2"> If you apply for {this.props.legalName} Company Chop, then Department Head shall be from {this.props.legalName} entity.</small>
                        }
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
                        <InputGroup>
                          {this.state.isLTI || this.state.isSTU
                            ? <small style={{ color: '#F86C6B' }} >{this.validator.message('Department Heads ', this.state.deptHeadSelected, 'required')}</small>
                            : null}
                        </InputGroup>

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
              <CardFooter id="submitTooltip">
                <div className="form-actions" >
                  <Row className="align-items-left">
                    <Col>
                      {this.state.agreeTerms
                        ? <Button className="mr-2" id="submit" type="submit" color="success" onClick={() => { this.submitRequest('Y') }}>Submit</Button>
                        : <Button className="mr-2" id="disabledSubmit" type="submit" color="success" disabled
                        >Submit</Button>}
                      <Tooltip placement="left" isOpen={this.state.tooltipOpen} toggle={() => this.setState({ tooltipOpen: !this.state.tooltipOpen })} target="submitTooltip">Please confirm the agree terms</Tooltip>
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
        )
      }
      </LegalEntity.Consumer>
    );
  }
}



export default Create;