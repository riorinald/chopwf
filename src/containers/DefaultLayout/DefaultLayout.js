import React, { Component, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import * as router from 'react-router-dom';
import { Container, Spinner } from 'reactstrap';
import Authorize from '../../functions/Authorize' 

import {
  AppAside,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppSidebarNav2 as AppSidebarNav,
  // AppBreadcrumb2 as AppBreadcrumb,
} from '@coreui/react';
// sidebar nav config
import ChopNav from '../../_ChopNav';
import LicenseNav from '../../_LicenseNav';
// routes config
import routes from '../../routes';
import LegalEntity from '../../context';
import { label } from '../../context';

const DefaultAside = React.lazy(() => import('./DefaultAside'));
const DefaultFooter = React.lazy(() => import('./DefaultFooter'));
const DefaultHeader = React.lazy(() => import('./DefaultHeader'));

class DefaultLayout extends Component {

  loading = () => <div className="animated fadeIn pt-1 text-center"><Spinner /></div>

  signOut(e) {
    if (e) {
      e.preventDefault()
    }
    this.props.history.push('/logout')
  }

  constructor(props) {
    super(props);
    this.state = {
      legalEntity: localStorage.getItem('legalEntity'),
      application: localStorage.getItem('application'),
      roleId: Authorize.getCookies().roleId,
      cAdmin: Authorize.getCookies().isChopKeeper,
      lAdmin: Authorize.getCookies().isLicenseAdmin,
      licenseAdminCompany: Authorize.getCookies().licenseAdminCompanyIds,
      chopKeeperCompany: Authorize.getCookies().licenseAdminCompanyIds,
      showChopAdmin: false,
      showLicenseAdmin: false,
      newRoutes: [],
      isLoading: false
    }
    this.handleLegalEntity = this.handleLegalEntity.bind(this)
  }

  handleLegalEntity(_State) {
    this.setState({
      legalEntity: _State.legalEntity
    })
  }
  
  componentDidUpdate(prevProps, prevState){
    if (prevState.isLoading !== this.state.isLoading) {
      this.setState({
        isLoading: false
      })
    }
  }

  changeWorkflow = (value) => {
    if (value === "LICENSE") {
      // LicenseCreate.fakeUpdate.didUpdate()
      this.props.history.push(`/${value.toLowerCase()}/create`)
      // window.location.reload()
    }
    else {
      this.props.history.push('/create')
    }
    this.setState({
      application: value,
    },
      localStorage.setItem("application", value));
    // window.location.reload()
  }

  changeEntity = workflow => event => {
    if (workflow === localStorage.getItem('application')){
      this.setState({
        legalEntity: event.target.value,
        application: workflow,
        isLoading: true
      },    
      localStorage.setItem("application", workflow),
      localStorage.setItem("legalEntity", event.target.value)
      )
      if (this.props.location.pathname.match('create')===1) {
        this.props.history.push(`/create/${event.target.value}`)
      }
    }
    else{
      if (workflow === "LICENSE") {
        this.props.history.push(`/${workflow.toLowerCase()}/create`)
      }
      else {
        this.props.history.push(`/create/${event.target.value}`)
      }
      this.setState({
        legalEntity: event.target.value,
        application: workflow,
        isLoading: true
      },    
      localStorage.setItem("application", workflow),
      localStorage.setItem("legalEntity", event.target.value)
      )
    }
  }

  toggle = (name) => () => {
    this.setState({
      [name]: !this.state[name],
    });
  }

  getRoute(application) {
    let { licenseAdminCompany, legalEntity, chopKeeperCompany } = this.state
    switch (application) {
      case 'CHOP':
        if (this.state.cAdmin === 'N') {
          localStorage.setItem('viewAdminChop', false)
          return routes.routesRequestor;
        }
        if (this.state.cAdmin === 'Y') {
          let show = false
          for (let i = 0; i < chopKeeperCompany.length; i++) {
            if (chopKeeperCompany[i] === legalEntity) {
              localStorage.setItem('viewAdminChop', true)
              show = true
              break;
            }
            else {
              localStorage.setItem('viewAdminChop', false)
              show = false
            }
          }
          if (show)
            return routes.routesChopAdmin;
          else
            return routes.routesRequestor;
        }
        else return this.signOut();
        console.log('error! Roles not match, no sideBarNav');

      case 'LICENSE':
        if (this.state.lAdmin === 'N') {
          localStorage.setItem('viewAdminLicense', false)
          return routes.routesRequestor;
        }
        if (this.state.lAdmin === 'Y') {
          let show = false
          for (let i = 0; i < licenseAdminCompany.length; i++) {
            if (licenseAdminCompany[i] === legalEntity) {
              localStorage.setItem('viewAdminLicense', true)
              show = true
              break;
            }
            else {
              localStorage.setItem('viewAdminLicense', false)
              show = false
            }
          }
          if (show)
            return routes.routesLicenseAdmin;
          else
            return routes.routesRequestor;
        }
        else return this.signOut();
        console.log('error! Roles not match, no sideBarNav');

      default:
        return this.signOut();
        console.log('error! workflow application not match, no sideBarNav');
    }
  }


  handleSideBarNav(application) {
    let { licenseAdminCompany, legalEntity, chopKeeperCompany } = this.state
    switch (application) {
      case 'CHOP':
        if (this.state.cAdmin === 'N') {
          localStorage.setItem('viewAdminChop', false)
          return ChopNav.requestor;
        }
        if (this.state.cAdmin === 'Y') {
          let show = false
          for (let i = 0; i < chopKeeperCompany.length; i++) {
            if (chopKeeperCompany[i] === legalEntity) {
              localStorage.setItem('viewAdminChop', true)
              show = true
              break;
            }
            else {
              localStorage.setItem('viewAdminChop', false)
              show = false
            }
          }
          if (show)
            return ChopNav.admin;
          else
            return ChopNav.requestor;
        }
        else return this.signOut();
        console.log('error! Roles not match, no sideBarNav');

      case 'LICENSE':
        if (this.state.lAdmin === 'N') {
          localStorage.setItem('viewAdminLicense', false)
          return LicenseNav.requestor;
        }
        if (this.state.lAdmin === 'Y') {
          let show = false
          for (let i = 0; i < licenseAdminCompany.length; i++) {
            if (licenseAdminCompany[i] === legalEntity) {
              localStorage.setItem('viewAdminLicense', true)
              show = true
              break;
            }
            else {
              localStorage.setItem('viewAdminLicense', false)
              show = false
            }
          }
          if (show)
            return LicenseNav.admin;
          else
            return LicenseNav.requestor;
        }
        else return this.signOut();
        console.log('error! Roles not match, no sideBarNav');

      default:
        return this.signOut();
        console.log('error! workflow application not match, no sideBarNav');
    }
  }


  render() {
    return (
      <div className="app">
        <LegalEntity.Provider value={{ legalEntity: label[this.state.legalEntity] }}>
          <AppHeader fixed>
            <Suspense fallback={this.loading()}>
              <DefaultHeader state={this.state} toggle={this.toggle} changeEntity={this.changeEntity} changeWorkflow={this.changeWorkflow} onLogout={e => this.signOut(e)} />
            </Suspense>
          </AppHeader>
          {this.state.isLoading ?
          <Spinner />
          :
          <div className="app-body">
            <AppSidebar fixed display="lg">
              <AppSidebarHeader />
              <AppSidebarForm />
              <Suspense>
                <AppSidebarNav navConfig={this.handleSideBarNav(localStorage.getItem('application'))} {...this.props} router={router} />
              </Suspense>
              <AppSidebarFooter />
              <AppSidebarMinimizer />
            </AppSidebar>
            <main className="main">
              {/* <AppBreadcrumb appRoutes={routes} router={router}/> */}
              <div className="mt-3"></div>
              <Container fluid >
                <Suspense fallback={this.loading()}>
                  <Switch>
                    {routes.map((route, idx) => {
                      return route.component ? (
                        <Route
                          key={idx}
                          path={route.path}
                          exact={route.exact}
                          name={route.name}
                          render={props => (
                            <route.component
                              legalName={this.state.legalEntity}
                              roleId={this.state.roleId}
                              {...props} routes={route.routes} />
                          )} />
                      ) : (null);
                    })}
                    <Redirect from="/" to={{ pathname: "/404" }} />
                  </Switch>
                </Suspense>
              </Container>
            </main>
          </div>
          }
          <AppFooter>
            <Suspense fallback={this.loading()}>
              <DefaultFooter />
            </Suspense>
          </AppFooter>
        </LegalEntity.Provider>
      </div>
    );
  }
}

export default DefaultLayout;
