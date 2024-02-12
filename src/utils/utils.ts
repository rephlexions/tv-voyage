import type { Episode } from '@/types/Episode'
import type { Genre } from '@/types/Genre'
import type { GroupedEpisodes } from '@/types/GroupedEpisode'
import type { OriginalShow } from '@/types/OriginalShow'
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
function normalizeEpisodes(data: any[]): Episode[] {
  return data.map((obj) => {
    return {
      id: obj.id,
      name: obj.name,
      number: obj.number,
      season: obj.season,
      airDate: obj.airdate,
      rating: {
        average: obj.rating.average
      }
    }
  })
}
function normalizeSearchResults(data: any[]): Show[] {
  const results: any[] = []
  data[0].forEach((el: { show: any }) => {
    results.push(el.show)
  })

  return results.map((obj: Show) => {
    return {
      id: obj.id,
      name: obj.name,
      image: obj.image
        ? {
            medium: obj.image.medium,
            original: obj.image.original
          }
        : null
    }
  })
}

function filterShows(data: Show[], type: Genre): Show[] {
  const { name } = type
  if (name === 'all') return data
  data = data.filter((show) => show.genres!.includes(name))
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

function groupEpisodesBySeason(episodes: Episode[]): GroupedEpisodes {
  return episodes.reduce((grouped: GroupedEpisodes, episode: Episode) => {
    const key = String(episode.season)
    grouped[key] = grouped[key] || []
    grouped[key].push(episode)
    return grouped
  }, {})
}

export {
  normalizeShows,
  normalizeEpisodes,
  filterShows,
  findGenres,
  filterImages,
  shuffle,
  groupEpisodesBySeason,
  normalizeSearchResults
}
