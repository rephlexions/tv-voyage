import type { Movie } from './movie';
import type { TvShow } from './tvShow';

type JSONPrimitive = string | number | boolean | null;
type JSONObject = { [key: string]: JSONValue };
type JSONArray = JSONValue[];
type JSONValue = JSONArray | JSONObject | JSONPrimitive;

const httpMethods = ['GET', 'POST', 'PUT', 'DELETE'] as const;
type HttpMethod = (typeof httpMethods)[number];

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
	media_type: MediaType;
	adult: boolean;
	title: string;
	original_language: string;
	genre_ids: number[];
	popularity: number;
	release_date: string;
	video: boolean;
	vote_average: number;
	vote_count: number;
	name: string;
};

type RecommendationsResults = {
	page: number;
	results: Recommendation[];
	total_pages: number;
	total_results: number;
};

type Image = {
	aspect_ratio: number;
	file_path: string;
	height: number;
	iso_639_1: string | null;
	vote_average: number;
	vote_count: number;
	width: number;
};

type ImageResults = {
	backdrops: Image[];
	logos: Image[];
	posters: Image[];
};

type SearchResult = {
	backdrop_path: string;
	id: number;
	original_title: string;
	overview: string;
	poster_path: string;
	media_type: MediaType;
	adult: boolean;
	name: string;
	original_language: string;
	genre_ids: number[];
	popularity: number;
	first_air_date: string;
	release_date: string;
	vote_average: number;
	vote_count: number;
	origin_country: string[];
};

type SearchResults = {
	page: number;
	results: SearchResult[];
	total_pages: number;
	total_results: number;
};

type Person = {
	adult: boolean;
	also_known_as: string[];
	biography: string;
	birthday: string;
	deathday: null | string;
	gender: number;
	homepage: null | string;
	id: number;
	imdb_id: string;
	known_for_department: string;
	name: string;
	place_of_birth: string;
	popularity: number;
	profile_path: string;
};

type MovieCreditsResults = {
	id: number;
	cast: Movie[];
	crew: Movie[];
};

type TVCreditsResults = {
	id: number;
	cast: TvShow[];
	crew: TvShow[];
};

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
	Video,
	VideoResults,
	CastMember,
	CreditsResults,
	CrewMember,
	Review,
	ReviewResults,
	RecommendationsResults,
	Recommendation,
	Image,
	ImageResults,
	SearchResult,
	SearchResults,
	Person,
	MovieCreditsResults,
	TVCreditsResults,
};
