<template>
  <div class="space-y-8 pt-24 px-8 pb-12 overflow-y-auto flex flex-col gap-8">
    <section class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <span class="text-primary font-bold tracking-widest text-[10px] uppercase">Governance & Security</span>
        <h1 class="text-5xl font-light text-white mt-2">Chat Control</h1>
        <p class="text-slate-400 mt-2 max-w-md">Orchestrate communication flows and moderation protocols across all agency workspaces.</p>
      </div>
      <div class="flex space-x-3">
        <button class="flex items-center space-x-2 bg-surface-container-high hover:bg-surface-bright text-white px-5 py-2.5 rounded-xl transition-all font-medium text-sm">
          <Download class="w-4 h-4" />
          <span>Export Logs</span>
        </button>
        <button class="flex items-center space-x-2 bg-primary text-white px-6 py-2.5 rounded-xl hover:opacity-90 transition-all font-semibold text-sm shadow-lg">
          <ShieldPlus class="w-4 h-4" />
          <span>Add Rule</span>
        </button>
      </div>
    </section>

    <section class="grid grid-cols-1 md:grid-cols-12 gap-8">
      <div class="col-span-1 md:col-span-4 bg-surface-container-low rounded-2xl p-6 relative overflow-hidden">
        <div class="absolute left-0 top-1/4 bottom-1/4 w-[2px] bg-primary"></div>
        <p class="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Live Threads</p>
        <h3 class="text-3xl font-light text-white mt-2">1,284</h3>
        <div class="mt-4 flex items-center text-primary text-xs font-medium">
          <TrendingUp class="w-3 h-3 mr-1" />
          12% vs last week
        </div>
      </div>
      <div class="col-span-1 md:col-span-4 bg-surface-container-low rounded-2xl p-6 relative overflow-hidden">
        <div class="absolute left-0 top-1/4 bottom-1/4 w-[2px] bg-tertiary"></div>
        <p class="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Flagged Messages</p>
        <h3 class="text-3xl font-light text-white mt-2">24</h3>
        <div class="mt-4 flex items-center text-tertiary text-xs font-medium">
          <AlertTriangle class="w-3 h-3 mr-1" /> 3 high priority
        </div>
      </div>
      <div class="col-span-1 md:col-span-4 bg-surface-container-low rounded-2xl p-6 flex flex-col justify-between">
        <div class="flex justify-between items-center mb-4">
          <p class="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Chat Frequency (24h)</p>
          <span class="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full">Peak: 2PM</span>
        </div>
        <div class="flex items-end space-x-2 h-16">
          <div class="flex-1 bg-surface-container-highest rounded-t-sm h-[30%]"></div>
          <div class="flex-1 bg-surface-container-highest rounded-t-sm h-[50%]"></div>
          <div class="flex-1 bg-surface-container-highest rounded-t-sm h-[80%]"></div>
          <div class="flex-1 bg-primary rounded-t-sm h-[100%]"></div>
          <div class="flex-1 bg-surface-container-highest rounded-t-sm h-[90%]"></div>
          <div class="flex-1 bg-surface-container-highest rounded-t-sm h-[60%]"></div>
          <div class="flex-1 bg-surface-container-highest rounded-t-sm h-[40%]"></div>
          <div class="flex-1 bg-surface-container-highest rounded-t-sm h-[20%]"></div>
        </div>
      </div>
    </section>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div class="lg:col-span-8 space-y-8">
        <div class="bg-surface-container-low rounded-[24px] overflow-hidden">
          <div class="px-8 py-6 flex justify-between items-center border-b border-white/5">
            <h2 class="text-xl font-semibold text-white">Active Conversations</h2>
            <a class="text-xs font-bold text-primary flex items-center group" href="#">
              <span class="w-1 h-1 bg-primary rounded-full mr-2 group-hover:w-3 transition-all"></span>
              VIEW ALL
            </a>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead>
                <tr class="text-slate-400 text-[10px] uppercase tracking-widest border-b border-white/5">
                  <th class="px-8 py-4 font-bold">Participants</th>
                  <th class="px-4 py-4 font-bold">Project</th>
                  <th class="px-4 py-4 font-bold">Status</th>
                  <th class="px-8 py-4 font-bold text-right">Last Message</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                <tr class="group hover:bg-surface-bright/30 transition-colors cursor-pointer" @click="openChat(1)">
                  <td class="px-8 py-5">
                    <div class="flex -space-x-2">
                      <div class="w-8 h-8 rounded-full bg-primary/20 border-2 border-surface flex items-center justify-center text-[10px] font-bold text-primary">NL</div>
                      <div class="w-8 h-8 rounded-full bg-tertiary/20 border-2 border-surface flex items-center justify-center text-[10px] font-bold text-tertiary">SA</div>
                      <div class="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-[10px] border-2 border-surface">+3</div>
                    </div>
                  </td>
                  <td class="px-4 py-5 text-sm font-medium text-white">Nebula Cloud Infrastructure</td>
                  <td class="px-4 py-5">
                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary uppercase">Active</span>
                  </td>
                  <td class="px-8 py-5 text-right text-xs text-slate-400 italic">"We need to review the terraform scripts..."</td>
                </tr>
                <tr class="group hover:bg-surface-bright/30 transition-colors cursor-pointer" @click="openChat(2)">
                  <td class="px-8 py-5">
                    <div class="flex -space-x-2">
                      <div class="w-8 h-8 rounded-full bg-secondary/20 border-2 border-surface flex items-center justify-center text-[10px] font-bold text-secondary">VR</div>
                      <div class="w-8 h-8 rounded-full bg-emerald-400/20 border-2 border-surface flex items-center justify-center text-[10px] font-bold text-emerald-400">TB</div>
                    </div>
                  </td>
                  <td class="px-4 py-5 text-sm font-medium text-white">Vortex Branding V2</td>
                  <td class="px-4 py-5">
                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-surface-container-highest text-slate-400 uppercase">Idle</span>
                  </td>
                  <td class="px-8 py-5 text-right text-xs text-slate-400 italic">"Approved. Ready for handoff."</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="bg-surface-container-low rounded-[24px] overflow-hidden">
          <div class="px-8 py-6 flex justify-between items-center bg-rose-500/10">
            <div class="flex items-center space-x-3">
              <Flag class="w-5 h-5 text-rose-500" />
              <h2 class="text-xl font-semibold text-white">Moderation Queue</h2>
            </div>
            <span class="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">8 NEW</span>
          </div>
          <div class="p-4 space-y-4">
            <div class="p-4 bg-surface-container rounded-xl flex items-start justify-between group">
              <div class="flex space-x-4">
                <div class="bg-rose-500/20 p-2 rounded-lg self-start">
                  <ShieldOff class="w-5 h-5 text-rose-500" />
                </div>
                <div>
                  <div class="flex items-center space-x-2">
                    <p class="text-sm font-bold text-white">Alex Mercer <span class="text-xs font-normal text-slate-400">to</span> Team-Lead</p>
                    <span class="text-[10px] text-tertiary">#RestrictedWords</span>
                  </div>
                  <p class="text-sm text-slate-400 mt-1 italic">"Please send the confidential login details via [LINK REMOVED]..."</p>
                  <p class="text-[10px] text-slate-500 mt-2 uppercase tracking-tighter">Sent at 14:22 • Project: Alpha Genesis</p>
                </div>
              </div>
              <div class="flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button class="text-[10px] font-bold text-white bg-surface-container-highest hover:bg-rose-500 px-3 py-1 rounded-md transition-all">DELETE</button>
                <button class="text-[10px] font-bold text-white bg-surface-container-highest hover:bg-surface-bright px-3 py-1 rounded-md transition-all">DISMISS</button>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-surface-container-low rounded-[24px] p-8">
          <h2 class="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-6">Top Communicators</h2>
          <div class="space-y-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">SC</div>
                <div>
                  <p class="text-sm font-bold text-white">Sarah Chen</p>
                  <p class="text-[10px] text-slate-400">428 messages/wk</p>
                </div>
              </div>
              <div class="text-right">
                <div class="w-24 h-1 bg-surface-container-highest rounded-full overflow-hidden">
                  <div class="bg-primary h-full w-[85%]"></div>
                </div>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-secondary text-xs font-bold">JL</div>
                <div>
                  <p class="text-sm font-bold text-white">Jordan Lee</p>
                  <p class="text-[10px] text-slate-400">312 messages/wk</p>
                </div>
              </div>
              <div class="text-right">
                <div class="w-24 h-1 bg-surface-container-highest rounded-full overflow-hidden">
                  <div class="bg-primary h-full w-[60%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-4 space-y-8">
        <div class="bg-surface-container-low rounded-[24px] p-8 space-y-6">
          <h2 class="text-xl font-semibold text-white">Role Permissions</h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-3 bg-surface-container rounded-xl">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users class="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p class="text-sm font-bold text-white">Project Managers</p>
                  <p class="text-[10px] text-slate-400 uppercase">Global Broadcast</p>
                </div>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input checked class="sr-only peer" type="checkbox" />
                <div class="w-9 h-5 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <div class="flex items-center justify-between p-3 bg-surface-container rounded-xl">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center">
                  <UserCheck class="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <p class="text-sm font-bold text-white">QA Analysts</p>
                  <p class="text-[10px] text-slate-400 uppercase">Internal Team Only</p>
                </div>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input checked class="sr-only peer" type="checkbox" />
                <div class="w-9 h-5 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <div class="flex items-center justify-between p-3 bg-surface-container rounded-xl">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center">
                  <Shield class="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <p class="text-sm font-bold text-white">External Clients</p>
                  <p class="text-[10px] text-slate-400 uppercase">Restricted to PM</p>
                </div>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input class="sr-only peer" type="checkbox" />
                <div class="w-9 h-5 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
          <button class="p-3 border border-white/20 rounded-xl text-xs font-bold tracking-widest text-slate-400 hover:bg-surface-bright transition-all w-full">
            MANAGE OVERRIDES
          </button>
        </div>

        <div class="bg-surface-container-low rounded-[24px] p-8 border border-primary/20 relative overflow-hidden">
          <div class="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 blur-3xl rounded-full"></div>
          <h2 class="text-xl font-semibold text-white mb-6">Review Changes</h2>
          <div class="space-y-4 mb-8">
            <div class="flex items-start space-x-3">
              <CheckCircle class="w-4 h-4 text-primary mt-1" />
              <div>
                <p class="text-sm font-medium text-white">New rule: Auto-block external links</p>
                <p class="text-[10px] text-slate-400 uppercase">Applies to: All Projects</p>
              </div>
            </div>
            <div class="flex items-start space-x-3">
              <CheckCircle class="w-4 h-4 text-primary mt-1" />
              <div>
                <p class="text-sm font-medium text-white">Updated: Client role restricted</p>
                <p class="text-[10px] text-slate-400 uppercase">Status: Pending Apply</p>
              </div>
            </div>
          </div>
          <div class="flex space-x-3">
            <button class="flex-1 py-3 bg-primary text-white rounded-xl font-bold text-sm shadow-xl">Apply Changes</button>
            <button class="p-3 bg-surface-container-highest text-white rounded-xl">
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import {
  Download,
  ShieldPlus,
  TrendingUp,
  AlertTriangle,
  Flag,
  ShieldOff,
  Users,
  UserCheck,
  Shield,
  CheckCircle,
  Trash2,
} from 'lucide-vue-next'

const router = useRouter()

function openChat(id: number) {
  router.push(`/communication/chat?id=${id}`)
}
</script>