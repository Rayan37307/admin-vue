<template>
  <div class="space-y-8 p-8">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- Left Column: Upload Area -->
      <div class="col-span-12 lg:col-span-7 space-y-8">
        <section class="bg-surface-container-low rounded-2xl p-1 relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>
          <div class="border-2 border-dashed border-white/30 rounded-xl p-12 text-center hover:border-primary/50 hover:bg-surface-container/50 transition-all">
            <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Upload class="w-8 h-8 text-primary" />
            </div>
            <h3 class="text-xl font-semibold mb-2">Drag and drop files here</h3>
            <p class="text-slate-400 text-sm mb-8 max-w-xs mx-auto">Upload images, documents, or brand assets up to 128 MB each (up to 5 files).</p>
            <button class="bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm tracking-wide uppercase shadow-lg hover:scale-[1.02] active:scale-95 transition-all">
              Browse Files
            </button>
          </div>
        </section>

        <section class="bg-surface-container rounded-2xl p-6 shadow-xl">
          <div class="flex items-center justify-between mb-6">
            <h4 class="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Selected Items (2)</h4>
          </div>
          <div class="space-y-4">
            <div class="flex items-center gap-4 p-4 rounded-xl bg-surface-bright/20 border border-white/10 hover:bg-surface-bright/40 transition-all">
              <div class="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center">
                <Image class="w-5 h-5 text-primary" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold truncate">hero-banner-v2.png</p>
                <p class="text-xs text-slate-400">PNG • 4.2 MB</p>
              </div>
              <div class="w-24 bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                <div class="bg-gradient-to-r from-primary to-primary-container h-full w-full"></div>
              </div>
              <button class="text-slate-500 hover:text-rose-500 transition-colors p-2">
                <X class="w-4 h-4" />
              </button>
            </div>
            <div class="flex items-center gap-4 p-4 rounded-xl bg-surface-bright/20 border border-white/10 hover:bg-surface-bright/40 transition-all">
              <div class="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center">
                <FileText class="w-5 h-5 text-tertiary" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold truncate">project-brief-final.pdf</p>
                <p class="text-xs text-slate-400">PDF • 1.8 MB</p>
              </div>
              <div class="w-24 bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                <div class="bg-gradient-to-r from-primary to-primary-container h-full w-[65%]"></div>
              </div>
              <button class="text-slate-500 hover:text-rose-500 transition-colors p-2">
                <X class="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      </div>

      <!-- Right Column: Form Details -->
      <div class="col-span-12 lg:col-span-5 space-y-8">
        <section class="bg-surface-container rounded-2xl p-8 shadow-xl">
          <div class="flex items-center gap-2 mb-8">
            <div class="w-1 h-4 bg-primary rounded-full"></div>
            <h4 class="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Organization & Classification</h4>
          </div>
          <div class="space-y-6">
            <div>
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Display Name</label>
              <input class="w-full bg-surface-container-low rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary/20" placeholder="hero-banner-v2" type="text" />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Project</label>
              <select class="w-full bg-surface-container-low rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer">
                <option>Stellar Revamp 2024</option>
                <option>Internal Assets</option>
                <option>Client: Nike Global</option>
              </select>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">File Type</label>
                <select class="w-full bg-surface-container-low rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer">
                  <option>Asset</option>
                  <option>Document</option>
                  <option>Design</option>
                </select>
              </div>
              <div>
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Status</label>
                <select class="w-full bg-surface-container-low rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer">
                  <option>Final</option>
                  <option>Draft</option>
                  <option>Internal</option>
                </select>
              </div>
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Description (Optional)</label>
              <textarea class="w-full bg-surface-container-low rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary/20 resize-none" placeholder="Add a brief note about these files..." rows="3"></textarea>
            </div>
          </div>
        </section>

        <section class="bg-surface-container-low rounded-2xl p-8 border border-white/5">
          <div class="flex items-center gap-2 mb-8">
            <div class="w-1 h-4 bg-tertiary rounded-full"></div>
            <h4 class="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Team Access</h4>
          </div>
          <div class="space-y-6">
            <div class="flex flex-wrap gap-3">
              <div class="relative">
                <div class="w-10 h-10 rounded-full bg-blue-400/20 border-2 border-primary"></div>
                <div class="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white rounded-full flex items-center justify-center">
                  <Check class="w-3 h-3" />
                </div>
              </div>
              <div class="relative">
                <div class="w-10 h-10 rounded-full bg-emerald-400/20 border-2 border-transparent"></div>
              </div>
              <div class="relative">
                <div class="w-10 h-10 rounded-full bg-purple-400/20 border-2 border-primary"></div>
                <div class="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white rounded-full flex items-center justify-center">
                  <Check class="w-3 h-3" />
                </div>
              </div>
              <button class="w-10 h-10 rounded-full border-2 border-dashed border-white/40 flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary transition-all">
                <Plus class="w-4 h-4" />
              </button>
            </div>
            <div class="flex items-center justify-between p-4 bg-surface-container rounded-xl">
              <div class="flex items-center gap-3">
                <LockOpen class="w-5 h-5 text-tertiary" />
                <div>
                  <p class="text-sm font-semibold text-white">Visibility</p>
                  <p class="text-xs text-slate-400">Internal Team Only</p>
                </div>
              </div>
              <div class="w-10 h-5 bg-primary/20 rounded-full relative cursor-pointer">
                <div class="absolute right-1 top-1 w-3 h-3 bg-primary rounded-full"></div>
              </div>
            </div>
          </div>
        </section>

        <div class="flex gap-4 pt-4">
          <button class="flex-1 bg-surface-container-highest/50 text-slate-400 py-4 rounded-xl font-bold text-sm uppercase hover:bg-surface-container-highest transition-all">
            Discard
          </button>
          <button class="flex-[2] bg-primary text-white py-4 rounded-xl font-bold text-sm uppercase shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
            <CloudUpload class="w-5 h-5" />
            Upload & Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Upload,
  Image,
  FileText,
  X,
  Check,
  Plus,
  LockOpen,
  CloudUpload,
} from 'lucide-vue-next'
</script>