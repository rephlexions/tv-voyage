<script setup lang="ts">
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Movie } from '@/types/movie';
import { useRouter } from 'vue-router';
import MovieRating from './MovieRating.vue';
import type { MediaType } from '@/types/types';
import { Badge } from './ui/badge';

interface HeroCarouselProps {
  movies: Movie[];
}
defineProps<HeroCarouselProps>();

const router = useRouter();

function openDetailView(id: number, mediaType: MediaType = 'movie') {
  router.push({
    name: 'view',
    params: { id: id.toString(), type: mediaType }
  });
}
</script>
<template>
  <h1 class="scroll-m-20 px-16 py-4 text-2xl font-extrabold tracking-tight lg:text-2xl uppercase">
    New & Upcoming Movies In Theaters
  </h1>
  <Carousel
    class="carousel"
    :opts="{
      loop: true
    }"
    :plugins="[
      Autoplay({
        delay: 3000
      })
    ]"
  >
    <CarouselContent>
      <CarouselItem class="relative max-h-[500px]" v-for="(item, index) in movies" :key="index">
        <img
          class="h-full w-full object-cover object-center brightness-50"
          :srcset="
            `https://image.tmdb.org/t/p/original/${item.backdrop_path} 1080w` +
            ', ' +
            `https://image.tmdb.org/t/p/w780/${item.backdrop_path} 768w`
          "
          loading="lazy"
          alt="Movie cover"
        />
        <div class="absolute left-24 right-24 flex h-3/4 gap-4 sm:top-16 top-4">
          <Card
            @click="openDetailView(item.id, item.media_type)"
            class="aspect-2/3 hover:cursor-pointer md:max-w-[264px] h-min min-h-[180px]"
          >
            <CardContent class="w-full p-0">
              <img
                class="h-full w-full rounded-lg object-cover hover:brightness-75 transition-all duration-300 ease-in-out"
                :src="`https://image.tmdb.org/t/p/w342/${item.poster_path}`"
                loading="lazy"
                alt="Movie cover"
              />
            </CardContent>
          </Card>
          <div class="flex flex-col gap-3">
            <h2
              class="scroll-m-20 text-xl font-semibold tracking-tight text-white transition-colors first:mt-0 md:text-3xl"
            >
              {{ item.title }} ({{ item.release_date?.split('-')[0] }})
            </h2>
            <Badge v-if="item.vote_average" variant="secondary" class="max-w-fit">
              <MovieRating :rating="item.vote_average" />
            </Badge>
            <Button @click="openDetailView(item.id, item.media_type)" class="max-w-fit"
              >Find out more</Button
            >
          </div>
        </div>
      </CarouselItem>
    </CarouselContent>
    <CarouselPrevious class="absolute bottom-1/2 left-4" />
    <CarouselNext class="absolute bottom-1/2 right-4" />
  </Carousel>
</template>
<style scoped></style>
