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
    try {
      const response = await this.apiClient.fetch('discover/movie', options)
      if (response instanceof Error) {
        throw response
      }
      return response
    } catch (error) {
      return error as Error
    }
  }

  async topRated(): Promise<JSONValue | Error> {
    try {
      const response = await this.apiClient.fetch('movie/top_rated', options)
      if (response instanceof Error) {
        throw response
      }
      return response
    } catch (error) {
      return error as Error
    }
  }

  async nowPlaying(): Promise<JSONValue | Error> {
    try {
      const response = await this.apiClient.fetch('movie/now_playing', options)
      if (response instanceof Error) {
        throw response
      }
      return response
    } catch (error) {
      return error as Error
    }
  }

  async popular(): Promise<JSONValue | Error> {
    try {
      const response = await this.apiClient.fetch('movie/popular', options)
      if (response instanceof Error) {
        throw response
      }
      return response
    } catch (error) {
      return error as Error
    }
  }

  async upcoming(): Promise<JSONValue | Error> {
    try {
      const response = await this.apiClient.fetch('movie/upcoming', options)
      if (response instanceof Error) {
        throw response
      }
      return response
    } catch (error) {
      return error as Error
    }
  }

  async images(id: number): Promise<JSONValue | Error> {
    try {
      const response = await this.apiClient.fetch(`movie/${id}/images`, options)
      if (response instanceof Error) {
        throw response
      }
      return response
    } catch (error) {
      return error as Error
    }
  }
}
export const tmdb = new TmdbApi(config.BASE_URL, options)
