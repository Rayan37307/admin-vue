<template>
  <div class="space-y-8 p-8">
    <div class="flex justify-between items-end">
      <div>
        <span class="text-[10px] text-tertiary uppercase tracking-[0.2em] font-bold">Operations</span>
        <h1 class="text-4xl font-light text-white mt-1">Operations Analytics</h1>
        <p class="text-slate-400 mt-2">System performance and operational metrics</p>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-surface-container-low rounded-3xl p-6">
        <p class="text-[10px] text-slate-400 uppercase tracking-widest">System Uptime</p>
        <h3 class="text-3xl font-bold text-white mt-2">99.9%</h3>
      </div>
      <div class="bg-surface-container-low rounded-3xl p-6">
        <p class="text-[10px] text-slate-400 uppercase tracking-widest">Response Time</p>
        <h3 class="text-3xl font-bold text-white mt-2">124ms</h3>
      </div>
      <div class="bg-surface-container-low rounded-3xl p-6">
        <p class="text-[10px] text-slate-400 uppercase tracking-widest">Active Servers</p>
        <h3 class="text-3xl font-bold text-white mt-2">48</h3>
      </div>
      <div class="bg-surface-container-low rounded-3xl p-6">
        <p class="text-[10px] text-slate-400 uppercase tracking-widest">Errors Today</p>
        <h3 class="text-3xl font-bold text-rose-400 mt-2">12</h3>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>