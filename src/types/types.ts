type JSONPrimitive = string | number | boolean | null;
type JSONObject = { [key: string]: JSONValue };
type JSONArray = JSONValue[];
type JSONValue = JSONArray | JSONObject | JSONPrimitive;

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface FetchOptions extends RequestInit {
  method?: HttpMethod;
  headers?: HeadersInit;
  body?: BodyInit | null;
  mode?: RequestMode;
  credentials?: RequestCredentials;
  cache?: RequestCache;
  redirect?: RequestRedirect;
  referrer?: string;
  referrerPolicy?: ReferrerPolicy;
  integrity?: string;
  keepalive?: boolean;
  signal?: AbortSignal | null;
}

type QueryObject = {
  [key: string]: string;
};

type State = {
  genres: Genre[];
};

type MediaType = 'movie' | 'tv' | 'person';

type Genre = {
  id: number;
  name: string;
};

type ProductionCompany = {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
};

type ProductionCountry = {
  iso_3166_1: string;
  name: string;
};

type SpokenLanguage = {
  english_name: string;
  iso_639_1: string;
  name: string;
};

type Media = {
  adult: boolean;
  backdrop_path: string;
  genres: Genre[];
  homepage: string;
  id: number;
  origin_country: string[];
  original_language: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  vote_average: number;
  vote_count: number;
  media_type: string;
};

type Video = {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
  id: string;
};

type VideoResults = {
  id: number;
  results: Video[];
};

type CastMember = {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
};

type CrewMember = {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  credit_id: string;
  department: string;
  job: string;
};

type CreditsResults = {
  id: number;
  cast: CastMember[];
  crew: CrewMember[];
};

type Review = {
  author: string;
  author_details: AuthorDetails;
  content: string;
  created_at: string;
  id: string;
  updated_at: string;
  url: string;
};

type AuthorDetails = {
  name: string;
  username: string;
  avatar_path: string | null;
  rating: number;
};

type ReviewResults = {
  id: number;
  page: number;
  results: Review[];
  total_pages: number;
  total_results: number;
};

type Recommendation = {
  backdrop_path: string;
  id: number;
  original_title: string;
  overview: string;
  poster_path: string;
  media_type: string;
  adult: boolean;
  title: string;
  original_language: string;
  genre_ids: number[];
  popularity: number;
  release_date: string;
  video: boolean;
  vote_average: number;
  vote_count: number;

}

type RecommendationsResults = {
  page: number;
  results: Recommendation[];
  total_pages: number;
  total_results: number;
};
}

export type {
  JSONValue,
  FetchOptions,
  HttpMethod,
  Genre,
  State,
  QueryObject,
  JSONObject,
  MediaType,
  ProductionCompany,
  ProductionCountry,
  SpokenLanguage,
  Media,
  Video,
  VideoResults,
  CastMember,
  CreditsResults,
  CrewMember,
  Review,
  ReviewResults,
  RecommendationsResults,
  Recommendation,
};
