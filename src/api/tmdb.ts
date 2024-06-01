import ApiClient from './apiClient'
import type { HttpMethod, FetchOptions, JSONValue } from '@/types/types'

const config = {
  BASE_URL: 'https://api.themoviedb.org/3/',
  API_TOKEN: import.meta.env.VITE_TMDB_TOKEN
}

const options: FetchOptions = {
  method: 'GET' as HttpMethod,
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${config.API_TOKEN}`
  }
}

export default class TmdbApi extends ApiClient {
  private apiClient: ApiClient
  constructor(baseUrl: string, options: FetchOptions) {
    super(baseUrl, options)
    this.apiClient = new ApiClient(baseUrl, options)
  }
  async discover(): Promise<JSONValue | Error> {
    return this.apiClient.fetch('discover/movie')
  }
  async nowPlaying(): Promise<JSONValue | Error> {
    return this.apiClient.fetch('movie/now_playing')
  }
  async topRated(): Promise<JSONValue | Error> {
    return this.apiClient.fetch('movie/top_rated')
  }
  async popular(): Promise<JSONValue | Error> {
    return this.apiClient.fetch('movie/popular')
  }
  async upcoming(): Promise<JSONValue | Error> {
    return this.apiClient.fetch('movie/upcoming')
  }
  async images(id: number): Promise<JSONValue | Error> {
    return this.apiClient.fetch(`movie/${id}/images`)
  }
}
export const tmdb = new TmdbApi(config.BASE_URL, options)
