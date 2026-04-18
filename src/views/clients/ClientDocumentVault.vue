<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading && !client" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
    </div>

    <template v-else>
      <!-- Documents Content -->
      <div class="space-y-6 sm:space-y-8">
        <!-- Upload Zone -->
        <section
          class="relative group border-2 border-dashed border-outline-variant/20 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer"
          aria-label="File upload area"
        >
          <div class="flex flex-col items-center gap-3">
            <div class="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Upload class="w-8 h-8 text-primary" />
            </div>
            <div>
              <p class="font-headline font-bold text-on-surface text-lg">Drop files here to upload</p>
              <p class="text-on-surface-variant text-sm mt-1">or click to browse your computer</p>
            </div>
          </div>
        </section>

        <!-- File Manager Controls -->
        <section class="flex flex-col sm:flex-row sm:items-center justify-between gap-4" aria-label="File manager controls">
          <div class="flex items-center gap-3 sm:gap-4">
            <h4 class="font-headline font-bold text-base sm:text-lg text-on-surface">Documents</h4>
          </div>
          <div class="flex items-center gap-2 sm:gap-3">
            <!-- View Toggle -->
            <div class="flex bg-surface-container-lowest rounded-lg p-1 border border-outline-variant/10 flex-shrink-0" role="radiogroup" aria-label="File view mode">
              <button
                class="min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] p-1.5 sm:p-2 rounded-md flex items-center justify-center transition-colors"
                :class="viewMode === 'grid' ? 'bg-surface-container-high text-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'"
                role="radio" :aria-checked="viewMode === 'grid'" aria-label="Grid view" @click="viewMode = 'grid'"
              >
                <Grid class="w-5 h-5" />
              </button>
              <button
                class="min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] p-1.5 sm:p-2 rounded-md flex items-center justify-center transition-colors"
                :class="viewMode === 'list' ? 'bg-surface-container-high text-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'"
                role="radio" :aria-checked="viewMode === 'list'" aria-label="List view" @click="viewMode = 'list'"
              >
                <List class="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

        <!-- Invoices as Documents -->
        <div v-if="client?.invoices && client.invoices.length > 0">
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6" v-if="viewMode === 'grid'" role="list">
            <article
              v-for="invoice in client.invoices"
              :key="invoice.invoice_id"
              class="file-card group bg-surface-container rounded-xl p-5 sm:p-6 border border-outline-variant/10 hover:border-outline-variant/20 hover:bg-surface-container-high transition-all duration-300 flex flex-col"
              role="listitem"
            >
              <div class="flex justify-between items-start mb-4 sm:mb-6">
                <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0" :class="invoiceStatusBg(invoice.status)">
                  <FileText class="w-5 h-5 sm:w-6 sm:h-6" :class="invoiceStatusColor(invoice.status)" />
                </div>
                <span class="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full" :class="invoiceStatusBadge(invoice.status)">
                  {{ invoice.status }}
                </span>
              </div>
              <div class="flex-1 min-w-0">
                <h5 class="font-headline font-bold text-sm sm:text-base mb-1 truncate text-on-surface">Invoice #{{ invoice.invoice_id }}</h5>
                <p class="text-xs text-on-surface-variant">{{ formatDate(invoice.date_issued) }} • ${{ invoice.amount }}</p>
              </div>
              <div class="mt-4 sm:mt-6 flex gap-2">
                <button class="flex-1 min-h-[36px] py-2 bg-surface-container-lowest hover:bg-primary/10 hover:text-primary rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5">
                  <Eye class="w-4 h-4" />
                  View
                </button>
                <button class="min-w-[36px] min-h-[36px] p-2 bg-surface-container-lowest hover:bg-primary/10 hover:text-primary rounded-lg transition-colors flex items-center justify-center">
                  <Download class="w-4 h-4" />
                </button>
              </div>
            </article>
          </div>

          <!-- List View -->
          <div v-else class="bg-surface-container-low rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden">
            <div class="divide-y divide-outline-variant/5">
              <div v-for="invoice in client.invoices" :key="invoice.invoice_id" class="flex items-center justify-between px-4 sm:px-6 py-4 hover:bg-surface-container/60 cursor-pointer transition-colors group">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" :class="invoiceStatusBg(invoice.status)">
                    <FileText class="w-5 h-5" :class="invoiceStatusColor(invoice.status)" />
                  </div>
                  <div>
                    <p class="font-medium text-on-surface text-sm truncate group-hover:text-primary transition-colors">Invoice #{{ invoice.invoice_id }}</p>
                    <p class="text-xs text-on-surface-variant">{{ formatDate(invoice.date_issued) }} • Due {{ formatDate(invoice.due_date) }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm font-bold text-on-surface">${{ invoice.amount }}</p>
                  <span class="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full" :class="invoiceStatusBadge(invoice.status)">{{ invoice.status }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-16">
          <FolderOpen class="w-16 h-16 text-on-surface-muted mx-auto mb-4" />
          <h3 class="font-headline font-bold text-on-surface text-xl mb-2">No documents yet</h3>
          <p class="text-on-surface-variant text-sm">Upload files or create an invoice to get started.</p>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { Upload, Grid, List, FileText, Eye, Download, Mail, Plus, FolderOpen } from 'lucide-vue-next'
import { useClientsStore } from '@/stores/clients'

const props = defineProps<{ clientId: number | null }>()
const store = useClientsStore()

const client = computed(() => store.selectedClient)
const loading = computed(() => store.loading)
const viewMode = ref<'grid' | 'list'>('grid')

async function fetchData(id: number): Promise<void> {
  await store.fetchClient(id)
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function invoiceStatusBg(status: string): string {
  const map: Record<string, string> = {
    paid: 'bg-emerald-500/10',
    unpaid: 'bg-amber-500/10',
    overdue: 'bg-red-500/10',
  }
  return map[status] || 'bg-surface-container-highest/50'
}

function invoiceStatusColor(status: string): string {
  const map: Record<string, string> = {
    paid: 'text-emerald-400',
    unpaid: 'text-amber-400',
    overdue: 'text-red-400',
  }
  return map[status] || 'text-on-surface-muted'
}

function invoiceStatusBadge(status: string): string {
  const map: Record<string, string> = {
    paid: 'bg-emerald-500/10 text-emerald-400',
    unpaid: 'bg-amber-500/10 text-amber-400',
    overdue: 'bg-red-500/10 text-red-400',
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
