import { defineStore } from 'pinia'

type Show = {
  id: number
  name: string
  image: {
    medium: string
  }
}

type ShowsState = {
  shows: Show[]
  isRequestLoading: boolean
}

export const useShows = defineStore('shows', {
  state: (): ShowsState => ({
    shows: [],
    isRequestLoading: false
  }),
  getters: {
    activeCustomersCount({ shows }): number {
      return 0
    }
  },
  actions: {
    async fetchCustomers(): Promise<void> {
      const promise: Promise<Show[]> = new Promise((resolve) => {
        resolve([])
      })

      this.shows = await promise
    }
  }
})
