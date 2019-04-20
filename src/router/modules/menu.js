
import Layout from '@/layout'
//import home from '@/components/Home'
import one from '@/views/one'
import two from '@/views/two'
import three from '@/views/three'
import four from '@/views/four'
import five from '@/views/five'
import six from '@/views/six'

export default [
   {
    path: '/development',
    component: Layout,
    redirect: '/development/auto_sppo',
    name: 'development',
    meta: {
      title: 'Development',
      icon: 'documentation'
    },
    children: [
      {
        path: 'auto_sppo',
        component: () => import('@/views/AutoSPPO'),
        name: 'AutoSppo',
        meta: { title: 'Auto SPPO' }
    }, 
    {
      path: 'auto_sppo',
      component: () => import('@/views/AutoSPPO'),
      name: 'AutoSppo',
      meta: { title: 'Auto SPPO' }
    }, 
    ]},
  {
    path: '/example',
    component: Layout,
    redirect: '/example/list',
    name: 'Example',
    meta: {
      title: 'example',
      icon: 'example'
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/example/create'),
        name: 'CreateArticle',
        meta: { title: 'createArticle', icon: 'edit' }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/example/edit'),
        name: 'EditArticle',
        meta: { title: 'editArticle', noCache: true },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/views/example/list'),
        name: 'ArticleList',
        meta: { title: 'articleList', icon: 'list' }
      }
    ]
  },

 {
  path: '/customer_data',
    component: Layout,
    meta: {
      title: 'Customer Data',
      icon: 'location'
    },
    children: [{
        path: 'pech_pack',
        component: one,
        name: 'pech_pack',
        meta: {
          title: 'Tech Pack',
          //icon: 'edit'
        },
        item: 0,
      },{
        path: 'dev_bom',
        component: one,
        name: 'dev_bom',
        meta: {
          title: 'Dev BOM',
          //icon: 'edit'
        },
      }, {
      path: 'two',
      component: two,
      name: 'two',
      meta: {
        title: 'Bulk Order',
        //icon: 'edit'
      },
    }, {
      path: 'bulk_bom',
      component: five,
      name: 'bulk_bom',
      meta: {
        title: 'Bulk BOM',
        //icon: 'edit'
      },
    }, {
      path: 'contract',
      component: five,
      name: 'contract',
      meta: {
        title: 'Contract',
        //icon: 'edit'
      },
    }]
  },

 
  {
  path: '/mater_center',
    component: Layout,
    meta: {
      title: 'Mater Center',
      icon: 'documentation'
    },
    children: [{
      path: 'fabric',
      component: one,
      name: 'fabric',
      meta: {
        title: 'Fabric',
        //icon: 'edit'
      },
    },{
      path: 'color',
      component: one,
      name: 'color',
      meta: {
      title: 'Color',
    },
    },{
      path: 'quantity',
      component: one,
      name: 'quantity',
      meta: {
      title: 'Quantity',
    },
    },{
      path: 'destination',
      component: one,
      name: 'destination',
      meta: {
      title: 'Destination',
        //icon: 'edit'
      },
    },{
      path: 'sample_request',
      component: one,
      name: 'sample_request',
      meta: {
      title: 'Sample Request',
        //icon: 'edit'
      },
    },{
      path: 'customer_manuel',
      component: one,
      name: 'customer_manuel',
      meta: {
      title: 'Customer Manuel',
        //icon: 'edit'
      },
    }]
  },

]
