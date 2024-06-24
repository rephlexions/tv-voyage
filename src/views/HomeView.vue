<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { Ref } from 'vue';
import { tmdb } from '@/api/tmdb';
import type { MovieResults } from '@/types/movie';
import { useToast } from '@/components/ui/toast/use-toast';
import HeroCarousel from '@/components/HeroCarousel.vue';
import MediaCarousel from '@/components/MediaCarousel.vue';
import MediaTable from '@/components/MediaTable.vue';
import MediaCard from '@/components/MediaCard.vue';
import CarouselItem from '@/components/ui/carousel/CarouselItem.vue';
import MovieRating from '@/components/MovieRating.vue';
import dayjs from 'dayjs';
import { useRouter } from 'vue-router';
import type { MediaType } from '@/types/types';
import type { TvShowResults } from '@/types/tvShow';
import { isError } from '@/utils/utils';

const { toast } = useToast();
const router = useRouter();

const nowPlaying: Ref<MovieResults | null> = ref(null);
const upcoming: Ref<MovieResults | null> = ref(null);
const topRated: Ref<MovieResults | null> = ref(null);
const trendingMovies: Ref<MovieResults | null> = ref(null);
const trendingTv: Ref<TvShowResults | null> = ref(null);

const heroMovies = computed(() => {
  if (!nowPlaying.value || !upcoming.value) {
    return [];
  }
  return [...nowPlaying.value.results.slice(0, 5), ...upcoming.value.results.slice(0, 5)];
});

function openDetailView(id: number, mediaType: MediaType = 'movie') {
  router.push({
    name: 'view',
    params: { id: id.toString(), type: mediaType }
  });
}

function getMedia() {
  Promise.allSettled([
    tmdb.nowPlaying(),
    tmdb.topRated(),
    tmdb.upcoming(),
    tmdb.trending('movie'),
    tmdb.trending('tv')
  ])
    .then((results) => {
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          const value = result.value;
          if (isError(value)) {
            throw new Error(value.message);
          }
          switch (index) {
            case 0:
              nowPlaying.value = result.value as MovieResults;
              break;
            case 1:
              topRated.value = result.value as MovieResults;
              break;
            case 2:
              upcoming.value = result.value as MovieResults;
              break;
            case 3:
              trendingMovies.value = result.value as MovieResults;
              break;
            case 4:
              trendingTv.value = result.value as TvShowResults;
              break;
          }
        } else if (result.status === 'rejected') {
          throw new Error(result.reason);
        }
      });
    })
    .catch((error) => {
      toast({
        title: 'An error occurred',
        description: `${error}`,
        variant: 'destructive'
      });
    });
}
onMounted(() => {
  getMedia();
});
</script>
<template>
  <main class="bg-primary text-primary-foreground">
    <HeroCarousel :movies="heroMovies"></HeroCarousel>
    <div class="p-16">
      <MediaCarousel>
        <template v-slot:carousel-title>
          <h2 class="mb-4 text-3xl font-semibold text-slate-100">Top rated movies</h2>
        </template>
        <template v-slot:carousel-item>
          <CarouselItem
            v-for="item in topRated?.results.slice(0, 15)"
            :key="item.id"
            class="sm:basis-1/4 lg:basis-1/6"
          >
            <MediaCard @click="openDetailView(item.id, item.media_type)" :path="item.poster_path">
              <template v-slot:card-footer>
                <div class="h-[65px]">
                  <MovieRating :rating="item.vote_average" />
                  <p class="text-slate-800">
                    {{ item.title }} ({{ dayjs(item.release_date, 'YYYY MMMM DD').year() }})
                  </p>
                </div>
              </template>
            </MediaCard>
          </CarouselItem>
        </template>
      </MediaCarousel>
      <div class="flex justify-between lg:flex-row sm:flex-col pt-16">
        <MediaTable
          v-if="trendingMovies"
          :media="trendingMovies?.results.slice(0, 10)"
          :label="'Trending movies this week'"
        ></MediaTable>
        <MediaTable
          v-if="trendingTv"
          :media="trendingTv.results.slice(0, 10)"
          :label="'Trending TV shows this week'"
        ></MediaTable>
      </div>
    </div>
  </main>
</template>
<style scoped></style>
