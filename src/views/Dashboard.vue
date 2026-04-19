<template>
  <div class="space-y-8 p-8">
    <section class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div>
        <h2 class="text-4xl font-light tracking-tight text-white">Command Center</h2>
        <p class="text-slate-400 text-sm mt-1">Complete system overview and real-time analytics.</p>
      </div>
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <span class="relative flex h-2.5 w-2.5">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span class="text-xs font-bold text-emerald-400 uppercase tracking-wider">System Online</span>
        </div>
        <button class="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all">
          <Plus class="w-4 h-4" />
          Quick Action
        </button>
      </div>
    </section>

    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      <div class="bg-surface-container-low rounded-3xl p-6 md:p-8 relative overflow-hidden border border-white/5">
        <div class="absolute left-0 top-0 bottom-0 w-1 bg-blue-400 rounded-full"></div>
        <div class="flex justify-between items-start mb-4">
          <div class="p-2 bg-blue-400/10 rounded-xl">
            <Users class="w-5 h-5 text-blue-400" />
          </div>
          <span class="text-xs font-medium text-emerald-400 flex items-center gap-1">
            <TrendingUp class="w-3 h-3" />
            +12%
          </span>
        </div>
        <p class="text-slate-400 text-[10px] font-bold tracking-widest uppercase">Total Clients</p>
        <h3 class="text-3xl font-semibold text-white mt-1">1,284</h3>
        <p class="text-[10px] text-slate-400 mt-2">942 Active • 12 New this month</p>
      </div>

      <div class="bg-surface-container-low rounded-3xl p-6 md:p-8 relative overflow-hidden border border-white/5">
        <div class="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-full"></div>
        <div class="flex justify-between items-start mb-4">
          <div class="p-2 bg-primary/10 rounded-xl">
            <FolderOpen class="w-5 h-5 text-primary" />
          </div>
          <span class="text-xs font-medium text-emerald-400 flex items-center gap-1">
            <TrendingUp class="w-3 h-3" />
            +8%
          </span>
        </div>
        <p class="text-slate-400 text-[10px] font-bold tracking-widest uppercase">Active Projects</p>
        <h3 class="text-3xl font-semibold text-white mt-1">42</h3>
        <p class="text-[10px] text-slate-400 mt-2">128 Completed • 2 Delayed</p>
      </div>

      <div class="bg-surface-container-low rounded-3xl p-6 md:p-8 relative overflow-hidden border border-white/5">
        <div class="absolute left-0 top-0 bottom-0 w-1 bg-emerald-400 rounded-full"></div>
        <div class="flex justify-between items-start mb-4">
          <div class="p-2 bg-emerald-500/10 rounded-xl">
            <DollarSign class="w-5 h-5 text-emerald-400" />
          </div>
          <span class="text-xs font-medium text-emerald-400 flex items-center gap-1">
            <TrendingUp class="w-3 h-3" />
            +24%
          </span>
        </div>
        <p class="text-slate-400 text-[10px] font-bold tracking-widest uppercase">Revenue (MTD)</p>
        <h3 class="text-3xl font-semibold text-white mt-1">$84.2k</h3>
        <p class="text-[10px] text-slate-400 mt-2">$62.1k Received • $22.1k Pending</p>
      </div>

      <div class="bg-surface-container-low rounded-3xl p-6 md:p-8 relative overflow-hidden border border-white/5">
        <div class="absolute left-0 top-0 bottom-0 w-1 bg-amber-400 rounded-full"></div>
        <div class="flex justify-between items-start mb-4">
          <div class="p-2 bg-amber-500/10 rounded-xl">
            <CheckSquare class="w-5 h-5 text-amber-400" />
          </div>
          <span class="text-xs font-medium text-rose-400 flex items-center gap-1">
            <TrendingDown class="w-3 h-3" />
            -3%
          </span>
        </div>
        <p class="text-slate-400 text-[10px] font-bold tracking-widest uppercase">Open Tasks</p>
        <h3 class="text-3xl font-semibold text-white mt-1">156</h3>
        <p class="text-[10px] text-slate-400 mt-2">48 High Priority • 12 Overdue</p>
      </div>
    </section>

    <section class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div class="lg:col-span-8 bg-surface-container-low rounded-3xl p-6 md:p-8 border border-white/5">
        <div class="flex items-center gap-3 mb-6">
          <BarChart3 class="w-5 h-5 text-primary" />
          <h3 class="text-xl font-bold text-white">Revenue Analytics</h3>
        </div>
        <p class="text-xs text-slate-400 mb-6">Monthly revenue performance</p>
        <div class="h-64 flex items-end gap-3 mb-4 px-2">
          <div v-for="(bar, i) in revenueBars" :key="i" class="flex-1 flex flex-col items-center gap-1">
            <div
              class="w-full rounded-t-lg relative group overflow-hidden transition-all"
              :style="{ height: bar.height + '%' }"
              :class="bar.isCurrent ? 'bg-emerald-400/30' : 'bg-primary/20'"
            >
              <div
                class="absolute bottom-0 w-full rounded-t-lg transition-all group-hover:opacity-80"
                :class="bar.isCurrent ? 'bg-emerald-400' : 'bg-primary'"
                :style="{ height: '100%' }"
              ></div>
            </div>
            <span class="text-[10px] text-slate-400 font-medium" :class="bar.isCurrent ? 'text-emerald-400 font-bold' : ''">{{ bar.label }}</span>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
          <div class="text-center">
            <p class="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Total Revenue</p>
            <p class="text-xl font-bold text-white mt-1">$120.0k</p>
          </div>
          <div class="text-center border-x border-white/5">
            <p class="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Avg. Monthly</p>
            <p class="text-xl font-bold text-primary mt-1">$20.0k</p>
          </div>
          <div class="text-center">
            <p class="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Growth Rate</p>
            <p class="text-xl font-bold text-emerald-400 mt-1">+24%</p>
          </div>
        </div>
      </div>

      <div class="lg:col-span-4 space-y-8">
        <div class="bg-surface-container-low rounded-3xl p-6 md:p-8 border border-white/5">
          <div class="flex items-center gap-3 mb-6">
            <Bell class="w-5 h-5 text-rose-400" />
            <h3 class="font-bold text-white">Priority Alerts</h3>
          </div>
          <p class="text-[10px] text-slate-400">Requires immediate attention</p>
          <div class="space-y-4 mt-4">
            <div class="p-4 bg-rose-500/5 rounded-xl border-l-4 border-rose-500">
              <p class="text-xs font-bold text-white">Server Overload</p>
              <p class="text-[10px] text-slate-400 mt-1">Cluster A-12 at 94% capacity</p>
            </div>
            <div class="p-4 bg-amber-500/5 rounded-xl border-l-4 border-amber-400">
              <p class="text-xs font-bold text-white">Payment Overdue</p>
              <p class="text-[10px] text-slate-400 mt-1">3 invoices past due date</p>
            </div>
            <div class="p-4 bg-blue-500/5 rounded-xl border-l-4 border-blue-400">
              <p class="text-xs font-bold text-white">Backup Pending</p>
              <p class="text-[10px] text-slate-400 mt-1">Database backup scheduled</p>
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-br from-primary to-purple-600 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden">
          <h3 class="font-bold text-lg mb-6">Quick Actions</h3>
          <div class="grid grid-cols-2 gap-3">
            <button class="bg-white/10 hover:bg-white/20 backdrop-blur py-3 px-3 rounded-xl text-xs font-bold flex flex-col items-center gap-2 transition-all">
              <UserPlus class="w-5 h-5" />
              New Client
            </button>
            <button class="bg-white/10 hover:bg-white/20 backdrop-blur py-3 px-3 rounded-xl text-xs font-bold flex flex-col items-center gap-2 transition-all">
              <FilePlus class="w-5 h-5" />
              Create Task
            </button>
            <button class="bg-white/10 hover:bg-white/20 backdrop-blur py-3 px-3 rounded-xl text-xs font-bold flex flex-col items-center gap-2 transition-all">
              <Receipt class="w-5 h-5" />
              New Invoice
            </button>
            <button class="bg-black/20 hover:bg-black/30 backdrop-blur py-3 px-3 rounded-xl text-xs font-bold flex flex-col items-center gap-2 transition-all">
              <Download class="w-5 h-5" />
              Reports
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div class="lg:col-span-8 space-y-8">
        <div class="bg-surface-container-low rounded-3xl p-6 md:p-8 border border-white/5">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <Users class="w-5 h-5 text-primary" />
              <h3 class="text-xl font-bold text-white">Clients Summary</h3>
            </div>
            <RouterLink to="/clients" class="text-sm font-semibold text-primary flex items-center gap-2">
              View All
              <ArrowRight class="w-4 h-4" />
            </RouterLink>
          </div>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-surface-container rounded-2xl border border-white/5">
              <div class="flex items-center gap-4 min-w-0 flex-1">
                <div class="w-12 h-12 rounded-full bg-blue-400/20 flex items-center justify-center text-blue-400 font-bold">AC</div>
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-bold text-white truncate">Acme Corp</p>
                  <p class="text-xs text-slate-400 truncate">Onboarding • $2,400 pending</p>
                </div>
              </div>
              <span class="text-xs text-primary font-bold">Oct 12, 2023</span>
            </div>
            <div class="flex items-center justify-between p-4 bg-surface-container rounded-2xl border border-white/5">
              <div class="flex items-center gap-4 min-w-0 flex-1">
                <div class="w-12 h-12 rounded-full bg-emerald-400/20 flex items-center justify-center text-emerald-400 font-bold">SD</div>
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-bold text-white truncate">Stellar Dynamics</p>
                  <p class="text-xs text-emerald-400 font-medium truncate">Active • 3 projects</p>
                </div>
              </div>
              <span class="text-xs text-slate-400">Oct 11, 2023</span>
            </div>
            <div class="flex items-center justify-between p-4 bg-surface-container rounded-2xl border border-white/5">
              <div class="flex items-center gap-4 min-w-0 flex-1">
                <div class="w-12 h-12 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-400 font-bold">NG</div>
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-bold text-white truncate">Nexus Global</p>
                  <p class="text-xs text-amber-400 font-medium truncate">Payment Due • $4,200</p>
                </div>
              </div>
              <span class="text-xs text-amber-400 font-bold">Due Oct 18</span>
            </div>
          </div>
        </div>

        <div class="bg-surface-container-low rounded-3xl p-6 md:p-8 border border-white/5">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <FolderOpen class="w-5 h-5 text-primary" />
              <h3 class="text-xl font-bold text-white">Active Projects</h3>
            </div>
            <RouterLink to="/projects" class="text-sm font-semibold text-primary flex items-center gap-2">
              View All
              <ArrowRight class="w-4 h-4" />
            </RouterLink>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-surface-container p-5 rounded-2xl border border-primary/20">
              <div class="flex justify-between items-start mb-3">
                <h4 class="text-sm font-bold text-white">Nebula Dashboard</h4>
                <span class="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-lg font-bold">In Progress</span>
              </div>
              <p class="text-xs text-slate-400 mb-4">React + TypeScript analytics platform</p>
              <div class="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden mb-2">
                <div class="h-full bg-primary w-[75%] rounded-full"></div>
              </div>
              <div class="flex justify-between text-[10px] text-slate-400">
                <span>Progress</span>
                <span class="text-primary">75%</span>
              </div>
            </div>
            <div class="bg-surface-container p-5 rounded-2xl border border-white/5">
              <div class="flex justify-between items-start mb-3">
                <h4 class="text-sm font-bold text-white">Titan Mobile App</h4>
                <span class="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-1 rounded-lg font-bold">Delayed</span>
              </div>
              <p class="text-xs text-slate-400 mb-4">iOS & Android cross-platform</p>
              <div class="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden mb-2">
                <div class="h-full bg-amber-400 w-[40%] rounded-full"></div>
              </div>
              <div class="flex justify-between text-[10px] text-slate-400">
                <span>Progress</span>
                <span class="text-amber-400">40%</span>
              </div>
            </div>
            <div class="bg-surface-container p-5 rounded-2xl border border-emerald-400/20">
              <div class="flex justify-between items-start mb-3">
                <h4 class="text-sm font-bold text-white">System Core V2</h4>
                <span class="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-lg font-bold">Review</span>
              </div>
              <p class="text-xs text-slate-400 mb-4">Backend infrastructure upgrade</p>
              <div class="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden mb-2">
                <div class="h-full bg-emerald-400 w-[92%] rounded-full"></div>
              </div>
              <div class="flex justify-between text-[10px] text-slate-400">
                <span>Progress</span>
                <span class="text-emerald-400">92%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-4 space-y-8">
        <div class="bg-surface-container-low rounded-3xl p-6 md:p-8 border border-white/5">
          <div class="flex items-center gap-3 mb-6">
            <User class="w-5 h-5 text-primary" />
            <h3 class="text-xl font-bold text-white">Team Members</h3>
          </div>
          <p class="text-xs text-slate-400">8 active members • 3 departments</p>
          <div class="space-y-4 mt-4">
            <div class="flex items-center gap-4 p-4 bg-surface-container rounded-2xl border border-primary/20">
              <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">MT</div>
              <div>
                <p class="text-sm font-bold text-white">Marcus T.</p>
                <p class="text-xs text-primary font-medium">Sr. Developer</p>
              </div>
            </div>
            <div class="flex items-center gap-4 p-4 bg-surface-container rounded-2xl border border-tertiary/20">
              <div class="w-12 h-12 rounded-xl bg-tertiary/10 flex items-center justify-center text-tertiary">LV</div>
              <div>
                <p class="text-sm font-bold text-white">Lila V.</p>
                <p class="text-xs text-tertiary font-medium">UI Designer</p>
              </div>
            </div>
            <div class="flex items-center gap-4 p-4 bg-surface-container rounded-2xl border border-secondary/20">
              <div class="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">JS</div>
              <div>
                <p class="text-sm font-bold text-white">John S.</p>
                <p class="text-xs text-secondary font-medium">Project Lead</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import {
  Plus,
  Users,
  FolderOpen,
  DollarSign,
  CheckSquare,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Bell,
  UserPlus,
  FilePlus,
  Receipt,
  Download,
  ArrowRight,
  User,
} from 'lucide-vue-next'

const revenueBars = [
  { label: 'Jan', height: 45, isCurrent: false },
  { label: 'Feb', height: 62, isCurrent: false },
  { label: 'Mar', height: 55, isCurrent: false },
  { label: 'Apr', height: 78, isCurrent: false },
  { label: 'May', height: 68, isCurrent: false },
  { label: 'Jun', height: 92, isCurrent: true },
]
</script>