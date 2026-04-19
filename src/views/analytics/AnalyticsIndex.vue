<template>
  <div class="space-y-8 p-8">
    <div>
      <h1 class="text-4xl font-light text-white">Analytics</h1>
      <p class="text-slate-400">Data-driven insights and metrics</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <RouterLink to="/analytics/operations" class="bg-surface-container-low rounded-3xl p-8 hover:bg-surface-container transition-colors">
        <Activity class="w-10 h-10 text-primary mb-4" />
        <h3 class="text-xl font-semibold text-white">Operations</h3>
        <p class="text-sm text-slate-400 mt-2">Operational metrics and KPIs</p>
      </RouterLink>
      <RouterLink to="/analytics/marketing" class="bg-surface-container-low rounded-3xl p-8 hover:bg-surface-container transition-colors">
        <Megaphone class="w-10 h-10 text-secondary mb-4" />
        <h3 class="text-xl font-semibold text-white">Marketing</h3>
        <p class="text-sm text-slate-400 mt-2">Campaign performance analytics</p>
      </RouterLink>
      <RouterLink to="/analytics/executive" class="bg-surface-container-low rounded-3xl p-8 hover:bg-surface-container transition-colors">
        <Briefcase class="w-10 h-10 text-tertiary mb-4" />
        <h3 class="text-xl font-semibold text-white">Executive</h3>
        <p class="text-sm text-slate-400 mt-2">Executive dashboards and reports</p>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Activity, Megaphone, Briefcase } from 'lucide-vue-next'
</script>