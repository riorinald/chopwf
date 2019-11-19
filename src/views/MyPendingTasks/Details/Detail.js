import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Table } from 'reactstrap';

class Detail extends Component {
checkDetail(){
 let appType = this.props.match.params.id
  switch (appType) {
                case 'STU':
                    return <p>'this is STU'</p>;
                case 'LTU':
                    return <p>'this is LTU'</p>;
                case 'LTI':
                    return <p>'this is LTI'</p>;
                case 'CNIPS':
                    return <p>'this is CNIPS'</p>;
                default : 
                    return <p><kbd>{this.props.match.params.id}</kbd> Not Exist </p>
            }
        }
        
  render() {
    console.log(this.checkDetail());
    return (
      <div className="animated fadeIn">
            <Card>
            <CardBody>
            {this.checkDetail()}
            </CardBody>
            </Card>
      </div>
    )
  }
}

export default Detail;