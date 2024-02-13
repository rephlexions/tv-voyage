import { defineStore } from 'pinia'
import { showsAPIService } from '@/services/showsApi'
import { normalizeShows, findGenres, filterShows, filterImages, shuffle } from '@/utils/utils'
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
  getters: {
    isLoading({ isSet }): boolean {
      return isSet
    }
  },
  actions: {
    async fetchShows(): Promise<void> {
      const [shows] = await showsAPIService.getShows()
      console.log(shows)

      this.shows = normalizeShows(shows)
      this.genres = findGenres(shows)
      this.isSet = true
    },
    setShowsByGenre(genre: Genre, index: number): void {
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
      const shows = this.shows.sort((a, b) => b.rating!.average - a.rating!.average).slice(0, num)
      this.topShows = shows
    },
    async setLatestShows(num: number): Promise<void> {
      const shows = this.shows
        .filter((show) => show.status === 'Running')
        .sort((a, b) => {
          return new Date(b.premiered!).getTime() - new Date(a.premiered!).getTime()
        })
        .slice(0, num)
      shows.forEach(async (show) => {
        const [images] = await showsAPIService.getShowImages(show.id)
        show.image!.background = filterImages(images)
      })
      this.latestShows = shows
    },
    clearStore(): void {
      this.shows = []
    }
  }
})
