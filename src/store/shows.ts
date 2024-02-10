import { defineStore } from 'pinia'
import { showsAPIService } from '@/services/showsApi'
import { normalizeShows, findGenres, filterShows, filterImages } from '@/utils/normalizeShows'
import type { ShowsState } from '@/types/ShowsState'
import type { Genre } from '@/types/Genre'

export const useShows = defineStore('shows', {
  state: (): ShowsState => ({
    shows: [],
    topShows: [],
    latestShows: [],
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
    },
    setTopShows(num: number): void {
      const shows = this.shows.sort((a, b) => b.rating.average - a.rating.average).slice(0, num)
      this.topShows = shows
    },
    async setLatestShows(num: number): Promise<void> {
      const shows = this.shows
        .filter((show) => show.status === 'Running')
        .sort((a, b) => {
          return new Date(b.premiered).getTime() - new Date(a.premiered).getTime()
        })
        .slice(0, num)
      shows.forEach(async (show) => {
        const [images] = await showsAPIService.getShowImages(show.id)
        show.image.background = filterImages(images)
      })
      this.latestShows = shows
    }
  }
})
