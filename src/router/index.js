import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const page404 = () => import('components/common/page404')
const login = () => import('views/login/login')
const forgetPassword = () => import('views/login/forgetPassword')
const register = () => import('views/register/register')
const main = () => import('views/main/insightMain')
const cameraManagement = () => import('views/cameraManagement/cameraManagementMain')
const AISkillManagement = () => import('views/AISkillManagement/AISkillManagementMain')
const faceManagement = () => import('views/faceManagement/faceManagementMain')
const incidentMangement = () => import('views/incidentManagement/incidentManagementMain')


const routes = [
  {
    path: '/',
    name: 'index',
    component: main,
    children: [
      {
        path: 'camera-management',
        name: 'cameraManagement',
        component: cameraManagement,
        meta: {
          requireAuth: true,
          title: 'insight-摄像头管理'
        }
      },
      {
        path: 'ai-skill-management',
        name: 'AISkillManagement',
        component: AISkillManagement,
        meta: {
          requireAuth: true,
          title: 'insight-AI技能接口管理'
        }
      },
      {
        path: 'face-management',
        name: 'faceManagement',
        component: faceManagement,
        meta: {
          requireAuth: true,
          title: 'insight-人脸库管理'
        }
      },
      {
        path: 'incident-management',
        name: 'incidentManagement',
        components: {
          'incidents': incidentMangement
        },
        meta: {
          requireAuth: true,
          title: 'insight-事件总览'
        }
      }
    ],
    meta: {
      requireAuth: true,
      title: 'insight-让我来管理您的智能监控'
    }
  },
  {
    path: '/login',
    name: 'login',
    components: {
      'login': login
    },
    meta: {
      requireAuth: false,
      title: 'insight-登录'
    },
    beforeEnter: (to, from, next) => {
      const hasUserInfo = localStorage.getItem('userInfo')
      if(hasUserInfo) {
        alert('你已登录!')
        next({name: 'index'})
      }
      else {
        next()
      }
    }
  },
  {
    path: '/forget-password',
    name: 'forgetPassword',
    components: {
      'forget-password': forgetPassword
    },
    meta: {
      requireAuth: false,
      title: 'insight-忘记密码'
    }
  },
  {
    path: '/register',
    name: 'register',
    components: {
      'register': register
    },
    meta: {
      requireAuth: false,
      title: 'insight-注册账号'
    }
  },
  {
    path: '*',
    name: 'page404',
    components: {
      'page404': page404
    },
    meta: {
      requireAuth: false,
      title: '您来到了一片未知区域...'
    }
  }
]

const router = new VueRouter({
  mode: 'bash',
  routes
})

export default router
