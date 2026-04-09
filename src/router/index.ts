import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Task views
import TaskList from '../views/tasks/TaskList.vue'
import TaskAnalytics from '../views/tasks/TaskAnalytics.vue'
import AssignNewTask from '../views/tasks/AssignNewTask.vue'
import AssignTask from '../views/tasks/AssignTask.vue'
import TaskCalendar from '../views/tasks/TaskCalendar.vue'
import TaskDetails from '../views/tasks/TaskDetails.vue'
import TaskHub from '../views/tasks/TaskHub.vue'
import TaskManage from '../views/tasks/TaskManage.vue'

// Auth views
import Login from '../views/auth/Login.vue'
import Signup from '../views/auth/Signup.vue'
import ForgotPassword from '../views/auth/ForgotPassword.vue'
import ResetPassword from '../views/auth/ResetPassword.vue'
import AccessDenied from '../views/auth/AccessDenied.vue'

// Messages views
import Messages from '../views/messages/Messages.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/tasks'
  },
  // ─── Auth Routes (public) ──────────────────────────────────────────────────
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
    meta: { requiresGuest: true }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword,
    meta: { requiresGuest: true }
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPassword,
    meta: { requiresGuest: true }
  },
  {
    path: '/access-denied',
    name: 'AccessDenied',
    component: AccessDenied
  },
  // ─── Task Routes (protected) ───────────────────────────────────────────────
  {
    path: '/tasks',
    name: 'TaskList',
    component: TaskList,
    meta: { requiresAuth: true }
  },
  {
    path: '/tasks/analytics',
    name: 'TaskAnalytics',
    component: TaskAnalytics,
    meta: { requiresAuth: true }
  },
  {
    path: '/tasks/assign-new',
    name: 'AssignNewTask',
    component: AssignNewTask,
    meta: { requiresAuth: true }
  },
  {
    path: '/tasks/assign',
    name: 'AssignTask',
    component: AssignTask,
    meta: { requiresAuth: true }
  },
  {
    path: '/tasks/calendar',
    name: 'TaskCalendar',
    component: TaskCalendar,
    meta: { requiresAuth: true }
  },
  {
    path: '/tasks/details',
    name: 'TaskDetails',
    component: TaskDetails,
    meta: { requiresAuth: true }
  },
  {
    path: '/tasks/hub',
    name: 'TaskHub',
    component: TaskHub,
    meta: { requiresAuth: true }
  },
  {
    path: '/tasks/manage',
    name: 'TaskManage',
    component: TaskManage,
    meta: { requiresAuth: true }
  },
  // ─── Messages Routes (protected) ───────────────────────────────────────────
  {
    path: '/messages',
    name: 'Messages',
    component: Messages,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// ─── Navigation Guards ───────────────────────────────────────────────────────

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()

  // If requires auth and user is not logged in
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  }
  // If user is logged in but not admin, redirect to access denied
  else if (to.meta.requiresAuth && authStore.isAuthenticated && !authStore.isAdmin) {
    next({ name: 'AccessDenied' })
  }
  // If visiting auth pages (login/signup) while already logged in as admin
  else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/tasks')
  }
  // Access denied page: redirect to tasks if already authenticated as admin
  else if (to.name === 'AccessDenied' && authStore.isAuthenticated && authStore.isAdmin) {
    next('/tasks')
  }
  else {
    next()
  }
})

export default router
