import type { Media } from './types';

type MovieResults = {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
};

type BelongsToCollection = {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
};

type Movie = Media & {
  budget: number;
  imdb_id: string;
  original_title: string;
  release_date: string;
  revenue: number;
  runtime: number;
  title: string;
  video: boolean;
  genre_ids: number[];
  name: string;
  belongs_to_collection: BelongsToCollection;
};

export type { Movie, MovieResults };
