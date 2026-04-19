<template>
  <div class="space-y-8 p-8">
    <header class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
      <div>
        <h1 class="text-4xl font-light tracking-tight text-white">Transaction Ledger</h1>
        <p class="text-slate-400 text-sm max-w-lg mt-2">Detailed overview of financial flows across all active projects and international clients.</p>
      </div>
      <div class="flex flex-wrap gap-3">
        <button class="bg-surface-container-highest hover:bg-surface-container px-4 py-3 rounded-xl flex items-center gap-2 transition-all border border-white/10">
          <Download class="w-4 h-4" />
          <span>Export PDF</span>
        </button>
        <button class="bg-surface-container-highest hover:bg-surface-container px-4 py-3 rounded-xl flex items-center gap-2 transition-all border border-white/10">
          <Share2 class="w-4 h-4" />
          <span>CSV Export</span>
        </button>
        <button class="bg-primary hover:bg-primary/90 text-white px-5 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg">
          <Plus class="w-4 h-4" />
          <span>New Transaction</span>
        </button>
      </div>
    </header>

    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-surface-container-low rounded-3xl p-6 shadow-sm border-l-4 border-primary/40">
        <p class="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Total Volume</p>
        <h3 class="text-3xl font-bold text-white">$124,502.00</h3>
        <p class="text-xs text-primary mt-2 flex items-center gap-1">
          <TrendingUp class="w-3 h-3" />
          +12.4% vs last month
        </p>
      </div>
      <div class="bg-surface-container-low rounded-3xl p-6 shadow-sm border-l-4 border-tertiary/40">
        <p class="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Pending Clearance</p>
        <h3 class="text-3xl font-bold text-white">$8,120.40</h3>
        <p class="text-xs text-slate-400 mt-2">4 active transactions</p>
      </div>
      <div class="sm:col-span-2 bg-surface-container-low rounded-3xl p-6 shadow-sm border border-white/10 flex items-center justify-between">
        <div>
          <p class="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Primary Gateway</p>
          <h3 class="text-xl font-bold text-white">Stripe Connect &bull; USD</h3>
        </div>
        <div class="h-12 w-24 bg-surface-container rounded-lg flex items-center justify-center opacity-40">
          <CreditCard class="w-8 h-8 text-slate-400" />
        </div>
      </div>
    </section>

    <section class="flex flex-wrap items-center gap-4 mb-6">
      <div class="flex items-center gap-2 px-3 py-3 bg-surface-container rounded-xl border border-white/10">
        <Calendar class="w-4 h-4 text-slate-400" />
        <select class="bg-transparent border-none text-sm text-white focus:ring-0 cursor-pointer">
          <option>Last 30 Days</option>
          <option>Current Quarter</option>
          <option>Year to Date</option>
          <option>All Time</option>
        </select>
      </div>
      <div class="flex items-center gap-2 px-3 py-3 bg-surface-container rounded-xl border border-white/10">
        <Filter class="w-4 h-4 text-slate-400" />
        <select class="bg-transparent border-none text-sm text-white focus:ring-0 cursor-pointer">
          <option>All Methods</option>
          <option>Wire Transfer</option>
          <option>Credit Card</option>
          <option>Crypto (USDC)</option>
        </select>
      </div>
      <div class="flex items-center gap-2 px-3 py-3 bg-surface-container rounded-xl border border-white/10">
        <CheckCircle class="w-4 h-4 text-slate-400" />
        <select class="bg-transparent border-none text-sm text-white focus:ring-0 cursor-pointer">
          <option>Any Status</option>
          <option>Completed</option>
          <option>Pending</option>
          <option>Failed</option>
        </select>
      </div>
      <button class="ml-auto text-sm text-primary font-medium hover:underline">Clear all filters</button>
    </section>

    <div class="bg-surface-container-low rounded-3xl overflow-hidden mb-8">
      <table class="w-full text-left">
        <thead>
          <tr class="border-b border-white/10">
            <th class="px-6 py-5 text-[10px] uppercase tracking-[0.15em] text-slate-400">Transaction ID</th>
            <th class="px-6 py-5 text-[10px] uppercase tracking-[0.15em] text-slate-400">Date</th>
            <th class="px-6 py-5 text-[10px] uppercase tracking-[0.15em] text-slate-400">Client</th>
            <th class="px-6 py-5 text-[10px] uppercase tracking-[0.15em] text-slate-400 hidden sm:table-cell">Method</th>
            <th class="px-6 py-5 text-[10px] uppercase tracking-[0.15em] text-slate-400">Status</th>
            <th class="px-6 py-5 text-[10px] uppercase tracking-[0.15em] text-slate-400 text-right">Amount</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/5">
          <tr class="hover:bg-surface-container-high/60 transition-colors cursor-pointer" v-for="txn in transactions" :key="txn.id">
            <td class="px-6 py-5">
              <span class="text-sm font-mono text-slate-400">#{{ txn.id }}</span>
            </td>
            <td class="px-6 py-5 text-sm text-white whitespace-nowrap">{{ txn.date }}</td>
            <td class="px-6 py-5">
              <div class="flex items-center gap-3">
                <div class="h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-bold" :class="txn.initials.bg">
                  <span :class="txn.initials.text">{{ txn.initials.label }}</span>
                </div>
                <span class="text-sm font-medium">{{ txn.client }}</span>
              </div>
            </td>
            <td class="px-6 py-5 hidden sm:table-cell">
              <div class="flex items-center gap-2">
                <component :is="txn.methodIcon" class="w-4 h-4 text-slate-400" />
                <span class="text-sm">{{ txn.method }}</span>
              </div>
            </td>
            <td class="px-6 py-5">
              <span :class="[txn.statusClass, 'px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider']">{{ txn.status }}</span>
            </td>
            <td class="px-6 py-5 text-right font-bold" :class="txn.amountClass">{{ txn.amount }}</td>
          </tr>
        </tbody>
      </table>

      <div class="px-6 py-4 flex items-center justify-between bg-surface-container/50 border-t border-white/5">
        <p class="text-xs text-slate-400">Showing <span class="text-white font-bold">5</span> of <span class="text-white font-bold">1,240</span> entries</p>
        <div class="flex items-center gap-1.5">
          <button class="p-2 rounded-lg hover:bg-surface-container-highest transition-colors disabled:opacity-20">
            <ChevronLeft class="w-4 h-4" />
          </button>
          <button class="w-9 h-9 flex items-center justify-center rounded-lg bg-primary text-white text-xs font-bold">1</button>
          <button class="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-container-highest text-xs font-medium transition-colors">2</button>
          <button class="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-container-highest text-xs font-medium transition-colors">3</button>
          <span class="mx-1 text-slate-400 text-xs">...</span>
          <button class="p-2 rounded-lg hover:bg-surface-container-highest transition-colors">
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <section class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="md:col-span-2 bg-surface-container-low rounded-3xl p-8 relative overflow-hidden">
        <div class="absolute top-4 right-4 opacity-10">
          <ShieldCheck class="w-24 h-24 text-slate-400" />
        </div>
        <h4 class="text-xl font-bold text-white mb-4">Integrity Audit</h4>
        <p class="text-slate-400 text-sm mb-6 max-w-lg">All transactions are cryptographically signed and immutable once completed. Our automated reconciliation system runs every 6 hours to ensure your ledger matches your connected bank entities.</p>
        <div class="flex flex-wrap items-center gap-6">
          <div class="flex items-center gap-2">
            <span class="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
            <span class="text-xs font-mono uppercase text-white">System Live</span>
          </div>
          <div class="flex items-center gap-2">
            <CheckCircle class="w-4 h-4 text-primary" />
            <span class="text-xs font-mono uppercase text-white">Verified Today</span>
          </div>
        </div>
      </div>
      <div class="bg-surface-container-high rounded-3xl p-8 border border-white/10 flex flex-col justify-between">
        <div>
          <HelpCircle class="w-8 h-8 text-primary mb-4" />
          <h4 class="font-bold text-lg text-white mb-2">Need Assistance?</h4>
          <p class="text-slate-400 text-sm">Our dedicated finance desk is available 24/7 for high-value transaction support.</p>
        </div>
        <button class="w-full mt-6 py-3 rounded-xl bg-surface hover:bg-primary hover:text-white text-white text-sm font-bold transition-all">
          Contact Support
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import {
  Download,
  Share2,
  Plus,
  TrendingUp,
  CreditCard,
  Calendar,
  Filter,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  HelpCircle,
  ArrowRightLeft,
  Building2,
} from 'lucide-vue-next'

const transactions = [
  {
    id: 'TXN-88219',
    date: 'Oct 24, 2023',
    client: 'Nexus Labs Inc.',
    initials: { label: 'NL', bg: 'bg-primary/20 text-primary', text: 'text-primary' },
    method: 'Credit Card',
    methodIcon: CreditCard,
    status: 'Completed',
    statusClass: 'bg-primary/10 text-primary',
    amount: '$12,450.00',
    amountClass: 'text-white',
  },
  {
    id: 'TXN-88220',
    date: 'Oct 23, 2023',
    client: 'Solaris Architecture',
    initials: { label: 'SA', bg: 'bg-tertiary/20 text-tertiary', text: 'text-tertiary' },
    method: 'Wire Transfer',
    methodIcon: Building2,
    status: 'Pending',
    statusClass: 'bg-surface-container-highest text-slate-400',
    amount: '$4,800.00',
    amountClass: 'text-white',
  },
  {
    id: 'TXN-88221',
    date: 'Oct 21, 2023',
    client: 'Vanguard Estate',
    initials: { label: 'VE', bg: 'bg-indigo-500/20 text-indigo-400', text: 'text-indigo-400' },
    method: 'USDC (Polygon)',
    methodIcon: ArrowRightLeft,
    status: 'Completed',
    statusClass: 'bg-primary/10 text-primary',
    amount: '$32,000.00',
    amountClass: 'text-white',
  },
  {
    id: 'TXN-88222',
    date: 'Oct 20, 2023',
    client: 'Aura Kraft',
    initials: { label: 'AK', bg: 'bg-rose-500/20 text-rose-400', text: 'text-rose-400' },
    method: 'Credit Card',
    methodIcon: CreditCard,
    status: 'Failed',
    statusClass: 'bg-rose-500/20 text-rose-400',
    amount: '$920.00',
    amountClass: 'text-rose-400',
  },
  {
    id: 'TXN-88223',
    date: 'Oct 19, 2023',
    client: 'Quantum UI',
    initials: { label: 'QU', bg: 'bg-surface-container-highest text-white', text: 'text-white' },
    method: 'Wire Transfer',
    methodIcon: Building2,
    status: 'Completed',
    statusClass: 'bg-primary/10 text-primary',
    amount: '$7,250.00',
    amountClass: 'text-white',
  },
]
</script>