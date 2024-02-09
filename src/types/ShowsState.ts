import type { Show } from './Show'

export type ShowsState = {
  shows: Show[]
  isRequestLoading: boolean
  hasShows: boolean
}
