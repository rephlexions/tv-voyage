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
      genres: obj.genres,
      premiered: obj.premiered,
      status: obj.status,
      summary: obj.summary,
      language: obj.language,
      officialSite: obj.network ? obj.network?.officialSite : null
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

function filterImages(data: any[]): string {
  const index = data.findIndex(
    (image) => image.type === 'background' && image.resolutions.original.width === 1920
  )
  return data[index].resolutions.original.url
}

function shuffle(array: any[]): any[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export { normalizeShows, filterShows, findGenres, filterImages, shuffle }
