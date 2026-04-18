import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  bulkDeleteUsers,
  getWorkers,
  getWorkerLoad,
  type User,
  type WorkerLoad,
} from '../api/team'

export const useTeamStore = defineStore('team', () => {
  const users = ref<User[]>([])
  const workers = ref<User[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const selectedUsers = ref<number[]>([])
  const currentFilter = ref<'All' | 'Designers' | 'Developers' | 'PMs' | 'QA'>('All')
  const currentStatus = ref<'All' | 'Active' | 'Inactive'>('All')
  const currentProject = ref<string>('All')

  const roleFilterMap: Record<string, string> = {
    'All': '',
    'Designers': 'designer',
    'Developers': 'developer',
    'PMs': 'project_manager',
    'QA': 'qa',
  }

  const filteredUsers = computed(() => {
    let result = users.value
    const roleFilter = roleFilterMap[currentFilter.value]
    if (roleFilter) {
      result = result.filter(u => u.role === roleFilter)
    }
    return result
  })

  const selectedCount = computed(() => selectedUsers.value.length)

  async function fetchUsers(params?: { role?: string; search?: string }) {
    loading.value = true
    error.value = null
    console.log('[TeamStore] fetchUsers called, token:', localStorage.getItem('auth_token')?.slice(0, 20) + '...')
    try {
      users.value = await getUsers(params)
      console.log('[TeamStore] fetchUsers success, count:', users.value.length)
    } catch (e: any) {
      console.error('[TeamStore] fetchUsers error:', e.response?.status, e.response?.data)
      if (e.response?.status === 401) {
        error.value = 'Unauthorized. Please log in as admin.'
      } else {
        error.value = e.response?.data?.message || 'Failed to fetch users'
      }
    } finally {
      loading.value = false
    }
  }

  async function fetchWorkers() {
    loading.value = true
    error.value = null
    try {
      workers.value = await getWorkers()
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to fetch workers'
    } finally {
      loading.value = false
    }
  }

  async function updateUserById(id: number, data: Partial<User>) {
    loading.value = true
    error.value = null
    try {
      await updateUser(id, data)
      const idx = users.value.findIndex(u => u.id === id)
      if (idx > -1) {
        const existing = users.value[idx]
        if (!existing) return
        const updated: User = {
          id: existing.id,
          name: existing.name,
          email: existing.email,
          role: existing.role,
          phone_number: existing.phone_number,
          profile_image_link: existing.profile_image_link,
          avatar: existing.avatar,
          created_at: existing.created_at,
          updated_at: existing.updated_at,
        }
        if (data.name !== undefined) updated.name = data.name
        if (data.email !== undefined) updated.email = data.email
        if (data.role !== undefined) updated.role = data.role
        if (data.phone_number !== undefined) updated.phone_number = data.phone_number
        if (data.profile_image_link !== undefined) updated.profile_image_link = data.profile_image_link
        if (data.avatar !== undefined) updated.avatar = data.avatar
        users.value[idx] = updated
      }
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to update user'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteUserById(id: number) {
    loading.value = true
    error.value = null
    try {
      await deleteUser(id)
      users.value = users.value.filter(u => u.id !== id)
      selectedUsers.value = selectedUsers.value.filter(uid => uid !== id)
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to delete user'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function bulkDeleteSelected() {
    if (selectedUsers.value.length === 0) return
    loading.value = true
    error.value = null
    try {
      await bulkDeleteUsers(selectedUsers.value)
      users.value = users.value.filter(u => !selectedUsers.value.includes(u.id))
      selectedUsers.value = []
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to delete users'
      throw e
    } finally {
      loading.value = false
    }
  }

  function toggleSelect(id: number) {
    const idx = selectedUsers.value.indexOf(id)
    if (idx > -1) {
      selectedUsers.value.splice(idx, 1)
    } else {
      selectedUsers.value.push(id)
    }
  }

  function setFilter(filter: typeof currentFilter.value) {
    currentFilter.value = filter
  }

  function setStatusFilter(status: typeof currentStatus.value) {
    currentStatus.value = status
  }

  function setProjectFilter(project: string) {
    currentProject.value = project
  }

  return {
    users,
    workers,
    loading,
    error,
    selectedUsers,
    currentFilter,
    currentStatus,
    currentProject,
    filteredUsers,
    selectedCount,
    fetchUsers,
    fetchWorkers,
    updateUserById,
    deleteUserById,
    bulkDeleteSelected,
    toggleSelect,
    setFilter,
    setStatusFilter,
    setProjectFilter,
  }
})