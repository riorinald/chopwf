import React from 'react';

// const Dashboard = React.lazy(() => import('./views/Dashboard'));
const Create = React.lazy(() => import('./views/Create'));
const Myapps = React.lazy(() => import('./views/Myapps'));
const ChopApps = React.lazy(() => import('./views/ChopApplication'))
const MyPendingTasks = React.lazy(() => import('./views/MyPendingTasks'))
const Instructions = React.lazy(() => import('./views/UserInstruction'));
const Help = React.lazy(() => import('./views/Help'));
const Login = React.lazy(() => import('./views/Login'));
// const Detail = React.lazy(() => import('./views/MyPendingTasks/Details/Detail'));
const Redirect = React.lazy(() => import('./views/Create/Redirecting'))
const EditRequest = React.lazy(() => import('./views/EditRequest/EditRequest'));
// const ApplictionDetail = React.lazy(() =>import('./views/Myapps/ApplicationDetail'));
const Administration = React.lazy(() => import('./views/Administration'));
const page404 = React.lazy(() => import('./views/404'));
const TaskDetails = React.lazy(() => import('./views/TaskDetails/TaskDetails'));

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
  // { path: '/DMT/create', name: 'Create', component: Create},

  { path: '/create', exact: true, name: 'Create', component: Redirect },
  { path: '/create/:company', exact: true, name: 'Create', component: Create },
  { path: '/myapps', exact: true, name: 'Myapps', component: Myapps },
  { path: '/:page/details/', exact: true, name: 'Details', component: TaskDetails },

  { path: '/mypendingtask', exact: true, name: 'MyPendingTasks', component: MyPendingTasks },
  { path: '/chopapps', name: 'ChopApplication', component: ChopApps },
  // { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/instruction', exact: true, name: 'Insctructions', component: Instructions },
  { path: '/help', exact: true, name: 'Help', component: Help },
  { path: '/login', name: 'Login', component: Login },
  { path: '/:page/editrequest', exact: true, name: 'EditRequest', component: EditRequest },
  { path: '/chopadmin', exact: true, nme: 'Administration', component: Administration },
  { path: '/404', name: 'page404', component: page404 },

  { path: '/license/create', exact: true, name: 'Create Request', component: LicenseCreate },
  { path: '/license/myapplication', exact: true, name: 'My Application', component: LicenseMyApplications },
  // { path: '/license/myapplication/details', exact:true, name: 'My Application', component: LicenseApplicationDetail },
  { path: '/license/mypendingtask', exact: true, name: 'My Pending Task', component: LicenseMyPendingTasks },
  { path: '/license/admin-apps', exact: true, name: 'License Applications', component: LicenseApplication },
  { path: '/license/admin', exact: true, name: 'License Admin', component: LicenseAdmin },
  { path: '/license/:page/details', exact: true, name: 'Task Details', component: LicenseTaskDetails },
  { path: '/license/:page/edit', exact: true, name: 'Edit Details', component: LicenseEditRequest },
  { path: '/license/instruction', exact: true, name: 'License Instruction', component: LicenseInstruction },
  { path: '/license/help', exact: true, name: 'License Help', component: LicenseHelp },





];

export default routes;
