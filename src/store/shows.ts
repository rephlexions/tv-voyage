import { defineStore } from 'pinia';
import type { State } from '@/types/types';

export const useShows = defineStore('shows', {
  state: (): State => ({
    genres: []
  }),
  getters: {},
  actions: {}
});
