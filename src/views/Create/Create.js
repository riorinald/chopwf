import React, { Component } from 'react';
// import Autosuggest from 'react-autosuggest'
import { AppSwitch } from '@coreui/react';
import axios from 'axios';
import Swal from 'sweetalert2';
import FileViewer from 'react-file-viewer';
import Autosuggest from 'react-autosuggest';
import theme from './theme.css'

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
  Spinner,
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';

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
      contractNum: 0,
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
      deptHeadSelected: 0,
      contractSignedBy: "",
      contractSign1: "",
      contractSign2: "",
      effectivePeriod: "",
      selectedFile: null,
      fileName: "Choose File",
      teamSelected: "",

      documentTableLTI: [],

      documentTableLTU: [],

      agreeTerms: false,
      showDocAttach: false,
      showDocDropdown: false,
      showTeams: false,

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

      reqInfo: [
        { id: "deptSelected", valid: false },
        { id: "appTypeSelected", valid: false },
        { id: "contractNum", valid: false },
        { id: "chopTypeSelected", valid: false },
        { id: "docName", valid: false },
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
    this.modal = this.modal.bind(this);
    this.addDocumentLTU = this.addDocumentLTU.bind(this);
    this.saveRequest = this.saveRequest.bind(this);

  };

  componentDidMount() {
    //Get User Details

    this.getUserData();
    this.getData("department", 'http://192.168.1.47/echop/api/v1/departments');
    this.getData("applicationTypes", 'http://192.168.1.47/echop/api/v1/apptypes');
    this.getData("chopTypes", 'http://192.168.1.47/echop/api/v1/choptypes');
    // this.getData("users", 'http://192.168.1.47/echop/api/v1/users?displayName=');
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
    const postReq = {
      "userId": this.state.userId,
      "employeeNum": this.state.employeeId,
      "companyId": this.state.legalEntity,
      "departmentId": this.state.deptSelected,
      "applicationTypeId": this.state.appTypeSelected,
      "chopTypeId": this.state.chopTypeSelected,
      "documentName": this.state.docName,
      "useInOffice": useInOffice,
      "departmentHead": this.state.deptHeadSelected,
      "documentDescription": "lorem ipsum dolor sit amet",
      "addressTo": this.state.addressTo,
      "contractNo": this.state.contractNum,
      "contractName": "lorem ipsum dolor sit amet",
      "purposeOfUse": this.state.purposeOfUse,
      "remark": this.state.remarks,
      "numOfPages": this.state.numOfPages,
      "confirmed": this.state.agreeTerms,
      // "returnDate": this.state.returnDate, //2019-10-22
      "returnDate": "20191022",
      "responsiblePerson": this.state.resPerson,
      "contractSignedBy": this.state.contractSignedBy,
      "contractSignedByFirstPerson": this.state.contractSign1,
      "contractSignedBySecondPerson": this.state.contractSign2,
      "effectivePeriod": "",
      "isSubmitted": Submitted
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
    const postReq = {
      "userId": this.state.userId,
      "employeeNum": this.state.employeeId,
      "companyId": this.state.legalEntity,
      "departmentId": this.state.deptSelected,
      "applicationTypeId": this.state.appTypeSelected,
      "chopTypeId": this.state.chopTypeSelected,
      "documentName": this.state.docName,
      "useInOffice": useInOffice,
      "departmentHead": this.state.deptHeadSelected,
      "documentDescription": "lorem ipsum dolor sit amet",
      "addressTo": this.state.addressTo,
      "contractNo": this.state.contractNum,
      "contractName": "lorem ipsum dolor sit amet",
      "purposeOfUse": this.state.purposeOfUse,
      "remark": this.state.remarks,
      "numOfPages": this.state.numOfPages,
      "confirmed": this.state.agreeTerms,
      // "returnDate": this.state.returnDate, //2019-10-22
      "returnDate": "20191022",
      "responsiblePerson": this.state.resPerson,
      "contractSignedBy": this.state.contractSignedBy,
      "contractSignedByFirstPerson": this.state.contractSign1,
      "contractSignedBySecondPerson": this.state.contractSign2,
      "effectivePeriod": "",
      "isSubmitted": Submitted

    }

    await this.validate()
    for (let i = 0; i < this.state.reqInfo.length; i++) {
      if (this.state.reqInfo[i].valid) {
        this.setState({ valid: true })
      }
      else {
        this.setState({ valid: false })

        //function to scroll to specific posittion
          // var el = this[this.state.reqInfo[i].id].current
          // var elOffSetTop = document.getElementById(this.state.reqInfo[i].id).getBoundingClientRect().y
          // var el = window.outerHeight + elOffSetTop
          // var el = document.getElementById("contractNum").getBoundingClientRect()
          // this.scrollToRef(el)
          // console.log(window.outerHeight)
          // console.log(elOffSetTop)
          // console.log(this.state.reqInfo[i].id)
        
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
  //toggle Modal
  toggleModal() {
    this.setState({
      modal: !this.state.modal,
    });
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

  async postData(formData) {
    try {
      await axios.post('http://192.168.1.47/echop/api/v1/applications', formData, { headers: { 'Content-Type': '  application/json' } })
        .then(res => {
          console.log(res.data)
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
    await axios.get('http://192.168.1.47/echop/api/v1/users/' + userId, { headers: { 'ticket': ticket } })
      .then(res => {
        this.setState({ employeeId: res.data.employeeNum, telNumber: res.data.telephoneNum, userId: userId })
      })
  }

  async getDeptHead(companyId, deptId, teamId) {
    if (teamId === "") {
      await axios.get('http://192.168.1.47/echop/api/v1/deptheads?companyId=' + companyId)
        .then(res => {
          this.setState({ deptHead: res.data })
        })
    }
    else {
      await axios.get('http://192.168.1.47/echop/api/v1/deptheads?companyId=' + companyId + '&teamId=' + teamId)
        .then(res => {
          this.setState({ deptHead: res.data })
        })
    }

  }

  async updateChopTypes(appTypeId, companyId) {
    await axios.get('http://192.168.1.47/echop/api/v1/choptypes?companyId=' + companyId + '&appTypeId=' + appTypeId)
      .then(res => {
        this.setState({ chopTypes: res.data })
      })
  }

  async getTeams(deptId) {
    let url = "http://192.168.1.47/echop/api/v1/teams?departmentId="
    await axios.get(url + deptId).then(res => {
      this.setState({ teams: res.data })
    })
  }

  //handle value on changes
  handleChange = name => event => {
    if (event.target.value === "CONCHOP") {
      this.toggleModal();
    }

    if (name === "returnDate") {
      console.log(event.target.value)
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
        }
      }
      else {
        this.setState({ showDocAttach: false, showDocDropdown: false, showTeams: false })
      }
      if (event.target.value === "CNIPS") {
        this.getData("chopTypes", 'http://192.168.1.47/echop/api/v1/apptypes/CNIPS/choptypes')
        this.setState({ CNIPS: true })

      }
      else {
        this.getData("chopTypes", 'http://192.168.1.47/echop/api/v1/choptypes')
        this.setState({ CNIPS: false })
      }
      this.updateChopTypes(event.target.value, "MBAFC")
    }
    else if (name === "deptSelected") {
      this.getDeptHead("MBAFC", event.target.value, "")
      if (this.state.appTypeSelected === "LTU" || this.state.appTypeSelected === "LTI") {
        this.getTeams(event.target.value)
      }
    }
    else if (name === "teamSelected") {
      this.getDeptHead("MBAFC", this.state.deptSelected, event.target.value)
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

  addDocumentLTI() {
    var maxNumber = 45;
    var rand = Math.floor((Math.random() * maxNumber) + 1);

    const obj = {
      id: rand,
      engName: this.state.engName,
      cnName: this.state.cnName,
      docSelected: this.state.docSelected,
      docName: this.state.docAttachedName
    }
    this.setState(state => {
      const documentTableLTI = state.documentTableLTI.concat(obj)

      return {
        documentTableLTI
      }
    })
  }

  addDocumentLTU() {

    let selectedId = parseInt(this.state.docSelectedLTU)
    let tempDocLTI = this.state.documentTableLTI
    let tempDocLTU = this.state.documentTableLTU
    let exist = false
    this.setState(state => {
      if (tempDocLTU.length !== 0) {
        for (let p = 0; p < tempDocLTU.length; p++) {
          if (selectedId === tempDocLTU[p].id) {
            exist = true
            Swal.fire({
              title: 'Error',
              text: 'Document already exists',
              type: 'error'
            })
            break;
          }
          else {
            exist = false
          }
        }
      }
      if (!exist) {
        for (let i = 0; i < tempDocLTI.length; i++) {
          if (tempDocLTI[i].id === selectedId) {
            const documentTableLTU = state.documentTableLTU.concat(tempDocLTI[i])
            console.log("Added: " + tempDocLTI[i].id)
            return {
              documentTableLTU
            }
          }
        }
      }
    })
  }
  // getSuggestions = value => {
  //   const inputValue = value.trim().toLowerCase();
  //   const inputLength = inputValue.length;

  //   return inputLength === 0 ? [] : this.state.users.filter(user =>
  //     user.displayName.toLowerCase().slice(0, inputLength) === inputValue
  //   );
  // };

  getSuggestions(value) {
    this.setState({
      isLoading: !this.isLoading
    });
    const thisReq = this.lastReq = 
    axios.get(`http://192.168.1.47/echop/api/v1/users?displayName=%${value}`)
      .then(response => {
          if(thisReq !== this.lastReq) {
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
    // <Dropdown isOpen={true}>
    //   <DropdownToggle>Dropdown</DropdownToggle>
    //   <DropdownMenu>
    //     <DropdownItem>{suggestion.displayName}</DropdownItem>
    //   </DropdownMenu>
    // </Dropdown>
    // <Input type="select">
    //   <option>{suggestion.displayName}</option>
    // </Input>
    <Table className="suggestBox">
      <tbody>
        <tr>
          <td>{suggestion.displayName}</td>
        </tr>
      </tbody>
    </Table>
  )


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
    if (event.target.files[0]) {
      this.setState({
        selectedFile: event.target.files[0],
        fileName: event.target.files[0].name

      })
    }
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

  modal(doc) {
    let dem = !this.state.showDoc
    this.setState({ showDoc: dem, docPreview: doc })
    let type = ""
    if (dem) {
      if (doc.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        type = "docx"
      }
      else if (doc.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        type = "xlsx"
      }
      else if (doc.type === "application/pdf") {
        type = "pdf"
      }
      else if (doc.type === "application/vnd.ms-excel") {
        type = "csv"
      }
      else if (doc.type === "image/jpeg") {
        type = "jpeg"
      }
      else if (doc.type === "image/png") {
        type = "png"
      }
      else if (doc.type === "image/gif") {
        type = "gif"
      }
      else if (doc.type === "image/bmp") {
        type = "bmp"
      }
      this.setState({ fileURL: URL.createObjectURL(doc), fileType: type })
    }
  }


  //scroll To Function
  // scrollToRef = (ref) => window.scrollTo(0, ref)

  render() {
    const { pickUpBy, suggestions, resPerson, contractSign1, contractSign2 } = this.state;
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

    const DocTable = <Table bordered>
      <thead>
        <tr>
          <th>No.</th>
          <th>Document Name in English</th>
          <th>Document Name in Chinese</th>
          <th>Attached File</th>
        </tr>
      </thead>
      <tbody>
        {this.state.documentTableLTI.map((document, index) =>
          <tr key={index}>
            <th>{index + 1}</th>
            <th>{document.engName}</th>
            <th>{document.cnName}</th>
            <th onClick={() => this.modal(document.docSelected)}>{document.docName}</th>
          </tr>
        )}
      </tbody>
    </Table>

    const documentForLTI =
      <div>
        <Row form>
          <Col md={4}>
            <FormGroup>
              {/* <Label>English Name</Label> */}
              <Input value={this.state.engName} onChange={this.handleChange("engName")} type="text" name="textarea-input" id="docName" rows="3" placeholder="please describe in English" />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              {/* <Label>Chinese Name</Label> */}
              <Input value={this.state.cnName} onChange={this.handleChange("cnName")} type="text" name="textarea-input" id="cnName" rows="3" placeholder="please describe in Chinese" />
            </FormGroup>
          </Col>
          <Col md={3}>
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
        <br />
        {this.state.documentTableLTI.length !== 0 ? DocTable : ""}
      </div>

    const documentForLTU =
      <div>
        {/* <Label>Document Name</Label> */}
        <InputGroup style={{ display: "flex" }}>
          <Input type="select" name="select" id="exampleSelect" onChange={this.handleChange("docSelectedLTU")} defaultValue={0}>
            <option value={0} disabled>Please select the document</option>
            {this.state.documentTableLTI.map((document, index) =>
              <option key={index} value={document.id}>Document Name (English): {document.engName}, Document Name (Chinese): {document.cnName}</option>
            )}
          </Input>
          <Button onClick={this.addDocumentLTU}>Add Document</Button>
        </InputGroup>

        {this.state.documentTableLTU.length !== 0 ?
          <div>
            <br />
            <Table bordered>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Document Name in English</th>
                  <th>Document Name in Chinese</th>
                  <th>Attached File</th>
                </tr>
              </thead>
              <tbody>
                {this.state.documentTableLTU.map((document, index) =>
                  <tr key={index}>
                    <th>{index + 1}</th>
                    <th>{document.engName}</th>
                    <th>{document.cnName}</th>
                    <th onClick={() => this.modal(document.docSelected)}>{document.docName}</th>
                  </tr>
                )}
              </tbody>
            </Table>
          </div> : ""}

      </div>

    const documentNormal =
      <div>
        {/* <Label>Document Name</Label> */}
        <InputGroup>
          <Input ref={this.docName} onChange={this.handleChange("docName")} type="textarea" name="textarea-input" id="docName" rows="3" placeholder="please describe in English or Chinese" />
          <FormFeedback>Invalid Document Name</FormFeedback>
        </InputGroup>
      </div>

    let file = this.state.fileURL
    let type = this.state.fileType

    const docModal =
      < Modal size="lg" scrollable isOpen={this.state.showDoc} >
        <ModalHeader>{this.state.showDoc ? "File: " + this.state.docPreview.name : ""}</ModalHeader>
        <ModalBody>
          <FileViewer
            fileType={type}
            filePath={file}></FileViewer>
        </ModalBody>
        <ModalFooter>
          <Button onClick={this.modal}>Close</Button>
        </ModalFooter>
      </Modal >

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
                <Input ref={this.deptSelected} id="deptSelected" type="select" onChange={this.handleChange("deptSelected")} defaultValue="0" name="dept">
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
              {this.state.CNIPS
              ?
              <FormGroup>
                <Label>Contract Number</Label>
                <InputGroup>
                  <Input ref={this.contractNum} id="contractNum" size="16" type="text" onChange={this.handleChange("contractNum")} />
                  <FormFeedback >Invalid Contract Number</FormFeedback>
                </InputGroup>
              </FormGroup>
              : <span />
              }
              <FormGroup>
                <Label>Chop Type</Label>
                <Input ref={this.chopTypeSelected} type="select" id="chopTypeSelected" onChange={this.handleChange("chopTypeSelected")} defaultValue="0" name="chopType" >
                  <option disabled value="0">Please Select ..</option>
                  {this.state.chopTypes.map((option, id) => (

                    <option key={option.chopTypeId} value={option.chopTypeId}>{option.chopTypeName}</option>

                  ))}

                </Input>
                <FormFeedback>Invalid Chop Type Selected</FormFeedback>
              </FormGroup>
              <FormGroup>
                <Label>Document Name</Label>
                {!this.state.showDocAttach && !this.state.showDocDropdown ? documentNormal : ""}
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
              <FormGroup>
                <Label>Number of Pages to Be Chopped</Label>
                <InputGroup>
                  <Input ref={this.numOfPages} onChange={this.handleChange("numOfPages")} id="numOfPages" size="16" type="text" />
                  <FormFeedback>Invalid Number of pages </FormFeedback>
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <Label>Use in Office or Not</Label>
                <Row />
                <AppSwitch onChange={this.toggle} checked={this.state.collapse} id="useOff" className={'mx-1'} variant={'3d'} color={'primary'} outline={'alt'}defaultChecked label dataOn={'yes'} dataOff={'no'} />
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
                <Label>Pick Up By <i className="fa fa-user" /> {status} </Label>
                <InputGroup>
                  <Autosuggest
                    id="pickUpBy"
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    getSuggestionValue={this.getSuggestionValue}
                    renderSuggestion={this.renderSuggestion}
                    inputProps={inputProps}
                  />
                  {/* <FormFeedback>Please select a person  to pick up by</FormFeedback> */}

                  {/* <Input ref={this.pickUpBy} onChange={this.handleChange("pickUpBy")} id="pickUpBy" size="16" type="text" placeholder="enter name to search ..." /> */}
                  <FormFeedback>Please enter a valid name to search</FormFeedback>
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <Label>Remark (e.g. tel.) </Label>
                <InputGroup>
                  <Input ref={this.remarks} onChange={this.handleChange("remarks")} id="remarks" size="16" type="text" placeholder="pick up presons's phone number" />
                  <FormFeedback>Please enter valid remarks</FormFeedback>
                </InputGroup>
              </FormGroup>
              {this.state.showTeams
                ? <FormGroup>
                  <Label>Team</Label>
                  <InputGroup>
                    <Input onChange={this.handleChange("teamSelected")} defaultValue="0" type="select">
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
                  <small> &ensp; If you apply for MBAFC Company Chop, then Department Head shall be from MBAFC entity</small>
                  <InputGroup>
                    <Input id="deptHeadSelected" onChange={this.handleChange("deptHeadSelected")} defaultValue="0" type="select">
                      <option value="0" disabled> Please select a Department Head</option>
                      {this.state.deptHead.map((head, index) =>
                        <option value={head.employeeNum} key={index}>{head.displayName}</option>
                      )}
                    </Input>
                    <FormFeedback>Please select a department head</FormFeedback>
                  </InputGroup>
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
                        By Ticking the box, I confirm the hereby acknowledge that i must comply the internal policies &
                       Guidelines regarding chop management and will not engage in any inappropriate chop usage or other inappropriate
                      </Label>
                    </CustomInput>
                  </FormGroup>
                </FormGroup>
              </Col>
              <FormGroup>
                <Label >Attachments</Label>
                <Row />
                <CustomInput id="selectedFile" type="file" color="primary" label={this.state.fileName} onChange={this.uploadFile} />
                <FormFeedback>Please upload a file</FormFeedback>
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
          <ModalHeader class="center" toggle={this.toggleModal}> Contract Chop </ModalHeader>
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
            <Button color="secondary" onClick={this.toggleModal} size="md"> No </Button>
          </ModalFooter>
        </Modal>
        {docModal}
      </div>
    );

  }
}



export default Create;