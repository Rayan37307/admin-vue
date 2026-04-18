import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  getProfile,
  updateProfile,
  updateAvatar,
  getActivitySummary,
} from '@/services/api'
import type { ProfileData } from '@/services/api'

export interface ProfileState {
  id: number
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

export const useProfileStore = defineStore('profile', () => {
  const profile = ref<ProfileState | null>(null)
  const activitySummary = ref<Record<string, unknown> | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const saving = ref(false)

  const isAuthenticated = computed(() => !!profile.value)

  const profileCompletion = computed(() => {
    if (!profile.value) return 0
    let completed = 0
    const total = 6
    if (profile.value.first_name) completed++
    if (profile.value.last_name) completed++
    if (profile.value.email) completed++
    if (profile.value.phone) completed++
    if (profile.value.avatar_url) completed++
    if (profile.value.company_name) completed++
    return Math.round((completed / total) * 100)
  })

  async function fetchProfile() {
    loading.value = true
    error.value = null
    try {
      const response = await getProfile()
      const user = response.user || response
      const u = user as unknown as ProfileData

      profile.value = {
        id: Number(u.id ?? 0),
        name: (u.name as string) || '',
        first_name: (u.first_name as string) || ((u.name as string)?.split(' ')[0]) || '',
        last_name: (u.last_name as string) || ((u.name as string)?.split(' ').slice(1).join(' ')) || '',
        email: (u.email as string) || '',
        phone: (u.phone_number as string) || (u.phone as string) || '',
        username: (u.username as string) || '',
        avatar_url: (u.avatar as string) || (u.profile_image_link as string) || '',
        role: (u.role as string) || '',
        company_name: ((u.client_profile as Record<string, unknown> | undefined)?.company_name as string) || '',
        bio: (u.bio as string) || (u.profile?.bio as string) || '',
        payment_method: (u.payment_method as string) || '',
        address1: ((u.client_profile as Record<string, unknown> | undefined)?.address1 as string) || '',
        address2: ((u.client_profile as Record<string, unknown> | undefined)?.address2 as string) || '',
        city: ((u.client_profile as Record<string, unknown> | undefined)?.city as string) || '',
        state: ((u.client_profile as Record<string, unknown> | undefined)?.state as string) || '',
        zip_code: ((u.client_profile as Record<string, unknown> | undefined)?.zip_code as string) || '',
        country: ((u.client_profile as Record<string, unknown> | undefined)?.country as string) || '',
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      error.value = e.response?.data?.message || 'Failed to load profile'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function saveProfileData(payload: Record<string, string>) {
    saving.value = true
    error.value = null
    try {
      const response = await updateProfile(payload)
      const user = response.user || response
      const u = user as unknown as ProfileData

      const nameParts = ((u.name as string) || '').split(' ')
      profile.value = {
        id: Number(u.id ?? 0),
        name: (u.name as string) || '',
        first_name: nameParts[0] || '',
        last_name: nameParts.slice(1).join(' ') || '',
        email: (u.email as string) || '',
        phone: (u.phone_number as string) || (u.phone as string) || '',
        username: (u.username as string) || '',
        avatar_url: (u.avatar as string) || (u.profile_image_link as string) || '',
        role: (u.role as string) || '',
        company_name: ((u.client_profile as Record<string, unknown> | undefined)?.company_name as string) || '',
        bio: (u.bio as string) || (u.profile?.bio as string) || '',
        payment_method: (u.payment_method as string) || '',
        address1: ((u.client_profile as Record<string, unknown> | undefined)?.address1 as string) || '',
        address2: ((u.client_profile as Record<string, unknown> | undefined)?.address2 as string) || '',
        city: ((u.client_profile as Record<string, unknown> | undefined)?.city as string) || '',
        state: ((u.client_profile as Record<string, unknown> | undefined)?.state as string) || '',
        zip_code: ((u.client_profile as Record<string, unknown> | undefined)?.zip_code as string) || '',
        country: ((u.client_profile as Record<string, unknown> | undefined)?.country as string) || '',
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      error.value = e.response?.data?.message || 'Failed to save profile'
      throw err
    } finally {
      saving.value = false
    }
  }

  async function uploadAvatar(file: File): Promise<string> {
    error.value = null
    try {
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file')
      }
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image size must be less than 5MB')
      }

      const formData = new FormData()
      formData.append('avatar', file)

      const response = await updateAvatar(formData)
      const user = response.user || response
      const u = user as Record<string, unknown>
      const avatarUrl = (u.avatar as string) || (u.profile_image_link as string) || ''

      if (profile.value) {
        profile.value.avatar_url = avatarUrl
      }
      return avatarUrl
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      error.value = e.response?.data?.message || 'Failed to upload avatar'
      throw err
    }
  }

  async function fetchActivitySummary() {
    try {
      const response = await getActivitySummary()
      activitySummary.value = (response.data || response) as Record<string, unknown>
    } catch {
      activitySummary.value = null
    }
  }

  function clearProfile() {
    profile.value = null
    activitySummary.value = null
    error.value = null
    loading.value = false
    saving.value = false
  }

  return {
    profile,
    activitySummary,
    loading,
    error,
    saving,
    isAuthenticated,
    profileCompletion,
    fetchProfile,
    saveProfileData,
    uploadAvatar,
    fetchActivitySummary,
    clearProfile,
  }
})
