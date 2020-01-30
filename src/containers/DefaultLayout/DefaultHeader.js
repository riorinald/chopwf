import React, { Component } from 'react';
import { UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle, Nav, Dropdown } from 'reactstrap';
import PropTypes from 'prop-types';
import { AppSidebarMinimizer, AppSidebarToggler } from '@coreui/react';
import { fakeAuth } from '../../App';
import { withRouter } from 'react-router-dom';
import Axios from 'axios';
import config from '../../config';

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
      userDetails: ''
    };
  }

  logout() {
    console.log("logout")
    fakeAuth.signOut()
  }

  componentDidMount() {
    this.getUserDetails()
  }

  async getUserDetails() {
    this.setState({ loading: true })
    await Axios.get(`${config.url}/users/${localStorage.getItem('userId')}`,{ headers: { Pragma: 'no-cache' } }).then(res => {
      this.setState({ userDetails: res.data, loading: false })
    })
  }

  render() {


    const { state } = this.props;
    const { userDetails } = this.state;

    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="sm" mobile />
        <AppSidebarMinimizer className="customMT d-md-down-none navbar-toggler"><span className="navbar-toggler-icon"></span></AppSidebarMinimizer>
        <Nav className="h5 d-sm-down-none"><b className="ml-2">{state.application} USE WORKFLOW FOR {state.legalEntity}</b></Nav>
        <Nav className="ml-auto" navbar>
          <Dropdown isOpen={state.viewChop} toggle={this.props.toggle('viewChop')} nav direction="down" >
            <DropdownToggle color="ghost" className="btn-pill" caret>
              Switch Chop Entity
                </DropdownToggle>
            <DropdownMenu className="mt-2">
              <DropdownItem onClick={this.props.changeEntity('CHOP')} value="MBAFC"
                active={state.legalEntity === "MBAFC" && state.application === "CHOP" ? true : false}>
                MBAFC
                    </DropdownItem>
              <DropdownItem onClick={this.props.changeEntity('CHOP')} value="MBLC"
                active={state.legalEntity === "MBLC" && state.application === "CHOP" ? true : false}>
                MBLC
                    </DropdownItem>
              <DropdownItem onClick={this.props.changeEntity('CHOP')} value="MBIA"
                active={state.legalEntity === "MBIA" && state.application === "CHOP" ? true : false}>
                MBIA
                    </DropdownItem>
              <DropdownItem onClick={this.props.changeEntity('CHOP')} value="DMT"
                active={state.legalEntity === "DMT" && state.application === "CHOP" ? true : false}>
                DMT
                    </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Dropdown className="mr-2" isOpen={state.viewLicense} toggle={this.props.toggle('viewLicense')} nav direction="down" >
            <DropdownToggle color="ghost" className="btn-pill" caret>
              Switch License Entity
                </DropdownToggle>
            <DropdownMenu className="mt-2">
              <DropdownItem onClick={this.props.changeEntity('LICENSE')} value="MBAFC"
                active={state.legalEntity === "MBAFC" && state.application === "LICENSE" ? true : false}>
                MBAFC
                    </DropdownItem>
              <DropdownItem onClick={this.props.changeEntity('LICENSE')} value="MBLC"
                active={state.legalEntity === "MBLC" && state.application === "LICENSE" ? true : false}>
                MBLC
                    </DropdownItem>
              <DropdownItem onClick={this.props.changeEntity('LICENSE')} value="MBIA"
                active={state.legalEntity === "MBIA" && state.application === "LICENSE" ? true : false}>
                MBIA
                    </DropdownItem>
              <DropdownItem onClick={this.props.changeEntity('LICENSE')} value="DMT"
                active={state.legalEntity === "DMT" && state.application === "LICENSE" ? true : false}>
                DMT
                    </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <UncontrolledDropdown nav direction="down" className="mr-4" >
            <DropdownToggle nav className="mr-2">
              {userDetails.displayName}
            </DropdownToggle>
            <DropdownMenu right className="mt-3">
              <AuthButton />
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default withRouter(DefaultHeader);
