<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Ref } from 'vue';
import { tmdb } from '@/api/tmdb';
import type { Movie } from '@/types/movie';
import type { MovieCollection } from '@/types/movie';
import { useToast } from '@/components/ui/toast/use-toast';
import HeroCarousel from '@/components/HeroCarousel.vue';
import MovieCarousel from '@/components/MovieCarousel.vue';
import MovieTable from '@/components/MovieTable.vue';
import vCard from '@/components/vCard.vue';
import CarouselItem from '@/components/ui/carousel/CarouselItem.vue';
import MovieRating from '@/components/MovieRating.vue';
import dayjs from 'dayjs';
import { useRouter } from 'vue-router';
import type { MediaType } from '@/types/types';

const { toast } = useToast();
const router = useRouter();

const nowPlaying: Ref<Movie[]> = ref([]);
const upcoming: Ref<Movie[]> = ref([]);
const topRated: Ref<Movie[]> = ref([]);
const trendingMovies: Ref<Movie[]> = ref([]);
const trendingTv: Ref<Movie[]> = ref([]);

onMounted(async () => {
  Promise.all([
    tmdb.nowPlaying(),
    tmdb.topRated(),
    tmdb.upcoming(),
    tmdb.trending('movie'),
    tmdb.trending('tv')
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

function openDetailView(id: number, mediaType: MediaType = 'movie') {
  router.push({
    name: 'view',
    params: { id: id.toString(), type: mediaType }
  });
}
</script>

<template>
  <main class="bg-primary text-primary-foreground">
    <HeroCarousel :movies="[...nowPlaying, ...upcoming]"></HeroCarousel>
    <div class="p-16">
      <MovieCarousel :movies="topRated" label="Top rated movies">
        <template v-slot:carousel-item>
          <CarouselItem v-for="item in topRated" :key="item.id" class="md:basis-1/4 lg:basis-1/6">
            <vCard
              @click="openDetailView(item.id, item.media_type)"
              :path="item.poster_path"
              :release-date="item.release_date"
              :title="item.title"
              :vote-average="item.vote_average"
            >
              <template v-slot:card-footer>
                <MovieRating :rating="item.vote_average" />
                <p class="text-slate-800">
                  {{ item.title }} ({{ dayjs(item.release_date, 'YYYY MMMM DD').year() }})
                </p>
              </template>
            </vCard>
          </CarouselItem>
        </template>
      </MovieCarousel>
      <div class="flex">
        <MovieTable :movies="trendingMovies" :label="'Trending movies this week'"></MovieTable>
        <MovieTable :movies="trendingTv" :label="'Trending TV shows this week'"></MovieTable>
      </div>
    </div>
  </main>
</template>
<style scoped></style>
