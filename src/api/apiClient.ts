import type { FetchOptions, JSONValue } from '@/types/types'

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

  async fetchCall(endpoint: string, options?: RequestInit): Promise<JSONValue | Error> {
    try {
      const response: Awaited<Response> = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        ...this.options
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
