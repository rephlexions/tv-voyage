import type { Episode } from './Episode'

export type GroupedEpisodes = {
  [key: string]: Episode[]
}
