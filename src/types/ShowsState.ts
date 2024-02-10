import type { Genre } from './Genre'
import type { Show } from './Show'

export type ShowsState = {
  shows: Show[]
  firstCarousel: Show[]
  secondCarousel: Show[]
  thirdCarousel: Show[]
  genres: Genre[]
  isRequestLoading: boolean
  hasShows: boolean
}
