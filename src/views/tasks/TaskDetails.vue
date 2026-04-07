<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useTasksStore } from '../../stores/tasks'
import { useTasksStore as tasksStore } from '../../stores/tasks'
import {
  mapStatusToDisplay,
  mapPriorityToDisplay,
  formatDate,
} from '../../api/tasks'

const route = useRoute()
const store = tasksStore()

// Get task ID from route query param or params
const taskId = computed(() => {
  const id = route.query.id || route.params.id
  return id ? Number(id) : null
})

// Progress update state
const isUpdatingProgress = ref(false)
const progressInput = ref<number | null>(null)

// Computed properties mapping store data to template-friendly values
const taskData = computed(() => store.currentTask)
const isLoading = computed(() => store.isCurrentTaskLoading)
const hasError = computed(() => store.hasCurrentTaskError)
const errorMessage = computed(() => store.currentTaskError)

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

const statusBadgeClass = computed(() => {
  if (!taskData.value) return ''
  switch (taskData.value.status) {
    case 'todo': return 'bg-surface-container-highest/50 text-on-surface-variant border border-outline-variant/20'
    case 'in_progress': return 'bg-primary/10 text-primary border border-primary/20'
    case 'review': return 'bg-tertiary/10 text-tertiary border border-tertiary/20'
    case 'completed': return 'bg-success/10 text-success border border-success/20'
    default: return 'bg-surface-container-highest/50 text-on-surface-variant'
  }
})

const priorityBadgeClass = computed(() => {
  if (!taskData.value) return ''
  switch (taskData.value.priority) {
    case 'low': return 'bg-surface-container-highest text-on-surface-variant border border-outline-variant/20'
    case 'medium': return 'bg-tertiary-container/20 text-tertiary border border-tertiary/30'
    case 'high': return 'bg-error-container/20 text-error border border-error/20'
    case 'urgent': return 'bg-error/10 text-error border border-error/20 flex items-center gap-1'
    default: return 'bg-surface-container-highest text-on-surface-variant'
  }
})

// Comments (mock data for now)
const comments = ref([
  {
    id: 1,
    user: {
      name: 'Elena Rodriguez',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6K8TOJyKNdUd541mXwqBKrbUP-50Ie9C_oX4imVDM4Oim-o9aP1LNFRqeJRAG1KhFL6WRFXL25J_CJwu9utR2KihnjWmaL3BwSk4CSf4y1PXrHpm_4_e2NyvnK0Jf4Be7QKaShGYWyIVS9ifez4jjxhB0a3yvvJlxssug9aQBDDD1azf59qUeX_0NjdEWuuNemWjpw2TB4rHyU21j9xIOSxTXSsr0T9wyK-6Sh28S4OaRoAdeR15HhnD0Og2A6Wz_zARgg3kTx2c',
    },
    text: "The gRPC prototypes are looking solid. I've uploaded the initial benchmarks for the service-to-service calls. Let me know if you want to review the protobuf definitions tomorrow.",
    time: '2 hours ago',
    likes: 4,
  },
])

// Activity log (mock data for now)
const activities = ref([
  {
    title: 'Phase 1 Audit Completed',
    by: 'Marcus',
    date: 'Today, 10:45 AM',
    icon: 'check',
    iconClass: 'bg-primary/20 border-primary text-primary',
  },
  {
    title: 'Updated Attachments',
    by: 'Elena',
    date: 'Yesterday, 4:20 PM',
    icon: 'upload_file',
    iconClass: 'bg-surface-container-highest border border-outline-variant/30 text-on-surface-variant',
  },
  {
    title: 'Elena Rodriguez added',
    by: '',
    date: 'Oct 12, 11:00 AM',
    icon: 'person_add',
    iconClass: 'bg-surface-container-highest border border-outline-variant/30 text-on-surface-variant',
  },
  {
    title: 'Task Created',
    by: '',
    date: 'Oct 10, 9:00 AM',
    icon: 'flag',
    iconClass: 'bg-surface-container-highest border border-outline-variant/30 text-on-surface-variant',
  },
])

const newComment = ref('')

async function updateProgress() {
  if (!taskData.value || progressInput.value === null) return
  isUpdatingProgress.value = true
  await store.updateProgressAction(taskData.value.id, progressInput.value)
  isUpdatingProgress.value = false
}

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
</script>

<template>
  <main class="min-h-screen bg-surface p-8">
    <!-- Loading state -->
    <div v-if="isLoading" class="flex items-center justify-center min-h-[50vh]">
      <div class="text-center">
        <span class="material-symbols-outlined text-6xl text-primary animate-spin">progress_activity</span>
        <p class="mt-4 text-on-surface-variant">Loading task details...</p>
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

    <!-- Task content -->
    <div v-else-if="taskData" class="max-w-7xl mx-auto">
      <div class="mb-12">
        <nav class="flex items-center gap-2 text-sm text-on-surface-variant mb-4">
          <span>Tasks</span>
          <span class="material-symbols-outlined text-sm">chevron_right</span>
          <span class="text-primary">#{{ taskData.id }}</span>
        </nav>
        <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <span :class="['px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase', statusBadgeClass]">
                {{ displayStatus }}
              </span>
              <span :class="['px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase', priorityBadgeClass]">
                <span v-if="taskData.priority === 'urgent'" class="material-symbols-outlined text-[14px]">priority_high</span>
                {{ displayPriority }} Priority
              </span>
            </div>
            <h1 class="text-5xl lg:text-6xl font-headline font-extrabold tracking-tight text-on-surface">
              {{ taskData.title }}
            </h1>
            <div class="flex flex-wrap items-center gap-6 text-on-surface-variant">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined">calendar_today</span>
                <span class="font-medium text-on-surface">{{ formattedDeadline }}</span>
              </div>
              <div v-if="taskData.assigned_worker" class="flex items-center gap-3">
                <img
                  :alt="taskData.assigned_worker.name"
                  class="w-8 h-8 rounded-full ring-2 ring-surface-container"
                  :src="taskData.assigned_worker.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-n5f3bBXZwZ8S_5vKZIv4nHetGjO2P9w7md4n39BzcyJPrYiZF_jbUNZrC4O1NZCXzSnKTEte2KOMCtWa0WxnQRyij6wHbj6Znyla2CisEoKEXLzOoPy7VS70PKR63ZQODPPNpDzg0V69oZvKSRY_JRFYVeIb33dSeBJ_YKTq_JKKf3N6TurotsQsVqOXCKVVZ3EP4Z3OIY72vfcmEw4APQPMZhv_jp0bP--uDRRocLEt-c4x6ctMJCAJVVH48gbYVjSBsz5LyAQ'"
                />
                <span class="font-medium text-on-surface">{{ taskData.assigned_worker.name }}</span>
              </div>
            </div>
          </div>
          <div class="flex flex-wrap gap-3">
            <button class="flex items-center gap-2 px-5 py-3 rounded-xl bg-surface-container-highest hover:bg-surface-bright transition-all duration-300 font-medium text-on-surface">
              <span class="material-symbols-outlined">edit</span> Edit
            </button>
            <button class="flex items-center gap-2 px-5 py-3 rounded-xl bg-surface-container-highest hover:bg-surface-bright transition-all duration-300 font-medium text-on-surface">
              <span class="material-symbols-outlined">person_pin</span> Reassign
            </button>
            <button
              class="bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold px-8 py-3 rounded-xl shadow-[0_0_20px_rgba(192,193,255,0.3)] hover:scale-105 transition-transform duration-300"
              :disabled="isUpdatingProgress"
              @click="progressInput = 100; updateProgress()"
            >
              Complete Task
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div class="lg:col-span-8 space-y-6">
          <!-- Task Description -->
          <section class="bg-surface-container rounded-2xl p-8 border border-outline-variant/10">
            <h3 class="font-headline text-xl mb-6 flex items-center gap-2 text-on-surface">
              <span class="material-symbols-outlined text-primary">subject</span> Task Description
            </h3>
            <div class="text-on-surface-variant leading-relaxed space-y-4">
              <p v-if="taskData.description">{{ taskData.description }}</p>
              <p v-else class="italic opacity-60">No description provided for this task.</p>
            </div>
          </section>

          <!-- Attachments -->
          <section class="bg-surface-container rounded-2xl p-8 border border-outline-variant/10">
            <div class="flex justify-between items-center mb-6">
              <h3 class="font-headline text-xl flex items-center gap-2 text-on-surface">
                <span class="material-symbols-outlined text-primary">attachment</span>
                Attachments
              </h3>
              <button class="text-primary text-sm font-medium hover:underline">Upload New</button>
            </div>
            <div v-if="taskData.files && taskData.files.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-for="file in taskData.files"
                :key="file.id"
                class="group relative bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/5 hover:border-primary/30 transition-all cursor-pointer"
              >
                <div class="w-full aspect-video rounded-lg mb-3 bg-surface-container-highest flex items-center justify-center overflow-hidden">
                  <span class="material-symbols-outlined text-4xl text-on-surface-variant">description</span>
                </div>
                <p class="text-sm font-medium truncate text-on-surface">{{ file.name }}</p>
                <p class="text-xs text-on-surface-variant">{{ file.size }}</p>
              </div>
            </div>
            <div v-else class="text-center py-8 text-on-surface-variant">
              <span class="material-symbols-outlined text-4xl mb-2 opacity-40">folder_open</span>
              <p>No attachments yet</p>
            </div>
          </section>

          <!-- Discussion (mock) -->
          <section class="bg-surface-container rounded-2xl p-8 border border-outline-variant/10">
            <h3 class="font-headline text-xl mb-6 flex items-center gap-2 text-on-surface">
              <span class="material-symbols-outlined text-primary">chat_bubble</span> Discussion
            </h3>
            <div class="space-y-8">
              <div v-for="comment in comments" :key="comment.id" class="flex gap-4">
                <img :alt="comment.user.name" class="w-10 h-10 rounded-full" :src="comment.user.image" />
                <div class="flex-grow space-y-2">
                  <div class="flex items-center gap-3">
                    <span class="font-bold text-on-surface">{{ comment.user.name }}</span>
                    <span class="text-xs text-on-surface-variant">{{ comment.time }}</span>
                  </div>
                  <p v-if="comment.text" class="text-on-surface-variant bg-surface-container-low p-4 rounded-xl rounded-tl-none border border-outline-variant/10">
                    {{ comment.text }}
                  </p>
                  <div v-if="comment.text" class="flex items-center gap-4 text-xs text-on-surface-variant">
                    <button class="hover:text-primary transition-colors flex items-center gap-1">
                      <span class="material-symbols-outlined text-sm">thumb_up</span> {{ comment.likes }}
                    </button>
                    <button class="hover:text-primary transition-colors">Reply</button>
                  </div>
                </div>
              </div>
              <div class="flex gap-4 items-start pt-4 border-t border-outline-variant/10">
                <img
                  alt="My User"
                  class="w-10 h-10 rounded-full"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLi33VcRErjYaC0AZDa-6ifzOkk_FniVEfQv-WoD0qnm4TqcnSWPNaQeDOSrbX9cmYIXfiYrCc8QwOtFapsl65saC3BEHdjQjPaQ0NMFY1YTGvuU-AxBFoJtaO2ViY3qYic6kZglcOyZpKyXlHIdrccpzqUy8SAO46ctcraGnBWXWm6hXwj-KtlclU3_tDME3mtbeLM20AtQtk8a9YWfjCYDQQkN8m6h-MFy6uYt8yKeG5MrflaRa2YPZy73ruVSGDsxNYZ0Qm5Jw"
                />
                <div class="flex-grow">
                  <textarea
                    v-model="newComment"
                    class="w-full bg-gray-800 border border-outline-variant/20 rounded-xl p-4 focus:ring-primary/40 focus:border-primary text-on-surface h-24 transition-all outline-none resize-none"
                    placeholder="Write a comment..."
                  ></textarea>
                  <div class="flex justify-end mt-2">
                    <button class="bg-gradient-to-br from-primary to-primary-container px-6 py-2 rounded-lg text-on-primary font-bold text-sm">
                      Post Comment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-4 space-y-6">
          <!-- Task Details -->
          <section class="bg-surface-container rounded-2xl p-6 border border-outline-variant/10">
            <h4 class="font-headline text-sm uppercase tracking-widest text-on-surface-variant mb-6">Task Details</h4>
            <div class="space-y-6">
              <div v-if="taskData.created_at" class="flex justify-between items-center py-3 border-b border-outline-variant/10">
                <span class="text-on-surface-variant text-sm">Created</span>
                <span class="text-on-surface font-medium">{{ new Date(taskData.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}</span>
              </div>
              <div v-if="taskData.estimated_hours" class="flex justify-between items-center py-3 border-b border-outline-variant/10">
                <span class="text-on-surface-variant text-sm">Estimated Time</span>
                <span class="text-on-surface font-medium">{{ taskData.estimated_hours }} Hours</span>
              </div>
              <div class="flex justify-between items-center py-3 border-b border-outline-variant/10">
                <span class="text-on-surface-variant text-sm">Total Logged</span>
                <span class="text-on-surface font-medium">{{ taskData.formatted_tracked_time }}</span>
              </div>
              <div v-if="taskData.project" class="flex justify-between items-center py-3 border-b border-outline-variant/10">
                <span class="text-on-surface-variant text-sm">Related Projects</span>
                <span class="text-primary font-medium">{{ taskData.project.name }}</span>
              </div>
              <div class="pt-2">
                <div class="flex justify-between text-xs text-on-surface-variant mb-2">
                  <span>Progress</span>
                  <span>{{ taskProgress }}%</span>
                </div>
                <div class="w-full h-2 bg-surface-container-lowest rounded-full overflow-hidden">
                  <div
                    class="h-full bg-gradient-to-br from-primary to-primary-container rounded-full"
                    :style="{ width: `${taskProgress}%` }"
                  ></div>
                </div>
                <!-- Progress update input -->
                <div class="flex items-center gap-2 mt-3">
                  <input
                    v-model.number="progressInput"
                    type="number"
                    min="0"
                    max="100"
                    class="w-20 bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-2 py-1 text-xs text-on-surface"
                    placeholder="0-100"
                  />
                  <button
                    class="text-xs bg-primary/10 text-primary px-3 py-1 rounded-lg hover:bg-primary/20 transition-colors disabled:opacity-50"
                    :disabled="isUpdatingProgress || progressInput === null"
                    @click="updateProgress()"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </section>

          <!-- Activity Log (mock) -->
          <section class="bg-surface-container rounded-2xl p-6 border border-outline-variant/10">
            <h4 class="font-headline text-sm uppercase tracking-widest text-on-surface-variant mb-6">Activity Log</h4>
            <div class="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1px] before:bg-outline-variant/20">
              <div v-for="activity in activities" :key="activity.title" class="relative pl-10">
                <div :class="['absolute left-0 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center z-10', activity.iconClass]">
                  <span class="material-symbols-outlined text-[14px]">{{ activity.icon }}</span>
                </div>
                <p class="text-sm font-medium text-on-surface">{{ activity.title }}</p>
                <p class="text-xs text-on-surface-variant">{{ activity.date }}{{ activity.by ? ` by ${activity.by}` : '' }}</p>
              </div>
            </div>
            <button class="w-full mt-6 py-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors border border-outline-variant/10 rounded-lg">
              View Full History
            </button>
          </section>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="flex items-center justify-center min-h-[50vh]">
      <div class="text-center">
        <span class="material-symbols-outlined text-6xl text-on-surface-variant opacity-40">task_alt</span>
        <p class="mt-4 text-on-surface-variant">No task selected</p>
      </div>
    </div>
  </main>

  <footer class="mt-12 px-8 py-6 border-t border-outline-variant/15 bg-surface flex flex-col md:flex-row items-center justify-between gap-4">
    <p class="text-[10px] font-bold uppercase tracking-widest text-slate-500">© 2024 Obsidian Architect • System Status: <span class="text-success">Operational</span></p>
    <div class="flex gap-4 items-center">
      <span class="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.4)]"></span>
      <span class="text-[10px] font-bold uppercase tracking-widest text-slate-500">Region: Global-Alpha-1</span>
    </div>
  </footer>
</template>
