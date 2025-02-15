import type { Genre, JSONObject } from '@/types/types';
import { defineStore } from 'pinia';
import { tmdb } from '@/api/tmdb';
import { useToast } from '@/components/ui/toast/use-toast';

interface State {
	movieGenres: Genre[];
	tvGenres: Genre[];
}

const { toast } = useToast();

export const useGenresStore = defineStore({
	id: 'genres',
	state: (): State => ({
		movieGenres: [],
		tvGenres: [],
	}),
	getters: {
		allGenres: (state): Genre[] => {
			return [...state.movieGenres, ...state.tvGenres].filter(
				(genre, index, self) => self.findIndex((g) => g.id === genre.id) === index,
			);
		},
	},
	actions: {
		async fetchMovieGenres() {
			try {
				const response = await tmdb.genres('movie');
				if (response instanceof Error) {
					throw response;
				}
				this.movieGenres = (response as JSONObject).genres as Genre[];
			} catch (error) {
				toast({
					title: 'An error occurred',
					description: `${error}`,
					variant: 'destructive',
				});
			}
		},
		async fetchTvGenres() {
			try {
				const response = await tmdb.genres('tv');
				if (response instanceof Error) {
					throw response;
				}
				this.tvGenres = (response as JSONObject).genres as Genre[];
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
