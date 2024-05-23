import { defineStore } from 'pinia'
import { tvMaze } from '@/api/tvMaze'
import {
  normalizeShows,
  normalizeGenres,
  filterShows,
  getBackgroundImage,
  shuffle
} from '@/utils/utils'
import type { Genre, State } from '@/types/types'

export const useShows = defineStore('shows', {
  state: (): State => ({
    shows: [],
    topShows: [],
    latestShows: [],
    genres: [],
    isSet: false
  }),
  getters: {
    sfShows: (state) => {
      const genreIndex = state.genres.findIndex((genre: Genre) => genre.name === 'Science-Fiction')
      return genreIndex >= 0 ? shuffle(filterShows(state.shows, state.genres[genreIndex])) : []
    },
    actionShows: (state) => {
      const genreIndex = state.genres.findIndex((genre: Genre) => genre.name === 'Action')
      return genreIndex >= 0 ? shuffle(filterShows(state.shows, state.genres[genreIndex])) : []
    },
    romanceShows: (state) => {
      const genreIndex = state.genres.findIndex((genre: Genre) => genre.name === 'Romance')
      return genreIndex >= 0 ? shuffle(filterShows(state.shows, state.genres[genreIndex])) : []
    },
    topShows: (state) => {
      return state.shows.sort((a, b) => b.rating!.average - a.rating!.average).slice(0, 10)
    }
  },
  actions: {
    async fetchShows(): Promise<void> {
      const [shows]: any[] = await tvMaze.getShows()
      this.shows = normalizeShows(shows)
      this.genres = normalizeGenres(shows)
      console.log(this.genres)

      this.isSet = true
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
        const [images] = await tvMaze.getShowImages(show.id)
        show.image!.background = getBackgroundImage(images)
      })
      this.latestShows = shows
    },
    clearStore(): void {
      this.shows = []
    }
  }
})
