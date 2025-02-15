import { defineStore } from 'pinia';
import { tmdb } from '@/api/tmdb';
import { useToast } from '@/components/ui/toast/use-toast';
import type { Movie, MovieResults } from '@/types/movie';
import type { TvShowResults } from '@/types/tvShow';

interface State {
	nowPlaying: MovieResults;
	topRated: MovieResults;
	upcoming: MovieResults;
	trendingTv: TvShowResults;
	trendingMovies: MovieResults;
}

const { toast } = useToast();

export const useMediaStore = defineStore({
	id: 'media',
	state: (): State => ({
		nowPlaying: { page: 0, results: [], total_pages: 0, total_results: 0 },
		topRated: { page: 0, results: [], total_pages: 0, total_results: 0 },
		upcoming: { page: 0, results: [], total_pages: 0, total_results: 0 },
		trendingTv: { page: 0, results: [], total_pages: 0, total_results: 0 },
		trendingMovies: { page: 0, results: [], total_pages: 0, total_results: 0 },
	}),
	getters: {
		heroMedia: (state): Movie[] => {
			return [...state.nowPlaying.results.slice(0, 5), ...state.upcoming.results.slice(0, 5)];
		},
		topRatedMovies: (state): Movie[] => {
			return state.topRated.results.slice(0, 15);
		},
	},
	actions: {
		async fetchNowPlaying() {
			try {
				const response = await tmdb.nowPlaying();
				if (response instanceof Error) {
					throw response;
				}
				this.nowPlaying = response as MovieResults;
			} catch (error) {
				toast({
					title: 'An error occurred',
					description: `${error}`,
					variant: 'destructive',
				});
			}
		},
		async fetchTopRated() {
			try {
				const response = await tmdb.topRated();
				if (response instanceof Error) {
					throw response;
				}
				this.topRated = response as MovieResults;
			} catch (error) {
				toast({
					title: 'An error occurred',
					description: `${error}`,
					variant: 'destructive',
				});
			}
		},
		async fetchUpcoming() {
			try {
				const response = await tmdb.upcoming();
				if (response instanceof Error) {
					throw response;
				}
				this.upcoming = response as MovieResults;
			} catch (error) {
				toast({
					title: 'An error occurred',
					description: `${error}`,
					variant: 'destructive',
				});
			}
		},
		async fetchTrendingTv() {
			try {
				const response = await tmdb.trending('tv');
				if (response instanceof Error) {
					throw response;
				}
				this.trendingTv = response as TvShowResults;
			} catch (error) {
				toast({
					title: 'An error occurred',
					description: `${error}`,
					variant: 'destructive',
				});
			}
		},
		async fetchTrendingMovies() {
			try {
				const response = await tmdb.trending('movie');
				if (response instanceof Error) {
					throw response;
				}
				this.trendingMovies = response as MovieResults;
			} catch (error) {
				toast({
					title: 'An error occurred',
					description: `${error}`,
					variant: 'destructive',
				});
			}
		},
	},
});
