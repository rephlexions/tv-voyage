const BASE_URL = 'https://api.tvmaze.com'

export default class tvMazeApi {
  private baseUrl: string

  constructor() {
    this.baseUrl = BASE_URL
  }

  private async fetchCall(endpoint: string, options?: RequestInit): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, options)
      const data = await response.json()
      return [data]
    } catch (error) {
      return [error]
    }
  }

  async getShows() {
    return this.fetchCall('/shows', { method: 'GET' })
  }

  async getShow(id: string | number) {
    return this.fetchCall(`/shows/${id}`, { method: 'GET' })
  }

  async getShowImages(id: string | number) {
    return this.fetchCall(`/shows/${id}/images`, { method: 'GET' })
  }

  async getShowEpisodes(id: string | number) {
    return this.fetchCall(`/shows/${id}/episodes`, { method: 'GET' })
  }

  async searchShows(query: string) {
    return this.fetchCall(`/search/shows?q=${query}`, { method: 'GET' })
  }
}

export const tvMaze = new tvMazeApi()
