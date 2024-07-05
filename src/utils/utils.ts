import type { Movie } from '@/types/movie';
import type { TvShow } from '@/types/tvShow';

function isError(value: any): value is Error {
  return value instanceof Error;
}

function isMovie(value: any): value is Movie {
  return value && typeof value === 'object' && 'title' in value;
}

function isTVShow(value: any): value is TvShow {
  return value && typeof value === 'object' && 'name' in value;
}

export { isError, isMovie, isTVShow };
