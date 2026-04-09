<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useTasksStore } from '../../stores/tasks'
import { formatMonthYear } from '../../api/tasks'
import type { CalendarTaskResource } from '../../api/tasks'

const store = useTasksStore()

// Current month tracking
const currentDate = ref(new Date())
const viewMode = ref('Month')

// Computed: formatted month-year label
const currentMonth = computed(() => formatMonthYear(currentDate.value.toISOString()))

// Computed: total task count for the month
const totalTaskCount = computed(() => store.calendarTasks.length)

// Computed: map deadlines to calendar days
interface CalendarDay {
  day: number | string
  date: Date | null
  tasks: CalendarTaskResource[]
  prevMonth: boolean
  isWeekend: boolean
  isToday: boolean
}

const calendarDays = computed<CalendarDay[]>(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Start from the Sunday before the 1st
  const startDay = firstDay.getDay() // 0 = Sunday
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - startDay)

  // Build 6 weeks (42 days) to fill the grid
  const days: CalendarDay[] = []
  const current = new Date(startDate)

  // Build a map of deadline -> tasks
  const taskMap = new Map<string, CalendarTaskResource[]>()
  for (const task of store.calendarTasks) {
    if (task.deadline) {
      const key = task.deadline
      if (!taskMap.has(key)) {
        taskMap.set(key, [])
      }
      const tasks = taskMap.get(key)
      if (tasks) {
        tasks.push(task)
      }
    }
  }

  for (let i = 0; i < 42; i++) {
    const dateStr = current.toISOString().split('T')[0] ?? ''
    const isPrevMonth = current.getMonth() !== month
    const isWeekend = current.getDay() === 0 || current.getDay() === 6
    const isToday = current.getTime() === today.getTime()

    const dayTasks = taskMap.get(dateStr) || []

    days.push({
      day: isPrevMonth ? '' : current.getDate(),
      date: isPrevMonth ? null : new Date(current),
      tasks: dayTasks,
      prevMonth: isPrevMonth,
      isWeekend,
      isToday,
    })

    current.setDate(current.getDate() + 1)
  }

  return days
})

// Upcoming tasks from the API
const upcomingTasksDisplay = computed(() => {
  return store.upcomingTasks.slice(0, 5).map((task) => {
    const deadlineDate = task.deadline ? new Date(task.deadline) : null
    const formattedDate = deadlineDate
      ? deadlineDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : 'No deadline'

    let priority = 'normal'
    if (task.priority === 'urgent' || task.priority === 'high') {
      priority = 'urgent'
    }

    return {
      id: task.id,
      title: task.title,
      date: formattedDate,
      priority,
      icon: task.priority === 'urgent' ? 'priority_high' : 'task_alt',
      status: task.status === 'review' ? 'IN REVIEW' : undefined,
      assignee: task.assigned_worker,
    }
  })
})

// Navigate months
function prevMonth() {
  const d = new Date(currentDate.value)
  d.setMonth(d.getMonth() - 1)
  currentDate.value = d
}

function nextMonth() {
  const d = new Date(currentDate.value)
  d.setMonth(d.getMonth() + 1)
  currentDate.value = d
}

function goToday() {
  currentDate.value = new Date()
}

// Fetch calendar tasks when month changes
function fetchCalendarData() {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const start = new Date(year, month, 1).toISOString().split('T')[0]
  const end = new Date(year, month + 1, 0).toISOString().split('T')[0]

  store.fetchCalendarTasks({ start, end })
  store.fetchUpcomingTasks({ days: 14 })
}

onMounted(() => {
  fetchCalendarData()
})

watch(currentDate, () => {
  fetchCalendarData()
})

// Priority class helper
const getPriorityClass = (priority: string | undefined) => {
  if (!priority) return 'bg-surface-container-highest border border-outline-variant/20'
  switch (priority) {
    case 'urgent':
      return 'bg-error-container/20 border-l-2 border-error text-error'
    case 'high':
      return 'bg-error-container/20 border-l-2 border-error text-error'
    case 'medium':
      return 'bg-primary-container/20 border-l-2 border-primary text-primary'
    case 'low':
      return 'bg-tertiary-container/20 border-l-2 border-tertiary text-tertiary'
    default:
      return 'bg-surface-container-highest border border-outline-variant/20'
  }
}

// Default avatar for assignees
const defaultAvatar =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBxSlR3Y_QiFdMSUUHnpVnDpRlMtjyGKBk9cltTiMUpNYfEcBc0NFtOwUO1snSt27Z4d9rnH5RUiigV-_GSXetL2mRtEYr9Bs9rU8xwvNFcXTn2-u48wqUNn2zwK7pGrQ1oDL8ypoy5b5XJrL4BWBxuQAtXMdh-Gj66Rb87UUAmnzDUfLTuHK_x4C5HXErPQ02efSRPvcKCWqYAh4H3wGoGqtU6X5B-oKS10J21t9wRTdrPqNcey3_BY25juHi-W4atPMQvEz5rl3Q'
</script>

<template>
  <main class="min-h-screen bg-surface p-8">
    <!-- Loading state -->
    <div v-if="store.isCalendarLoading" class="flex items-center justify-center min-h-[50vh]">
      <div class="text-center">
        <span class="material-symbols-outlined text-6xl text-primary animate-spin">progress_activity</span>
        <p class="mt-4 text-on-surface-variant">Loading calendar...</p>
      </div>
    </div>

    <!-- Content -->
    <div v-else class="w-full">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h2 class="font-headline text-4xl text-primary-fixed-dim tracking-tight mb-2">
            {{ currentMonth }}
          </h2>
          <p class="text-on-surface-variant flex items-center gap-2">
            <span class="material-symbols-outlined text-sm">schedule</span>
            You have {{ totalTaskCount }} task{{ totalTaskCount !== 1 ? 's' : '' }} scheduled for this month.
          </p>
        </div>
        <div class="flex items-center gap-4 bg-surface-container p-1 rounded-2xl shadow-inner">
          <button
            class="p-2 hover:bg-surface-container-highest rounded-xl text-on-surface transition-all"
            @click="prevMonth()"
          >
            <span class="material-symbols-outlined">chevron_left</span>
          </button>
          <button
            class="px-6 py-2 bg-surface-container-highest text-on-surface rounded-xl font-semibold text-sm"
            @click="goToday()"
          >
            Today
          </button>
          <button
            class="p-2 hover:bg-surface-container-highest rounded-xl text-on-surface transition-all"
            @click="nextMonth()"
          >
            <span class="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
        <div class="flex items-center gap-3">
          <div class="flex bg-surface-container-low p-1 rounded-xl">
            <button class="px-4 py-1.5 text-xs font-bold rounded-lg bg-primary text-surface">
              Month
            </button>
            <button class="px-4 py-1.5 text-xs font-medium text-on-surface-variant hover:text-on-surface transition-colors">
              Week
            </button>
            <button class="px-4 py-1.5 text-xs font-medium text-on-surface-variant hover:text-on-surface transition-colors">
              Day
            </button>
          </div>
        </div>
      </div>

      <!-- Calendar grid -->
      <div class="grid grid-cols-7 gap-px bg-outline-variant/10 rounded-2xl overflow-hidden shadow-2xl border border-outline-variant/5">
        <!-- Day headers -->
        <div
          v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']"
          :key="day"
          class="bg-surface-container py-4 text-center border-b border-outline-variant/10"
        >
          <span class="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
            {{ day }}
          </span>
        </div>

        <!-- Calendar days -->
        <div
          v-for="(day, idx) in calendarDays"
          :key="idx"
          :class="[
            'h-40 p-3 group relative transition-colors flex flex-col',
            day.isWeekend
              ? 'bg-surface-container-lowest'
              : day.prevMonth
                ? 'bg-surface-container-lowest opacity-40'
                : 'bg-surface-container',
            day.isToday ? 'border-2 border-primary/40 ring-4 ring-primary/5 z-10' : '',
          ]"
        >
          <span
            v-if="day.day !== ''"
            :class="[
              'text-sm font-semibold',
              day.isToday ? 'text-primary flex items-center gap-1.5' : 'text-on-surface-variant',
            ]"
          >
            {{ day.day }}
            <span v-if="day.isToday" class="w-1.5 h-1.5 rounded-full bg-primary inline-block"></span>
          </span>

          <div v-if="day.tasks && day.tasks.length > 0" class="mt-2 flex flex-col gap-1">
            <div
              v-for="(task, taskIdx) in day.tasks.slice(0, 3)"
              :key="taskIdx"
              :class="[
                'p-2 rounded-r-lg cursor-grab hover:scale-[1.02] transition-transform',
                getPriorityClass(task.priority),
              ]"
            >
              <p v-if="task.priority" class="text-[10px] font-bold uppercase mb-0.5">
                {{ task.priority }}
              </p>
              <p class="text-xs font-medium text-on-surface truncate">{{ task.title }}</p>
              <div v-if="task.assigned_worker" class="flex items-center gap-2 mt-2">
                <img
                  alt="Team member"
                  class="w-4 h-4 rounded-full"
                  :src="task.assigned_worker.avatar || defaultAvatar"
                />
                <span class="text-[9px] text-on-surface-variant">
                  {{ task.assigned_worker.name }}
                </span>
              </div>
            </div>
            <p v-if="day.tasks.length > 3" class="text-[10px] text-on-surface-variant mt-1">
              + {{ day.tasks.length - 3 }} more tasks
            </p>
          </div>

          <button
            v-if="day.day !== '' && !day.prevMonth"
            class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1 hover:bg-primary/20 rounded-md transition-all"
          >
            <span class="material-symbols-outlined text-primary text-sm">add</span>
          </button>

          <button
            v-if="day.isToday"
            class="absolute bottom-3 left-1/2 -translate-x-1/2 bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1 rounded-full text-[10px] font-bold transition-all opacity-0 group-hover:opacity-100"
          >
            + New Event
          </button>
        </div>
      </div>

      <!-- Upcoming focus section -->
      <div class="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 bg-surface-container rounded-2xl p-6 shadow-xl border border-outline-variant/5">
          <div class="flex justify-between items-center mb-6">
            <h3 class="font-bold text-xl text-on-surface">Upcoming Focus</h3>
            <button class="text-primary text-sm font-semibold hover:underline">View All Tasks</button>
          </div>
          <div v-if="upcomingTasksDisplay.length > 0" class="space-y-4">
            <div
              v-for="task in upcomingTasksDisplay"
              :key="task.id"
              class="flex items-center gap-4 bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/10 group hover:border-primary/40 transition-all cursor-pointer"
            >
              <div
                :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center',
                  task.priority === 'urgent'
                    ? 'bg-error-container/10 text-error'
                    : 'bg-primary/10 text-primary',
                ]"
              >
                <span class="material-symbols-outlined">{{ task.icon }}</span>
              </div>
              <div class="flex-1">
                <p class="text-sm font-bold text-on-surface">{{ task.title }}</p>
                <p class="text-xs text-on-surface-variant">{{ task.date }}</p>
              </div>
              <div v-if="task.status" class="px-3 py-1 bg-surface-container-highest rounded-full text-[10px] font-bold text-primary">
                {{ task.status }}
              </div>
              <div v-else-if="task.assignee" class="flex -space-x-2">
                <img
                  alt="Team member avatar"
                  class="w-7 h-7 rounded-full border-2 border-surface-container-lowest"
                  :src="task.assignee.avatar || defaultAvatar"
                />
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8 text-on-surface-variant">
            <span class="material-symbols-outlined text-4xl mb-2 opacity-40">event_note</span>
            <p>No upcoming tasks</p>
          </div>
        </div>

        <!-- Precision Control panel -->
        <div
          class="bg-gradient-to-br from-surface-container to-surface-container-high rounded-2xl p-6 shadow-xl relative overflow-hidden group"
        >
          <div class="relative z-10">
            <div
              class="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6"
            >
              <span class="material-symbols-outlined text-3xl">drag_indicator</span>
            </div>
            <h3 class="font-headline text-xl text-primary-fixed-dim mb-3">Precision Control</h3>
            <p class="text-on-surface-variant text-sm leading-relaxed mb-6">
              Need to reschedule? Simply
              <span class="text-primary font-bold">drag and drop</span> any task slot to a new date.
            </p>
            <ul class="space-y-3">
              <li class="flex items-center gap-3 text-xs text-on-surface">
                <span class="w-2 h-2 rounded-full bg-error"></span> Urgent Action Required
              </li>
              <li class="flex items-center gap-3 text-xs text-on-surface">
                <span class="w-2 h-2 rounded-full bg-primary"></span> Standard Workflow
              </li>
              <li class="flex items-center gap-3 text-xs text-on-surface">
                <span class="w-2 h-2 rounded-full bg-tertiary"></span> Review &amp; Discussion
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </main>

  <footer class="mt-12 px-8 py-6 border-t border-outline-variant/15 bg-surface flex flex-col md:flex-row items-center justify-between gap-4">
    <p class="text-[10px] font-bold uppercase tracking-widest text-slate-500">
      © 2024 Obsidian Architect • System Status: <span class="text-success">Operational</span>
    </p>
    <div class="flex gap-4 items-center">
      <span class="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.4)]"></span>
      <span class="text-[10px] font-bold uppercase tracking-widest text-slate-500">Region: Global-Alpha-1</span>
    </div>
  </footer>
</template>
