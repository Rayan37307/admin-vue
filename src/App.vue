<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from './components/AppSidebar.vue'
import TaskNav from './components/TaskNav.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const route = useRoute()
const authInitializing = ref<boolean>(true)
const sidebarOpen = ref<boolean>(false)

onMounted((): void => {
  authStore.initAuth()
  authInitializing.value = false
})

// Only show sidebar when user is authenticated as admin AND not on an auth page
const showSidebar = computed<boolean>(() => {
  return authStore.isAuthenticated && authStore.isAdmin && !route.meta.requiresGuest
})

// Show TaskNav only when on task-related routes
const showTaskNav = computed<boolean>(() => {
  return route.path.startsWith('/tasks')
})
</script>

<template>
  <div class="min-h-screen bg-surface">
    <!-- Show loading state while initializing auth from localStorage -->
    <div
      v-if="authInitializing"
      class="min-h-screen flex items-center justify-center bg-surface"
    >
      <div class="flex flex-col items-center gap-4">
        <div
          class="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 animate-pulse"
        >
          <span class="text-white font-black text-2xl space-font">X</span>
        </div>
        <p class="text-slate-400 text-sm outfit">Initializing session...</p>
      </div>
    </div>

    <!-- Normal app layout with Sidebar -->
    <template v-else-if="showSidebar">
      <!-- Mobile menu button -->
      <button
        @click="sidebarOpen = !sidebarOpen"
        class="md:hidden fixed top-4 left-4 z-50 p-2 bg-surface-container rounded-lg text-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <!-- Sidebar -->
      <AppSidebar
        :class="{ 'translate-x-0': sidebarOpen }"
        @toggle-menu="sidebarOpen = !sidebarOpen"
      />

      <!-- Mobile overlay -->
      <div
        v-if="sidebarOpen"
        class="md:hidden fixed inset-0 bg-black/50 z-50"
        @click="sidebarOpen = false"
      ></div>

      <!-- Main content area: sidebar offset + optional TaskNav + page content -->
      <div class="md:ml-64 min-h-screen">
        <!-- TaskNav appears only on /tasks/* routes -->
        <TaskNav v-if="showTaskNav" />

        <!-- Page content -->
        <router-view />
      </div>
    </template>

    <!-- Auth pages render without Sidebar (they have their own layout) -->
    <router-view v-else />
  </div>
</template>
