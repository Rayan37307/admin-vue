<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTasksStore } from '../../stores/tasks'
import type { CreateTaskRequest } from '../../api/tasks'

const router = useRouter()
const store = useTasksStore()

const currentStep = ref(1)
const totalSteps = 4

// Step 1: Task Info
const taskInfo = ref({
  name: '',
  projectId: undefined as number | undefined,
  dueDate: '',
  description: '',
  priority: 'medium' as CreateTaskRequest['priority'],
  status: 'todo' as CreateTaskRequest['status'],
})

// Step 2: Team
interface TeamMember {
  id: number
  name: string
  role: string
  selectedRole: string
  image: string
}

const teamMembers = ref<TeamMember[]>([
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'Lead Designer',
    selectedRole: 'Assignee',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuABwLADuIAIy2Nii3z-Xph4N0XKDEayyFfJpdl6fK449ZuF_X1ziDBGtOwuRK0F65NVU_nNbQeBOMbbENC9eK-VRpVQ9UEwmmultq8NWX5VOOCSheuplv9WiUSQ_TCwNl13aOs6oZRyNL7REE9VKoEpNSv-aXDFkMwJz4Mum6MJVqsJ2w99ADXazSiiOZP-Od4MCplcAmJhLYzmK_e1YBsF3GEOqYd3EjtWRohEaw3sTyy30HFuyVleVeg19rNjtL6zNdwlEkXSfVYoY',
  },
  {
    id: 2,
    name: 'Marcus Wright',
    role: 'QA Engineer',
    selectedRole: 'Observer',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDZPfhQqZi32zsYHmooc6cGrrWMo9zCxsr1GTK9y6O940VGqHaSEyM5lk0oQF65NVU_nNbQeBOMbbENC9eK-VRpVQ9UEwmmultq8NWX5VOOCSheuplv9WiUSQ_TCwNl13aOs6oZRyNL7REE9VKoEpNSv-aXDFkMwJz4Mum6MJVqsJ2w99ADXazSiiOZP-Od4MCplcAmJhLYzmK_e1YBsF3GEOqYd3EjtWRohEaw3sTyy30HFuyVleVeg19rNjtL6zNdwlEkXSfVYoY',
  },
])

// Step 3: Sub-Tasks
interface SubTask {
  id: number
  text: string
  completed: boolean
}

const subTasks = ref<SubTask[]>([
  { id: 1, text: '', completed: false },
])

// Step 4: Notifications
const notifyTeam = ref(true)
const notifyClient = ref(false)

// Validation
const formErrors = ref<Record<string, string>>({})
const showSuccess = ref(false)
const successMessage = ref('')

// Computed: primary assignee
const primaryAssignee = computed(() => {
  const assignee = teamMembers.value.find((m) => m.selectedRole === 'Assignee')
  return assignee ? assignee.id : undefined
})

// Computed: project name display
const projectNames: Record<number, string> = {
  1: 'Obsidian Arch Redesign',
  2: 'Cloud Infrastructure Migration',
  3: 'Client Portal Beta',
}

const projectNameDisplay = computed(() => {
  if (!taskInfo.value.projectId) return ''
  return projectNames[taskInfo.value.projectId] || ''
})

// Computed: completed subtask count
const completedSubtaskCount = computed(() => {
  return subTasks.value.filter((st) => st.text.trim() && st.completed).length
})

const totalSubtaskCount = computed(() => {
  return subTasks.value.filter((st) => st.text.trim()).length
})

// Step navigation
function canProceedToNext(): boolean {
  if (currentStep.value === 1) {
    return taskInfo.value.name.trim().length > 0
  }
  return true
}

function nextStep() {
  if (canProceedToNext() && currentStep.value < totalSteps) {
    currentStep.value++
  }
}

function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

function goToStep(step: number) {
  if (step <= currentStep.value || canProceedToNext()) {
    currentStep.value = step
  }
}

// Add subtask
function addSubTask() {
  const newId = Math.max(...subTasks.value.map((st) => st.id), 0) + 1
  subTasks.value.push({ id: newId, text: '', completed: false })
}

// Remove team member
function removeTeamMember(index: number) {
  teamMembers.value.splice(index, 1)
}

// Priority mapping for UI buttons
const priorityButtons = [
  { label: 'High', value: 'high' as const },
  { label: 'Medium', value: 'medium' as const },
  { label: 'Low', value: 'low' as const },
]

// Priority class helper
function getPriorityClass(priority: string) {
  switch (priority) {
    case 'high':
      return 'border-red-500/20 text-red-400 bg-red-500/5'
    case 'medium':
      return 'border-primary/20 text-primary bg-primary/5 ring-1 ring-primary/40'
    case 'low':
      return 'border-slate-500/20 text-slate-400 bg-slate-500/5'
    default:
      return 'border-slate-500/20 text-slate-400 bg-slate-500/5'
  }
}

// Validation
function validateForm(): boolean {
  formErrors.value = {}

  if (!taskInfo.value.name.trim()) {
    formErrors.value.name = 'Task name is required'
  }

  if (!taskInfo.value.projectId) {
    formErrors.value.project = 'Project selection is required'
  }

  if (taskInfo.value.dueDate) {
    const selectedDate = new Date(taskInfo.value.dueDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (selectedDate < today) {
      formErrors.value.dueDate = 'Due date cannot be in the past'
    }
  }

  return Object.keys(formErrors.value).length === 0
}

// Submit form (from final review step)
async function handleSubmit() {
  if (!validateForm()) return

  const taskData: CreateTaskRequest = {
    title: taskInfo.value.name.trim(),
    description: taskInfo.value.description.trim() || undefined,
    project_id: taskInfo.value.projectId,
    priority: taskInfo.value.priority,
    status: taskInfo.value.status,
    deadline: taskInfo.value.dueDate || undefined,
    assigned_to: primaryAssignee.value,
  }

  const createdTask = await store.createTaskAction(taskData)

  if (createdTask) {
    showSuccess.value = true
    successMessage.value = `Task "${createdTask.title}" created successfully!`

    // Redirect after short delay
    setTimeout(() => {
      router.push('/tasks')
    }, 2000)
  }
}

function dismissSuccess() {
  showSuccess.value = false
  successMessage.value = ''
}
</script>

<template>
  <main class="min-h-screen bg-surface p-12">
    <!-- Success toast -->
    <div
      v-if="showSuccess"
      class="fixed top-6 right-6 z-50 bg-success-container text-on-success-container px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3"
    >
      <span class="material-symbols-outlined">check_circle</span>
      <span class="font-medium">{{ successMessage }}</span>
      <button class="ml-2 hover:opacity-70" @click="dismissSuccess()">
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>

    <!-- Error banner -->
    <div
      v-if="store.creatingTaskError"
      class="mb-6 bg-error-container text-on-error-container px-6 py-4 rounded-xl flex items-center gap-3"
    >
      <span class="material-symbols-outlined">error</span>
      <span>{{ store.creatingTaskError }}</span>
      <button class="ml-auto hover:opacity-70" @click="store.creatingTaskError = null">
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>

    <div class="mb-10 flex justify-between items-end">
      <div>
        <nav
          class="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-[0.15em] font-bold mb-3"
        >
          <span>Dashboard</span>
          <span class="material-symbols-outlined text-[12px]">chevron_right</span>
          <span>Tasks</span>
          <span class="material-symbols-outlined text-[12px]">chevron_right</span>
          <span class="text-primary">Assign New Task</span>
        </nav>
        <h2 class="text-4xl font-light font-headline tracking-tight text-on-surface">
          Assign New Task
        </h2>
      </div>
      <div class="flex items-center gap-4 text-sm">
        <div class="flex flex-col items-end">
          <span class="text-slate-500 text-[10px] font-bold tracking-widest uppercase"
            >Auto-Save</span
          >
          <span class="text-primary font-medium">Enabled</span>
        </div>
      </div>
    </div>

    <!-- Step indicator -->
    <div class="mb-12">
      <div class="flex items-center justify-between relative max-w-4xl">
        <div class="absolute top-5 left-0 w-full h-[2px] bg-surface-container-highest z-0"></div>
        <div
          class="absolute top-5 left-0 h-[2px] bg-primary z-0"
          :style="{ width: `${(currentStep / totalSteps) * 100}%` }"
        ></div>
        <div
          v-for="step in totalSteps"
          :key="step"
          class="relative z-10 flex flex-col items-center gap-3 cursor-pointer"
          @click="goToStep(step)"
        >
          <div
            :class="[
              'w-10 h-10 rounded-full flex items-center justify-center font-bold ring-4 ring-background',
              step <= currentStep
                ? 'bg-primary text-on-primary-container'
                : 'bg-surface-container-highest text-slate-400',
            ]"
          >
            {{ step }}
          </div>
          <span
            :class="[
              'text-xs font-bold uppercase tracking-wider',
              step <= currentStep ? 'text-primary' : 'text-slate-500',
            ]"
          >
            {{
              step === 1 ? 'Task Info' : step === 2 ? 'Team' : step === 3 ? 'Sub-Tasks' : 'Review'
            }}
          </span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-12 gap-10 items-start">
      <!-- Main content -->
      <div class="col-span-8 space-y-8">
        <!-- Step 1: Task Information -->
        <section
          v-if="currentStep === 1"
          class="bg-surface-container-low rounded-3xl p-8 relative overflow-hidden group"
        >
          <div
            class="absolute top-0 left-0 w-[2px] h-full bg-primary/40 group-hover:bg-primary transition-colors"
          ></div>
          <div class="flex items-center gap-3 mb-8">
            <span class="material-symbols-outlined text-primary">description</span>
            <h3 class="text-xl font-semibold font-headline text-on-surface">Task Information</h3>
          </div>
          <div class="grid grid-cols-2 gap-6">
            <div class="col-span-2">
              <label
                class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2"
                >Task Name</label
              >
              <input
                v-model="taskInfo.name"
                class="w-full bg-surface-container rounded-xl border border-outline-variant/15 py-3 px-4 focus:ring-1 focus:ring-primary"
                :class="{ 'border-error/30': formErrors.name }"
                placeholder="e.g., Q3 Financial Audit Review"
                type="text"
              />
              <p v-if="formErrors.name" class="text-error text-sm mt-1">{{ formErrors.name }}</p>
            </div>
            <div>
              <label
                class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2"
                >Project Selection</label
              >
              <div class="relative">
                <select
                  v-model="taskInfo.projectId"
                  class="w-full appearance-none bg-surface-container rounded-xl border border-outline-variant/15 py-3 px-4 focus:ring-1 focus:ring-primary"
                  :class="{ 'border-error/30': formErrors.project }"
                >
                  <option :value="undefined">Select a project</option>
                  <option :value="1">Obsidian Arch Redesign</option>
                  <option :value="2">Cloud Infrastructure Migration</option>
                  <option :value="3">Client Portal Beta</option>
                </select>
                <span
                  class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500"
                  >expand_more</span
                >
              </div>
              <p v-if="formErrors.project" class="text-error text-sm mt-1">
                {{ formErrors.project }}
              </p>
            </div>
            <div>
              <label
                class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2"
                >Due Date</label
              >
              <div class="relative">
                <input
                  v-model="taskInfo.dueDate"
                  class="w-full bg-surface-container rounded-xl border border-outline-variant/15 py-3 px-4 focus:ring-1 focus:ring-primary"
                  :class="{ 'border-error/30': formErrors.dueDate }"
                  type="date"
                />
                <span
                  class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500"
                  >calendar_today</span
                >
              </div>
              <p v-if="formErrors.dueDate" class="text-error text-sm mt-1">
                {{ formErrors.dueDate }}
              </p>
            </div>
            <div class="col-span-2">
              <label
                class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2"
                >Short Description</label
              >
              <textarea
                v-model="taskInfo.description"
                class="w-full bg-surface-container rounded-xl border border-outline-variant/15 py-3 px-4 focus:ring-1 focus:ring-primary"
                placeholder="Briefly describe the task objectives..."
                rows="4"
              ></textarea>
            </div>
            <div>
              <label
                class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2"
                >Priority</label
              >
              <div class="flex gap-2">
                <button
                  v-for="p in priorityButtons"
                  :key="p.value"
                  :class="[
                    'flex-1 py-2 rounded-lg border text-xs font-bold uppercase tracking-wider transition-colors',
                    taskInfo.priority === p.value
                      ? getPriorityClass(p.value)
                      : 'border-slate-500/20 text-slate-400 bg-slate-500/5 hover:bg-slate-500/10',
                  ]"
                  @click="taskInfo.priority = p.value"
                >
                  {{ p.label }}
                </button>
              </div>
            </div>
            <div>
              <label
                class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2"
                >Initial Status</label
              >
              <div class="relative">
                <select
                  v-model="taskInfo.status"
                  class="w-full appearance-none bg-surface-container rounded-xl border border-outline-variant/15 py-3 px-4 focus:ring-1 focus:ring-primary"
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                </select>
                <span
                  class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500"
                  >unfold_more</span
                >
              </div>
            </div>
          </div>
        </section>

        <!-- Step 2: Team -->
        <section
          v-if="currentStep === 2"
          class="bg-surface-container-low rounded-3xl p-8 relative overflow-hidden group"
        >
          <div
            class="absolute top-0 left-0 w-[2px] h-full bg-primary/40 group-hover:bg-primary transition-colors"
          ></div>
          <div class="flex items-center justify-between mb-8">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-primary">group</span>
              <h3 class="text-xl font-semibold font-headline text-on-surface">Assign Team</h3>
            </div>
            <button
              class="text-primary text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <span class="material-symbols-outlined text-sm">person_add</span>
              Invite Member
            </button>
          </div>
          <div class="space-y-4">
            <div
              v-for="(member, index) in teamMembers"
              :key="member.name"
              class="flex items-center justify-between p-4 bg-surface-container rounded-2xl border border-outline-variant/5"
            >
              <div class="flex items-center gap-4">
                <img
                  :alt="member.name"
                  class="w-10 h-10 rounded-full"
                  :src="member.image"
                />
                <div>
                  <p class="text-sm font-semibold text-on-surface">{{ member.name }}</p>
                  <p class="text-[10px] text-slate-500 uppercase tracking-wider">
                    {{ member.role }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-8">
                <div class="w-40">
                  <select
                    v-model="member.selectedRole"
                    class="w-full bg-surface-container-low border-none text-xs font-medium rounded-lg focus:ring-1 focus:ring-primary"
                  >
                    <option>Approver</option>
                    <option>Assignee</option>
                    <option>Observer</option>
                  </select>
                </div>
                <button
                  class="text-slate-500 hover:text-error transition-colors"
                  @click="removeTeamMember(index)"
                >
                  <span class="material-symbols-outlined text-lg">close</span>
                </button>
              </div>
            </div>
            <div
              class="p-4 border-2 border-dashed border-outline-variant/20 rounded-2xl flex items-center justify-center gap-2 text-slate-500 hover:border-primary/40 hover:text-primary transition-all cursor-pointer"
            >
              <span class="material-symbols-outlined">add_circle</span>
              <span class="text-sm font-medium">Add another team member</span>
            </div>
          </div>
        </section>

        <!-- Step 3: Sub-Tasks -->
        <section
          v-if="currentStep === 3"
          class="bg-surface-container-low rounded-3xl p-8 relative overflow-hidden group"
        >
          <div
            class="absolute top-0 left-0 w-[2px] h-full bg-primary/40 group-hover:bg-primary transition-colors"
          ></div>
          <div class="flex items-center gap-3 mb-8">
            <span class="material-symbols-outlined text-primary">checklist</span>
            <h3 class="text-xl font-semibold font-headline text-on-surface">Sub-Tasks</h3>
          </div>
          <div class="space-y-3">
            <div
              v-for="subTask in subTasks"
              :key="subTask.id"
              class="flex items-center gap-4 p-4 bg-surface-container rounded-2xl group/item"
            >
              <div
                :class="[
                  'w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer',
                  subTask.completed
                    ? 'border-primary/40 bg-primary/20'
                    : 'border-primary/40',
                ]"
                @click="subTask.completed = !subTask.completed"
              >
                <span
                  v-if="subTask.completed"
                  class="material-symbols-outlined text-primary text-sm"
                  >check</span
                >
              </div>
              <input
                v-model="subTask.text"
                :class="[
                  'flex-1 bg-transparent border-none text-sm p-0 focus:ring-0',
                  !subTask.text ? 'placeholder:text-slate-600' : '',
                ]"
                :placeholder="subTask.id === subTasks[subTasks.length - 1]?.id ? 'Add new sub-task...' : ''"
                type="text"
              />
              <button class="opacity-0 group-hover/item:opacity-100 transition-opacity text-slate-500">
                <span class="material-symbols-outlined text-lg">drag_indicator</span>
              </button>
            </div>
            <button
              class="w-full py-3 border-2 border-dashed border-outline-variant/20 rounded-2xl text-slate-500 hover:border-primary/40 hover:text-primary transition-all flex items-center justify-center gap-2"
              @click="addSubTask()"
            >
              <span class="material-symbols-outlined">add_circle</span>
              <span class="text-sm font-medium">Add sub-task</span>
            </button>
          </div>
        </section>

        <!-- Step 4: Notification Preferences -->
        <section
          v-if="currentStep === 4"
          class="bg-surface-container-low rounded-3xl p-8 relative overflow-hidden group"
        >
          <div
            class="absolute top-0 left-0 w-[2px] h-full bg-primary/40 group-hover:bg-primary transition-colors"
          ></div>
          <div class="flex items-center gap-3 mb-8">
            <span class="material-symbols-outlined text-primary">notifications_active</span>
            <h3 class="text-xl font-semibold font-headline text-on-surface">
              Notification Preferences
            </h3>
          </div>
          <div class="space-y-6">
            <label
              class="flex items-center justify-between p-4 bg-surface-container rounded-2xl cursor-pointer"
            >
              <div class="flex items-center gap-4">
                <div
                  class="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary"
                >
                  <span class="material-symbols-outlined">group</span>
                </div>
                <div>
                  <p class="text-sm font-semibold text-on-surface">Notify internal team</p>
                  <p class="text-xs text-slate-500">
                    Send instant Slack &amp; Email notification to assignees
                  </p>
                </div>
              </div>
              <input
                v-model="notifyTeam"
                class="w-6 h-6 rounded-md bg-surface-container-low border border-outline-variant/30 text-primary focus:ring-primary/20"
                type="checkbox"
              />
            </label>
            <label
              class="flex items-center justify-between p-4 bg-surface-container rounded-2xl cursor-pointer"
            >
              <div class="flex items-center gap-4">
                <div
                  class="w-10 h-10 bg-tertiary/10 rounded-xl flex items-center justify-center text-tertiary"
                >
                  <span class="material-symbols-outlined">person_outline</span>
                </div>
                <div>
                  <p class="text-sm font-semibold text-on-surface">Notify client contact</p>
                  <p class="text-xs text-slate-500">
                    Email task creation summary to project stakeholders
                  </p>
                </div>
              </div>
              <input
                v-model="notifyClient"
                class="w-6 h-6 rounded-md bg-surface-container-low border border-outline-variant/30 text-primary focus:ring-primary/20"
                type="checkbox"
              />
            </label>
          </div>
        </section>

        <!-- Navigation buttons -->
        <div class="flex justify-between">
          <button
            v-if="currentStep > 1"
            class="px-6 py-2.5 rounded-xl bg-surface-container border border-outline-variant/20 text-on-surface hover:bg-surface-container-high transition-all flex items-center gap-2"
            @click="prevStep()"
          >
            <span class="material-symbols-outlined text-lg">chevron_left</span>
            Previous
          </button>
          <div v-else></div>

          <button
            v-if="currentStep < totalSteps"
            class="px-8 py-2.5 rounded-xl bg-gradient-to-br from-[#c0c1ff] to-[#8083ff] text-[#0f131d] font-bold shadow-[0_0_20px_rgba(192,193,255,0.3)] hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!canProceedToNext()"
            @click="nextStep()"
          >
            Next
            <span class="material-symbols-outlined text-lg">chevron_right</span>
          </button>
          <button
            v-else
            class="px-8 py-2.5 rounded-xl bg-gradient-to-br from-[#c0c1ff] to-[#8083ff] text-[#0f131d] font-bold shadow-[0_0_20px_rgba(192,193,255,0.3)] hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            :disabled="store.creatingTask"
            @click="handleSubmit()"
          >
            <span
              v-if="store.creatingTask"
              class="material-symbols-outlined text-lg animate-spin"
              >progress_activity</span
            >
            {{ store.creatingTask ? 'Creating...' : 'Create & Assign' }}
          </button>
        </div>
      </div>

      <!-- Sidebar: Live Summary -->
      <div class="col-span-4 sticky top-24">
        <div class="bg-surface-container-highest rounded-3xl overflow-hidden shadow-2xl shadow-black/40 border border-outline-variant/5">
          <div class="p-6 bg-primary/5 border-b border-outline-variant/10">
            <h3 class="text-sm font-bold uppercase tracking-[0.2em] text-primary">Live Summary</h3>
          </div>
          <div class="p-8 space-y-8">
            <!-- Task Context -->
            <div>
              <span
                class="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-2"
                >Task Context</span
              >
              <div class="space-y-1">
                <p
                  class="text-lg font-headline font-semibold text-on-surface leading-tight"
                >
                  {{ taskInfo.name || 'Untitled Task' }}
                </p>
                <p
                  v-if="projectNameDisplay"
                  class="text-xs text-primary flex items-center gap-1"
                >
                  <span class="material-symbols-outlined text-[14px]">folder_zip</span>
                  {{ projectNameDisplay }}
                </p>
              </div>
            </div>

            <!-- Due Date & Priority -->
            <div class="grid grid-cols-2 gap-6">
              <div>
                <span
                  class="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-1"
                  >Due Date</span
                >
                <p class="text-sm font-medium text-on-surface">
                  {{
                    taskInfo.dueDate
                      ? new Date(taskInfo.dueDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : 'Not set'
                  }}
                </p>
              </div>
              <div>
                <span
                  class="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-1"
                  >Priority</span
                >
                <span
                  class="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-primary/20 text-primary uppercase"
                  >{{ taskInfo.priority }}</span
                >
              </div>
            </div>

            <!-- Assigned team avatars -->
            <div>
              <span
                class="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-3"
                >Assigned ({{ teamMembers.length }})</span
              >
              <div class="flex -space-x-3">
                <img
                  v-for="member in teamMembers"
                  :key="member.name"
                  :alt="member.name"
                  class="w-10 h-10 rounded-full border-4 border-surface-container-highest"
                  :src="member.image"
                />
              </div>
            </div>

            <!-- Sub-tasks progress -->
            <div class="pt-6 border-t border-outline-variant/10">
              <div class="flex justify-between items-center mb-4">
                <span class="text-xs text-slate-500">Sub-tasks completed</span>
                <span class="text-xs font-bold"
                  >{{ completedSubtaskCount }} / {{ totalSubtaskCount }}</span
                >
              </div>
              <div class="h-1.5 w-full bg-surface-container-low rounded-full overflow-hidden">
                <div
                  class="h-full bg-primary/20 rounded-full"
                  :style="{
                    width:
                      totalSubtaskCount > 0
                        ? `${(completedSubtaskCount / totalSubtaskCount) * 100}%`
                        : '0%',
                  }"
                ></div>
              </div>
            </div>

            <!-- Info note -->
            <div class="p-4 bg-tertiary/5 rounded-2xl border border-tertiary/10">
              <div class="flex gap-3">
                <span class="material-symbols-outlined text-tertiary">info</span>
                <p class="text-xs text-tertiary/80 leading-relaxed">
                  Notifications will be sent immediately upon confirmation.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Estimated effort -->
        <div class="mt-6 p-6 bg-surface-container-low rounded-3xl flex items-center gap-4">
          <div
            class="w-12 h-12 bg-surface-container rounded-2xl flex items-center justify-center text-primary border border-outline-variant/10"
          >
            <span class="material-symbols-outlined text-3xl">timer</span>
          </div>
          <div>
            <p class="text-xs font-bold uppercase tracking-widest text-slate-500">
              Estimated Effort
            </p>
            <p class="text-lg font-headline font-semibold text-on-surface">12 - 16 Hours</p>
          </div>
        </div>
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
