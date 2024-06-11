<template>
  <div class="flex gap-1">
    <h2 class="mb-4 text-3xl font-semibold">Top rated movies</h2>
    <Button class="dark" variant="link">View more</Button>
  </div>
  <Carousel
    class="w-full"
    :opts="{
      align: 'start',
      loop: true
    }"
  >
    <CarouselContent>
      <CarouselItem v-for="(item, index) in movies" :key="index" class="md:basis-1/4 lg:basis-1/6">
        <MovieCard
          class=""
          :key="item.id"
          :path="item.poster_path"
          :release-date="item.release_date"
          :title="item.title"
          :vote-average="item.vote_average"
        ></MovieCard>
      </CarouselItem>
    </CarouselContent>
    <CarouselPrevious />
    <CarouselNext />
  </Carousel>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { Movie } from '@/types/types';
import MovieCard from './MovieCard.vue';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';

defineProps({
  movies: {
    type: Array as PropType<Movie[]>,
    required: true
  },
  label: {
    type: String,
    required: true
  }
});
</script>

<style scoped></style>
