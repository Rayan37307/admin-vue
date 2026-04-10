<template>
  <div class="space-y-12 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
    <!-- Header -->
    <header class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div class="space-y-2">
        <h1 class="font-headline text-5xl font-light tracking-tight text-white">Add New Role</h1>
        <p class="text-slate-400 font-body text-lg max-w-xl">Define role name, permissions, and initial user assignments.</p>
      </div>
      <div class="flex items-center space-x-4">
        <button
          @click="$router.back()"
          class="px-6 py-2.5 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors font-medium ubuntu"
        >
          Cancel
        </button>
        <button
          @click="saveRole"
          class="px-8 py-2.5 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all ubuntu"
        >
          Save Role
        </button>
      </div>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Left Column: Settings -->
      <div class="lg:col-span-8 space-y-8">
        <!-- Role Details -->
        <section class="bg-surface-container/50 p-8 rounded-3xl border border-white/5 hover:border-white/10 transition-all duration-500 relative overflow-hidden group">
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent opacity-50"></div>
          <h3 class="font-headline text-xl font-semibold mb-6 flex items-center gap-3 text-white">
            <Badge class="w-5 h-5 text-primary" />
            Role Details
          </h3>
          <div class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1 ubuntu">Role Name</label>
                <input
                  v-model="roleForm.name"
                  class="w-full bg-surface-container-high border border-white/5 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 text-white placeholder-slate-600 transition-all"
                  placeholder="e.g. Senior Project Lead"
                  type="text"
                />
              </div>
              <div class="space-y-2">
                <label class="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1 ubuntu">Role Status</label>
                <div class="flex items-center space-x-3 bg-surface-container-high w-fit p-1 rounded-2xl">
                  <button
                    @click="roleForm.status = 'active'"
                    :class="[
                      'px-4 py-2 rounded-xl font-bold text-xs transition-all',
                      roleForm.status === 'active'
                        ? 'bg-primary text-white'
                        : 'text-slate-400 hover:text-white'
                    ]"
                  >
                    Active
                  </button>
                  <button
                    @click="roleForm.status = 'inactive'"
                    :class="[
                      'px-4 py-2 rounded-xl font-bold text-xs transition-all',
                      roleForm.status === 'inactive'
                        ? 'bg-primary text-white'
                        : 'text-slate-400 hover:text-white'
                    ]"
                  >
                    Inactive
                  </button>
                </div>
              </div>
            </div>
            <div class="space-y-2">
              <label class="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1 ubuntu">Role Description</label>
              <textarea
                v-model="roleForm.description"
                class="w-full bg-surface-container-high border border-white/5 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 text-white placeholder-slate-600 transition-all resize-none"
                placeholder="Describe the core responsibilities and scope of this role..."
                rows="3"
              ></textarea>
            </div>
          </div>
        </section>

        <!-- Permissions Matrix -->
        <section class="bg-surface-container/50 p-8 rounded-3xl border border-white/5">
          <div class="flex items-center justify-between mb-8">
            <h3 class="font-headline text-xl font-semibold flex items-center gap-3 text-white">
              <Lock class="w-5 h-5 text-tertiary" />
              Permissions Matrix
            </h3>
            <button
              @click="selectAllGlobal"
              class="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <span class="w-1 h-1 rounded-full bg-primary"></span>
              Global Select All
            </button>
          </div>
          <div class="space-y-10">
            <!-- Projects Module -->
            <div>
              <div class="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
                <div class="flex items-center gap-3">
                  <FolderGit class="w-5 h-5 text-slate-500" />
                  <h4 class="font-bold text-white">Projects</h4>
                </div>
                <button
                  @click="selectAllModule('projects')"
                  class="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-primary transition-colors"
                >
                  Select All
                </button>
              </div>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <label
                  v-for="perm in permissionModules.projects"
                  :key="perm.id"
                  class="flex items-center justify-between p-4 bg-surface-container/30 rounded-2xl cursor-pointer hover:bg-surface-container-high transition-all"
                >
                  <span class="text-sm text-slate-300">{{ perm.label }}</span>
                  <input
                    v-model="perm.checked"
                    type="checkbox"
                    class="rounded-md bg-surface-container-high border-none text-primary focus:ring-primary focus:ring-offset-0"
                  />
                </label>
              </div>
            </div>

            <!-- Billing Module -->
            <div>
              <div class="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
                <div class="flex items-center gap-3">
                  <CreditCard class="w-5 h-5 text-slate-500" />
                  <h4 class="font-bold text-white">Billing</h4>
                </div>
                <button
                  @click="selectAllModule('billing')"
                  class="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-primary transition-colors"
                >
                  Select All
                </button>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <label
                  v-for="perm in permissionModules.billing"
                  :key="perm.id"
                  class="flex items-center justify-between p-4 bg-surface-container/30 rounded-2xl cursor-pointer hover:bg-surface-container-high transition-all"
                >
                  <span class="text-sm text-slate-300">{{ perm.label }}</span>
                  <input
                    v-model="perm.checked"
                    type="checkbox"
                    class="rounded-md bg-surface-container-high border-none text-primary focus:ring-primary focus:ring-offset-0"
                  />
                </label>
              </div>
            </div>

            <!-- Notifications Module -->
            <div>
              <div class="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
                <div class="flex items-center gap-3">
                  <BellRing class="w-5 h-5 text-slate-500" />
                  <h4 class="font-bold text-white">Notifications</h4>
                </div>
                <button
                  @click="selectAllModule('notifications')"
                  class="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-primary transition-colors"
                >
                  Select All
                </button>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <label
                  v-for="perm in permissionModules.notifications"
                  :key="perm.id"
                  class="flex items-center justify-between p-4 bg-surface-container/30 rounded-2xl cursor-pointer hover:bg-surface-container-high transition-all"
                >
                  <div class="flex flex-col">
                    <span class="text-sm text-slate-300">{{ perm.label }}</span>
                    <span class="text-[10px] text-slate-500">{{ perm.description }}</span>
                  </div>
                  <input
                    v-model="perm.checked"
                    type="checkbox"
                    class="rounded-md bg-surface-container-high border-none text-primary focus:ring-primary focus:ring-offset-0"
                  />
                </label>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Right Column: Assignments -->
      <div class="lg:col-span-4 space-y-8">
        <section class="bg-surface-container/30 p-6 rounded-3xl border border-white/5 sticky top-28">
          <div class="mb-6">
            <h3 class="font-headline text-lg font-semibold mb-1 flex items-center gap-2 text-white">
              <UserPlus class="w-5 h-5 text-secondary" />
              Assign Users
            </h3>
            <p class="text-xs text-slate-400">Select users to inherit this role immediately.</p>
          </div>
          <div class="relative mb-6">
            <Search class="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              v-model="userSearch"
              class="w-full bg-surface-container-high border border-white/5 rounded-2xl py-3 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-primary/40 text-xs text-white placeholder-slate-600 transition-all"
              placeholder="Search team members..."
              type="text"
            />
          </div>
          <div class="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            <label
              v-for="user in filteredUsers"
              :key="user.id"
              class="flex items-center justify-between p-3 bg-surface-container/30 rounded-2xl cursor-pointer hover:bg-surface-container-high transition-all border border-transparent hover:border-primary/10"
            >
              <div class="flex items-center space-x-3">
                <img
                  :src="user.avatar"
                  :alt="user.name"
                  class="w-8 h-8 rounded-full border border-white/10"
                />
                <div class="flex flex-col">
                  <span class="text-sm font-semibold text-white">{{ user.name }}</span>
                  <span class="text-[10px] text-slate-500">{{ user.role }}</span>
                </div>
              </div>
              <input
                v-model="user.selected"
                type="checkbox"
                class="rounded-md bg-surface-container-high border-none text-primary focus:ring-primary focus:ring-offset-0"
              />
            </label>
          </div>

          <div class="mt-8 pt-6 border-t border-white/10">
            <div class="bg-primary/5 rounded-2xl p-4">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-bold text-primary uppercase tracking-widest">Summary</span>
                <span class="text-xs text-slate-400">{{ selectedCount }} User{{ selectedCount !== 1 ? 's' : '' }} Selected</span>
              </div>
              <div class="text-[11px] text-slate-400 leading-relaxed">
                Selected users will receive an email notification about their new role assignments once saved.
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Badge,
  Lock,
  FolderGit,
  CreditCard,
  BellRing,
  UserPlus,
  Search,
} from 'lucide-vue-next'

interface RoleForm {
  name: string
  status: 'active' | 'inactive'
  description: string
}

interface Permission {
  id: number
  label: string
  checked: boolean
  description?: string
}

interface TeamUser {
  id: number
  name: string
  role: string
  avatar: string
  selected: boolean
}

const roleForm = ref<RoleForm>({
  name: '',
  status: 'active',
  description: '',
})

const permissionModules = ref<{
  projects: Permission[]
  billing: Permission[]
  notifications: Permission[]
}>({
  projects: [
    { id: 1, label: 'View', checked: true },
    { id: 2, label: 'Edit', checked: false },
    { id: 3, label: 'Delete', checked: false },
    { id: 4, label: 'Assign', checked: false },
  ],
  billing: [
    { id: 5, label: 'View Invoices', checked: false },
    { id: 6, label: 'Edit Billing', checked: false },
    { id: 7, label: 'Approve Payments', checked: false },
  ],
  notifications: [
    { id: 8, label: 'Manage Settings', checked: false, description: 'Global alert configurations' },
    { id: 9, label: 'Receive Critical Alerts', checked: true, description: 'High priority system notifications' },
  ],
})

const teamUsers = ref<TeamUser[]>([
  {
    id: 1,
    name: 'Alex Rivera',
    role: 'Design Lead',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWODfONF_1z_-5GerE1eyUoBLxA4rvQ_9gRunh9DCyjcLFTrPrGqbLYpfMiKemCw3bpbyWuJFyJJ74AUbwntbLKlfdis3Ly9hUzgXk_-TO-mtt0t6r9Kz-XlOGjwOeIlGJjYYqIOXo6xrPLxRzKs4IPLbaNtXbiwb7j79exUGFvY-ble-G6bBz_IYtMMXuJs8m7MxMadfXDzZXot-Q2N1QpcIV8WVY4ocojcMmdpLh6b6d2O3fkwjeD0DdvSWaWXRr2ZdxVFrigyk',
    selected: false,
  },
  {
    id: 2,
    name: 'Sarah Chen',
    role: 'Senior Dev',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWYjpFHcgjJIOoDNf7TieyDGNwqhmCcEG3sELP_1JjOhOik9kv-WMUj6e-P1Do_ia8XTFkChvHr3ka5UckLQpk_sRx8__ae2jdTjdbxxj2ZRFdDHldid7eJM4ug-msDbUNr60mGmO_s7C5ZQyUSyqSGifyt3brA_bk3SXshSE6rEnoQDpCSw8vJPUjfzN5lNpNF6302vO928UYZJekMEwq2yxoe2_PgFjwMyjLDcKguAJj6QKXBIYL8YNKrmc3FdguVKP9966cnK0',
    selected: true,
  },
  {
    id: 3,
    name: 'Marcus Thornton',
    role: 'Account Manager',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBcJ-6hCAshH4fEYEpE5cfGgJ0ehwzL7yTjAoCHlGPX_kwJyuwomdm768mhkWIcnzrA5YvfxbyFTKir6c1I0etoG65y0KfPO3WRC_H0rzTwStAoAueAm_WTw95qsAfrX7yyiXKjl4cU3r-KZrwuzQaHZpxkqoPI2LpfUhkWVdPhmMbKZvWNzXdPwgKII8SfmbOTey-Rv5H4Kemvq85mbBBLt5bfykbn0nIX9I3jY5JQBbJhnP1Qr4kouh8ielj1ehhBK96hWHWAw0Q',
    selected: false,
  },
  {
    id: 4,
    name: 'Elena Rodriguez',
    role: 'Junior Designer',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKi0I91f2H3GQkQTckbAcxK8YWMLfW1XjSmLsz-HWibFpyX2sTvgOEBNYCmzZGMj3XL7G2zH-egnUGAYwJLaQjARzC1Xi30CfJyBqiMBeel92oBWCNfgB2GQo-h-7z9qZKxMTHJ0Rbq3E3BiN1aYXFsjBWY-ewKjEzj-r0Td1SM3szN4SbvLdi6SeWtSnQYdGrnCF_-IOhqhx7wjqSoVXz4VbcUnwV7M5oZpwfqoRj7N2iwvKgSi59Rook8ggwtU_mbD29KZRASRA',
    selected: false,
  },
])

const userSearch = ref('')

const filteredUsers = computed(() => {
  if (!userSearch.value) return teamUsers.value
  const search = userSearch.value.toLowerCase()
  return teamUsers.value.filter(
    u => u.name.toLowerCase().includes(search) || u.role.toLowerCase().includes(search)
  )
})

const selectedCount = computed(() => {
  return teamUsers.value.filter(u => u.selected).length
})

function selectAllGlobal() {
  Object.values(permissionModules.value).forEach(module => {
    module.forEach(perm => perm.checked = true)
  })
}

function selectAllModule(moduleName: keyof typeof permissionModules.value) {
  permissionModules.value[moduleName].forEach(perm => perm.checked = true)
}

function saveRole() {
  if (!roleForm.value.name) {
    alert('Please enter a role name')
    return
  }
  alert('Role saved successfully!')
  // TODO: Implement save role logic
}
</script>
