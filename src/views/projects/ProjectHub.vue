<template>
  <div class="space-y-8 p-8">
    <div>
      <h1 class="text-3xl font-light text-white">Projects Hub</h1>
      <p class="text-slate-400">Central hub for all project activities</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <RouterLink to="/projects" class="bg-surface-container-low rounded-3xl p-6 hover:bg-surface-container transition-colors">
        <FolderOpen class="w-8 h-8 text-primary mb-4" />
        <h3 class="text-white font-medium">All Projects</h3>
        <p class="text-xs text-slate-400">View and manage all projects</p>
      </RouterLink>
      <RouterLink to="/projects/timeline" class="bg-surface-container-low rounded-3xl p-6 hover:bg-surface-container transition-colors">
        <Calendar class="w-8 h-8 text-primary mb-4" />
        <h3 class="text-white font-medium">Timeline</h3>
        <p class="text-xs text-slate-400">Project timeline view</p>
      </RouterLink>
      <RouterLink to="/projects/team" class="bg-surface-container-low rounded-3xl p-6 hover:bg-surface-container transition-colors">
        <Users class="w-8 h-8 text-primary mb-4" />
        <h3 class="text-white font-medium">Team</h3>
        <p class="text-xs text-slate-400">Team assignments</p>
      </RouterLink>
      <RouterLink to="/projects/details" class="bg-surface-container-low rounded-3xl p-6 hover:bg-surface-container transition-colors">
        <FileText class="w-8 h-8 text-primary mb-4" />
        <h3 class="text-white font-medium">Details</h3>
        <p class="text-xs text-slate-400">Project details</p>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FolderOpen, Calendar, Users, FileText } from 'lucide-vue-next'
</script>