import React from 'react';

const Dashboard = React.lazy(() => import('./views/Dashboard'));
const Create = React.lazy(() => import('./views/Create'));
const Myapps = React.lazy(() => import('./views/Myapps'));
const ChopApps = React.lazy(() => import('./views/ChopApplication'))
const MyPendingTasks = React.lazy(()=> import('./views/MyPendingTasks'))
const Instructions = React.lazy(() => import('./views/UserInstruction'));
const Help = React.lazy(() => import('./views/Help'));
const Login = React.lazy(() => import('./views/Login'));
const Detail = React.lazy(() => import('./views/MyPendingTasks/Details/Detail'));


// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/create',exact: true, name: 'Create', component: Create},
  { path: '/create/:apptype',exact: true, name: 'Create', component: Create},
  { path: '/myapps', name: 'Myapps', component: Myapps },
  { path: '/mypendingtask', exact: true, name: 'MyPendingTasks', component: MyPendingTasks},
  { path: '/mypendingtask/:id', exact: true, name: 'DetailTaskSTU', component: Detail},
  { path: '/chopapps', name: 'ChopApplication', component: ChopApps},
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/instruction', name: 'Insctructions', component: Instructions },
  { path: '/help', name: 'Help', component: Help },
  { path: '/login', name: 'Login', component: Login }
];

export default routes;
