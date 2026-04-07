import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  assignTask,
  updateTaskProgress,
  getCalendarTasks,
  getAnalytics,
  getUpcomingTasks,
  getOverdueTasks,
  startTimer,
  stopTimer,
  getTimeLogs,
  getMyTimeLogs,
  getKanbanTasks,
  reorderKanbanTasks,
  type TaskResource,
  type PaginationMeta,
  type TaskFilters,
  type CreateTaskRequest,
  type UpdateTaskRequest,
  type CalendarTaskFilters,
  type AnalyticsFilters,
  type UpcomingTasksFilters,
  type OverdueTasksFilters,
  type CalendarTaskResource,
  type AnalyticsData,
  type TimeLog,
  type KanbanTask,
  type ReorderTaskItem,
  type MyTimeLogFilters,
} from '../api/tasks'

export const useTasksStore = defineStore('tasks', () => {
  // ============================================================
  // State – Task List
  // ============================================================
  const tasks = ref<TaskResource[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const meta = ref<PaginationMeta>({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  })
  const filters = ref<TaskFilters>({
    search: '',
    project_id: undefined,
    status: '',
    priority: '',
    page: 1,
    per_page: 15,
  })

  // ============================================================
  // State – Single Task
  // ============================================================
  const currentTask = ref<TaskResource | null>(null)
  const currentTaskLoading = ref(false)
  const currentTaskError = ref<string | null>(null)

  // ============================================================
  // State – Calendar
  // ============================================================
  const calendarTasks = ref<CalendarTaskResource[]>([])
  const calendarLoading = ref(false)
  const calendarError = ref<string | null>(null)

  // ============================================================
  // State – Analytics
  // ============================================================
  const analyticsData = ref<AnalyticsData | null>(null)
  const analyticsLoading = ref(false)
  const analyticsError = ref<string | null>(null)

  // ============================================================
  // State – Upcoming / Overdue
  // ============================================================
  const upcomingTasks = ref<TaskResource[]>([])
  const upcomingLoading = ref(false)
  const upcomingError = ref<string | null>(null)

  const overdueTasks = ref<TaskResource[]>([])
  const overdueLoading = ref(false)
  const overdueError = ref<string | null>(null)

  // ============================================================
  // State – Time Tracking
  // ============================================================
  const timeLogs = ref<TimeLog[]>([])
  const timeLogsLoading = ref(false)
  const timeLogsError = ref<string | null>(null)

  const myTimeLogs = ref<TimeLog[]>([])
  const myTimeLogsLoading = ref(false)
  const myTimeLogsError = ref<string | null>(null)
  const myTimeLogsMeta = ref<PaginationMeta>({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  })

  // ============================================================
  // State – Kanban
  // ============================================================
  const kanbanTasks = ref<KanbanTask[]>([])
  const kanbanLoading = ref(false)
  const kanbanError = ref<string | null>(null)

  // ============================================================
  // State – Create / Update
  // ============================================================
  const creatingTask = ref(false)
  const creatingTaskError = ref<string | null>(null)
  const updatingTask = ref(false)
  const updatingTaskError = ref<string | null>(null)
  const deletingTask = ref(false)

  // ============================================================
  // Getters
  // ============================================================
  const isLoading = computed(() => loading.value)
  const hasError = computed(() => error.value !== null)
  const paginationMeta = computed(() => meta.value)
  const isEmpty = computed(() => !loading.value && tasks.value.length === 0)
  const hasTasks = computed(() => tasks.value.length > 0)

  const isCurrentTaskLoading = computed(() => currentTaskLoading.value)
  const hasCurrentTaskError = computed(() => currentTaskError.value !== null)

  const isCalendarLoading = computed(() => calendarLoading.value)
  const isAnalyticsLoading = computed(() => analyticsLoading.value)
  const isUpcomingLoading = computed(() => upcomingLoading.value)
  const isOverdueLoading = computed(() => overdueLoading.value)

  // ============================================================
  // Actions – Task List
  // ============================================================
  async function fetchTasks(newFilters?: TaskFilters) {
    loading.value = true
    error.value = null

    try {
      if (newFilters) {
        filters.value = { ...filters.value, ...newFilters }
      }

      const response = await getTasks(filters.value)
      tasks.value = response.tasks
      meta.value = response.meta
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } }; message?: string }
      error.value = axiosError.response?.data?.message || 'Failed to fetch tasks'
      tasks.value = []
    } finally {
      loading.value = false
    }
  }

  function resetFilters() {
    filters.value = {
      search: '',
      project_id: undefined,
      status: '',
      priority: '',
      page: 1,
      per_page: 15,
    }
  }

  function setPage(page: number) {
    filters.value.page = page
  }

  function setPerPage(perPage: number) {
    filters.value.per_page = perPage
    filters.value.page = 1
  }

  // ============================================================
  // Actions – Single Task
  // ============================================================
  async function fetchTaskById(id: number) {
    currentTaskLoading.value = true
    currentTaskError.value = null

    try {
      const response = await getTask(id)
      currentTask.value = response.task
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } }; message?: string }
      currentTaskError.value = axiosError.response?.data?.message || 'Failed to fetch task'
    } finally {
      currentTaskLoading.value = false
    }
  }

  function clearCurrentTask() {
    currentTask.value = null
    currentTaskError.value = null
  }

  // ============================================================
  // Actions – Create Task
  // ============================================================
  async function createTaskAction(taskData: CreateTaskRequest): Promise<TaskResource | null> {
    creatingTask.value = true
    creatingTaskError.value = null

    try {
      const response = await createTask(taskData)
      // Refresh task list
      await fetchTasks()
      return response.task
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } }; message?: string }
      creatingTaskError.value = axiosError.response?.data?.message || 'Failed to create task'
      return null
    } finally {
      creatingTask.value = false
    }
  }

  // ============================================================
  // Actions – Update Task
  // ============================================================
  async function updateTaskAction(id: number, taskData: UpdateTaskRequest): Promise<TaskResource | null> {
    updatingTask.value = true
    updatingTaskError.value = null

    try {
      const response = await updateTask(id, taskData)
      // Update current task if it matches
      if (currentTask.value && currentTask.value.id === id) {
        currentTask.value = response.task
      }
      // Refresh task list
      await fetchTasks()
      return response.task
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } }; message?: string }
      updatingTaskError.value = axiosError.response?.data?.message || 'Failed to update task'
      return null
    } finally {
      updatingTask.value = false
    }
  }

  // ============================================================
  // Actions – Delete Task
  // ============================================================
  async function deleteTaskAction(id: number): Promise<boolean> {
    deletingTask.value = true
    error.value = null

    try {
      await deleteTask(id)
      // Remove from local list
      tasks.value = tasks.value.filter((t) => t.id !== id)
      if (currentTask.value && currentTask.value.id === id) {
        clearCurrentTask()
      }
      return true
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } }; message?: string }
      error.value = axiosError.response?.data?.message || 'Failed to delete task'
      return false
    } finally {
      deletingTask.value = false
    }
  }

  // ============================================================
  // Actions – Assign Task
  // ============================================================
  async function assignTaskAction(id: number, workerId: number): Promise<TaskResource | null> {
    try {
      const response = await assignTask(id, workerId)
      // Update current task if it matches
      if (currentTask.value && currentTask.value.id === id) {
        currentTask.value = response.task
      }
      return response.task
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } }; message?: string }
      error.value = axiosError.response?.data?.message || 'Failed to assign task'
      return null
    }
  }

  // ============================================================
  // Actions – Update Progress
  // ============================================================
  async function updateProgressAction(id: number, progress: number): Promise<TaskResource | null> {
    try {
      const response = await updateTaskProgress(id, progress)
      // Update current task if it matches
      if (currentTask.value && currentTask.value.id === id) {
        currentTask.value = response.task
      }
      return response.task
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } }; message?: string }
      error.value = axiosError.response?.data?.message || 'Failed to update progress'
      return null
    }
  }

  // ============================================================
  // Actions – Calendar
  // ============================================================
  async function fetchCalendarTasks(calendarFilters: CalendarTaskFilters = {}) {
    calendarLoading.value = true
    calendarError.value = null

    try {
      const response = await getCalendarTasks(calendarFilters)
      calendarTasks.value = response.tasks
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } }; message?: string }
      calendarError.value = axiosError.response?.data?.message || 'Failed to fetch calendar tasks'
      calendarTasks.value = []
    } finally {
      calendarLoading.value = false
    }
  }

  // ============================================================
  // Actions – Analytics
  // ============================================================
  async function fetchAnalytics(analyticsFilters: AnalyticsFilters = {}) {
    analyticsLoading.value = true
    analyticsError.value = null

    try {
      const data = await getAnalytics(analyticsFilters)
      analyticsData.value = data
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } }; message?: string }
      analyticsError.value = axiosError.response?.data?.message || 'Failed to fetch analytics'
      analyticsData.value = null
    } finally {
      analyticsLoading.value = false
    }
  }

  // ============================================================
  // Actions – Upcoming Tasks
  // ============================================================
  async function fetchUpcomingTasks(upcomingFilters: UpcomingTasksFilters = {}) {
    upcomingLoading.value = true
    upcomingError.value = null

    try {
      const response = await getUpcomingTasks(upcomingFilters)
      upcomingTasks.value = response.tasks
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } }; message?: string }
      upcomingError.value = axiosError.response?.data?.message || 'Failed to fetch upcoming tasks'
      upcomingTasks.value = []
    } finally {
      upcomingLoading.value = false
    }
  }

  // ============================================================
  // Actions – Overdue Tasks
  // ============================================================
  async function fetchOverdueTasks(overdueFilters: OverdueTasksFilters = {}) {
    overdueLoading.value = true
    overdueError.value = null

    try {
      const response = await getOverdueTasks(overdueFilters)
      overdueTasks.value = response.tasks
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } }; message?: string }
      overdueError.value = axiosError.response?.data?.message || 'Failed to fetch overdue tasks'
      overdueTasks.value = []
    } finally {
      overdueLoading.value = false
    }
  }

  // ============================================================
  // Actions – Time Tracking
  // ============================================================
  async function startTimerAction(taskId: number): Promise<TimeLog | null> {
    try {
      const response = await startTimer(taskId)
      return response.time_log
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } }; message?: string }
      error.value = axiosError.response?.data?.message || 'Failed to start timer'
      return null
    }
  }

  async function stopTimerAction(taskId: number): Promise<TimeLog | null> {
    try {
      const response = await stopTimer(taskId)
      return response.time_log
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } }; message?: string }
      error.value = axiosError.response?.data?.message || 'Failed to stop timer'
      return null
    }
  }

  async function fetchTimeLogs(taskId: number) {
    timeLogsLoading.value = true
    timeLogsError.value = null

    try {
      const response = await getTimeLogs(taskId)
      timeLogs.value = response.time_logs
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } }; message?: string }
      timeLogsError.value = axiosError.response?.data?.message || 'Failed to fetch time logs'
      timeLogs.value = []
    } finally {
      timeLogsLoading.value = false
    }
  }

  async function fetchMyTimeLogs(myFilters: MyTimeLogFilters = {}) {
    myTimeLogsLoading.value = true
    myTimeLogsError.value = null

    try {
      const response = await getMyTimeLogs(myFilters)
      myTimeLogs.value = response.time_logs
      myTimeLogsMeta.value = response.meta
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } }; message?: string }
      myTimeLogsError.value = axiosError.response?.data?.message || 'Failed to fetch my time logs'
      myTimeLogs.value = []
    } finally {
      myTimeLogsLoading.value = false
    }
  }

  // ============================================================
  // Actions – Kanban
  // ============================================================
  async function fetchKanbanTasks(projectId: number) {
    kanbanLoading.value = true
    kanbanError.value = null

    try {
      const response = await getKanbanTasks(projectId)
      kanbanTasks.value = response.tasks
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } }; message?: string }
      kanbanError.value = axiosError.response?.data?.message || 'Failed to fetch Kanban tasks'
      kanbanTasks.value = []
    } finally {
      kanbanLoading.value = false
    }
  }

  async function reorderKanbanTasksAction(projectId: number, taskOrder: ReorderTaskItem[]): Promise<boolean> {
    try {
      await reorderKanbanTasks(projectId, taskOrder)
      return true
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } }; message?: string }
      error.value = axiosError.response?.data?.message || 'Failed to reorder tasks'
      return false
    }
  }

  // ============================================================
  // Return
  // ============================================================
  return {
    // State – Task List
    tasks,
    loading,
    error,
    meta,
    filters,
    isLoading,
    hasError,
    paginationMeta,
    isEmpty,
    hasTasks,
    fetchTasks,
    resetFilters,
    setPage,
    setPerPage,

    // State – Single Task
    currentTask,
    currentTaskLoading,
    currentTaskError,
    isCurrentTaskLoading,
    hasCurrentTaskError,
    fetchTaskById,
    clearCurrentTask,

    // State – Create / Update / Delete
    creatingTask,
    creatingTaskError,
    updatingTask,
    updatingTaskError,
    deletingTask,
    createTaskAction,
    updateTaskAction,
    deleteTaskAction,

    // State – Assign / Progress
    assignTaskAction,
    updateProgressAction,

    // State – Calendar
    calendarTasks,
    calendarLoading,
    calendarError,
    isCalendarLoading,
    fetchCalendarTasks,

    // State – Analytics
    analyticsData,
    analyticsLoading,
    analyticsError,
    isAnalyticsLoading,
    fetchAnalytics,

    // State – Upcoming / Overdue
    upcomingTasks,
    upcomingLoading,
    upcomingError,
    isUpcomingLoading,
    fetchUpcomingTasks,

    overdueTasks,
    overdueLoading,
    overdueError,
    isOverdueLoading,
    fetchOverdueTasks,

    // State – Time Tracking
    timeLogs,
    timeLogsLoading,
    timeLogsError,
    startTimerAction,
    stopTimerAction,
    fetchTimeLogs,

    myTimeLogs,
    myTimeLogsLoading,
    myTimeLogsError,
    myTimeLogsMeta,
    fetchMyTimeLogs,

    // State – Kanban
    kanbanTasks,
    kanbanLoading,
    kanbanError,
    fetchKanbanTasks,
    reorderKanbanTasksAction,
  }
})
