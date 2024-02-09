import type { Genre } from '@/types/Genre'
import type { Show } from '@/types/Show'

function normalizeShows(data: any[]): Show[] {
  return data.map((obj) => {
    return {
      id: obj.id,
      name: obj.name,
      image: {
        medium: obj.image.medium,
        original: obj.image.original
      },
      rating: {
        average: obj.rating.average
      },
      genres: obj.genres
    }
  })
}

function filterShows(data: any[], type: string): Show[] {
  data = normalizeShows(data)
  if (type === 'all') return data
  data = data.filter((show) => show.genres.includes(type))
  return data
}

function findGenres(data: any[]): Genre[] {
  const genres = data.map((show) => show.genres).flat()
  return genres.map((genre, index) => {
    return { id: index, name: genre }
  })
}

export { normalizeShows, filterShows, findGenres }
