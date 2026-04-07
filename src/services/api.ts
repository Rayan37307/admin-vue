import apiClient from '@/api/client'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface User {
  id: number
  name: string
  email: string
  avatar: string | null
  role: string
}

export interface LoginResponse {
  token: string
  user: User
}

export interface Session {
  id: number
  ip_address: string | null
  user_agent: string | null
  last_active: string
  created_at: string
  is_current: boolean
}

export interface SessionsResponse {
  sessions: Session[]
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  newPasswordConfirmation: string
}

// ─── Auth Token Management ───────────────────────────────────────────────────

/**
 * Set or remove the Authorization header on the API client.
 */
export function setAuthToken(token: string | null): void {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete apiClient.defaults.headers.common['Authorization']
  }
}

// ─── Authentication ──────────────────────────────────────────────────────────

/**
 * Authenticate a user with email and password.
 */
export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/auth/login', { email, password })
  return response.data
}

/**
 * Log out the current user (server-side session invalidation).
 */
export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout')
}

/**
 * Fetch the currently authenticated user's profile.
 */
export async function getMe(): Promise<User> {
  const response = await apiClient.get<User | { user: User }>('/auth/me')
  // Handle both response shapes: { user: {...} } or direct user object
  const data = response.data
  return 'user' in data ? data.user : data
}

/**
 * Change the authenticated user's password.
 */
export async function changePassword(
  currentPassword: string,
  newPassword: string,
  newPasswordConfirmation: string
): Promise<void> {
  await apiClient.post('/auth/change-password', {
    current_password: currentPassword,
    password: newPassword,
    password_confirmation: newPasswordConfirmation,
  })
}

// ─── Session Management ──────────────────────────────────────────────────────

/**
 * Fetch all active sessions for the authenticated user.
 */
export async function getSessions(): Promise<SessionsResponse> {
  const response = await apiClient.get<SessionsResponse>('/sessions')
  return response.data
}

/**
 * Fetch the current session details.
 */
export async function getCurrentSession(): Promise<Session> {
  const response = await apiClient.get<Session>('/sessions/current')
  return response.data
}

/**
 * Revoke a specific session by ID.
 */
export async function revokeSession(sessionId: number): Promise<void> {
  await apiClient.delete(`/sessions/${sessionId}`)
}

/**
 * Revoke all sessions for the authenticated user.
 */
export async function revokeAllSessions(): Promise<void> {
  await apiClient.post('/sessions/revoke-all')
}

/**
 * Revoke all sessions except the current one.
 */
export async function revokeOtherSessions(): Promise<void> {
  await apiClient.post('/sessions/revoke-others')
}
