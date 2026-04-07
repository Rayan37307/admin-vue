<template>
  <div class="min-h-screen flex bg-surface items-center justify-center p-8">
    <div class="w-full max-w-lg space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <!-- Logo -->
      <div class="flex items-center justify-center gap-3">
        <div class="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
          <span class="text-white font-black text-2xl space-font">X</span>
        </div>
        <h1 class="text-2xl font-bold text-white tracking-tight font-headline">Xenon OS</h1>
      </div>

      <!-- Shield Icon -->
      <div class="flex justify-center">
        <div class="w-24 h-24 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <ShieldAlert class="w-12 h-12 text-red-400" />
        </div>
      </div>

      <!-- Error Message -->
      <div class="space-y-4 text-center">
        <h2 class="text-3xl font-bold text-white font-headline">Access Denied</h2>
        <p class="text-slate-400 text-base outfit leading-relaxed">
          This area is restricted to <strong class="text-white">administrators only</strong>.
          Your account does not have the required permissions to access the admin panel.
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="space-y-4 pt-4">
        <RouterLink
          to="/login"
          class="w-full flex items-center justify-center gap-2 bg-primary hover:bg-[#5355e1] text-white py-4 rounded-2xl font-bold text-[11px] uppercase tracking-[0.2em] transition-all shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:-translate-y-0.5 group ubuntu"
        >
          Return to Login
          <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </RouterLink>

        <p class="text-center text-xs text-slate-500 outfit">
          If you believe this is an error, contact your system administrator.
        </p>
      </div>

      <!-- Security Info -->
      <div class="flex items-center justify-center gap-2 pt-6 text-[10px] text-slate-500 uppercase tracking-widest font-bold ubuntu">
        <div class="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
        Security event logged
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ShieldAlert, ArrowRight } from 'lucide-vue-next'
</script>
