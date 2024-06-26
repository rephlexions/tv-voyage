<script setup lang="ts">
import HeroCarousel from '@/components/HeroCarousel.vue';
import MediaCarousel from '@/components/MediaCarousel.vue';
import MediaTable from '@/components/MediaTable.vue';
import MediaCard from '@/components/MediaCard.vue';
import CarouselItem from '@/components/ui/carousel/CarouselItem.vue';
import MovieRating from '@/components/MovieRating.vue';
import dayjs from 'dayjs';
import { useRouter } from 'vue-router';
import type { MediaType } from '@/types/types';
import { storeToRefs } from 'pinia';
import { useMediaStore } from '@/store/media';

const router = useRouter();
const mediaStore = useMediaStore();
const { heroMedia, topRatedMovies, trendingTv, trendingMovies } = storeToRefs(mediaStore);

function openDetailView(id: number, mediaType: MediaType = 'movie') {
  router.push({
    name: 'view',
    params: { id: id.toString(), type: mediaType }
  });
}
</script>
<template>
  <main class="bg-primary text-primary-foreground">
    <HeroCarousel :movies="heroMedia"></HeroCarousel>
    <div class="p-16">
      <MediaCarousel>
        <template v-slot:carousel-title>
          <h2 class="mb-4 text-3xl font-semibold text-slate-100">Top rated movies</h2>
        </template>
        <template v-slot:carousel-item>
          <CarouselItem
            v-for="item in topRatedMovies"
            :key="item.id"
            class="sm:basis-1/4 lg:basis-1/6"
          >
            <MediaCard @click="openDetailView(item.id, item.media_type)" :path="item.poster_path">
              <template v-slot:card-footer>
                <span class="text-slate-800 font-semibold h-[40px]">
                  {{ item.title }} ({{ dayjs(item.release_date, 'YYYY MMMM DD').year() }})
                </span>

                <MovieRating :rating="item.vote_average" />
              </template>
            </MediaCard>
          </CarouselItem>
        </template>
      </MediaCarousel>
      <div class="flex justify-between md:flex-row flex-col pt-16">
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
