<template>
  <div class="space-y-8 p-8">
    <div>
      <h1 class="text-4xl font-light text-white">Reports</h1>
      <p class="text-slate-400">Business reports and analytics</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <RouterLink to="/reports/financial" class="bg-surface-container-low rounded-3xl p-8 hover:bg-surface-container transition-colors">
        <DollarSign class="w-10 h-10 text-primary mb-4" />
        <h3 class="text-xl font-semibold text-white">Financial</h3>
        <p class="text-sm text-slate-400 mt-2">Revenue and expenses</p>
      </RouterLink>
      <RouterLink to="/reports/sales" class="bg-surface-container-low rounded-3xl p-8 hover:bg-surface-container transition-colors">
        <TrendingUp class="w-10 h-10 text-secondary mb-4" />
        <h3 class="text-xl font-semibold text-white">Sales</h3>
        <p class="text-sm text-slate-400 mt-2">Sales performance</p>
      </RouterLink>
      <RouterLink to="/reports/insights" class="bg-surface-container-low rounded-3xl p-8 hover:bg-surface-container transition-colors">
        <Lightbulb class="w-10 h-10 text-tertiary mb-4" />
        <h3 class="text-xl font-semibold text-white">Insights</h3>
        <p class="text-sm text-slate-400 mt-2">Business intelligence</p>
      </RouterLink>
      <RouterLink to="/reports/support" class="bg-surface-container-low rounded-3xl p-8 hover:bg-surface-container transition-colors">
        <Headphones class="w-10 h-10 text-primary mb-4" />
        <h3 class="text-xl font-semibold text-white">Support</h3>
        <p class="text-sm text-slate-400 mt-2">Customer support metrics</p>
      </RouterLink>
      <RouterLink to="/reports/builder" class="bg-surface-container-low rounded-3xl p-8 hover:bg-surface-container transition-colors">
        <FilePlus class="w-10 h-10 text-secondary mb-4" />
        <h3 class="text-xl font-semibold text-white">Report Builder</h3>
        <p class="text-sm text-slate-400 mt-2">Custom reports</p>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DollarSign, TrendingUp, Lightbulb, Headphones, FilePlus } from 'lucide-vue-next'
</script>