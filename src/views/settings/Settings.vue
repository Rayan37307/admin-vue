<template>
  <div class="p-4 sm:p-6 md:p-8 lg:p-10">
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
    </div>
    <div v-else class="max-w-7xl mx-auto space-y-8 md:space-y-10 lg:space-y-12">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
        <div>
          <p class="text-primary font-bold tracking-[0.2em] text-[11px] uppercase mb-2">System Configuration</p>
          <h1 class="font-headline text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-on-surface">Settings</h1>
        </div>
        <p class="text-on-surface-variant text-xs sm:text-sm max-w-xs text-right md:text-left italic font-light opacity-60">Manage your account, security, and system preferences.</p>
      </div>

      <!-- Tabs -->
      <nav class="flex flex-wrap gap-2 sm:gap-3 border-b border-white/5 pb-1" role="tablist" aria-label="Settings navigation">
        <button @click="activeTab = 'security'" :class="['settings-tab-btn', activeTab === 'security' ? 'active' : '', 'px-4 sm:px-5 py-2.5 text-xs sm:text-[10px] font-bold uppercase tracking-[0.2em] rounded-t-xl transition-all text-on-surface-variant hover:text-on-surface']" role="tab" :aria-selected="activeTab === 'security'" aria-controls="panel-security">Security</button>
        <button @click="activeTab = 'notifications'" :class="['settings-tab-btn', activeTab === 'notifications' ? 'active' : '', 'px-4 sm:px-5 py-2.5 text-xs sm:text-[10px] font-bold uppercase tracking-[0.2em] rounded-t-xl transition-all text-on-surface-variant hover:text-on-surface']" role="tab" :aria-selected="activeTab === 'notifications'" aria-controls="panel-notifications">Notifications</button>
        <button @click="activeTab = 'preferences'" :class="['settings-tab-btn', activeTab === 'preferences' ? 'active' : '', 'px-4 sm:px-5 py-2.5 text-xs sm:text-[10px] font-bold uppercase tracking-[0.2em] rounded-t-xl transition-all text-on-surface-variant hover:text-on-surface']" role="tab" :aria-selected="activeTab === 'preferences'" aria-controls="panel-preferences">Preferences</button>
        <button @click="activeTab = 'privacy'" :class="['settings-tab-btn', activeTab === 'privacy' ? 'active' : '', 'px-4 sm:px-5 py-2.5 text-xs sm:text-[10px] font-bold uppercase tracking-[0.2em] rounded-t-xl transition-all text-on-surface-variant hover:text-on-surface']" role="tab" :aria-selected="activeTab === 'privacy'" aria-controls="panel-privacy">Privacy & Data</button>
        <button @click="activeTab = 'advanced'" :class="['settings-tab-btn', activeTab === 'advanced' ? 'active' : '', 'px-4 sm:px-5 py-2.5 text-xs sm:text-[10px] font-bold uppercase tracking-[0.2em] rounded-t-xl transition-all text-on-surface-variant hover:text-on-surface']" role="tab" :aria-selected="activeTab === 'advanced'" aria-controls="panel-advanced">Advanced</button>
      </nav>

      <!-- SECURITY TAB -->
      <div v-show="activeTab === 'security'" class="settings-content space-y-6 sm:space-y-8">
        <!-- Stats Dashboard -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div class="bg-surface-container/50 border border-white/5 rounded-2xl p-5 sm:p-6 flex items-center gap-4 sm:gap-5 shadow-inner">
            <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-surface-container-high text-on-surface flex items-center justify-center shadow-xl border border-white/5">
              <span class="material-symbols-outlined">devices</span>
            </div>
            <div>
              <p class="text-lg sm:text-xl font-bold text-on-surface font-headline">2 Devices</p>
              <p class="text-[9px] text-on-surface-variant uppercase tracking-widest font-bold mt-0.5">Active sessions</p>
            </div>
          </div>
          <div class="bg-surface-container/50 border border-white/5 rounded-2xl p-5 sm:p-6 flex items-center gap-4 sm:gap-5 shadow-inner">
            <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-surface-container-high text-success flex items-center justify-center shadow-xl border border-white/5">
              <span class="material-symbols-outlined">shield</span>
            </div>
            <div>
              <p class="text-lg sm:text-xl font-bold text-on-surface font-headline">2FA Enabled</p>
              <p class="text-[9px] text-on-surface-variant uppercase tracking-widest font-bold mt-0.5">Authenticator app</p>
            </div>
          </div>
          <div class="bg-surface-container/50 border border-white/5 rounded-2xl p-5 sm:p-6 flex items-center gap-4 sm:gap-5 shadow-inner relative overflow-hidden group">
            <div class="absolute inset-0 bg-gradient-to-r from-success/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-surface-container-high text-success flex items-center justify-center shadow-xl border border-success/20 shadow-[0_0_15px_rgba(16,185,129,0.15)] z-10">
              <span class="material-symbols-outlined">lock</span>
            </div>
            <div class="z-10">
              <p class="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-success to-teal-400 font-headline">Score: 98%</p>
              <p class="text-[9px] text-on-surface-variant uppercase tracking-widest font-bold mt-0.5">Top protection</p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          <!-- Change Password -->
          <section class="col-span-1 lg:col-span-5 bg-surface-container rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 glass-card border-l-2 border-primary/20">
            <div class="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
              <span class="material-symbols-outlined text-primary">key</span>
              <h2 class="font-headline text-lg sm:text-xl font-semibold">Change Password</h2>
            </div>
            <form id="password-form" class="space-y-4 sm:space-y-6" novalidate>
              <div class="space-y-2">
                <label for="current_password" class="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest pl-1 block">Current Password</label>
                <input id="current_password" v-model="securityForm.current_password" class="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary/40 transition-all min-h-[44px]" placeholder="••••••••" type="password" name="current_password" required minlength="8" autocomplete="current-password" aria-required="true" />
              </div>
              <div class="space-y-2">
                <label for="new_password" class="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest pl-1 block">New Password</label>
                <input id="new_password" v-model="securityForm.new_password" class="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary/40 transition-all min-h-[44px]" placeholder="••••••••" type="password" name="new_password" required minlength="8" autocomplete="new-password" aria-required="true" />
                <div class="pt-2">
                  <div class="h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-primary to-primary-container w-2/3 shadow-[0_0_8px_rgba(192,193,255,0.4)]"></div>
                  </div>
                  <p class="text-[11px] text-primary mt-1.5 flex justify-between"><span>Strong Password</span><span>68%</span></p>
                </div>
              </div>
              <div class="space-y-2">
                <label for="confirm_password" class="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest pl-1 block">Confirm New Password</label>
                <input id="confirm_password" v-model="securityForm.confirm_password" class="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary/40 transition-all min-h-[44px]" placeholder="••••••••" type="password" name="confirm_password" required minlength="8" autocomplete="new-password" aria-required="true" />
              </div>
              <button class="w-full p-3 bg-primary text-on-primary rounded-xl font-bold text-sm tracking-wide hover:opacity-90 transition-opacity active:scale-[0.98] mt-4 min-h-[44px]" type="submit">Update Password</button>
            </form>
          </section>

          <!-- 2FA & Authentication -->
          <div class="col-span-1 lg:col-span-7 space-y-4 sm:space-y-6">
            <section class="bg-surface-container rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8">
              <div class="flex items-center gap-2 sm:gap-3 mb-6">
                <span class="material-symbols-outlined text-primary">verified_user</span>
                <h2 class="font-headline text-lg sm:text-xl font-semibold">Two-Factor Authentication</h2>
              </div>
              <div class="space-y-4">
                <div class="p-4 sm:p-5 bg-surface-container-low rounded-xl sm:rounded-2xl flex items-center justify-between gap-3">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-primary">
                      <span class="material-symbols-outlined">smartphone</span>
                    </div>
                    <div>
                      <p class="font-semibold text-sm">Authenticator App</p>
                      <p class="text-[9px] text-primary font-bold uppercase tracking-widest mt-0.5">Recommended</p>
                    </div>
                  </div>
                  <div @click="securityForm.authenticatorEnabled = !securityForm.authenticatorEnabled" role="switch" :aria-checked="securityForm.authenticatorEnabled" tabindex="0" :class="['toggle-switch', securityForm.authenticatorEnabled ? 'active' : 'inactive']" aria-label="Enable Authenticator App"></div>
                </div>
                <div class="p-4 sm:p-5 bg-surface-container-low rounded-xl sm:rounded-2xl flex items-center justify-between gap-3 opacity-70">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                      <span class="material-symbols-outlined">sms</span>
                    </div>
                    <div>
                      <p class="font-semibold text-sm">SMS Authentication</p>
                      <p class="text-[9px] text-on-surface-variant font-bold uppercase tracking-widest mt-0.5">+1 (555) ••• 42</p>
                    </div>
                  </div>
                  <div @click="securityForm.smsEnabled = !securityForm.smsEnabled" role="switch" :aria-checked="securityForm.smsEnabled" tabindex="0" :class="['toggle-switch', securityForm.smsEnabled ? 'active' : 'inactive']" aria-label="Enable SMS Authentication"></div>
                </div>
              </div>
            </section>

            <!-- Authentication Rules -->
            <section class="bg-surface-container-low rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8">
              <div class="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <span class="material-symbols-outlined text-tertiary">policy</span>
                <h2 class="font-headline text-lg sm:text-xl font-semibold">Authentication Rules</h2>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div class="p-4 sm:p-5 bg-surface-container rounded-xl sm:rounded-2xl flex items-start justify-between gap-3">
                  <div>
                    <p class="font-semibold text-sm mb-1">Complex Passwords</p>
                    <p class="text-xs text-on-surface-variant leading-relaxed">Require symbols and numbers.</p>
                  </div>
                  <div @click="securityForm.complexPasswords = !securityForm.complexPasswords" role="switch" :aria-checked="securityForm.complexPasswords" tabindex="0" :class="['toggle-switch', securityForm.complexPasswords ? 'active' : 'inactive']" aria-label="Enable complex password requirement"></div>
                </div>
                <div class="p-4 sm:p-5 bg-surface-container rounded-xl sm:rounded-2xl flex items-start justify-between gap-3">
                  <div>
                    <p class="font-semibold text-sm mb-1">2FA Enforcement</p>
                    <p class="text-xs text-on-surface-variant leading-relaxed">Required for all team members.</p>
                  </div>
                  <div @click="securityForm.twoFaEnforcement = !securityForm.twoFaEnforcement" role="switch" :aria-checked="securityForm.twoFaEnforcement" tabindex="0" :class="['toggle-switch', securityForm.twoFaEnforcement ? 'active' : 'inactive']" aria-label="Enable 2FA enforcement"></div>
                </div>
                <div class="p-4 sm:p-5 bg-surface-container rounded-xl sm:rounded-2xl flex items-start justify-between gap-3 md:col-span-2">
                  <div>
                    <p class="font-semibold text-sm mb-1">Sensitive Action Re-Auth</p>
                    <p class="text-xs text-on-surface-variant leading-relaxed">Request password before critical actions.</p>
                  </div>
                  <div @click="securityForm.reauthEnabled = !securityForm.reauthEnabled" role="switch" :aria-checked="securityForm.reauthEnabled" tabindex="0" :class="['toggle-switch', securityForm.reauthEnabled ? 'active' : 'inactive']" aria-label="Enable sensitive action re-authentication"></div>
                </div>
              </div>
            </section>
          </div>
        </div>

        <!-- Active Sessions -->
        <section class="bg-surface-container rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-4 sm:mb-6">
            <div class="flex items-center gap-2 sm:gap-3">
              <span class="material-symbols-outlined text-primary">devices</span>
              <h2 class="font-headline text-lg sm:text-xl font-semibold">Active Sessions</h2>
            </div>
            <span class="px-2 sm:px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase tracking-tighter whitespace-nowrap text-center">2 Active Now</span>
          </div>
          <div class="space-y-2 sm:space-y-3">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 hover:bg-surface-bright/30 rounded-xl sm:rounded-2xl transition-all group">
              <div class="flex items-center gap-3 sm:gap-4">
                <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary group-hover:scale-110 transition-transform shrink-0">
                  <span class="material-symbols-outlined">laptop_mac</span>
                </div>
                <div>
                  <p class="text-sm font-semibold">MacBook Pro 16"</p>
                  <p class="text-[11px] text-on-surface-variant">San Francisco, USA • Active now</p>
                </div>
              </div>
              <button class="text-[11px] font-bold text-error uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity min-h-[44px] min-w-[44px] flex items-center justify-center">Force Logout</button>
            </div>
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 hover:bg-surface-bright/30 rounded-xl sm:rounded-2xl transition-all group">
              <div class="flex items-center gap-3 sm:gap-4">
                <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant group-hover:scale-110 transition-transform shrink-0">
                  <span class="material-symbols-outlined">phone_iphone</span>
                </div>
                <div>
                  <p class="text-sm font-semibold">iPhone 15 Pro</p>
                  <p class="text-[11px] text-on-surface-variant">London, UK • 2 hours ago</p>
                </div>
              </div>
              <button class="text-[11px] font-bold text-error uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity min-h-[44px] min-w-[44px] flex items-center justify-center">Force Logout</button>
            </div>
          </div>
        </section>

        <!-- Audit Logs -->
        <section class="bg-surface-container-low rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-5">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-primary text-2xl">history</span>
              <h2 class="font-headline text-base sm:text-lg font-semibold">Audit Activity Logs</h2>
            </div>
            <div class="flex flex-wrap items-center gap-2 sm:gap-3">
              <div class="relative group flex-grow sm:flex-grow-0">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-base">search</span>
                <input id="audit-log-search" class="bg-surface-container border-none rounded-lg pl-8 pr-3 py-1.5 text-xs w-full sm:w-48 focus:ring-1 focus:ring-primary/30 transition-all min-h-[36px]" placeholder="Filter logs..." type="text" />
              </div>
              <button type="button" class="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 bg-surface-container text-on-surface rounded-lg text-xs font-bold hover:bg-surface-bright transition-colors min-h-[36px]">
                <span class="material-symbols-outlined text-sm">ios_share</span>
                <span class="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
          <div class="overflow-x-auto no-scrollbar">
            <table class="w-full text-left border-separate border-spacing-y-1.5 min-w-[600px]" role="table">
              <thead>
                <tr class="text-[9px] text-on-surface-variant font-bold uppercase tracking-widest px-3">
                  <th scope="col" class="pb-3 pl-3 whitespace-nowrap">Timestamp</th>
                  <th scope="col" class="pb-3 whitespace-nowrap">User</th>
                  <th scope="col" class="pb-3 whitespace-nowrap">Action</th>
                  <th scope="col" class="pb-3 whitespace-nowrap">Target</th>
                  <th scope="col" class="pb-3 text-right pr-3 whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody class="text-xs">
                <tr class="group">
                  <td class="bg-surface-container first:rounded-l-xl py-2.5 sm:py-3 pl-3 text-on-surface-variant font-mono text-[10px] whitespace-nowrap">
                    <time datetime="2023-10-24T14:22">Oct 24, 14:22</time>
                  </td>
                  <td class="bg-surface-container font-medium whitespace-nowrap">Sarah Jenkins</td>
                  <td class="bg-surface-container whitespace-nowrap">
                    <span class="flex items-center gap-1.5">
                      <span class="material-symbols-outlined text-primary text-base">edit_square</span>
                      <span class="hidden sm:inline">Project Update</span>
                    </span>
                  </td>
                  <td class="bg-surface-container text-on-surface-variant truncate max-w-[120px] sm:max-w-none">Nexus Dashboard v2.0</td>
                  <td class="bg-surface-container last:rounded-r-xl text-right pr-3 whitespace-nowrap">
                    <span class="px-1.5 py-0.5 rounded bg-success/10 text-success text-[9px] font-bold">SUCCESS</span>
                  </td>
                </tr>
                <tr class="group">
                  <td class="bg-surface-container first:rounded-l-xl py-2.5 sm:py-3 pl-3 text-on-surface-variant font-mono text-[10px] whitespace-nowrap">
                    <time datetime="2023-10-24T11:05">Oct 24, 11:05</time>
                  </td>
                  <td class="bg-surface-container font-medium whitespace-nowrap">System Bot</td>
                  <td class="bg-surface-container whitespace-nowrap">
                    <span class="flex items-center gap-1.5">
                      <span class="material-symbols-outlined text-tertiary text-base">cloud_sync</span>
                      <span class="hidden sm:inline">Auto Backup</span>
                    </span>
                  </td>
                  <td class="bg-surface-container text-on-surface-variant truncate max-w-[120px] sm:max-w-none">Production Database</td>
                  <td class="bg-surface-container last:rounded-r-xl text-right pr-3 whitespace-nowrap">
                    <span class="px-1.5 py-0.5 rounded bg-success/10 text-success text-[9px] font-bold">SUCCESS</span>
                  </td>
                </tr>
                <tr class="group">
                  <td class="bg-surface-container first:rounded-l-xl py-2.5 sm:py-3 pl-3 text-on-surface-variant font-mono text-[10px] whitespace-nowrap">
                    <time datetime="2023-10-23T18:45">Oct 23, 18:45</time>
                  </td>
                  <td class="bg-surface-container font-medium whitespace-nowrap">Marcus Chen</td>
                  <td class="bg-surface-container whitespace-nowrap">
                    <span class="flex items-center gap-1.5">
                      <span class="material-symbols-outlined text-error text-base">person_add</span>
                      <span class="hidden sm:inline">User Invite</span>
                    </span>
                  </td>
                  <td class="bg-surface-container text-on-surface-variant truncate max-w-[120px] sm:max-w-none">alex@xenon.com</td>
                  <td class="bg-surface-container last:rounded-r-xl text-right pr-3 whitespace-nowrap">
                    <span class="px-1.5 py-0.5 rounded bg-success/10 text-success text-[9px] font-bold">SUCCESS</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <!-- NOTIFICATIONS TAB -->
      <div v-show="activeTab === 'notifications'" class="settings-content space-y-6 sm:space-y-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <section class="bg-surface-container rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8">
            <div class="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
              <span class="material-symbols-outlined text-primary">notifications</span>
              <h2 class="font-headline text-lg sm:text-xl font-semibold">Global Activities</h2>
            </div>
            <div class="space-y-4 sm:space-y-6">
              <div class="flex items-center justify-between p-4 rounded-xl sm:rounded-2xl bg-surface-container-low hover:bg-surface-bright/30 transition-all">
                <div class="space-y-1">
                  <p class="text-sm font-bold font-headline">Project Updates</p>
                  <p class="text-xs text-on-surface-variant">Receive alerts for new milestones and tasks.</p>
                </div>
                <div @click="notifForm.projectUpdates = !notifForm.projectUpdates" role="switch" :aria-checked="notifForm.projectUpdates" tabindex="0" :class="['toggle-switch', notifForm.projectUpdates ? 'active' : 'inactive']" aria-label="Enable project updates"></div>
              </div>
              <div class="flex items-center justify-between p-4 rounded-xl sm:rounded-2xl bg-surface-container-low hover:bg-surface-bright/30 transition-all">
                <div class="space-y-1">
                  <p class="text-sm font-bold font-headline">File Uploads</p>
                  <p class="text-xs text-on-surface-variant">Notify when a client uploads new assets.</p>
                </div>
                <div @click="notifForm.fileUploads = !notifForm.fileUploads" role="switch" :aria-checked="notifForm.fileUploads" tabindex="0" :class="['toggle-switch', notifForm.fileUploads ? 'active' : 'inactive']" aria-label="Enable file upload notifications"></div>
              </div>
              <div class="flex items-center justify-between p-4 rounded-xl sm:rounded-2xl bg-surface-container-low hover:bg-surface-bright/30 transition-all opacity-70">
                <div class="space-y-1">
                  <p class="text-sm font-bold font-headline">Billing Alerts</p>
                  <p class="text-xs text-on-surface-variant">Status of invoices and payment confirmations.</p>
                </div>
                <div @click="notifForm.billingAlerts = !notifForm.billingAlerts" role="switch" :aria-checked="notifForm.billingAlerts" tabindex="0" :class="['toggle-switch', notifForm.billingAlerts ? 'active' : 'inactive']" aria-label="Enable billing alerts"></div>
              </div>
            </div>
          </section>

          <section class="bg-surface-container rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8">
            <div class="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
              <span class="material-symbols-outlined text-primary">chat</span>
              <h2 class="font-headline text-lg sm:text-xl font-semibold">Chat Channels</h2>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="flex items-center justify-between p-4 rounded-xl sm:rounded-2xl bg-surface-container-low border border-primary/20">
                <div class="flex items-center gap-3">
                  <div class="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
                  <span class="text-sm font-bold">#general</span>
                </div>
                <div @click="notifForm.generalChannel = !notifForm.generalChannel" role="switch" :aria-checked="notifForm.generalChannel" tabindex="0" :class="['toggle-switch', notifForm.generalChannel ? 'active' : 'inactive']" aria-label="Enable #general notifications"></div>
              </div>
              <div class="flex items-center justify-between p-4 rounded-xl sm:rounded-2xl bg-surface-container-low border border-primary/20">
                <div class="flex items-center gap-3">
                  <div class="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
                  <span class="text-sm font-bold">#design</span>
                </div>
                <div @click="notifForm.designChannel = !notifForm.designChannel" role="switch" :aria-checked="notifForm.designChannel" tabindex="0" :class="['toggle-switch', notifForm.designChannel ? 'active' : 'inactive']" aria-label="Enable #design notifications"></div>
              </div>
              <div class="flex items-center justify-between p-4 rounded-xl sm:rounded-2xl bg-surface-container-low opacity-70">
                <div class="flex items-center gap-3">
                  <div class="w-2 h-2 rounded-full bg-on-surface-variant"></div>
                  <span class="text-sm font-bold text-on-surface-variant">#feedback</span>
                </div>
                <div @click="notifForm.feedbackChannel = !notifForm.feedbackChannel" role="switch" :aria-checked="notifForm.feedbackChannel" tabindex="0" :class="['toggle-switch', notifForm.feedbackChannel ? 'active' : 'inactive']" aria-label="Enable #feedback notifications"></div>
              </div>
              <div class="flex items-center justify-between p-4 rounded-xl sm:rounded-2xl bg-surface-container-low border border-primary/20">
                <div class="flex items-center gap-3">
                  <div class="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
                  <span class="text-sm font-bold">#dev</span>
                </div>
                <div @click="notifForm.devChannel = !notifForm.devChannel" role="switch" :aria-checked="notifForm.devChannel" tabindex="0" :class="['toggle-switch', notifForm.devChannel ? 'active' : 'inactive']" aria-label="Enable #dev notifications"></div>
              </div>
            </div>
          </section>
        </div>

        <!-- Quiet Hours -->
        <section class="bg-surface-container rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 relative overflow-hidden group hover:border-primary/30 transition-all duration-500">
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          <div class="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8 relative z-10">
            <span class="material-symbols-outlined text-primary">nightlight</span>
            <h2 class="font-headline text-lg sm:text-xl font-semibold">Quiet Hours / DND</h2>
          </div>
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 relative z-10">
            <div class="lg:col-span-1">
              <p class="text-sm text-on-surface leading-relaxed font-medium">Mute all push notifications during your focus time. System alerts will still be archived in your activity feed.</p>
            </div>
            <div class="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div class="space-y-2">
                <label class="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest pl-1 block">Start Time</label>
                <div class="flex items-center gap-4 p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-surface-container-low shadow-inner">
                  <div class="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-primary shadow-xl">
                    <span class="material-symbols-outlined">schedule</span>
                  </div>
                  <span class="text-lg sm:text-xl font-bold font-headline">10:00 PM</span>
                </div>
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest pl-1 block">End Time</label>
                <div class="flex items-center gap-4 p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-surface-container-low shadow-inner">
                  <div class="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-tertiary shadow-xl">
                    <span class="material-symbols-outlined">light_mode</span>
                  </div>
                  <span class="text-lg sm:text-xl font-bold font-headline">08:00 AM</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- PREFERENCES TAB -->
      <div v-show="activeTab === 'preferences'" class="settings-content space-y-6 sm:space-y-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <section class="col-span-1 lg:col-span-2 bg-surface-container rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8">
            <div class="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
              <span class="material-symbols-outlined text-primary">language</span>
              <h2 class="font-headline text-lg sm:text-xl font-semibold">Localization</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div class="space-y-2">
                <label for="timezone" class="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest pl-1 block">Default Time Zone</label>
                <div class="relative group">
                  <select id="timezone" v-model="prefForm.timezone" class="w-full bg-surface-container-low border border-white/5 rounded-xl px-4 py-3 text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all cursor-pointer min-h-[44px]">
                    <option>UTC-08:00 Pacific Time (US & Canada)</option>
                    <option>UTC+00:00 London (GMT)</option>
                    <option>UTC+01:00 Berlin (CET)</option>
                    <option>UTC+05:30 Mumbai (IST)</option>
                  </select>
                  <span class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                </div>
              </div>
              <div class="space-y-4">
                <label class="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest pl-1 block">Date Format</label>
                <div class="space-y-3">
                  <label class="flex items-center gap-4 p-4 rounded-xl bg-surface-container-low border border-primary/30 cursor-pointer hover:border-primary/50 transition-all group shadow-inner">
                    <input type="radio" v-model="prefForm.dateFormat" value="dd_mm_yyyy" name="date_format" class="custom-radio appearance-none w-5 h-5 border-2 border-primary rounded-full flex items-center justify-center shrink-0" />
                    <div class="flex flex-col sm:flex-row sm:items-center w-full justify-between">
                      <span class="text-sm font-bold tracking-wide">DD/MM/YYYY</span>
                      <span class="text-[9px] text-primary uppercase tracking-widest font-bold">(International)</span>
                    </div>
                  </label>
                  <label class="flex items-center gap-4 p-4 rounded-xl bg-surface-container-low border border-white/5 cursor-pointer hover:border-on-surface-variant/30 transition-all group opacity-70 hover:opacity-100">
                    <input type="radio" v-model="prefForm.dateFormat" value="mm_dd_yyyy" name="date_format" class="custom-radio appearance-none w-5 h-5 border-2 border-on-surface-variant rounded-full flex items-center justify-center shrink-0" />
                    <div class="flex flex-col sm:flex-row sm:items-center w-full justify-between">
                      <span class="text-sm font-bold tracking-wide">MM/DD/YYYY</span>
                      <span class="text-[9px] text-on-surface-variant uppercase tracking-widest font-bold">(US Standard)</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </section>

          <section class="bg-surface-container rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 relative overflow-hidden group">
            <div class="absolute inset-0 bg-gradient-to-tr from-primary/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div class="flex items-center gap-2 sm:gap-3 mb-4 relative z-10">
              <span class="material-symbols-outlined text-primary">bolt</span>
              <h2 class="font-headline text-lg sm:text-xl font-semibold">Account Metadata</h2>
            </div>
            <p class="text-xs text-on-surface-variant leading-relaxed mb-6 relative z-10">System-generated audit data for this workspace identity node.</p>
            <div class="p-5 sm:p-6 rounded-xl sm:rounded-2xl bg-surface-container-low border border-white/5 space-y-4 relative z-10 shadow-inner">
              <div class="flex flex-col gap-1">
                <p class="text-[9px] uppercase tracking-widest text-primary font-bold">Account Created</p>
                <p class="text-sm font-bold tracking-wide">Oct 12, 2023</p>
              </div>
              <div class="flex flex-col gap-1">
                <p class="text-[9px] uppercase tracking-widest text-primary font-bold">Plan Type</p>
                <p class="text-sm font-bold text-success tracking-wide">Enterprise</p>
              </div>
              <div class="flex flex-col gap-1">
                <p class="text-[9px] uppercase tracking-widest text-primary font-bold">Workspace ID</p>
                <p class="text-sm font-bold font-mono tracking-widest">#7F42A9B1</p>
              </div>
            </div>
          </section>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <section class="bg-surface-container rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8">
            <div class="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
              <span class="material-symbols-outlined text-primary">help</span>
              <h2 class="font-headline text-lg sm:text-xl font-semibold">Help & Support</h2>
            </div>
            <div class="space-y-3 sm:space-y-4">
              <button class="w-full flex items-center justify-between p-4 rounded-xl bg-surface-container-low border border-white/5 hover:border-primary/50 transition-all group shadow-inner">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface-variant group-hover:text-tertiary transition-colors">
                    <span class="material-symbols-outlined">menu_book</span>
                  </div>
                  <span class="text-sm font-bold font-headline">Knowledge Base</span>
                </div>
                <span class="material-symbols-outlined text-on-surface-variant group-hover:text-tertiary transition-colors">chevron_right</span>
              </button>
              <button class="w-full flex items-center justify-between p-4 rounded-xl bg-surface-container-low border border-white/5 hover:border-primary/50 transition-all group shadow-inner">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface-variant group-hover:text-success transition-colors">
                    <span class="material-symbols-outlined">chat</span>
                  </div>
                  <span class="text-sm font-bold font-headline">Live Support</span>
                </div>
                <span class="material-symbols-outlined text-on-surface-variant group-hover:text-success transition-colors">chevron_right</span>
              </button>
            </div>
          </section>

          <section class="col-span-1 lg:col-span-2 bg-surface-container rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 relative overflow-hidden group">
            <div class="absolute right-0 top-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] group-hover:bg-primary/10 transition-colors duration-700 pointer-events-none"></div>
            <div class="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8 relative z-10">
              <span class="material-symbols-outlined text-primary">info</span>
              <h2 class="font-headline text-lg sm:text-xl font-semibold">System Info</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 relative z-10">
              <div class="space-y-6">
                <div class="space-y-2">
                  <p class="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">App Version</p>
                  <p class="text-2xl font-bold font-mono tracking-wider">v2.4.12-stable</p>
                </div>
                <div class="space-y-2">
                  <p class="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">Build ID</p>
                  <p class="text-2xl font-bold text-success font-mono tracking-wider">0x7F42A9B1</p>
                </div>
              </div>
              <div class="flex flex-col justify-end items-start md:items-end">
                <button class="flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-on-primary transition-all font-bold text-[10px] uppercase tracking-widest group/btn">
                  <span class="material-symbols-outlined text-sm group-hover/btn:rotate-180 transition-transform duration-500">refresh</span>
                  Release Notes
                </button>
              </div>
            </div>
          </section>
        </div>

        <section class="bg-surface-container rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8">
          <div class="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
            <span class="material-symbols-outlined text-primary">mail</span>
            <h2 class="font-headline text-lg sm:text-xl font-semibold">Communication Options</h2>
          </div>
          <div class="space-y-4 sm:space-y-6">
            <div class="flex items-center justify-between p-4 rounded-xl sm:rounded-2xl bg-surface-container-low hover:bg-surface-bright/30 transition-all">
              <div class="space-y-1">
                <p class="text-sm font-bold font-headline">Email Marketing</p>
                <p class="text-xs text-on-surface-variant">Receive updates about new features and ecosystem news.</p>
              </div>
              <div @click="prefForm.emailMarketing = !prefForm.emailMarketing" role="switch" :aria-checked="prefForm.emailMarketing" tabindex="0" :class="['toggle-switch', prefForm.emailMarketing ? 'active' : 'inactive']" aria-label="Enable email marketing"></div>
            </div>
            <div class="flex items-center justify-between p-4 rounded-xl sm:rounded-2xl bg-surface-container-low hover:bg-surface-bright/30 transition-all opacity-70">
              <div class="space-y-1">
                <p class="text-sm font-bold font-headline">Product Surveys</p>
                <p class="text-xs text-on-surface-variant">Invites to help us shape the future of the platform.</p>
              </div>
              <div @click="prefForm.productSurveys = !prefForm.productSurveys" role="switch" :aria-checked="prefForm.productSurveys" tabindex="0" :class="['toggle-switch', prefForm.productSurveys ? 'active' : 'inactive']" aria-label="Enable product surveys"></div>
            </div>
          </div>
        </section>
      </div>

      <!-- PRIVACY TAB -->
      <div v-show="activeTab === 'privacy'" class="settings-content space-y-6 sm:space-y-8">
        <section class="bg-surface-container rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 relative overflow-hidden group">
          <div class="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 relative z-10">
            <span class="material-symbols-outlined text-primary">security</span>
            <h2 class="font-headline text-lg sm:text-xl font-semibold">GDPR & Regulatory Compliance</h2>
          </div>
          <p class="text-sm text-on-surface leading-relaxed relative z-10 mb-6">Our platform is fully compliant with the General Data Protection Regulation (GDPR). Your data is strictly encrypted at rest and in transit. You have the right to access, rectify, or erase your personal data footprint at any time. We do not sell your data to any third parties whatsoever.</p>
          <button class="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2 transition-colors relative z-10 bg-surface-container-high/50 hover:bg-surface-container-high px-6 py-3 rounded-xl border border-white/5 shadow-inner">
            Read Complete Privacy Policy
            <span class="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </section>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <section class="bg-surface-container rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8">
            <div class="flex items-center gap-2 sm:gap-3 mb-6">
              <span class="material-symbols-outlined text-primary">download</span>
              <h2 class="font-headline text-lg sm:text-xl font-semibold">Data Export</h2>
            </div>
            <p class="text-xs text-on-surface-variant mb-6 leading-relaxed">Download a compiled local copy of your account activity, project history, and billing records for your personal archives.</p>
            <div class="space-y-3 sm:space-y-4 mb-6">
              <button class="w-full flex items-center justify-between p-4 rounded-xl sm:rounded-2xl bg-surface-container-low border border-white/5 hover:border-primary/50 hover:bg-surface-container transition-all group shadow-inner">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface-variant group-hover:text-info shadow-xl transition-colors">
                    <span class="material-symbols-outlined">description</span>
                  </div>
                  <div class="text-left">
                    <p class="text-sm font-bold font-headline">Export as PDF</p>
                    <p class="text-[9px] text-on-surface-variant uppercase tracking-widest font-bold mt-0.5">Optimized for reading</p>
                  </div>
                </div>
                <span class="material-symbols-outlined text-on-surface-variant group-hover:text-info transition-colors">download</span>
              </button>
              <button class="w-full flex items-center justify-between p-4 rounded-xl sm:rounded-2xl bg-surface-container-low border border-white/5 hover:border-primary/50 hover:bg-surface-container transition-all group shadow-inner">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface-variant group-hover:text-tertiary shadow-xl transition-colors">
                    <span class="font-mono text-base font-bold">{ }</span>
                  </div>
                  <div class="text-left">
                    <p class="text-sm font-bold font-headline">Export as JSON</p>
                    <p class="text-[9px] text-on-surface-variant uppercase tracking-widest font-bold mt-0.5">Optimized for dev teams</p>
                  </div>
                </div>
                <span class="material-symbols-outlined text-on-surface-variant group-hover:text-tertiary transition-colors">download</span>
              </button>
            </div>
            <div class="flex items-center justify-between pt-4 border-t border-white/5">
              <p class="text-[9px] text-on-surface-variant uppercase tracking-widest font-bold w-full text-center">Last Export: <span class="font-bold">14 days ago</span></p>
            </div>
          </section>

          <section class="bg-surface-container rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8">
            <div class="flex items-center gap-2 sm:gap-3 mb-6">
              <span class="material-symbols-outlined text-primary">devices</span>
              <h2 class="font-headline text-lg sm:text-xl font-semibold">Connected Devices</h2>
            </div>
            <div class="space-y-3">
              <div class="flex items-center justify-between p-4 rounded-xl bg-surface-container-low border border-primary/20">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-primary">
                    <span class="material-symbols-outlined">laptop_mac</span>
                  </div>
                  <div>
                    <p class="text-sm font-semibold">MacBook Pro 16"</p>
                    <p class="text-[10px] text-on-surface-variant">San Francisco, CA • Current</p>
                  </div>
                </div>
                <span class="px-2 py-1 rounded bg-primary/10 text-primary text-[9px] font-bold uppercase tracking-widest">Active</span>
              </div>
              <div class="flex items-center justify-between p-4 rounded-xl bg-surface-container-low border border-white/5">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                    <span class="material-symbols-outlined">phone_iphone</span>
                  </div>
                  <div>
                    <p class="text-sm font-semibold">iPhone 15 Pro</p>
                    <p class="text-[10px] text-on-surface-variant">London, UK • 2h ago</p>
                  </div>
                </div>
                <button class="text-[10px] font-bold text-error uppercase tracking-widest hover:bg-error/10 px-3 py-1.5 rounded-lg transition-colors">Sign Out</button>
              </div>
            </div>
          </section>
        </div>
      </div>

      <!-- ADVANCED TAB -->
      <div v-show="activeTab === 'advanced'" class="settings-content space-y-6 sm:space-y-8">
        <section class="bg-surface-container rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-warning/20 relative overflow-hidden group">
          <div class="absolute inset-0 bg-gradient-to-b from-transparent to-warning/[0.03] pointer-events-none"></div>
          <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6 relative z-10">
            <div class="space-y-2">
              <h3 class="text-xl sm:text-2xl font-bold text-warning font-headline">Advanced Cache Management</h3>
              <p class="text-sm text-on-surface leading-relaxed max-w-2xl">Purge all locally cached data, temporary files, and stale workspace states. This action will force a complete re-sync on next reload and may temporarily impact performance.</p>
            </div>
            <button class="px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl bg-warning/10 border border-warning/20 text-warning hover:bg-warning hover:text-surface transition-all font-bold text-[10px] uppercase tracking-widest whitespace-nowrap shrink-0">Purge Cache</button>
          </div>
        </section>

        <section class="bg-surface-container rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-error/20 shadow-[0_0_20px_rgba(239,68,68,0.05)] relative overflow-hidden group">
          <div class="absolute inset-0 bg-gradient-to-b from-transparent to-error/[0.03] pointer-events-none"></div>
          <div class="flex items-center gap-2 sm:gap-3 mb-6 relative z-10">
            <div class="p-2 rounded-lg bg-error/10 border border-error/20">
              <span class="material-symbols-outlined text-error">warning</span>
            </div>
            <h2 class="font-headline text-lg sm:text-xl font-semibold text-error">Danger Zone</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 relative z-10">
            <div class="space-y-4">
              <p class="text-xs text-on-surface leading-relaxed">Permanently delete all workspace data, projects, files, and user accounts. This action is irreversible and will destroy all associated metadata.</p>
              <button class="w-full px-6 py-3 rounded-xl bg-error/10 border border-error/20 text-error hover:bg-error hover:text-on-primary transition-all font-bold text-[10px] uppercase tracking-widest">Delete Workspace</button>
            </div>
            <div class="space-y-4">
              <p class="text-xs text-on-surface leading-relaxed">Permanently delete your account and all associated data across all workspaces. This action cannot be undone.</p>
              <button class="w-full px-6 py-3 rounded-xl bg-error/10 border border-error/20 text-error hover:bg-error hover:text-on-primary transition-all font-bold text-[10px] uppercase tracking-widest">Delete Account</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '@/api/client'
import {
  getSessions,
  revokeSession,
  getSecuritySettings,
  updateSecuritySettings,
  changePassword,
  getSystemInfo,
  purgeCache,
  exportDataAsJson
} from '@/api/settings'

const router = useRouter()
const activeTab = ref('security')
const loading = ref(false)
const saving = ref(false)
const sessions = ref<any[]>([])
const systemInfo = ref<any>(null)

const securityForm = reactive({
  current_password: '',
  new_password: '',
  confirm_password: '',
  authenticatorEnabled: false,
  smsEnabled: false,
  complexPasswords: true,
  twoFaEnforcement: false,
  reauthEnabled: false
})

const notifForm = reactive({
  projectUpdates: true,
  fileUploads: true,
  billingAlerts: false,
  emailMarketing: true,
  productSurveys: false,
  generalChannel: true,
  designChannel: true,
  feedbackChannel: false,
  devChannel: true
})

const quietHours = reactive({
  enabled: false,
  start_time: '22:00',
  end_time: '08:00',
  timezone: 'UTC'
})

const prefForm = reactive({
  timezone: 'UTC-08:00 Pacific Time (US & Canada)',
  dateFormat: 'dd_mm_yyyy',
  emailMarketing: true,
  productSurveys: false
})

async function loadSettings() {
  loading.value = true
  try {
    const [securityRes, notifRes, sessionsRes, sysRes] = await Promise.all([
      apiClient.get('/settings/security').then(r => r.data).catch(() => ({ settings: {} })),
      apiClient.get('/settings/notifications').then(r => r.data).catch(() => ({ notifications: {}, quiet_hours: {} })),
      getSessions().catch(() => ({ sessions: [] })),
      getSystemInfo().catch(() => ({ info: null }))
    ])

    const s = securityRes.settings || {}
    securityForm.complexPasswords = s.complex_passwords ?? true
    securityForm.twoFaEnforcement = s.two_fa_enforcement ?? false
    securityForm.reauthEnabled = s.reauth_enabled ?? false
    securityForm.authenticatorEnabled = s.authenticator_enabled ?? false

    const n = notifRes.notifications || {}
    notifForm.projectUpdates = n.project_updates !== false
    notifForm.fileUploads = n.file_uploads !== false
    notifForm.billingAlerts = n.billing_alerts ?? false
    notifForm.emailMarketing = n.email_marketing !== false
    notifForm.productSurveys = n.product_surveys ?? false
    notifForm.generalChannel = n.general_channel !== false
    notifForm.designChannel = n.design_channel !== false
    notifForm.feedbackChannel = n.feedback_channel ?? false
    notifForm.devChannel = n.dev_channel !== false

    const qh = notifRes.quiet_hours || {}
    quietHours.enabled = qh.enabled ?? false
    quietHours.start_time = qh.start_time || '22:00'
    quietHours.end_time = qh.end_time || '08:00'
    quietHours.timezone = qh.timezone || 'UTC'

    sessions.value = sessionsRes.sessions || []
    systemInfo.value = sysRes.info
  } catch (err) {
    console.error('Failed to load settings:', err)
  } finally {
    loading.value = false
  }
}

async function saveSecuritySettings() {
  saving.value = true
  try {
    await updateSecuritySettings({
      complex_passwords: securityForm.complexPasswords,
      two_fa_enforcement: securityForm.twoFaEnforcement,
      reauth_enabled: securityForm.reauthEnabled
    })
  } catch (err) {
    console.error('Failed to save security settings:', err)
  } finally {
    saving.value = false
  }
}

async function saveNotificationSettings() {
  saving.value = true
  try {
    await apiClient.put('/settings/notifications', {
      project_updates: notifForm.projectUpdates,
      file_uploads: notifForm.fileUploads,
      billing_alerts: notifForm.billingAlerts,
      email_marketing: notifForm.emailMarketing,
      product_surveys: notifForm.productSurveys,
      general_channel: notifForm.generalChannel,
      design_channel: notifForm.designChannel,
      feedback_channel: notifForm.feedbackChannel,
      dev_channel: notifForm.devChannel
    })
    await apiClient.put('/settings/quiet-hours', quietHours)
  } catch (err) {
    console.error('Failed to save notification settings:', err)
  } finally {
    saving.value = false
  }
}

async function handlePasswordChange() {
  if (securityForm.new_password !== securityForm.confirm_password) {
    alert('Passwords do not match')
    return
  }
  if (securityForm.new_password.length < 8) {
    alert('Password must be at least 8 characters')
    return
  }
  saving.value = true
  try {
    await changePassword(securityForm.current_password, securityForm.new_password)
    securityForm.current_password = ''
    securityForm.new_password = ''
    securityForm.confirm_password = ''
    alert('Password changed successfully')
  } catch (err: any) {
    alert(err.response?.data?.message || 'Failed to change password')
  } finally {
    saving.value = false
  }
}

async function handleLogoutSession(id: number) {
  try {
    if (confirm('Are you sure you want to logout this device?')) {
      await revokeSession(id)
      sessions.value = sessions.value.filter(s => s.id !== id)
    }
  } catch (err) {
    console.error('Failed to logout session:', err)
  }
}

async function handlePurgeCache() {
  if (confirm('Are you sure you want to purge the cache?')) {
    try {
      await purgeCache()
      alert('Cache purged successfully')
    } catch (err) {
      alert('Failed to purge cache')
    }
  }
}

async function handleExport(type: 'pdf' | 'json') {
  try {
    const data = await exportDataAsJson()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `user-data-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  } catch (err) {
    alert('Failed to export data')
  }
}

onMounted(loadSettings)
</script>