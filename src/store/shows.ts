import { defineStore } from 'pinia'
import { showsAPIService } from '@/services/showsApi'
import type { ShowsState } from '@/types/ShowsState'

export const useShows = defineStore('shows', {
  state: (): ShowsState => ({
    shows: [],
    isRequestLoading: false,
    hasShows: false
  }),
  getters: {
    activeCustomersCount({ shows }): number {
      return 0
    }
  },
  actions: {
    async fetchShows(): Promise<void> {
      this.isRequestLoading = true
      const [shows] = await showsAPIService.getShows()
      this.shows = shows
      this.isRequestLoading = false
      this.hasShows = true
    }
  }
})
