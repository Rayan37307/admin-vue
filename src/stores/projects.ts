import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiClient from '../api/client'

export interface Project {
  id: number
  name: string
  status: string
}

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref<Project[]>([])
  const loading = ref(false)

  async function fetchProjects() {
    loading.value = true
    try {
      const response = await apiClient.get('/projects')
      projects.value = response.data.projects || response.data.data || []
    } catch (e) {
      console.error('Failed to fetch projects', e)
    } finally {
      loading.value = false
    }
  }

  return {
    projects,
    loading,
    fetchProjects,
  }
})