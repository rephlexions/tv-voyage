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

const tmdbApiClient = new ApiClient(config.BASE_URL, options)

export async function discoverMovie(): Promise<JSONValue | Error> {
  return tmdbApiClient.fetchCall('discover/movie', { method: 'POST' })
}

export async function getUpcomingMovies(): Promise<JSONValue | Error> {
  return tmdbApiClient.fetchCall('movie/upcoming')
}

export async function findByExternalId(id: number): Promise<JSONValue | Error> {
  return tmdbApiClient.fetchCall(`find/${id}?external_source=`)
}
