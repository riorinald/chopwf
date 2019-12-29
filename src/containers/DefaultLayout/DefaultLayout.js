import React, { Component, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import * as router from 'react-router-dom';
import { Container, Spinner } from 'reactstrap';

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
import ChopKeeperNav from '../../_nav';
import RequestorNav from '../../_Rnav';
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
    e.preventDefault()
    this.props.history.push('/login')
  }

  constructor(props) {
    super(props);
    this.state = {
      legalEntity: localStorage.getItem('legalEntity'),
      roleId: localStorage.getItem("roleId"),
      application: localStorage.getItem('application'),
    }
    this.handleLegalEntity = this.handleLegalEntity.bind(this)
  }

  handleLegalEntity(_State) {
    this.setState({
      legalEntity: _State.legalEntity
    })
  }

  changeWorkflow = (value) => {
    if (value === "LICENSE") {
      this.props.history.push(`/${value.toLowerCase()}/create`)
    }
    else{
      this.props.history.push('/create')
    }
    this.setState({
      application: value,
    },
      localStorage.setItem("application", value));
  }
  
  changeEntity = workflow => event => {
    this.props.history.push(`/${workflow.toLowerCase()}/create`)
  
    this.setState({
      legalEntity: event.target.value,
      application: workflow,
      },
        localStorage.setItem("application", workflow),
        localStorage.setItem("legalEntity", event.target.value)
        )
  }

  toggle = (name) => () => {
    this.setState({
      [name]: !this.state[name],
    });
  }

  handleSideBarNav(application) {
    switch (application) {
      case 'CHOP':
        if (this.state.roleId === 'REQUESTOR')
          return RequestorNav;
        if (this.state.roleId === 'CHOPKEEPER' || 'CHOPOWNER')
          return ChopKeeperNav;
        else return console.log('error! Roles not match, no sideBarNav');

      case 'LICENSE':
        return LicenseNav;

      default:
        return console.log('error! workflow application not match, no sideBarNav');
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
                    {/* <Redirect from="/" to={{ pathname: "/404" }} /> */}
                  </Switch>
                </Suspense>
              </Container>
            </main>
            {/* <AppAside fixed>
            <Suspense fallback={this.loading()}>
              <DefaultAside />
            </Suspense>
          </AppAside> */}
          </div>
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
