import apiClient from './client'

// ============================================================
// Types
// ============================================================

export interface UserSession {
  id: number
  device_name: string
  device_type: string
  ip_address: string
  location: string
  is_current: boolean
  created_at: string
  last_active_at: string
}

export interface SecuritySettings {
  complex_passwords: boolean
  two_fa_enforcement: boolean
  reauth_enabled: boolean
  authenticator_enabled: boolean
}

export interface AccountSettings {
  app_name: string
  timezone: string
  date_format: string
  time_format: string
  currency: string
  default_language: string
}

export interface NotificationSettings {
  project_updates: boolean
  file_uploads: boolean
  billing_alerts: boolean
  email_marketing: boolean
  product_surveys: boolean
}

export interface QuietHours {
  enabled: boolean
  start_time: string
  end_time: string
  timezone: string
}

export interface SystemInfo {
  app_version: string
  build_id: string
  php_version: string
  laravel_version: string
}

export interface ApiKey {
  id: number
  name: string
  key_prefix: string
  created_at: string
  expires_at: string | null
  last_used_at: string | null
}

// ============================================================
// Session API Functions
// ============================================================

export async function getSessions(): Promise<{ sessions: UserSession[] }> {
  const response = await apiClient.get<{ sessions: UserSession[] }>('/sessions')
  return response.data
}

export async function getCurrentSession(): Promise<{ session: UserSession }> {
  const response = await apiClient.get<{ session: UserSession }>('/sessions/current')
  return response.data
}

export async function revokeSession(id: number): Promise<{ message: string }> {
  const response = await apiClient.delete<{ message: string }>(`/sessions/${id}`)
  return response.data
}

export async function revokeOtherSessions(): Promise<{ message: string; revoked_count: number }> {
  const response = await apiClient.post<{ message: string; revoked_count: number }>('/sessions/revoke-others')
  return response.data
}

export async function revokeAllSessions(): Promise<{ message: string; revoked_count: number }> {
  const response = await apiClient.post<{ message: string; revoked_count: number }>('/sessions/revoke-all')
  return response.data
}

// ============================================================
// Security Settings API Functions
// ============================================================

export async function getSecuritySettings(): Promise<{ settings: SecuritySettings }> {
  const response = await apiClient.get<{ settings: SecuritySettings }>('/settings/security')
  return response.data
}

export async function updateSecuritySettings(
  data: Partial<SecuritySettings>
): Promise<{ message: string }> {
  const response = await apiClient.put<{ message: string }>('/settings/security', data)
  return response.data
}

export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<{ message: string }> {
  const response = await apiClient.post<{ message: string }>('/auth/change-password', {
    current_password: currentPassword,
    password: newPassword,
    password_confirmation: newPassword,
  })
  return response.data
}

// ============================================================
// Account Settings API Functions
// ============================================================

export async function getAccountSettings(): Promise<{ settings: AccountSettings }> {
  const response = await apiClient.get<{ settings: AccountSettings }>('/settings/account')
  return response.data
}

export async function updateAccountSettings(
  data: Partial<AccountSettings>
): Promise<{ message: string }> {
  const response = await apiClient.put<{ message: string }>('/settings/account', data)
  return response.data
}

// ============================================================
// Notification Settings API Functions
// ============================================================

export async function getNotificationSettings(): Promise<{
  notifications: NotificationSettings
  quiet_hours: QuietHours
}> {
  const response = await apiClient.get<{
    notifications: NotificationSettings
    quiet_hours: QuietHours
  }>('/settings/notifications')
  return response.data
}

export async function updateNotificationSettings(
  data: Partial<NotificationSettings>
): Promise<{ message: string }> {
  const response = await apiClient.put<{ message: string }>('/settings/notifications', data)
  return response.data
}

export async function updateQuietHours(
  data: Partial<QuietHours>
): Promise<{ message: string }> {
  const response = await apiClient.put<{ message: string }>('/settings/quiet-hours', data)
  return response.data
}

// ============================================================
// System Settings API Functions
// ============================================================

export async function getSystemInfo(): Promise<{ info: SystemInfo }> {
  const response = await apiClient.get<{ info: SystemInfo }>('/settings/system-info')
  return response.data
}

// Data Export
export async function exportDataAsPdf(): Promise<Blob> {
  const response = await apiClient.get('/settings/export-pdf', {
    responseType: 'blob',
  })
  return response.data
}

export async function exportDataAsJson(): Promise<{ data: string }> {
  const response = await apiClient.get<{ data: string }>('/settings/export-json')
  return response.data
}

// ============================================================
// API Keys
// ============================================================

export async function getApiKeys(): Promise<{ api_keys: ApiKey[] }> {
  const response = await apiClient.get<{ api_keys: ApiKey[] }>('/settings/api-keys')
  return response.data
}

export async function createApiKey(
  name: string,
  permissions?: string[],
  expiresAt?: string
): Promise<{ api_key: ApiKey; plain_key: string }> {
  const response = await apiClient.post<{ api_key: ApiKey; plain_key: string }>(
    '/settings/api-keys',
    {
      name,
      permissions,
      expires_at: expiresAt,
    }
  )
  return response.data
}

export async function revokeApiKey(id: number): Promise<{ message: string }> {
  const response = await apiClient.delete<{ message: string }>(`/settings/api-keys/${id}`)
  return response.data
}

// ============================================================
// Danger Zone Actions
// ============================================================

export async function purgeCache(): Promise<{ message: string }> {
  const response = await apiClient.post<{ message: string }>('/settings/purge-cache')
  return response.data
}

export async function deleteWorkspace(): Promise<{ message: string }> {
  const response = await apiClient.delete<{ message: string }>('/settings/workspace')
  return response.data
}

export async function deleteAccount(): Promise<{ message: string }> {
  const response = await apiClient.delete<{ message: string }>('/settings/account-delete')
  return response.data
}