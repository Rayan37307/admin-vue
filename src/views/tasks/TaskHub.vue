<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useTasksStore } from '../../stores/tasks'
import { mapStatusToDisplay, mapPriorityToDisplay, formatDate } from '../../api/tasks'
import type { TaskResource } from '../../api/tasks'

const router = useRouter()
const store = useTasksStore()

// Filters
const filters = ref({
  todo: false,
  inProgress: false,
  review: false,
  completed: false,
  priority: 'all',
})

// Map UI filter checkboxes to API status values
const apiStatusFilter = computed(() => {
  const statuses: string[] = []
  if (filters.value.todo) statuses.push('todo')
  if (filters.value.inProgress) statuses.push('in_progress')
  if (filters.value.review) statuses.push('review')
  if (filters.value.completed) statuses.push('completed')
  return statuses.length > 0 ? statuses.join(',') : ''
})

const apiPriorityFilter = computed(() => {
  if (filters.value.priority === 'all') return ''
  return filters.value.priority
})

// Fetch tasks when filters change
function applyFilters() {
  store.fetchTasks({
    status: apiStatusFilter.value,
    priority: apiPriorityFilter.value,
  })
}

onMounted(() => {
  store.fetchTasks()
})

watch([() => filters.value.todo, () => filters.value.inProgress, () => filters.value.review, () => filters.value.completed, () => filters.value.priority], () => {
  applyFilters()
})

// Navigate to task details
function navigateToTask(taskId: number) {
  router.push({ name: 'TaskDetails', query: { id: taskId } })
}

// Display tasks from store
const displayTasks = computed(() => {
  return store.tasks.map((task: TaskResource) => {
    const statusDisplay = mapStatusToDisplay(task.status)
    const priorityDisplay = mapPriorityToDisplay(task.priority)
    const deadlineDisplay = formatDate(task.deadline)

    // Determine icon based on status
    let icon = 'task_alt'
    let iconClass = 'bg-surface-container-highest text-on-surface-variant'
    if (task.status === 'in_progress') {
      icon = 'pending'
      iconClass = 'bg-primary/10 text-primary'
    } else if (task.status === 'completed') {
      icon = 'check_circle'
      iconClass = 'bg-green-500/10 text-green-400'
    } else if (task.priority === 'urgent') {
      icon = 'rocket_launch'
      iconClass = 'bg-primary text-surface'
    }

    return {
      ...task,
      statusDisplay,
      priorityDisplay,
      deadlineDisplay,
      icon,
      iconClass,
      completed: task.status === 'completed',
    }
  })
})

// Status class for display
const getStatusClass = (status: TaskResource['status']) => {
  switch (status) {
    case 'in_progress':
      return 'text-primary'
    case 'todo':
      return 'text-outline'
    case 'completed':
      return 'text-green-400'
    case 'review':
      return 'text-primary'
    default:
      return 'text-outline'
  }
}

// Priority badge class
const getPriorityClass = (priority: TaskResource['priority']) => {
  switch (priority) {
    case 'high':
      return 'bg-error-container/20 text-error border-error/30'
    case 'medium':
      return 'bg-tertiary-container/20 text-tertiary border-tertiary/30'
    case 'low':
      return 'bg-surface-container-highest text-outline border-outline/20'
    case 'urgent':
      return 'bg-primary text-on-primary border-transparent'
    default:
      return 'bg-surface-container-highest text-outline border-outline/20'
  }
}

// Status dot class
const getStatusDotClass = (status: TaskResource['status']) => {
  switch (status) {
    case 'in_progress':
      return 'bg-primary animate-pulse'
    case 'completed':
      return 'bg-green-400'
    default:
      return 'bg-outline'
  }
}

// Default avatar
const defaultAvatar =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBiQINYoaI7rNEgriQMN-nVGaD9dJIwv1fRH3nmLIPyqbcwvpv-5F6ywNb9ZkYpzh3W-B3vVZsHXTv197t6ojkUJ_wOCTxxiwZMwgeaEI6wiOGnszM8_v1VbqU2980e6gk2QsD4tPz4pIDZjOvaefZdfX96XSsTysVbWMGHJc9IOXyy-pwnNdan6EvugZW5L3vFJXm9HQbGaHlZfkTs81GAOAoMS1uaAsWh6K9ETH7HwwEOTB1bZvU5a_qeoXtbZGk7dVGTTWfyTc0'

// Weekly efficiency (computed from store data)
const weeklyEfficiency = computed(() => {
  const analyticsData = store.analyticsData
  if (analyticsData && analyticsData.completion_rate) {
    return Math.round(analyticsData.completion_rate)
  }
  return 84 // fallback
})
</script>

<template>
  <main class="min-h-screen bg-surface p-10">
    <!-- Loading state -->
    <div v-if="store.isLoading" class="flex items-center justify-center min-h-[50vh]">
      <div class="text-center">
        <span class="material-symbols-outlined text-6xl text-primary animate-spin">progress_activity</span>
        <p class="mt-4 text-on-surface-variant">Loading tasks...</p>
      </div>
    </div>

    <!-- Content -->
    <div v-else>
      <header class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div class="space-y-2">
          <h1 class="font-headline text-5xl tracking-tighter text-on-surface">Active Tasks</h1>
          <p class="text-on-surface-variant text-lg max-w-xl">
            Precision management for your obsidian-grade infrastructure. Monitor, assign, and execute with absolute clarity.
          </p>
        </div>
        <button
          class="bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold px-8 py-4 rounded-xl shadow-[0_0_20px_rgba(192,193,255,0.2)] flex items-center gap-2 hover:scale-105 transition-transform duration-400 group"
        >
          <span class="material-symbols-outlined text-xl">add</span>
          Create Task
        </button>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        <!-- Filters sidebar -->
        <aside class="md:col-span-3 space-y-6">
          <div class="bg-surface-container rounded-xl p-6 shadow-sm">
            <h3 class="font-headline text-sm uppercase tracking-widest text-primary mb-6">
              Execution Filters
            </h3>
            <div class="space-y-6">
              <div>
                <label class="block text-xs font-medium text-outline uppercase tracking-wider mb-3">
                  Status Matrix
                </label>
                <div class="space-y-2">
                  <label class="flex items-center gap-3 cursor-pointer group">
                    <input
                      v-model="filters.todo"
                      class="rounded border-outline-variant bg-surface-container-lowest text-primary focus:ring-primary/20 transition-all"
                      type="checkbox"
                    />
                    <span class="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
                      To Do
                    </span>
                  </label>
                  <label class="flex items-center gap-3 cursor-pointer group">
                    <input
                      v-model="filters.inProgress"
                      class="rounded border-outline-variant bg-surface-container-lowest text-primary focus:ring-primary/20 transition-all"
                      type="checkbox"
                    />
                    <span class="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
                      In Progress
                    </span>
                  </label>
                  <label class="flex items-center gap-3 cursor-pointer group">
                    <input
                      v-model="filters.review"
                      class="rounded border-outline-variant bg-surface-container-lowest text-primary focus:ring-primary/20 transition-all"
                      type="checkbox"
                    />
                    <span class="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
                      In Review
                    </span>
                  </label>
                  <label class="flex items-center gap-3 cursor-pointer group">
                    <input
                      v-model="filters.completed"
                      class="rounded border-outline-variant bg-surface-container-lowest text-primary focus:ring-primary/20 transition-all"
                      type="checkbox"
                    />
                    <span class="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
                      Done
                    </span>
                  </label>
                </div>
              </div>
              <div>
                <label class="block text-xs font-medium text-outline uppercase tracking-wider mb-3">
                  Priority Gradient
                </label>
                <div class="flex flex-wrap gap-2">
                  <button
                    :class="[
                      'px-3 py-1.5 rounded-lg border text-xs transition-colors',
                      filters.priority === 'all'
                        ? 'bg-primary/10 border-primary/30 text-primary'
                        : 'bg-surface-container-lowest border border-outline-variant/20 text-on-surface-variant hover:border-primary/50',
                    ]"
                    @click="filters.priority = 'all'"
                  >
                    All
                  </button>
                  <button
                    :class="[
                      'px-3 py-1.5 rounded-lg border text-xs transition-colors',
                      filters.priority === 'low'
                        ? 'bg-primary/10 border-primary/30 text-primary'
                        : 'bg-surface-container-lowest border border-outline-variant/20 text-on-surface-variant hover:border-primary/50',
                    ]"
                    @click="filters.priority = 'low'"
                  >
                    Low
                  </button>
                  <button
                    :class="[
                      'px-3 py-1.5 rounded-lg border text-xs transition-colors',
                      filters.priority === 'medium'
                        ? 'bg-primary/10 border-primary/30 text-primary'
                        : 'bg-surface-container-lowest border border-outline-variant/20 text-on-surface-variant hover:border-primary/50',
                    ]"
                    @click="filters.priority = 'medium'"
                  >
                    Medium
                  </button>
                  <button
                    :class="[
                      'px-3 py-1.5 rounded-lg border text-xs transition-colors',
                      filters.priority === 'high'
                        ? 'bg-primary/10 border-primary/30 text-primary'
                        : 'bg-surface-container-lowest border border-outline-variant/20 text-on-surface-variant hover:border-primary/50',
                    ]"
                    @click="filters.priority = 'high'"
                  >
                    High
                  </button>
                  <button
                    :class="[
                      'px-3 py-1.5 rounded-lg border text-xs transition-colors',
                      filters.priority === 'urgent'
                        ? 'bg-primary/10 border-primary/30 text-primary'
                        : 'bg-surface-container-lowest border border-outline-variant/20 text-on-surface-variant hover:border-primary/50',
                    ]"
                    @click="filters.priority = 'urgent'"
                  >
                    Urgent
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Weekly Efficiency -->
          <div
            class="bg-gradient-to-br from-surface-container to-surface-container-high rounded-xl p-6 border-l-4 border-primary/40"
          >
            <span class="material-symbols-outlined text-primary mb-4">analytics</span>
            <h4 class="font-headline text-lg text-on-surface mb-2">Weekly Efficiency</h4>
            <p class="text-on-surface-variant text-sm mb-4">
              You have completed {{ weeklyEfficiency }}% of your high-priority cycles this week.
            </p>
            <div class="h-1.5 w-full bg-surface-container-lowest rounded-full overflow-hidden">
              <div
                class="h-full bg-primary rounded-full"
                :style="{ width: `${weeklyEfficiency}%` }"
              ></div>
            </div>
          </div>
        </aside>

        <!-- Task list -->
        <section class="md:col-span-9 space-y-4">
          <!-- Header row -->
          <div
            class="grid grid-cols-12 px-6 py-3 text-xs font-medium text-outline uppercase tracking-widest bg-surface-container-low rounded-t-xl hidden lg:grid"
          >
            <div class="col-span-4">Task Designation</div>
            <div class="col-span-2">Protocol Status</div>
            <div class="col-span-1">Priority</div>
            <div class="col-span-2">Assignee</div>
            <div class="col-span-2">Deadline</div>
            <div class="col-span-1 text-right">Actions</div>
          </div>

          <!-- Empty state -->
          <div
            v-if="!store.hasTasks && !store.isLoading"
            class="bg-surface-container rounded-xl p-12 text-center"
          >
            <span class="material-symbols-outlined text-6xl text-on-surface-variant opacity-40 mb-4"
              >task_alt</span
            >
            <h3 class="text-xl font-bold text-on-surface mb-2">No Tasks Found</h3>
            <p class="text-on-surface-variant">
              {{ store.isEmpty ? 'No tasks match your current filters.' : 'Get started by creating your first task.' }}
            </p>
          </div>

          <!-- Regular task cards -->
          <div
            v-for="task in displayTasks.filter((t) => t.priority !== 'urgent')"
            :key="task.id"
            :class="[
              'group bg-surface-container rounded-xl p-6 transition-all duration-400 hover:scale-[1.01] hover:bg-surface-container-high shadow-lg lg:grid lg:grid-cols-12 lg:items-center lg:gap-4 border border-transparent hover:border-primary/10 cursor-pointer',
              task.completed ? 'opacity-60' : '',
            ]"
            @click="navigateToTask(task.id)"
          >
            <div class="col-span-4 mb-4 lg:mb-0">
              <div class="flex items-center gap-4">
                <div :class="['w-10 h-10 rounded-lg flex items-center justify-center', task.iconClass]">
                  <span class="material-symbols-outlined">{{ task.icon }}</span>
                </div>
                <div>
                  <h3
                    :class="[
                      'font-bold group-hover:text-primary transition-colors',
                      task.completed ? 'text-on-surface-variant line-through' : 'text-on-surface',
                    ]"
                  >
                    {{ task.title }}
                  </h3>
                  <p class="text-sm text-on-surface-variant line-clamp-1">
                    {{ task.description || 'No description' }}
                  </p>
                </div>
              </div>
            </div>
            <div class="col-span-2 mb-4 lg:mb-0">
              <span
                :class="['flex items-center gap-2 text-sm font-medium', getStatusClass(task.status)]"
              >
                <span
                  :class="['w-2 h-2 rounded-full', getStatusDotClass(task.status)]"
                ></span>
                {{ task.statusDisplay }}
              </span>
            </div>
            <div class="col-span-1 mb-4 lg:mb-0">
              <span
                :class="[
                  'px-2.5 py-1 rounded-md text-xs font-bold uppercase border',
                  getPriorityClass(task.priority),
                ]"
              >
                {{ task.priorityDisplay }}
              </span>
            </div>
            <div class="col-span-2 mb-4 lg:mb-0 flex items-center gap-2">
              <img
                v-if="task.assigned_worker"
                :alt="task.assigned_worker.name"
                class="w-6 h-6 rounded-full bg-surface-container-highest"
                :src="task.assigned_worker.avatar || defaultAvatar"
              />
              <span class="text-sm text-on-surface-variant">
                {{ task.assigned_worker?.name || 'Unassigned' }}
              </span>
            </div>
            <div class="col-span-2 mb-4 lg:mb-0">
              <div class="flex items-center gap-2 text-sm text-on-surface-variant">
                <span class="material-symbols-outlined text-base">calendar_today</span>
                <span>{{ task.deadlineDisplay }}</span>
              </div>
            </div>
            <div class="col-span-1 flex justify-end gap-2">
              <button class="material-symbols-outlined text-outline hover:text-primary transition-colors">
                visibility
              </button>
              <button class="material-symbols-outlined text-outline hover:text-primary transition-colors">
                edit
              </button>
              <button
                :class="[
                  'material-symbols-outlined transition-colors',
                  task.completed ? 'text-green-400' : 'text-outline hover:text-green-400',
                ]"
              >
                check_circle
              </button>
            </div>
          </div>

          <!-- Featured / urgent task card -->
          <div
            v-if="displayTasks.find((t) => t.priority === 'urgent')"
            class="group bg-gradient-to-br from-surface-container to-[#1a1e2e] rounded-xl p-8 transition-all duration-400 hover:shadow-2xl lg:grid lg:grid-cols-12 lg:items-center lg:gap-4 border border-primary/5 relative overflow-hidden cursor-pointer"
            @click="navigateToTask(displayTasks.find((t) => t.priority === 'urgent')!.id)"
          >
            <div class="absolute -right-12 -top-12 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
            <div
              v-for="task in displayTasks.filter((t) => t.priority === 'urgent')"
              :key="task.id"
              class="col-span-5 mb-4 lg:mb-0 relative z-10"
            >
              <div class="flex items-center gap-6">
                <div
                  class="w-14 h-14 rounded-xl bg-primary flex items-center justify-center text-surface shadow-[0_0_20px_rgba(192,193,255,0.4)]"
                >
                  <span class="material-symbols-outlined text-3xl">rocket_launch</span>
                </div>
                <div>
                  <span class="text-[10px] font-bold text-primary tracking-[0.2em] uppercase mb-1 block">
                    Critical Milestone
                  </span>
                  <h3 class="font-headline text-2xl text-on-surface">{{ task.title }}</h3>
                  <p class="text-sm text-on-surface-variant mt-1">
                    {{ task.description || 'No description' }}
                  </p>
                </div>
              </div>
            </div>
            <div class="col-span-2 mb-4 lg:mb-0">
              <span class="flex flex-col">
                <span class="text-[10px] text-outline uppercase tracking-wider mb-1">Status</span>
                <span class="text-primary font-bold">
                  {{ displayTasks.find((t) => t.priority === 'urgent')?.statusDisplay }}
                </span>
              </span>
            </div>
            <div class="col-span-2 mb-4 lg:mb-0">
              <span class="flex flex-col">
                <span class="text-[10px] text-outline uppercase tracking-wider mb-1">Due Date</span>
                <span class="text-on-surface font-medium">
                  {{ displayTasks.find((t) => t.priority === 'urgent')?.deadlineDisplay }}
                </span>
              </span>
            </div>
            <div class="col-span-3 flex justify-end gap-3">
              <button
                class="bg-surface-container-highest text-on-surface-variant px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-surface-bright transition-all"
              >
                Details
              </button>
              <button
                class="bg-primary text-on-primary px-5 py-2.5 rounded-lg text-sm font-bold shadow-lg hover:brightness-110 transition-all"
              >
                Initialize
              </button>
            </div>
          </div>

          <!-- Load more -->
          <div v-if="store.meta.last_page > store.meta.current_page" class="pt-8 flex justify-center">
            <button
              class="text-outline text-sm font-medium flex items-center gap-2 hover:text-primary transition-colors group"
              @click="store.setPage(store.meta.current_page + 1); store.fetchTasks()"
            >
              Load more encrypted tasks
              <span class="material-symbols-outlined text-lg group-hover:translate-y-1 transition-transform"
                >expand_more</span
              >
            </button>
          </div>
        </section>
      </div>
    </div>
  </main>

  <footer class="mt-12 px-8 py-6 border-t border-outline-variant/15 bg-surface flex flex-col md:flex-row items-center justify-between gap-4">
    <p class="text-[10px] font-bold uppercase tracking-widest text-slate-500">
      © 2024 Obsidian Architect • System Status: <span class="text-success">Operational</span>
    </p>
    <div class="flex gap-4 items-center">
      <span class="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.4)]"></span>
      <span class="text-[10px] font-bold uppercase tracking-widest text-slate-500"
        >Region: Global-Alpha-1</span
      >
    </div>
  </footer>
</template>
