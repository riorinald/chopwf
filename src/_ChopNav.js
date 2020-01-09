const admin = {
    items: [
      {
        name: 'Create',
        url: '/create',
        icon: 'icon-note',
        // badge: {
        //   variant: 'info',
        //   text: 'NEW',
        // },
      },
      {
        name: 'My Applications',
        url: '/myapps',
        icon: 'icon-layers'
      },
      {
        name: 'My Pending Tasks',
        url: '/mypendingtask',
        icon: 'fa fa-clock-o'
      },
      {
        name: 'Chop Applications',
        url: '/chopapps',
        icon: 'fa fa-cubes'
      },
      {
        name: 'Chop Admin',
        url: '/chopadmin',
        icon: 'fa fa-cog'
      },
    
      {
        name: 'User Instruction',
        url: '/instruction',
        icon: 'fa fa-info-circle',
        class: 'mt-auto IE-margin-top',
        // variant: 'success',
        // attributes: { target: '_blank', rel: "noopener" },
      },
      {
        name: 'Help',
        url: '/help',
        icon: 'fa fa-question-circle',
      },
    ],
  };
  
  const requestor = {
    items: [
      {
        name: 'Create',
        url: '/create',
        icon: 'icon-note',
        // badge: {
        //   variant: 'info',
        //   text: 'NEW',
        // },
      },
      {
        name: 'My Applications',
        url: '/myapps',
        icon: 'icon-layers'
      },
      {
        name: 'My Pending Tasks',
        url: '/mypendingtask',
        icon: 'fa fa-clock-o'
      },
      {
        name: 'User Instruction',
        url: '/instruction',
        icon: 'fa fa-info-circle',
        class: 'mt-auto IE-margin-top',
        // variant: 'success',
        // attributes: { target: '_blank', rel: "noopener" },
      },
      {
        name: 'Help',
        url: '/help',
        icon: 'fa fa-question-circle',
      },
    ],
  };
  
  const ChopNav = {admin, requestor}
  
  export default ChopNav;
  