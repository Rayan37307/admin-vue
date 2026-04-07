<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTasksStore } from '../../stores/tasks'
import type { CreateTaskRequest } from '../../api/tasks'

const router = useRouter()
const store = useTasksStore()

// Form state
const taskTitle = ref('')
const taskDescription = ref('')
const selectedProject = ref<number | undefined>(undefined)
const selectedPriority = ref<'low' | 'medium' | 'high' | 'urgent'>('medium')
const assigneeSearch = ref('')
const selectedAssignee = ref<number | undefined>(undefined)
const deadline = ref('')

// Validation errors
const formErrors = ref<Record<string, string>>({})
const showSuccess = ref(false)
const successMessage = ref('')

// Mock assignees (will be replaced with API fetch later)
const assignees = ref([
  {
    id: 1,
    name: 'Marcus Vane',
    role: 'Lead Architect',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAJ1oYDDv-P_YnLa3MTyyEaTO71mIPTAiNnYkdc0eiFDR4_c1IOSQ6iombBv_FIkfCd1Q4jkHh9xKPinIpTw1DS4J-YGyUqSnwm_13uUdt7q2BbrXAWt-V1385DzWMesM7I6O66xz8v6QrrrK4S5ZyZTTmIDHeWUqu87Jx2FxVnw1YBR6W2C0WYB3OdQkd1mLMZKTVindP-tvrE4JdBW92g3IUWEzpox2X2Y9XPgW_8sa76Xi7rc8Pb0pGRJ9BVp-2IIVb-1DrdRPk',
  },
  {
    id: 2,
    name: 'Elena Ross',
    role: 'Frontend Specialist',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDfd48FUMrb1ucYeCmoZggFUGJ182wzi1OjSVgZZQ-cTqsMjoI0YbokBzvbtujMiqWDLdgIaAhlvmi6hGnjCWcaQXcvOVNmsWxw-fvxHd2iF7Jrv8bEt8mQSV_z8fKSqzIKjCbnbPuuXiL0QKticUQsiz-IvIp-japFiwqoAZ5NfT7uH1A2g97dgYR-jnshdYTJp4osfoa-7ik1uXrqG2QBDtegNqns7EzAKpM9OwjhQ6fdqeQFNvgdoyXxE5rIQCACoJ84IWRCs',
  },
])

const priorities = [
  { label: 'Low', value: 'low' as const },
  { label: 'Medium', value: 'medium' as const },
  { label: 'High', value: 'high' as const },
  { label: 'Critical', value: 'urgent' as const },
]

// Validation
function validateForm(): boolean {
  formErrors.value = {}

  if (!taskTitle.value.trim()) {
    formErrors.value.title = 'Task title is required'
  }

  if (taskTitle.value.trim().length > 255) {
    formErrors.value.title = 'Task title must be less than 255 characters'
  }

  if (deadline.value) {
    const selectedDate = new Date(deadline.value)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (selectedDate < today) {
      formErrors.value.deadline = 'Deadline cannot be in the past'
    }
  }

  return Object.keys(formErrors.value).length === 0
}

// Submit form
async function handleSubmit() {
  if (!validateForm()) return

  const taskData: CreateTaskRequest = {
    title: taskTitle.value.trim(),
    description: taskDescription.value.trim() || undefined,
    project_id: selectedProject.value,
    priority: selectedPriority.value,
    deadline: deadline.value || undefined,
    assigned_to: selectedAssignee.value,
    status: 'todo',
  }

  const createdTask = await store.createTaskAction(taskData)

  if (createdTask) {
    showSuccess.value = true
    successMessage.value = `Task "${createdTask.title}" created successfully!`

    // Reset form
    taskTitle.value = ''
    taskDescription.value = ''
    selectedProject.value = undefined
    selectedPriority.value = 'medium'
    selectedAssignee.value = undefined
    deadline.value = ''

    // Redirect after short delay
    setTimeout(() => {
      router.push('/tasks')
    }, 2000)
  }
}

// Save as draft
function handleDraft() {
  // For now, just show a message. Could save to localStorage.
  showSuccess.value = true
  successMessage.value = 'Draft saved successfully!'
}

function dismissSuccess() {
  showSuccess.value = false
  successMessage.value = ''
}
</script>

<template>
  <main class="min-h-screen bg-surface pb-12 px-8">
    <!-- Success toast -->
    <div
      v-if="showSuccess"
      class="fixed top-6 right-6 z-50 bg-success-container text-on-success-container px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-in"
    >
      <span class="material-symbols-outlined">check_circle</span>
      <span class="font-medium">{{ successMessage }}</span>
      <button class="ml-2 hover:opacity-70" @click="dismissSuccess()">
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>

    <div class="max-w-6xl mx-auto pt-8">
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

      <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div class="space-y-2">
          <span class="text-primary tracking-widest text-xs font-bold uppercase"
            >Deployment Phase II</span
          >
          <h1 class="text-5xl font-['Syne'] font-extrabold tracking-tighter text-on-surface">
            Assign New Task
          </h1>
          <p class="text-on-surface-variant max-w-lg">
            Distribute workloads across the neural grid. Precision assignments ensure architectural integrity.
          </p>
        </div>
        <div class="flex gap-4">
          <button
            class="px-6 py-2.5 rounded-xl bg-surface-container border border-outline-variant/20 text-on-surface hover:bg-surface-container-high transition-all flex items-center gap-2"
            :disabled="store.creatingTask"
            @click="handleDraft()"
          >
            <span class="material-symbols-outlined text-lg">save</span>
            Draft
          </button>
          <button
            class="px-8 py-2.5 rounded-xl bg-gradient-to-br from-[#c0c1ff] to-[#8083ff] text-[#0f131d] font-bold shadow-[0_0_20px_rgba(192,193,255,0.3)] hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="store.creatingTask"
            @click="handleSubmit()"
          >
            <span v-if="store.creatingTask" class="material-symbols-outlined text-lg animate-spin mr-2"
              >progress_activity</span
            >
            {{ store.creatingTask ? 'Creating...' : 'Assign Task' }}
          </button>
        </div>
      </div>

      <div class="grid grid-cols-12 gap-6">
        <!-- Main form -->
        <div class="col-span-12 lg:col-span-8 space-y-6">
          <!-- Title & Description -->
          <div class="bg-surface-container p-8 rounded-[1.5rem] shadow-sm">
            <div class="space-y-6">
              <!-- Title -->
              <div class="group">
                <label
                  class="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2 ml-1"
                  >Task Title</label
                >
                <input
                  v-model="taskTitle"
                  class="w-full bg-gray-800 border-none rounded-xl p-4 text-xl font-semibold text-on-surface focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-outline/30"
                  :class="{ 'ring-2 ring-error/40': formErrors.title }"
                  placeholder="e.g., Optimize Kernel Subsystems"
                  type="text"
                />
                <p v-if="formErrors.title" class="text-error text-sm mt-1 ml-1">
                  {{ formErrors.title }}
                </p>
              </div>

              <!-- Description -->
              <div class="group">
                <label
                  class="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2 ml-1"
                  >Rich Description</label
                >
                <div
                  class="bg-surface-container-lowest rounded-xl border-none overflow-hidden"
                >
                  <div
                    class="flex items-center gap-1 p-2 border-b border-outline-variant/10 bg-surface-container-low/50"
                  >
                    <button
                      class="p-2 hover:bg-surface-container-highest rounded-lg text-on-surface-variant material-symbols-outlined text-lg"
                    >
                      format_bold
                    </button>
                    <button
                      class="p-2 hover:bg-surface-container-highest rounded-lg text-on-surface-variant material-symbols-outlined text-lg"
                    >
                      format_italic
                    </button>
                    <button
                      class="p-2 hover:bg-surface-container-highest rounded-lg text-on-surface-variant material-symbols-outlined text-lg"
                    >
                      format_list_bulleted
                    </button>
                    <div class="w-px h-6 bg-outline-variant/20 mx-1"></div>
                    <button
                      class="p-2 hover:bg-surface-container-highest rounded-lg text-on-surface-variant material-symbols-outlined text-lg"
                    >
                      link
                    </button>
                    <button
                      class="p-2 hover:bg-surface-container-highest rounded-lg text-on-surface-variant material-symbols-outlined text-lg"
                    >
                      image
                    </button>
                    <button
                      class="p-2 hover:bg-surface-container-highest rounded-lg text-on-surface-variant material-symbols-outlined text-lg"
                    >
                      code
                    </button>
                  </div>
                  <textarea
                    v-model="taskDescription"
                    class="w-full bg-transparent border-none focus:ring-0 p-4 text-on-surface-variant leading-relaxed resize-none placeholder:text-outline/30"
                    placeholder="Define the scope and technical requirements..."
                    rows="10"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- Project & Priority -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Project -->
            <div class="bg-surface-container p-6 rounded-[1.5rem]">
              <label
                class="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-4 ml-1"
                >Project Association</label
              >
              <div class="relative group">
                <div
                  class="w-full bg-surface-container-lowest p-4 rounded-xl flex items-center justify-between cursor-pointer group-hover:bg-surface-container-low transition-colors"
                >
                  <div class="flex items-center gap-3">
                    <span class="w-3 h-3 rounded-full bg-tertiary"></span>
                    <span class="text-on-surface">{{ selectedProject ? `Project #${selectedProject}` : 'Select a project' }}</span>
                  </div>
                  <span class="material-symbols-outlined text-on-surface-variant"
                    >expand_more</span
                  >
                </div>
              </div>
              <div class="mt-4 flex flex-wrap gap-2">
                <span
                  class="px-3 py-1 bg-surface-container-highest rounded-full text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter"
                  >Phase 1</span
                >
                <span
                  class="px-3 py-1 bg-surface-container-highest rounded-full text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter"
                  >Security</span
                >
              </div>
            </div>

            <!-- Priority -->
            <div class="bg-surface-container p-6 rounded-[1.5rem]">
              <label
                class="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-4 ml-1"
                >Priority Matrix</label
              >
              <div class="flex gap-2">
                <button
                  v-for="p in priorities"
                  :key="p.value"
                  :class="[
                    'flex-1 py-3 px-2 rounded-xl border text-[10px] font-bold uppercase transition-all',
                    selectedPriority === p.value
                      ? 'bg-primary/10 border-primary/40 text-primary shadow-[0_0_10px_rgba(192,193,255,0.1)]'
                      : 'border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-highest',
                  ]"
                  @click="selectedPriority = p.value"
                >
                  {{ p.label }}
                </button>
              </div>
              <p class="text-[11px] text-on-surface-variant mt-4 italic opacity-60">
                High priority flags bypass standard queue filters.
              </p>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="col-span-12 lg:col-span-4 space-y-6">
          <!-- Assignees -->
          <div class="bg-surface-container p-6 rounded-[1.5rem]">
            <label
              class="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-4 ml-1"
              >Assign To</label
            >
            <div class="relative mb-4">
              <span
                class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg"
                >search</span
              >
              <input
                v-model="assigneeSearch"
                class="w-full bg-gray-800 border-none rounded-xl py-3 pl-12 pr-4 text-sm text-on-surface focus:ring-2 focus:ring-primary/40 transition-all"
                placeholder="Search agents..."
                type="text"
              />
            </div>
            <div class="space-y-3">
              <div
                v-for="assignee in assignees"
                :key="assignee.id"
                :class="[
                  'flex items-center gap-3 p-2 rounded-xl transition-colors cursor-pointer group',
                  selectedAssignee === assignee.id
                    ? 'bg-surface-container-highest/50 border border-primary/20'
                    : 'hover:bg-surface-container-low',
                ]"
                @click="selectedAssignee = assignee.id"
              >
                <img
                  :alt="assignee.name"
                  class="w-10 h-10 rounded-lg"
                  :src="assignee.image"
                />
                <div class="flex-1">
                  <p class="text-sm font-semibold text-on-surface leading-tight">
                    {{ assignee.name }}
                  </p>
                  <p
                    :class="[
                      'text-[10px]',
                      selectedAssignee === assignee.id ? 'text-primary' : 'text-outline',
                    ]"
                  >
                    {{ assignee.role }}
                  </p>
                </div>
                <span
                  v-if="selectedAssignee === assignee.id"
                  class="material-symbols-outlined text-primary text-xl"
                  >check_circle</span
                >
              </div>
            </div>
          </div>

          <!-- Deadline -->
          <div class="bg-surface-container p-6 rounded-[1.5rem]">
            <label
              class="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-4 ml-1"
              >Deadline</label
            >
            <div
              class="bg-surface-container-lowest rounded-xl p-4 flex items-center justify-between border border-outline-variant/10"
              :class="{ 'border-error/30': formErrors.deadline }"
            >
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-primary">calendar_today</span>
                <input
                  v-model="deadline"
                  type="date"
                  class="bg-transparent text-sm font-semibold text-on-surface outline-none"
                />
              </div>
              <button class="material-symbols-outlined text-on-surface-variant hover:text-primary">
                edit_calendar
              </button>
            </div>
            <p v-if="formErrors.deadline" class="text-error text-sm mt-1">
              {{ formErrors.deadline }}
            </p>
            <div
              v-if="deadline"
              class="mt-4 p-4 rounded-xl bg-error-container/10 border border-error/20"
            >
              <div class="flex items-center gap-2 text-error mb-1">
                <span class="material-symbols-outlined text-sm">schedule</span>
                <span class="text-[10px] font-bold uppercase tracking-widest">Urgent Timeline</span>
              </div>
              <p class="text-[11px] text-on-surface-variant">
                Task deadline set to {{ new Date(deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}.
              </p>
            </div>
          </div>

          <!-- Decorative card -->
          <div class="relative overflow-hidden rounded-[1.5rem] bg-surface-container h-48 group">
            <div class="absolute inset-0 z-0">
              <img
                class="w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-[2000ms]"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1K7rJ8zYfeHoYH_f0J6reutH7sp5dmgd2OLJHwbdtnNlMjaiGNQThmWtBF9HoYK0vj0kWj9R8Z5y630qyoIrb5eukj3A520aN1CTNKkzuHy8QkXWT9Xh4V5w3_-in4DAcOASvZhgNi3F0gbz3E1gbl6XBXE5AzulIFwV1uObyiPn-P4m7SvNtMbNEsrWcox-HOcsdoO8tsSqxNLoXoJCDdRT28lNxEyD0RRab_q20zLPhX_q3PZ9tVlFqK2Q3KiFQrQo6b6odrsw"
                alt=""
              />
            </div>
            <div
              class="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent z-10"
            ></div>
            <div class="absolute bottom-6 left-6 z-20">
              <h3 class="font-['Syne'] font-extrabold text-[#c0c1ff] text-xl">System Integrity</h3>
              <p class="text-xs text-on-surface-variant">Monitor task impact in real-time</p>
            </div>
          </div>
        </div>
      </div>

      <footer
        class="mt-12 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-outline-variant/10 pt-8 opacity-60"
      >
        <div
          class="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant"
        >
          <span class="flex items-center gap-1"
            ><span class="w-1 h-1 rounded-full bg-primary"></span> XenonOS Node 7.2</span
          >
          <span class="flex items-center gap-1"
            ><span class="w-1 h-1 rounded-full bg-primary"></span> Secure Protocol Active</span
          >
        </div>
        <div class="text-[10px] font-medium text-on-surface-variant">
          Created by Admin Alpha • Last sync 2m ago
        </div>
      </footer>
    </div>
  </main>
</template>
