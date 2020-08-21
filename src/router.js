import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import AppList from './views/application/List'
import AppLayout from './views/application/Layout'
import AppDetail from './views/application/Detail'
import AppCreate from './views/application/Create'
import ApiList from './views/interface/List'
import ApiCreate from './views/interface/Create'
import ApiDebug from './views/interface/Debug'
import AppStatistics from './views/data_analysis/Statistics'
import AppLog from './views/data_analysis/Log'
import BasicSetting from './views/management/Setting'
import OtherSetting from './views/management/Other'
import CenterLayout from './views/center/Layout'
import Personal from './views/center/Personal'
import Security from './views/center/Security'
import Information from './views/center/Information'

Vue.use(VueRouter)

const routerMap = [
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      title: '登录',
      full: true
    }
  },
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      title: '首页',
      auth: true
    }
  },
  {
    path: '/apps',
    name: 'myApps',
    component: AppList,
    meta: {
      title: '我的所有应用',
      auth: true
    }
  },
  {
    path: "/create",
    name: "appCreate",
    component: AppCreate,
    meta: {
      title: '新建应用',
      auth: true
    }
  },
  {
    path: "/create_api",
    name: "apiCreate",
    component: ApiCreate,
    meta: {
      title: '新建接口',
      auth: true
    }
  },
  {
    path: "/app/:slug",
    component: AppLayout,
    children: [
      {
        path: "info",
        name: "appDetail",
        component: AppDetail,
        meta: {
          title: '应用详情',
          auth: true
        }
      },
      {
        path: "api",
        name: "apiList",
        component: ApiList,
        meta: {
          title: '应用接口列表',
          auth: true
        }
      },
      {
        path: "debug",
        name: "apiDebug",
        component: ApiDebug,
        meta: {
          title: '接口测试',
          auth: true
        }
      },
      {
        path: "log",
        name: "appLog",
        component: AppLog,
        meta: {
          title: '应用日志',
          auth: true
        }
      },
      {
        path: "statistics",
        name: "appStatistics",
        component: AppStatistics,
        meta: {
          title: '数据统计',
          auth: true
        }
      },
      {
        path: "setting",
        name: "basicSetting",
        component: BasicSetting,
        meta: {
          title: '应用设置',
          subKey: 'management',
          auth: true
        }
      },
      {
        path: "other",
        name: "otherSetting",
        component: OtherSetting,
        meta: {
          title: '高级操作',
          subKey: 'management',
          auth: true
        }
      },
    ]
  },
  {
    path: "/",
    component: CenterLayout,
    children: [
      {
        path: "/profile",
        name: "profile",
        component: Personal,
        meta: {
          title: '个人资料',
          auth: true
        }
      },
      {
        path: "/security",
        name: "security",
        component: Security,
        meta: {
          title: '账号密码',
          auth: true
        }
      },
      {
        path: "/information",
        name: "information",
        component: Information,
        meta: {
          title: '我的消息',
          auth: true
        }
      },
    ]
  },
  {
    path: "*",
    name: "404",
    component: () => import(/* webpackChunkName: "404" */ "./views/other/404.vue"),
    meta: {
      title: '404',
      full: true
    }
  }
];

const router = new VueRouter({
  routes: routerMap,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  },
  mode: "hash"
});

router.beforeEach((to, from, next) => {
  if (to.meta.auth && !store.getters.isLogin) {
    next({ name: 'login' }); return;
  }

  if (store.getters.isLogin && to.name == 'login') {
    next({ name: 'home' }); return;
  }

  // 如果设置标题，拦截后设置标题
  if (to.meta.title) {
    document.title = to.meta.title + " | VirAPI -- 虚拟数据接口系统 [开源版]";
  } else {
    document.title = "VirAPI -- 虚拟数据接口系统 [开源版]";
  }
  next();
});

export default router;
