<template>
  <div class="space-y-12 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
    <!-- Header -->
    <section class="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
      <div class="space-y-2">
        <h1 class="text-5xl font-light text-white tracking-tight font-headline">Roles & Permissions</h1>
        <p class="text-slate-400 text-sm font-medium max-w-lg">Manage organizational hierarchies and granular access control for your workspace modules.</p>
      </div>
      <button
        @click="$router.push('/roles/add')"
        class="relative group overflow-hidden bg-primary text-white px-8 py-3.5 rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] transition-all active:scale-95 flex items-center gap-2 ubuntu"
      >
        <Plus class="w-4 h-4" />
        <span class="relative z-10">Add New Role</span>
      </button>
    </section>

    <!-- Roles Table -->
    <section class="bg-surface-container/50 border border-white/5 rounded-3xl overflow-hidden shadow-xl">
      <div class="p-6 border-b border-white/5 flex justify-between items-center">
        <h3 class="text-lg font-semibold text-white font-headline">Active Directory</h3>
        <span class="text-xs text-slate-400 font-medium">{{ roles.length }} Total Roles</span>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-surface-container/30 text-slate-400 text-[11px] uppercase tracking-widest font-bold">
            <tr>
              <th class="px-8 py-4">Role Name</th>
              <th class="px-8 py-4">Users Assigned</th>
              <th class="px-8 py-4">Status</th>
              <th class="px-8 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            <tr
              v-for="role in roles"
              :key="role.id"
              class="hover:bg-white/[0.02] transition-colors cursor-pointer"
              :class="{ 'bg-primary/[0.03] border-l-4 border-l-primary': selectedRoleId === role.id }"
              @click="selectRole(role.id)"
            >
              <td class="px-8 py-5">
                <div class="flex items-center gap-3">
                  <div class="w-2 h-8 rounded-full" :class="role.color"></div>
                  <div>
                    <p class="font-semibold text-white">{{ role.name }}</p>
                    <p class="text-xs text-slate-400">{{ role.description }}</p>
                  </div>
                </div>
              </td>
              <td class="px-8 py-5">
                <div class="flex -space-x-2">
                  <img
                    v-for="(user, idx) in role.users.slice(0, 2)"
                    :key="idx"
                    class="w-8 h-8 rounded-full border-2 border-surface-container"
                    :src="user.avatar"
                    :alt="user.name"
                  />
                  <div
                    v-if="role.users.length > 2"
                    class="w-8 h-8 rounded-full bg-surface-container-high border-2 border-surface-container flex items-center justify-center text-[10px] font-bold text-white"
                  >
                    +{{ role.users.length - 2 }}
                  </div>
                </div>
              </td>
              <td class="px-8 py-5">
                <span class="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase tracking-tighter">
                  {{ role.status }}
                </span>
              </td>
              <td class="px-8 py-5 text-right">
                <div v-if="selectedRoleId === role.id" class="flex justify-end items-center">
                  <span class="text-primary font-bold text-xs uppercase tracking-widest italic">Current View</span>
                </div>
                <div v-else class="flex justify-end gap-2">
                  <button
                    @click.stop="editRole(role.id)"
                    class="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-primary transition-all"
                  >
                    <Pencil class="w-4 h-4" />
                  </button>
                  <button
                    @click.stop="duplicateRole(role.id)"
                    class="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-tertiary transition-all"
                  >
                    <Copy class="w-4 h-4" />
                  </button>
                  <button
                    @click.stop="deleteRole(role.id)"
                    class="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-red-400 transition-all"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Permission Matrix -->
      <section class="lg:col-span-2 space-y-6">
        <div class="bg-surface-container/50 border border-white/5 rounded-3xl p-8 shadow-lg relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent"></div>
          <div class="flex justify-between items-center mb-10">
            <div>
              <h3 class="text-xl font-headline font-semibold text-white">Permission Matrix</h3>
              <p class="text-sm text-slate-400">Configuring: <span class="text-primary font-bold">{{ selectedRoleName }}</span></p>
            </div>
            <button
              @click="selectAllPermissions"
              class="text-xs font-bold text-primary px-4 py-2 bg-primary/5 rounded-lg border border-primary/10 hover:bg-primary/10 transition-colors"
            >
              SELECT ALL
            </button>
          </div>
          <div class="space-y-4">
            <div
              v-for="permission in permissions"
              :key="permission.id"
              class="flex items-center justify-between p-4 bg-surface-container/30 rounded-xl group hover:bg-white/[0.05] transition-colors"
            >
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center" :class="permission.iconColor">
                  <component :is="permission.icon" class="w-5 h-5" />
                </div>
                <div>
                  <p class="font-bold text-sm text-white">{{ permission.module }}</p>
                  <p class="text-xs text-slate-400">{{ permission.description }}</p>
                </div>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="permission.enabled"
                  type="checkbox"
                  class="sr-only peer"
                />
                <div class="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>
      </section>

      <!-- Right Sidebar -->
      <section class="space-y-8">
        <!-- Assign Users -->
        <div class="bg-surface-container/50 border border-white/5 rounded-3xl p-6">
          <h3 class="font-headline font-semibold mb-6 flex items-center gap-2 text-white">
            <UserPlus class="w-5 h-5 text-primary" />
            Assign Users
          </h3>
          <div class="space-y-3 mb-6">
            <div
              v-for="user in assignedUsers"
              :key="user.id"
              class="flex items-center justify-between p-3 bg-surface-container/30 rounded-xl"
            >
              <div class="flex items-center gap-3">
                <img
                  class="w-8 h-8 rounded-full object-cover"
                  :src="user.avatar"
                  :alt="user.name"
                />
                <div>
                  <p class="text-xs font-bold text-white">{{ user.name }}</p>
                  <p class="text-[10px] text-slate-400">{{ user.role }}</p>
                </div>
              </div>
              <button
                @click="removeUser(user.id)"
                class="text-red-400 hover:scale-110 transition-transform"
              >
                <X class="w-4 h-4" />
              </button>
            </div>
          </div>
          <div class="relative">
            <input
              v-model="userSearch"
              class="w-full bg-surface-container/30 border border-white/5 rounded-xl pl-4 pr-10 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-slate-600 transition-all"
              placeholder="Add users..."
              type="text"
            />
            <Search class="w-4 h-4 absolute right-3 top-3 text-slate-500" />
          </div>
        </div>

        <!-- Security Log -->
        <div class="bg-surface-container/50 border border-white/5 rounded-3xl p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="font-headline font-semibold flex items-center gap-2 text-white">
              <History class="w-5 h-5 text-tertiary" />
              Security Log
            </h3>
            <button class="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline transition-colors">
              View All
            </button>
          </div>
          <div class="space-y-4">
            <div
              v-for="(log, idx) in securityLogs"
              :key="idx"
              class="flex gap-3 relative pb-4"
              :class="{ 'after:absolute after:left-[7px] after:top-5 after:bottom-0 after:w-px after:bg-white/10': idx < securityLogs.length - 1 }"
            >
              <div
                class="w-4 h-4 rounded-full mt-1 z-10 shrink-0"
                :class="log.isPrimary ? 'bg-primary shadow-[0_0_8px_rgba(99,102,241,0.4)]' : 'bg-surface-container-high border border-white/10'"
              ></div>
              <div>
                <p class="text-xs font-bold leading-tight text-white">{{ log.message }}</p>
                <p class="text-[10px] text-slate-400 mt-1">{{ log.time }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Plus,
  Pencil,
  Copy,
  Trash2,
  Folder,
  ListTodo,
  FileText,
  MessageSquare,
  CreditCard,
  UserPlus,
  Search,
  X,
  History,
} from 'lucide-vue-next'

const router = useRouter()

interface RoleUser {
  name: string
  avatar: string
}

interface Role {
  id: number
  name: string
  description: string
  status: string
  color: string
  users: RoleUser[]
}

interface Permission {
  id: number
  module: string
  description: string
  icon: any
  iconColor: string
  enabled: boolean
}

interface AssignedUser {
  id: number
  name: string
  role: string
  avatar: string
}

interface SecurityLog {
  message: string
  time: string
  isPrimary: boolean
}

const roles = ref<Role[]>([
  {
    id: 1,
    name: 'Admin',
    description: 'Full system access and administrative privileges',
    status: 'Active',
    color: 'bg-primary',
    users: [
      { name: 'Sarah', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZCvCgMktiOUPLpPR_Pzq1-dcQLJBdF5EgGPauR8b6o_5mkzZql5FW0OTWnRThTyBnz5fpXOFuRnUsIoTsTnYLb3EHcJz8sngOIISlGX4_8FQ30o8JiKmlBumfz049d0CA_SwcJcH9N5B722XqUC9YvwT3shwnz0cliWjIX_yxVkIZ7joIyP1uLYIkyM7Tma8ellouek-izkMyOPMGTzQGoBtV2lUw7FOBVeIH0IMczOZ2PHnekPJkJvYmSsz7w69ZKWI6-81veJA' },
      { name: 'Marcus', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnrLO-UljKamjiUTufN-XF7pc9Z6J9VCEgq9EbZnlhZStefMTk7XrmyOpTD_iDLc_r6-xwpKSI8Nimpc6L3BrCrDzjxEhJSn4sSeevErublU8LzagPsUbuPbS2uoZLilYl8fd2Y1ysdkyEeyX9dVzwdYooK07WXDwuTJ8IEQ8Utbviy4PfoqPLdWM-KbsfgXh4_KECxEDejLSChcWli6UusiuhNg0fJNxTtTns_da47RG6TZiZN0XHx9v4cPOuavIro7Tctcjk5Wo' },
    ],
  },
  {
    id: 2,
    name: 'Client',
    description: 'View projects and communicate with team',
    status: 'Active',
    color: 'bg-secondary',
    users: [
      { name: 'David', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB55OfL1rYPbGOqTVSVlHuyXXRmSmUadTT9-ZfybeOKoxmAnTM2g8nYGtZJktI13NJ1GPhx4cr1-f17CO2Dws1iW3ZQipPJRQdV0QylikMU7Q_5tulpykHJbvSTT_4a9mDkuluXIHoFTrDfahbtRKGs5R7RPuXkdnvnd4I1jYdDS2uFSZgzBl0NGwl2ihNPnA_dmz6wO5LCntZxcOqbEfMwmuWZydV9hFgdhLFewHKeSUL9ClnimJtLMcaLvs06hMDCN9G8Tc9sQxs' },
    ],
  },
  {
    id: 3,
    name: 'Worker',
    description: 'Task execution and project collaboration',
    status: 'Active',
    color: 'bg-tertiary',
    users: [
      { name: 'Chloe', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCIZyqaWXxONfNiGLS-xkOHsOQXdHFcJgIXj89oATEP1Fhxx006EepbeZ9nl4XiQTvxk8Kjsie1HP4PgsFTjFHYR26kZfASUFOQmiNrPsSU_pU7OWBlwoXrGuWZuM_3nlxacgsgwiMxxtd0wpS5cYamWRBSa0yOm4FTiHEjiz5suBK7mXuuPP5Gep6rNERsrD-wMIiJgdU0z6K2oPAhChuVGrWy1s_x3gQkQDu9zjcpboYc0UJXVmtedx-Mx6zj_W_zoBmmJlZ_0s' },
      { name: 'Ryan', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBEm9_mpUKx18Qpym7_8Vqa5qWxxUuZhf34YIYUlTf7uujf6qhdKnkmEDxxRK-hcijBtd_luzQFqH1cBGgd6A6WVRhR0SG5HUxMp8XAlw81_-CcUHcScKk8DJZhXl48U2bkcf1vVU8y5Xb5sXofjSpVNq2FXhTJbCLUlLw2Ovxatn6EdLbrrTZPeBjKZIWZVqFtpi_AbIMpvuuUDTPiHlTRrAH6AgKy72UCAKwTGTJ4mLZoY0peJSfKZLHd7FceRAbrc3aa-BAd7g' },
    ],
  },
])

const selectedRoleId = ref<number>(2)
const userSearch = ref('')

const permissions = ref<Permission[]>([
  { id: 1, module: 'Projects', description: 'Create, edit and archive workspace projects', icon: Folder, iconColor: 'text-primary', enabled: true },
  { id: 2, module: 'Tasks & Workflows', description: 'Assign tickets and update board status', icon: ListTodo, iconColor: 'text-primary', enabled: true },
  { id: 3, module: 'File Management', description: 'Upload assets and manage storage', icon: FileText, iconColor: 'text-tertiary', enabled: false },
  { id: 4, module: 'Chat & Comms', description: 'Access to global channels and DM history', icon: MessageSquare, iconColor: 'text-primary', enabled: true },
  { id: 5, module: 'Billing & Invoices', description: 'View financial statements and subscription', icon: CreditCard, iconColor: 'text-red-400', enabled: false },
])

const assignedUsers = ref<AssignedUser[]>([
  { id: 1, name: 'Chloe Jenkins', role: 'Lead Designer', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCIZyqaWXxONfNiGLS-xkOHsOQXdHFcJgIXj89oATEP1Fhxx006EepbeZ9nl4XiQTvxk8Kjsie1HP4PgsFTjFHYR26kZfASUFOQmiNrPsSU_pU7OWBlwoXrGuWZuM_3nlxacgsgwiMxxtd0wpS5cYamWRBSa0yOm4FTiHEjiz5suBK7mXuuPP5Gep6rNERsrD-wMIiJgdU0z6K2oPAhChuVGrWy1s_x3gQkQDu9zjcpboYc0UJXVmtedx-Mx6zj_W_zoBmmJlZ_0s' },
  { id: 2, name: 'Ryan Thornton', role: 'Motion Artist', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBEm9_mpUKx18Qpym7_8Vqa5qWxxUuZhf34YIYUlTf7uujf6qhdKnkmEDxxRK-hcijBtd_luzQFqH1cBGgd6A6WVRhR0SG5HUxMp8XAlw81_-CcUHcScKk8DJZhXl48U2bkcf1vVU8y5Xb5sXofjSpVNq2FXhTJbCLUlLw2Ovxatn6EdLbrrTZPeBjKZIWZVqFtpi_AbIMpvuuUDTPiHlTRrAH6AgKy72UCAKwTGTJ4mLZoY0peJSfKZLHd7FceRAbrc3aa-BAd7g' },
])

const securityLogs = ref<SecurityLog[]>([
  { message: "Admin granted 'Billing' to 'Project Manager'", time: '2 hours ago', isPrimary: true },
  { message: "Marcus deleted 'Junior Designer' role", time: 'Yesterday, 14:20', isPrimary: false },
  { message: "System audit: 4 users added to 'Team'", time: '3 days ago', isPrimary: false },
])

const selectedRoleName = computed(() => {
  const role = roles.value.find(r => r.id === selectedRoleId.value)
  return role?.name || 'Select a role'
})

function selectRole(id: number) {
  selectedRoleId.value = id
}

function editRole(id: number) {
  console.log('Edit role', id)
}

function duplicateRole(id: number) {
  console.log('Duplicate role', id)
}

function deleteRole(id: number) {
  if (confirm('Are you sure you want to delete this role?')) {
    roles.value = roles.value.filter(r => r.id !== id)
  }
}

function selectAllPermissions() {
  permissions.value.forEach(p => p.enabled = true)
}

function removeUser(id: number) {
  assignedUsers.value = assignedUsers.value.filter(u => u.id !== id)
}
</script>
