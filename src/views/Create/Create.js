import React, { Component } from 'react';
// import Autosuggest from 'react-autosuggest'
import { AppSwitch } from '@coreui/react';
import axios from 'axios';
import Swal from 'sweetalert2';
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
} from 'reactstrap';

//notes can be updated by text only or editable in HTML editor
const notes = <p>如您需申请人事相关的证明文件包括但不限于“在职证明”，“收入证明”，“离职证明”以及员工福利相关的申请材料等，请直接通过邮件提交您的申请至人力资源部。如对申请流程有任何疑问或问题，请随时联系HR。
  For HR related certificates including but not limited to the certificates of employment, income, resignation and benefits-related application materials, please submit your requests to HR department by email directly.
  If you have any questions regarding the application process, please feel free to contact HR. </p>;

class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {

      //retrieve from department Types Table
      department: [],
      //retrieve from application types table
      applicationTypes: [],
      //retrieve from chop types table
      chopTypes: [],

      //retrieve from DH table
      deptHead: "",
      collapse: false,
      fadeIn: true,
      modal: false,
      timeout: 300,

      //data to be created inside Request Table
      employeeId: 1234546,    //retrieved from user Info
      telNumber: 123456,      //retrieved from user Info
      contractNum: 0,
      deptSelected: "",
      appTypeSelected: "",
      chopTypeSelected: "",
      docName: "",
      purposeOfUse: "",
      numOfPages: 0,
      addressTo: "",
      pickBy: "",
      remark: "",
      selectedFile: null,
      fileName: "Choose File",

      agreeTerms: false,
    };


    //binding method for button
    this.toggle = this.toggle.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.agreeTerm = this.agreeTerm.bind(this);
    this.submitRequest = this.submitRequest.bind(this);


  };

  componentDidMount() {
    //Get User Details
    this.getData("department",'http://192.168.1.47:4444/api/v1/department');
    this.getData("applicationTypes",'http://192.168.1.47:4444/api/v1/apptype');
    this.getData("chopTypes",'http://192.168.1.47:4444/api/v1/choptype');
    
  }

  submitRequest() {
    //Create Request .
    Swal.fire(
      'Good job!',
      'You clicked the button!',
      'success'
    )
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

  //Axios
  async getData(state,url) {
    try {
      const response = await axios.get(url);
      this.setState({
        [state] : response.data
      })
    } catch (error) {
      console.error(error);
    }
  }

  


  //handle ChopType
  handleChopType = event => {
    if (event.target.value === "Contract Chop") {
      this.toggleModal();
    }
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  //handle value on change
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };


  uploadFile = event => {
    this.setState({
      selectedFile: event.target.files[0],
      fileName: event.target.files[0].name

    })
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
  render() {
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
                    <Input onChange={this.handleChange("employeeId")} defaultValue={this.state.employeeId} id="prependedInput" size="16" type="text" />
                  </InputGroup>
                  {/* <p className="help-block">Here's some help text</p> */}
                </div>
              </FormGroup>
              <FormGroup>
                <Label>Tel. </Label>
                <InputGroup>
                  <Input onChange={this.handleChange("telNumber")} id="appendedInput" size="16" type="text" />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <Label>Dept</Label>
                <Input type="select" onChange={this.handleChange("deptSelected")} defaultValue="0" name="dept">
                  <option disabled value="0">Please Select . . .</option>
                  {this.state.department.map(option => (
                    <option value={option.name} key={option.name}>
                      {option.name}
                    </option>
                  ))}
                </Input>
              </FormGroup>
              <FormGroup>
                <Label>Application Type</Label>
                <Input type="select" onChange={this.handleChange("appTypeSelected")} defaultValue="0" name="select" id="select">
                  <option disabled value="0">Please Select . . .</option>
                  {this.state.applicationTypes.map((option, id) => (
                    <option value={option.name} key={id}>{option.name}</option>
                  ))}
                </Input>
              </FormGroup>
              <FormGroup>
                <Label>Contract Number</Label>
                <InputGroup>
                  <Input id="appendedInput" size="16" type="text" onChange={this.handleChange("contractNum")} />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <Label>Chop Type</Label>
                <Input type="select" onChange={this.handleChopType} defaultValue="0" name="chopType" >
                  <option disabled value="0">Please Select ..</option>
                  {this.state.chopTypes.map((option, id) => (
                    <option key={id} value={option.name}>{option.name}</option>
                  ))}

                </Input>
              </FormGroup>
              <FormGroup>
                <Label>Document Name</Label>
                <InputGroup>
                  <Input value={this.state.docName} onChange={this.handleChange("docName")} type="textarea" name="textarea-input" id="textarea-input" rows="3" placeholder="please describe in English or Chinese" />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <Label>Purpose of Use</Label>
                <InputGroup>
                  <Input value={this.state.purposeOfUse} onChange={this.handleChange("purposeOfUse")} type="textarea" name="textarea-input" id="textarea-input" rows="3" />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <Label>Number of Pages to Be Chopped</Label>
                <InputGroup>
                  <Input value={this.state.numOfPages} onChange={this.handleChange("numOfPages")} id="appendedInput" size="16" type="text" />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <Label>Use in Office or Not</Label>
                <Row />
                <AppSwitch onChange={this.toggle} id="useOff" size="lg" className={'mx-1'} variant={'pill'} color={'success'} outline={'alt'} label />
              </FormGroup>
              <Collapse isOpen={this.state.collapse}>
                <FormGroup visibelity="false" >
                  <Label>Return Date</Label>
                  <Input type="date" id="date-input" name="date-input" />
                </FormGroup>
                <FormGroup>
                  <Label>Responsible Person <i className="fa fa-user" /></Label>
                  <Input type="text" id="res-person" placeholder="responsible person" />
                </FormGroup>
              </Collapse>
              <FormGroup>
                <Label>Address to</Label>
                <InputGroup>
                  <Input value={this.state.addressTo} onChange={this.handleChange("addressTo")} type="textarea" name="textarea-input" id="textarea-input" rows="5" placeholder="Docuemnts will be adressed to" />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <Label>Pick Up By <i className="fa fa-user" /></Label>
                <InputGroup>
                  <Input value={this.state.pickBy} onChange={this.handleChange("pickUpBy")} id="appendedInput" size="16" type="text" placeholder="enter name to search ..." />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <Label>Remark (e.g. tel.) </Label>
                <InputGroup>
                  <Input value={this.state.remark} onChange={this.handleChange("remarks")} id="appendedInput" size="16" type="text" placeholder="pick up presons's phone number" />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <Label>Department Heads <i className="fa fa-user" /></Label>
                <small> &ensp; If you apply for MBAFC Company Chop, then Department Head shall be from MBAFC entity</small>
                <InputGroup>
                  <Input id="appendedInput" size="16" type="text" placeholder="enter name to search ..." />
                </InputGroup>
              </FormGroup>
              <Col md="16">
                <FormGroup check>
                  <FormGroup>
                    <CustomInput 
                    className="form-check-input" 
                    type="checkbox" 
                    onChange={this.agreeTerm} 
                    id="confirm"  value="option1">
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
                <CustomInput id="upload" type="file" color="primary" label={this.state.fileName} onChange={this.uploadFile} />
              </FormGroup>
            </Form>
          </CardBody>
          <CardFooter>
            <div className="form-actions">
              {this.state.agreeTerms ? <Button type="submit" color="success" onClick={this.submitRequest}>Submit</Button> : <Button disabled type="submit" color="success">Submit</Button>}
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
            <Button color="success" size="md"> Yes </Button>
            <Button color="secondary" size="md"> No </Button>
          </ModalFooter>
        </Modal>
      </div>
    );

  }
}

export default Create;