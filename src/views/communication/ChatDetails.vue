<template>
  <div class="p-8 lg:p-10 max-w-[1600px] mx-auto">
    <header class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
      <div class="flex items-center gap-5">
        <div class="relative">
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-800 flex items-center justify-center text-2xl font-bold shadow-lg shadow-indigo-500/20">
            <Network class="w-8 h-8 text-white" />
          </div>
          <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-surface rounded-full"></div>
        </div>
        <div>
          <div class="flex items-center gap-3">
            <h1 class="text-3xl font-light text-white">Alpha-Node Core</h1>
            <span class="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-widest border border-indigo-500/20">P2P Hub</span>
          </div>
          <div class="flex items-center gap-4 mt-2 text-sm text-slate-400">
            <span class="flex items-center gap-1.5"><Users class="w-4 h-4" /> 12 Participants</span>
            <span class="flex items-center gap-1.5"><Clock class="w-4 h-4" /> Active 2m ago</span>
            <span class="flex items-center gap-1.5 text-green-400"><ShieldCheck class="w-4 h-4" /> Encrypted</span>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <button class="bg-surface-container-low border border-white/10 hover:bg-white/10 px-4 py-2.5 rounded-xl transition-all flex items-center gap-2">
          <Settings class="w-4 h-4" />
          Control Settings
        </button>
        <button class="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 font-bold">
          <Terminal class="w-4 h-4" />
          New Protocol
        </button>
      </div>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
      <aside class="lg:col-span-3 space-y-6">
        <section class="bg-surface-container rounded-2xl p-5">
          <h3 class="text-sm font-bold mb-4 tracking-wider text-indigo-300 uppercase">PARTICIPANTS</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between group">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">AX</div>
                <div>
                  <p class="text-sm font-semibold text-white">Admin_Xenon</p>
                  <p class="text-[10px] text-indigo-400">Lead Architect</p>
                </div>
              </div>
              <CheckCircle class="w-4 h-4 text-emerald-400" />
            </div>
            <div class="flex items-center justify-between group">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold">NP</div>
                <div>
                  <p class="text-sm font-semibold text-white">Nova_Protocol</p>
                  <p class="text-[10px] text-slate-400">Read/Write</p>
                </div>
              </div>
            </div>
            <div class="flex items-center justify-between group opacity-60">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 font-bold">VW</div>
                <div>
                  <p class="text-sm font-semibold text-white">Void_Walker</p>
                  <p class="text-[10px] text-rose-400">Muted</p>
                </div>
              </div>
              <VolumeX class="w-4 h-4 text-rose-500" />
            </div>
          </div>
          <button class="w-full mt-6 py-2 border-t border-white/10 text-xs text-slate-400 hover:text-indigo-400 transition-colors">Manage Permissions</button>
        </section>

        <section class="bg-surface-container rounded-2xl p-5 relative overflow-hidden">
          <div class="absolute top-0 right-0 w-24 h-24 bg-indigo-600/5 blur-2xl -mr-12 -mt-12"></div>
          <h3 class="text-sm font-bold mb-4 tracking-wider text-indigo-300 uppercase">PROTOCOL RULES</h3>
          <div class="space-y-4">
            <div class="p-3 rounded-xl bg-surface-container-low">
              <p class="text-xs text-indigo-300 mb-1">Access Level</p>
              <p class="text-sm font-medium text-white">Restricted: Xenon-42</p>
            </div>
            <div class="p-3 rounded-xl bg-surface-container-low">
              <p class="text-xs text-slate-400 mb-1">Expiry Date</p>
              <p class="text-sm font-medium text-white">Infinite Session</p>
            </div>
            <div class="flex items-center gap-2 text-xs text-slate-400">
              <Link class="w-3 h-3 text-emerald-400" />
              Linked to Project: <span class="text-indigo-300 font-medium italic underline underline-offset-4 cursor-pointer">X-Gate-24</span>
            </div>
          </div>
        </section>
      </aside>

      <div class="lg:col-span-6 space-y-6">
        <nav class="flex items-center justify-between bg-surface-container/60 backdrop-blur-md p-2 rounded-2xl">
          <div class="flex items-center gap-1">
            <button class="p-3 hover:bg-surface-container-low rounded-xl text-slate-400 hover:text-indigo-400 transition-all flex items-center gap-2 text-sm">
              <Trash2 class="w-4 h-4" /> Delete
            </button>
            <button class="p-3 hover:bg-surface-container-low rounded-xl text-slate-400 hover:text-indigo-400 transition-all flex items-center gap-2 text-sm">
              <EyeOff class="w-4 h-4" /> Hide
            </button>
          </div>
          <div class="flex items-center gap-1">
            <button class="p-3 hover:bg-surface-container-low rounded-xl text-slate-400 hover:text-rose-400 transition-all flex items-center gap-2 text-sm">
              <Flag class="w-4 h-4" /> Flag
            </button>
            <button class="p-3 hover:bg-surface-container-low rounded-xl text-slate-400 hover:text-emerald-400 transition-all flex items-center gap-2 text-sm">
              <RotateCcw class="w-4 h-4" /> Restore
            </button>
          </div>
        </nav>

        <section class="bg-surface-container rounded-2xl p-6 min-h-[500px] flex flex-col">
          <div class="flex-1 space-y-8">
            <div class="flex gap-4">
              <div class="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">AX</div>
              <div class="flex-1">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-sm font-bold text-indigo-300">Admin_Xenon</span>
                  <span class="text-[10px] text-slate-500">14:22:18 · DELIVERED</span>
                </div>
                <div class="bg-surface-container-low p-4 rounded-2xl rounded-tl-none max-w-[85%]">
                  <p class="text-sm leading-relaxed text-white">System scan complete. Initializing node cluster 04. Please verify the integrity hashes before proceeding with the P2P handshake.</p>
                </div>
              </div>
            </div>

            <div class="flex gap-4 flex-row-reverse">
              <div class="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary font-bold shrink-0">NP</div>
              <div class="flex-1">
                <div class="flex items-center flex-row-reverse justify-between mb-1">
                  <span class="text-sm font-bold text-white">Nova_Protocol</span>
                  <span class="text-[10px] text-slate-500">14:24:05 · READ</span>
                </div>
                <div class="bg-primary/10 ml-auto p-4 rounded-2xl rounded-tr-none border border-primary/20 max-w-[85%]">
                  <p class="text-sm leading-relaxed text-white">Copy that. Running hash verification now. Node 04-A is reporting stable telemetry.</p>
                  <div class="mt-3 flex items-center gap-3 bg-surface-container-high p-2.5 rounded-lg">
                    <FileText class="w-4 h-4 text-indigo-400" />
                    <div class="flex-1">
                      <p class="text-[10px] font-bold text-white">hash_report_v2.log</p>
                      <p class="text-[9px] text-slate-400">1.4 MB · JSON</p>
                    </div>
                    <Download class="w-4 h-4 cursor-pointer hover:text-indigo-400" />
                  </div>
                </div>
              </div>
            </div>

            <div class="flex justify-center">
              <div class="px-4 py-1.5 bg-surface-container-low rounded-full flex items-center gap-2">
                <div class="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                <span class="text-[10px] text-slate-400 uppercase tracking-widest">Protocol Override by Void_Walker</span>
              </div>
            </div>

            <div class="flex gap-4">
              <div class="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400 font-bold shrink-0 opacity-40">VW</div>
              <div class="flex-1">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-sm font-bold text-rose-400">Void_Walker (MUTED)</span>
                  <span class="text-[10px] text-slate-500">14:30:12 · FLAG_PENDING</span>
                </div>
                <div class="bg-rose-500/10 p-4 rounded-2xl rounded-tl-none max-w-[85%] blur-[0.5px]">
                  <p class="text-sm italic text-slate-400">Message flagged for rule violation: Unauthorized script injection attempt detected.</p>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-8 pt-4 border-t border-white/10">
            <div class="flex items-center gap-4 bg-surface-container-low p-2 rounded-xl">
              <button class="p-2 hover:text-indigo-400 transition-colors">
                <PlusCircle class="w-5 h-5" />
              </button>
              <input class="bg-transparent border-none focus:ring-0 w-full text-sm text-white" placeholder="Send system command or message..." type="text" />
              <button class="bg-indigo-600 p-2 px-4 rounded-lg hover:bg-indigo-500 transition-colors">
                <Send class="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </section>
      </div>

      <aside class="lg:col-span-3 space-y-6">
        <section class="bg-surface-container rounded-2xl p-5">
          <h3 class="text-sm font-bold mb-4 tracking-wider text-indigo-300 uppercase">VISIBILITY MATRIX</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <Globe class="w-4 h-4 text-slate-400" />
                <span class="text-xs text-slate-400">Public View</span>
              </div>
              <div class="w-8 h-4 bg-surface-container-highest rounded-full relative cursor-pointer">
                <div class="absolute top-0.5 left-0.5 w-3 h-3 bg-slate-400 rounded-full"></div>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3 text-indigo-400">
                <Shield class="w-4 h-4" />
                <span class="text-xs font-bold">Encrypted Archive</span>
              </div>
              <div class="w-8 h-4 bg-indigo-600 rounded-full relative cursor-pointer">
                <div class="absolute top-0.5 right-0.5 w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <FileEdit class="w-4 h-4 text-slate-400" />
                <span class="text-xs text-slate-400">Write Access</span>
              </div>
              <div class="w-8 h-4 bg-indigo-600 rounded-full relative cursor-pointer">
                <div class="absolute top-0.5 right-0.5 w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </section>

        <section class="bg-surface-container rounded-2xl p-5">
          <h3 class="text-sm font-bold mb-4 tracking-wider text-indigo-300 uppercase">ACTIVITY LOG</h3>
          <div class="space-y-5">
            <div class="flex gap-3">
              <div class="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></div>
              <div>
                <p class="text-xs font-medium text-white">Chat name modified</p>
                <p class="text-[10px] text-slate-400">Admin_Xenon · 45m ago</p>
              </div>
            </div>
            <div class="flex gap-3">
              <div class="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></div>
              <div>
                <p class="text-xs font-medium text-rose-400">Security breach attempt</p>
                <p class="text-[10px] text-slate-400">IP: 192.168.1.1 · 2h ago</p>
              </div>
            </div>
            <div class="flex gap-3">
              <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
              <div>
                <p class="text-xs font-medium text-white">New participant added</p>
                <p class="text-[10px] text-slate-400">Nova_Protocol · 5h ago</p>
              </div>
            </div>
          </div>
          <button class="w-full mt-6 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-400 hover:text-indigo-300">
            View Full History <ArrowRight class="w-3 h-3" />
          </button>
        </section>

        <section class="bg-surface-container-high rounded-2xl p-5">
          <div class="flex items-center gap-2 mb-3">
            <BarChart3 class="w-4 h-4 text-indigo-400" />
            <h3 class="text-xs font-bold tracking-wider text-slate-400 uppercase">NETWORK IMPACT</h3>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-lg font-bold text-white">1.2 TB</p>
              <p class="text-[9px] text-slate-400 uppercase">Data Flow</p>
            </div>
            <div>
              <p class="text-lg font-bold text-white">99.9%</p>
              <p class="text-[9px] text-slate-400 uppercase">Uptime</p>
            </div>
          </div>
        </section>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Network,
  Users,
  Clock,
  ShieldCheck,
  Settings,
  Terminal,
  CheckCircle,
  VolumeX,
  Link,
  Trash2,
  EyeOff,
  Flag,
  RotateCcw,
  FileText,
  Download,
  PlusCircle,
  Send,
  Globe,
  Shield,
  FileEdit,
  ArrowRight,
  BarChart3,
} from 'lucide-vue-next'
</script>