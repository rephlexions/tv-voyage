import type { FetchOptions, JSONValue, QueryObject } from '@/types/types'

class NetworkError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'network_error'
  }
}

class ServerError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'server_error'
    this.status = status
  }
}

export default class ApiClient {
  private baseUrl: string
  private options: FetchOptions

  constructor(baseUrl: string, options: FetchOptions) {
    this.baseUrl = baseUrl
    this.options = options
  }

  async fetch({
    endpoint,
    options,
    queryParams
  }: {
    endpoint: string
    options?: FetchOptions
    queryParams?: QueryObject
  }): Promise<JSONValue | Error> {
    try {
      if (queryParams) {
        const query = new URLSearchParams(queryParams).toString()
        endpoint = `${endpoint}?${query}`
      }
      const response: Awaited<Response> = await fetch(`${this.baseUrl}${endpoint}`, {
        ...this.options,
        ...options
      })
      if (!response.ok) {
        throw new ServerError(response.status, `Server response was not ok: ${response.status}`)
      }
      const data: JSONValue = await response.json()
      return data
    } catch (error) {
      if (error instanceof ServerError) {
        throw error
      } else if (error instanceof TypeError) {
        throw new NetworkError(`Network error: ${error.message}`)
      } else {
        throw new Error(`An unknown error occurred: ${error}`)
      }
    }
  }
}
