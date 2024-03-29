import type { Genre } from './Genre'
import type { Show } from './Show'

export type ShowsState = {
  shows: Show[]
  topShows: Show[]
  latestShows: Show[]
  firstCarousel: Show[]
  secondCarousel: Show[]
  thirdCarousel: Show[]
  genres: Genre[]
  isSet: boolean
}
