<template>
  <div class="space-y-8 p-8">
    <div>
      <h1 class="text-3xl font-light text-white">Sales Reports</h1>
      <p class="text-slate-400">Sales performance and analytics</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-surface-container-low rounded-3xl p-6">
        <p class="text-[10px] text-slate-400 uppercase tracking-widest">Total Sales</p>
        <h3 class="text-3xl font-bold text-white mt-2">$482,950</h3>
      </div>
      <div class="bg-surface-container-low rounded-3xl p-6">
        <p class="text-[10px] text-slate-400 uppercase tracking-widest">New Customers</p>
        <h3 class="text-3xl font-bold text-white mt-2">124</h3>
      </div>
      <div class="bg-surface-container-low rounded-3xl p-6">
        <p class="text-[10px] text-slate-400 uppercase tracking-widest">Conversion Rate</p>
        <h3 class="text-3xl font-bold text-white mt-2">24%</h3>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>