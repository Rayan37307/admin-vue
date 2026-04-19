<template>
  <div class="space-y-8 p-8">
    <header class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div>
        <h1 class="text-4xl font-light text-white">Billing & Finance</h1>
        <p class="text-slate-400 text-sm max-w-lg">Real-time performance metrics and revenue stream tracking.</p>
      </div>
      <button class="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg">
        <PlusCircle class="w-5 h-5" />
        Create Invoice
      </button>
    </header>

    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-surface-container-low rounded-3xl p-6 relative overflow-hidden">
        <div class="absolute left-0 top-0 w-1 h-full bg-primary"></div>
        <p class="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Total Revenue</p>
        <h3 class="text-3xl font-semibold text-white mt-2">$842,900.00</h3>
        <div class="flex items-center gap-2 mt-4 text-emerald-400 text-sm">
          <TrendingUp class="w-4 h-4" />
          <span>+12.5% vs last month</span>
        </div>
      </div>
      <div class="bg-surface-container-low rounded-3xl p-6 relative overflow-hidden">
        <div class="absolute left-0 top-0 w-1 h-full bg-primary"></div>
        <p class="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Monthly Recurring</p>
        <h3 class="text-3xl font-semibold text-white mt-2">$42,150.00</h3>
        <div class="flex items-center gap-2 mt-4 text-primary text-sm">
          <Refresh class="w-4 h-4" />
          <span>Stable growth</span>
        </div>
      </div>
      <div class="bg-surface-container-low rounded-3xl p-6 relative overflow-hidden">
        <div class="absolute left-0 top-0 w-1 h-full bg-rose-500"></div>
        <p class="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Outstanding Payments</p>
        <h3 class="text-3xl font-semibold text-white mt-2">$12,400.00</h3>
        <div class="flex items-center gap-2 mt-4 text-rose-400 text-sm">
          <AlertTriangle class="w-4 h-4" />
          <span>8 invoices overdue</span>
        </div>
      </div>
      <div class="bg-surface-container-low rounded-3xl p-6 relative overflow-hidden">
        <div class="absolute left-0 top-0 w-1 h-full bg-primary"></div>
        <p class="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Active Subscriptions</p>
        <h3 class="text-3xl font-semibold text-white mt-2">1,204</h3>
        <div class="flex items-center gap-2 mt-4 text-slate-400 text-sm">
          <Users class="w-4 h-4" />
          <span>+48 new this week</span>
        </div>
      </div>
    </section>

    <section class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <button class="bg-primary hover:bg-primary/90 p-8 rounded-3xl flex flex-col justify-between items-start gap-4 transition-all shadow-sm min-h-[160px]">
            <PlusCircle class="w-10 h-10" />
            <div>
              <h4 class="text-xl font-bold text-white">Create Invoice</h4>
              <p class="text-white/70 text-sm">Generate and send billing documents</p>
            </div>
          </button>
          <button @click="viewTransactions" class="bg-surface-container-highest hover:bg-surface-container p-8 rounded-3xl flex flex-col justify-between items-start gap-4 transition-all border border-white/10 shadow-sm min-h-[160px] cursor-pointer">
            <Receipt class="w-10 h-10 text-primary" />
            <div>
              <h4 class="text-xl font-bold text-white">View Transactions</h4>
              <p class="text-slate-400 text-sm">Audit logs and payment history</p>
            </div>
          </button>
          <button @click="viewPayments" class="bg-surface-container-highest hover:bg-surface-container p-8 rounded-3xl flex flex-col justify-between items-start gap-4 transition-all border border-white/10 shadow-sm min-h-[160px] cursor-pointer">
            <CreditCard class="w-10 h-10 text-primary" />
            <div>
              <h4 class="text-xl font-bold text-white">Payments</h4>
              <p class="text-slate-400 text-sm">Manage client transactions</p>
            </div>
          </button>
        </div>

        <div class="bg-surface-container-low rounded-3xl p-8">
          <h2 class="text-xl font-bold text-white mb-6">Recent Activity</h2>
          <div class="space-y-4">
            <div class="flex items-center gap-4 p-4 rounded-xl bg-surface-container/50 border border-white/5">
              <div class="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle class="w-5 h-5 text-emerald-400" />
              </div>
              <div class="flex-1">
                <p class="text-sm text-white">Payment received from Quantum Dynamics</p>
                <p class="text-xs text-slate-400">Invoice #XN-9023 • 2 hours ago</p>
              </div>
              <span class="text-sm font-bold text-emerald-400">+$12,500.00</span>
            </div>
            <div class="flex items-center gap-4 p-4 rounded-xl bg-surface-container/50 border border-white/5">
              <div class="w-10 h-10 rounded-full bg-secondary/30 flex items-center justify-center">
                <Mail class="w-5 h-5 text-secondary" />
              </div>
              <div class="flex-1">
                <p class="text-sm text-white">Invoice sent to Nebula Studios</p>
                <p class="text-xs text-slate-400">Invoice #XN-9024 • 5 hours ago</p>
              </div>
              <span class="text-sm text-slate-400">$4,200.00</span>
            </div>
            <div class="flex items-center gap-4 p-4 rounded-xl bg-surface-container/50 border border-white/5">
              <div class="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center">
                <AlertCircle class="w-5 h-5 text-rose-400" />
              </div>
              <div class="flex-1">
                <p class="text-sm text-white">Payment failed: Atlas Logistics</p>
                <p class="text-xs text-slate-400">Retry scheduled • 1 day ago</p>
              </div>
              <span class="text-sm font-bold text-rose-400">-$2,850.00</span>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-surface-container-low rounded-3xl p-8">
        <h2 class="text-xl font-bold text-white mb-6">Payment Distribution</h2>
        <div class="flex items-center justify-center py-8">
          <div class="relative w-48 h-48">
            <svg viewBox="0 0 100 100" class="w-full h-full">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#334155" stroke-width="12" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#c0c1ff" stroke-width="12" stroke-dasharray="180 251" stroke-dashoffset="0" transform="rotate(-90 50 50)" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#a8b4ff" stroke-width="12" stroke-dasharray="45 251" stroke-dashoffset="-180" transform="rotate(-90 50 50)" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#ffb787" stroke-width="12" stroke-dasharray="15 251" stroke-dashoffset="-225" transform="rotate(-90 50 50)" />
            </svg>
          </div>
        </div>
        <div class="space-y-3">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-primary"></div>
            <span class="text-xs text-slate-400">Credit Card (72%)</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-secondary opacity-50"></div>
            <span class="text-xs text-slate-400">Bank Transfer (18%)</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-tertiary"></div>
            <span class="text-xs text-slate-400">Crypto (6%)</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import {
  PlusCircle,
  TrendingUp,
  RefreshCw,
  AlertTriangle,
  Users,
  CheckCircle,
  Mail,
  AlertCircle,
  Receipt,
  CreditCard,
} from 'lucide-vue-next'

const router = useRouter()

function viewTransactions() {
  router.push('/billing/transactions')
}

function viewPayments() {
  router.push('/billing/payments')
}
</script>