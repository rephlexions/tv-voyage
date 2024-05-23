type JSONPrimitive = string | number | boolean | null
type JSONObject = { [key: string]: JSONValue }
type JSONArray = JSONValue[]
type JSONValue = JSONArray | JSONObject | JSONPrimitive

type Episode = {
  id: number
  name: string
  number: number
  season: number
  airDate: string
  rating: {
    average: number
  }
}

type Genre = {
  id: number
  name: string
}

type Season = {
  [key: string]: Episode[]
}

type Show = {
  id: number
  name: string
  image: {
    medium: string
    original: string
    background?: string
  } | null
  rating?: {
    average: number
  }
  genres?: string[]
  premiered?: string
  status?: string
  summary?: string
  language?: string
  officialSite?: string | null
}

type State = {
  shows: Show[]
  topShows: Show[]
  latestShows: Show[]
  genres: Genre[]
  isSet: boolean
}

export type { JSONValue, Episode, Genre, Season, Show, State }
