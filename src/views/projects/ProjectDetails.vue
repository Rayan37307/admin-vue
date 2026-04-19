<template>
  <div class="space-y-8 p-8">
    <div class="flex items-center gap-4">
      <RouterLink to="/projects" class="p-2 hover:bg-surface-container rounded-lg">
        <ArrowLeft class="w-5 h-5 text-slate-400" />
      </RouterLink>
      <div>
        <h1 class="text-3xl font-light text-white">Lumina Rebrand</h1>
        <p class="text-slate-400">Q4 Brand Identity Project</p>
      </div>
      <span class="ml-auto px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase">Active</span>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-surface-container-low rounded-3xl p-6">
          <h2 class="text-xl font-bold text-white mb-4">Project Details</h2>
          <div class="space-y-4">
            <div class="flex justify-between">
              <span class="text-slate-400">Client</span>
              <span class="text-white font-medium">Aura Dynamics</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Start Date</span>
              <span class="text-white">Oct 1, 2023</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Deadline</span>
              <span class="text-white">Dec 31, 2023</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Budget</span>
              <span class="text-white">$24,000</span>
            </div>
          </div>
        </div>

        <div class="bg-surface-container-low rounded-3xl p-6">
          <h2 class="text-xl font-bold text-white mb-4">Team Members</h2>
          <div class="flex -space-x-2">
            <div class="w-10 h-10 rounded-full bg-primary/20 border-2 border-surface"></div>
            <div class="w-10 h-10 rounded-full bg-tertiary/20 border-2 border-surface"></div>
            <div class="w-10 h-10 rounded-full bg-secondary/20 border-2 border-surface flex items-center justify-center text-xs font-bold">+4</div>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="bg-surface-container-low rounded-3xl p-6">
          <h2 class="text-xl font-bold text-white mb-4">Progress</h2>
          <div class="text-4xl font-light text-white">75%</div>
          <div class="w-full bg-surface-container-highest h-2 rounded-full mt-4">
            <div class="h-full bg-primary rounded-full" style="width: 75%"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'
</script>