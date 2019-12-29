import React from 'react';

// const Detail = React.lazy(() => import('./views/MyPendingTasks/Details/Detail'));
// const ApplictionDetail = React.lazy(() =>import('./views/Myapps/ApplicationDetail'));
const Dashboard = React.lazy(() => import('./views/Dashboard'));
const page404 = React.lazy(() => import('./views/404'));
const Login = React.lazy(() => import('./views/Login'));

const Create = React.lazy(() => import('./views/Create'));
const Redirect = React.lazy(() => import('./views/Create/Redirecting'))
const Myapps = React.lazy(() => import('./views/Myapps'));
const ChopApps = React.lazy(() => import('./views/ChopApplication'))
const MyPendingTasks = React.lazy(() => import('./views/MyPendingTasks'))
const TaskDetails = React.lazy(() => import('./views/TaskDetails/TaskDetails'));
const Administration = React.lazy(() => import('./views/Administration'));
const EditRequest = React.lazy(() => import('./views/EditRequest/EditRequest'));
const Instructions = React.lazy(() => import('./views/UserInstruction'));
const Help = React.lazy(() => import('./views/Help'));

const LicenseCreate = React.lazy(() => import('./views/License/LicenseCreate'));
const LicenseMyApplications = React.lazy(() => import('./views/License/LicenseMyApplications'));
const LicenseMyPendingTasks = React.lazy(() => import('./views/License/LicenseMyPendingTasks'));
const LicenseApplication = React.lazy(() => import('./views/License/LicenseApplication'));
const LicenseAdmin = React.lazy(() => import('./views/License/LicenseAdmin'));
const LicenseTaskDetails = React.lazy(() => import('./views/License/LicenseApplicationDetail/LicenseApplicationDetail'));
const LicenseEditRequest = React.lazy(() => import('./views/License/LicenseEditRequest/LicenseEditRequest'));
const LicenseInstruction = React.lazy(() => import('./views/License/LicenseInstructions'));
const LicenseHelp = React.lazy(() => import('./views/License/LicenseHelp'));


// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  // { path: '/', exact: true, name: 'Home' },
  // { path: '/create', name: 'Create', component: Redirect},
  // { path: '/MBAFC/create', name: 'Create', component: Create},
  // { path: '/MBLC/create', name: 'Create', component: Create},
  // { path: '/MBIA/create', name: 'Create', component: Create},
  // { path: '/CAR2GO/create', name: 'Create', component: Create},

  { path: '/login', name: 'Login', component: Login },
  { path: '/404', name: 'page404', component: page404 },
  { path: '/:page/details/:appid', exact: true, name: 'Details', component: TaskDetails },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  
  { path: '/chop/mypendingtask', exact: true, name: 'MyPendingTasks', component: MyPendingTasks },
  { path: '/chop/chopapps', name: 'ChopApplication', component: ChopApps },
  { path: '/chop/create', exact: true, name: 'Create', component: Redirect },
  { path: '/chop/create/:company', exact: true, name: 'Create', component: Create },
  { path: '/chop/myapps', exact: true, name: 'Myapps', component: Myapps },
  { path: '/chop/instruction', exact: true, name: 'Insctructions', component: Instructions },
  { path: '/chop/help', exact: true, name: 'Help', component: Help },
  { path: '/chop/:page/editrequest', exact: true, name: 'EditRequest', component: EditRequest },
  { path: '/chop/chopadmin', exact: true, nme: 'Administration', component: Administration },

  { path: '/license/create', exact: true, name: 'Create Request', component: LicenseCreate },
  { path: '/license/myapplication', exact: true, name: 'My Application', component: LicenseMyApplications },
  { path: '/license/mypendingtask', exact: true, name: 'My Pending Task', component: LicenseMyPendingTasks },
  { path: '/license/admin-apps', exact: true, name: 'License Application', component: LicenseApplication },
  { path: '/license/admin', exact: true, name: 'License Admin', component: LicenseAdmin },
  { path: '/license/:page/details', exact: true, name: 'Task Details', component: LicenseTaskDetails },
  { path: '/license/:page/edit', exact: true, name: 'Edit Details', component: LicenseEditRequest },
  { path: '/license/instruction', exact: true, name: 'License Instruction', component: LicenseInstruction },
  { path: '/license/help', exact: true, name: 'License Help', component: LicenseHelp },
  
  // { path: '/license/myapplication/details', exact:true, name: 'My Application', component: LicenseApplicationDetail },




];

export default routes;
