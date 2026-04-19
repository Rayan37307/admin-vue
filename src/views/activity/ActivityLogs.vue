<template>
  <div class="space-y-8 p-8">
    <header class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
      <div>
        <span class="text-[10px] font-bold tracking-[0.2em] text-primary uppercase block mb-1">Security Protocol 4.0</span>
        <h1 class="text-4xl font-light text-white">Activity Logs</h1>
        <p class="text-slate-400 text-sm max-w-lg">Monitor system-wide actions and login sessions. Real-time observability for infrastructure security.</p>
      </div>
      <div class="flex gap-3">
        <button class="bg-surface-container hover:bg-surface-container-high px-4 py-2.5 rounded-xl border border-white/10 text-sm flex items-center gap-2 transition-all">
          <Download class="w-4 h-4" />
          Export PDF
        </button>
        <button class="bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-all shadow-lg">
          <FileDown class="w-4 h-4" />
          CSV Report
        </button>
      </div>
    </header>

    <section class="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div class="bg-surface-container-low rounded-3xl p-6 relative overflow-hidden">
        <div class="absolute top-0 left-0 w-1 h-full bg-primary"></div>
        <p class="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Total Actions</p>
        <h3 class="text-3xl font-semibold text-white mt-1">24,892</h3>
        <div class="flex items-center gap-2 text-primary text-xs mt-3">
          <TrendingUp class="w-3 h-3" />
          <span>12% from last 24h</span>
        </div>
      </div>
      <div class="bg-surface-container-low rounded-3xl p-6 relative overflow-hidden">
        <div class="absolute top-0 left-0 w-1 h-full bg-tertiary"></div>
        <p class="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Security Flags</p>
        <h3 class="text-3xl font-semibold text-white mt-1">14</h3>
        <div class="flex items-center gap-2 text-tertiary text-xs mt-3">
          <Report class="w-3 h-3" />
          <span>Requires review</span>
        </div>
      </div>
      <div class="bg-surface-container-low rounded-3xl p-6 relative overflow-hidden">
        <div class="absolute top-0 left-0 w-1 h-full bg-emerald-400"></div>
        <p class="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Login Sessions</p>
        <h3 class="text-3xl font-semibold text-white mt-1">124</h3>
        <div class="flex items-center gap-2 text-emerald-400 text-xs mt-3">
          <Sensors class="w-3 h-3" />
          <span>Active sessions</span>
        </div>
      </div>
    </section>

    <section class="bg-surface-container-low rounded-3xl p-6 md:p-8">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-xl font-semibold text-white">Activity Intensity Trend</h2>
          <p class="text-xs text-slate-400">Real-time density of system actions</p>
        </div>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-primary"></div>
            <span class="text-[10px] text-slate-400 uppercase">System Actions</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-tertiary"></div>
            <span class="text-[10px] text-slate-400 uppercase">Security Flags</span>
          </div>
        </div>
      </div>
      <div class="h-[250px] flex items-end gap-2 px-4">
        <div v-for="i in 24" :key="i" class="flex-1 bg-primary/20 rounded-t hover:bg-primary/40 transition-all" :style="{ height: Math.random() * 80 + 20 + '%' }"></div>
      </div>
    </section>

    <section class="bg-surface-container-low rounded-3xl p-3 mb-8">
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex-1 min-w-[220px] relative">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="search" placeholder="Search User IDs, actions or keywords..." class="w-full bg-surface-container text-white text-sm rounded-xl py-3 pl-12 pr-4 border-0 focus:ring-2 focus:ring-primary" />
        </div>
        <button class="bg-surface-container hover:bg-surface-container-high px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider border border-white/10 flex items-center gap-2">
          Action Type
          <ChevronDown class="w-3 h-3" />
        </button>
        <button class="bg-surface-container hover:bg-surface-container-high px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider border border-white/10 flex items-center gap-2">
          Module
          <ChevronDown class="w-3 h-3" />
        </button>
        <button class="bg-surface-container hover:bg-surface-container-high px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider border border-white/10 flex items-center gap-2">
          Date Range
          <Calendar class="w-3 h-3" />
        </button>
      </div>
    </section>

    <section class="space-y-6">
      <div class="flex gap-6 border-b border-white/10">
        <button class="pb-4 border-b-2 border-primary text-primary text-sm font-semibold">User & System Activity</button>
        <button class="pb-4 border-b-2 border-transparent text-slate-400 text-sm font-medium">Login Sessions</button>
        <button class="pb-4 border-b-2 border-transparent text-slate-400 text-sm font-medium">Admin Controls</button>
      </div>

      <div class="bg-surface-container-low rounded-3xl overflow-hidden">
        <table class="w-full text-left">
          <thead>
            <tr class="border-b border-white/5">
              <th class="px-6 py-5 text-[10px] uppercase tracking-[0.15em] text-slate-500">User / Entity</th>
              <th class="px-6 py-5 text-[10px] uppercase tracking-[0.15em] text-slate-500">Action Context</th>
              <th class="px-6 py-5 text-[10px] uppercase tracking-[0.15em] text-slate-500 text-center">Severity</th>
              <th class="px-6 py-5 text-[10px] uppercase tracking-[0.15em] text-slate-500 text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            <tr class="hover:bg-surface-container transition-colors cursor-pointer">
              <td class="px-6 py-5">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-xl bg-surface-container-highest"></div>
                  <div>
                    <div class="text-sm font-semibold text-white">John Smith</div>
                    <div class="text-[10px] text-slate-400">Project Manager</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-5">
                <div class="text-sm text-white flex items-center gap-2">
                  <Upload class="w-4 h-4 text-primary" />
                  Updated project <span class="text-primary">"Obsidian-Core-V2"</span>
                </div>
                <div class="text-[10px] text-slate-400 uppercase tracking-wider mt-1">Module: Engineering</div>
              </td>
              <td class="px-6 py-5 text-center">
                <span class="bg-primary/10 text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Normal</span>
              </td>
              <td class="px-6 py-5 text-right">
                <div class="text-xs text-slate-400">2 mins ago</div>
                <div class="text-[10px] text-slate-500">14:24:02</div>
              </td>
            </tr>
            <tr class="hover:bg-surface-container transition-colors cursor-pointer">
              <td class="px-6 py-5">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-xl bg-surface-container-highest"></div>
                  <div>
                    <div class="text-sm font-semibold text-white">Anna Lopez</div>
                    <div class="text-[10px] text-slate-400">System Admin</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-5">
                <div class="text-sm text-white flex items-center gap-2">
                  <Shield class="w-4 h-4 text-tertiary" />
                  Edited Role Permissions: <span class="text-tertiary">"Support-Tier-1"</span>
                </div>
                <div class="text-[10px] text-slate-400 uppercase tracking-wider mt-1">Module: Security</div>
              </td>
              <td class="px-6 py-5 text-center">
                <span class="bg-tertiary/10 text-tertiary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Critical</span>
              </td>
              <td class="px-6 py-5 text-right">
                <div class="text-xs text-slate-400">15 mins ago</div>
                <div class="text-[10px] text-slate-500">14:11:45</div>
              </td>
            </tr>
            <tr class="hover:bg-surface-container transition-colors cursor-pointer">
              <td class="px-6 py-5">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center">
                    <Bot class="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <div class="text-sm font-semibold text-white">System Bot</div>
                    <div class="text-[10px] text-slate-400">Automated Task</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-5">
                <div class="text-sm text-white flex items-center gap-2">
                  <RefreshCw class="w-4 h-4 text-slate-400" />
                  Scheduled backup completed successfully
                </div>
                <div class="text-[10px] text-slate-400 uppercase tracking-wider mt-1">Module: Infrastructure</div>
              </td>
              <td class="px-6 py-5 text-center">
                <span class="bg-slate-500/10 text-slate-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Info</span>
              </td>
              <td class="px-6 py-5 text-right">
                <div class="text-xs text-slate-400">42 mins ago</div>
                <div class="text-[10px] text-slate-500">13:44:12</div>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="px-6 py-4 flex items-center justify-between border-t border-white/5">
          <span class="text-xs text-slate-400">Showing <span class="text-white font-bold">1-10</span> of <span class="text-white font-bold">4,209</span> actions</span>
          <div class="flex items-center gap-1">
            <button class="p-2 hover:bg-surface-container-highest rounded-lg text-slate-400">
              <ChevronLeft class="w-4 h-4" />
            </button>
            <button class="px-3 py-2 bg-primary text-white text-xs font-bold rounded-lg">1</button>
            <button class="px-3 py-2 hover:bg-surface-container-highest text-xs font-bold rounded-lg text-slate-400">2</button>
            <button class="p-2 hover:bg-surface-container-highest rounded-lg text-slate-400">
              <ChevronRight class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import {
  Download,
  FileDown,
  TrendingUp,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Upload,
  Shield,
  Bot,
  RefreshCw,
  Activity,
} from 'lucide-vue-next'
</script>