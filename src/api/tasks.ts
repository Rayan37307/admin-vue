import apiClient from './client'

// ============================================================
// Types matching backend TaskResource
// ============================================================

export interface AssignedWorker {
  id: number
  name: string
  email: string
  avatar: string | null
}

export interface TaskProject {
  id: number
  name: string
}

export interface TaskFile {
  id: number
  name: string
  size: string
  url: string
  mime_type: string
  uploaded_at: string | null
}

export interface TaskCreator {
  id: number
  name: string
}

export interface TaskResource {
  id: number
  title: string
  description: string | null
  status: 'todo' | 'in_progress' | 'review' | 'completed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  progress: number
  deadline: string | null
  estimated_hours: number | null
  position: number
  formatted_tracked_time: string
  created_at: string | null
  updated_at: string | null
  project: TaskProject | null
  assigned_worker: AssignedWorker | null
  creator: TaskCreator | null
  files: TaskFile[]
}

export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface TasksResponse {
  tasks: TaskResource[]
  meta: PaginationMeta
}

export interface TaskFilters {
  search?: string
  project_id?: number
  status?: string
  priority?: string
  page?: number
  per_page?: number
}

// ============================================================
// Request / Response types for new endpoints
// ============================================================

export interface CreateTaskRequest {
  title: string
  description?: string
  project_id?: number
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  status?: 'todo' | 'in_progress' | 'review' | 'completed'
  deadline?: string
  estimated_hours?: number
  assigned_to?: number
}

export interface UpdateTaskRequest {
  title?: string
  description?: string
  project_id?: number
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  status?: 'todo' | 'in_progress' | 'review' | 'completed'
  deadline?: string
  estimated_hours?: number
  assigned_to?: number
  progress?: number
}

export interface AssignTaskRequest {
  worker_id: number
}

export interface UpdateProgressRequest {
  progress: number
}

export interface CalendarTaskFilters {
  project_id?: number
  user_id?: number
  start?: string
  end?: string
}

export interface AnalyticsFilters {
  project_id?: number
  user_id?: number
  period?: 'weekly' | 'monthly' | 'all'
}

export interface UpcomingTasksFilters {
  user_id?: number
  days?: number
}

export interface OverdueTasksFilters {
  user_id?: number
}

export interface CalendarTaskResource {
  id: number
  title: string
  deadline: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'todo' | 'in_progress' | 'review' | 'completed'
  assigned_worker: AssignedWorker | null
  project: TaskProject | null
}

export interface AnalyticsData {
  total_tasks: number
  completed_tasks: number
  overdue_count: number
  pending_tasks: number
  in_progress_tasks: number
  review_tasks: number
  completion_rate: number
  by_status: Record<string, number>
  by_priority: Record<string, number>
  weekly_data: number[]
  top_contributors: {
    id: number
    name: string
    role: string
    avatar: string | null
    tasks_completed: number
  }[]
  category_distribution: {
    name: string
    tasks: number
    percentage: number
  }[]
}

export interface TimeLog {
  id: number
  task_id: number
  user_id: number
  user_name: string
  started_at: string
  stopped_at: string | null
  duration_seconds: number | null
  formatted_duration: string
}

export interface KanbanTask {
  id: number
  title: string
  status: 'todo' | 'in_progress' | 'review' | 'completed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assigned_worker: AssignedWorker | null
  position: number
}

export interface ReorderTaskItem {
  task_id: number
  position: number
}

// ============================================================
// API Functions – Task CRUD
// ============================================================

/**
 * Fetch tasks from the API with optional filters
 */
export async function getTasks(filters: TaskFilters = {}): Promise<TasksResponse> {
  const params: Record<string, string | number | undefined> = {
    search: filters.search || undefined,
    project_id: filters.project_id || undefined,
    status: filters.status || undefined,
    priority: filters.priority || undefined,
    page: filters.page || undefined,
    per_page: filters.per_page || 15,
  }

  // Remove undefined values
  Object.keys(params).forEach((key) => {
    if (params[key] === undefined) {
      delete params[key]
    }
  })

  const response = await apiClient.get<TasksResponse>('/tasks', { params })
  return response.data
}

/**
 * Fetch a single task by ID
 */
export async function getTask(id: number): Promise<{ task: TaskResource }> {
  const response = await apiClient.get<{ task: TaskResource }>(`/tasks/${id}`)
  return response.data
}

/**
 * Create a new task
 */
export async function createTask(data: CreateTaskRequest): Promise<{ task: TaskResource }> {
  const response = await apiClient.post<{ task: TaskResource }>('/tasks', data)
  return response.data
}

/**
 * Update an existing task
 */
export async function updateTask(
  id: number,
  data: UpdateTaskRequest
): Promise<{ task: TaskResource }> {
  const response = await apiClient.put<{ task: TaskResource }>(`/tasks/${id}`, data)
  return response.data
}

/**
 * Delete a task
 */
export async function deleteTask(id: number): Promise<{ message: string }> {
  const response = await apiClient.delete<{ message: string }>(`/tasks/${id}`)
  return response.data
}

/**
 * Assign a task to a worker
 */
export async function assignTask(
  id: number,
  workerId: number
): Promise<{ task: TaskResource }> {
  const response = await apiClient.post<{ task: TaskResource }>(`/tasks/${id}/assign`, {
    worker_id: workerId,
  })
  return response.data
}

/**
 * Update task progress (0-100)
 */
export async function updateTaskProgress(
  id: number,
  progress: number
): Promise<{ task: TaskResource }> {
  const response = await apiClient.post<{ task: TaskResource }>(`/tasks/${id}/progress`, {
    progress,
  })
  return response.data
}

// ============================================================
// API Functions – Calendar & Analytics
// ============================================================

/**
 * Fetch calendar tasks within a date range
 */
export async function getCalendarTasks(
  filters: CalendarTaskFilters = {}
): Promise<{ tasks: CalendarTaskResource[] }> {
  const params: Record<string, string | number | undefined> = {
    project_id: filters.project_id || undefined,
    user_id: filters.user_id || undefined,
    start: filters.start || undefined,
    end: filters.end || undefined,
  }

  Object.keys(params).forEach((key) => {
    if (params[key] === undefined) {
      delete params[key]
    }
  })

  const response = await apiClient.get<{ tasks: CalendarTaskResource[] }>('/tasks/calendar', {
    params,
  })
  return response.data
}

/**
 * Fetch task analytics data
 */
export async function getAnalytics(
  filters: AnalyticsFilters = {}
): Promise<AnalyticsData> {
  const params: Record<string, string | number | undefined> = {
    project_id: filters.project_id || undefined,
    user_id: filters.user_id || undefined,
    period: filters.period || undefined,
  }

  Object.keys(params).forEach((key) => {
    if (params[key] === undefined) {
      delete params[key]
    }
  })

  const response = await apiClient.get<AnalyticsData>('/tasks/analytics', { params })
  return response.data
}

/**
 * Fetch upcoming tasks
 */
export async function getUpcomingTasks(
  filters: UpcomingTasksFilters = {}
): Promise<{ tasks: TaskResource[] }> {
  const params: Record<string, string | number | undefined> = {
    user_id: filters.user_id || undefined,
    days: filters.days || undefined,
  }

  Object.keys(params).forEach((key) => {
    if (params[key] === undefined) {
      delete params[key]
    }
  })

  const response = await apiClient.get<{ tasks: TaskResource[] }>('/tasks/upcoming', { params })
  return response.data
}

/**
 * Fetch overdue tasks
 */
export async function getOverdueTasks(
  filters: OverdueTasksFilters = {}
): Promise<{ tasks: TaskResource[] }> {
  const params: Record<string, string | number | undefined> = {
    user_id: filters.user_id || undefined,
  }

  Object.keys(params).forEach((key) => {
    if (params[key] === undefined) {
      delete params[key]
    }
  })

  const response = await apiClient.get<{ tasks: TaskResource[] }>('/tasks/overdue', { params })
  return response.data
}

// ============================================================
// API Functions – Time Tracking
// ============================================================

/**
 * Start timer on a task
 */
export async function startTimer(
  taskId: number
): Promise<{ message: string; time_log: TimeLog }> {
  const response = await apiClient.post<{ message: string; time_log: TimeLog }>(
    `/tasks/${taskId}/start-timer`
  )
  return response.data
}

/**
 * Stop timer on a task
 */
export async function stopTimer(
  taskId: number
): Promise<{ message: string; time_log: TimeLog }> {
  const response = await apiClient.post<{ message: string; time_log: TimeLog }>(
    `/tasks/${taskId}/stop-timer`
  )
  return response.data
}

/**
 * Get time logs for a task
 */
export async function getTimeLogs(
  taskId: number
): Promise<{ time_logs: TimeLog[] }> {
  const response = await apiClient.get<{ time_logs: TimeLog[] }>(`/tasks/${taskId}/time-logs`)
  return response.data
}

/**
 * Get current user's time logs
 */
export interface MyTimeLogFilters {
  page?: number
  per_page?: number
}

export async function getMyTimeLogs(
  filters: MyTimeLogFilters = {}
): Promise<{ time_logs: TimeLog[]; meta: PaginationMeta }> {
  const params: Record<string, string | number | undefined> = {
    page: filters.page || undefined,
    per_page: filters.per_page || undefined,
  }

  Object.keys(params).forEach((key) => {
    if (params[key] === undefined) {
      delete params[key]
    }
  })

  const response = await apiClient.get<{ time_logs: TimeLog[]; meta: PaginationMeta }>(
    '/time-tracking/my-logs',
    { params }
  )
  return response.data
}

// ============================================================
// API Functions – Kanban
// ============================================================

/**
 * Get Kanban board tasks for a project
 */
export async function getKanbanTasks(
  projectId: number
): Promise<{ tasks: KanbanTask[] }> {
  const response = await apiClient.get<{ tasks: KanbanTask[] }>(
    `/projects/${projectId}/tasks/kanban`
  )
  return response.data
}

/**
 * Reorder tasks on Kanban board
 */
export async function reorderKanbanTasks(
  projectId: number,
  taskOrder: ReorderTaskItem[]
): Promise<{ message: string }> {
  const response = await apiClient.post<{ message: string }>(
    `/projects/${projectId}/tasks/reorder`,
    { task_order: taskOrder }
  )
  return response.data
}

// ============================================================
// Utility helpers
// ============================================================

/**
 * Map backend status to display label
 */
export function mapStatusToDisplay(status: TaskResource['status']): string {
  const statusMap: Record<TaskResource['status'], string> = {
    todo: 'To Do',
    in_progress: 'In Progress',
    review: 'In Review',
    completed: 'Completed',
  }
  return statusMap[status]
}

/**
 * Map backend priority to display label
 */
export function mapPriorityToDisplay(priority: TaskResource['priority']): string {
  const priorityMap: Record<TaskResource['priority'], string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    urgent: 'Urgent',
  }
  return priorityMap[priority]
}

/**
 * Format a date string (YYYY-MM-DD) to a human-readable format
 */
export function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'No deadline'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/**
 * Format a date to month-year (e.g. "October 2024")
 */
export function formatMonthYear(dateStr: string | null): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })
}
