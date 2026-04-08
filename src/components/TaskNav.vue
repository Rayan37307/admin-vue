<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

interface NavItem {
  name: string
  path: string
  icon: string
}

const route = useRoute()

const navItems: NavItem[] = [
  { name: 'Active Tasks', path: '/tasks', icon: 'list' },
  { name: 'Analytics', path: '/tasks/analytics', icon: 'analytics' },
  { name: 'Hub', path: '/tasks/hub', icon: 'hub' },
  { name: 'Calendar', path: '/tasks/calendar', icon: 'calendar_month' },
  { name: 'Assign New', path: '/tasks/assign-new', icon: 'add_task' },
  { name: 'Assign', path: '/tasks/assign', icon: 'assignment_ind' },
  { name: 'Details', path: '/tasks/details', icon: 'info' },
  { name: 'Manage', path: '/tasks/manage', icon: 'settings' },
]

const isActive = (path: string): boolean => route.path === path
</script>

<template>
  <nav class="bg-surface-container border-b border-outline-variant/10">
    <div class="max-w-7xl mx-auto px-6 py-3">
      <div class="flex items-center gap-1 overflow-x-auto no-scrollbar">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          :class="[
            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
            isActive(item.path)
              ? 'bg-primary/10 text-primary'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
          ]"
        >
          <span class="material-symbols-outlined text-lg">{{ item.icon }}</span>
          <span class="hidden md:inline">{{ item.name }}</span>
        </router-link>
      </div>
    </div>
  </nav>
</template>
