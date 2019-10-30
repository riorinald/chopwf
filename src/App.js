import React, { Component } from 'react';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import {Spinner} from 'reactstrap';

// import { renderRoutes } from 'react-router-config';
import './App.scss';

export const fakeAuth = {
  isAuthenticated: localStorage.getItem('authenticate')  === 'true' ? true : false,
  authenticate(cb) {
    
    this.isAuthenticated = true
    setTimeout(cb, 100)
    
  },
  signOut(cb) {
    this.isAuthenticated = false
    localStorage.clear();
    setTimeout(cb, 100)
  }
}

const Login = React.lazy(() => import('./views/Login/Login'));

const loading = () => <div className="animated fadeIn pt-3 text-center"><Spinner /> <br />Loading ...</div>;

// Containers
const DefaultLayout = React.lazy(() => import('./containers/DefaultLayout'));

// Pages
const Page404 = React.lazy(() => import('./views/Pages/Page404'));

const PrivateRoute = ({component: Component, ...rest}) => (
  <Route {...rest} render={props => (
    fakeAuth.isAuthenticated === true 
    ? <Component {...props}/>
    : <Redirect to='/login'/>
  )}/>
)


class App extends Component {

  render() {
    return (
      <HashRouter>
        <React.Suspense fallback={loading()}>
          <Switch>
            <Route exact path="/404" name="Page 404" render={props => <Page404 {...props} />} />
            <Route path='/login' component={Login} />  
            {/* {fakeAuth.isAuthenticated
              ? <Route path="/" name="Home" render={props => <DefaultLayout {...props} />} />
              : <Redirect to='/login' />
            } */}
            <PrivateRoute path='/' component={DefaultLayout}/>
          </Switch>
        </React.Suspense>
      </HashRouter>
    );
  }
}
export default App;
