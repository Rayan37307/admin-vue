<template>
  <div class="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-6 sm:py-8 md:py-10 lg:py-12">
    <!-- Page Header -->
    <div class="flex justify-between items-end mb-6 sm:mb-8 md:mb-10">
      <div class="space-y-1.5 sm:space-y-2">
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-headline font-light tracking-tighter text-on-surface">
          Clients
        </h1>
        <p class="text-on-surface-variant text-xs sm:text-sm md:text-base max-w-lg leading-relaxed">
          Manage and monitor all client relationships.
        </p>
      </div>
      <button class="bg-primary hover:bg-primary/90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-on-primary font-semibold px-6 sm:px-8 py-3 rounded-xl sm:rounded-2xl inline-flex items-center justify-center gap-2 transition-all duration-150 shadow-lg shadow-primary/20 min-h-[44px] text-sm sm:text-base">
        <UserPlus class="w-5 h-5" />
        <span>Add Client</span>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
      <p class="text-red-400 font-medium">{{ error }}</p>
      <button @click="fetchClients" class="mt-3 text-sm text-primary hover:underline">Try again</button>
    </div>

    <template v-else>
      <!-- Filter Bar -->
      <div class="bg-surface-container rounded-2xl p-4 flex flex-wrap items-center gap-4 mb-6 sm:mb-8 shadow-sm">
        <!-- Status Filter -->
        <select
          v-model="statusFilterVal"
          class="bg-surface-container-low rounded-xl text-on-surface-variant text-sm px-4 py-2.5 border border-outline-variant/10 focus:ring-2 focus:ring-primary min-h-[44px] cursor-pointer"
          @change="fetchClients"
        >
          <option value="all">Status: All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <!-- Search -->
        <div class="relative flex-1 min-w-[200px]">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-muted w-4 h-4 pointer-events-none" />
          <input
            v-model="searchInput"
            type="search"
            placeholder="Search clients..."
            class="w-full bg-surface-container-low rounded-xl text-on-surface text-sm pl-10 pr-4 py-2.5 border border-outline-variant/10 focus:ring-2 focus:ring-primary min-h-[44px]"
            @input="debounceFetch"
          />
        </div>

        <div class="ml-auto flex items-center gap-4">
          <!-- View Toggle -->
          <button class="p-2 text-on-surface-variant hover:text-primary transition-colors min-h-[44px] min-w-[44px] inline-flex items-center justify-center" aria-label="Kanban view">
            <LayoutGrid class="w-5 h-5" />
          </button>
          <button class="p-2 text-primary bg-surface-container-highest rounded-lg transition-colors min-h-[44px] min-w-[44px] inline-flex items-center justify-center" aria-label="List view">
            <List class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Client List -->
      <div class="space-y-4">
        <!-- Table Header -->
        <div class="grid grid-cols-12 gap-4 px-4 sm:px-8 py-4 text-on-surface-variant text-[10px] sm:text-xs font-bold uppercase tracking-widest">
          <div class="col-span-12 sm:col-span-4">Client Name</div>
          <div class="col-span-3 sm:col-span-2 hidden sm:block">Status</div>
          <div class="col-span-2 sm:col-span-1 text-center hidden sm:block">Projects</div>
          <div class="col-span-3 sm:col-span-2">Created</div>
          <div class="col-span-3 sm:col-span-2 text-right pr-4">Company</div>
          <div class="col-span-1 hidden sm:block"></div>
        </div>

        <!-- Client Items -->
        <div
          v-for="client in clients"
          :key="client.id"
          class="grid grid-cols-12 gap-4 items-center px-4 sm:px-8 py-5 bg-surface-container rounded-2xl transition-all duration-400 hover:scale-[1.01] hover:bg-surface-container-high cursor-pointer shadow-lg group"
          @click="goToClient(client)"
        >
          <div class="col-span-12 sm:col-span-4 flex items-center gap-4">
            <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover flex-shrink-0 flex items-center justify-center bg-primary/20 text-primary font-bold text-lg">
              <img v-if="client.user?.avatar" class="w-full h-full rounded-xl object-cover" :src="client.user.avatar" :alt="`${client.user.name} avatar`" />
              <span v-else>{{ (client.user?.name || 'C').charAt(0) }}</span>
            </div>
            <div class="min-w-0">
              <div class="text-on-surface font-semibold text-sm sm:text-lg truncate group-hover:text-primary transition-colors">{{ client.user?.name || 'Unknown' }}</div>
              <div class="text-on-surface-variant text-xs font-medium truncate">{{ client.user?.email || '' }}</div>
            </div>
          </div>
          <div class="col-span-3 sm:col-span-2 hidden sm:block">
            <span class="px-2 sm:px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border whitespace-nowrap" :class="statusBadgeClasses(client.status)">
              {{ capitalize(client.status) }}
            </span>
          </div>
          <div class="col-span-2 sm:col-span-1 text-center hidden sm:block">
            <div class="text-on-surface font-bold text-lg">{{ client.projects_count || 0 }}</div>
          </div>
          <div class="col-span-3 sm:col-span-2 text-on-surface-variant text-sm">
            {{ formatDate(client.created_at) }}
          </div>
          <div class="col-span-3 sm:col-span-2 text-right pr-4">
            <div class="text-on-surface font-medium text-sm sm:text-base truncate">{{ client.company_name || '—' }}</div>
          </div>
          <div class="col-span-1 hidden sm:flex justify-end gap-2">
            <button class="p-2 text-on-surface-variant hover:text-primary transition-colors min-h-[44px] min-w-[44px] inline-flex items-center justify-center" :aria-label="`More options for ${client.user?.name}`" @click.stop>
              <MoreVertical class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="clients.length === 0" class="text-center py-16">
          <Users class="w-16 h-16 text-on-surface-muted mx-auto mb-4" />
          <h3 class="font-headline font-bold text-on-surface text-xl mb-2">No clients found</h3>
          <p class="text-on-surface-variant text-sm">Try adjusting your filters or add a new client.</p>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex items-center justify-between mt-6">
        <p class="text-sm text-on-surface-variant">
          Showing {{ (currentPage - 1) * (filter.per_page ?? 10) + 1 }} to {{ Math.min(currentPage * (filter.per_page ?? 10), totalClients) }} of {{ totalClients }} clients
        </p>
        <div class="flex gap-2">
          <button :disabled="currentPage <= 1" class="px-4 py-2 rounded-xl bg-surface-container text-on-surface text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-container-high transition-colors min-h-[44px]" @click="goToPage(currentPage - 1)">
            Previous
          </button>
          <button :disabled="currentPage >= totalPages" class="px-4 py-2 rounded-xl bg-surface-container text-on-surface text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-container-high transition-colors min-h-[44px]" @click="goToPage(currentPage + 1)">
            Next
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { UserPlus, Search, LayoutGrid, List, MoreVertical, Users } from 'lucide-vue-next'
import { useClientsStore, type ClientResource } from '@/stores/clients'

const router = useRouter()
const store = useClientsStore()

const clients = computed(() => store.clients)
const loading = computed(() => store.loading)
const error = computed(() => store.error)
const totalPages = computed(() => store.totalPages)
const currentPage = computed(() => store.currentPage)
const totalClients = computed(() => store.totalClients)
const filter = computed(() => store.filters)

const searchInput = ref('')
const statusFilterVal = computed({
  get: () => store.filters.status || 'all',
  set: (v: string) => store.setFilter('status', v as 'active' | 'inactive' | 'all'),
})

let debounceTimer: ReturnType<typeof setTimeout> | null = null
function debounceFetch(): void {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    store.setFilter('search', searchInput.value)
    store.setPage(1)
    store.fetchClients()
  }, 400)
}

function goToClient(client: ClientResource): void {
  store.selectClient(client)
  router.push({ name: 'ClientsList', query: { id: String(client.id) } })
}

function goToPage(page: number): void {
  store.setPage(page)
  store.fetchClients()
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function statusBadgeClasses(status: string): string {
  return status === 'active'
    ? 'bg-primary/10 text-primary border-primary/20'
    : 'bg-on-surface-variant/10 text-on-surface-variant border-on-surface-variant/20'
}

function fetchClients(): void {
  store.fetchClients()
}

onMounted(() => {
  store.fetchClients()
})
</script>
