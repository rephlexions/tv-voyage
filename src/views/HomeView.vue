<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Ref } from 'vue';
import { tmdb } from '@/api/tmdb';
import type { MovieCollection, Movie, Genre } from '@/types/types';
import { useToast } from '@/components/ui/toast/use-toast';
import HeroCarousel from '@/components/HeroCarousel.vue';
import MovieCarousel from '@/components/MovieCarousel.vue';
import MovieTable from '@/components/MovieTable.vue';

const { toast } = useToast();

const nowPlaying: Ref<Movie[]> = ref([]);
const upcoming: Ref<Movie[]> = ref([]);
const topRated: Ref<Movie[]> = ref([]);
const trending: Ref<Movie[]> = ref([]);
const movieGenres: Ref<Genre[]> = ref([]);
const tvGenres: Ref<Genre[]> = ref([]);
onMounted(async () => {
  Promise.all([
    tmdb.nowPlaying(),
    tmdb.topRated(),
    tmdb.upcoming(),
    tmdb.trendingMovies(),
    tmdb.genres(),
    tmdb.genres('tv')
  ])
    .then((results) => {
      nowPlaying.value = (results[0] as MovieCollection).results.slice(0, 5);
      topRated.value = (results[1] as MovieCollection).results.slice(0, 15);
      upcoming.value = (results[2] as MovieCollection).results.slice(0, 5);
      trending.value = (results[3] as MovieCollection).results.slice(0, 10);
      movieGenres.value = results[4] as Genre[];
      tvGenres.value = results[5] as Genre[];
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
    <HeroCarousel :shows="[...nowPlaying, ...upcoming]"></HeroCarousel>
    <div class="p-16">
      <MovieCarousel :movies="topRated" label="Top rated movies"></MovieCarousel>
      <MovieTable :movies="trending"></MovieTable>
    </div>
  </main>
</template>
<style scoped></style>
