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
import { useRouter } from 'vue-router'

defineProps({
  shows: {
    type: Array as PropType<Show[]>,
    required: true
  }
})

const router = useRouter()

const openDetailPage = (id: number) => {
  router.push({ path: `/show/${id}` })
}
</script>
<template>
  <Carousel
    class="carousel dark"
    :opts="{
      align: 'start',
      loop: true
    }"
  >
    <CarouselContent>
      <CarouselItem
        v-for="(show, index) in shows"
        :key="index"
        class="carousel-item sm:basis-1/2 md:basis-1/3 lg:basis-1/5"
      >
        <Card @click="openDetailPage(show.id)" class="carousel-card">
          <CardContent class="carousel-card__content">
            <img v-if="show.image" :src="show.image.original" alt="Show cover" />
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
  height: min-content;
}

.carousel div div {
  gap: 30px;
}
.carousel-card__content {
  padding: 0;
  margin: 0;
  display: block;
  width: 100%;
  height: auto;
  overflow: hidden;
}
.carousel-card__content img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  aspect-ratio: 2/3;
}

.carousel-card {
  width: fit-content;
  height: fit-content;
}

.carousel-card:hover {
  cursor: pointer;
}

.carousel-item {
  /* width: 20rem;
  height: 30rem; */
}

.carousel button:first-of-type,
.carousel button:last-of-type {
  top: 15rem;
}
</style>
