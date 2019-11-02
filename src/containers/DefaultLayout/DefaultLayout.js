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
import navigation from '../../_nav';
import reqNavigation from '../../_Rnav';
// routes config
import routes from '../../routes';
import LegalEntity from '../../context';
import {label} from '../../context';

const DefaultAside = React.lazy(() => import('./DefaultAside'));
const DefaultFooter = React.lazy(() => import('./DefaultFooter'));
const DefaultHeader = React.lazy(() => import('./DefaultHeader'));

class DefaultLayout extends Component {

  loading = () => <div className="animated fadeIn pt-1 text-center"><Spinner /></div>

  signOut(e) {
    e.preventDefault()
    this.props.history.push('/login')
  }

  constructor() {
    super();
    this.state = {
      legalEntity: "MBAFC"
    }
    this.handleLegalEntity = this.handleLegalEntity.bind(this)
  }

  handleLegalEntity(_State) {
    console.log(_State.legalEntity)
    this.setState({
      legalEntity: _State.legalEntity
    })
  }



  render() {
    return (
      <div className="app">
      <LegalEntity.Provider value={{ legalEntity: label[this.state.legalEntity]}}>
        <AppHeader fixed>
          <Suspense fallback={this.loading()}>
            <DefaultHeader handleLegalEntity={this.handleLegalEntity} onLogout={e => this.signOut(e)} />
          </Suspense>
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            <Suspense>
              <AppSidebarNav navConfig={localStorage.getItem('roleId') === 'REQUESTOR' ? reqNavigation : navigation} {...this.props} router={router} />
            </Suspense>
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>
          <main className="main">
            {/* <AppBreadcrumb appRoutes={routes} router={router}/> */}
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
                          <route.component legalName={this.state.legalEntity}{...props} />
                        )} />
                    ) : (null);
                  })}
                  <Redirect from="/" to={{ pathname: "/create" }} />
                </Switch>
              </Suspense>
            </Container> 
          </main>
          <AppAside fixed>
            <Suspense fallback={this.loading()}>
              <DefaultAside />
            </Suspense>
          </AppAside>
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
