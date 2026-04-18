import apiClient from './client'

export interface User {
  id: number
  name: string
  email: string
  role: string
  phone_number?: string
  profile_image_link?: string
  avatar?: string
  created_at: string
  updated_at: string
}

export interface WorkerLoad {
  worker_id: number
  current_projects: number
  max_projects: number
  load_percentage: number
  projects: { id: number; name: string }[]
}

export interface TaskItem {
  id: number
  title: string
  status: string
  assigned_to: number | null
}

export const getUsers = async (params?: { role?: string; search?: string }) => {
  const response = await apiClient.get('/admin/users', { params })
  return response.data.users
}

export const getUsersByProject = async (projectId: number) => {
  const response = await apiClient.get('/admin/users/by-project', { params: { project_id: projectId } })
  return response.data.users
}

export const getUser = async (id: number) => {
  const response = await apiClient.get(`/admin/users/${id}`)
  return response.data.user
}

export const updateUser = async (id: number, data: Partial<User>) => {
  const response = await apiClient.put(`/admin/users/${id}`, data)
  return response.data
}

export const deleteUser = async (id: number) => {
  const response = await apiClient.delete(`/admin/users/${id}`)
  return response.data
}

export const bulkDeleteUsers = async (ids: number[]) => {
  const response = await apiClient.post('/admin/users/bulk-delete', { ids })
  return response.data
}

export const getWorkers = async () => {
  const response = await apiClient.get('/admin/workers')
  return response.data.workers
}

export const getWorkerLoad = async (workerId: number): Promise<WorkerLoad> => {
  const response = await apiClient.get(`/admin/workers/${workerId}/load`)
  return response.data
}

export const getTasksByProject = async (projectId: number): Promise<TaskItem[]> => {
  const response = await apiClient.get(`/tasks/project/${projectId}/list`)
  return response.data.tasks
}

export const assignWorkerToProject = async (projectId: number, workerIds: number[]) => {
  const response = await apiClient.post(`/projects/${projectId}/workers`, { worker_ids: workerIds })
  return response.data
}

export const removeWorkerFromProject = async (projectId: number, workerId: number) => {
  const response = await apiClient.delete(`/projects/${projectId}/workers/${workerId}`)
  return response.data
}

export const createUser = async (data: {
  name: string
  email: string
  password: string
  password_confirmation: string
  role?: string
}) => {
  const response = await apiClient.post('/auth/register', data)
  return response.data
}