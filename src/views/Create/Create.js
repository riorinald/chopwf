import React, { Component } from 'react';
import { AppSwitch } from '@coreui/react';
import axios from 'axios';
import Swal from 'sweetalert2';
import FileViewer from 'react-file-viewer';
import Autosuggest from 'react-autosuggest';
import theme from './theme.css'
import deleteBin from '../../assets/img/deletebin.png'
import InputMask from "react-input-mask";
import AsyncSelect from 'react-select/async';
import ReactDataGrid from 'react-data-grid';


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
import { file, thisExpression } from '@babel/types';
import { string } from 'prop-types';

//notes can be updated by text only or editable in HTML editor
const notes = <p>如您需申请人事相关的证明文件包括但不限于“在职证明”，“收入证明”，“离职证明”以及员工福利相关的申请材料等，请直接通过邮件提交您的申请至人力资源部。如对申请流程有任何疑问或问题，请随时联系HR。
  For HR related certificates including but not limited to the certificates of employment, income, resignation and benefits-related application materials, please submit your requests to HR department by email directly.
  If you have any questions regarding the application process, please feel free to contact HR. </p>;

class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {

      legalEntity: localStorage.getItem('legalEntity'),

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
      fadeIn: true,
      modal: false,
      timeout: 300,
      valid: false,
      inOffice: false,
      dropdownOpen: false,
      setDropdownOpen: false,

      users: [],

      CNIPS: false,

      userId: "",

      //data to be created inside Request Table
      employeeId: 0,    //retrieved from user Info
      telNumber: 0,      //retrieved from user Info
      contractNum: "",
      deptSelected: "",
      appTypeSelected: "",
      chopTypeSelected: "",
      docName: "",
      returnDate: "",
      resPerson: "",
      purposeOfUse: "",
      numOfPages: 0,
      addressTo: "",
      pickUpBy: "",
      remarks: "",
      deptHeadSelected: [],
      contractSignedBy: "",
      contractSign1: "",
      contractSign2: "",
      effectivePeriod: "",
      selectedFiles: [],
      fileName: "Choose File",
      teamSelected: "",
      connectingChop: false,

      documentTableLTI: [],
      documentTableLTU: [],
      selectedDocs: [],
      documents: [],

      agreeTerms: false,
      showDocAttach: false,
      showDocDropdown: false,
      showTeams: false,
      showBranches: false,

      engName: "",
      cnName: "",
      docSelected: null,
      docAttachedName: "Choose File",

      refNum: 0,

      showDoc: false,

      docSelectedLTU: "",

      docPreview: null,
      fileURL: "",
      fileType: "",

      hover: false,

      reqInfo: [
        { id: "deptSelected", valid: false },
        { id: "appTypeSelected", valid: false },
        // { id: "contractNum", valid: false },
        { id: "chopTypeSelected", valid: false },
        // { id: "docName", valid: false },
        // { id: "returnDate", valid: false },
        // { id: "resPerson", valid: false },
        { id: "purposeOfUse", valid: false },
        { id: "numOfPages", valid: false },
        { id: "addressTo", valid: false },
        { id: "pickUpBy", valid: false },
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
    this.saveRequest = this.saveRequest.bind(this);
    this.toggleHover = this.toggleHover.bind(this);
    this.addDocCheck = this.addDocCheck.bind(this);
    // this.selectAll = this.selectAll.bind(this);
    this.handleDeptHead = this.handleDeptHead.bind(this);
    this.selectDocument = this.selectDocument.bind(this);
    this.toggleConnection = this.toggleConnection.bind(this)
    this.getDocuments = this.getDocuments.bind(this)
  };

  componentDidMount() {
    //Get User Details

    this.getUserData();
    this.getData("department", 'http://192.168.1.47/echopx/api/v1/departments');
    this.getData("applicationTypes", 'http://192.168.1.47/echopx/api/v1/apptypes');
    this.getData("chopTypes", 'http://192.168.1.47/echopx/api/v1/choptypes?companyid=' + this.props.legalName);
    this.getDeptHead(this.props.legalName)
    this.getDocuments(this.props.legalName, this.state.deptSelected, this.state.chopTypeSelected, this.state.teamSelected)

    
  }

  // toggle = () => setDropdownOpen(prevState => !prevState);

  validate() {
    // let currentDate = new Date().getDate() + "/" + new Date().getMonth() + "/" + new Date().getFullYear();
    // console.log(currentDate)
    // console.log(this.state.returnDate)
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

  saveRequest() {
    let Submitted = "N"
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
    postReq.append("CompanyId", this.props.legalName);
    postReq.append("DepartmentId", this.state.deptSelected);
    postReq.append("ApplicationTypeId", this.state.appTypeSelected);
    postReq.append("ContractNum", this.state.contractNum);
    postReq.append("ChopTypeId", this.state.chopTypeSelected);
    postReq.append("PurposeOfUse", this.state.purposeOfUse);
    postReq.append("NumOfPages", this.state.numOfPages);
    postReq.append("UseInOffice", useInOffice);
    // postReq.append("DocumentDescription", "lorem ipsum");
    postReq.append("AddressTo", this.state.addressTo);
    postReq.append("PickUpBy", this.state.pickUpBy);
    postReq.append("Remark", this.state.remarks);
    postReq.append("IsConfirmed", "");
    postReq.append("ReturnDate", "");
    postReq.append("ResponsiblePerson", this.state.resPerson);
    postReq.append("ContracySignedByFirstPerson", this.state.contractSign1);
    postReq.append("ContractSignedBySecondPerson", this.state.contractSign2);
    postReq.append("EffectivePeriod", this.state.effectivePeriod);
    postReq.append("IsSubmitted", Submitted);
    postReq.append("isConnectChop", isConnectChop);

    for (let i = 0; i < this.state.documentTableLTI.length; i++) {
      postReq.append("Documents[" + i + "].Attachment.File", this.state.documentTableLTI[i].docSelected);
      postReq.append("Documents[" + i + "].DocumentNameEnglish", this.state.documentTableLTI[i].engName);
      postReq.append("Documents[" + i + "].DocumentNameChinese", this.state.documentTableLTI[i].cnName);
    }

    for (let i = 0; i < this.state.documentTableLTU.length; i++) {
      postReq.append("Documents[" + i + "].id", this.state.documentTableLTI[i].documentId);
    }


    for (let i = 0; i < this.state.selectedFiles.length; i++) {
      postReq.append("Attachments[" + i + "].Attachment.File", this.state.selectedFiles[i]);
      postReq.append("Attachments[" + i + "].Remark", "Y");
    }
    for (let i = 0; i < this.state.deptHeadSelected.length; i++) {
      postReq.append("DepartmentHeads[" + i + "]", this.state.deptHeadSelected[i].value);


    }
    this.postData(postReq)
  }

  async submitRequest() {
    let Submitted = "Y"
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
    postReq.append("CompanyId", this.props.legalName);
    postReq.append("DepartmentId", this.state.deptSelected);
    postReq.append("ApplicationTypeId", this.state.appTypeSelected);
    postReq.append("ContractNum", this.state.contractNum);
    postReq.append("ChopTypeId", this.state.chopTypeSelected);
    postReq.append("PurposeOfUse", this.state.purposeOfUse);
    postReq.append("NumOfPages", this.state.numOfPages);
    postReq.append("UseInOffice", useInOffice);
    // postReq.append("DocumentDescription", "lorem ipsum");
    postReq.append("AddressTo", this.state.addressTo);
    postReq.append("PickUpBy", this.state.pickUpBy);
    postReq.append("Remark", this.state.remarks);
    postReq.append("IsConfirmed", "");
    postReq.append("ReturnDate", "");
    postReq.append("ResponsiblePerson", this.state.resPerson);
    postReq.append("ContracySignedByFirstPerson", this.state.contractSign1);
    postReq.append("ContractSignedBySecondPerson", this.state.contractSign2);
    postReq.append("EffectivePeriod", this.state.effectivePeriod);
    postReq.append("IsSubmitted", Submitted);
    postReq.append("isConnectChop", isConnectChop);

    for (let i = 0; i < this.state.documentTableLTI.length; i++) {
      postReq.append("Documents[" + i + "].Attachment.File", this.state.documentTableLTI[i].docSelected);
      postReq.append("Documents[" + i + "].DocumentNameEnglish", this.state.documentTableLTI[i].engName);
      postReq.append("Documents[" + i + "].DocumentNameChinese", this.state.documentTableLTI[i].cnName);

    }

    for (let i = 0; i < this.state.documentTableLTU.length; i++) {
      postReq.append("Documents[" + i + "].id", this.state.documentTableLTI[i].documentId);
    }

    for (let i = 0; i < this.state.selectedFiles.length; i++) {
      postReq.append("Attachments[" + i + "].Attachment.File", this.state.selectedFiles[i]);
      postReq.append("Attachments[" + i + "].Remark", "Y");
    }
    for (let i = 0; i < this.state.deptHeadSelected.length; i++) {
      postReq.append("DepartmentHeads[" + i + "]", this.state.deptHeadSelected[i].value);


    }
    // for (var pair of postReq.entries()) {
    //   console.log(pair[0] + ', ' + pair[1]);
    // }

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
      this.postData(postReq)
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
    let url = 'http://192.168.1.47/echopx/api/v1/documents?companyid=mbafc&departmentid=itafc&choptypeid=conchop&teamid=mbafcit'
    let tempDocs = []

    // let url = 'http://192.168.1.47/echopx/api/v1/documents?companyid=' + companyId + '&departmentid=' + deptId + '&choptypeid=' + chopTypeId + '&teamid=' + teamId;
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

  async postData(formData) {
    try {
      await axios.post('http://192.168.1.47/echopx/api/v1/tasks', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        .then(res => {
          Swal.fire({
            title: res.data.status,
            html: 'Request Saved <br /> Reference Number: ' + res.data.referenceNum,
            type: res.data.status
          })
        })
    } catch (error) {
      console.error(error);
    }
  }

  async getUserData() {
    let token = localStorage.getItem('token')
    let ticket = localStorage.getItem('ticket')
    let userId = localStorage.getItem('userId')
    await axios.get('http://192.168.1.47/echopx/api/v1/users/' + userId, { headers: { 'ticket': ticket } })
      .then(res => {
        this.setState({ employeeId: res.data.employeeNum, telNumber: res.data.telephoneNum, userId: userId })
      })
  }

  async getDeptHead(companyId) {

    await axios.get('http://192.168.1.47/echopx/api/v1/users?roleid=dh&companyid=' + companyId)
      .then(res => {
        this.setState({ deptHead: res.data })
      })
  }

  async getTeams(deptId) {
    let url = "http://192.168.1.47/echopx/api/v1/teams?companyid=" + this.props.legalName + "&departmentId=" + deptId
    await axios.get(url).then(res => {
      this.setState({ teams: res.data })
    })
  }

  async getChopTypes(companyId, appTypeId) {
    await axios.get('http://192.168.1.47/echopx/api/v1/choptypes?companyid=' + companyId + '&apptypeid=' + appTypeId)
      .then(res => {
        this.setState({ chopTypes: res.data })
      })
  }

  //handle value on changes
  handleChange = name => event => {
    if (event.target.value === "CONCHOP") {
      this.toggleModal();
    }
    // if (event.target.name === "deptHead") {
    //   if (event.target.value === this.state.deptHeadSelected || event.target.value === this.state.deptHeadSelected2) {
    //     event.target.value = ""

    //   }
    // }

    if (name === "returnDate") {
      console.log(event.target.value)
    }
    if (event.target.value === "BRCCHOP") {
      this.setState({ showBranches: true })
      this.getData("branches", 'http://192.168.1.47/echopx/api/v1/branches?companyid=mblc')
    }
    else {
      this.setState({ showBranches: false })
    }

    if (name === "appTypeSelected") {
      if (event.target.value === "LTI") {
        this.setState({ showDocAttach: true, showDocDropdown: false, showTeams: true })
        if (this.state.deptSelected !== "") {
          this.getTeams(this.state.deptSelected)
        }
      }
      else if (event.target.value === "LTU") {
        this.setState({ showDocDropdown: true, showDocAttach: false, showTeams: true })
        if (this.state.deptSelected !== "") {
          this.getTeams(this.state.deptSelected)
          if (this.state.teamSelected !== "" && this.state.chopTypeSelected !== "" && this.state.deptSelected !== "") {
            this.getDocuments(this.props.legalName, this.state.deptSelected, this.state.chopTypeSelected, this.state.teamSelected)
          }
        }
      }
      else {
        this.setState({ showDocAttach: false, showDocDropdown: false, showTeams: false })
      }
      if (event.target.value === "CNIPS") {
        // this.getData("chopTypes", 'http://192.168.1.47/echopx/api/v1/apptypes/CNIPS/choptypes')
        this.setState({ CNIPS: true })

      }
      else {
        this.setState({ CNIPS: false })
      }
      this.getChopTypes(this.props.legalName, event.target.value)
    }
    else if (name === "chopTypeSelected") {
      if (this.state.deptSelected !== "" && this.state.teamSelected !== "" && this.state.appTypeSelected === "LTU") {
        this.getDocuments(this.props.legalName, this.state.deptSelected, event.target.value, this.state.teamSelected)
      }
    }
    else if (name === "deptSelected") {
      if (this.state.appTypeSelected === "LTU" || this.state.appTypeSelected === "LTI") {
        this.getTeams(event.target.value)
      }
      if (this.state.teamSelected !== "" && this.state.chopTypeSelected !== "" && this.state.appTypeSelected === "LTU") {
        this.getDocuments(this.props.legalName, event.target.value, this.state.chopTypeSelected, this.state.teamSelected)
      }
    }
    else if (name === "teamSelected") {
      if (this.state.chopTypeSelected !== "" && this.state.appTypeSelected === "LTU") {
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

  deleteAttachment(i) {
    this.setState(state => {
      const selectedFiles = state.selectedFiles.filter((item, index) => i !== index);
      return {
        selectedFiles
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
    })
  }

  addDocumentLTI() {
    var maxNumber = 45;
    var rand = Math.floor((Math.random() * maxNumber) + 1);
    console.log(this.state.docSelected)
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
      axios.get(`http://192.168.1.47/echopx/api/v1/users?displayName=%${value}`)
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

  agreeTerm(event) {
    if (event.target.checked) {
      this.setState({
        agreeTerms: true
      })
    }
    else {
      this.setState({
        agreeTerms: false
      })
    }
  }

  handleDeptHead(newValue) {
    this.setState({ deptHeadSelected: newValue }, console.log(this.state.deptHeadSelected))
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

  //scroll To Function
  // scrollToRef = (ref) => window.scrollTo(0, ref)

  render() {
    const deptHeads = []
    var pointer;
    const { pickUpBy, suggestions, resPerson, contractSign1, contractSign2, hover, CNIPS, deptHead } = this.state;
    for (let i = 0; i < deptHead.length; i++) {
      const obj = { value: deptHead[i].userId, label: deptHead[i].displayName }
      deptHeads.push(obj)
    }
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

    const loadOptions = (inputValue, callback) => {
      setTimeout(() => {
        callback(filterColors(inputValue));
      }, 100);
    }

    const status = (this.state.isLoading ? <Spinner size="sm" color="primary" /> : '');
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

          {this.state.CNIPS
            ? <Col ><FormGroup>
              <InputMask mask="*-*-*-9999-9999" className="form-control" defaultValue={this.state.contractNum} onChange={this.handleChange("contractNum")}></InputMask>
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
              enableRowSelect
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
            <Form className="form-horizontal">
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
                <Input ref={this.appTypeSelected} type="select" onChange={this.handleChange("appTypeSelected")} id="appTypeSelected" defaultValue="0" name="select">
                  <option disabled value="0">Please Select . . .</option>
                  {this.state.applicationTypes.map((option, id) => (

                    <option value={option.appTypeId} key={option.appTypeId}>{option.appTypeName}</option>

                  ))}
                </Input>
                <FormFeedback>Invalid Application Type Selected </FormFeedback>

              </FormGroup>
              {this.state.showDocAttach
                ? <FormGroup>
                  <Label>Effective Period</Label>
                  <Input type="date" onChange={this.handleChange("effectivePeriod")} id="effectivePeriod"></Input>
                  <FormFeedback>Invalid Date Selected</FormFeedback>
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
                    <option value="0" disabled>Please specify your Brand Company Chop</option>
                    {this.state.branches.map((branch, index) =>
                      <option value={branch.branchId} key={index}>{branch.branchName}</option>
                    )}
                  </Input>
                </FormGroup>
                : ""
              }

              <FormGroup>
                <Label>Document Name</Label>
                {!this.state.showDocAttach && !this.state.showDocDropdown ? documentForLTI : ""}
                {this.state.showDocDropdown ? documentForLTU : ""}
                {this.state.showDocAttach ? documentForLTI : ""}
                <FormFeedback>Invalid Input a valid Document Name</FormFeedback>
              </FormGroup>
              <FormGroup>
                <Label>Purpose of Use</Label>
                <InputGroup>
                  <Input ref={this.purposeOfUse} onChange={this.handleChange("purposeOfUse")} placeholder="Enter the Purpose of Use" type="textarea" name="textarea-input" id="purposeOfUse" rows="3" />
                  <FormFeedback>Please input the purpose of use</FormFeedback>
                </InputGroup>
              </FormGroup>
              {!this.state.showDocAttach
                ? <FormGroup>
                  {/* <Row> */}
                  {/* <Col sm={2}> */}
                  <Label>Connecting Chop (骑缝章) </Label>
                  <Row />
                  {/* </Col> */}
                  {/* <Col> */}
                  <AppSwitch dataOn={'yes'} onChange={this.toggleConnection} checked={this.state.connectingChop} dataOff={'no'} className={'mx-1'} variant={'3d'} color={'primary'} outline={'alt'} label></AppSwitch>

                  {/* </Col> */}
                  {/* </Row> */}
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
                  <Input type="date" id="returnDate" onChange={this.handleChange("returnDate")} name="date-input" />
                </FormGroup>
                <FormGroup>
                  <Label>Responsible Person <i className="fa fa-user" /></Label>
                  <Autosuggest
                    id="resPerson"
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    getSuggestionValue={this.getSuggestionValue}
                    renderSuggestion={this.renderSuggestion}
                    inputProps={inputResPerson}
                  />
                  {/* <Input type="text" id="resPerson" onChange={this.handleChange("resPerson")} placeholder="responsible person" /> */}
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
                <InputGroup>
                  <Autosuggest
                    id="pickUpBy"
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    getSuggestionValue={this.getSuggestionValue}
                    renderSuggestion={this.renderSuggestion}
                    inputProps={inputProps}
                    renderInputComponent={this.renderInputComponent}
                  />
                  {/* <FormFeedback>Please select a person  to pick up by</FormFeedback> */}

                  {/* <Input ref={this.pickUpBy} onChange={this.handleChange("pickUpBy")} id="pickUpBy" size="16" type="text" placeholder="enter name to search ..." /> */}
                  <FormFeedback>Please enter a valid name to search</FormFeedback>
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <Label>Remark (e.g. tel.) </Label>
                <InputGroup>
                  <Input ref={this.remarks} onChange={this.handleChange("remarks")} id="remarks" size="16" type="textbox" placeholder="pick up presons's phone number" />
                  <FormFeedback>Please enter valid remarks</FormFeedback>
                </InputGroup>
              </FormGroup>
              {this.state.showTeams
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
              {this.state.CNIPS
                ? <FormGroup>
                  <Label>Contract Signed By: <i className="fa fa-user" /></Label>
                  <small> &ensp; Please fill in the DHs who signed the contract and keep in line with MOA; If for Direct Debit Agreements, Head of FGS and Head of Treasury are needed for approval</small>
                  <Row>
                    <Col>
                      <InputGroup>
                        <Autosuggest
                          id="contractSign1"
                          suggestions={suggestions}
                          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                          getSuggestionValue={this.getSuggestionValue}
                          renderSuggestion={this.renderSuggestion}
                          inputProps={inputContract1}
                        />
                        {/* <Input typew="text" placeholder="Enter name of First Person" onChange={this.handleChange("contractSign1")}></Input> */}
                      </InputGroup>
                    </Col>
                    <Col>
                      <InputGroup>
                        <Autosuggest
                          id="contractSign2"
                          suggestions={suggestions}
                          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                          getSuggestionValue={this.getSuggestionValue}
                          renderSuggestion={this.renderSuggestion}
                          inputProps={inputContract2}
                        />
                        {/* <Input type="text" placeholder="Enter name of Second Person" onChange={this.handleChange("contractSign2")} ></Input> */}
                      </InputGroup>
                    </Col>
                  </Row>


                </FormGroup>
                : <FormGroup>
                  <Label>Department Heads <i className="fa fa-user" /></Label>
                  <small> &ensp; If you apply for {this.props.legalName} Company Chop, then Department Head shall be from {this.props.legalName} entity</small>
                  {/* <InputGroup> */}
                  <AsyncSelect loadOptions={loadOptions} isMulti onChange={this.handleDeptHead}
                    menuPortalTarget={document.body} styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                  />
                  {/* <Input id="deptHeadSelected" onChange={this.handleChange("deptHeadSelected")} name="deptHead" defaultValue="0" type="select">
                      <option value="0" disabled> Please select first Department Head</option>
                      {this.state.deptHead.map((head, index) =>
                        <option value={head.employeeNum} key={index}>{head.displayName}</option>
                      )}
                    </Input>
                    <FormFeedback>Please select a department head</FormFeedback> */}
                  {/* </InputGroup> */}
                </FormGroup>
              }

              <Col md="16">
                <FormGroup check>
                  <FormGroup>
                    <CustomInput
                      className="form-check-input"
                      type="checkbox"
                      onChange={this.agreeTerm}
                      id="confirm" value="option1">
                      <Label className="form-check-label" check >
                        By ticking the box, I confirm that I hereby acknowledge that I must comply the internal Policies and Guidelines &
                        regarding chop management and I will not engage in any inappropriate chop usage and other inappropriate action
                      </Label>
                    </CustomInput>
                  </FormGroup>
                </FormGroup>
              </Col>
              <FormGroup>
                <Label >Attachments</Label>
                &emsp;
                <small>Please upload Sign-off Sheet and Contract</small>
                <Row />
                <CustomInput multiple id="selectedFile" type="file" color="primary" label={this.state.fileName} onChange={this.uploadFile} />
                <FormFeedback>Please upload a file</FormFeedback>
                <Collapse isOpen={this.state.selectedFiles.length !== 0}>
                  {/* <Table hover>
                    <thead>

                    </thead>
                    <tbody>
                      {this.state.selectedFiles.map((file, index) =>
                        <tr key={index}>
                          <th> {file.name}</th>
                          <th onClick={()=> this.deleteAttachment(index)}>Delete</th>
                        </tr>
                      )}
                    </tbody>
                  </Table> */}
                  <Card>
                    <CardBody>

                      {this.state.selectedFiles.map((file, index) =>
                        <div key={index}>
                          <Row>
                            <Col lg={11}>{file.name}</Col>
                            <Col> <img style={pointer} width="30px" onMouseOver={this.toggleHover} onClick={() => this.deleteAttachment(index)} src={deleteBin} /> </Col>
                            {/* <Col >Delete</Col> */}

                          </Row>
                          <hr />
                        </div>
                      )}
                    </CardBody>
                  </Card>


                </Collapse>
                <Row />
              </FormGroup>
            </Form>
          </CardBody>
          <CardFooter>
            <div className="form-actions">
              <Row>
                {this.state.agreeTerms ? <Button type="submit" color="success" onClick={this.submitRequest}>Submit</Button> : <Button disabled type="submit" color="success">Submit</Button>}
                <span>&nbsp;</span>
                <Button type="submit" color="primary" onClick={this.saveRequest}>Save</Button>
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