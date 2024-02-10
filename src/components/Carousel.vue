<script setup lang="ts">
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'
import { Card, CardContent } from '@/components/ui/card'
import type { Show } from '@/types/Show'
import type { PropType } from 'vue'

defineProps({
  shows: {
    type: Array as PropType<Show[]>,
    required: true
  }
})
</script>
<template>
  <Carousel
    class="carousel dark"
    :opts="{
      align: 'start'
    }"
  >
    <CarouselContent>
      <CarouselItem
        v-for="(show, index) in shows"
        :key="index"
        class="carousel-item pl-2 md:basis-1/3 lg:basis-1/6"
      >
        <Card class="carousel-card">
          <CardContent class="carousel-card__content">
            <img :src="show.image.medium" alt="Show cover" />
          </CardContent>
        </Card>
      </CarouselItem>
    </CarouselContent>
    <CarouselPrevious />
    <CarouselNext />
  </Carousel>
</template>
<style scoped>
.carousel {
  width: 100%;
  height: 80vh;
  margin-left: auto;
  margin-right: auto;
}
.carousel-card__content {
  padding: 0;
  margin: 0;
}

.carousel-card {
  width: fit-content;
  width: 330;
  height: 500;
}

.carousel-item {
  width: 330px;
  height: 500px;
}

.carousel button:first-of-type,
.carousel button:last-of-type {
  top: 150px;
}
/* .carousel-card {
  border: none;
}

.carousel-card__content {
  padding: 0;
  margin: 0;
  width: 100%;
}

.carousel-show {
  position: relative;
  max-height: inherit;
}

.carousel-show__image::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(270deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.671));
}

.carousel-show img {
  width: 100%;
  height: 80vh;
  object-fit: cover;
}

.carousel-show__title-wrapper {
  position: absolute;
  top: 30%;
  margin-left: 10%;
  left: 16px;
  color: #fff;
}

.carousel-show__title {
  font-size: 80px;
  font-weight: 700;
  margin-bottom: 16px;
}

.carousel-show__description {
  font-size: 13px;
  width: 600px;
}

.carousel button:first-of-type {
  left: 30px;
}
.carousel button:last-of-type {
  right: 30px;
} */
</style>
