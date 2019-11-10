import React, { Component } from 'react';
import { AppSwitch } from '@coreui/react';
import axios from 'axios';
import Swal from 'sweetalert2';
// import Autosuggest from 'react-autosuggest';
import theme from './theme.css'
import deleteBin from '../../assets/img/deletebin.png'
import InputMask from "react-input-mask";
import AsyncSelect from 'react-select/async';
import makeAnimated from 'react-select/animated';
import SimpleReactValidator from 'simple-react-validator';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import ReactDataGrid from 'react-data-grid';
import { addDays } from 'date-fns';
import config from '../../config';

import {
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
  Spinner
} from 'reactstrap';
// import { file, thisExpression } from '@babel/types';
// import { string } from 'prop-types';

//notes can be updated by text only or editable in HTML editor
const notes = <p>如您需申请人事相关的证明文件包括但不限于“在职证明”，“收入证明”，“离职证明”以及员工福利相关的申请材料等，请直接通过邮件提交您的申请至人力资源部。如对申请流程有任何疑问或问题，请随时联系HR。
  For HR related certificates including but not limited to the certificates of employment, income, resignation and benefits-related application materials, please submit your requests to HR department by email directly.
  If you have any questions regarding the application process, please feel free to contact HR. </p>;

const animatedComponents = makeAnimated();


class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {

      // legalEntity: this.props.legalName,

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


      dateView1: "",
      dateView2: "",

      reqInfo: [
        { id: "deptSelected", valid: false },
        { id: "appTypeSelected", valid: false },
        // { id: "contractNum", valid: false },
        { id: "chopTypeSelected", valid: false },
        // { id: "docName", valid: false },
        // { id: "returnDate", valid: false },
        // { id: "resPerson", valid: false },
        { id: "purposeOfUse", valid: false },
        // { id: "numOfPages", valid: false },
        { id: "addressTo", valid: false },
        // { id: "pickUpBy", valid: false },
        { id: "remarks", valid: false },
        // { id: "deptHeadSelected", valid: false },
        // { id: "contractSign1", valid: false },
        // { id: "contractSign2", valid: false },
        // { id: "selectedFile", valid: false }
      ],
      suggestions: [],
      isLoading: false,
      lastReq: ""
    };


    //binding method for button
    this.toggle = this.toggle.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.agreeTerm = this.agreeTerm.bind(this);
    this.submitRequest = this.submitRequest.bind(this);
    this.validate = this.validate.bind(this);
    this.addDocumentLTI = this.addDocumentLTI.bind(this);
    this.addDocumentLTU = this.addDocumentLTU.bind(this);
    this.toggleHover = this.toggleHover.bind(this);
    this.addDocCheck = this.addDocCheck.bind(this);
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

    this.getUserData();
    this.getData("department", `${config.url}/departments`);
    this.getData("applicationTypes", `${config.url}/apptypes`);
    this.getData("chopTypes", `${config.url}/choptypes?companyid=` + this.props.legalName);


  }


  validate() {
    for (let i = 0; i < this.state.reqInfo.length; i++) {
      if (this.state[this.state.reqInfo[i].id].length !== 1 && this.state[this.state.reqInfo[i].id] !== "") {
        this.setState(state => {
          const reqInfo = state.reqInfo.map((item, j) => {
            if (j === i) {
              var valid = document.getElementById(this.state.reqInfo[i].id)
              valid.className = "form-control"
              return { id: item.id, valid: true }
            }
            else {
              return item
            }
          })
          return {
            reqInfo
          }
        })
      }
      else {
        this.setState(state => {
          const reqInfo = state.reqInfo.map((item, j) => {
            if (j === i) {
              var invalid = document.getElementById(item.id)
              invalid.className = "is-invalid form-control"
              return { id: item.id, name: item.name, valid: false }
            }
            else {
              return item
            }
          })
          return {
            reqInfo
          }
        })
      }
    }
    if (!this.state.collapse) {
      let dateValid = false;
      let resValid = false;
      if (this.state.returnDate !== "") {
        document.getElementById("returnDate").className = "form-control"
        dateValid = true
      }
      else {
        document.getElementById("returnDate").className = "is-invalid form-control"
        dateValid = false
      }
      if (this.state.resPerson !== "") {
        document.getElementById("resPerson").className = "form-control"
        resValid = true
      }
      else {
        document.getElementById("resPerson").className = "is-invalid form-control"
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

  async agreeTerm(event) {
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
    if (this.state.collapse) {
      useInOffice = "Y"
    }
    else {
      useInOffice = "N"
    }

    let isConnectChop = "N"
    if (this.state.connectingChop) {
      isConnectChop = "Y"
    }
    else {
      isConnectChop = "N"
    }

    let postReq = new FormData();
    postReq.append("UserId", this.state.userId);
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
    postReq.append("IsConfirmed", this.state.agreeTerms);
    postReq.append("ReturnDate", "");
    postReq.append("ResponsiblePerson", this.state.resPerson);
    postReq.append("ContracySignedByFirstPerson", this.state.contractSign1);
    postReq.append("ContractSignedBySecondPerson", this.state.contractSign2);
    postReq.append("EffectivePeriod", this.state.effectivePeriod);
    postReq.append("IsSubmitted", isSubmitted);
    postReq.append("isConnectChop", isConnectChop);
    postReq.append("BranchId", this.state.branchSelected)
    postReq.append("DocumentCheckBy", this.state.docCheckBySelected)

    if (!this.state.isLTU) { // STU, LTI, CNIPS
      for (let i = 0; i < this.state.documentTableLTI.length; i++) {
        postReq.append("Documents[" + i + "].Attachment.File", this.state.documentTableLTI[i].docSelected);
        postReq.append("Documents[" + i + "].DocumentNameEnglish", this.state.documentTableLTI[i].engName);
        postReq.append("Documents[" + i + "].DocumentNameChinese", this.state.documentTableLTI[i].cnName);

      }
    }
    else {   //LTU
      for (let i = 0; i < this.state.documentTableLTU.length; i++) {
        postReq.append("DocumentIds[" + i + "]", this.state.documentTableLTI[i].documentId);
      }
    }

    //multiple dept. Heads
    for (let i = 0; i < this.state.deptHeadSelected.length; i++) {
      postReq.append("DepartmentHeads[" + i + "]", this.state.deptHeadSelected[i].value);
    }


    // for (var pair of postReq.entries()) {
    //   console.log(pair[0] + ', ' + pair[1]);
    // }


    if (isSubmitted === 'N' && this.validator.allValid()) {
      this.postData(postReq, isSubmitted)
    }
    if (this.validator.allValid() === false) {
      Swal.fire({
        type: 'info',
        title: 'required',
        text: 'The application type field is required'
        // Object.values(JSON.parse(JSON.stringify(this.validator.getErrorMessages())))
      })
      this.validator.showMessages();
    }

    if (this.state.valid && this.state.inOffice) {
      this.postData(postReq, isSubmitted)
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

  changeSelect() {
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
    // let url = 'http://192.168.1.47/echopx/documents?companyid=mbafc&departmentid=itafc&choptypeid=conchop&teamid=mbafcit'
    let tempDocs = []

    let url = `${config.url}/documents?companyid=` + companyId + '&departmentid=' + deptId + '&choptypeid=' + chopTypeId + '&teamid=' + teamId;
    try {
      await axios.get(url).then(res => {
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

  async postData(formData, isSubmitted) {
    try {
      await axios.post(`${config.url}/tasks`, formData, { headers: { 'Content-Type': '  application/json' } })
        .then(res => {
          if (isSubmitted === 'N') {
            Swal.fire({
              title: res.data.status,
              text: 'Request Saved ',
              footer: 'Your request is saved as a draft',
              type: 'info',
              onClose: () => { this.formReset() }
            })
          }
          if (isSubmitted === 'Y') {
            Swal.fire({
              title: res.data.status,
              text: 'Request Submitted',
              footer: 'Your request is being processed and is waiting for the approval',
              type: 'success',
              onClose: () => { this.formReset() }
            })
          }
        })
    } catch (error) {
      console.error(error);
    }
  }

  formReset() {
    this.formRef.current.reset()
  }

  async getUserData() {
    let token = localStorage.getItem('token')
    let ticket = localStorage.getItem('ticket')
    let userId = localStorage.getItem('userId')
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

      //Update Chop Types
      this.getChopTypes(this.props.legalName, event.target.value)

      //LONG TERM INITIATION
      if (event.target.value === "LTI") {
        this.setState({
          isSTU: false,
          isLTU: false,
          isLTI: true,
          isCNIPS: false,
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
        })
      }

      //CONTRACT NON - IPS
      else if (event.target.value === "CNIPS") {
        this.setState({
          isSTU: false,
          isLTU: false,
          isLTI: false,
          isCNIPS: true,
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
    });
    if (event.target.value) {
      event.target.className = "form-control"

    }
    else {
      event.target.className = "is-invalid form-control"
    }
  };

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
    if (this.state.docSelected !== null) {
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
    }
  }

  addDocumentLTU() {
    if (this.state.selectedDocs.length !== 0) {
      this.setState({ documentTableLTU: this.state.selectedDocs })
    }
  }

  getSuggestions(value) {
    this.setState({
      isLoading: !this.isLoading
    });
    const thisReq = this.lastReq =
      axios.get(`${config.url}/users?displayName=%${value}`)
        .then(response => {
          if (thisReq !== this.lastReq) {
            return;
          }
          this.setState({
            suggestions: response.data,
            isLoading: false
          });
        })
  }

  getSuggestionValue = suggestion => suggestion.displayName

  renderSuggestion = suggestion => (
    <Table className="suggestBox">
      <tbody>
        <tr>
          <td>{suggestion.displayName}</td>
        </tr>
      </tbody>
    </Table>
  )

  renderInputComponent = inputProps => (
    <div className="input-group-prepend">
      {this.state.isLoading ? <Spinner className="input-group-text" color="primary" /> : <i className="input-group-text cui-magnifying-glass" />}
      <input {...inputProps} />
    </div>
  );


  suggestionChange = (event, { newValue }) => {
    this.setState({ pickUpBy: newValue })
  }
  suggestionChangeRes = (event, { newValue }) => {
    this.setState({ resPerson: newValue })
  }
  suggestionChangeContract1 = (event, { newValue }) => {
    this.setState({ contractSign1: newValue })
  }
  suggestionChangeContract2 = (event, { newValue }) => {
    this.setState({ contractSign2: newValue })
  }

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState(this.getSuggestions(value))
  }

  onSuggestionsClearRequested = () => {
    this.setState({ suggestion: [] })
  }




  uploadFile = event => {
    if (event.target.files.length !== 0) {
      if (event.target.files.length === 1) {
        const obj = [
          event.target.files[0]
        ]
        this.setState(state => {
          const selectedFiles = state.selectedFiles.concat(obj)

          return {
            selectedFiles
          }
        })
      }
      else {

        for (let i = 0; i < event.target.files.length; i++) {
          const obj = []
          obj.push(event.target.files[i])
          this.setState(state => {
            const selectedFiles = state.selectedFiles.concat(obj)

            return {
              selectedFiles
            }
          })
        }
      }
    }
    console.log(this.state.selectedFiles)
  }

  uploadDocument = event => {
    if (event.target.files[0]) {
      this.setState({
        docSelected: event.target.files[0],
        docAttachedName: event.target.files[0].name

      })
    }
  }

  handleSelectOption = sname => newValue => {
    if (sname === "deptHeadSelected") {
      this.setState({ [sname]: newValue })
    }
    else {
      this.setState({ [sname]: newValue.value})
    }
  }

  addDocCheck(row) {
    this.setState({ selectedDocs: row })
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

  dateChange = (name, view) => date => {
    let year = date.getFullYear()
    let month = date.getDate()
    let day = date.getDay()
    let dates = '' + year + month + day
    console.log(dates)
    this.setState({
      [name]: dates,
      [view]: date
    });
  };

  //scroll To Function
  // scrollToRef = (ref) => window.scrollTo(0, ref)

  render() {
    const deptHeads = []
    const docCheckByUsers = []
    var pointer;
    const { pickUpBy, suggestions, resPerson, contractSign1, contractSign2, hover, deptHead, docCheckBy } = this.state;
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

    const inputProps = {
      id: "pickUpBy",
      className: "form-control",
      placeholder: 'Enter person to pick up by',
      value: pickUpBy,
      onChange: this.suggestionChange,
      type: 'search'
    }

    const inputResPerson = {
      id: "resPerson",
      className: "form-control",
      placeholder: 'Enter person to pick up by',
      value: resPerson,
      onChange: this.suggestionChangeRes,
      type: 'search'
    }
    const inputContract1 = {
      id: "contractSign1",
      className: "form-control",
      placeholder: 'Enter name of First Person',
      value: contractSign1,
      onChange: this.suggestionChangeContract1,
      type: 'search'
    }
    const inputContract2 = {
      id: "contractSign2",
      className: "form-control",
      placeholder: 'Enter name of Second Person',
      value: contractSign2,
      onChange: this.suggestionChangeContract2,
      type: 'search'
    }

    const defaultColumnProperties = {
      resizable: true
    };

    const docHeaders = [
      { key: 'documentNameEnglish', name: 'Document Name (English)' },
      { key: 'documentNameChinese', name: 'Document Name (Chinese)' },
      { key: 'expiryDate', name: 'Expiry Date' },
      { key: 'dhApproved', name: 'DH Approved' },
    ].map(c => ({ ...c, ...defaultColumnProperties }))

    const DocTable = <div>
      <Table bordered>
        <thead>
          <tr>
            <th>No.</th>
            <th>Document Name in English</th>
            <th>Document Name in Chinese</th>
            <th>Attached File</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {this.state.documentTableLTI.map((document, index) =>
            <tr key={index}>
              <th>{index + 1}</th>
              <th>{document.engName}</th>
              <th>{document.cnName}</th>
              <th id="viewDoc">
                <a href={document.docURL} target='_blank' rel="noopener noreferrer">{document.docName}</a>
              </th>
              <th><img style={pointer} width="25px" onClick={() => this.deleteDocument("documentTableLTI", index)} onMouseOver={this.toggleHover} src={deleteBin} /></th>
            </tr>
          )}
        </tbody>
      </Table></div>

    const documentForLTI =
      <div>
        <Row form>

          {this.state.isCNIPS
            ? <Col ><FormGroup>
              <InputMask placeholder="enter contract number" mask="*-*-*-9999-9999" className="form-control" defaultValue={this.state.contractNum} onChange={this.handleChange("contractNum")}></InputMask>
            </FormGroup></Col>
            // <Col ><FormGroup>
            //   <Input onChange={this.handleChange("contractNum")} placeholder="Please enter the contract Number"></Input>
            // </FormGroup></Col>
            : ""}

          <Col >
            <FormGroup>
              {/* <Label>English Name</Label> */}
              <Input value={this.state.engName} onChange={this.handleChange("engName")} type="text" name="textarea-input" id="docName" rows="3" placeholder="please describe in English" />
            </FormGroup>
          </Col>
          <Col >
            <FormGroup>
              {/* <Label>Chinese Name</Label> */}
              <Input value={this.state.cnName} onChange={this.handleChange("cnName")} type="text" name="textarea-input" id="cnName" rows="3" placeholder="please describe in Chinese" />
            </FormGroup>
          </Col>
          <Col >
            <FormGroup>
              {/* <Label>File Name</Label> */}
              <CustomInput id="docFileName" onChange={this.uploadDocument} type="file" bsSize="lg" color="primary" label={this.state.docAttachedName} />
            </FormGroup>
          </Col>
          <Col md={1}>
            <FormGroup>
              {/* <Label></Label> */}
              <Button block onClick={this.addDocumentLTI}>Add</Button>
            </FormGroup>
          </Col>
        </Row>
        <Collapse isOpen={this.state.documentTableLTI.length !== 0}>
          {DocTable}
        </Collapse>
      </div>



    const documentForLTU =
      <div>
        <Button onClick={this.selectDocument}>Select Documents</Button>
        <Modal color="info" size="xl" toggle={this.selectDocument} isOpen={this.state.showDoc} >
          <ModalHeader className="center"> Select Documents </ModalHeader>
          <ModalBody>
            <ReactDataGrid
              columns={docHeaders}
              rowGetter={i => this.state.documents[i]}
              rowsCount={this.state.documents.length}
              minWidth={1100}
              rowScrollTimeout={null}
              enableRowSelect={null}
              onRowSelect={this.addDocCheck}
              onColumnResize={(idx, width) =>
                console.log('Column' + idx + ' has been resized to ' + width)}
              minColumnWidth={100}


            />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" block size="md" onClick={() => { this.addDocumentLTU(); this.selectDocument() }}>  Add </Button>
          </ModalFooter>
        </Modal>

        <Collapse isOpen={this.state.documentTableLTU.length !== 0}>
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
      <div>
        <h3>Create</h3>
        <Card>
          <CardHeader>CREATE NEW REQUEST</CardHeader>
          <CardBody>
            <FormGroup>
              <h5>NOTES :</h5>
              {notes}
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
                  {/* <p className="help-block">Here's some help text</p> */}
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

                <FormFeedback valid={this.validator.fieldValid('aplicationType')}>
                  {this.validator.message('aplicationType', this.state.appTypeSelected, 'required')}</FormFeedback>

              </FormGroup>
              {this.state.isLTI
                ? <FormGroup>
                  <Label>Effective Period</Label>
                  {/* <Input type="date" onChange={this.handleChange("effectivePeriod")} id="effectivePeriod"></Input> */}
                  <DatePicker placeholderText="YYYY/MM/DD" popperPlacement="auto-center" showPopperArrow={false} todayButton="Today"
                    className="form-control" required dateFormat="yyyy/MM/dd" withPortal
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    selected={this.state.dateView1}
                    onChange={this.dateChange("effectivePeriod", "dateView1")}
                    minDate={new Date()} maxDate={addDays(new Date(), 365)} />
                  <FormFeedback>Invalid Date Selected</FormFeedback>
                </FormGroup>
                : ""
              }
              {this.state.isLTU
                ? <FormGroup>
                  <Label>Entitled Team</Label>
                  <InputGroup>
                    <Input onChange={this.handleChange("teamSelected")} onClick={() => { this.getTeams(this.state.deptSelected) }} defaultValue="0" type="select">
                      <option value="0" disabled>Please select a team</option>
                      {this.state.teams.map((team, index) =>
                        <option key={index} value={team.teamId}>{team.teamName}</option>
                      )}
                    </Input>
                  </InputGroup>
                </FormGroup>
                : ""
              }
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
                <FormFeedback>Invalid Input a valid Document Name</FormFeedback>
              </FormGroup>
              <FormGroup>
                <Label>Purpose of Use</Label>
                <InputGroup>
                  <Input ref={this.purposeOfUse} onChange={this.handleChange("purposeOfUse")} placeholder="Enter the Purpose of Use" type="textarea" name="textarea-input" id="purposeOfUse" rows="3" />
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
                  <Input ref={this.numOfPages} onChange={this.handleChange("numOfPages")} id="numOfPages" size="16" type="number" />
                  <FormFeedback>Invalid Number of pages </FormFeedback>
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <Label>Use in Office or Not</Label>
                <Row />
                <AppSwitch onChange={this.toggle} checked={this.state.collapse} id="useOff" className={'mx-1'} variant={'3d'} color={'primary'} outline={'alt'} defaultChecked label dataOn={'yes'} dataOff={'no'} />
              </FormGroup>
              <Collapse isOpen={!this.state.collapse}>
                <FormGroup visibelity="false" >
                  <Label>Return Date</Label>
                  <Row />
                    <DatePicker placeholderText="YYYY/MM/DD" popperPlacement="auto-center" showPopperArrow={false} todayButton="Today"
                      className="form-control" required dateFormat="yyyy/MM/dd" withPortal
                      selected={this.state.dateView2} 
                      onChange={this.dateChange("returnDate", "dateView2")}
                      minDate={new Date()} maxDate={addDays(new Date(), 365)} />
                  {/* <Input onClickOutside type="date" id="returnDate" onChange={this.handleChange("returnDate")} name="date-input" /> */}
                </FormGroup>
                <FormGroup>
                  <Label>Responsible Person <i className="fa fa-user" /></Label>
                  <AsyncSelect
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
                  <Input ref={this.addressTo} onChange={this.handleChange("addressTo")} type="textarea" name="textarea-input" id="addressTo" rows="5" placeholder="Documents will be addressed to" />
                  <FormFeedback>Invalid person to address to</FormFeedback>
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <Label>Pick Up By <i className="fa fa-user" /> </Label>
                <AsyncSelect
                  loadOptions={loadOptions}
                  onChange={this.handleSelectOption("PickUpBy")}
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
                  <Input ref={this.remarks} onChange={this.handleChange("remarks")} id="remarks" size="16" type="textbox" placeholder="Please enter the remarks" />
                  <FormFeedback>Please add remarks</FormFeedback>
                </InputGroup>
              </FormGroup>
              {this.state.isCNIPS
                ? <FormGroup>
                  <Label>Contract Signed By: <i className="fa fa-user" /></Label>
                  <small> &ensp; Please fill in the DHs who signed the contract and keep in line with MOA; If for Direct Debit Agreements, Head of FGS and Head of Treasury are needed for approval</small>
                  <Row>
                    <Col>
                      <AsyncSelect
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
                    <AsyncSelect menuPortalTarget={document.body} onChange={this.handleSelectOption("docCheckBySelected")}
                      loadOptions={loadDocCheckBy} styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }} />
                  </FormGroup>
                  : <FormGroup>
                    <Label>Department Heads <i className="fa fa-user" /></Label>
                    <small> &ensp; If you apply for {this.props.legalName} Company Chop, then Department Head shall be from {this.props.legalName} entity</small>
                    <AsyncSelect
                      loadOptions={loadOptions}
                      isMulti
                      onChange={this.handleSelectOption("deptHeadSelected")}
                      menuPortalTarget={document.body}
                      components={animatedComponents}
                      styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }} />
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
                      onChange={this.agreeTerm}
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
            <div className="form-actions">
              <Row>
                {this.state.agreeTerms ? <Button type="submit" color="success" onClick={() => { this.submitRequest('Y') }}>Submit</Button> : <Button disabled type="submit" color="success">Submit</Button>}
                <span>&nbsp;</span>
                <Button type="submit" color="primary" onClick={() => { this.submitRequest('N') }}>Save</Button>
              </Row>

              {/* </div>
            <div className="form-actions"> */}
            </div>
          </CardFooter>
        </Card>
        <Modal color="info" isOpen={this.state.modal} toggle={this.toggleModal} className={'modal-info ' + this.props.className} >
          <ModalHeader className="center" toggle={this.toggleModal}> Contract Chop </ModalHeader>
          <ModalBody>
            <div><p>
              <b>MBAFC</b> Contract Chop is only used for <b>Mortgage Loan Contract</b> and <b>Mortgage Filling Business</b>.
                 For any other contracts (e.g. purchase orders/release orders) and agreements, please select company chop.
                  </p>
              <p className="h6">Do you confirm to apply Contract Chop for your documents?</p>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.toggleModal} size="md"> Yes </Button>
            <Button color="secondary" onClick={() => this.changeSelect("No")} size="md"> No </Button>
          </ModalFooter>
        </Modal>
      </div >
    );

  }
}



export default Create;