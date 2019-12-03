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
    if (value === 'chop'){
      localStorage.setItem('application', 'chop')
      this.props.history.push('/create')
    }
    if (value === 'license'){
      localStorage.setItem('application', 'license')
      this.props.history.push('/license') 
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
              <Col sm={6} md lg={3}>
                <Card tag="a" style={{ cursor: "pointer" }} onClick={() => {this.redirectTo('chop')}} className="shadow-lg p-3 mb-5 bg-white rounded">
                  <CardBody className="text-center"><h5>CHOP WORKFLOW APPLICATION</h5>
                     <Col className="text-center p-4">
                      <i className="fa fa-sitemap fa-5x"></i>
                     </Col>
                  </CardBody>
                </Card>
              </Col>
              <Col sm={6} md lg={3}>
                <Card tag="a" style={{ cursor: "pointer" }} onClick={() => {this.redirectTo('license')}} className="shadow-lg p-3 mb-5 bg-white rounded">
                  <CardBody className="text-center"><h5>LICENSE WORKFLOW APPLICATION</h5>
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
