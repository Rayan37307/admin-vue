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

// Notifications views
import Notifications from '../views/notifications/Notifications.vue'
import NotificationDetails from '../views/notifications/NotificationDetails.vue'

// Profile
import Profile from '../views/Profile.vue'

// Roles
import RolesList from '../views/roles/RolesList.vue'
import RoleAdd from '../views/roles/RoleAdd.vue'

// Team views
import TeamList from '../views/team/TeamList.vue'
import TeamAssign from '../views/team/TeamAssign.vue'

// Client views
import ClientsList from '../views/clients/ClientsList.vue'
import ClientActivityLog from '../views/clients/ClientActivityLog.vue'
import ClientDocumentVault from '../views/clients/ClientDocumentVault.vue'
import ClientManagement from '../views/clients/ClientManagement.vue'
import ClientProjectsGrid from '../views/clients/ClientProjectsGrid.vue'

// Settings
import Settings from '../views/settings/Settings.vue'

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
  },
  // ─── Notifications Routes (protected) ──────────────────────────────────────
  {
    path: '/notifications',
    name: 'Notifications',
    component: Notifications,
    meta: { requiresAuth: true }
  },
  {
    path: '/notifications/details',
    name: 'NotificationDetails',
    component: NotificationDetails,
    meta: { requiresAuth: true }
  },
  // ─── Profile Route (protected) ─────────────────────────────────────────────
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  // ─── Roles Routes (protected) ──────────────────────────────────────────────
  {
    path: '/roles',
    name: 'RolesList',
    component: RolesList,
    meta: { requiresAuth: true }
  },
  {
    path: '/roles/add',
    name: 'RoleAdd',
    component: RoleAdd,
    meta: { requiresAuth: true }
  },
  // ─── Team Routes (protected) ───────────────────────────────────────────────
  {
    path: '/team',
    name: 'TeamList',
    component: TeamList,
    meta: { requiresAuth: true }
  },
  {
    path: '/team/assign',
    name: 'TeamAssign',
    component: TeamAssign,
    meta: { requiresAuth: true }
  },
  // ─── Client Routes (protected) ─────────────────────────────────────────────
  {
    path: '/clients',
    name: 'ClientsList',
    component: ClientsList,
    meta: { requiresAuth: true }
  },
  {
    path: '/clients/management',
    name: 'ClientManagement',
    component: ClientManagement,
    meta: { requiresAuth: true }
  },
  {
    path: '/clients/activity',
    name: 'ClientActivityLog',
    component: ClientActivityLog,
    meta: { requiresAuth: true }
  },
  {
    path: '/clients/documents',
    name: 'ClientDocumentVault',
    component: ClientDocumentVault,
    meta: { requiresAuth: true }
  },
  {
    path: '/clients/projects',
    name: 'ClientProjectsGrid',
    component: ClientProjectsGrid,
    meta: { requiresAuth: true }
  },
  // ─── Settings Route (protected) ───────────────────────────────────────────
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
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
