<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useTasksStore } from '../../stores/tasks'

const router = useRouter()
const tasksStore = useTasksStore()

// Filter state
const searchQuery = ref('')
const selectedProject = ref('All Projects')
const selectedStatus = ref('Any Status')
const selectedPriority = ref('Priority')

// Filter options (kept static for now, can be fetched from API later)
const projects = ['All Projects', 'Obsidian UI', 'Nike Campaign', 'Tesla Rebrand']
const statuses = ['Any Status', 'Pending', 'In Progress', 'In Review', 'Completed']
const priorities = ['Priority', 'Urgent', 'High', 'Medium', 'Low']

// Map backend status to display status
const statusDisplayMap: Record<string, string> = {
  todo: 'Pending',
  in_progress: 'In Progress',
  review: 'In Review',
  completed: 'Completed',
}

// Map backend priority to display priority
const priorityDisplayMap: Record<string, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
}

// Map display status back to API status
const statusApiMap: Record<string, string> = {
  'Pending': 'todo',
  'In Progress': 'in_progress',
  'In Review': 'review',
  'Completed': 'completed',
}

// Format date from "2023-10-24" to "Oct 24, 2023"
function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'No deadline'
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })
}

// Computed: mapped tasks for display
const displayTasks = computed(() => {
  return tasksStore.tasks.map((task) => ({
    id: task.id,
    name: task.title,
    project: task.project?.name || 'Unassigned',
    assignees: task.assigned_worker?.avatar
      ? [task.assigned_worker.avatar]
      : [],
    status: statusDisplayMap[task.status] || task.status,
    priority: priorityDisplayMap[task.priority] || task.priority,
    dueDate: formatDate(task.deadline),
  }))
})

// Status and priority CSS classes (kept from original)
const getStatusClass = (status: string) => {
  switch (status) {
    case 'In Progress': return 'bg-secondary-container/30 text-secondary'
    case 'Pending': return 'bg-tertiary-container/20 text-tertiary'
    case 'In Review': return 'bg-secondary-container/30 text-secondary'
    case 'Completed': return 'bg-primary-container/20 text-primary'
    default: return 'bg-surface-container-highest text-outline'
  }
}

const getPriorityClass = (priority: string) => {
  switch (priority) {
    case 'Urgent': return 'bg-error-container/20 text-error'
    case 'High': return 'bg-error-container/20 text-error'
    case 'Medium': return 'bg-tertiary-container/20 text-tertiary'
    case 'Low': return 'bg-surface-container-highest text-outline'
    default: return 'bg-surface-container-highest text-outline'
  }
}

// Build API filters from UI state
function buildApiFilters() {
  const filters: Record<string, any> = {}

  if (searchQuery.value) {
    filters.search = searchQuery.value
  }

  if (selectedProject.value !== 'All Projects') {
    // Map project name to ID (for now, using a simple map)
    const projectMap: Record<string, number> = {
      'Obsidian UI': 1,
      'Nike Campaign': 2,
      'Tesla Rebrand': 3,
    }
    if (projectMap[selectedProject.value]) {
      filters.project_id = projectMap[selectedProject.value]
    }
  }

  if (selectedStatus.value !== 'Any Status') {
    filters.status = statusApiMap[selectedStatus.value]
  }

  if (selectedPriority.value !== 'Priority') {
    const priorityApiMap: Record<string, string> = {
      'Urgent': 'urgent',
      'High': 'high',
      'Medium': 'medium',
      'Low': 'low',
    }
    filters.priority = priorityApiMap[selectedPriority.value]
  }

  return filters
}

// Fetch tasks with current filters
function fetchTasks(page?: number) {
  const filters = buildApiFilters()
  if (page !== undefined) {
    filters.page = page
  }
  tasksStore.fetchTasks(filters)
}

// Pagination helpers
const currentPage = computed(() => tasksStore.meta.current_page)
const lastPage = computed(() => tasksStore.meta.last_page)
const totalTasks = computed(() => tasksStore.meta.total)
const perPage = computed(() => tasksStore.meta.per_page)

const startRange = computed(() => {
  if (totalTasks.value === 0) return 0
  return (currentPage.value - 1) * perPage.value + 1
})
const endRange = computed(() => {
  return Math.min(currentPage.value * perPage.value, totalTasks.value)
})

// Generate page numbers for pagination
const pageNumbers = computed(() => {
  const pages: number[] = []
  const total = lastPage.value
  const current = currentPage.value

  // Show max 5 page numbers
  let start = Math.max(1, current - 2)
  let end = Math.min(total, start + 4)
  start = Math.max(1, end - 4)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// Debounced search
let searchTimeout: ReturnType<typeof setTimeout> | null = null
watch(searchQuery, () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchTasks(1)
  }, 400)
})

// Fetch on filter change
watch([selectedProject, selectedStatus, selectedPriority], () => {
  fetchTasks(1)
})

// Navigate to task details
function navigateToTask(taskId: number) {
  router.push({ name: 'TaskDetails', query: { id: taskId } })
}

// Initial fetch
onMounted(() => {
  fetchTasks(1)
})
</script>

<template>
  <main class="min-h-screen bg-surface p-8">
    <header class="mb-12">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span class="text-primary font-label text-[0.6875rem] font-bold tracking-[0.05em] uppercase block mb-2">Workspace</span>
          <h1 class="font-headline text-5xl md:text-6xl font-light tracking-[-0.02em] text-on-surface">Active Tasks</h1>
        </div>
        <div class="flex items-center gap-3">
          <div class="flex -space-x-3">
            <img alt="Team Member Avatar A" class="h-10 w-10 rounded-full border-2 border-surface" src="https://lh3.googleusercontent.com/AB6AXuAMIyZdNi46gnd1B2U14qqmiCkTMBdQfO-pjnlSkn_fd3pOKMkcYs5MtPRa5JEYFLxgUHwH1vt1zKa8FcWI6Z6lqySMTu4QtcqCJ_KregM7qgzcJ8tNVFvC9BYp0oKl0-R7mmu_sc5EIabe4Mns6U8FHUS-MnzzpIIyML593qgEFgeK2So0UrWTUqC33FKfzTQta6K0ukNbi-QeF1x3o7QcyKous3lzVQGCySqSmfN_vSrFbB-g7T0vu5P3U7ek-_1WXFUtAUox_PM" />
            <img alt="Team Member Avatar B" class="h-10 w-10 rounded-full border-2 border-surface" src="https://lh3.googleusercontent.com/AB6AXuBvpIT1Q854JCqc5JU0af0QgUhffpdadD24H96htAWIi_uzaAUhuWX67bb6Tddsdhg_WqCAsKST5ZYEwFRxQ44SPo3n_u4NRmiJuAUva9X7rowY5FFRbTsR0yqgMMxj0wWiu9jUgAzWv2RKoOKffBtVPc2E0U7iPS1ktPNYEzTRKkhhfqwUu_YFw5DTzqNF9YthCW3R0oexTtBe7i4dIQ_q244DMOd5XI_dqGwjhP58GGfmuRe_IJrUA_6svYbE-zq3aF_e_TKD6Fg" />
            <img alt="Team Member Avatar C" class="h-10 w-10 rounded-full border-2 border-surface" src="https://lh3.googleusercontent.com/AB6AXuDrxhXpDER4mhQXIokvZHAirY8h6nM7UgDanxo_r3wzQRUboteWc8HW6UPccGCt2yo8dtO3DdsCT0-vBQv2joHC7FZnfwphpBEYks2U6EvkZtBbjcY6DXsB-ZMJMnhvzIGN76dmwuMeKWzAl0m8kARs8ielIh1UEDM-I1qtHtqM3RL8eopNnEJLYjsUxg-Edruh1svcO12BqXPcrYGXhJQi96WIKvfNXTfzwGHBF0y-fl8WuyF_3jpOvSgdBBeKWBdXOj-OmKYMx-M" />
            <div class="h-10 w-10 rounded-full bg-surface-container-high border-2 border-surface flex items-center justify-center text-xs font-bold text-on-surface-variant">+4</div>
          </div>
        </div>
      </div>
    </header>

    <section class="sticky top-[0.5rem] z-30 bg-surface/95 backdrop-blur-md mb-8 py-4 rounded-xl">
      <div class="bg-surface-container-low p-4 rounded-xl shadow-lg flex flex-wrap items-center gap-4 border border-outline-variant/10">
        <div class="relative flex-grow min-w-[240px]">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
          <input
            v-model="searchQuery"
            class="w-full bg-surface-container border-none rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/50 text-on-surface placeholder:text-outline/50"
            placeholder="Search task names..."
            type="text"
            name="search_tasks"
          />
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <select
            v-model="selectedProject"
            class="bg-surface-container-high border-none rounded-lg px-4 py-2.5 text-sm font-medium text-on-surface focus:ring-2 focus:ring-primary/50 appearance-none min-w-[140px]"
          >
            <option v-for="project in projects" :key="project">{{ project }}</option>
          </select>
          <select
            v-model="selectedStatus"
            class="bg-surface-container-high border-none rounded-lg px-4 py-2.5 text-sm font-medium text-on-surface focus:ring-2 focus:ring-primary/50 appearance-none min-w-[140px]"
          >
            <option v-for="status in statuses" :key="status">{{ status }}</option>
          </select>
          <select
            v-model="selectedPriority"
            class="bg-surface-container-high border-none rounded-lg px-4 py-2.5 text-sm font-medium text-on-surface focus:ring-2 focus:ring-primary/50 appearance-none min-w-[140px]"
          >
            <option v-for="priority in priorities" :key="priority">{{ priority }}</option>
          </select>
        </div>
        <div class="h-8 w-[1px] bg-outline-variant/20 mx-2"></div>
        <button class="bg-primary-container text-on-primary-fixed-variant px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all">
          <span class="material-symbols-outlined text-sm">add</span>
          Add New Task
        </button>
      </div>
    </section>

    <div class="mb-4 flex items-center justify-between px-2">
      <div class="flex items-center gap-4">
        <input id="select-all-tasks" class="rounded bg-surface-container border-outline-variant/30 text-primary focus:ring-primary h-5 w-5" type="checkbox" />
        <label for="select-all-tasks" class="text-sm text-outline font-medium">Select All Tasks</label>
      </div>
      <div class="flex items-center gap-2">
        <button class="text-xs font-bold text-outline uppercase tracking-wider hover:text-on-surface px-3 py-1 transition-colors">Bulk Archive</button>
        <button class="text-xs font-bold text-error uppercase tracking-wider hover:brightness-110 px-3 py-1 transition-colors">Bulk Delete</button>
      </div>
    </div>

    <div class="bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant/5 shadow-2xl">
      <div class="overflow-x-auto no-scrollbar">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-high/50 text-[0.6875rem] uppercase tracking-widest font-bold text-outline">
              <th class="px-6 py-4 w-12"></th>
              <th class="px-6 py-4">Task Details</th>
              <th class="px-6 py-4">Assigned</th>
              <th class="px-6 py-4">Status</th>
              <th class="px-6 py-4">Priority</th>
              <th class="px-6 py-4">Due Date</th>
              <th class="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant/5">
            <!-- Loading state -->
            <tr v-if="tasksStore.isLoading">
              <td colspan="7" class="px-6 py-16 text-center">
                <div class="flex flex-col items-center gap-3">
                  <div class="animate-spin h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full"></div>
                  <span class="text-sm text-outline">Loading tasks...</span>
                </div>
              </td>
            </tr>

            <!-- Empty state -->
            <tr v-else-if="displayTasks.length === 0">
              <td colspan="7" class="px-6 py-16 text-center">
                <div class="flex flex-col items-center gap-3">
                  <span class="material-symbols-outlined text-4xl text-outline/40">task_alt</span>
                  <span class="text-sm text-outline">No tasks found</span>
                  <span class="text-xs text-outline/60">Try adjusting your filters or add a new task</span>
                </div>
              </td>
            </tr>

            <!-- Task rows -->
            <tr
              v-for="task in displayTasks"
              v-else
              :key="task.id"
              class="group hover:bg-surface-bright/30 transition-colors cursor-pointer"
              @click="navigateToTask(task.id)"
            >
              <td class="px-6 py-5" @click.stop>
                <input :id="`task-${task.id}`" class="rounded bg-surface-container border-outline-variant/30 text-primary focus:ring-primary h-4 w-4" type="checkbox" />
              </td>
              <td class="px-6 py-5">
                <div class="flex flex-col">
                  <span class="text-on-surface font-semibold text-sm group-hover:text-primary transition-colors">{{ task.name }}</span>
                  <span class="text-xs text-outline hover:underline">{{ task.project }}</span>
                </div>
              </td>
              <td class="px-6 py-5">
                <div v-if="task.assignees.length > 0" class="flex -space-x-2">
                  <img v-for="(avatar, idx) in task.assignees" :key="idx" alt="Assignee avatar" class="h-7 w-7 rounded-full border border-surface shadow-sm" :src="avatar" />
                </div>
                <div v-else class="flex -space-x-2">
                  <div class="h-7 w-7 rounded-full bg-surface-container-high border border-surface shadow-sm flex items-center justify-center text-[8px] font-bold text-outline">?</div>
                </div>
              </td>
              <td class="px-6 py-5">
                <span :class="['inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider', getStatusClass(task.status)]">
                  <span class="h-1.5 w-1.5 rounded-full bg-current"></span>
                  {{ task.status }}
                </span>
              </td>
              <td class="px-6 py-5">
                <span :class="['inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider', getPriorityClass(task.priority)]">
                  {{ task.priority }}
                </span>
              </td>
              <td class="px-6 py-5">
                <span class="text-sm text-on-surface-variant">{{ task.dueDate }}</span>
              </td>
              <td class="px-6 py-5 text-right">
                <div class="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button class="p-2 text-outline hover:text-primary transition-colors">
                    <span class="material-symbols-outlined text-lg">edit</span>
                  </button>
                  <button class="p-2 text-outline hover:text-on-surface transition-colors">
                    <span class="material-symbols-outlined text-lg">more_vert</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination footer -->
      <div class="px-6 py-4 bg-surface-container-high/20 border-t border-outline-variant/5 flex items-center justify-between">
        <span class="text-xs text-outline font-medium">
          Showing {{ startRange }} to {{ endRange }} of {{ totalTasks }} tasks
        </span>
        <div class="flex items-center gap-1">
          <button
            class="p-1.5 rounded-lg hover:bg-surface-container-highest text-outline disabled:opacity-30"
            :disabled="currentPage <= 1"
            @click="fetchTasks(currentPage - 1)"
          >
            <span class="material-symbols-outlined text-sm">chevron_left</span>
          </button>
          <button
            v-for="page in pageNumbers"
            :key="page"
            :class="[
              'h-8 w-8 rounded-lg font-medium text-xs transition-colors',
              page === currentPage
                ? 'bg-primary/20 text-primary font-bold'
                : 'hover:bg-surface-container-highest text-outline'
            ]"
            @click="fetchTasks(page)"
          >
            {{ page }}
          </button>
          <button
            class="p-1.5 rounded-lg hover:bg-surface-container-highest text-outline disabled:opacity-30"
            :disabled="currentPage >= lastPage"
            @click="fetchTasks(currentPage + 1)"
          >
            <span class="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      </div>
    </div>

    <section class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-surface-container-low p-6 rounded-xl border-l-2 border-primary">
        <p class="font-label text-[0.6875rem] font-bold text-outline tracking-wider uppercase mb-1">Weekly Velocity</p>
        <div class="flex items-end gap-3">
          <span class="text-3xl font-headline font-semibold text-on-surface">18</span>
          <span class="text-xs text-primary pb-1">+12% from last week</span>
        </div>
        <div class="mt-4 w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
          <div class="h-full bg-primary w-[65%] shadow-[0_0_8px_rgba(192,193,255,0.4)]"></div>
        </div>
      </div>
      <div class="bg-surface-container-low p-6 rounded-xl border-l-2 border-tertiary">
        <p class="font-label text-[0.6875rem] font-bold text-outline tracking-wider uppercase mb-1">Overdue Items</p>
        <div class="flex items-end gap-3">
          <span class="text-3xl font-headline font-semibold text-on-surface">04</span>
          <span class="text-xs text-tertiary pb-1">Requires Attention</span>
        </div>
        <div class="mt-4 flex gap-1">
          <div class="flex-grow h-1 bg-tertiary rounded-full"></div>
          <div class="flex-grow h-1 bg-tertiary rounded-full"></div>
          <div class="flex-grow h-1 bg-tertiary rounded-full"></div>
          <div class="flex-grow h-1 bg-tertiary rounded-full"></div>
          <div class="flex-grow h-1 bg-surface-container-highest rounded-full"></div>
        </div>
      </div>
      <div class="bg-surface-container-low p-6 rounded-xl border-l-2 border-primary-container">
        <p class="font-label text-[0.6875rem] font-bold text-outline tracking-wider uppercase mb-1">Resource Load</p>
        <div class="flex items-end gap-3">
          <span class="text-3xl font-headline font-semibold text-on-surface">92%</span>
          <span class="text-xs text-primary-container pb-1">Near Capacity</span>
        </div>
        <div class="mt-4 flex -space-x-1.5">
          <div class="h-6 w-6 rounded-full bg-primary-container border-2 border-surface-container-low text-[8px] flex items-center justify-center font-bold">EM</div>
          <div class="h-6 w-6 rounded-full bg-primary border-2 border-surface-container-low text-[8px] flex items-center justify-center font-bold">JS</div>
          <div class="h-6 w-6 rounded-full bg-tertiary-container border-2 border-surface-container-low text-[8px] flex items-center justify-center font-bold">KT</div>
          <div class="h-6 w-6 rounded-full bg-outline border-2 border-surface-container-low text-[8px] flex items-center justify-center font-bold">+2</div>
        </div>
      </div>
    </section>
  </main>
</template>
