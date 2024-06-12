<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Ref } from 'vue';
import { tmdb } from '@/api/tmdb';
import type { MovieCollection, Movie } from '@/types/types';
import { useToast } from '@/components/ui/toast/use-toast';
import HeroCarousel from '@/components/HeroCarousel.vue';
import MovieCarousel from '@/components/MovieCarousel.vue';
import MovieTable from '@/components/MovieTable.vue';
import { useGenresStore } from '@/store/genres';

const { toast } = useToast();
const genresStore = useGenresStore();

const nowPlaying: Ref<Movie[]> = ref([]);
const upcoming: Ref<Movie[]> = ref([]);
const topRated: Ref<Movie[]> = ref([]);
const trendingMovies: Ref<Movie[]> = ref([]);
const trendingTv: Ref<Movie[]> = ref([]);

genresStore.fetchMovieGenres();
genresStore.fetchTvGenres();

onMounted(async () => {
  Promise.all([
    tmdb.nowPlaying(),
    tmdb.topRated(),
    tmdb.upcoming(),
    tmdb.trendingMovies(),
    tmdb.trendingTv()
  ])
    .then((results) => {
      nowPlaying.value = (results[0] as MovieCollection).results.slice(0, 5);
      topRated.value = (results[1] as MovieCollection).results.slice(0, 15);
      upcoming.value = (results[2] as MovieCollection).results.slice(0, 5);
      trendingMovies.value = (results[3] as MovieCollection).results.slice(0, 10);
      trendingTv.value = (results[4] as MovieCollection).results.slice(0, 10);
    })
    .catch((error) => {
      toast({
        title: 'An error occurred',
        description: `${error}`,
        variant: 'destructive'
      });
    });
});
</script>

<template>
  <main class="bg-primary text-primary-foreground">
    <HeroCarousel :movies="[...nowPlaying, ...upcoming]"></HeroCarousel>
    <div class="p-16">
      <MovieCarousel :movies="topRated" label="Top rated movies"></MovieCarousel>
      <div class="flex">
        <MovieTable :movies="trendingMovies" :label="'Trending movies this week'"></MovieTable>
        <MovieTable :movies="trendingTv" :label="'Trending TV shows this week'"></MovieTable>
      </div>
    </div>
  </main>
</template>
<style scoped></style>
