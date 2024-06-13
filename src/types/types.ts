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

// old
type Episode = {
  id: number;
  name: string;
  number: number;
  season: number;
  airDate: string;
  rating: {
    average: number;
  };
};

// old
type Season = {
  [key: string]: Episode[];
};

// old
type Show = {
  id: number;
  name: string;
  image: {
    medium: string;
    original: string;
    background?: string;
  } | null;
  rating?: {
    average: number;
  };
  genres?: string[];
  premiered?: string;
  status?: string;
  summary?: string;
  language?: string;
  officialSite?: string | null;
};

export type {
  JSONValue,
  FetchOptions,
  HttpMethod,
  Episode,
  Genre,
  Season,
  Show,
  State,
  QueryObject,
  JSONObject,
  MediaType,
  ProductionCompany,
  ProductionCountry,
  SpokenLanguage,
  Media
};
