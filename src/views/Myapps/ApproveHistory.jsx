import React from 'react';
import {
    Col,
    Row,
    Badge,
    Spinner
} from 'reactstrap';


function convertDate(dateValue) {
  let regEx = dateValue.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})/g, '$1/$2/$3 $4:$5 ')
  return regEx
}


const AapprovalHistory = props => 
  <div>
    <Row className="bottom-border"></Row>
    <Row className="text-md-left text-center">
      <Col xs="12" sm="12" md="2" lg="1">
        <img src={props.histories.approvedByAvatarUrl} className="img-avaa img-responsive" alt="admin@bootstrapmaster.com" />
      </Col>
      <Col sm md="10" lg>
        <h5>{props.histories.approvedByName} (000)<span> <Badge pill color="success">{props.histories.approvalStatus}</Badge></span></h5>
        <Badge className="mb-1" color="light">{convertDate(props.histories.approvedDate)}</Badge>
        <Col className="p-0"> <p>{props.histories.comments}</p> </Col>
    </Col>
    </Row>
  </div>

export default AapprovalHistory;