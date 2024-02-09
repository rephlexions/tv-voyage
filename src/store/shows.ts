import { defineStore } from 'pinia'
import { showsAPIService } from '@/services/showsApi'
import type { ShowsState } from '@/types/ShowsState'
import { normalizeShows, findGenres } from '@/utils/normalizeShows'

export const useShows = defineStore('shows', {
  state: (): ShowsState => ({
    shows: [],
    sfShows: [],
    actionsShows: [],
    genres: [],
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
      this.shows = normalizeShows(shows)
      this.genres = findGenres(shows)
      this.isRequestLoading = false
      this.hasShows = true
    },
    setSfShows(genre: string): void {
      this.shows.forEach((show) => {
        if (show.genres.includes(genre)) {
          this.sfShows.push(show)
        }
      })
    },
    setActionShows(genre: string): void {
      this.shows.forEach((show) => {
        if (show.genres.includes(genre)) {
          this.actionsShows.push(show)
        }
      })
    }
  }
})
