<template>
  <div class="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-6 sm:py-8 md:py-10 lg:py-12">
    <!-- Page Header -->
    <header class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 sm:mb-8 md:mb-10">
      <div class="space-y-1.5 sm:space-y-2">
        <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-headline font-light tracking-tighter text-on-surface">
          Clients
        </h1>
        <p class="text-on-surface-variant text-xs sm:text-sm md:text-base max-w-lg leading-relaxed">
          Manage and monitor your global agency clients, project health, and financial cycles from one central dashboard.
        </p>
      </div>
      <div class="shrink-0">
        <button
          type="button"
          class="bg-primary hover:bg-primary/90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface text-on-primary font-semibold px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl inline-flex items-center justify-center gap-2 transition-all duration-150 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 w-full sm:w-auto min-h-[44px] text-sm sm:text-base"
          aria-label="Add a new client"
        >
          <Plus class="w-5 h-5" />
          <span>Add New Client</span>
        </button>
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
      <p class="text-red-400 font-medium">{{ error }}</p>
      <button @click="fetchClients" class="mt-3 text-sm text-primary hover:underline">Try again</button>
    </div>

    <!-- Main Content Grid -->
    <div v-else class="grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-8">
      <!-- Main Table Section -->
      <div class="xl:col-span-9 space-y-5 sm:space-y-6">
        <!-- Filter Bar -->
        <section class="bg-surface-container-low p-3 sm:p-4 md:p-5 rounded-2xl sm:rounded-3xl shadow-sm" aria-label="Client filters">
          <div class="flex flex-wrap items-center gap-3 sm:gap-4">
            <!-- Search Input -->
            <div class="w-full sm:flex-1 sm:min-w-[220px] relative">
              <Search class="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-on-surface-muted text-sm sm:text-base pointer-events-none w-5 h-5" />
              <input
                v-model="searchQuery"
                type="search"
                placeholder="Filter by Name, Email, or Company"
                class="filter-input w-full bg-surface-container text-on-surface placeholder-on-surface-muted text-sm rounded-xl sm:rounded-2xl py-2.5 sm:py-3 pl-10 sm:pl-12 pr-4 border-0 focus:ring-2 focus:ring-primary transition-all min-h-[44px]"
                aria-label="Search clients by name, email, or company"
                @input="debounceFetch"
              />
            </div>

            <!-- Status Dropdown -->
            <label for="client-status-filter" class="sr-only">Filter clients by status</label>
            <select
              id="client-status-filter"
              v-model="statusFilter"
              class="bg-surface-container text-on-surface text-sm rounded-xl sm:rounded-2xl py-2.5 sm:py-3 pl-4 pr-8 border-0 focus:ring-2 focus:ring-primary appearance-none cursor-pointer min-h-[44px] min-w-[130px]"
              aria-label="Filter clients by status"
              @change="fetchClients"
            >
              <option value="all">Status: All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <!-- Calendar Filter Button -->
            <button
              type="button"
              class="bg-surface-container hover:bg-surface-container-high active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-on-surface-variant hover:text-on-surface p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all duration-150 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Filter by date range"
            >
              <Calendar class="w-5 h-5" />
            </button>

            <!-- Advanced Filter Button -->
            <button
              type="button"
              class="bg-surface-container hover:bg-surface-container-high active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-on-surface-variant hover:text-on-surface p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all duration-150 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Open advanced filters"
            >
              <ListFilter class="w-5 h-5" />
            </button>
          </div>
        </section>

        <!-- Client Table -->
        <div class="table-card bg-surface-container-low rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden">
          <div class="table-scroll-wrapper overflow-x-auto">
            <table class="w-full text-left border-collapse min-w-[720px]" role="table" aria-label="Clients list">
              <thead>
                <tr class="border-b border-outline-variant/10">
                  <th scope="col" class="px-4 sm:px-6 py-4 sm:py-5 font-label text-[10px] sm:text-xs uppercase tracking-[0.15em] text-on-surface-muted whitespace-nowrap">Client</th>
                  <th scope="col" class="px-4 sm:px-6 py-4 sm:py-5 font-label text-[10px] sm:text-xs uppercase tracking-[0.15em] text-on-surface-muted whitespace-nowrap hidden md:table-cell">Company</th>
                  <th scope="col" class="px-4 sm:px-6 py-4 sm:py-5 font-label text-[10px] sm:text-xs uppercase tracking-[0.15em] text-on-surface-muted whitespace-nowrap">Status</th>
                  <th scope="col" class="px-4 sm:px-6 py-4 sm:py-5 font-label text-[10px] sm:text-xs uppercase tracking-[0.15em] text-on-surface-muted whitespace-nowrap hidden md:table-cell">Projects</th>
                  <th scope="col" class="px-4 sm:px-6 py-4 sm:py-5 font-label text-[10px] sm:text-xs uppercase tracking-[0.15em] text-on-surface-muted whitespace-nowrap text-right">Revenue</th>
                  <th scope="col" class="px-4 sm:px-6 py-4 sm:py-5 font-label text-[10px] sm:text-xs uppercase tracking-[0.15em] text-on-surface-muted w-[52px]"><span class="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-outline-variant/5">
                <tr
                  v-for="client in clients"
                  :key="client.id"
                  class="client-row group hover:bg-surface-container/60 cursor-pointer transition-colors"
                  tabindex="0"
                  role="row"
                  :aria-label="`${client.user?.name || 'Unknown'}, ${client.company_name || 'No Company'}, ${client.status}`"
                  @click="goToClient(client)"
                >
                  <td class="px-4 sm:px-6 py-4 sm:py-5">
                    <div class="flex items-center gap-3 sm:gap-4">
                      <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl object-cover shrink-0 flex items-center justify-center bg-primary/20 text-primary font-bold text-lg">
                        <img v-if="client.user?.avatar" class="w-full h-full rounded-xl sm:rounded-2xl object-cover" :src="client.user.avatar" :alt="`Avatar of ${client.user?.name}`" loading="lazy" />
                        <span v-else>{{ (client.user?.name || 'C').charAt(0) }}</span>
                      </div>
                      <div class="min-w-0">
                        <p class="font-bold text-on-surface group-hover:text-primary transition-colors text-sm sm:text-base truncate">
                          {{ client.user?.name || 'Unknown' }}
                        </p>
                        <p class="text-xs text-on-surface-muted truncate">
                          {{ client.user?.email || '' }}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 sm:px-6 py-4 sm:py-5 text-on-surface-variant font-medium text-sm whitespace-nowrap hidden md:table-cell">
                    {{ client.company_name || '—' }}
                  </td>
                  <td class="px-4 sm:px-6 py-4 sm:py-5">
                    <span class="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider whitespace-nowrap" :class="statusClasses(client.status)">
                      <span class="w-1.5 h-1.5 rounded-full" :class="statusDotClasses(client.status)"></span>
                      {{ capitalize(client.status) }}
                    </span>
                  </td>
                  <td class="px-4 sm:px-6 py-4 sm:py-5 hidden md:table-cell">
                    <div class="flex -space-x-2">
                      <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-surface-container-low bg-primary/20 flex items-center justify-center text-[9px] sm:text-[10px] font-bold text-primary shrink-0">
                        {{ client.projects_count || 0 }}
                      </div>
                    </div>
                  </td>
                  <td class="px-4 sm:px-6 py-4 sm:py-5 text-right font-headline font-semibold text-on-surface whitespace-nowrap text-sm sm:text-base">
                    ${{ (client as any).stats?.total_revenue?.replace(/[^0-9.]/g, '') || '0' }}
                  </td>
                  <td class="px-4 sm:px-6 py-4 sm:py-5 text-right">
                    <button type="button" class="text-on-surface-muted hover:text-on-surface active:text-on-surface p-1.5 rounded-lg hover:bg-surface-container-high transition-all min-h-[44px] min-w-[44px] inline-flex items-center justify-center" :aria-label="`More options for ${client.user?.name}`" @click.stop>
                      <MoreVertical class="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Empty State -->
          <div v-if="clients.length === 0" class="text-center py-16">
            <Users class="w-16 h-16 text-on-surface-muted mx-auto mb-4" />
            <h3 class="font-headline font-bold text-on-surface text-xl mb-2">No clients found</h3>
            <p class="text-on-surface-variant text-sm">Try adjusting your filters or add a new client.</p>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex items-center justify-between">
          <p class="text-sm text-on-surface-variant">
            Showing {{ (currentPage - 1) * (filters.per_page ?? 10) + 1 }} to {{ Math.min(currentPage * (filters.per_page ?? 10), totalClients) }} of {{ totalClients }} clients
          </p>
          <div class="flex gap-2">
            <button
              :disabled="currentPage <= 1"
              class="px-4 py-2 rounded-xl bg-surface-container text-on-surface text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-container-high transition-colors min-h-[44px]"
              @click="goToPage(currentPage - 1)"
            >
              Previous
            </button>
            <button
              :disabled="currentPage >= totalPages"
              class="px-4 py-2 rounded-xl bg-surface-container text-on-surface text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-container-high transition-colors min-h-[44px]"
              @click="goToPage(currentPage + 1)"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <!-- Sidebar: Quick Stats -->
      <div class="xl:col-span-3 space-y-5 sm:space-y-6">
        <div class="bg-surface-container-low rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm">
          <h3 class="font-headline font-bold text-on-surface mb-4 text-sm sm:text-base">Portfolio Overview</h3>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-on-surface-variant text-sm">Total Clients</span>
              <span class="font-headline font-bold text-on-surface text-lg">{{ totalClients }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-on-surface-variant text-sm">Active</span>
              <span class="font-headline font-bold text-emerald-400 text-lg">{{ activeCount }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-on-surface-variant text-sm">Inactive</span>
              <span class="font-headline font-bold text-on-surface-variant text-lg">{{ inactiveCount }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, Search, Calendar, ListFilter, MoreVertical, Users } from 'lucide-vue-next'
import { useClientsStore, type ClientResource } from '@/stores/clients'

const router = useRouter()
const store = useClientsStore()

const clients = computed(() => store.clients)
const loading = computed(() => store.loading)
const error = computed(() => store.error)
const totalPages = computed(() => store.totalPages)
const currentPage = computed(() => store.currentPage)
const totalClients = computed(() => store.totalClients)
const filters = computed(() => store.filters)

const activeCount = computed(() => clients.value.filter(c => c.status === 'active').length)
const inactiveCount = computed(() => clients.value.filter(c => c.status === 'inactive').length)

const searchQuery = ref('')
const statusFilter = computed({
  get: () => store.filters.status || 'all',
  set: (v: string) => store.setFilter('status', v as 'active' | 'inactive' | 'all'),
})

let debounceTimer: ReturnType<typeof setTimeout> | null = null

function debounceFetch(): void {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    store.setFilter('search', searchQuery.value)
    store.setPage(1)
    store.fetchClients()
  }, 400)
}

function goToClient(client: ClientResource): void {
  store.selectClient(client)
  router.push({ name: 'ClientActivityLog', query: { id: String(client.id) } })
}

function goToPage(page: number): void {
  store.setPage(page)
  store.fetchClients()
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function statusClasses(status: string): string {
  return status === 'active'
    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
    : 'bg-on-surface-variant/10 text-on-surface-variant border border-on-surface-variant/20'
}

function statusDotClasses(status: string): string {
  return status === 'active' ? 'bg-emerald-400' : 'bg-on-surface-variant'
}

function fetchClients(): void {
  store.fetchClients()
}

onMounted(() => {
  store.fetchClients()
})
</script>
