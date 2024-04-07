import type { Genre } from './Genre'
import type { Show } from './Show'

export type ShowsState = {
  shows: Show[]
  topShows: Show[]
  latestShows: Show[]
  genres: Genre[]
  isSet: boolean
}
