import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiClient from '@/api/client'

// ─── Types matching backend ─────────────────────────────────────────────────

export interface ClientUser {
  id: number
  name: string
  email: string
  avatar: string | null
}

export interface ClientResource {
  id: number
  user_id: number
  company_name: string | null
  phone: string | null
  address: string | null
  status: 'active' | 'inactive'
  notes: string | null
  created_at: string | null
  updated_at: string | null
  user?: ClientUser
  projects_count?: number
  invoices_count?: number
  service_orders_count?: number
  projects?: ProjectResource[]
  invoices?: InvoiceResource[]
  service_orders?: ServiceOrderResource[]
}

export interface ProjectResource {
  id: number
  name: string
  description: string | null
  status: string
  budget: number | null
  deadline: string | null
  progress_percentage: number
  task_count_by_status: Record<string, number>
  created_at: string | null
  updated_at: string | null
  client?: {
    id: number
    company_name: string | null
    user: {
      id: number
      name: string
      email: string
    }
  }
  workers?: Array<{
    id: number
    name: string
    email: string
    avatar: string | null
    pivot: { role: string }
  }>
}

export interface InvoiceResource {
  invoice_id: number
  project_id: number | null
  client_id: number | null
  issued_by: number | null
  updated_by: number | null
  date_issued: string
  due_date: string
  amount: string
  status: string
  file_path: string | null
  created_at: string
  updated_at: string
}

export interface ServiceOrderResource {
  id: number
  [key: string]: unknown
}

export interface ActivityResource {
  id: number
  log_name: string
  description: string
  event: string
  subject_type: string
  subject_id: number | null
  properties: { old?: Record<string, unknown>; attributes?: Record<string, unknown> }
  causer?: {
    id: number
    name: string
    email: string
    avatar?: string | null
  } | null
  created_at: string | null
  updated_at: string | null
}

export interface ActivityResponse {
  data: ActivityResource[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export interface ClientStats {
  total_projects: number
  active_projects: number
  completed_projects: number
  total_invoices: number
  paid_invoices: number
  unpaid_invoices: number
  total_revenue: string
  pending_revenue: string
  total_service_orders: number
  pending_service_orders: number
  completed_service_orders: number
  client_since: string
}

export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface ClientsResponse {
  clients: ClientResource[]
  meta: PaginationMeta
}

export interface ClientFilters {
  status?: 'active' | 'inactive' | 'all'
  search?: string
  date_from?: string
  date_to?: string
  sort_field?: string
  sort_direction?: 'asc' | 'desc'
  page?: number
  per_page?: number
}

// ─── API Functions ───────────────────────────────────────────────────────────

async function getClients(filters: ClientFilters = {}): Promise<ClientsResponse> {
  const params: Record<string, string | number | undefined> = {
    status: filters.status === 'all' ? undefined : filters.status,
    search: filters.search,
    date_from: filters.date_from,
    date_to: filters.date_to,
    sort_field: filters.sort_field,
    sort_direction: filters.sort_direction,
    page: filters.page,
    per_page: filters.per_page || 15,
  }
  Object.keys(params).forEach((key) => {
    if (params[key] === undefined) delete params[key]
  })
  const response = await apiClient.get<ClientsResponse>('/admin/clients', { params })
  return response.data
}

async function getClient(id: number): Promise<{ client: ClientResource }> {
  const response = await apiClient.get<{ client: ClientResource }>(`/admin/clients/${id}`)
  return response.data
}

async function getClientStats(id: number): Promise<{ stats: ClientStats }> {
  const response = await apiClient.get<{ stats: ClientStats }>(`/admin/clients/${id}/stats`)
  return response.data
}

async function createClient(data: {
  name: string
  email: string
  password: string
  company_name?: string
  phone?: string
  address?: string
  notes?: string
}): Promise<{ message: string; client: ClientResource }> {
  const response = await apiClient.post<{ message: string; client: ClientResource }>(
    '/admin/clients',
    data
  )
  return response.data
}

async function updateClient(
  id: number,
  data: {
    company_name?: string
    phone?: string
    address?: string
    status?: 'active' | 'inactive'
    notes?: string
    name?: string
    email?: string
  }
): Promise<{ message: string; client: ClientResource }> {
  const response = await apiClient.put<{ message: string; client: ClientResource }>(
    `/admin/clients/${id}`,
    data
  )
  return response.data
}

async function deleteClient(id: number): Promise<{ message: string }> {
  const response = await apiClient.delete<{ message: string }>(`/admin/clients/${id}`)
  return response.data
}

async function getUserActivity(page = 1, perPage = 20): Promise<ActivityResponse> {
  const response = await apiClient.get<ActivityResponse>('/user/activity', {
    params: { page, per_page: perPage },
  })
  return response.data
}

// ─── Store ───────────────────────────────────────────────────────────────────

export const useClientsStore = defineStore('clients', () => {
  // State
  const clients = ref<ClientResource[]>([])
  const selectedClient = ref<ClientResource | null>(null)
  const clientStats = ref<ClientStats | null>(null)
  const activities = ref<ActivityResource[]>([])
  const activityPagination = ref({ current_page: 1, last_page: 1, per_page: 20, total: 0 })
  const pagination = ref<PaginationMeta>({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  })
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Filters
  const filters = ref<ClientFilters>({
    status: 'all',
    search: '',
    page: 1,
    per_page: 15,
  })

  // Computed
  const filteredClients = computed(() => clients.value)

  const totalPages = computed(() => pagination.value.last_page)
  const currentPage = computed(() => pagination.value.current_page)
  const totalClients = computed(() => pagination.value.total)

  // Actions
  async function fetchClients(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const data = await getClients(filters.value)
      clients.value = data.clients
      pagination.value = data.meta
    } catch (e: unknown) {
      error.value = (e as Error).message || 'Failed to fetch clients'
    } finally {
      loading.value = false
    }
  }

  async function fetchClient(id: number): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const data = await getClient(id)
      selectedClient.value = data.client
    } catch (e: unknown) {
      error.value = (e as Error).message || 'Failed to fetch client'
    } finally {
      loading.value = false
    }
  }

  async function fetchClientStats(id: number): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const data = await getClientStats(id)
      clientStats.value = data.stats
    } catch (e: unknown) {
      error.value = (e as Error).message || 'Failed to fetch client stats'
    } finally {
      loading.value = false
    }
  }

  async function createNewClient(data: {
    name: string
    email: string
    password: string
    company_name?: string
    phone?: string
    address?: string
    notes?: string
  }): Promise<ClientResource> {
    loading.value = true
    error.value = null
    try {
      const result = await createClient(data)
      clients.value.unshift(result.client)
      return result.client
    } catch (e: unknown) {
      error.value = (e as Error).message || 'Failed to create client'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateClientData(
    id: number,
    data: {
      company_name?: string
      phone?: string
      address?: string
      status?: 'active' | 'inactive'
      notes?: string
      name?: string
      email?: string
    }
  ): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const result = await updateClient(id, data)
      const index = clients.value.findIndex((c) => c.id === id)
      if (index !== -1) {
        clients.value[index] = result.client
      }
      if (selectedClient.value?.id === id) {
        selectedClient.value = result.client
      }
    } catch (e: unknown) {
      error.value = (e as Error).message || 'Failed to update client'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function removeClient(id: number): Promise<void> {
    loading.value = true
    error.value = null
    try {
      await deleteClient(id)
      clients.value = clients.value.filter((c) => c.id !== id)
      if (selectedClient.value?.id === id) {
        selectedClient.value = null
      }
    } catch (e: unknown) {
      error.value = (e as Error).message || 'Failed to delete client'
      throw e
    } finally {
      loading.value = false
    }
  }

  function setFilter<K extends keyof ClientFilters>(
    key: K,
    value: ClientFilters[K]
  ): void {
    filters.value[key] = value
  }

  function setPage(page: number): void {
    filters.value.page = page
  }

  function selectClient(client: ClientResource | null): void {
    selectedClient.value = client
  }

  function clearError(): void {
    error.value = null
  }

  async function fetchActivity(page = 1, perPage = 20): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const data = await getUserActivity(page, perPage)
      activities.value = data.data
      activityPagination.value = data.meta
    } catch (e: unknown) {
      error.value = (e as Error).message || 'Failed to fetch activity'
    } finally {
      loading.value = false
    }
  }

  function loadMoreActivity(): Promise<void> {
    const nextPage = activityPagination.value.current_page + 1
    if (nextPage > activityPagination.value.last_page) return Promise.resolve()
    return fetchActivity(nextPage)
  }

  return {
    clients,
    selectedClient,
    clientStats,
    activities,
    activityPagination,
    pagination,
    loading,
    error,
    filters,
    filteredClients,
    totalPages,
    currentPage,
    totalClients,
    fetchClients,
    fetchClient,
    fetchClientStats,
    createNewClient,
    updateClientData,
    removeClient,
    setFilter,
    setPage,
    selectClient,
    clearError,
    fetchActivity,
    loadMoreActivity,
  }
})
