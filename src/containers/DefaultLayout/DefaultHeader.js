import React, { Component } from 'react';
import { Col, UncontrolledDropdown, Button, Modal, ModalHeader, ModalBody, ModalFooter, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, Dropdown } from 'reactstrap';
import PropTypes from 'prop-types';
import { AppSidebarMinimizer, AppSidebarToggler } from '@coreui/react';
import { fakeAuth } from '../../App';
import { withRouter } from 'react-router-dom';
import LegalEntity from '../../context';


const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

const AuthButton = withRouter(({ history }) => (

  fakeAuth.isAuthenticated
    // ? <Button onClick={() => { fakeAuth.signout(() => history.push('/')) }}>Sign out</Button>
    ? <DropdownItem onClick={() => { fakeAuth.signOut(() => history.push('/')) }} ><i className="fa fa-lock" ></i> Logout</DropdownItem>
    : ""
)
)

class DefaultHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      viewChop: false,
      viewLicense: false,
      legalEntity: localStorage.getItem('legalEntity'),
      application: localStorage.getItem('application'),
      disabled: true
    };
  }
  logout() {
    console.log("logout")
    fakeAuth.signOut()
    // return <Redirect to='/login'/>
  }

  // logout = withRouter(({history}))

  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;
    const username = localStorage.getItem('userId');
    return (
      <LegalEntity.Consumer>
        {ContextValue => (
          <React.Fragment>
            <AppSidebarToggler className="d-lg-none" display="sm" mobile />
            {/* <AppNavbarBrand
          full={{ src: logo, width: 89, height: 25, alt: 'CoreUI Logo' }}
          minimized={{ src: sygnet, width: 30, height: 30, alt: 'CoreUI Logo' }}>
         {//<AppSidebarToggler className="d-md-down-none" display="lg" />
          </AppNavbarBrand> */
            }
            <AppSidebarMinimizer className="customMT d-md-down-none navbar-toggler"><span className="navbar-toggler-icon"></span></AppSidebarMinimizer>
            <h2 className="h5 d-sm-down-none"><b>{this.state.application} Use WORKFLOW for {this.state.legalEntity}</b></h2>
            <Nav className="ml-auto" navbar>
              {/* <NavItem >
                <Button color="ghost" onClick={this.toggle} to="#"><i className="fa fa-exchange" /> Entity</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                  <ModalHeader className="center" toggle={this.toggle}> Switch Entity </ModalHeader>
                  <ModalBody>
                    <Col>
                    <Button onClick={this.changeEntity} disabled={this.state.legalEntity === "MBAFC" ? true : false} color="secondary" value="MBAFC" size="lg" block> MBAFC </Button>
                    <Button onClick={this.changeEntity} disabled={this.state.legalEntity === "MBLC" ? true : false} color="secondary" value="MBLC" size="lg" block> MBLC </Button>
                    <Button onClick={this.changeEntity} disabled={this.state.legalEntity === "MBIA" ? true : false} color="secondary" value="MBIA" size="lg" block > MBIA </Button>
                    <Button onClick={this.changeEntity} disabled={this.state.legalEntity === "CAR2GO" ? true : false} color="secondary" value="CAR2GO" size="lg" block > CAR2GO </Button>
                    </Col>
                  </ModalBody>
                </Modal>
              </NavItem> */}
              <Dropdown isOpen={this.props.state.viewChop} toggle={this.props.toggle('viewChop')} nav direction="down" >
                <DropdownToggle color="ghost" className="btn-pill" caret>
                    CHOP WF
                </DropdownToggle>
                  <DropdownMenu className="mt-2">
                    <DropdownItem onClick={this.props.changeEntity('CHOP')} value="MBAFC"
                    active={this.props.state.legalEntity === "MBAFC" && this.props.state.application === "CHOP" ? true : false}> 
                       MBAFC 
                    </DropdownItem>
                    <DropdownItem onClick={this.props.changeEntity('CHOP')} value="MBLC"
                    active={this.props.state.legalEntity === "MBLC" && this.props.state.application === "CHOP" ? true : false}> 
                      MBLC
                    </DropdownItem>
                    <DropdownItem onClick={this.props.changeEntity('CHOP')} value="MBIA"
                      active={this.props.state.legalEntity === "MBIA" && this.props.state.application === "CHOP" ? true : false}> 
                       MBIA
                    </DropdownItem>
                    <DropdownItem onClick={this.props.changeEntity('CHOP')} value="CAR2GO"
                      active={this.props.state.legalEntity === "CAR2GO" && this.props.state.application === "CHOP" ? true : false}> 
                       CAR2GO
                    </DropdownItem>
                  </DropdownMenu>
              </Dropdown>
              <Dropdown className="mr-2" isOpen={this.props.state.viewLicense} toggle={this.props.toggle('viewLicense')} nav direction="down" >
                <DropdownToggle color="ghost" className="btn-pill" caret>
                    LICENSE WF
                </DropdownToggle>
                  <DropdownMenu className="mt-2">
                    <DropdownItem onClick={this.props.changeEntity('LICENSE')} value="MBAFC"
                      active={this.props.state.legalEntity === "MBAFC" && this.props.state.application === "LICENSE" ? true : false}>
                       MBAFC 
                    </DropdownItem>
                    <DropdownItem onClick={this.props.changeEntity('LICENSE')} value="MBLC"
                      active={this.props.state.legalEntity === "MBLC" && this.props.state.application === "LICENSE" ? true : false}>
                      MBLC
                    </DropdownItem>
                    <DropdownItem onClick={this.props.changeEntity('LICENSE')} value="MBIA"
                      active={this.props.state.legalEntity === "MBIA" && this.props.state.application === "LICENSE" ? true : false}>
                       MBIA
                    </DropdownItem>
                    <DropdownItem onClick={this.props.changeEntity('LICENSE')} value="CAR2GO"
                      active={this.props.state.legalEntity === "CAR2GO" && this.props.state.application === "LICENSE" ? true : false}>
                       CAR2GO
                    </DropdownItem>
                  </DropdownMenu>
              </Dropdown>
              <NavItem className="d-sm-down-none">
                {username}
              </NavItem>
              <UncontrolledDropdown nav direction="down" >
                <DropdownToggle nav>
                  <img src={'../../assets/img/avatars/6.jpg'} className="img-avatar" alt="admin@bootstrapmaster.com" />
                </DropdownToggle>
                <DropdownMenu right>
                  {/* <DropdownItem header tag="div" className="text-center"><strong>Account</strong></DropdownItem>
              <DropdownItem><i className="fa fa-bell-o"></i> Updates<Badge color="info">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-envelope-o"></i> Messages<Badge color="success">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-tasks"></i> Tasks<Badge color="danger">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-comments"></i> Comments<Badge color="warning">42</Badge></DropdownItem>
              <DropdownItem header tag="div" className="text-center"><strong>Settings</strong></DropdownItem> */}
                  <DropdownItem><i className="fa fa-user"></i> Profile</DropdownItem>
                  {/* <DropdownItem><i className="fa fa-wrench"></i> Settings</DropdownItem>
              <DropdownItem><i className="fa fa-usd"></i> Payments<Badge color="secondary">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-file"></i> Projects<Badge color="primary">42</Badge></DropdownItem> 
              <DropdownItem divider />
              <DropdownItem><i className="fa fa-shield"></i> Lock Account</DropdownItem>
              <DropdownItem onClick={this.logout}><i className="fa fa-lock" ></i> Logout</DropdownItem>*/}
                  <AuthButton />
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
            {/* <AppAsideToggler className="d-md-down-none" /> */}
            {/*<AppAsideToggler className="d-lg-none" mobile />*/}
          </React.Fragment>
        )}
      </LegalEntity.Consumer>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default withRouter(DefaultHeader);
