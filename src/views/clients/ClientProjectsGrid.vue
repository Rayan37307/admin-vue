<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading && !client" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
    </div>

    <template v-else>
      <!-- Projects Grid -->
      <section v-if="client?.projects && client.projects.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <article
          v-for="(project, index) in client.projects"
          :key="project.id"
          class="bg-surface-container rounded-2xl sm:rounded-[1.5rem] hover:bg-surface-container-high transition-all duration-400 group shadow-xl relative overflow-hidden"
          :class="index === 0 ? 'lg:col-span-2 p-6 sm:p-8' : 'p-6 sm:p-8'"
        >
          <!-- Status Badge -->
          <div class="absolute top-0 right-0 p-4 sm:p-6 sm:p-8">
            <span class="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase" :class="projectStatusBadge(project.status)">
              {{ project.status }}
            </span>
          </div>

          <div class="flex flex-col h-full justify-between">
            <div>
              <h3 class="text-xl sm:text-2xl md:text-3xl font-headline font-extrabold mb-1 sm:mb-2 group-hover:text-primary transition-colors">
                {{ project.name }}
              </h3>
              <p class="text-on-surface-variant font-medium text-xs sm:text-sm mb-4 sm:mb-6 md:mb-8">
                {{ client.company_name || client.user?.name }} • {{ project.description ? truncate(project.description, 40) : 'Project' }}
              </p>

              <!-- Status & Deadline -->
              <div class="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
                <div>
                  <div class="flex justify-between text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-2">
                    <span>Deadline</span>
                    <span>Progress</span>
                  </div>
                  <div class="flex justify-between font-semibold text-sm">
                    <span>{{ project.deadline ? formatDate(project.deadline) : 'No deadline' }}</span>
                    <span>{{ project.progress_percentage }}%</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Progress Bar -->
            <div>
              <div class="flex justify-between items-end mb-2 sm:mb-3">
                <div>
                  <p class="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-1">Completion</p>
                  <p class="text-xl sm:text-2xl font-headline font-bold text-on-surface">{{ project.progress_percentage }}%</p>
                </div>
                <!-- Team Avatars -->
                <div v-if="project.workers && project.workers.length > 0" class="flex -space-x-2 sm:-space-x-3">
                  <img
                    v-for="(worker, i) in project.workers.slice(0, 3)"
                    :key="worker.id"
                    alt="Team member"
                    title="Team member"
                    class="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-surface-container object-cover"
                    :src="worker.avatar || ''"
                  />
                  <div v-if="project.workers.length > 3" class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-surface-container-highest border-2 border-surface-container flex items-center justify-center text-[10px] font-bold text-on-surface-variant">
                    +{{ project.workers.length - 3 }}
                  </div>
                </div>
              </div>
              <div class="h-1.5 sm:h-2 w-full bg-surface-container-lowest rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-primary to-primary-container rounded-full" :style="{ width: `${project.progress_percentage}%` }"></div>
              </div>
            </div>
          </div>
        </article>
      </section>

      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <FolderOpen class="w-16 h-16 text-on-surface-muted mx-auto mb-4" />
        <h3 class="font-headline font-bold text-on-surface text-xl mb-2">No projects yet</h3>
        <p class="text-on-surface-variant text-sm">Create a project to get started.</p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { FolderOpen } from 'lucide-vue-next'
import { useClientsStore } from '@/stores/clients'

const props = defineProps<{ clientId: number | null }>()
const store = useClientsStore()

const client = computed(() => store.selectedClient)
const loading = computed(() => store.loading)

async function fetchData(id: number): Promise<void> {
  await store.fetchClient(id)
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function truncate(str: string, len: number): string {
  return str.length > len ? str.substring(0, len) + '...' : str
}

function projectStatusBadge(status: string): string {
  const map: Record<string, string> = {
    active: 'bg-primary/10 text-primary',
    completed: 'bg-emerald-500/10 text-emerald-400',
    on_hold: 'bg-amber-500/10 text-amber-400',
    cancelled: 'bg-red-500/10 text-red-400',
  }
  return map[status] || 'bg-surface-container-highest text-on-surface-variant'
}

watch(() => props.clientId, (newId) => {
  if (newId) fetchData(newId)
}, { immediate: false })

onMounted(() => {
  if (props.clientId) fetchData(props.clientId)
})
</script>
