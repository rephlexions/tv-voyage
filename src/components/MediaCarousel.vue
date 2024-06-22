<template>
  <div class="flex gap-1">
    <slot name="carousel-title"></slot>
  </div>
  <Carousel
    class="w-full"
    :opts="{
      align: 'start',
      loop: true
    }"
  >
    <CarouselContent>
      <slot name="carousel-item"></slot>
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
</script>

<style scoped></style>
