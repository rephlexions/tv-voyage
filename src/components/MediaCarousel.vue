<script setup lang="ts">
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
</script>
<template>
  <slot name="carousel-title"></slot>
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
<style scoped></style>
