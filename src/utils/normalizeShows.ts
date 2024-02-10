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

function filterShows(data: Show[], type: Genre): Show[] {
  const { name } = type
  if (name === 'all') return data
  data = data.filter((show) => show.genres.includes(name))
  return data
}

function findGenres(data: any[]): Genre[] {
  const genres = data.map((show) => show.genres).flat()
  const uniqueGenres = [...new Set(genres)]
  return uniqueGenres.map((genre, index) => {
    return { id: index, name: genre }
  })
}

export { normalizeShows, filterShows, findGenres }
