<template>
  <div class="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-6 sm:py-8 md:py-10 lg:py-12">
    <!-- Loading State -->
    <div v-if="loading && !client" class="flex items-center justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent"></div>
    </div>

    <template v-else>
      <!-- Client Header -->
      <header class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 sm:mb-8 md:mb-10">
        <div class="space-y-1.5 sm:space-y-2">
          <div class="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
            <!-- Logo -->
            <div class="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl sm:rounded-2xl bg-surface-container-highest flex items-center justify-center border border-outline-variant/10 shadow-xl overflow-hidden flex-shrink-0">
              <img v-if="client?.user?.avatar" alt="Client logo" class="w-full h-full object-cover" :src="client.user.avatar" />
              <div v-else class="w-full h-full flex items-center justify-center text-primary text-2xl font-bold">
                {{ (client?.company_name || client?.user?.name || 'C').charAt(0) }}
              </div>
            </div>
            <!-- Client Details -->
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                <span class="px-2 sm:px-3 py-1 bg-primary/10 text-primary text-[9px] sm:text-[10px] font-bold uppercase tracking-widest rounded-full border border-primary/20 flex-shrink-0">
                  {{ client?.company_name || 'Client' }}
                </span>
                <span class="text-on-surface-variant text-xs sm:text-sm font-medium">ID: CL-{{ client?.id }}</span>
              </div>
              <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-headline font-light tracking-tighter text-on-surface truncate">
                {{ client?.user?.name || 'Client Name' }}
              </h1>
              <p class="text-on-surface-variant text-xs sm:text-sm md:text-base max-w-lg leading-relaxed mt-2">
                {{ client?.notes || 'Manage client activity, projects, and financial cycles.' }}
              </p>
              <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-on-surface-variant mt-2">
                <span v-if="client?.user?.email" class="flex items-center gap-1 min-h-[44px] sm:min-h-0">
                  <Globe class="w-4 h-4 flex-shrink-0" />
                  <span class="truncate">{{ client.user.email }}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
        <!-- Action Buttons -->
        <div class="flex flex-row sm:flex-col lg:flex-row gap-3 flex-shrink-0 w-full sm:w-auto">
          <button class="min-h-[44px] sm:flex-none px-4 sm:px-6 py-3 rounded-xl bg-surface-container border border-outline-variant/20 text-on-surface font-medium text-sm hover:bg-surface-container-high hover:border-outline-variant/30 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface transition-all duration-200 flex items-center justify-center gap-2">
            <Pencil class="w-4 h-4 flex-shrink-0" />
            <span class="hidden sm:inline">Edit Profile</span>
          </button>
          <button class="min-h-[44px] sm:flex-none px-6 py-3 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface transition-all duration-200 flex items-center justify-center gap-2">
            <Mail class="w-4 h-4 flex-shrink-0" />
            <span class="hidden sm:inline">Message</span>
          </button>
        </div>
      </header>

      <!-- Tab Navigation -->
      <nav class="mb-6 sm:mb-8 md:mb-10 border-b border-outline-variant/10" aria-label="Client sections">
        <div class="flex gap-4 sm:gap-6 md:gap-8 overflow-x-auto pb-1" role="tablist">
          <button class="pb-3 sm:pb-4 text-on-surface-variant font-medium text-sm whitespace-nowrap transition-colors duration-200 hover:text-on-surface cursor-pointer" role="tab" @click="activeTab = 'overview'">Overview</button>
          <button class="pb-3 sm:pb-4 font-bold text-sm whitespace-nowrap border-b-2 transition-colors cursor-pointer" :class="activeTab === 'activity' ? 'text-primary border-primary' : 'text-on-surface-variant border-transparent hover:text-on-surface'" role="tab" @click="activeTab = 'activity'">Activity</button>
          <button class="pb-3 sm:pb-4 text-on-surface-variant font-medium text-sm whitespace-nowrap transition-colors duration-200 hover:text-on-surface cursor-pointer" role="tab" @click="activeTab = 'projects'">Projects ({{ client?.projects_count || 0 }})</button>
          <button class="pb-3 sm:pb-4 text-on-surface-variant font-medium text-sm whitespace-nowrap transition-colors duration-200 hover:text-on-surface cursor-pointer" role="tab" @click="activeTab = 'documents'">Documents</button>
          <button class="pb-3 sm:pb-4 text-on-surface-variant font-medium text-sm whitespace-nowrap transition-colors duration-200 hover:text-on-surface cursor-pointer" role="tab" @click="activeTab = 'finance'">Finance</button>
        </div>
      </nav>

      <!-- Activity Tab Content -->
      <div v-if="activeTab === 'activity'" class="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        <!-- Main Timeline Feed -->
        <div class="lg:col-span-8 space-y-5 sm:space-y-6">
          <!-- Filter Bar -->
          <section class="bg-surface-container-low p-3 sm:p-4 md:p-5 rounded-2xl sm:rounded-3xl shadow-sm" aria-label="Activity filters">
            <div class="flex flex-wrap items-center gap-3 sm:gap-4">
              <!-- Date Filter -->
              <button class="flex items-center gap-2 px-3 py-2.5 sm:py-3 bg-surface-container hover:bg-surface-container-high active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl sm:rounded-2xl transition-all duration-150 min-h-[44px] min-w-[44px] flex-1 sm:flex-none justify-between sm:justify-start">
                <Calendar class="w-5 h-5 text-on-surface-variant flex-shrink-0" />
                <span class="text-on-surface font-medium text-sm truncate">Last 30 Days</span>
                <ChevronDown class="w-5 h-5 text-on-surface-variant flex-shrink-0" />
              </button>
              <!-- Type Filter -->
              <button class="flex items-center gap-2 px-3 py-2.5 sm:py-3 bg-surface-container hover:bg-surface-container-high active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl sm:rounded-2xl transition-all duration-150 min-h-[44px] min-w-[44px] flex-1 sm:flex-none justify-between sm:justify-start">
                <ListFilter class="w-5 h-5 text-on-surface-variant flex-shrink-0" />
                <span class="text-on-surface font-medium text-sm truncate">Type: All</span>
                <ChevronDown class="w-5 h-5 text-on-surface-variant flex-shrink-0" />
              </button>
              <!-- User Filter -->
              <button class="flex items-center gap-2 px-3 py-2.5 sm:py-3 bg-surface-container hover:bg-surface-container-high active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl sm:rounded-2xl transition-all duration-150 min-h-[44px] min-w-[44px] flex-1 sm:flex-none justify-between sm:justify-start">
                <User class="w-5 h-5 text-on-surface-variant flex-shrink-0" />
                <span class="text-on-surface font-medium text-sm truncate">User: Everyone</span>
                <ChevronDown class="w-5 h-5 text-on-surface-variant flex-shrink-0" />
              </button>
              <!-- Event Count -->
              <div class="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold px-3 py-2.5 sm:py-3 min-h-[44px] flex items-center whitespace-nowrap">
                {{ activityPagination.total }} Total Events
              </div>
            </div>
          </section>

          <!-- Timeline -->
          <div class="relative pl-8 sm:pl-10 md:pl-12 lg:pl-12" role="feed" aria-label="Activity timeline">
            <!-- Vertical Line -->
            <div class="absolute left-3 sm:left-4 md:left-5 top-0 bottom-0 w-0.5 bg-outline-variant/20" aria-hidden="true"></div>

            <article
              v-for="activity in activities"
              :key="activity.id"
              class="relative mb-6 sm:mb-8 md:mb-10 sm:group"
              :aria-label="activity.description"
            >
              <!-- Timeline Dot -->
              <div
                class="absolute left-0 sm:left-0.5 md:left-1 top-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-surface border-2 transition-transform sm:group-hover:scale-110 flex items-center justify-center"
                :class="activityDotClasses(activity.event)"
                aria-hidden="true"
              >
                <div class="w-2 h-2 rounded-full" :class="activityDotInnerClasses(activity.event)"></div>
              </div>

              <!-- Timeline Content -->
              <div class="ml-8 sm:ml-10 bg-surface-container-low rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 shadow-sm border border-outline-variant/5 hover:border-primary/20 transition-all duration-400">
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                  <div class="flex items-start gap-3">
                    <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" :class="activityIconBg(activity.event)">
                      <component :is="activityIcon(activity.event)" class="w-4 h-4" :class="activityIconColor(activity.event)" />
                    </div>
                    <div class="min-w-0 flex-1">
                      <h3 class="text-sm font-bold text-on-surface leading-tight">{{ activity.description }}</h3>
                      <p class="text-[11px] text-on-surface-variant mt-1">
                        {{ activity.causer?.name || 'System' }} • {{ formatDate(activity.created_at) }}
                      </p>
                    </div>
                  </div>
                  <span v-if="activity.subject_type" class="px-2 py-1 bg-surface-container-highest rounded text-[10px] font-medium text-on-surface-variant flex-shrink-0 self-start">
                    {{ subjectLabel(activity.subject_type) }}
                  </span>
                </div>

                <!-- Properties -->
                <div v-if="activity.properties?.attributes && Object.keys(activity.properties.attributes).length" class="ml-0 sm:ml-11 bg-surface-container-lowest/50 p-4 rounded-xl sm:rounded-2xl border-l-4 border-primary/40">
                  <p class="text-sm text-on-surface leading-relaxed">
                    <span v-for="(val, key) in activity.properties.attributes" :key="key">
                      <span class="text-primary font-semibold">{{ key }}:</span> {{ val }}&nbsp;
                    </span>
                  </p>
                </div>
              </div>
            </article>

            <!-- Empty State -->
            <div v-if="activities.length === 0 && !loading" class="text-center py-16">
              <History class="w-16 h-16 text-on-surface-muted mx-auto mb-4" />
              <h3 class="font-headline font-bold text-on-surface text-xl mb-2">No activity yet</h3>
              <p class="text-on-surface-variant text-sm">Activity will appear here as the client interacts with the system.</p>
            </div>

            <!-- Load More -->
            <div v-if="activityPagination.current_page < activityPagination.last_page" class="flex justify-center mt-8 sm:mt-10 md:mt-12">
              <button
                class="px-6 sm:px-8 py-3 sm:min-h-[48px] bg-surface-container-highest text-on-surface text-xs font-bold uppercase tracking-widest rounded-xl sm:rounded-2xl border border-outline-variant/20 hover:bg-surface-variant hover:border-outline-variant/30 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface transition-all flex items-center justify-center gap-3"
                @click="loadMore"
              >
                <History class="w-5 h-5" />
                Load Older Activity
              </button>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <aside class="lg:col-span-4 space-y-5 sm:space-y-6" aria-label="Activity sidebar widgets">
          <!-- Search Widget -->
          <div class="p-4 sm:p-5 md:p-6 bg-surface-container-low rounded-2xl sm:rounded-3xl shadow-sm">
            <h2 class="text-sm font-headline font-bold text-on-surface mb-4 uppercase tracking-wider">Search Activity</h2>
            <div class="relative">
              <input
                class="w-full bg-surface-container border border-outline-variant/10 rounded-xl sm:rounded-2xl pl-4 pr-12 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-on-surface-variant/50 min-h-[44px]"
                placeholder="Keywords, files, users..."
                type="search"
                aria-label="Search activity history"
              />
              <Search class="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant pointer-events-none" />
            </div>
          </div>

          <!-- Activity Distribution -->
          <div class="p-4 sm:p-5 md:p-6 bg-surface-container-low rounded-2xl sm:rounded-3xl shadow-sm">
            <h2 class="text-sm font-headline font-bold text-on-surface mb-5 sm:mb-6 uppercase tracking-wider">Activity Distribution</h2>
            <div class="space-y-4">
              <div class="group cursor-help">
                <div class="flex justify-between text-xs mb-2">
                  <span class="text-on-surface-variant">Project Updates</span>
                  <span class="text-on-surface font-bold">45%</span>
                </div>
                <div class="w-full h-1.5 sm:h-2 bg-surface-container-lowest rounded-full overflow-hidden">
                  <div class="h-full bg-primary rounded-full" style="width: 45%"></div>
                </div>
              </div>
              <div class="group cursor-help">
                <div class="flex justify-between text-xs mb-2">
                  <span class="text-on-surface-variant">File Management</span>
                  <span class="text-on-surface font-bold">30%</span>
                </div>
                <div class="w-full h-1.5 sm:h-2 bg-surface-container-lowest rounded-full overflow-hidden">
                  <div class="h-full bg-secondary rounded-full" style="width: 30%"></div>
                </div>
              </div>
              <div class="group cursor-help">
                <div class="flex justify-between text-xs mb-2">
                  <span class="text-on-surface-variant">Client Communication</span>
                  <span class="text-on-surface font-bold">25%</span>
                </div>
                <div class="w-full h-1.5 sm:h-2 bg-surface-container-lowest rounded-full overflow-hidden">
                  <div class="h-full bg-tertiary rounded-full" style="width: 25%"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Export Widget -->
          <div class="p-4 sm:p-5 md:p-6 bg-surface-container-low rounded-2xl sm:rounded-3xl shadow-sm border border-outline-variant/10 relative overflow-hidden group">
            <div class="absolute -right-8 -bottom-8 w-24 h-24 sm:w-32 sm:h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-700 pointer-events-none" aria-hidden="true"></div>
            <Download class="w-8 h-8 text-primary mb-4 block" />
            <h2 class="text-base sm:text-lg font-headline font-bold text-on-surface mb-2">Export Log</h2>
            <p class="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-6">Generate a comprehensive CSV or PDF activity report for stakeholders.</p>
            <button class="w-full bg-surface-container-highest hover:bg-surface-variant active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-on-surface py-3 px-4 rounded-xl sm:rounded-2xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 min-h-[48px]">
              <Download class="w-4 h-4" />
              Generate Report
            </button>
          </div>
        </aside>
      </div>

      <!-- Projects Tab Content -->
      <div v-else-if="activeTab === 'projects'">
        <ClientProjectsGrid :client-id="clientId" />
      </div>

      <!-- Documents Tab Content -->
      <div v-else-if="activeTab === 'documents'">
        <ClientDocumentVault :client-id="clientId" />
      </div>

      <!-- Overview Tab Content -->
      <div v-else-if="activeTab === 'overview'">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          <div class="lg:col-span-8 space-y-5 sm:space-y-6">
            <div class="bg-surface-container-low rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm">
              <h3 class="font-headline font-bold text-on-surface mb-4 text-sm">Client Information</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p class="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-1">Name</p>
                  <p class="text-sm text-on-surface font-medium">{{ client?.user?.name || '—' }}</p>
                </div>
                <div>
                  <p class="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-1">Email</p>
                  <p class="text-sm text-on-surface font-medium">{{ client?.user?.email || '—' }}</p>
                </div>
                <div>
                  <p class="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-1">Company</p>
                  <p class="text-sm text-on-surface font-medium">{{ client?.company_name || '—' }}</p>
                </div>
                <div>
                  <p class="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-1">Phone</p>
                  <p class="text-sm text-on-surface font-medium">{{ client?.phone || '—' }}</p>
                </div>
                <div>
                  <p class="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-1">Client Since</p>
                  <p class="text-sm text-on-surface font-medium">{{ clientStats?.client_since ? formatDateFull(clientStats.client_since) : (client?.created_at ? formatDateFull(client.created_at) : '—') }}</p>
                </div>
                <div>
                  <p class="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-1">Status</p>
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase" :class="statusBadgeClasses(client?.status || '')">
                    <span class="w-1.5 h-1.5 rounded-full" :class="statusDotClasses(client?.status || '')"></span>
                    {{ capitalize(client?.status || '') }}
                  </span>
                </div>
                <div v-if="client?.address" class="sm:col-span-2">
                  <p class="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-1">Address</p>
                  <p class="text-sm text-on-surface font-medium">{{ client.address }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="lg:col-span-4 space-y-5 sm:space-y-6">
            <div class="bg-surface-container-low rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm">
              <h3 class="font-headline font-bold text-on-surface mb-4 text-sm">Client Summary</h3>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-on-surface-variant text-sm">Projects</span>
                  <span class="font-bold text-on-surface">{{ client?.projects_count || 0 }}</span>
                </div>
                <div v-if="clientStats" class="flex justify-between">
                  <span class="text-on-surface-variant text-sm">Active Projects</span>
                  <span class="font-bold text-on-surface">{{ clientStats.active_projects }}</span>
                </div>
                <div v-if="clientStats" class="flex justify-between">
                  <span class="text-on-surface-variant text-sm">Total Revenue</span>
                  <span class="font-headline font-bold text-on-surface">${{ clientStats.total_revenue }}</span>
                </div>
                <div v-if="clientStats" class="flex justify-between">
                  <span class="text-on-surface-variant text-sm">Invoices</span>
                  <span class="font-bold text-on-surface">{{ clientStats.total_invoices }}</span>
                </div>
                <div v-if="clientStats" class="flex justify-between">
                  <span class="text-on-surface-variant text-sm">Unpaid</span>
                  <span class="font-bold text-red-400">{{ clientStats.unpaid_invoices }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Finance Tab Content -->
      <div v-else-if="activeTab === 'finance'">
        <div v-if="client?.invoices && client.invoices.length > 0" class="bg-surface-container-low rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden">
          <div class="p-5 sm:p-6 border-b border-outline-variant/5">
            <h3 class="font-headline font-bold text-on-surface">Invoices</h3>
          </div>
          <div class="divide-y divide-outline-variant/5">
            <div v-for="invoice in client.invoices" :key="invoice.invoice_id" class="flex items-center justify-between px-4 sm:px-6 py-4 hover:bg-surface-container/60 transition-colors">
              <div>
                <p class="text-sm font-medium text-on-surface">Invoice #{{ invoice.invoice_id }}</p>
                <p class="text-xs text-on-surface-variant">Issued {{ formatDateFull(invoice.date_issued) }} • Due {{ formatDateFull(invoice.due_date) }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-bold text-on-surface">${{ invoice.amount }}</p>
                <span class="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full" :class="invoiceStatusBadge(invoice.status)">{{ invoice.status }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-16">
          <FileText class="w-16 h-16 text-on-surface-muted mx-auto mb-4" />
          <h3 class="font-headline font-bold text-on-surface text-xl mb-2">No invoices yet</h3>
          <p class="text-on-surface-variant text-sm">Create an invoice to get started.</p>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  Pencil, Mail, Calendar, ChevronDown, ListFilter, User,
  Search, Download, History, FileText, Globe,
  CheckCircle, Upload, MessageSquare, Flag, AlertCircle
} from 'lucide-vue-next'
import { useClientsStore } from '@/stores/clients'
import ClientProjectsGrid from './ClientProjectsGrid.vue'
import ClientDocumentVault from './ClientDocumentVault.vue'

const route = useRoute()
const store = useClientsStore()

const clientId = computed(() => Number(route.query.id))
const client = computed(() => store.selectedClient)
const clientStats = computed(() => store.clientStats)
const activities = computed(() => store.activities)
const activityPagination = computed(() => store.activityPagination)
const loading = computed(() => store.loading)

const activeTab = ref('activity')

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  if (hours < 1) return 'Just now'
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatDateFull(dateStr: string | null): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function subjectLabel(type: string): string {
  const map: Record<string, string> = {
    'App\\Models\\Task': 'TASK',
    'App\\Models\\Project': 'PROJECT',
    'App\\Models\\Invoice': 'INVOICE',
    'App\\Models\\File': 'FILE',
    'App\\Models\\User': 'USER',
    'App\\Models\\Client': 'CLIENT',
  }
  return map[type] || type.split('\\').pop() || ''
}

function activityDotClasses(event: string): string {
  const map: Record<string, string> = {
    created: 'border-primary',
    updated: 'border-secondary-container',
    deleted: 'border-red-500/50',
    login: 'border-tertiary-container',
  }
  return map[event] || 'border-outline-variant'
}

function activityDotInnerClasses(event: string): string {
  const map: Record<string, string> = {
    created: 'bg-primary',
    updated: 'bg-secondary',
    deleted: 'bg-red-400',
    login: 'bg-tertiary',
  }
  return map[event] || 'bg-on-surface-muted'
}

function activityIconBg(event: string): string {
  const map: Record<string, string> = {
    created: 'bg-primary/10',
    updated: 'bg-secondary-container/20',
    deleted: 'bg-red-500/10',
    login: 'bg-tertiary-container/20',
  }
  return map[event] || 'bg-surface-container-highest/50'
}

function activityIconColor(event: string): string {
  const map: Record<string, string> = {
    created: 'text-primary',
    updated: 'text-secondary',
    deleted: 'text-red-400',
    login: 'text-tertiary',
  }
  return map[event] || 'text-on-surface-muted'
}

function activityIcon(event: string) {
  const map: Record<string, any> = {
    created: CheckCircle,
    updated: Upload,
    deleted: AlertCircle,
    login: Flag,
  }
  return map[event] || MessageSquare
}

function statusBadgeClasses(status: string): string {
  return status === 'active'
    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
    : 'bg-on-surface-variant/10 text-on-surface-variant border border-on-surface-variant/20'
}

function statusDotClasses(status: string): string {
  return status === 'active' ? 'bg-emerald-400' : 'bg-on-surface-variant'
}

function invoiceStatusBadge(status: string): string {
  const map: Record<string, string> = {
    paid: 'bg-emerald-500/10 text-emerald-400',
    unpaid: 'bg-amber-500/10 text-amber-400',
    overdue: 'bg-red-500/10 text-red-400',
  }
  return map[status] || 'bg-surface-container-highest text-on-surface-variant'
}

function loadMore(): void {
  store.loadMoreActivity()
}

onMounted(async () => {
  if (clientId.value) {
    await store.fetchClient(clientId.value)
    await store.fetchClientStats(clientId.value)
  }
  await store.fetchActivity(1, 20)
})
</script>
