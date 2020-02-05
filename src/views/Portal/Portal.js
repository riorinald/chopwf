import React, { Component, Suspense } from 'react';
import {
	Col, Spinner, Container,
	Row,
	Card, CardBody,
	Navbar,
	NavItem,
	Alert
  } from 'reactstrap';
import {
  AppHeader,
  } from '@coreui/react';
import LegalEntity from '../../context';
import Axios from 'axios';
import config from '../../config';
import Authorize from '../../functions/Authorize'


const DefaultFooter = React.lazy(() => import('../../containers/DefaultLayout/DefaultFooter'));


class Portal extends Component {
  constructor(props) {
    super(props);
    this.state={
	  userDetails:{},
	  alert:false,
	  errorMessage:"",
	  timer:5
    }
  }

  componentDidMount() {
    this.getUserDetails()
  }

  componentDidUpdate(){}

  async getUserDetails() {
    this.setState({ loading: true })
    await Axios.get(`${config.url}/users/${Authorize.getCookies().userId}`,{ headers: { Pragma: 'no-cache' } })
		.then(res => {
			this.setState({ userDetails: res.data, loading: false })
			switch(res.data.companyCode){
				case '685': 
					localStorage.setItem('legalEntity','MBAFC')
					break;
				case '632': 
					localStorage.setItem('legalEntity','MBIA')
					break;
				case '669': 
					localStorage.setItem('legalEntity','MBLC')
					break;
				case '520': 
					localStorage.setItem('legalEntity','DMT')
					break;
				}
			})
		.catch(err => {
			console.log(err)
			if(err.response){
				this.setState({
					alert:true,
					errorMessage: "User not found in the system",
				})
				// setTimeout(this.props.history.push('/login'), 5000)
			}
			else{
				this.setState({
					alert:true,
					errorMessage: "Server Unreachable"
				})
			}
		})
  }

  loading = () => <div className="animated fadeIn pt-1 text-center"><Spinner /></div>

  redirectTo = (value) => {
    if (value === 'CHOP') {
      localStorage.setItem('application', 'CHOP')
      this.props.history.push('/create')
    }
    if (value === 'LICENSE') {
      localStorage.setItem('application', 'LICENSE')
      this.props.history.push('/license/create')
    }
  }


  render() {
    return (
      <div style={{ backgroundColor: "#2F353A" }} >
        <LegalEntity.Provider value={{UserInfo: this.state.userDetails}}>
            <AppHeader fixed>
              <Suspense fallback={this.loading()}>
                <span className="navbar-nav ml-auto mr-5">{this.state.userDetails.displayName}</span>
              </Suspense>
            </AppHeader>
          </LegalEntity.Provider>
		<Alert className="centerd" color="danger" isOpen={this.state.alert}>
			{this.state.errorMessage}
		</Alert>
        <div className="app flex-row align-items-center">
          <Container>
            <Row className="justify-content-center">
              <Col sm={6} md lg={3} className="text-center h-100">
                <Card id="CWF" tag="a" style={{ cursor: "pointer" }} onClick={() => { this.redirectTo('CHOP') }} className="shadow-lg p-3 mb-5 bg-white rounded">
                  <CardBody>
                    <h6>CHOP WORKFLOW APPLICATION</h6>
                    <Col className="text-center p-4">
                      <i className="fa fa-sitemap fa-5x"></i>
                    </Col>
                  </CardBody>
                </Card>
              </Col>
              <Col sm={6} md lg={3} className="text-center h-100">
                <Card id="LWF" tag="a" style={{ cursor: "pointer" }} onClick={() => { this.redirectTo('LICENSE') }} className="shadow-lg p-3 mb-5 bg-white rounded">
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
