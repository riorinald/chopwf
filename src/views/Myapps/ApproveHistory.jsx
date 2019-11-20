import React from 'react';
import {
    Col,
    Row,
    Badge,
} from 'reactstrap';


const AapprovalHistory = props => <div>
    <Row className="bottom-border"></Row>
    <Row>
      <Col md="1">
        <img src={props.appHistory.avatar} className="img-avatar" alt="admin@bootstrapmaster.com" />
      </Col>
      <Col md="8">
        <h5>{props.appHistory.name} (000)<span> <Badge color="success">{props.appHistory.status}</Badge></span></h5>
        <small>{props.appHistory.notes}</small>
      </Col>
      </Row>
    </div>

export default AapprovalHistory;