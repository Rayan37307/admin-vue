<template>
  <div class="space-y-8 p-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-light text-white">Invoices</h1>
        <p class="text-slate-400">Manage all invoices</p>
      </div>
      <button class="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl flex items-center gap-2">
        <PlusCircle class="w-5 h-5" />
        New Invoice
      </button>
    </div>

    <div class="bg-surface-container-low rounded-3xl overflow-hidden">
      <table class="w-full text-left">
        <thead class="border-b border-white/5">
          <tr>
            <th class="px-6 py-5 text-xs uppercase tracking-widest text-slate-400">Invoice #</th>
            <th class="px-6 py-5 text-xs uppercase tracking-widest text-slate-400">Client</th>
            <th class="px-6 py-5 text-xs uppercase tracking-widest text-slate-400">Amount</th>
            <th class="px-6 py-5 text-xs uppercase tracking-widest text-slate-400">Status</th>
            <th class="px-6 py-5 text-xs uppercase tracking-widest text-slate-400">Date</th>
            <th class="px-6 py-5 text-xs uppercase tracking-widest text-slate-400 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/5">
          <tr v-for="i in 5" :key="i" class="hover:bg-surface-container transition-colors">
            <td class="px-6 py-5 text-white font-medium">XN-{{ 9000 + i }}</td>
            <td class="px-6 py-5 text-white">Client {{ i }}</td>
            <td class="px-6 py-5 text-white">${{ (i * 1200).toLocaleString() }}</td>
            <td class="px-6 py-5">
              <span :class="i % 2 === 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'" class="text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                {{ i % 2 === 0 ? 'Paid' : 'Pending' }}
              </span>
            </td>
            <td class="px-6 py-5 text-slate-400">Dec {{ 10 + i }}, 2023</td>
            <td class="px-6 py-5 text-right">
              <button class="p-2 hover:text-primary"><Eye class="w-4 h-4" /></button>
              <button class="p-2 hover:text-primary"><Download class="w-4 h-4" /></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PlusCircle, Eye, Download } from 'lucide-vue-next'
</script>