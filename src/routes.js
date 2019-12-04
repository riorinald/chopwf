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
const Administration = React.lazy(() => import('./views/Administration'));
const page404 = React.lazy(()=>import('./views/404'));
const LicenseCreate = React.lazy(() => import('./views/License/LicenseCreate'));
const LicenseMyApplications = React.lazy(() => import('./views/License/LicenseMyApplications'));
const LicenseMyPendingTasks = React.lazy(() => import('./views/License/LicenseMyPendingTasks'));
const LicenseApplication = React.lazy(() => import('./views/License/LicenseApplication'));
const LicenseAdmin = React.lazy(() => import('./views/License/LicenseAdmin'));
const LicenseApplicationDetail = React.lazy(() => import('./views/License/LicenseApplicationDetail'));


// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home' },
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
  { path: '/chopadmin',exact: true, nme: 'Administration', component: Administration},
  { path: '/404', name: 'page404', component: page404},

  { path: '/license/create', exact:true, name: 'Create Request', component: LicenseCreate },
  { path: '/license/myapplication', exact:true, name: 'My Application', component: LicenseMyApplications },
  // { path: '/license/myapplication/details', exact:true, name: 'My Application', component: LicenseApplicationDetail },
  { path: '/license/mypendingtask', exact:true, name: 'My Pending Task', component: LicenseMyPendingTasks },
  { path: '/license/admin-apps', exact:true, name: 'License Application' , component: LicenseApplication},
  { path: '/license/admin', exact:true, name: 'License Admin' , component: LicenseAdmin},
  { path: '/license/userguide', exact:true, name: 'User Guide' },
  { path: '/license/help', exact:true, name: 'Help' }



  

];

export default routes;
