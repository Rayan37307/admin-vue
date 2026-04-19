<template>
  <div class="space-y-8 p-8">
    <div>
      <h1 class="text-3xl font-light text-white">Reports Insights</h1>
      <p class="text-slate-400">Business intelligence and analytics</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-surface-container-low rounded-3xl p-6">
        <BarChart2 class="w-8 h-8 text-primary mb-4" />
        <h3 class="text-white font-medium mb-2">Analytics Dashboard</h3>
        <p class="text-xs text-slate-400">Comprehensive business metrics</p>
      </div>
      <div class="bg-surface-container-low rounded-3xl p-6">
        <FileText class="w-8 h-8 text-tertiary mb-4" />
        <h3 class="text-white font-medium mb-2">Report Builder</h3>
        <p class="text-xs text-slate-400">Custom report generation</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BarChart2, FileText } from 'lucide-vue-next'
</script>