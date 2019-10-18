import React from 'react';

const Dashboard = React.lazy(() => import('./views/Dashboard'));
const Create = React.lazy(() => import('./views/Create'));
const Myapps = React.lazy(() => import('./views/Myapps'));
const Instructions = React.lazy(() => import('./views/UserInstruction'));
const Help = React.lazy(() => import('./views/Help'));
const Login = React.lazy(() => import('./views/Login'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/create', name: 'Create', component: Create },
  { path: '/myapps', name: 'Myapps', component: Myapps },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/instruction', name: 'Insctructions', component: Instructions },
  { path: '/help', name: 'Help', component: Help },
  { path: '/login', name: 'Login', component: Login }
];

export default routes;
