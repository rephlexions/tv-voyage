import { defineStore } from 'pinia'
import { showsAPIService } from '@/services/showsApi'
import { normalizeShows, findGenres, filterShows, getBackgroundImage, shuffle } from '@/utils/utils'
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
    isSet: false
  }),
  getters: {},
  actions: {
    async fetchShows(): Promise<void> {
      const [shows] = await showsAPIService.getShows()

      this.shows = normalizeShows(shows)
      this.genres = findGenres(shows)
      this.isSet = true
    },
    setShowsByGenre(genre: Genre, index: number): void {
      if (index > 2 || index < 0) {
        throw new Error('Index must be between 0 and 2')
      }
      switch (index) {
        case 0:
          // eslint-disable-next-line no-case-declarations
          const firstGenre = filterShows(this.shows, genre)
          this.firstCarousel = shuffle(firstGenre)
          break
        case 1:
          // eslint-disable-next-line no-case-declarations
          const secondGenre = filterShows(this.shows, genre)
          this.secondCarousel = shuffle(secondGenre)
          break
        case 2:
          // eslint-disable-next-line no-case-declarations
          const thirdGenre = filterShows(this.shows, genre)
          this.thirdCarousel = shuffle(thirdGenre)
          break
      }
    },
    setTopShows(num: number): void {
      if (num < 1 || typeof num !== 'number') {
        throw new Error('You must pass a number greater than 1 to setTopShows')
      }
      const shows = this.shows.sort((a, b) => b.rating!.average - a.rating!.average).slice(0, num)
      this.topShows = shows
    },
    async setLatestShows(num: number): Promise<void> {
      if (num < 1 || typeof num !== 'number') {
        throw new Error('You must pass a number greater than 1 to setTopShows')
      }
      const shows = this.shows
        .filter((show) => show.status === 'Running')
        .sort((a, b) => {
          return new Date(b.premiered!).getTime() - new Date(a.premiered!).getTime()
        })
        .slice(0, num)
      shows.forEach(async (show) => {
        const [images] = await showsAPIService.getShowImages(show.id)
        show.image!.background = getBackgroundImage(images)
      })
      this.latestShows = shows
    },
    clearStore(): void {
      this.shows = []
    }
  }
})
