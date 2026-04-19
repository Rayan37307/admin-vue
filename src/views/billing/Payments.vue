<template>
  <div class="space-y-8 p-8">
    <header class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div>
        <span class="text-primary text-[10px] tracking-[0.2em] uppercase font-bold">Financial Overview</span>
        <h1 class="text-5xl font-light text-white mt-2 -ml-1">Payments</h1>
        <p class="text-slate-400 mt-2 max-w-md">Manage client transactions, active balances, and financial health for your agency elite ecosystem.</p>
      </div>
      <button class="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-4 rounded-xl flex items-center gap-3 shadow-lg shadow-primary/10 transition-all active:scale-95">
        <PlusCircle class="w-5 h-5" />
        Request Payment
      </button>
    </header>

    <section class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-surface-container-low p-6 rounded-xl border-l-2 border-l-primary relative overflow-hidden group">
        <p class="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Total Revenue</p>
        <h3 class="text-3xl font-bold text-white mt-4">$142,850.00</h3>
        <div class="flex items-center gap-2 mt-4 text-xs font-bold text-indigo-400">
          <TrendingUp class="w-3 h-3" />
          <span>+12.4% vs last month</span>
        </div>
      </div>
      <div class="bg-surface-container-low p-6 rounded-xl border-l-2 border-l-tertiary relative overflow-hidden">
        <p class="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Pending Payments</p>
        <h3 class="text-3xl font-bold text-white mt-4">$12,400.00</h3>
        <div class="flex items-center gap-2 mt-4 text-xs font-bold text-tertiary">
          <Clock class="w-3 h-3" />
          <span>8 invoices awaiting</span>
        </div>
      </div>
      <div class="bg-surface-container-low p-6 rounded-xl border-l-2 border-l-secondary relative overflow-hidden">
        <p class="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Completed (MTD)</p>
        <h3 class="text-3xl font-bold text-white mt-4">142</h3>
        <div class="flex items-center gap-2 mt-4 text-xs font-bold text-secondary">
          <CheckCircle class="w-3 h-3" />
          <span>98% success rate</span>
        </div>
      </div>
      <div class="bg-surface-container-low p-6 rounded-xl border-l-2 border-l-rose-500 relative overflow-hidden">
        <p class="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Failed Transactions</p>
        <h3 class="text-3xl font-bold text-white mt-4">3</h3>
        <div class="flex items-center gap-2 mt-4 text-xs font-bold text-rose-400">
          <AlertCircle class="w-3 h-3" />
          <span>Action required</span>
        </div>
      </div>
    </section>

    <div class="bg-surface-container rounded-2xl overflow-hidden shadow-2xl shadow-black/20">
      <div class="p-6 flex items-center justify-between border-b border-white/10">
        <h4 class="text-lg font-bold text-white">Recent Transactions</h4>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2 bg-surface-container-low rounded-lg px-3 py-1.5">
            <Filter class="w-4 h-4 text-slate-500" />
            <span class="text-xs font-bold text-slate-400">Filters</span>
          </div>
          <button class="text-primary text-xs font-bold flex items-center gap-1 group">
            <span class="w-1 h-1 bg-primary rounded-full group-hover:w-3 transition-all duration-300"></span>
            View All
          </button>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low/50">
              <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Client</th>
              <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Transaction ID</th>
              <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Amount</th>
              <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</th>
              <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Method</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            <tr class="hover:bg-surface-container-high/30 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">NL</div>
                  <div>
                    <p class="text-sm font-bold text-white">Nova Labs</p>
                    <p class="text-[10px] text-slate-400">Web Architecture</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 font-mono text-xs text-slate-400">#TXN-90210</td>
              <td class="px-6 py-4 font-bold text-white">$4,500.00</td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 rounded-md bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-wider">Completed</span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2 text-slate-400">
                  <CreditCard class="w-4 h-4" />
                  <span class="text-xs font-medium">Visa •••• 4242</span>
                </div>
              </td>
            </tr>
            <tr class="hover:bg-surface-container-high/30 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-tertiary/20 text-tertiary flex items-center justify-center font-bold text-xs">SV</div>
                  <div>
                    <p class="text-sm font-bold text-white">Solar Ventures</p>
                    <p class="text-[10px] text-slate-400">Branding Package</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 font-mono text-xs text-slate-400">#TXN-88432</td>
              <td class="px-6 py-4 font-bold text-white">$12,000.00</td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 rounded-md bg-tertiary/10 text-tertiary text-[10px] font-bold uppercase tracking-wider">Pending</span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2 text-slate-400">
                  <Building2 class="w-4 h-4" />
                  <span class="text-xs font-medium">Bank Transfer</span>
                </div>
              </td>
            </tr>
            <tr class="hover:bg-surface-container-high/30 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-secondary/20 text-secondary flex items-center justify-center font-bold text-xs">KM</div>
                  <div>
                    <p class="text-sm font-bold text-white">Kinetic Media</p>
                    <p class="text-[10px] text-slate-400">Ad Campaign</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 font-mono text-xs text-slate-400">#TXN-77321</td>
              <td class="px-6 py-4 font-bold text-white">$850.00</td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 rounded-md bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-wider">Completed</span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2 text-slate-400">
                  <Wallet class="w-4 h-4" />
                  <span class="text-xs font-medium">PayPal</span>
                </div>
              </td>
            </tr>
            <tr class="hover:bg-surface-container-high/30 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs">AH</div>
                  <div>
                    <p class="text-sm font-bold text-white">Aero Health</p>
                    <p class="text-[10px] text-slate-400">UI Audit</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 font-mono text-xs text-slate-400">#TXN-76551</td>
              <td class="px-6 py-4 font-bold text-white">$3,200.00</td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 rounded-md bg-rose-500/10 text-rose-400 text-[10px] font-bold uppercase tracking-wider">Failed</span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2 text-slate-400">
                  <CreditCard class="w-4 h-4" />
                  <span class="text-xs font-medium">Mastercard •••• 9012</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  PlusCircle,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Filter,
  CreditCard,
  Building2,
  Wallet,
} from 'lucide-vue-next'
</script>