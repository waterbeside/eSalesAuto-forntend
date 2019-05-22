
import Layout from '@/layout'
//import home from '@/components/Home'

export default [
   {
    path: '/development',
    component: Layout,
    redirect: '/development/auto_sppo',
    name: 'development',
    meta: {
      title: 'Development',
      icon: 'development'
    },
    children: [
      {
        path: 'auto_sppo',
        component: () => import('@/views/AutoSPPO'),
        name: 'autoSppo',
        meta: { title: 'Auto SPPO' , icon: 'fabric',},
        // children:[{
        //   path:'edit',
        //   name: 'editAutoSppo',
        //   component: () => import('@/views/AutoSPPO/edit'),
        //   hidden:true
        // }]

    }, 
    // {
    //   path: 'auto_sppo2',
    //   component: () => import('@/views/AutoSPPO'),
    //   name: 'AutoSppo2',
    //   meta: { title: 'Auto SPPO' }
    // }, 
    ]},
    {
      path: '/bulk',
      component: Layout,
      redirect: '/bulk/auto_go',
      name: 'bulk',
      meta: {
        title: 'Bulk',
        icon: 'bulk'
      },
      children: [
        {
          path: 'auto_go',
          component: () => import('@/views/AutoGO'),
          name: 'autoGo',
          meta: { title: 'Auto GO',icon: 'order'}
      }, 
      // {
      //   path: 'auto_sppo2',
      //   component: () => import('@/views/AutoSPPO'),
      //   name: 'AutoSppo2',
      //   meta: { title: 'Auto SPPO' }
      // }, 
      ]},


//  {
//   path: '/customer_data',
//     component: Layout,
//     meta: {
//       title: 'Customer Data',
//       icon: 'location'
//     },
//     children: [{
//         path: 'pech_pack',
//         component: one,
//         name: 'pech_pack',
//         meta: {
//           title: 'Tech Pack',
//           //icon: 'edit'
//         },
//         item: 0,
//       },{
//         path: 'dev_bom',
//         component: one,
//         name: 'dev_bom',
//         meta: {
//           title: 'Dev BOM',
//           //icon: 'edit'
//         },
//       }, {
//       path: 'two',
//       component: two,
//       name: 'two',
//       meta: {
//         title: 'Bulk Order',
//         //icon: 'edit'
//       },
//     }, {
//       path: 'bulk_bom',
//       component: five,
//       name: 'bulk_bom',
//       meta: {
//         title: 'Bulk BOM',
//         //icon: 'edit'
//       },
//     }, {
//       path: 'contract',
//       component: five,
//       name: 'contract',
//       meta: {
//         title: 'Contract',
//         //icon: 'edit'
//       },
//     }]
//   },

 
  {
  path: '/master_center',
    component: Layout,
    meta: {
      title: 'Master Center',
      icon: 'admin'
    },
    children: [
    {
      path: 'user',
      component: () => import('@/views/user/index'),
      name: 'userList',
      meta: {
        title: '用户管理',
        icon: 'user'
      },
     
    },{
      path: 'fabric',
      // component: one,
      name: 'fabric',
      meta: {
        title: 'Fabric',
        icon: 'fabric'
      },
    },{
      path: 'color',
      // component: one,
      name: 'color',
      meta: {
        title: 'Color',
        icon: 'color'
      },
    },{
      path: 'quantity',
      // component: one,
      name: 'quantity',
      meta: {
        title: 'Quantity',
        icon: 'quantity'
      },
    },{
      path: 'destination',
      // component: one,
      name: 'destination',
      meta: {
      title: 'Destination',
        //icon: 'edit'
      },
    },{
      path: 'sample_request',
      // component: one,
      name: 'sample_request',
      meta: {
      title: 'Sample Request',
        //icon: 'edit'
      },
    },{
      path: 'customer_manuel',
      // component: one,
      name: 'customer_manuel',
      meta: {
      title: 'Customer Manuel',
        //icon: 'edit'
      },
    }]
  },

]
