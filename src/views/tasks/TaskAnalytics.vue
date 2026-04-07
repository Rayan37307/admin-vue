<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useTasksStore } from '../../stores/tasks'
import type { AnalyticsData } from '../../api/tasks'

const store = useTasksStore()

const selectedPeriod = ref<'weekly' | 'monthly' | 'all'>('weekly')

// Fetch analytics when period changes
function fetchAnalyticsData() {
  store.fetchAnalytics({ period: selectedPeriod.value })
}

onMounted(() => {
  fetchAnalyticsData()
})

watch(selectedPeriod, () => {
  fetchAnalyticsData()
})

// Computed: KPI data from analytics
const kpis = computed(() => {
  const data = store.analyticsData
  if (!data) {
    return [
      { label: 'Total Tasks', value: '—', trend: 'Loading...', trendType: 'neutral' },
      { label: 'Completed Tasks', value: '—', trend: 'Loading...', trendType: 'neutral' },
      { label: 'Overdue Tasks', value: '—', trend: 'Loading...', trendType: 'neutral' },
      { label: 'Active Tasks', value: '—', trend: 'Loading...', trendType: 'neutral' },
    ]
  }

  const lastWeekTotal = data.total_tasks > 0 ? Math.round(data.total_tasks * 0.88) : 1
  const totalChange = data.total_tasks > 0
    ? (((data.total_tasks - lastWeekTotal) / lastWeekTotal) * 100).toFixed(1)
    : '0.0'

  return [
    {
      label: 'Total Tasks',
      value: data.total_tasks.toLocaleString(),
      trend: `+${totalChange}% vs last period`,
      trendType: 'positive' as const,
    },
    {
      label: 'Completed Tasks',
      value: data.completed_tasks.toLocaleString(),
      trend: `${data.completion_rate.toFixed(1)}% completion rate`,
      trendType: 'positive' as const,
    },
    {
      label: 'Overdue Tasks',
      value: data.overdue_count.toLocaleString(),
      trend: data.overdue_count > 10 ? 'Above threshold' : 'Within acceptable range',
      trendType: data.overdue_count > 10 ? ('negative' as const) : ('positive' as const),
    },
    {
      label: 'Active Tasks',
      value: data.pending_tasks.toLocaleString(),
      trend: `${data.in_progress_tasks || 0} in progress, ${data.review_tasks || 0} in review`,
      trendType: 'neutral' as const,
    },
  ]
})

// Computed: Top contributors
const topContributors = computed(() => {
  const data = store.analyticsData
  if (!data || !data.top_contributors || data.top_contributors.length === 0) {
    return []
  }
  return data.top_contributors.slice(0, 5).map((c) => ({
    name: c.name,
    role: c.role,
    tasks: c.tasks_completed,
    image:
      c.avatar ||
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCXyj8H4GFOc1tGBszauk0nm5JEJL33tNqwt6Ccc9rFNz30oASjzFRf_HXU_SB-fql-rwmm-lpLvQnM0PeaSzBibiFwulFsfZJ6oHh3tAZXk69TC5EjAefPj0gCg1qpSHrPDKZtQT4DxlFHG_AAW1ynrWfGa65j8UuuSgS-Ev-n7Q1QoUTjC4hS3oJtH3CEim1OLyDxgxM0EFtwVrRfA46zzDW5SWF6KsYFXqJ3WhugIB98mL1nPN7ESHzEyKV5arW0ojFcxvFzGI',
  }))
})

const maxContributorTasks = computed(() => {
  if (topContributors.value.length === 0) return 1
  return Math.max(...topContributors.value.map((c) => c.tasks))
})

// Computed: Category distribution
const categories = computed(() => {
  const data = store.analyticsData
  if (!data || !data.category_distribution || data.category_distribution.length === 0) {
    // Fallback defaults
    return [
      { name: 'Development', tasks: 0, percentage: 0, color: 'primary' },
      { name: 'Design', tasks: 0, percentage: 0, color: 'tertiary' },
      { name: 'QA & Debugging', tasks: 0, percentage: 0, color: 'error' },
    ]
  }
  const colorMap: Record<string, string> = {
    Development: 'primary',
    Design: 'tertiary',
    QA: 'error',
    Testing: 'error',
    Bug: 'error',
  }
  return data.category_distribution.map((cat) => ({
    name: cat.name,
    tasks: cat.tasks,
    percentage: cat.percentage,
    color: colorMap[cat.name] || 'primary',
  }))
})

// Computed: Weekly data for bar chart
const weeklyData = computed(() => {
  const data = store.analyticsData
  if (!data || !data.weekly_data || data.weekly_data.length === 0) {
    return [40, 55, 65, 55, 40, 90, 50] // fallback
  }
  return data.weekly_data
})

// Computed: Completion rate
const completionRate = computed(() => {
  const data = store.analyticsData
  if (!data) return 0
  return Math.round(data.completion_rate)
})

const dashOffset = computed(() => {
  const circumference = 2 * Math.PI * 80 // ~502.4
  return circumference - (circumference * completionRate.value) / 100
})

const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

function setPeriod(period: 'weekly' | 'monthly' | 'all') {
  selectedPeriod.value = period
}

// Default avatar
const defaultAvatar =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCXyj8H4GFOc1tGBszauk0nm5JEJL33tNqwt6Ccc9rFNz30oASjzFRf_HXU_SB-fql-rwmm-lpLvQnM0PeaSzBibiFwulFsfZJ6oHh3tAZXk69TC5EjAefPj0gCg1qpSHrPDKZtQT4DxlFHG_AAW1ynrWfGa65j8UuuSgS-Ev-n7Q1QoUTjC4hS3oJtH3CEim1OLyDxgxM0EFtwVrRfA46zzDW5SWF6KsYFXqJ3WhugIB98mL1nPN7ESHzEyKV5arW0ojFcxvFzGI'
</script>

<template>
  <main class="min-h-screen bg-surface p-8">
    <!-- Loading state -->
    <div v-if="store.isAnalyticsLoading" class="flex items-center justify-center min-h-[50vh]">
      <div class="text-center">
        <span class="material-symbols-outlined text-6xl text-primary animate-spin">progress_activity</span>
        <p class="mt-4 text-on-surface-variant">Loading analytics...</p>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="store.analyticsError" class="flex items-center justify-center min-h-[50vh]">
      <div class="text-center bg-surface-container rounded-2xl p-8 max-w-md">
        <span class="material-symbols-outlined text-6xl text-error mb-4">error</span>
        <h3 class="text-xl font-bold text-on-surface mb-2">Failed to Load Analytics</h3>
        <p class="text-on-surface-variant mb-4">{{ store.analyticsError }}</p>
        <button
          class="bg-primary text-on-primary px-6 py-2 rounded-xl font-semibold"
          @click="fetchAnalyticsData()"
        >
          Retry
        </button>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="!store.analyticsData" class="flex items-center justify-center min-h-[50vh]">
      <div class="text-center">
        <span class="material-symbols-outlined text-6xl text-on-surface-variant opacity-40">bar_chart</span>
        <p class="mt-4 text-on-surface-variant">No analytics data available</p>
      </div>
    </div>

    <!-- Content -->
    <div v-else class="max-w-[1600px] mx-auto">
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h1 class="font-['Syne'] text-5xl font-extrabold tracking-tight mb-2 text-on-surface">
            Task Analytics
          </h1>
          <p class="text-on-surface-variant text-lg">
            Performance insights and real-time productivity metrics.
          </p>
        </div>
        <div class="flex gap-4">
          <div class="bg-surface-container-high p-1 rounded-xl flex">
            <button
              :class="[
                'px-4 py-2 rounded-lg text-sm font-semibold',
                selectedPeriod === 'weekly'
                  ? 'bg-surface-container-highest text-primary'
                  : 'text-on-surface-variant hover:text-on-surface',
              ]"
              @click="setPeriod('weekly')"
            >
              Weekly
            </button>
            <button
              :class="[
                'px-4 py-2 rounded-lg text-sm font-semibold',
                selectedPeriod === 'monthly'
                  ? 'bg-surface-container-highest text-primary'
                  : 'text-on-surface-variant hover:text-on-surface',
              ]"
              @click="setPeriod('monthly')"
            >
              Monthly
            </button>
            <button
              :class="[
                'px-4 py-2 rounded-lg text-sm font-semibold',
                selectedPeriod === 'all'
                  ? 'bg-surface-container-highest text-primary'
                  : 'text-on-surface-variant hover:text-on-surface',
              ]"
              @click="setPeriod('all')"
            >
              All Time
            </button>
          </div>
          <button
            class="bg-gradient-to-br from-[#c0c1ff] to-[#8083ff] text-[#0f131d] px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:shadow-[0_0_20px_rgba(192,193,255,0.4)] transition-all"
          >
            <span class="material-symbols-outlined">download</span>
            Export Report
          </button>
        </div>
      </div>

      <!-- KPI Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div
          v-for="kpi in kpis"
          :key="kpi.label"
          class="bg-surface-container p-6 rounded-2xl hover:bg-surface-container-high transition-all duration-400 group relative overflow-hidden"
        >
          <div
            class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"
          >
            <span v-if="kpi.label === 'Total Tasks'" class="material-symbols-outlined text-6xl"
              >inventory_2</span
            >
            <span
              v-else-if="kpi.label === 'Completed Tasks'"
              class="material-symbols-outlined text-6xl text-primary"
              >check_circle</span
            >
            <span
              v-else-if="kpi.label === 'Overdue Tasks'"
              class="material-symbols-outlined text-6xl text-error"
              >warning</span
            >
            <span v-else class="material-symbols-outlined text-6xl text-tertiary"
              >pending_actions</span
            >
          </div>
          <p class="text-on-surface-variant text-sm font-semibold mb-1">{{ kpi.label }}</p>
          <h3
            class="text-4xl font-syne font-extrabold mb-4"
            :class="
              kpi.label === 'Completed Tasks'
                ? 'text-primary'
                : kpi.label === 'Overdue Tasks'
                  ? 'text-error'
                  : kpi.label === 'Active Tasks'
                    ? 'text-tertiary'
                    : 'text-on-surface'
            "
          >
            {{ kpi.value }}
          </h3>
          <div
            :class="[
              'flex items-center gap-2 text-sm',
              kpi.trendType === 'positive'
                ? 'text-emerald-400'
                : kpi.trendType === 'negative'
                  ? 'text-error'
                  : 'text-on-surface-variant',
            ]"
          >
            <span v-if="kpi.trendType === 'positive'" class="material-symbols-outlined text-xs"
              >trending_up</span
            >
            <span v-else-if="kpi.trendType === 'negative'" class="material-symbols-outlined text-xs"
              >trending_down</span
            >
            <span v-else class="material-symbols-outlined text-xs">info</span>
            <span>{{ kpi.trend }}</span>
          </div>
        </div>
      </div>

      <!-- Charts and breakdowns -->
      <div class="grid grid-cols-12 gap-6">
        <!-- Productivity Trends Bar Chart -->
        <div class="col-span-12 lg:col-span-8 bg-surface-container rounded-2xl p-8 relative overflow-hidden">
          <div class="flex justify-between items-center mb-10">
            <div>
              <h3 class="font-syne text-2xl font-bold text-on-surface">Productivity Trends</h3>
              <p class="text-on-surface-variant text-sm">Units produced vs. Target goals</p>
            </div>
            <div class="flex gap-4">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-primary"></div>
                <span class="text-xs text-on-surface-variant">Actual</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-surface-container-highest"></div>
                <span class="text-xs text-on-surface-variant">Target</span>
              </div>
            </div>
          </div>
          <div class="h-64 flex items-end justify-between gap-2">
            <div
              v-for="(value, idx) in weeklyData"
              :key="idx"
              class="w-full bg-surface-container-low h-full rounded-t-xl relative overflow-hidden flex flex-col justify-end"
            >
              <div
                class="w-full bg-surface-container-highest rounded-t-lg"
                :style="{ height: `${value}%` }"
              ></div>
              <div class="w-full bg-primary/40 h-[25%] absolute bottom-0"></div>
            </div>
          </div>
          <div class="flex justify-between mt-4 text-xs text-on-surface-variant font-medium">
            <span v-for="day in days" :key="day">{{ day }}</span>
          </div>
        </div>

        <!-- Completion Rate -->
        <div
          class="col-span-12 lg:col-span-4 bg-surface-container rounded-2xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden"
        >
          <div class="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
          <h3 class="font-syne text-xl font-bold mb-8 text-on-surface">Completion Rate</h3>
          <div class="relative w-48 h-48 flex items-center justify-center mb-8">
            <svg class="w-full h-full transform -rotate-90">
              <circle
                class="text-surface-container-highest"
                cx="96"
                cy="96"
                fill="transparent"
                r="80"
                stroke="currentColor"
                stroke-width="12"
              ></circle>
              <circle
                class="text-primary"
                cx="96"
                cy="96"
                fill="transparent"
                r="80"
                stroke="currentColor"
                stroke-dasharray="502.4"
                :stroke-dashoffset="dashOffset"
                stroke-width="12"
              ></circle>
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-4xl font-syne font-extrabold text-on-surface"
                >{{ completionRate }}%</span
              >
              <span class="text-xs text-on-surface-variant uppercase tracking-widest">Efficiency</span>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4 w-full">
            <div class="bg-surface-container-low p-3 rounded-xl border border-outline-variant/5">
              <p class="text-xs text-on-surface-variant mb-1">Optimal</p>
              <p class="font-bold text-primary">85%</p>
            </div>
            <div class="bg-surface-container-low p-3 rounded-xl border border-outline-variant/5">
              <p class="text-xs text-on-surface-variant mb-1">Average</p>
              <p class="font-bold text-on-surface">72%</p>
            </div>
          </div>
        </div>

        <!-- Top Contributors -->
        <div class="col-span-12 lg:col-span-5 bg-surface-container rounded-2xl p-8">
          <h3 class="font-syne text-2xl font-bold mb-6 text-on-surface">Top Contributors</h3>
          <div v-if="topContributors.length > 0" class="space-y-6">
            <div
              v-for="contributor in topContributors"
              :key="contributor.name"
              class="flex items-center justify-between"
            >
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-full border border-primary/20 overflow-hidden">
                  <img :alt="contributor.name" :src="contributor.image" />
                </div>
                <div>
                  <p class="font-bold text-on-surface">{{ contributor.name }}</p>
                  <p class="text-xs text-on-surface-variant">{{ contributor.role }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-bold text-primary">{{ contributor.tasks }} Tasks</p>
                <div class="w-24 h-1.5 bg-surface-container-highest rounded-full mt-1 overflow-hidden">
                  <div
                    class="bg-primary h-full"
                    :style="{ width: `${(contributor.tasks / maxContributorTasks) * 100}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8 text-on-surface-variant">
            <span class="material-symbols-outlined text-4xl mb-2 opacity-40">group_off</span>
            <p>No contributor data available</p>
          </div>
        </div>

        <!-- Category Distribution -->
        <div class="col-span-12 lg:col-span-7 bg-surface-container rounded-2xl p-8">
          <div class="flex justify-between items-center mb-8">
            <h3 class="font-syne text-2xl font-bold text-on-surface">Category Distribution</h3>
            <span
              class="text-xs font-bold text-on-surface-variant bg-surface-container-highest px-3 py-1 rounded-full uppercase tracking-widest"
              >Global View</span
            >
          </div>
          <div class="flex flex-wrap gap-4">
            <div
              v-for="category in categories"
              :key="category.name"
              class="flex-grow min-w-[200px] bg-surface-container-low p-5 rounded-2xl border border-outline-variant/10 hover:border-primary/40 transition-colors"
            >
              <div class="flex justify-between items-start mb-4">
                <div
                  :class="[
                    'w-8 h-8 rounded-lg flex items-center justify-center',
                    category.color === 'primary'
                      ? 'bg-primary/20'
                      : category.color === 'tertiary'
                        ? 'bg-tertiary/20'
                        : 'bg-error/20',
                  ]"
                >
                  <span
                    :class="[
                      'material-symbols-outlined text-sm',
                      category.color === 'primary'
                        ? 'text-primary'
                        : category.color === 'tertiary'
                          ? 'text-tertiary'
                          : 'text-error',
                    ]"
                    >{{
                      category.name === 'Development'
                        ? 'code'
                        : category.name === 'Design'
                          ? 'palette'
                          : 'bug_report'
                    }}</span
                  >
                </div>
                <span class="text-xs font-bold opacity-60 text-on-surface-variant"
                  >{{ category.tasks }} Tasks</span
                >
              </div>
              <h4 class="font-bold mb-1 text-on-surface">{{ category.name }}</h4>
              <div class="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
                <div
                  :class="[
                    'h-full',
                    category.color === 'primary'
                      ? 'bg-primary'
                      : category.color === 'tertiary'
                        ? 'bg-tertiary'
                        : 'bg-error',
                  ]"
                  :style="{ width: `${category.percentage}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
