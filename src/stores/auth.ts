import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  login as apiLogin,
  logout as apiLogout,
  getMe,
  setAuthToken,
  type User,
} from '@/services/api'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface StoredUser {
  id: number
  name: string
  email: string
  avatar: string | null
  role: string
}

// ─── Store ───────────────────────────────────────────────────────────────────

export const useAuthStore = defineStore('auth', () => {
  // State
  const isLoggedIn = ref<boolean>(false)
  const userEmail = ref<string | null>(null)
  const userName = ref<string | null>(null)
  const userAvatar = ref<string | null>(null)
  const userRole = ref<string | null>(null)
  const token = ref<string | null>(null)
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed<boolean>(() => isLoggedIn.value)
  const isAdmin = computed<boolean>(() => userRole.value === 'admin')

  // Actions

  /**
   * Initialize auth state from localStorage on app boot.
   */
  function initAuth(): void {
    const storedToken = localStorage.getItem('auth_token')
    const storedUser = localStorage.getItem('auth_user')
    if (storedToken && storedUser) {
      token.value = storedToken
      try {
        const user: StoredUser = JSON.parse(storedUser)
        userEmail.value = user.email
        userName.value = user.name
        userAvatar.value = user.avatar
        userRole.value = user.role
        isLoggedIn.value = true
        setAuthToken(storedToken)
      } catch {
        // Corrupted localStorage – clear and start fresh
        clearStorage()
      }
    }
  }

  /**
   * Authenticate a user with email and password.
   */
  async function login(email: string, password: string): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const response = await apiLogin(email, password)
      token.value = response.token
      userEmail.value = response.user.email
      userName.value = response.user.name
      userAvatar.value = response.user.avatar
      userRole.value = response.user.role
      isLoggedIn.value = true

      localStorage.setItem('auth_token', response.token)
      localStorage.setItem('auth_user', JSON.stringify(response.user))
      setAuthToken(response.token)
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Log out the current user and clear all state.
   */
  async function logout(): Promise<void> {
    try {
      await apiLogout()
    } catch (err) {
      console.error('Logout error:', err)
    }
    token.value = null
    userEmail.value = null
    userName.value = null
    userAvatar.value = null
    userRole.value = null
    isLoggedIn.value = false
    clearStorage()
    setAuthToken(null)
  }

  /**
   * Refresh the current user's profile from the API.
   */
  async function fetchUser(): Promise<void> {
    try {
      const user: User = await getMe()
      userEmail.value = user.email
      userName.value = user.name
      userAvatar.value = user.avatar
      userRole.value = user.role
      localStorage.setItem('auth_user', JSON.stringify(user))
    } catch (err) {
      console.error('Failed to fetch user:', err)
    }
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────

  function clearStorage(): void {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }

  // ─── Public API ──────────────────────────────────────────────────────────

  return {
    isLoggedIn,
    userEmail,
    userName,
    userAvatar,
    userRole,
    token,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    initAuth,
    fetchUser,
  }
})
