<template>
  <aside
    id="app-sidebar"
    class="h-screen w-56 fixed left-0 top-0 flex flex-col bg-surface border-r border-white/5 z-60 -translate-x-full md:translate-x-0 transition-transform duration-300"
  >
    <!-- Logo / Brand -->
    <div class="p-6 mb-4">
      <div class="flex items-center gap-3">
        <div
          class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20"
        >
          <span class="text-white font-black text-xl space-font">X</span>
        </div>
        <h1 class="text-lg font-bold text-white tracking-tight font-headline">
          Xenon OS
        </h1>
      </div>
      <!-- Close button for mobile -->
      <button
        @click="emit('toggle-menu')"
        class="md:hidden p-2 text-slate-400 hover:text-white rounded-lg absolute right-4 top-8"
      >
        <X class="w-5 h-5" />
      </button>
    </div>

    <!-- Main Navigation Links -->
    <nav class="flex-1 px-3 space-y-1 overflow-y-auto no-scrollbar">
      <RouterLink to="/tasks" custom v-slot="{ href, navigate, isActive }">
        <a
          :href="href"
          @click="navigate"
          :class="[
            'w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group',
            isActive
              ? 'bg-primary/10 text-primary'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          ]"
        >
          <ListTodo
            :class="[
              'w-5 h-5',
              isActive
                ? 'text-primary'
                : 'text-slate-400 group-hover:text-slate-200 transition-colors'
            ]"
          />
          <span class="text-sm font-medium outfit">Tasks</span>
        </a>
      </RouterLink>

      <RouterLink to="/messages" custom v-slot="{ href, navigate, isActive }">
        <a
          :href="href"
          @click="navigate"
          :class="[
            'w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group',
            isActive
              ? 'bg-primary/10 text-primary'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          ]"
        >
          <MessageSquare
            :class="[
              'w-5 h-5',
              isActive
                ? 'text-primary'
                : 'text-slate-400 group-hover:text-slate-200 transition-colors'
            ]"
          />
          <span class="text-sm font-medium outfit">Messages</span>
        </a>
      </RouterLink>

      <RouterLink to="/projects" custom v-slot="{ href, navigate, isActive }">
        <a
          :href="href"
          @click="navigate"
          :class="[
            'w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group',
            isActive
              ? 'bg-primary/10 text-primary'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          ]"
        >
          <FolderOpen
            :class="[
              'w-5 h-5',
              isActive
                ? 'text-primary'
                : 'text-slate-400 group-hover:text-slate-200 transition-colors'
            ]"
          />
          <span class="text-sm font-medium outfit">Projects</span>
        </a>
      </RouterLink>

      <RouterLink to="/clients" custom v-slot="{ href, navigate, isActive }">
        <a
          :href="href"
          @click="navigate"
          :class="[
            'w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group',
            isActive
              ? 'bg-primary/10 text-primary'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          ]"
        >
          <Users
            :class="[
              'w-5 h-5',
              isActive
                ? 'text-primary'
                : 'text-slate-400 group-hover:text-slate-200 transition-colors'
            ]"
          />
          <span class="text-sm font-medium outfit">Clients</span>
        </a>
      </RouterLink>

      <RouterLink to="/files" custom v-slot="{ href, navigate, isActive }">
        <a
          :href="href"
          @click="navigate"
          :class="[
            'w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group',
            isActive
              ? 'bg-primary/10 text-primary'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          ]"
        >
          <FolderArchive
            :class="[
              'w-5 h-5',
              isActive
                ? 'text-primary'
                : 'text-slate-400 group-hover:text-slate-200 transition-colors'
            ]"
          />
          <span class="text-sm font-medium outfit">Files</span>
        </a>
      </RouterLink>

      <RouterLink to="/services" custom v-slot="{ href, navigate, isActive }">
        <a
          :href="href"
          @click="navigate"
          :class="[
            'w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group',
            isActive
              ? 'bg-primary/10 text-primary'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          ]"
        >
          <Layers
            :class="[
              'w-5 h-5',
              isActive
                ? 'text-primary'
                : 'text-slate-400 group-hover:text-slate-200 transition-colors'
            ]"
          />
          <span class="text-sm font-medium outfit">Order Services</span>
        </a>
      </RouterLink>

      <RouterLink to="/billing" custom v-slot="{ href, navigate, isActive }">
        <a
          :href="href"
          @click="navigate"
          :class="[
            'w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group',
            isActive
              ? 'bg-primary/10 text-primary'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          ]"
        >
          <CreditCard
            :class="[
              'w-5 h-5',
              isActive
                ? 'text-primary'
                : 'text-slate-400 group-hover:text-slate-200 transition-colors'
            ]"
          />
          <span class="text-sm font-medium outfit">Billing</span>
        </a>
      </RouterLink>

      <RouterLink to="/profile" custom v-slot="{ href, navigate, isActive }">
        <a
          :href="href"
          @click="navigate"
          :class="[
            'w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group',
            isActive
              ? 'bg-primary/10 text-primary'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          ]"
        >
          <User
            :class="[
              'w-5 h-5',
              isActive
                ? 'text-primary'
                : 'text-slate-400 group-hover:text-slate-200 transition-colors'
            ]"
          />
          <span class="text-sm font-medium outfit">Profile</span>
        </a>
      </RouterLink>

      <RouterLink
        to="/notifications"
        custom
        v-slot="{ href, navigate, isActive }"
      >
        <a
          :href="href"
          @click="navigate"
          :class="[
            'w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group',
            isActive
              ? 'bg-primary/10 text-primary'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          ]"
        >
          <Bell
            :class="[
              'w-5 h-5',
              isActive
                ? 'text-primary'
                : 'text-slate-400 group-hover:text-slate-200 transition-colors'
            ]"
          />
          <span class="text-sm font-medium outfit">Notifications</span>
          <span
            class="ml-auto bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ubuntu space-font"
          >
            12
          </span>
        </a>
      </RouterLink>

      <RouterLink to="/settings" custom v-slot="{ href, navigate, isActive }">
        <a
          :href="href"
          @click="navigate"
          :class="[
            'w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group',
            isActive
              ? 'bg-primary/10 text-primary'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          ]"
        >
          <Settings
            :class="[
              'w-5 h-5',
              isActive
                ? 'text-primary'
                : 'text-slate-400 group-hover:text-slate-200 transition-colors'
            ]"
          />
          <span class="text-sm font-medium outfit">Settings</span>
        </a>
      </RouterLink>
    </nav>

    <!-- User Profile & Logout at Bottom -->
    <div class="p-3 mt-auto border-t border-white/5">
      <div class="flex items-center gap-3 px-3 py-3 mb-2">
        <div
          v-if="authStore.userAvatar"
          class="w-8 h-8 rounded-full overflow-hidden border border-white/10"
        >
          <img
            :src="authStore.userAvatar"
            :alt="authStore.userName || 'User'"
            class="w-full h-full object-cover"
          />
        </div>
        <div
          v-else
          class="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-white/10"
        >
          <span class="text-xs font-bold text-primary">{{
            userInitials
          }}</span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-medium text-white truncate">
            {{ authStore.userName || 'Admin User' }}
          </p>
          <p class="text-[10px] text-slate-500 truncate">
            {{ authStore.userEmail || '' }}
          </p>
        </div>
      </div>
      <button
        @click="handleLogout"
        class="w-full flex items-center gap-3 px-3 py-3 text-slate-400 hover:text-red-400 transition-colors group"
      >
        <LogOut class="w-5 h-5 group-hover:text-red-400 transition-colors" />
        <span class="text-sm font-medium outfit">Logout</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  ListTodo,
  MessageSquare,
  FolderOpen,
  Users,
  FolderArchive,
  Layers,
  CreditCard,
  User,
  Bell,
  Settings,
  LogOut,
  X,
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

// ─── Emits ───────────────────────────────────────────────────────────────────
const emit = defineEmits<{
  (e: 'toggle-menu'): void
}>()

// ─── Store & Router ─────────────────────────────────────────────────────────
const authStore = useAuthStore()
const router = useRouter()

// ─── Computed ────────────────────────────────────────────────────────────────
const userInitials = computed<string>(() => {
  if (!authStore.userName) return 'AU'
  return authStore.userName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

// ─── Actions ─────────────────────────────────────────────────────────────────
function handleLogout(): void {
  authStore.logout()
  router.push('/login')
}
</script>
