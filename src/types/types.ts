type JSONPrimitive = string | number | boolean | null
type JSONObject = { [key: string]: JSONValue }
type JSONArray = JSONValue[]
type JSONValue = JSONArray | JSONObject | JSONPrimitive

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
interface FetchOptions extends RequestInit {
  method?: HttpMethod
  headers?: HeadersInit
  body?: BodyInit | null
  mode?: RequestMode
  credentials?: RequestCredentials
  cache?: RequestCache
  redirect?: RequestRedirect
  referrer?: string
  referrerPolicy?: ReferrerPolicy
  integrity?: string
  keepalive?: boolean
  signal?: AbortSignal | null
}

type QueryObject = {
  [key: string]: string
}

type BelongsToCollection = {
  id: number
  name: string
  poster_path: string
  backdrop_path: string
}

type Genre = {
  id: number
  name: string
}

type ProductionCompany = {
  id: number
  logo_path: string | null
  name: string
  origin_country: string
}

type ProductionCountry = {
  iso_3166_1: string
  name: string
}

type SpokenLanguage = {
  english_name: string
  iso_639_1: string
  name: string
}

type Movie = {
  adult?: boolean
  backdrop_path?: string
  belongs_to_collection?: BelongsToCollection
  budget?: number
  genres?: Genre[]
  homepage?: string
  id: number
  imdb_id?: string
  origin_country?: string[]
  original_language?: string
  original_title?: string
  overview?: string
  popularity?: number
  poster_path?: string
  production_companies?: ProductionCompany[]
  production_countries?: ProductionCountry[]
  release_date: string
  revenue?: number
  runtime?: number
  spoken_languages?: SpokenLanguage[]
  status?: string
  tagline?: string
  title?: string
  video?: boolean
  vote_average?: number
  vote_count?: number
}

type MovieCollection = {
  results: Movie[]
  page: number
  total_pages: number
  total_results: number
}

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

export type {
  JSONValue,
  FetchOptions,
  HttpMethod,
  Episode,
  Genre,
  Season,
  Show,
  State,
  Movie,
  MovieCollection,
  QueryObject
}
