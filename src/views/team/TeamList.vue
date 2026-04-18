<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTeamStore } from '../../stores/team'
import { useProjectsStore } from '../../stores/projects'
import { getWorkerLoad } from '../../api/team'

const router = useRouter()
const teamStore = useTeamStore()
const projectsStore = useProjectsStore()

const filters = ['All', 'Designers', 'Developers', 'PMs', 'QA']
const statuses = ['All', 'Active', 'Inactive']
const projects = computed(() => ['All', ...projectsStore.projects.map(p => p.name)])

const memberLoads = ref<Record<number, number>>({})

onMounted(async () => {
  await Promise.all([
    teamStore.fetchUsers(),
    projectsStore.fetchProjects()
  ])
  
  for (const user of teamStore.users) {
    if (user.role === 'worker') {
      try {
        const load = await getWorkerLoad(user.id)
        memberLoads.value[user.id] = load.load_percentage
      } catch {
        memberLoads.value[user.id] = 0
      }
    }
  }
})

function toggleSelect(id: number) {
  teamStore.toggleSelect(id)
}

function getProjectInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

function getStatusClass(status: string) {
  return status === 'Active' 
    ? 'bg-primary/10 text-primary' 
    : 'bg-surface-variant text-outline'
}

function getAvatarUrl(user: any): string {
  return user.avatar || user.profile_image_link || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`
}
</script>

<template>
  <div class="min-h-screen bg-surface p-4 sm:p-6 md:p-8">
    <!-- Loading -->
    <div v-if="teamStore.loading" class="flex items-center justify-center py-20">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>

    <!-- Error -->
    <div v-else-if="teamStore.error" class="bg-error-container/20 border border-error/30 rounded-xl p-4 mb-6">
      <p class="text-error">{{ teamStore.error }}</p>
    </div>

    <template v-else>
      <!-- Header -->
      <section class="mb-6 sm:mb-8 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
        <div>
          <h1 class="font-headline text-2xl sm:text-3xl md:text-4xl font-light tracking-tight text-on-surface mb-2">
            Team Members
          </h1>
          <div class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(192,193,255,0.6)]"></span>
            <p class="text-xs sm:text-sm text-on-surface-variant">Active workforce of {{ teamStore.users.length }} specialists</p>
          </div>
        </div>
        <button
          @click="router.push('/team/assign')"
          class="inline-flex items-center justify-center gap-2 bg-primary px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-on-primary font-semibold text-xs sm:text-sm hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/10 w-full md:w-auto min-h-[44px]">
          <span class="material-symbols-outlined text-base sm:text-lg">person_add</span>
          <span>Add New Team Member</span>
        </button>
      </section>

      <!-- Filters -->
      <section class="mb-6 sm:mb-8 flex flex-wrap items-center gap-3 sm:gap-4">
        <div class="flex items-center gap-1 sm:gap-2 bg-surface-container p-1 rounded-xl overflow-x-auto no-scrollbar">
          <button
            v-for="filter in filters"
            :key="filter"
            :class="[
              'px-3 sm:px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest whitespace-nowrap min-h-[44px]',
              teamStore.currentFilter === filter
                ? 'text-primary bg-surface-container-high shadow-sm'
                : 'text-outline hover:text-on-surface transition-colors'
            ]"
            @click="teamStore.setFilter(filter as 'All' | 'Designers' | 'Developers' | 'PMs' | 'QA')">
            {{ filter }}
          </button>
        </div>
        <div class="h-8 w-[1px] bg-outline-variant/20 mx-2 hidden sm:block"></div>
        <div class="flex flex-wrap items-center gap-2 sm:gap-3">
          <div class="relative group">
            <select v-model="teamStore.currentStatus" aria-label="Filter by status"
              class="appearance-none bg-surface-container-low border border-outline-variant/10 rounded-lg sm:rounded-xl pl-3 sm:pl-4 pr-8 sm:pr-10 py-2 sm:py-2.5 text-xs font-medium text-on-surface-variant focus:ring-1 focus:ring-primary/30 min-h-[44px]">
              <option v-for="status in statuses" :key="status">Status: {{ status }}</option>
            </select>
            <span class="material-symbols-outlined absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-xs pointer-events-none">expand_more</span>
          </div>
          <div class="relative group">
            <select v-model="teamStore.currentProject" aria-label="Filter by project"
              class="appearance-none bg-surface-container-low border border-outline-variant/10 rounded-lg sm:rounded-xl pl-3 sm:pl-4 pr-8 sm:pr-10 py-2 sm:py-2.5 text-xs font-medium text-on-surface-variant focus:ring-1 focus:ring-primary/30 min-h-[44px]">
              <option v-for="project in projects" :key="project">Project: {{ project }}</option>
            </select>
            <span class="material-symbols-outlined absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-xs pointer-events-none">expand_more</span>
          </div>
        </div>
        <div class="ml-auto flex items-center gap-3 sm:gap-4">
          <p class="text-xs text-outline font-medium whitespace-nowrap">Selected: {{ teamStore.selectedCount }}</p>
          <button 
            v-if="teamStore.selectedCount > 0"
            @click="teamStore.bulkDeleteSelected()"
            aria-label="Delete selected team members"
            class="text-outline hover:text-error-container/80 transition-colors p-2 rounded-lg hover:bg-error-container/10 min-h-[44px] min-w-[44px]">
            <span class="material-symbols-outlined text-xl">delete</span>
          </button>
        </div>
      </section>

      <!-- Team Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        <div
          v-for="user in teamStore.filteredUsers"
          :key="user.id"
          class="group relative bg-surface-container rounded-xl p-4 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40 indigo-glow">
          <div class="absolute top-3 sm:top-4 left-3 sm:left-4 z-10">
            <input
              :checked="teamStore.selectedUsers.includes(user.id)"
              @change="toggleSelect(user.id)"
              aria-label="Select user"
              class="w-4 h-4 rounded border-outline-variant/30 bg-transparent text-primary focus:ring-offset-0 focus:ring-primary/30"
              type="checkbox" />
          </div>
          <div class="absolute top-3 sm:top-4 right-3 sm:right-4 flex gap-1">
            <button class="p-1.5 text-outline hover:text-white hover:bg-surface-bright rounded-lg transition-all min-h-[44px] min-w-[44px]">
              <span class="material-symbols-outlined text-lg">edit</span>
            </button>
            <button class="p-1.5 text-outline hover:text-white hover:bg-surface-bright rounded-lg transition-all min-h-[44px] min-w-[44px]">
              <span class="material-symbols-outlined text-lg">more_vert</span>
            </button>
          </div>
          <div class="flex flex-col items-center text-center">
            <div class="relative mb-3 sm:mb-4">
              <img class="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                :alt="user.name"
                :src="getAvatarUrl(user)" />
              <span
                class="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-emerald-500 border-2 sm:border-4 border-surface-container rounded-full"></span>
            </div>
            <h3 class="font-headline text-lg sm:text-xl font-bold text-on-surface mb-1">{{ user.name }}</h3>
            <p class="text-xs font-bold uppercase tracking-widest text-outline mb-4 sm:mb-6">{{ user.role }}</p>
            <div class="w-full flex items-center justify-between py-3 border-y border-outline-variant/5 mb-4 sm:mb-6">
              <div class="text-left">
                <p class="text-[10px] text-outline font-bold uppercase tracking-tighter mb-1">Projects</p>
                <div class="flex -space-x-2">
                  <div class="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-secondary-container border-2 border-surface-container flex items-center justify-center text-[6px] sm:text-[8px] font-bold">+0</div>
                </div>
              </div>
              <div class="text-right">
                <p class="text-[10px] text-outline font-bold uppercase tracking-tighter mb-1">Load</p>
                <div class="w-12 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                  <div class="h-full bg-primary" :style="{ width: (memberLoads[user.id] || 0) + '%' }"></div>
                </div>
              </div>
            </div>
            <div class="w-full flex flex-col sm:flex-row items-center justify-between text-xs gap-2">
              <span class="text-outline">{{ user.email }}</span>
              <button class="text-primary font-bold hover:underline min-h-[44px] min-w-[44px] flex items-center justify-center">View Profile</button>
            </div>
          </div>
        </div>

        <!-- Add Member Card -->
        <button
          class="group border-2 border-dashed border-outline-variant/20 rounded-xl p-4 sm:p-6 flex flex-col items-center justify-center text-center hover:border-primary/40 hover:bg-surface-container-low transition-all duration-300 min-h-[300px]">
          <div class="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-surface-container-high flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-primary/10 group-hover:scale-110 transition-all">
            <span class="material-symbols-outlined text-2xl sm:text-3xl text-outline group-hover:text-primary">add</span>
          </div>
          <p class="text-sm font-bold text-on-surface-variant">Add new team member</p>
          <p class="text-[10px] text-outline uppercase tracking-widest mt-1">Click to add</p>
        </button>
      </div>

      <!-- Stats -->
      <section class="mt-8 sm:mt-10 md:mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <div class="bg-surface-container-low p-4 sm:p-6 rounded-xl border-l-2 border-primary-container">
          <p class="text-[10px] font-bold uppercase tracking-widest text-outline mb-1">Total Users</p>
          <p class="text-xl sm:text-2xl font-light text-on-surface">{{ teamStore.users.length }}</p>
        </div>
        <div class="bg-surface-container-low p-4 sm:p-6 rounded-xl border-l-2 border-primary-container">
          <p class="text-[10px] font-bold uppercase tracking-widest text-outline mb-1">Workers</p>
          <p class="text-xl sm:text-2xl font-light text-on-surface">{{ teamStore.users.filter(u => u.role === 'worker').length }}</p>
        </div>
        <div class="bg-surface-container-low p-4 sm:p-6 rounded-xl border-l-2 border-primary-container">
          <p class="text-[10px] font-bold uppercase tracking-widest text-outline mb-1">Projects</p>
          <p class="text-xl sm:text-2xl font-light text-on-surface">{{ projectsStore.projects.length }}</p>
        </div>
        <div class="bg-surface-container-low p-4 sm:p-6 rounded-xl border-l-2 border-primary-container flex items-center justify-between">
          <div>
            <p class="text-[10px] font-bold uppercase tracking-widest text-outline mb-1">Quick Report</p>
            <p class="text-xs sm:text-sm font-bold text-primary">Download PDF</p>
          </div>
          <span class="material-symbols-outlined text-outline text-sm sm:text-lg">description</span>
        </div>
      </section>
    </template>
  </div>
</template>