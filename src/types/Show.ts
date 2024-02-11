export type Show = {
  id: number
  name: string
  image: {
    medium: string
    original: string
    background?: string
  }
  rating: {
    average: number
  }
  genres: string[]
  premiered: string
  status: string
  summary: string
  language: string
  officialSite?: string | null
}
