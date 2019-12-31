import React, { Component, Suspense } from 'react';
import { Button, Col, Spinner, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row,
Card, CardHeader, CardBody } from 'reactstrap';
import {
    AppHeader,
    AppFooter,
    AppSidebarNav2 as AppSidebarNav,
    // AppBreadcrumb2 as AppBreadcrumb,
  } from '@coreui/react';
import LegalEntity from '../../context';
const DefaultHeader = React.lazy(() => import('../../containers/DefaultLayout/DefaultHeader'));
const DefaultFooter = React.lazy(() => import('../../containers/DefaultLayout/DefaultFooter'));


class Portal extends Component {

  loading = () => <div className="animated fadeIn pt-1 text-center"><Spinner /></div>

  redirectTo = (value) => {
    if (value === 'CHOP'){
      localStorage.setItem('application', 'CHOP')
      this.props.history.push('/create')
    }
    if (value === 'LICENSE'){
      localStorage.setItem('application', 'LICENSE')
      this.props.history.push('/license/create') 
    }    
  }

  render() {
    return (
        <div>
        <LegalEntity.Consumer>
          {ContextValue => (
            <AppHeader fixed>
              <Suspense fallback={this.loading()}>
                
              </Suspense>
            </AppHeader>
          )}</LegalEntity.Consumer>
        <div className="app flex-row align-items-center">
          <Container>
            <Row className="justify-content-center">
              <Col sm={6} md lg={3} className="text-center h-100">
                <Card id="CWF" tag="a" style={{ cursor: "pointer" }} onClick={() => {this.redirectTo('CHOP')}} className="shadow-lg p-3 mb-5 bg-white rounded">
                  <CardBody>
                    <h6>CHOP WORKFLOW APPLICATION</h6>
                      <Col className="text-center p-4">
                      <i className="fa fa-sitemap fa-5x"></i>
                      </Col>
                  </CardBody>
                </Card>
              </Col>
              <Col sm={6} md lg={3} className="text-center h-100">
                <Card id="LWF" tag="a" style={{ cursor: "pointer" }} onClick={() => {this.redirectTo('LICENSE')}} className="shadow-lg p-3 mb-5 bg-white rounded">
                  <CardBody>
                    <h6>LICENSE WORKFLOW APPLICATION</h6>
                      <Col className="text-center p-4">
                      <i className="fa fa-files-o fa-5x"></i>
                      </Col>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
            <DefaultFooter />
        </div>
    );
  }
}

export default Portal;
