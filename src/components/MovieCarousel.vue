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
      <slot name="carousel-item"> </slot>
    </CarouselContent>
    <CarouselPrevious />
    <CarouselNext />
  </Carousel>
</template>

<script setup lang="ts">
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';

defineProps({
  label: {
    type: String,
    required: true
  }
});
</script>

<style scoped></style>
