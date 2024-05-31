import { defineStore } from 'pinia'
import type { State } from '@/types/types'

export const useShows = defineStore('shows', {
  state: (): State => ({
    shows: [],
    topShows: [],
    latestShows: [],
    genres: [],
    isSet: false
  }),
  getters: {},
  actions: {}
})
