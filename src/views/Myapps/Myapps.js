import React, { Component } from 'react';
import {
Badge,
Card,
CardHeader,
CardBody,
Progress,
Col,
Button,
Label,
FormGroup,
Input,
Row, 
} from 'reactstrap';

class Myapps extends Component{
  render(){
    return(
      <div>
        <h3>My Applications</h3>
        <Card >
        <CardHeader >
        <Row className="align-items-left">
        
        <Col xs="auto">
        <Button color="outline-white"><i className="fa fa-angle-left" /> Back </Button>
        </Col>
        <Col xs={{size:'auto'}}>
        <Button color="danger"><i className="icon-loop" /> Reacall </Button>
        </Col>
        <Col xs="auto" >
        <Button color="warning"><i className="icon-bell" />Rremind Task Owner </Button>
        </Col>
      
      </Row>
        </CardHeader>
        <CardBody color="dark">
          <Row noGutters={true}>
            <Col md="6"><span className="display-5">CHOP201907041648491019</span></Col>
            <Col md="6">
            <Progress multi>
            <Progress bar animated striped color="warning" value="50">Department Head Reviewing</Progress>
            <Progress bar color="secondary" value="50">Bring Original Document to EG for Chop</Progress>
          </Progress>
            </Col>
          </Row>
        <Row>&nbsp;</Row>
        <Row>
         <Col md="1"> 
         <img src={'../../assets/img/avatars/5.jpg'} className="img-avaa" alt="admin@bootstrapmaster.com" />
         </Col>
         <Col>
         <Row>
         <Col md="5"><h5> Liu, ChenChen (685) </h5></Col>
         <Col md="5"><h5><i className="fa fa-tablet"/>&nbsp; +86 10 12345678 </h5></Col>
         </Row>
         <Row >
         <Col md="4"><h6> DFS/CN, MBAFC </h6></Col>
         </Row>
         <Row >
         <Col md="3">  
         <h6><center className="boxs">Applicant</center></h6>
         </Col>
         <Col md="2"></Col>
         <Col md="4"><h5><i className="fa fa-envelope"/>&nbsp; chenchen@daimler.com</h5></Col>
         </Row>
         </Col>
         </Row>
         <Row><Col>
         &nbsp;
         </Col></Row>
         <Row>
          <Col>
          <FormGroup row>
                    <Col md="4">
                      <Label htmlFor="text-input">Employee Number</Label>
                    </Col>
                    <Col xs="12" md="8">
                      <Input type="text" id="text-input" name="text-input" placeholder="Text" />
                    </Col>
          </FormGroup>
          <FormGroup row>
                    <Col md="4">
                      <Label htmlFor="text-input">Dept</Label>
                    </Col>
                    <Col xs="12" md="8">
                      <Input type="text" id="text-input" name="text-input" placeholder="Text" />
                    </Col>
          </FormGroup>
          <FormGroup row>
                    <Col md="4">
                      <Label htmlFor="text-input">Chop Type</Label>
                    </Col>
                    <Col xs="12" md="8">
                      <Input type="text" id="text-input" name="text-input" placeholder="Text" />
                    </Col>
          </FormGroup>
          <FormGroup row>
                    <Col md="4">
                      <Label htmlFor="text-input">Document Name</Label>
                    </Col>
                    <Col xs="12" md="8">
                      <Input type="text" id="text-input" name="text-input" placeholder="Text" />
                    </Col>
          </FormGroup>
          <FormGroup row>
                    <Col md="4">
                      <Label htmlFor="text-input">Use in Office or not</Label>
                    </Col>
                    <Col xs="12" md="8">
                      <Input type="text" id="text-input" name="text-input" placeholder="Text" />
                    </Col>
          </FormGroup>
          <FormGroup row>
                    <Col md="4">
                      <Label htmlFor="text-input">Pick Up By</Label>
                    </Col>
                    <Col xs="12" md="8">
                      <Input type="text" id="text-input" name="text-input" placeholder="Text" />
                    </Col>
          </FormGroup>
          <FormGroup row>
                    <Col md="4">
                      <Label htmlFor="text-input">Department Heads</Label>
                    </Col>
                    <Col xs="12" md="8">
                      <Input type="text" id="text-input" name="text-input" placeholder="Text" />
                    </Col>
          </FormGroup>
          </Col>
          <Col>
          <FormGroup row>
                    <Col md="4">
                      <Label htmlFor="text-input">Tel</Label>
                    </Col>
                    <Col xs="12" md="8">
                      <Input type="text" id="text-input" name="text-input" placeholder="Text" />
                    </Col>
          </FormGroup>
          <FormGroup row>
                    <Col md="4">
                      <Label htmlFor="text-input">Application Type</Label>
                    </Col>
                    <Col xs="12" md="8">
                      <Input type="text" id="text-input" name="text-input" placeholder="Text" />
                    </Col>
          </FormGroup>
          <FormGroup row>
                    <Col md="4">
                      <Label htmlFor="text-input">Purpose of Use</Label>
                    </Col>
                    <Col xs="12" md="8">
                      <Input type="text" id="text-input" name="text-input" placeholder="Text" />
                    </Col>
          </FormGroup>
          <FormGroup row>
                    <Col md="4">
                      <Label htmlFor="text-input">Number of Pages to Be Chopped </Label>
                    </Col>
                    <Col xs="12" md="8">
                      <Input type="text" id="text-input" name="text-input" placeholder="Text" />
                    </Col>
          </FormGroup>
          <FormGroup row>
                    <Col md="4">
                      <Label htmlFor="text-input">Address to</Label>
                    </Col>
                    <Col xs="12" md="8">
                      <Input type="text" id="text-input" name="text-input" placeholder="Text" />
                    </Col>
          </FormGroup>
          <FormGroup row>
                    <Col md="4">
                      <Label htmlFor="text-input">Remark (e.g. tel.)</Label>
                    </Col>
                    <Col xs="12" md="8">
                      <Input type="text" id="text-input" name="text-input" placeholder="Text" />
                    </Col>
          </FormGroup>
          <FormGroup row>
                    <Col md="4">
                      <Label htmlFor="text-input">confirm</Label>
                    </Col>
                    <Col xs="12" md="8">
                      <Input type="text" id="text-input" name="text-input" placeholder="Text" />
                    </Col>
          </FormGroup>
          </Col>
         </Row>
         <Row>
         <Col> <h4>Attachments</h4></Col>
         </Row>
         <Row>
         <Col><i className="cui-paperclip" /> Chop Use Workflow BRD.Docx</Col>    
         </Row>
         <Row><Col>
         &nbsp;
         </Col></Row>
         <Row>
         <Col> <h4>Approval Histories</h4></Col>
         </Row>
         <Row className="bottom-border">&nbsp;</Row>
         <Row>
         <Col md="1"> 
         <img src={'../../assets/img/avatars/5.jpg'} className="img-avatar" alt="admin@bootstrapmaster.com" />
         </Col>
         <Col md="8">
           <h5>lastname, firstname (000)<span> <Badge color="success">Status</Badge></span></h5>
            <small>dd/mm/yyyy 00:00 AM</small>
         </Col>
         </Row>
        </CardBody>
        </Card>
      </div>
    );
  }
}

export default Myapps;