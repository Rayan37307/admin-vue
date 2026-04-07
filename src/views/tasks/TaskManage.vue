<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTasksStore } from '../../stores/tasks'
import { mapStatusToDisplay, mapPriorityToDisplay, formatDate } from '../../api/tasks'
import type { TaskResource, UpdateTaskRequest } from '../../api/tasks'

const route = useRoute()
const router = useRouter()
const store = useTasksStore()

// Get task ID from route
const taskId = computed(() => {
  const id = route.query.id || route.params.id
  return id ? Number(id) : null
})

// Edit mode toggle
const isEditMode = ref(false)

// Edit form state
const editTitle = ref('')
const editDescription = ref('')
const editStatus = ref<TaskResource['status']>('todo')
const editPriority = ref<TaskResource['priority']>('medium')
const editDeadline = ref('')
const editEstimatedHours = ref<number | undefined>(undefined)

// Delete confirmation
const showDeleteConfirm = ref(false)

// New comment (mock)
const newComment = ref('')

// Computed: task data from store
const taskData = computed(() => store.currentTask)
const isLoading = computed(() => store.isCurrentTaskLoading)
const hasError = computed(() => store.hasCurrentTaskError)
const errorMessage = computed(() => store.currentTaskError)

// Display helpers
const displayStatus = computed(() => {
  if (!taskData.value) return ''
  return mapStatusToDisplay(taskData.value.status)
})

const displayPriority = computed(() => {
  if (!taskData.value) return ''
  return mapPriorityToDisplay(taskData.value.priority)
})

const formattedDeadline = computed(() => {
  if (!taskData.value) return 'No deadline'
  return formatDate(taskData.value.deadline)
})

const taskProgress = computed(() => {
  if (!taskData.value) return 0
  return taskData.value.progress
})

// Mock subtasks
interface SubTask {
  id: number
  text: string
  assignee: { name: string; image: string } | null
  date: string
  completed: boolean
}

const subTasks = ref<SubTask[]>([
  {
    id: 1,
    text: 'Define project requirements',
    assignee: null,
    date: 'Oct 18',
    completed: true,
  },
  {
    id: 2,
    text: 'Set up development environment',
    assignee: null,
    date: 'Oct 20',
    completed: false,
  },
])

// Mock team (will be updated from API)
const team = computed(() => {
  if (!taskData.value) return []
  const members = []
  if (taskData.value.assigned_worker) {
    members.push({
      name: taskData.value.assigned_worker.name,
      role: 'Assignee',
      image:
        taskData.value.assigned_worker.avatar ||
        'https://lh3.googleusercontent.com/aida-public/AB6AXuB3DW2lsGwTNJkuoXf2YHF4a7G0xh-4DzQLPo5eq16LBv5TnsmG2g8skPXfFRdjq6NQRLqvA',
    })
  }
  if (taskData.value.creator) {
    members.push({
      name: taskData.value.creator.name,
      role: 'Creator',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDXYX7SrocWykMTtFaKqQPz1cVrulZgKp7pMyy1gbWveSev9T1NVB4jaCxXdsJu-7K-hDpZtPge7UkXtTBPAh7DILuDU1LE9pbaubUAsR8GBINDC2BMB3zyIfZoK_3k0Tx1Ccqhw3xFWUY67gmaw-TdUmthwax3ERvm4B5wqjZE3BKj8XBMMeJOsoXmFSsOLEVoY92D6SHSdehVjEJTdlrZQh9K8oj9aKLo3m_5b6XmkXYzzkiH7qxBYYxWstR8voVJxlpIx1ZFuI',
    })
  }
  return members
})

// Mock files (will use task.files from API)
const taskFiles = computed(() => {
  if (!taskData.value || !taskData.value.files) return []
  return taskData.value.files.map((file) => ({
    name: file.name,
    size: file.size,
    date: file.uploaded_at
      ? new Date(file.uploaded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : 'N/A',
    type: file.mime_type?.startsWith('image/') ? 'image' : 'pdf',
    url: file.url,
  }))
})

// Mock comments
const comments = ref([
  {
    id: 1,
    user: {
      name: 'Marcus Thornton',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAh_MZnICik1xm2Fc-T-kHG-T9k7aROB5CE50STABa54stgk9CcO67svoUy9kb584G-v4jDt_QQsBSPSdJkGW5V5CE-NyRZCqyCM4Uni1oBqe_wCaPl20T0ZKCt78J00NFbQzGWAbCDvEw99xsIP458h09xIvuomVZn216E3AcgIqcutiZpbkkI8YbsGIRMbgyytiNHq1lkKOtlNnF0oNe2QNPmHgdFIDxJSUaWIY3mQV8KY-6ocH2u7vHgVlN4gEFOPFF-E',
    },
    text: 'Just pushed the first draft of the Glass Effect tokens to the shared Figma file.',
    time: '34 MIN AGO',
  },
])

// Mock activities
const activities = ref([
  { title: 'Project updated to "In Progress"', by: 'Alex Rivera', date: '2h ago' },
  { title: 'New file uploaded: Style_Guide_v2.pdf', by: 'Marcus Thornton', date: '4h ago' },
  { title: 'Task "Map IA" assigned to Marcus', by: 'System Auto', date: 'Oct 20' },
])

// Edit mode handlers
function enableEditMode() {
  if (!taskData.value) return
  editTitle.value = taskData.value.title
  editDescription.value = taskData.value.description || ''
  editStatus.value = taskData.value.status
  editPriority.value = taskData.value.priority
  editDeadline.value = taskData.value.deadline || ''
  editEstimatedHours.value = taskData.value.estimated_hours || undefined
  isEditMode.value = true
}

function cancelEditMode() {
  isEditMode.value = false
}

async function saveEdit() {
  if (!taskData.value) return

  const updateData: UpdateTaskRequest = {
    title: editTitle.value,
    description: editDescription.value,
    status: editStatus.value,
    priority: editPriority.value,
    deadline: editDeadline.value || undefined,
    estimated_hours: editEstimatedHours.value,
  }

  const updated = await store.updateTaskAction(taskData.value.id, updateData)
  if (updated) {
    isEditMode.value = false
  }
}

// Delete handler
async function confirmDelete() {
  if (!taskData.value) return
  const success = await store.deleteTaskAction(taskData.value.id)
  if (success) {
    router.push('/tasks')
  }
}

// On mount
onMounted(() => {
  if (taskId.value) {
    store.fetchTaskById(taskId.value)
  }
})

watch(taskId, (newId) => {
  if (newId) {
    store.fetchTaskById(newId)
  }
})

const defaultAvatar =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBiQINYoaI7rNEgriQMN-nVGaD9dJIwv1fRH3nmLIPyqbcwvpv-5F6ywNb9ZkYpzh3W-B3vVZsHXTv197t6ojkUJ_wOCTxxiwZMwgeaEI6wiOGnszM8_v1VbqU2980e6gk2QsD4tPz4pIDZjOvaefZdfX96XSsTysVbWMGHJc9IOXyy-pwnNdan6EvugZW5L3vFJXm9HQbGaHlZfkTs81GAOAoMS1uaAsWh6K9ETH7HwwEOTB1bZvU5a_qeoXtbZGk7dVGTTWfyTc0'
</script>

<template>
  <main class="min-h-screen bg-surface pt-24 pb-12 px-12">
    <!-- Loading state -->
    <div v-if="isLoading" class="flex items-center justify-center min-h-[50vh]">
      <div class="text-center">
        <span class="material-symbols-outlined text-6xl text-primary animate-spin">progress_activity</span>
        <p class="mt-4 text-on-surface-variant">Loading task...</p>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="hasError" class="flex items-center justify-center min-h-[50vh]">
      <div class="text-center bg-surface-container rounded-2xl p-8 max-w-md">
        <span class="material-symbols-outlined text-6xl text-error mb-4">error</span>
        <h3 class="text-xl font-bold text-on-surface mb-2">Failed to Load Task</h3>
        <p class="text-on-surface-variant mb-4">{{ errorMessage }}</p>
        <button
          class="bg-primary text-on-primary px-6 py-2 rounded-xl font-semibold"
          @click="taskId && store.fetchTaskById(taskId)"
        >
          Retry
        </button>
      </div>
    </div>

    <!-- Content -->
    <div v-else-if="taskData" class="max-w-7xl mx-auto">
      <!-- Header -->
      <section class="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <div class="flex items-center gap-2 mb-2">
            <span class="text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-primary/80">{{
              taskData.project?.name || 'No Project'
            }}</span>
            <span class="w-1 h-1 rounded-full bg-slate-600"></span>
            <span class="text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-slate-500"
              >Task ID: #{{ taskData.id }}</span
            >
          </div>

          <!-- Edit mode: show input; normal mode: show title -->
          <template v-if="isEditMode">
            <input
              v-model="editTitle"
              class="font-['Manrope'] text-[2.5rem] font-light tracking-tight text-white leading-tight bg-surface-container border border-outline-variant/20 rounded-xl px-4 py-2 w-full max-w-2xl"
              placeholder="Task title"
            />
          </template>
          <template v-else>
            <h1
              class="font-['Manrope'] text-[3.5rem] font-light tracking-tight text-white leading-tight"
            >
              {{ taskData.title }}
            </h1>
          </template>

          <div class="flex items-center gap-4 mt-4">
            <!-- Status badge -->
            <template v-if="isEditMode">
              <select
                v-model="editStatus"
                class="bg-surface-container border border-outline-variant/10 rounded-full px-3 py-1 text-xs font-bold text-on-surface"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="review">In Review</option>
                <option value="completed">Completed</option>
              </select>
            </template>
            <div v-else class="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-primary border border-primary/20">
              <span class="material-symbols-outlined text-[18px]">sync</span>
              <span class="text-xs font-bold">{{ displayStatus }}</span>
            </div>

            <!-- Priority badge -->
            <template v-if="isEditMode">
              <select
                v-model="editPriority"
                class="bg-surface-container border border-outline-variant/10 rounded-full px-3 py-1 text-xs font-bold text-on-surface"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </template>
            <div v-else class="flex items-center gap-2 px-3 py-1 bg-error-container/30 rounded-full text-error border border-error/20">
              <span class="material-symbols-outlined text-[18px]">priority_high</span>
              <span class="text-xs font-bold">{{ displayPriority }} Priority</span>
            </div>

            <div class="flex items-center gap-2 px-3 py-1 bg-surface-container rounded-full text-on-surface-variant border border-outline-variant/10">
              <span class="material-symbols-outlined text-[18px]">calendar_today</span>
              <span class="text-xs font-bold">Due: {{ formattedDeadline }}</span>
            </div>
          </div>
        </div>

        <!-- Action buttons -->
        <div class="flex gap-3">
          <template v-if="!isEditMode">
            <button
              class="px-6 py-3 bg-surface-container hover:bg-surface-bright text-on-surface rounded-2xl font-semibold text-sm transition-all border border-outline-variant/10"
              @click="enableEditMode()"
            >
              Edit Details
            </button>
            <button
              class="px-6 py-3 bg-error/10 hover:bg-error/20 text-error rounded-2xl font-semibold text-sm transition-all border border-error/20"
              @click="showDeleteConfirm = true"
            >
              Delete Task
            </button>
            <button
              class="px-6 py-3 bg-primary text-on-primary rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 active:scale-95 transition-all"
            >
              Complete Task
            </button>
          </template>
          <template v-else>
            <button
              class="px-6 py-3 bg-surface-container hover:bg-surface-bright text-on-surface rounded-2xl font-semibold text-sm transition-all border border-outline-variant/10"
              @click="cancelEditMode()"
            >
              Cancel
            </button>
            <button
              class="px-6 py-3 bg-primary text-on-primary rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 active:scale-95 transition-all disabled:opacity-50"
              :disabled="store.updatingTask"
              @click="saveEdit()"
            >
              {{ store.updatingTask ? 'Saving...' : 'Save Changes' }}
            </button>
          </template>
        </div>
      </section>

      <!-- Delete confirmation modal -->
      <div
        v-if="showDeleteConfirm"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        @click.self="showDeleteConfirm = false"
      >
        <div class="bg-surface-container rounded-2xl p-8 max-w-md w-full">
          <span class="material-symbols-outlined text-4xl text-error mb-4">delete_forever</span>
          <h3 class="text-xl font-bold text-on-surface mb-2">Delete Task</h3>
          <p class="text-on-surface-variant mb-6">
            Are you sure you want to delete "{{ taskData.title }}"? This action cannot be undone.
          </p>
          <div class="flex gap-3">
            <button
              class="flex-1 px-4 py-2 bg-surface-container-highest text-on-surface rounded-xl font-semibold hover:bg-surface-bright transition-all"
              @click="showDeleteConfirm = false"
            >
              Cancel
            </button>
            <button
              class="flex-1 px-4 py-2 bg-error text-on-error rounded-xl font-bold disabled:opacity-50"
              :disabled="store.deletingTask"
              @click="confirmDelete()"
            >
              {{ store.deletingTask ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Additional edit fields (shown in edit mode) -->
      <div v-if="isEditMode" class="mb-8 bg-surface-container rounded-2xl p-6">
        <h3 class="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">
          Edit Details
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-on-surface-variant mb-1">Description</label>
            <textarea
              v-model="editDescription"
              class="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-xl p-3 text-on-surface resize-none"
              rows="4"
            ></textarea>
          </div>
          <div>
            <label class="block text-xs font-bold text-on-surface-variant mb-1">Deadline</label>
            <input
              v-model="editDeadline"
              type="date"
              class="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-xl p-3 text-on-surface"
            />
            <label class="block text-xs font-bold text-on-surface-variant mb-1 mt-4">Estimated Hours</label>
            <input
              v-model.number="editEstimatedHours"
              type="number"
              min="0"
              step="0.5"
              class="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-xl p-3 text-on-surface"
              placeholder="e.g. 40"
            />
          </div>
        </div>
      </div>

      <div class="grid grid-cols-12 gap-8">
        <!-- Main content -->
        <div class="col-span-12 lg:col-span-8 space-y-8">
          <!-- Task Overview -->
          <div class="bg-surface-container-low rounded-2xl p-8 relative overflow-hidden group">
            <div class="absolute top-0 left-0 w-1 h-full bg-primary/50"></div>
            <div class="flex justify-between items-start mb-6">
              <h3 class="text-xs font-bold uppercase tracking-widest text-slate-500">
                Task Overview
              </h3>
            </div>
            <div class="space-y-6">
              <div class="space-y-3">
                <h4 class="text-lg font-semibold text-white">Project Description</h4>
                <p class="text-on-surface-variant leading-relaxed">
                  {{ taskData.description || 'No description provided for this task.' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Sub-Tasks -->
          <div class="bg-surface-container-low rounded-2xl overflow-hidden">
            <div
              class="px-8 py-6 flex justify-between items-center border-b border-outline-variant/10"
            >
              <h3 class="text-xs font-bold uppercase tracking-widest text-slate-500">
                Sub-Tasks ({{ subTasks.length }})
              </h3>
              <button
                class="flex items-center gap-2 text-primary text-xs font-bold px-4 py-2 hover:bg-primary/10 rounded-xl transition-colors"
              >
                <span class="material-symbols-outlined text-[18px]">add</span>
                Add Sub-Task
              </button>
            </div>
            <div class="p-4 space-y-1">
              <div
                v-for="subTask in subTasks"
                :key="subTask.id"
                class="flex items-center justify-between p-4 hover:bg-surface-bright rounded-2xl group transition-all duration-300"
              >
                <div class="flex items-center gap-4">
                  <span
                    :class="[
                      'material-symbols-outlined',
                      subTask.completed ? 'text-primary' : 'text-slate-600',
                    ]"
                    >{{ subTask.completed ? 'check_circle' : 'radio_button_unchecked' }}</span
                  >
                  <div>
                    <p class="text-sm font-semibold text-white">{{ subTask.text }}</p>
                    <p class="text-[10px] text-slate-500">
                      {{ subTask.assignee ? `Assigned to: ${subTask.assignee.name}` : 'Unassigned' }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center gap-8">
                  <div class="flex -space-x-2">
                    <div
                      v-if="!subTask.assignee"
                      class="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center border-2 border-surface-container-low"
                    >
                      <span class="material-symbols-outlined text-[14px]">person_add</span>
                    </div>
                  </div>
                  <span class="text-xs font-medium text-slate-400">{{ subTask.date }}</span>
                  <span class="material-symbols-outlined text-slate-600 cursor-pointer hover:text-white"
                    >more_vert</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="col-span-12 lg:col-span-4 space-y-8">
          <!-- Progress -->
          <div class="bg-surface-container rounded-2xl p-6 shadow-xl shadow-black/20">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-xs font-bold uppercase tracking-widest text-slate-500">Progress</h3>
              <span class="text-2xl font-['Manrope'] font-bold text-primary">{{ taskProgress }}%</span>
            </div>
            <div class="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden mb-8">
              <div
                class="h-full bg-gradient-to-r from-primary to-primary-container shadow-[0_0_8px_rgba(192,193,255,0.4)]"
                :style="{ width: `${taskProgress}%` }"
              ></div>
            </div>
            <div class="space-y-4">
              <div class="flex items-start gap-4">
                <div class="w-1 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <div class="w-1 h-4 bg-primary rounded-full"></div>
                </div>
                <div>
                  <p class="text-xs font-bold text-white">Current Status</p>
                  <p class="text-[10px] text-slate-500">{{ displayStatus }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Assigned Team -->
          <div class="bg-surface-container rounded-2xl p-6">
            <h3 class="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">
              Assigned Team
            </h3>
            <div v-if="team.length > 0" class="space-y-4">
              <div
                v-for="member in team"
                :key="member.name"
                class="flex items-center justify-between"
              >
                <div class="flex items-center gap-3">
                  <img
                    :alt="member.name"
                    class="w-10 h-10 rounded-2xl"
                    :src="member.image"
                  />
                  <div>
                    <p class="text-sm font-bold text-white">{{ member.name }}</p>
                    <p class="text-[10px] text-slate-500">{{ member.role }}</p>
                  </div>
                </div>
                <span class="material-symbols-outlined text-slate-600 text-[18px]">mail</span>
              </div>
              <div
                class="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-2 -m-2 rounded-xl transition-colors"
              >
                <div
                  class="w-10 h-10 rounded-2xl bg-surface-container-high flex items-center justify-center border-2 border-dashed border-outline-variant/30"
                >
                  <span class="material-symbols-outlined text-slate-500">add</span>
                </div>
                <span class="text-xs font-bold text-slate-500">Invite Member</span>
              </div>
            </div>
            <div v-else class="text-center py-4 text-on-surface-variant">
              <p>No team members assigned</p>
            </div>
          </div>

          <!-- Task Assets -->
          <div class="bg-surface-container rounded-2xl p-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-xs font-bold uppercase tracking-widest text-slate-500">
                Task Assets
              </h3>
              <button class="material-symbols-outlined text-primary">upload_file</button>
            </div>
            <div v-if="taskFiles.length > 0" class="space-y-3">
              <div
                v-for="file in taskFiles"
                :key="file.name"
                class="p-3 bg-surface-container-low rounded-xl flex items-center gap-3 hover:bg-surface-bright cursor-pointer transition-colors group"
              >
                <div
                  :class="[
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    file.type === 'pdf' ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary',
                  ]"
                >
                  <span class="material-symbols-outlined">{{
                    file.type === 'pdf' ? 'picture_as_pdf' : 'photo'
                  }}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-bold text-white truncate">{{ file.name }}</p>
                  <p class="text-[10px] text-slate-500">{{ file.size }} • {{ file.date }}</p>
                </div>
                <span class="material-symbols-outlined text-slate-600 group-hover:text-white"
                  >download</span
                >
              </div>
            </div>
            <div v-else class="text-center py-4 text-on-surface-variant">
              <span class="material-symbols-outlined text-3xl mb-2 opacity-40">folder_open</span>
              <p>No files attached</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Communication feed -->
      <section class="mt-8 grid grid-cols-12 gap-8">
        <div class="col-span-12 lg:col-span-8">
          <div class="bg-surface-container-low rounded-2xl p-8">
            <h3 class="text-xs font-bold uppercase tracking-widest text-slate-500 mb-8">
              Communication Feed
            </h3>
            <div class="space-y-8">
              <div v-for="comment in comments" :key="comment.id" class="flex gap-4">
                <img
                  :alt="comment.user.name"
                  class="w-10 h-10 rounded-full"
                  :src="comment.user.image"
                />
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-sm font-bold text-white">{{ comment.user.name }}</span>
                    <span class="text-[10px] text-slate-500 uppercase tracking-widest">{{
                      comment.time
                    }}</span>
                  </div>
                  <div
                    v-if="comment.text"
                    class="p-4 bg-surface-container rounded-2xl border border-outline-variant/10"
                  >
                    <p class="text-sm text-on-surface-variant leading-relaxed">
                      {{ comment.text }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="flex gap-4 items-start pt-6 border-t border-outline-variant/10">
                <img
                  alt="Your avatar"
                  class="w-10 h-10 rounded-full"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsf1Pko62nkckYl6uXlmctXXrmMdamy5JWzDThOnw-MrlfbQLlHDkvXe7XbmP1TtDF39e7To_7yI2RgNdavOv7AW2TzN562-wdW8lBYz05lPkj-VJ6koj-aLWmSLpWZukqfQ47wTnX48M-8P1VIOTyg"
                />
                <div class="flex-1 relative">
                  <textarea
                    v-model="newComment"
                    class="w-full bg-surface-container-high border-none rounded-2xl p-4 text-sm focus:ring-1 focus:ring-primary h-24 resize-none placeholder-slate-500 text-on-surface"
                    placeholder="Write a comment..."
                  ></textarea>
                  <div class="absolute bottom-3 right-3 flex items-center gap-3">
                    <button class="p-2 text-slate-500 hover:text-white transition-colors">
                      <span class="material-symbols-outlined text-[20px]">attach_file</span>
                    </button>
                    <button
                      class="bg-primary text-on-primary px-4 py-2 rounded-xl text-xs font-bold active:scale-95 transition-all"
                    >
                      Post Comment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Activity Timeline -->
        <div class="col-span-12 lg:col-span-4">
          <div class="bg-surface-container-low rounded-2xl p-6">
            <h3 class="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">
              Activity Timeline
            </h3>
            <div
              class="relative space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-outline-variant/20"
            >
              <div
                v-for="activity in activities"
                :key="activity.title"
                class="relative pl-8"
              >
                <div
                  :class="[
                    'absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center',
                    activity.by === 'Alex Rivera'
                      ? 'bg-primary/20'
                      : activity.by === 'Marcus Thornton'
                        ? 'bg-tertiary/20'
                        : 'bg-slate-800',
                  ]"
                >
                  <div
                    :class="[
                      'w-2 h-2 rounded-full',
                      activity.by === 'Alex Rivera'
                        ? 'bg-primary'
                        : activity.by === 'Marcus Thornton'
                          ? 'bg-tertiary'
                          : 'bg-slate-600',
                    ]"
                  ></div>
                </div>
                <p class="text-xs font-bold text-white">{{ activity.title }}</p>
                <p class="text-[10px] text-slate-500">
                  {{ activity.by }}{{ activity.by ? ' • ' : '' }}{{ activity.date }}
                </p>
              </div>
            </div>
            <button
              class="w-full mt-8 py-3 bg-surface-container hover:bg-surface-bright rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-500 transition-colors"
            >
              View Full History
            </button>
          </div>
        </div>
      </section>
    </div>

    <!-- Empty state -->
    <div v-else class="flex items-center justify-center min-h-[50vh]">
      <div class="text-center">
        <span class="material-symbols-outlined text-6xl text-on-surface-variant opacity-40"
          >task_alt</span
        >
        <p class="mt-4 text-on-surface-variant">No task selected</p>
      </div>
    </div>
  </main>

  <footer
    class="mt-12 px-12 py-6 border-t border-outline-variant/15 bg-surface flex flex-col md:flex-row items-center justify-between gap-4"
  >
    <p class="text-[10px] font-bold uppercase tracking-widest text-slate-500">
      © 2024 Obsidian Architect • System Status: <span class="text-success">Operational</span>
    </p>
    <div class="flex gap-4 items-center">
      <span
        class="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.4)]"
      ></span>
      <span class="text-[10px] font-bold uppercase tracking-widest text-slate-500"
        >Region: Global-Alpha-1</span
      >
    </div>
  </footer>
</template>
