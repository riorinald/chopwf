const admin = {
  items: [
    {
      name: 'Create',
      url: '/license/create',
      icon: 'icon-note',
      // badge: {
      //   variant: 'info',
      //   text: 'NEW',
      // },
    },
    {
      name: 'My Applications',
      url: '/license/myapplication',
      icon: 'icon-layers'
    },
    {
      name: 'My Pending Tasks',
      url: '/license/mypendingtask',
      icon: 'fa fa-clock-o'
    },
    {
      name: 'License Applications',
      url: '/license/admin-apps',
      icon: 'fa fa-cubes'
    },
    {
      name: 'License Admin',
      url: '/license/admin',
      icon: 'fa fa-cog'
    },

    {
      name: 'User Guide',
      url: '/license/instruction',
      icon: 'fa fa-info-circle',
      class: 'mt-auto IE-margin-top',
      // variant: 'success',
      // attributes: { target: '_blank', rel: "noopener" },
    },
    {
      name: 'Help',
      url: '/license/help',
      icon: 'fa fa-question-circle',
    },
  ],
};

const requestor = {
  items: [
    {
      name: 'Create',
      url: '/license/create',
      icon: 'icon-note',
      // badge: {
      //   variant: 'info',
      //   text: 'NEW',
      // },
    },
    {
      name: 'My Applications',
      url: '/license/myapplication',
      icon: 'icon-layers'
    },
    {
      name: 'My Pending Tasks',
      url: '/license/mypendingtask',
      icon: 'fa fa-clock-o'
    },

    {
      name: 'User Guide',
      url: '/license/instruction',
      icon: 'fa fa-info-circle',
      class: 'mt-auto IE-margin-top',
      // variant: 'success',
      // attributes: { target: '_blank', rel: "noopener" },
    },
    {
      name: 'Help',
      url: '/license/help',
      icon: 'fa fa-question-circle',
    },
  ],
};

const LicenseNav = { admin, requestor }

export default LicenseNav;
