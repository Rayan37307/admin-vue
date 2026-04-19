<template>
  <div class="space-y-8 p-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-light text-white">Project Timeline</h1>
        <p class="text-slate-400">All projects timeline view</p>
      </div>
    </div>

    <div class="space-y-4">
      <div v-for="i in 10" :key="i" class="bg-surface-container-low rounded-3xl p-6 flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">{{ i }}</div>
        <div class="flex-1">
          <h3 class="text-white font-medium">Project {{ i }}</h3>
          <p class="text-xs text-slate-400">Client {{ i }}</p>
        </div>
        <div class="text-right">
          <p class="text-sm text-white">Oct {{ 10 + i }}, 2023</p>
          <p class="text-xs text-primary">75% complete</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>