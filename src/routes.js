import Task from './components/Task/Task.vue'
import SignUp from './components/SignUp.vue'
import NotFound from './components/shared/NotFound.vue'
import SignIn from './components/SignIn.vue'
import Password from './components/Password.vue'
import RecoverPassword from './components/RecoverPassword.vue'
import Settings from './components/Settings.vue'
import TaskDetail from './components/Task/TaskDetail.vue'
import TaskAdd from './components/Task/TaskAdd.vue'

import VueRouter from 'vue-router'

const routes = [
  { path: '/', component: Task, name: 'task', meta: { isPublic: false } },
  { path: '/signup', component: SignUp, name: 'signup', meta: { isPublic: true } },
  { path: '/signin', component: SignIn, name: 'signin', meta: { isPublic: true } },
  { path: '/password', component: Password, name: 'password', meta: { isPublic: true } },
  { path: '/recover/:username/:_id', component: RecoverPassword, name: 'recoverpassword', meta: { isPublic: true } },
  { path: '/settings/:username', component: Settings, name: 'settings', meta: { isPublic: false } },
  { path: '/task/:uuid', component: TaskDetail, name: 'taskdetail', meta: { isPublic: true } },
  { path: '/add', component: TaskAdd, name: 'add', meta: { isPublic: false } },
  { path: '*', component: NotFound, name: 'notf', redirect: '/' }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

function isAuthenticated () {
  return window.localStorage.token
}

router.beforeEach((to, from, next) => {
  if (!to.meta.isPublic && !isAuthenticated()) {
    return next({ name: 'signin' })
  }

  return next()
})

export default router
