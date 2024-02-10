import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
export default class ShowsAPIService {
  private axiosInstance: AxiosInstance

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: 'http://api.tvmaze.com'
    })
  }
  private async axiosCall<T>(config: AxiosRequestConfig): Promise<any[]> {
    try {
      const { data } = await this.axiosInstance.request<T>(config)
      return [data]
    } catch (error) {
      return [error]
    }
  }

  async getShows() {
    return this.axiosCall({ method: 'GET', url: '/shows' })
  }
  async getShow(id: number) {
    return this.axiosCall({ method: 'GET', url: `/shows/${id}` })
  }
  async getShowImages(id: number) {
    return this.axiosCall({ method: 'GET', url: `/shows/${id}/images` })
  }
  async searchShows(query: string) {
    return this.axiosCall({ method: 'GET', url: `/search/shows?q=${query}` })
  }
}

export const showsAPIService = new ShowsAPIService()
