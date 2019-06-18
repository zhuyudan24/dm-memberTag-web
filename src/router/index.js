// import Vue from 'vue';
import Router from 'vue-router';
import _import from './_import.js';
// Vue.use(Router);

/* const error403 = r => {
  import('view/errorPage/403.vue').then(module => {
    r(module);
  });
};
const error404 = r => {
  import('view/errorPage/404.vue').then(module => {
    r(module);
  });
};
const error500 = r => {
  import('view/errorPage/500.vue').then(module => {
    r(module);
  });
}; */
const errorPage = r => {
  import('view/errorPage/index.vue').then(module => {
    r(module);
  });
};

export const constantRouterMap = [
  {
    path: '/',
    name: 'index',
    redirect: 'member-tag',
    component: _import('index', 'index'),
    children: [
      // 平台标签
      {
        path: '/member-tag',
        name: '会员标签',
        component: _import('platformTag', 'member-tag'),
        meta: {
          title: '会员标签'
        }
      },
      {
        path: '/platformTagList',
        component: _import('platformTag', 'platformTagList'),
        name: '平台标签列表',
        meta: {
          title: '会员标签-平台标签列表'
        }
      },
      {
        path: '/platformTagDetail',
        component: _import('platformTag', 'platformTagDetail'),
        name: '平台标签详情',
        meta: {
          title: '会员标签-平台标签详情'
        }
      },

      // 手工标签
      {
        path: '/manualTagLib',
        component: _import('manualTag', 'manualTagLib'),
        name: '手工标签库',
        meta: {
          title: '会员标签-手工标签库'
        }
      },
      {
        path: '/manualTagList',
        component: _import('manualTag', 'manualTagList'),
        name: '手工标签列表',
        meta: {
          title: '会员标签-手工标签列表'
        }
      },
      {
        path: '/manualTagValueEdit',
        component: _import('manualTag', 'manual-tag-value-edit'),
        name: '标签值设置',
        meta: {
          title: '会员标签-标签值设置'
        }
      },
      {
        path: '/manualTagDetail',
        component: _import('manualTag', 'manualTagDetail'),
        name: '手工标签详情',
        meta: {
          title: '会员标签-手工标签详情'
        }
      },

      // 我的标签库
      {
        path: '/myTagLib',
        component: _import('myTag', 'myTagLib'),
        name: '会员标签',
        meta: {
          title: '会员标签'
        }
      },
      {
        path: '/myTagList',
        component: _import('myTag', 'myTagList'),
        name: '我的标签库列表',
        meta: {
          title: '会员标签-我的标签库列表'
        }
      },
      {
        path: '/myTagDetail',
        component: _import('myTag', 'myTagDetail'),
        name: '标签详情',
        meta: {
          title: '会员标签-标签详情'
        }
      }
    ]
  },
  // 会员分组
  {
    path: '/memberGroupList',
    name: 'memberGroupListIndex',
    redirect: 'memberGroupList',
    component: _import('memberGroup', 'index'),
    children: [
      {
        path: '/memberGroupList',
        component: _import('memberGroup', 'memberGroupList'),
        name: '会员分组',
        meta: {
          title: '会员标签-会员分组'
        }
      },
      {
        path: '/memberGroupDetail',
        component: _import('memberGroup', 'memberGroupDetail'),
        name: '分组详情',
        meta: {
          title: '会员标签-分组详情'
        }
      },
      {
        path: '/memberGroupEdit',
        component: _import('memberGroup', 'memberGroupEdit'),
        name: '编辑分组',
        meta: {
          title: '会员标签-编辑分组'
        }
      }
    ]
  },
  {
    path: '/403',
    name: '无权访问',
    component: errorPage
  },
  {
    path: '/404',
    name: 'error404',
    component: errorPage
  },
  {
    path: '/500',
    name: 'error500',
    component: errorPage
  },
  { path: '*', redirect: '/404', hidden: true }
];
export default new Router({
  // mode:'history',
  routes: constantRouterMap,
  scrollBehavior: () => ({ y: 0 })
});
