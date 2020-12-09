export const asyncRoutes = [
  // 素材管理
  {
    id: 1,
    path: '/material',
    component: 'layout',
    redirect: '/material/upload',
    meta: {
      title: '路由测试',
      icon: 'plane'
    },
    children: [{
      id: 4,
      path: 'check-template',
      name: 'check-template',
      component: 'material/check-template',
      meta: {
        title: '查看模板'
      }
    },
    {
      id: 5,
      path: 'logo',
      name: 'logo',
      component: 'material/check-logo',
      meta: {
        title: '查看logo'
      }
    },
    {
      id: 6,
      path: 'generate',
      name: 'generate',
      component: 'material/generate',
      meta: {
        title: '生成素材'
      }
    },
    {
      id: 7,
      path: 'check',
      name: 'check',
      component: 'material/check',
      meta: {
        title: '查看素材'
      }
    },
    {
      id: 8,
      path: 'testchart',
      name: 'testchart',
      component: 'Echarts/polar',
      meta: {
        title: '测试图表'
      }
    }
    ]
  },

  // 测试页面
  {
    id: 2,
    path: '/',
    name: 'modelManage',
    alwaysShow: true,
    hidden: false,
    component: 'layout',
    meta: {
      title: '模型管理',
      icon: 'example'
    },
    children: [{
      id: 9,
      path: 'modelreuse',
      name: 'modelreuse',
      component: 'modelreuse/index',
      meta: {
        title: '模型复用',
        icon: 'dashboard'
      }
    }]
  },
  {
    id: 3,
    name: '404页面',
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

export const editAsyncRoutes = [// 素材管理

  // 测试页面
  {
    id: 2,
    path: '/',
    alwaysShow: true,
    hidden: false,
    component: 'layout',
    meta: {
      title: '系统',
      icon: 'system'
    },
    children: [{
      id: 9,
      path: 'test',
      name: 'test',
      component: 'test/test',
      meta: {
        title: '测试'
      }
    }]
  },
  {
    id: 3,
    name: '404页面',
    path: '*',
    redirect: '/404',
    hidden: true
  }
]
