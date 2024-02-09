import type { Genre } from './Genre'
import type { Show } from './Show'

export type ShowsState = {
  shows: Show[]
  sfShows: Show[]
  actionsShows: Show[]
  genres: Genre[]
  isRequestLoading: boolean
  hasShows: boolean
}
