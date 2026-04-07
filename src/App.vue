<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TaskNav from './components/TaskNav.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const authInitializing = ref<boolean>(true)

onMounted(async () => {
  authStore.initAuth()

  // Security: If user is authenticated but not admin, logout and redirect
  if (authStore.isAuthenticated && !authStore.isAdmin) {
    authStore.logout()
    router.replace({ name: 'AccessDenied' })
  }

  authInitializing.value = false
})

// Only show TaskNav when user is authenticated as admin AND not on an auth page
const showTaskNav = computed<boolean>(() => {
  return authStore.isAuthenticated && authStore.isAdmin && !route.meta.requiresGuest
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
        <div class="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 animate-pulse">
          <span class="text-white font-black text-2xl space-font">X</span>
        </div>
        <p class="text-slate-400 text-sm outfit">Initializing session...</p>
      </div>
    </div>

    <!-- Normal app layout with TaskNav -->
    <template v-else-if="showTaskNav">
      <TaskNav />
      <router-view />
    </template>

    <!-- Auth pages render without TaskNav (they have their own layout) -->
    <router-view v-else />
  </div>
</template>
