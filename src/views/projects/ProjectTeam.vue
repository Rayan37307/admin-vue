<template>
  <div class="space-y-8 p-8">
    <div>
      <h1 class="text-3xl font-light text-white">Project Teams</h1>
      <p class="text-slate-400">Team assignments across projects</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="bg-surface-container-low rounded-3xl p-6">
        <h3 class="text-white font-medium mb-4">Project {{ i }}</h3>
        <div class="flex -space-x-2">
          <div class="w-8 h-8 rounded-full bg-primary/20 border-2 border-surface"></div>
          <div class="w-8 h-8 rounded-full bg-tertiary/20 border-2 border-surface"></div>
          <div class="w-8 h-8 rounded-full bg-surface-container-highest border-2 border-surface flex items-center justify-center text-[10px] font-bold">+2</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>