<template>
  <div class="space-y-12 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
    <!-- Header Area -->
    <section class="relative rounded-[2rem] overflow-hidden mb-8 bg-surface-container-low p-8 flex flex-col md:flex-row items-end gap-8">
      <div class="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary/10 to-transparent"></div>
      <div class="relative group">
        <img
          :src="avatarUrl"
          alt="Profile"
          class="w-32 h-32 rounded-3xl object-cover border-4 border-surface shadow-2xl relative z-10"
        />
        <button
          @click="triggerAvatarUpload"
          :disabled="profileStore.loading"
          aria-label="Edit profile picture"
          class="absolute -bottom-2 -right-2 z-20 w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center text-on-primary shadow-lg border-2 border-surface"
        >
          <Camera class="w-5 h-5" />
        </button>
        <input
          ref="avatarInput"
          type="file"
          accept="image/*"
          class="hidden"
          @change="handleAvatarUpload"
        />
      </div>
      <div class="flex-1 pb-2">
        <div class="flex items-center gap-3 mb-1">
          <h1 class="syne text-4xl font-extrabold tracking-tighter text-white">{{ localProfile.name || 'Your Profile' }}</h1>
          <span class="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full border border-primary/20 flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
            Active
          </span>
        </div>
        <p class="outfit text-on-surface-variant text-lg">{{ localProfile.role || 'Team Member' }}</p>
      </div>
      <div class="flex gap-3 pb-2">
        <button class="px-6 py-2.5 rounded-xl bg-surface-container-highest border border-outline-variant/10 font-bold outfit text-sm hover:bg-surface-variant transition-all">
          View Public Profile
        </button>
        <button
          @click="saveProfile"
          :disabled="profileStore.saving"
          class="px-6 py-2.5 rounded-xl bg-primary text-white font-bold outfit text-sm shadow-[0_0_20px_rgba(99,102,241,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="profileStore.saving">Saving...</span>
          <span v-else>Save Changes</span>
        </button>
      </div>
    </section>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Personal Information -->
      <div class="lg:col-span-7 bg-surface-container/50 border border-white/5 rounded-3xl p-8 md:p-10 space-y-8 shadow-xl">
        <div class="flex items-center gap-3 text-primary mb-2">
          <div class="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <User class="w-6 h-6" />
          </div>
          <h3 class="text-2xl font-bold text-white tracking-tight font-headline">Personal Info</h3>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1 ubuntu">First Name</label>
            <input
              type="text"
              v-model="localProfile.first_name"
              class="w-full bg-surface-container-high border border-white/5 rounded-xl px-5 py-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-600 outfit font-medium"
            />
          </div>
          <div class="space-y-2">
            <label class="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1 ubuntu">Last Name</label>
            <input
              type="text"
              v-model="localProfile.last_name"
              class="w-full bg-surface-container-high border border-white/5 rounded-xl px-5 py-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-600 outfit font-medium"
            />
          </div>
        </div>
        <div class="space-y-2">
          <label class="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1 ubuntu">Email Address</label>
          <input
            type="email"
            v-model="localProfile.email"
            class="w-full bg-surface-container-high border border-white/5 rounded-xl px-5 py-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-600 outfit font-medium"
          />
        </div>
        <div class="space-y-2">
          <label class="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1 ubuntu">Phone Number</label>
          <input
            type="tel"
            v-model="localProfile.phone"
            class="w-full bg-surface-container-high border border-white/5 rounded-xl px-5 py-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-600 outfit font-medium space-font tracking-widest"
          />
        </div>
        <div class="flex justify-end pt-4">
          <button
            @click="saveProfile"
            :disabled="profileStore.saving"
            class="relative group overflow-hidden bg-primary text-white px-8 py-3.5 rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ubuntu"
          >
            <span v-if="profileStore.saving" class="relative z-10">Saving...</span>
            <span v-else class="relative z-10">Save Changes</span>
          </button>
        </div>
      </div>

      <!-- Account Details -->
      <div class="lg:col-span-5 bg-surface-container/50 border border-white/5 rounded-3xl p-8 md:p-10 space-y-8 shadow-xl flex flex-col">
        <div class="flex items-center gap-3 text-primary mb-2">
          <div class="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <Info class="w-6 h-6" />
          </div>
          <h3 class="text-2xl font-bold text-white tracking-tight font-headline">Account Details</h3>
        </div>
        <div class="space-y-8 flex-grow">
          <div class="space-y-2">
            <label class="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1 ubuntu">Username</label>
            <div class="bg-surface border border-white/5 rounded-xl px-5 py-4 text-white text-sm font-medium outfit shadow-inner">
              {{ localProfile.username || '-' }}
            </div>
          </div>
          <div class="space-y-2">
            <label class="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1 ubuntu">User ID</label>
            <div class="flex items-center justify-between bg-surface border border-white/5 rounded-xl px-5 py-4 text-white text-sm font-bold space-font tracking-wide shadow-inner">
              <span class="text-primary">{{ userId }}</span>
              <button
                @click="copyUserId"
                class="text-slate-500 hover:text-white transition-colors p-1"
              >
                <Copy class="w-4 h-4" />
              </button>
            </div>
          </div>
          <div class="space-y-4 pt-4 mt-auto">
            <div class="flex justify-between items-end">
              <p class="text-[10px] uppercase tracking-widest text-slate-500 font-bold ubuntu">Profile Completion</p>
              <p class="text-xs font-bold text-primary space-font">{{ profileStore.profileCompletion }}%</p>
            </div>
            <div class="h-2.5 w-full bg-surface rounded-full overflow-hidden p-[1px] border border-white/5 shadow-inner">
              <div
                class="h-full bg-gradient-to-r from-primary to-[#818cf8] rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-500"
                :style="{ width: `${profileStore.profileCompletion}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Professional Summary -->
    <div class="bg-surface-container rounded-[1.5rem] p-8">
      <h3 class="syne text-xl font-bold mb-6 flex items-center gap-2">
        <span class="material-symbols-outlined text-primary">description</span>
        Professional Summary
      </h3>
      <textarea 
        v-model="localProfile.bio"
        class="w-full bg-surface-container-high border-none rounded-xl p-4 text-on-surface-variant outfit leading-relaxed focus:ring-1 focus:ring-primary/40 h-32 resize-none" 
        placeholder="Write a short bio..."></textarea>
    </div>

    <!-- Billing Address -->
    <div class="bg-surface-container/50 border border-white/5 rounded-3xl p-8 md:p-10 space-y-10 shadow-xl">
      <div class="flex items-center gap-3 text-primary mb-2">
        <div class="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
          <CreditCard class="w-6 h-6" />
        </div>
        <h3 class="text-2xl font-bold text-white tracking-tight font-headline">Billing Address</h3>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="space-y-2">
          <label class="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1 ubuntu">Company Name</label>
          <input
            type="text"
            v-model="localProfile.company_name"
            placeholder="Optional"
            class="w-full bg-surface-container-high border border-white/5 rounded-xl px-5 py-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-600 outfit font-medium"
          />
        </div>
        <div class="space-y-2">
          <label class="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1 ubuntu">Payment Method</label>
          <div class="relative group">
            <select
              v-model="localProfile.payment_method"
              class="w-full bg-surface-container-high border border-white/5 rounded-xl px-5 py-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer outfit font-medium"
            >
              <option value="visa">Visa ending in 4242</option>
              <option value="mastercard">Mastercard ending in 8891</option>
              <option value="paypal">PayPal</option>
            </select>
            <ChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-white transition-colors pointer-events-none w-5 h-5" />
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="space-y-2">
          <label class="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1 ubuntu">Address 1</label>
          <input
            type="text"
            v-model="localProfile.address1"
            class="w-full bg-surface-container-high border border-white/5 rounded-xl px-5 py-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-600 outfit font-medium"
          />
        </div>
        <div class="space-y-2">
          <label class="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1 ubuntu">Address 2</label>
          <input
            type="text"
            v-model="localProfile.address2"
            placeholder="Apt, Suite..."
            class="w-full bg-surface-container-high border border-white/5 rounded-xl px-5 py-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-600 outfit font-medium"
          />
        </div>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="space-y-2">
          <label class="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1 ubuntu">City</label>
          <input
            type="text"
            v-model="localProfile.city"
            class="w-full bg-surface-container-high border border-white/5 rounded-xl px-5 py-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-600 outfit font-medium"
          />
        </div>
        <div class="space-y-2">
          <label class="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1 ubuntu">State/Region</label>
          <input
            type="text"
            v-model="localProfile.state"
            class="w-full bg-surface-container-high border border-white/5 rounded-xl px-5 py-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-600 outfit font-medium"
          />
        </div>
        <div class="space-y-2">
          <label class="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1 ubuntu">Zip Code</label>
          <input
            type="text"
            v-model="localProfile.zip_code"
            class="w-full bg-surface-container-high border border-white/5 rounded-xl px-5 py-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-600 space-font tracking-widest font-medium"
          />
        </div>
        <div class="space-y-2">
          <label class="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1 ubuntu">Country</label>
          <input
            type="text"
            v-model="localProfile.country"
            class="w-full bg-surface-container-high border border-white/5 rounded-xl px-5 py-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-600 outfit font-medium"
          />
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="flex gap-6">
      <div class="GRID-card bg-surface-container rounded-[1.5rem] p-6 w-full">
        <div class="flex justify-between items-start mb-4">
          <div class="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <span class="material-symbols-outlined">folder</span>
          </div>
          <span class="text-[10px] font-bold text-primary px-2 py-1 bg-primary/10 rounded-md">MONTHLY</span>
        </div>
        <p class="text-on-surface-variant text-sm outfit font-medium">Projects Assigned</p>
        <h4 class="syne text-5xl font-extrabold tracking-tighter mt-1">{{ stats.projects || 0 }}</h4>
        <div class="mt-4 flex items-center gap-2">
          <span class="text-xs text-primary font-bold outfit">↑ 14%</span>
          <span class="text-[10px] text-on-surface-variant uppercase tracking-widest">since last month</span>
        </div>
      </div>

      <div class="GRID-card bg-surface-container rounded-[1.5rem] p-6 w-full">
        <div class="flex justify-between items-start mb-4">
          <div class="w-12 h-12 bg-tertiary/10 rounded-2xl flex items-center justify-center text-tertiary">
            <span class="material-symbols-outlined">task_alt</span>
          </div>
          <span class="text-[10px] font-bold text-tertiary px-2 py-1 bg-tertiary/10 rounded-md">LIFETIME</span>
        </div>
        <p class="text-on-surface-variant text-sm outfit font-medium">Tasks Completed</p>
        <h4 class="syne text-5xl font-extrabold tracking-tighter mt-1">{{ stats.tasks || 0 }}</h4>
        <div class="mt-4 w-full h-1 bg-surface-container-lowest rounded-full overflow-hidden">
          <div class="h-full bg-tertiary" :style="{ width: `${stats.efficiency || 0}%` }"></div>
        </div>
        <p class="mt-2 text-[10px] text-on-surface-variant uppercase tracking-widest">{{ stats.efficiency || 0 }}% Efficiency Rating</p>
      </div>

      <div class="GRID-card bg-surface-container rounded-[1.5rem] p-6 w-full">
        <div class="flex justify-between items-start mb-4">
          <div class="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary">
            <span class="material-symbols-outlined">account_balance_wallet</span>
          </div>
          <span class="text-[10px] font-bold text-secondary px-2 py-1 bg-secondary/10 rounded-md">CURRENT</span>
        </div>
        <p class="text-on-surface-variant text-sm outfit font-medium">Total Balance</p>
        <h4 class="syne text-5xl font-extrabold tracking-tighter mt-1">${{ stats.balance || '0' }}</h4>
        <div class="mt-4 flex items-center gap-2">
          <span class="text-xs text-secondary font-bold outfit">↑ 8.4%</span>
          <span class="text-[10px] text-on-surface-variant uppercase tracking-widest">Growth this month</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Camera, User, Info, Copy, CreditCard, ChevronDown } from 'lucide-vue-next'
import { useProfileStore } from '@/stores/profile'
import { useAuthStore } from '@/stores/auth'

const profileStore = useProfileStore()
const authStore = useAuthStore()

interface LocalProfile {
  id: number | null
  name: string
  first_name: string
  last_name: string
  email: string
  phone: string
  username: string
  avatar_url: string
  role: string
  company_name: string
  bio: string
  payment_method: string
  address1: string
  address2: string
  city: string
  state: string
  zip_code: string
  country: string
}

const localProfile = ref<LocalProfile>({
  id: null,
  name: '',
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  username: '',
  avatar_url: '',
  role: '',
  company_name: '',
  bio: '',
  payment_method: 'visa',
  address1: '',
  address2: '',
  city: '',
  state: '',
  zip_code: '',
  country: '',
})

const avatarInput = ref<HTMLInputElement | null>(null)

const avatarUrl = computed(() => {
  if (localProfile.value.avatar_url) {
    return localProfile.value.avatar_url
  }
  const name = localProfile.value.name || 'User'
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&size=200`
})

const userId = computed(() => {
  if (localProfile.value.id) {
    return `#USR-${localProfile.value.id}-${localProfile.value.id.toString(16).toUpperCase()}`
  }
  return '-'
})

const stats = computed(() => {
  const summary = profileStore.activitySummary
  if (!summary) return { projects: 0, tasks: 0, efficiency: 0, balance: '0' }
  return {
    projects: (summary as any).projects_count || 0,
    tasks: (summary as any).tasks_completed || 0,
    efficiency: (summary as any).efficiency_rating || 0,
    balance: (summary as any).total_balance || '0',
  }
})

async function loadProfile() {
  await profileStore.fetchProfile()
  const p = profileStore.profile
  if (p) {
    localProfile.value = {
      ...p,
      payment_method: p.payment_method || 'visa',
      address1: p.address1 || '',
      address2: p.address2 || '',
      city: p.city || '',
      state: p.state || '',
      zip_code: p.zip_code || '',
      country: p.country || '',
    }
  }
}

async function saveProfile() {
  const payload: Record<string, string> = {
    first_name: localProfile.value.first_name,
    last_name: localProfile.value.last_name,
    email: localProfile.value.email,
    phone: localProfile.value.phone,
    company_name: localProfile.value.company_name,
    bio: localProfile.value.bio,
    payment_method: localProfile.value.payment_method,
    address1: localProfile.value.address1,
    address2: localProfile.value.address2,
    city: localProfile.value.city,
    state: localProfile.value.state,
    zip_code: localProfile.value.zip_code,
    country: localProfile.value.country,
  }

  await profileStore.saveProfileData(payload)
  const p = profileStore.profile
  if (p) {
    localProfile.value = { ...p }
  }

  authStore.userName = profileStore.profile?.name || null
  authStore.userEmail = profileStore.profile?.email || null
  if (profileStore.profile?.avatar_url) {
    authStore.userAvatar = profileStore.profile.avatar_url
  }

  alert('Profile updated successfully!')
}

function triggerAvatarUpload() {
  avatarInput.value?.click()
}

async function handleAvatarUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const avatarUrl = await profileStore.uploadAvatar(file)
  authStore.userAvatar = avatarUrl
  alert('Avatar updated successfully!')
}

function copyUserId() {
  if (userId.value !== '-') {
    navigator.clipboard.writeText(userId.value)
    alert('User ID copied to clipboard!')
  }
}

async function loadActivitySummary() {
  await profileStore.fetchActivitySummary()
}

onMounted(() => {
  loadProfile()
  loadActivitySummary()
})
</script>
