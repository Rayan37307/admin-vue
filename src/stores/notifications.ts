import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  type NotificationResource,
} from '@/services/api'

export interface FrontendNotification {
  id: string
  type: string
  title: string
  message: string
  data: Record<string, unknown>
  read_at: string | null
  created_at: string
  unread: boolean
  icon: string
  bgClass: string
  textClass: string
  time: string
}

interface TypeIconConfig {
  icon: string
  bgClass: string
  textClass: string
}

const typeIcons: Record<string, TypeIconConfig> = {
  task_assigned: { icon: 'CheckCircle2', bgClass: 'bg-emerald-500/10 border border-emerald-500/20', textClass: 'text-emerald-400' },
  new_message: { icon: 'Info', bgClass: 'bg-blue-500/10 border border-blue-500/20', textClass: 'text-blue-400' },
  task_status_updated: { icon: 'AlertCircle', bgClass: 'bg-amber-500/10 border border-amber-500/20', textClass: 'text-amber-400' },
  announcement: { icon: 'Info', bgClass: 'bg-blue-500/10 border border-blue-500/20', textClass: 'text-blue-400' },
  reminder: { icon: 'Clock', bgClass: 'bg-purple-500/10 border border-purple-500/20', textClass: 'text-purple-400' },
  alert: { icon: 'AlertTriangle', bgClass: 'bg-red-500/10 border border-red-500/20', textClass: 'text-red-400' },
  project_update: { icon: 'Info', bgClass: 'bg-blue-500/10 border border-blue-500/20', textClass: 'text-blue-400' },
  custom: { icon: 'Info', bgClass: 'bg-blue-500/10 border border-blue-500/20', textClass: 'text-blue-400' },
}

const defaultIconConfig: TypeIconConfig = { icon: 'Info', bgClass: 'bg-blue-500/10 border border-blue-500/20', textClass: 'text-blue-400' }

export const useNotificationsStore = defineStore('notifications', () => {
  const notifications = ref<FrontendNotification[]>([])
  const unreadCount = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const unreadNotifications = computed(() =>
    notifications.value.filter((n) => !n.read_at)
  )

  const readNotifications = computed(() =>
    notifications.value.filter((n) => n.read_at)
  )

  function mapNotification(apiNotification: NotificationResource): FrontendNotification {
    const notificationData = apiNotification.data || {}
    const title = (notificationData.title as string) || apiNotification.type || 'Notification'
    const message = (notificationData.message as string) || ''
    const notificationType = (notificationData.type as string) || apiNotification.type || 'custom'
    const iconConfig = typeIcons[notificationType] || defaultIconConfig
    const isRead = apiNotification.read_at !== null || apiNotification.read === true

    return {
      id: String(apiNotification.id),
      type: apiNotification.type,
      title,
      message,
      data: notificationData as Record<string, unknown>,
      read_at: apiNotification.read_at,
      created_at: apiNotification.created_at,
      unread: !isRead,
      icon: iconConfig.icon,
      bgClass: iconConfig.bgClass,
      textClass: iconConfig.textClass,
      time: formatTimeAgo(apiNotification.created_at),
    }
  }

  function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (seconds < 60) return 'Just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`
    return date.toLocaleDateString()
  }

  async function fetchNotifications(includeRead = false) {
    loading.value = true
    error.value = null
    try {
      const response = await getNotifications(includeRead)
      const apiNotifications = response.notifications || response.data || []
      notifications.value = apiNotifications.map(mapNotification)
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      error.value = e.response?.data?.message || 'Failed to load notifications'
    } finally {
      loading.value = false
    }
  }

  async function fetchUnreadCount() {
    try {
      const response = await getUnreadCount()
      unreadCount.value = response.unread_count || response.data?.unread_count || 0
    } catch {
      unreadCount.value = 0
    }
  }

  async function markNotificationAsReadFn(notificationId: string) {
    try {
      await markAsRead(notificationId)
      const notification = notifications.value.find((n) => n.id === notificationId)
      if (notification) {
        notification.read_at = new Date().toISOString()
        notification.unread = false
      }
      await fetchUnreadCount()
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      error.value = e.response?.data?.message || 'Failed to mark notification as read'
      throw err
    }
  }

  async function markAllNotificationsAsRead() {
    try {
      await markAllAsRead()
      notifications.value.forEach((n) => {
        if (n.unread) {
          n.read_at = new Date().toISOString()
          n.unread = false
        }
      })
      await fetchUnreadCount()
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      error.value = e.response?.data?.message || 'Failed to mark all as read'
      throw err
    }
  }

  async function removeNotification(notificationId: string) {
    try {
      await deleteNotification(notificationId)
      notifications.value = notifications.value.filter((n) => n.id !== notificationId)
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      error.value = e.response?.data?.message || 'Failed to delete notification'
      throw err
    }
  }

  function clearNotifications() {
    notifications.value = []
    unreadCount.value = 0
    error.value = null
  }

  return {
    notifications,
    unreadCount,
    loading,
    error,
    unreadNotifications,
    readNotifications,
    fetchNotifications,
    fetchUnreadCount,
    markNotificationAsRead: markNotificationAsReadFn,
    markAllNotificationsAsRead,
    removeNotification,
    clearNotifications,
  }
})
