<template>
  <div class="space-y-8 p-8">
    <div class="flex justify-between items-end mb-8">
      <div>
        <p class="text-[10px] text-tertiary uppercase tracking-[0.2em] font-bold mb-1">Financial Performance</p>
        <h3 class="text-4xl font-light text-white">Agency Overview</h3>
      </div>
      <button class="bg-primary text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:shadow-[0_0_20px_rgba(192,193,255,0.3)] transition-all">
        <Download class="w-4 h-4" />
        <span>Export Data</span>
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-surface-container-low p-6 rounded-xl relative overflow-hidden">
        <div class="absolute top-0 left-0 w-1 h-full bg-primary"></div>
        <div class="flex justify-between items-start mb-4">
          <Wallet class="w-5 h-5 text-primary" />
          <span class="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-full">+12.5%</span>
        </div>
        <p class="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Total Revenue</p>
        <h4 class="text-3xl font-bold text-white mt-1">$482,950</h4>
      </div>
      <div class="bg-surface-container-low p-6 rounded-xl relative overflow-hidden">
        <div class="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
        <div class="flex justify-between items-start mb-4">
          <DollarSign class="w-5 h-5 text-rose-500" />
          <span class="text-[10px] bg-rose-500/10 text-rose-500 px-2 py-1 rounded-full">+4.2%</span>
        </div>
        <p class="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Total Expenses</p>
        <h4 class="text-3xl font-bold text-white mt-1">$128,400</h4>
      </div>
      <div class="bg-surface-container-low p-6 rounded-xl relative overflow-hidden">
        <div class="absolute top-0 left-0 w-1 h-full bg-tertiary"></div>
        <div class="flex justify-between items-start mb-4">
          <TrendingUp class="w-5 h-5 text-tertiary" />
          <span class="text-[10px] bg-tertiary/10 text-tertiary px-2 py-1 rounded-full">+18.3%</span>
        </div>
        <p class="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Net Profit</p>
        <h4 class="text-3xl font-bold text-white mt-1">$354,550</h4>
      </div>
      <div class="bg-surface-container-low p-6 rounded-xl relative overflow-hidden">
        <div class="absolute top-0 left-0 w-1 h-full bg-secondary"></div>
        <div class="flex justify-between items-start mb-4">
          <GitBranch class="w-5 h-5 text-secondary" />
          <span class="text-[10px] bg-secondary/10 text-secondary px-2 py-1 rounded-full">Stable</span>
        </div>
        <p class="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Cash Flow</p>
        <h4 class="text-3xl font-bold text-white mt-1">$92,120</h4>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 bg-surface-container p-8 rounded-2xl border border-white/10">
        <h5 class="text-lg font-semibold text-white mb-6">Monthly Revenue</h5>
        <div class="h-72 flex items-end gap-3">
          <div v-for="i in 6" :key="i" class="flex-1 flex flex-col items-center gap-2">
            <div class="w-full rounded-t-lg bg-primary/30 hover:bg-primary/50 transition-all" :style="{ height: (30 + i * 15) + '%' }"></div>
            <span class="text-[10px] text-slate-400">M{{ i }}</span>
          </div>
        </div>
      </div>

      <div class="bg-surface-container-low p-8 rounded-2xl border border-white/10">
        <div class="flex justify-between items-center mb-8">
          <h5 class="text-lg font-semibold text-white">Financial Reports</h5>
        </div>
        <div class="space-y-4">
          <div class="flex items-center gap-4 cursor-pointer hover:bg-surface-bright/20 p-2 rounded-xl transition-all">
            <div class="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-tertiary">
              <FileText class="w-5 h-5" />
            </div>
            <div>
              <p class="text-sm font-semibold text-white">Q3 Tax Summary</p>
              <p class="text-xs text-slate-400">Generated Dec 14, 2023</p>
            </div>
          </div>
          <div class="flex items-center gap-4 cursor-pointer hover:bg-surface-bright/20 p-2 rounded-xl transition-all">
            <div class="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary">
              <BarChart2 class="w-5 h-5" />
            </div>
            <div>
              <p class="text-sm font-semibold text-white">Annual Forecast 2024</p>
              <p class="text-xs text-slate-400">Generated Dec 10, 2023</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-surface-container p-8 rounded-2xl">
      <h5 class="text-lg font-semibold text-white mb-6">Recent Transactions</h5>
      <table class="w-full text-left">
        <thead>
          <tr class="border-b border-white/10 text-slate-400">
            <th class="pb-4 text-[10px] uppercase tracking-widest font-bold">Company / Vendor</th>
            <th class="pb-4 text-[10px] uppercase tracking-widest font-bold">Date</th>
            <th class="pb-4 text-[10px] uppercase tracking-widest font-bold text-right">Amount</th>
            <th class="pb-4 text-[10px] uppercase tracking-widest font-bold text-center">Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/5">
          <tr v-for="i in 4" :key="i" class="hover:bg-surface-bright/10 transition-colors">
            <td class="py-5">
              <div class="flex items-center">
                <div class="w-9 h-9 rounded-lg bg-surface-container-highest flex items-center justify-center mr-3">
                  <Cloud class="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p class="text-sm font-semibold text-white">DigitalOcean Inc.</p>
                  <p class="text-[10px] text-slate-400">Cloud Infrastructure</p>
                </div>
              </div>
            </td>
            <td class="py-5 text-sm text-white">Dec {{ 14 - i }}, 2023</td>
            <td class="py-5 text-sm font-bold text-right" :class="i % 2 === 0 ? 'text-rose-400' : 'text-primary'">
              {{ i % 2 === 0 ? '-' : '+' }}${{ (i * 310) + 100 }}.00
            </td>
            <td class="py-5 text-center">
              <span class="px-2 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full">COMPLETED</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Download,
  Wallet,
  DollarSign,
  TrendingUp,
  GitBranch,
  FileText,
  BarChart2,
  Cloud,
} from 'lucide-vue-next'
</script>