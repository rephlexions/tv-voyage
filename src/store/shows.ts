import { defineStore } from 'pinia'
import { showsAPIService } from '@/services/showsApi'
import { normalizeShows, findGenres, filterShows } from '@/utils/normalizeShows'
import type { ShowsState } from '@/types/ShowsState'
import type { Genre } from '@/types/Genre'

export const useShows = defineStore('shows', {
  state: (): ShowsState => ({
    shows: [],
    firstCarousel: [],
    secondCarousel: [],
    thirdCarousel: [],
    genres: [],
    isRequestLoading: false,
    hasShows: false
  }),
  getters: {
    isLoading({ isRequestLoading }): boolean {
      return isRequestLoading
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
    setShowsByGenre(genre: Genre, index: number): void {
      switch (index) {
        case 0:
          this.firstCarousel = filterShows(this.shows, genre)
          break
        case 1:
          this.secondCarousel = filterShows(this.shows, genre)
          break
        case 2:
          this.thirdCarousel = filterShows(this.shows, genre)
          break
      }
    }
  }
})
