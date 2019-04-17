
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
    path: '/merchandising',
    component: Layout,
    redirect: '/merchandising/one',
    name: 'merchandising',
    meta: {
      title: 'Merchandising',
      icon: 'documentation'
    },
    
    children: [
      {
        path: 'DynamicTable',
        component: () => import('@/views/one'),
        name: 'DynamicTable',
        meta: { title: 'dynamicTable' }
    }, {
      path: 'one',
      component: one,
      name: 'one1',
      meta: {
        title: '菜单2',
        //icon: 'edit'
      },
    }]
  },
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
  path: 'customer_data',
    component: Layout,
    meta: {
      title: 'Customer Data',
      icon: 'location'
    },
    children: [{
        path: 'one',
        component: one,
        name: 'pech_pack',
        meta: {
          title: 'Tech Pack',
          //icon: 'edit'
        },
        item: 0,
      },{
        path: 'one',
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
      path: 'five',
      component: five,
      name: 'bulk_bom',
      meta: {
        title: 'Bulk BOM',
        //icon: 'edit'
      },
    }, {
      path: 'five',
      component: five,
      name: 'contract',
      meta: {
        title: 'Contract',
        //icon: 'edit'
      },
    }]
  },

  {
    path: 'index',
    component: Layout,
    children: [{
      path: '/three',
      component: four,
      name: 'three',
      meta: {
        title: 'Development',
        icon: 'menu'
      }
    }]
  },

  {
    path: 'index',
    component: Layout,
    children: [{
      path: '/four',
      component: six,
      name: 'four',
      meta: {
        title: 'Bulk',
        icon: 'deliver'
      }
    }]
  },
  {
  path: 'mater_center',
    component: Layout,
    meta: {
      title: 'Mater Center',
      icon: 'documentation'
    },
    children: [{
      path: 'one',
      component: one,
      name: 'fabric',
      meta: {
        title: 'Fabric',
        //icon: 'edit'
      },
    },{
      path: 'one',
      component: one,
      name: 'color',
      meta: {
      title: 'Color',
    },
    },{
      path: 'one',
      component: one,
      name: 'quantity',
      meta: {
      title: 'Quantity',
    },
    },{
      path: 'one',
      component: one,
      name: 'destination',
      meta: {
      title: 'Destination',
        //icon: 'edit'
      },
    },{
      path: 'one',
      component: one,
      name: 'sample_request',
      meta: {
      title: 'Sample Request',
        //icon: 'edit'
      },
    },{
      path: 'one',
      component: one,
      name: 'customer_manuel',
      meta: {
      title: 'Customer Manuel',
        //icon: 'edit'
      },
    }]
  },

]
