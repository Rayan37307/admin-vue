<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTeamStore } from '../../stores/team'
import { useProjectsStore } from '../../stores/projects'
import { getWorkerLoad, assignWorkerToProject, getTasksByProject } from '../../api/team'
import type { WorkerLoad } from '../../api/team'

const router = useRouter()
const teamStore = useTeamStore()
const projectsStore = useProjectsStore()

const loading = ref(false)
const selectedWorkerId = ref<number | null>(null)
const selectedProjectId = ref<number | null>(null)
const selectedTaskId = ref<string>('')
const assignmentRole = ref('Developer')
const startDate = ref('')
const endDate = ref('')
const notifyEnabled = ref(true)
const workerLoad = ref<WorkerLoad | null>(null)
const tasks = ref<{ id: number; title: string }[]>([])

const roles = ['Designer', 'Developer', 'Project Manager', 'QA Engineer']

onMounted(async () => {
  loading.value = true
  await Promise.all([
    teamStore.fetchWorkers(),
    projectsStore.fetchProjects()
  ])
  loading.value = false
})

async function onWorkerSelect(workerId: number) {
  selectedWorkerId.value = workerId
  teamStore.workers.forEach(w => {
    (w as any).selected = w.id === workerId
  })
  try {
    workerLoad.value = await getWorkerLoad(workerId)
  } catch {
    workerLoad.value = null
  }
}

async function onProjectChange(projectId: number) {
  selectedProjectId.value = projectId
  selectedTaskId.value = ''
  if (projectId) {
    try {
      tasks.value = await getTasksByProject(projectId)
    } catch {
      tasks.value = []
    }
  } else {
    tasks.value = []
  }
}

const selectedWorker = computed(() => {
  return teamStore.workers.find(w => w.id === selectedWorkerId.value)
})

const selectedProject = computed(() => {
  return projectsStore.projects.find(p => p.id === selectedProjectId.value)
})

async function handleAssign() {
  if (!selectedWorkerId.value || !selectedProjectId.value) return
  
  loading.value = true
  try {
    await assignWorkerToProject(selectedProjectId.value, [selectedWorkerId.value])
    router.push('/team')
  } catch (e: any) {
    console.error('Failed to assign worker', e)
    alert(e.response?.data?.message || 'Failed to assign worker')
  } finally {
    loading.value = false
  }
}

function getAvatarUrl(user: any): string {
  return user.profile_image_link || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`
}
</script>

<template>
  <div class="min-h-screen bg-surface p-8">
    <div class="max-w-4xl mx-auto">
      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>

      <template v-else>
        <!-- Header -->
        <div class="mb-12 flex items-end justify-between">
          <div>
            <h1 class="font-headline text-5xl font-light tracking-tight text-on-surface">Assign Team Member</h1>
            <p class="text-outline mt-3 flex items-center gap-2">
              <span class="w-1 h-1 bg-primary rounded-full"></span>
              Strategic resource allocation for upcoming sprint cycles.
            </p>
          </div>
        </div>

        <!-- Form -->
        <div class="space-y-8">
          <!-- Step 1: Select Team Member -->
          <section class="bg-surface-container-low p-8 rounded-2xl relative overflow-hidden">
            <div class="absolute top-0 left-0 w-1 h-full bg-primary-container"></div>
            <div class="flex items-center gap-3 mb-8">
              <span class="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded">01</span>
              <h2 class="font-headline text-xl font-semibold">Select Team Member</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-for="worker in teamStore.workers"
                :key="worker.id"
                @click="onWorkerSelect(worker.id)"
                :class="[
                  'bg-surface-container p-4 rounded-xl border transition-all cursor-pointer',
                  worker.id === selectedWorkerId
                    ? 'border-2 border-primary ring-4 ring-primary/5'
                    : 'border border-outline-variant/10 hover:border-primary/40'
                ]">
                <div class="flex items-center gap-3">
                  <img
                    class="w-12 h-12 rounded-lg object-cover"
                    :alt="worker.name"
                    :src="getAvatarUrl(worker)" />
                  <div>
                    <p class="text-sm font-bold">{{ worker.name }}</p>
                    <p class="text-[10px] text-outline uppercase tracking-wider">{{ worker.role }}</p>
                  </div>
                  <span v-if="worker.id === selectedWorkerId" class="material-symbols-outlined ml-auto text-primary">check_circle</span>
                </div>
                <div class="mt-4">
                  <div class="flex justify-between text-[10px] mb-1">
                    <span class="text-outline">Project Load</span>
                    <span class="text-on-surface">{{ workerLoad?.load_percentage || 0 }}%</span>
                  </div>
                  <div class="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
                    <div
                      class="h-full bg-gradient-to-r from-primary to-primary-container drop-shadow-[0_0_8px_rgba(192,193,255,0.4)]"
                      :style="{ width: (workerLoad?.load_percentage || 0) + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>
            <button class="mt-6 flex items-center gap-2 text-primary text-xs font-bold hover:gap-3 transition-all">
              <span class="w-1 h-1 bg-primary rounded-full"></span>
              VIEW ALL TEAM MEMBERS
            </button>
          </section>

          <!-- Step 2: Project Assignment -->
          <section class="bg-surface-container-low p-8 rounded-2xl relative overflow-hidden">
            <div class="absolute top-0 left-0 w-1 h-full bg-primary-container"></div>
            <div class="flex items-center gap-3 mb-8">
              <span class="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded">02</span>
              <h2 class="font-headline text-xl font-semibold">Project Assignment</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="space-y-2">
                <label class="text-[10px] font-bold uppercase tracking-widest text-outline pl-1">Select Project</label>
                <div class="relative">
                  <select 
                    :value="selectedProjectId || ''"
                    @change="onProjectChange(Number(($event.target as HTMLSelectElement).value))"
                    class="w-full bg-surface-container border-none rounded-xl py-3.5 pl-4 pr-10 appearance-none focus:ring-2 focus:ring-primary/20 text-sm">
                    <option value="">Select a project</option>
                    <option v-for="p in projectsStore.projects" :key="p.id" :value="p.id">{{ p.name }}</option>
                  </select>
                  <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">expand_more</span>
                </div>
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-bold uppercase tracking-widest text-outline pl-1">Select Task (Optional)</label>
                <div class="relative">
                  <select v-model="selectedTaskId"
                    class="w-full bg-surface-container border-none rounded-xl py-3.5 pl-4 pr-10 appearance-none focus:ring-2 focus:ring-primary/20 text-sm">
                    <option value="">None - Project Level</option>
                    <option v-for="t in tasks" :key="t.id" :value="t.id">{{ t.title }}</option>
                  </select>
                  <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">expand_more</span>
                </div>
              </div>
              <div class="space-y-2 md:col-span-2">
                <label class="text-[10px] font-bold uppercase tracking-widest text-outline pl-1">Assignment Role</label>
                <div class="flex flex-wrap gap-3">
                  <button
                    v-for="role in roles"
                    :key="role"
                    @click="assignmentRole = role"
                    :class="[
                      'px-5 py-2.5 rounded-xl text-sm border transition-all',
                      assignmentRole === role
                        ? 'bg-primary text-on-primary-fixed font-bold border-transparent'
                        : 'bg-surface-container border-outline-variant/10 hover:border-primary'
                    ]">
                    {{ role }}
                  </button>
                </div>
              </div>
            </div>
          </section>

          <!-- Step 3: Dates & Alerts -->
          <section class="bg-surface-container-low p-8 rounded-2xl relative overflow-hidden">
            <div class="absolute top-0 left-0 w-1 h-full bg-primary-container"></div>
            <div class="flex items-center gap-3 mb-8">
              <span class="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded">03</span>
              <h2 class="font-headline text-xl font-semibold">Dates & Alerts</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div class="space-y-2">
                <label class="text-[10px] font-bold uppercase tracking-widest text-outline pl-1">Start Date</label>
                <div class="relative">
                  <input v-model="startDate"
                    class="w-full bg-surface-container border-none rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-primary/20 text-sm color-scheme-dark"
                    type="date" />
                </div>
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-bold uppercase tracking-widest text-outline pl-1">End Date</label>
                <div class="relative">
                  <input v-model="endDate"
                    class="w-full bg-surface-container border-none rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-primary/20 text-sm color-scheme-dark"
                    type="date" />
                </div>
              </div>
            </div>
            <label class="flex items-center gap-3 group cursor-pointer">
              <div class="relative flex items-center">
                <input v-model="notifyEnabled" class="peer hidden" type="checkbox" />
                <div class="w-5 h-5 border-2 border-outline-variant/40 rounded-md peer-checked:bg-primary peer-checked:border-primary transition-all"></div>
                <span class="material-symbols-outlined absolute inset-0 text-on-primary-fixed text-sm opacity-0 peer-checked:opacity-100 flex items-center justify-center pointer-events-none">check</span>
              </div>
              <span class="text-sm text-on-surface group-hover:text-primary transition-colors">Notify team members via Slack and Email</span>
            </label>
          </section>

          <!-- Step 4: Review Summary -->
          <section class="bg-surface-container p-8 rounded-2xl border border-primary/20 relative">
            <div class="flex items-center gap-3 mb-8">
              <span class="text-[10px] font-bold bg-tertiary/10 text-tertiary px-2 py-0.5 rounded">04</span>
              <h2 class="font-headline text-xl font-semibold">Review Summary</h2>
            </div>
            <div class="flex flex-col md:flex-row gap-8 items-start">
              <div class="flex-1 space-y-4 w-full">
                <div class="flex justify-between items-center p-3 rounded-xl hover:bg-surface-bright/20 transition-all group">
                  <div>
                    <p class="text-[10px] text-outline uppercase tracking-widest font-bold">Assignee</p>
                    <p class="text-sm font-semibold">{{ selectedWorker?.name || 'Not selected' }} ({{ selectedWorker?.role }})</p>
                  </div>
                  <button class="text-primary text-xs opacity-0 group-hover:opacity-100 transition-opacity">Edit</button>
                </div>
                <div class="flex justify-between items-center p-3 rounded-xl hover:bg-surface-bright/20 transition-all group border-t border-outline-variant/10">
                  <div>
                    <p class="text-[10px] text-outline uppercase tracking-widest font-bold">Project</p>
                    <p class="text-sm font-semibold">{{ selectedProject?.name || 'Not selected' }}</p>
                  </div>
                  <button class="text-primary text-xs opacity-0 group-hover:opacity-100 transition-opacity">Edit</button>
                </div>
                <div class="flex justify-between items-center p-3 rounded-xl hover:bg-surface-bright/20 transition-all group border-t border-outline-variant/10">
                  <div>
                    <p class="text-[10px] text-outline uppercase tracking-widest font-bold">Duration</p>
                    <p class="text-sm font-semibold">{{ startDate || 'Not set' }} — {{ endDate || 'Not set' }}</p>
                  </div>
                  <button class="text-primary text-xs opacity-0 group-hover:opacity-100 transition-opacity">Edit</button>
                </div>
              </div>
              <div class="w-full md:w-64 p-6 bg-surface-container-high rounded-2xl border border-outline-variant/15 flex flex-col items-center text-center">
                <div class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span class="material-symbols-outlined text-primary text-3xl">verified_user</span>
                </div>
                <p class="text-xs text-on-surface leading-relaxed">{{ selectedWorker?.name || 'Worker' }} will have <strong>Full {{ assignmentRole }} Permissions</strong> for the selected repository.</p>
              </div>
            </div>
          </section>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-6 pt-6">
            <button @click="router.push('/team')" class="text-sm font-bold text-outline hover:text-white transition-all px-6 py-3">
              Cancel Assignment
            </button>
            <button 
              @click="handleAssign"
              :disabled="loading || !selectedWorkerId || !selectedProjectId"
              class="bg-primary text-on-primary-fixed px-10 py-4 rounded-xl font-headline font-bold text-base shadow-xl shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              Assign Member
            </button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>