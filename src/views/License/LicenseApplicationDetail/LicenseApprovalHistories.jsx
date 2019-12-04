import React from 'react';
import {
    Col,
    Row,
    Badge,
    Spinner
} from 'reactstrap';


const LicenseApprovalHistories = props => 
  <div>
    <Row className="bottom-border"></Row>
    <Row className="text-md-left text-center">
      <Col xs="12" sm="12" md="2" lg="1">
        <img src={props.appHistory.avatar} className="img-avaa img-responsive" alt="admin@bootstrapmaster.com" />
      </Col>
      <Col sm md="10" lg>
        <h5>{props.appHistory.name} (000)<span> <Badge color="success">{props.appHistory.status}</Badge></span></h5>
        <small>{props.appHistory.notes}</small>
    </Col>
    </Row>
  </div>

export default LicenseApprovalHistories;