<template>
  <div class="space-y-8 p-8">
    <div class="flex justify-between items-end">
      <div>
        <h1 class="text-4xl font-light text-white">Files</h1>
        <p class="text-slate-400">File management and storage</p>
      </div>
      <button @click="uploadFile" class="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2">
        <Upload class="w-4 h-4" />
        Upload Files
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-surface-container-low rounded-3xl p-6">
        <p class="text-[10px] text-slate-400 uppercase tracking-widest">Total Files</p>
        <h3 class="text-3xl font-bold text-white mt-2">2,847</h3>
      </div>
      <div class="bg-surface-container-low rounded-3xl p-6">
        <p class="text-[10px] text-slate-400 uppercase tracking-widest">Storage Used</p>
        <h3 class="text-3xl font-bold text-white mt-2">48.2 GB</h3>
      </div>
      <div class="bg-surface-container-low rounded-3xl p-6">
        <p class="text-[10px] text-slate-400 uppercase tracking-widest">Shared Files</p>
        <h3 class="text-3xl font-bold text-white mt-2">124</h3>
      </div>
    </div>

    <div class="bg-surface-container-low rounded-3xl overflow-hidden">
      <table class="w-full text-left">
        <thead class="border-b border-white/5">
          <tr>
            <th class="px-6 py-5 text-xs uppercase tracking-widest text-slate-400">Name</th>
            <th class="px-6 py-5 text-xs uppercase tracking-widest text-slate-400">Size</th>
            <th class="px-6 py-5 text-xs uppercase tracking-widest text-slate-400">Modified</th>
            <th class="px-6 py-5 text-xs uppercase tracking-widest text-slate-400 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/5">
          <tr v-for="i in 8" :key="i" class="hover:bg-surface-container transition-colors cursor-pointer" @click="openFile(i)">
            <td class="px-6 py-5">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <File class="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p class="text-white font-medium">Document {{ i }}.pdf</p>
                  <p class="text-xs text-slate-400">PDF Document</p>
                </div>
              </div>
            </td>
            <td class="px-6 py-5 text-slate-400">{{ (i * 0.5).toFixed(1) }} MB</td>
            <td class="px-6 py-5 text-slate-400">Dec {{ 10 + i }}, 2023</td>
            <td class="px-6 py-5 text-right">
              <button class="p-2 hover:text-primary"><Download class="w-4 h-4" /></button>
              <button class="p-2 hover:text-primary"><Trash2 class="w-4 h-4" /></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Upload, File, Download as DownloadIcon, Trash2 } from 'lucide-vue-next'

const router = useRouter()

function openFile(id: number) {
  router.push(`/files/details?id=${id}`)
}

function uploadFile() {
  router.push('/files/details')
}
</script>