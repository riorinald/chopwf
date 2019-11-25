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
const Redirect = React.lazy(()=> import('./views/Create/Redirecting'))
const EditRequest = React.lazy(() => import('./views/EditRequest/EditRequest'));
const ApplictionDetail = React.lazy(() =>import('./views/Myapps/ApplicationDetail'));
const page404 = React.lazy(()=>import('./views/404'));


// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home' },
  // { path: '/MBAFC', name: 'MBAFC',},
  // { path: '/MBAFC/myapps', name: 'Myapps', component: Myapps },
  // { path: '/MBAFC/mypendingtask', exact: true, name: 'MyPendingTasks', component: MyPendingTasks},
  // { path: '/MBAFC/instruction', name: 'Insctructions', component: Instructions },
  // { path: '/MBAFC/help', name: 'Help', component: Help },

  { path: '/create', name: 'Create', component: Redirect},
  { path: '/MBAFC/create', name: 'Create', component: Create},
  { path: '/MBLC/create', name: 'Create', component: Create},
  { path: '/MBIA/create', name: 'Create', component: Create},
  { path: '/CAR2GO/create', name: 'Create', component: Create},

  { path: '/myapps',exact: true, name: 'Myapps', component: Myapps },
  // { path: '/myapps/:id',exact: true, name: 'Myapps', component: ApplictionDetail },

  { path: '/mypendingtask', exact: true, name: 'MyPendingTasks', component: MyPendingTasks},
  { path: '/mypendingtask/:id', exact: true, name: 'DetailTaskSTU', component: Detail},
  { path: '/chopapps', name: 'ChopApplication', component: ChopApps},
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/instruction',exact: true, name: 'Insctructions', component: Instructions },
  { path: '/help',exact: true, name: 'Help', component: Help },
  { path: '/login', name: 'Login', component: Login },
  { path: '/editrequest',exact: true, name: 'EditRequest', component: EditRequest },
  { path: '/404', name: 'page404', component: page404},

];

export default routes;
