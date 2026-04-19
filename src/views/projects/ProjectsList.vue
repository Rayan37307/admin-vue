<template>
  <div class="space-y-8 p-8">
    <div class="flex flex-col md:flex-row justify-between gap-6">
      <div>
        <h1 class="text-5xl font-light text-white tracking-tight">Projects</h1>
        <p class="text-slate-400">Manage all client projects.</p>
      </div>
      <button class="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg">
        <PlusCircle class="w-5 h-5" />
        Create Project
      </button>
    </div>

    <div class="grid grid-cols-12 gap-8">
      <div class="col-span-12 lg:col-span-9 space-y-6">
        <div class="bg-surface-container-low p-4 rounded-3xl flex flex-wrap items-center gap-4">
          <div class="flex items-center gap-2 bg-surface-container px-4 py-2 rounded-2xl">
            <span class="text-xs text-slate-400 uppercase tracking-wider">Status:</span>
            <select class="bg-transparent border-none text-sm text-primary font-medium cursor-pointer">
              <option>Active</option>
              <option>Completed</option>
              <option>Pending</option>
              <option>Delayed</option>
            </select>
          </div>
          <div class="flex items-center gap-2 bg-surface-container px-4 py-2 rounded-2xl">
            <span class="text-xs text-slate-400 uppercase tracking-wider">Client:</span>
            <select class="bg-transparent border-none text-sm text-primary font-medium cursor-pointer">
              <option>All Clients</option>
              <option>Aura Dynamics</option>
              <option>Solaris Media</option>
            </select>
          </div>
          <div class="flex items-center gap-2 bg-surface-container px-4 py-2 rounded-2xl">
            <span class="text-xs text-slate-400 uppercase tracking-wider">Sort:</span>
            <select class="bg-transparent border-none text-sm text-primary font-medium cursor-pointer">
              <option>Newest First</option>
              <option>Oldest First</option>
              <option>Deadline</option>
            </select>
          </div>
          <div class="ml-auto flex items-center bg-surface-container p-1 rounded-xl">
            <button class="p-2 bg-surface text-primary rounded-lg">
              <LayoutGrid class="w-4 h-4" />
            </button>
            <button class="p-2 text-slate-400 hover:text-white">
              <List class="w-4 h-4" />
            </button>
          </div>
        </div>

        <div class="bg-surface-container-low rounded-3xl overflow-hidden">
          <table class="w-full text-left">
            <thead class="border-b border-white/5 bg-surface-container-low/50">
              <tr>
                <th class="px-6 py-5 text-xs uppercase tracking-widest text-slate-400">Project Name</th>
                <th class="px-6 py-5 text-xs uppercase tracking-widest text-slate-400">Client</th>
                <th class="px-6 py-5 text-xs uppercase tracking-widest text-slate-400">Status</th>
                <th class="px-6 py-5 text-xs uppercase tracking-widest text-slate-400">Progress</th>
                <th class="px-6 py-5 text-xs uppercase tracking-widest text-slate-400">Team</th>
                <th class="px-6 py-5 text-xs uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr class="hover:bg-surface-container transition-all cursor-pointer">
                <td class="px-6 py-5">
                  <div class="flex flex-col">
                    <span class="text-white font-medium">Lumina Rebrand</span>
                    <span class="text-xs text-slate-400">Q4 Brand Identity</span>
                  </div>
                </td>
                <td class="px-6 py-5"><span class="text-sm text-white">Aura Dynamics</span></td>
                <td class="px-6 py-5">
                  <span class="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase">Active</span>
                </td>
                <td class="px-6 py-5">
                  <div class="flex flex-col gap-1.5 w-32">
                    <div class="h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                      <div class="h-full bg-primary w-[75%] rounded-full"></div>
                    </div>
                    <span class="text-[10px] text-slate-400 font-medium">75% Complete</span>
                  </div>
                </td>
                <td class="px-6 py-5">
                  <div class="flex -space-x-2">
                    <div class="w-8 h-8 rounded-full bg-surface-container border-2 border-surface-container-low"></div>
                    <div class="w-8 h-8 rounded-full bg-surface-container border-2 border-surface-container-low"></div>
                    <div class="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-[10px] font-bold border-2 border-surface-container-low">+3</div>
                  </div>
                </td>
                <td class="px-6 py-5 text-right">
                  <button class="p-2 text-slate-400 hover:text-white">
                    <MoreHorizontal class="w-5 h-5" />
                  </button>
                </td>
              </tr>
              <tr class="hover:bg-surface-container transition-all cursor-pointer">
                <td class="px-6 py-5">
                  <div class="flex flex-col">
                    <span class="text-white font-medium">Ether Mobile App</span>
                    <span class="text-xs text-slate-400">UX Audit & UI Design</span>
                  </div>
                </td>
                <td class="px-6 py-5"><span class="text-sm text-white">Solaris Media</span></td>
                <td class="px-6 py-5">
                  <span class="px-3 py-1 rounded-full bg-tertiary/20 text-tertiary text-[10px] font-bold uppercase">Delayed</span>
                </td>
                <td class="px-6 py-5">
                  <div class="flex flex-col gap-1.5 w-32">
                    <div class="h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                      <div class="h-full bg-tertiary w-[32%] rounded-full"></div>
                    </div>
                    <span class="text-[10px] text-slate-400 font-medium">32% Complete</span>
                  </div>
                </td>
                <td class="px-6 py-5">
                  <div class="flex -space-x-2">
                    <div class="w-8 h-8 rounded-full bg-surface-container border-2 border-surface-container-low"></div>
                    <div class="w-8 h-8 rounded-full bg-surface-container border-2 border-surface-container-low"></div>
                  </div>
                </td>
                <td class="px-6 py-5 text-right">
                  <button class="p-2 text-slate-400 hover:text-white">
                    <MoreHorizontal class="w-5 h-5" />
                  </button>
                </td>
              </tr>
              <tr class="hover:bg-surface-container transition-all cursor-pointer">
                <td class="px-6 py-5">
                  <div class="flex flex-col">
                    <span class="text-white font-medium">Vantage E-comm</span>
                    <span class="text-xs text-slate-400">Custom Shopify Dev</span>
                  </div>
                </td>
                <td class="px-6 py-5"><span class="text-sm text-white">Vantage Global</span></td>
                <td class="px-6 py-5">
                  <span class="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase">Completed</span>
                </td>
                <td class="px-6 py-5">
                  <div class="flex flex-col gap-1.5 w-32">
                    <div class="h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                      <div class="h-full bg-emerald-400 w-full rounded-full"></div>
                    </div>
                    <span class="text-[10px] text-slate-400 font-medium">100% Complete</span>
                  </div>
                </td>
                <td class="px-6 py-5">
                  <div class="flex -space-x-2">
                    <div class="w-8 h-8 rounded-full bg-surface-container border-2 border-surface-container-low"></div>
                  </div>
                </td>
                <td class="px-6 py-5 text-right">
                  <button class="p-2 text-slate-400 hover:text-white">
                    <MoreHorizontal class="w-5 h-5" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="px-6 py-4 border-t border-white/5 flex items-center justify-between">
            <span class="text-xs text-slate-400">Showing 1-10 of 48 projects</span>
            <div class="flex gap-2">
              <button class="p-2 rounded-lg bg-surface-container hover:bg-surface-bright text-slate-400 transition-colors">
                <ChevronLeft class="w-4 h-4" />
              </button>
              <button class="p-2 rounded-lg bg-primary/10 text-primary text-xs font-bold px-4">1</button>
              <button class="p-2 rounded-lg bg-surface-container hover:bg-surface-bright text-slate-400 text-xs font-bold px-4 transition-colors">2</button>
              <button class="p-2 rounded-lg bg-surface-container hover:bg-surface-bright text-slate-400 transition-colors">
                <ChevronRight class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="col-span-12 lg:col-span-3 space-y-8">
        <h3 class="text-xs text-slate-400 uppercase tracking-[0.2em]">Live Insights</h3>
        <div class="bg-surface-container-low p-6 rounded-3xl relative overflow-hidden">
          <div class="absolute left-0 top-0 w-1 h-full bg-primary"></div>
          <p class="text-[10px] text-slate-400 uppercase tracking-widest">Total Projects</p>
          <span class="text-4xl font-light text-white">48</span>
          <div class="mt-4 flex items-center gap-1 text-[10px] text-primary">
            <TrendingUp class="w-3 h-3" />
            <span>12% from last month</span>
          </div>
        </div>
        <div class="bg-surface-container-low p-6 rounded-3xl relative overflow-hidden">
          <div class="absolute left-0 top-0 w-1 h-full bg-emerald-400/50"></div>
          <p class="text-[10px] text-slate-400 uppercase tracking-widest">Completed</p>
          <span class="text-4xl font-light text-white">24</span>
          <div class="mt-4 flex items-center gap-1 text-[10px] text-emerald-400">
            <CheckCircle class="w-3 h-3" />
            <span>On target</span>
          </div>
        </div>
        <div class="bg-surface-container-low p-6 rounded-3xl relative overflow-hidden">
          <div class="absolute left-0 top-0 w-1 h-full bg-tertiary/50"></div>
          <p class="text-[10px] text-slate-400 uppercase tracking-widest">Delayed</p>
          <span class="text-4xl font-light text-white">03</span>
          <div class="mt-4 flex items-center gap-1 text-[10px] text-tertiary">
            <AlertTriangle class="w-3 h-3" />
            <span>Requires attention</span>
          </div>
        </div>
        <div class="bg-surface-container-low p-6 rounded-3xl space-y-6">
          <div class="flex justify-between items-center">
            <h3 class="text-xs text-slate-400 uppercase tracking-widest">Priority Actions</h3>
            <div class="w-1 h-1 bg-primary rounded-full"></div>
          </div>
          <div class="space-y-4">
            <div class="flex items-start gap-4 cursor-pointer hover:bg-surface-bright/30 p-2 rounded-2xl transition-all">
              <div class="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center text-primary">
                <Mail class="w-4 h-4" />
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-medium text-white">Client Feedback</span>
                <span class="text-xs text-slate-400 line-clamp-1">Review Lumina brand assets.</span>
              </div>
            </div>
            <div class="flex items-start gap-4 cursor-pointer hover:bg-surface-bright/30 p-2 rounded-2xl transition-all">
              <div class="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center text-tertiary">
                <Clock class="w-4 h-4" />
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-medium text-white">Deadline Warning</span>
                <span class="text-xs text-slate-400 line-clamp-1">Ether Mobile UI due in 48h.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  PlusCircle,
  LayoutGrid,
  List,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Mail,
  Clock,
} from 'lucide-vue-next'
</script>