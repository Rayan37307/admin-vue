<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { LogOut, User } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const navItems = [
  { name: 'Active Tasks', path: '/tasks', icon: 'list', label: 'Task List' },
  { name: 'Analytics', path: '/tasks/analytics', icon: 'analytics', label: 'Analytics' },
  { name: 'Hub', path: '/tasks/hub', icon: 'hub', label: 'Hub' },
  { name: 'Calendar', path: '/tasks/calendar', icon: 'calendar_month', label: 'Calendar' },
  { name: 'Assign New', path: '/tasks/assign-new', icon: 'add_task', label: 'Assign New' },
  { name: 'Assign', path: '/tasks/assign', icon: 'assignment_ind', label: 'Assign' },
  { name: 'Details', path: '/tasks/details', icon: 'info', label: 'Details' },
  { name: 'Manage', path: '/tasks/manage', icon: 'settings', label: 'Manage' },
]

const isActive = (path: string): boolean => route.path === path

// Derive user initials for avatar fallback
const userInitials = computed<string>(() => {
  const name = authStore.userName
  if (!name) return 'U'
  return name
    .split(' ')
    .map((part: string) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
})

const handleLogout = async (): Promise<void> => {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <nav class="bg-surface-container border-b border-outline-variant/10">
    <div class="max-w-7xl mx-auto px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <router-link to="/tasks" class="flex items-center gap-3 mr-6">
            <div class="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <span class="material-symbols-outlined text-surface text-xl">rocket_launch</span>
            </div>
            <span class="font-headline text-xl font-bold text-on-surface">Tasks</span>
          </router-link>

          <div class="flex items-center gap-1">
            <router-link
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              :class="[
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
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

        <div class="flex items-center gap-4">
          <button class="p-2 text-on-surface-variant hover:text-on-surface transition-colors">
            <span class="material-symbols-outlined">search</span>
          </button>
          <button class="p-2 text-on-surface-variant hover:text-on-surface transition-colors">
            <span class="material-symbols-outlined">notifications</span>
          </button>

          <!-- User avatar and logout -->
          <div class="flex items-center gap-3 pl-4 border-l border-outline-variant/10">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center overflow-hidden">
                <img
                  v-if="authStore.userAvatar"
                  :src="authStore.userAvatar"
                  :alt="authStore.userName || 'User'"
                  class="w-full h-full object-cover"
                />
                <span v-else class="text-xs font-bold text-on-primary">{{ userInitials }}</span>
              </div>
              <span class="hidden lg:inline text-sm text-on-surface font-medium outfit max-w-[120px] truncate">
                {{ authStore.userName || 'User' }}
              </span>
            </div>
            <button
              @click="handleLogout"
              class="p-2 text-on-surface-variant hover:text-red-400 transition-colors rounded-lg hover:bg-surface-container-high"
              title="Sign out"
            >
              <LogOut class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
