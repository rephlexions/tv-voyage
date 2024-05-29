<script setup lang="ts">
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Show } from '@/types/types'
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
      loop: true
    }"
    :plugins="[
      Autoplay({
        delay: 5000
      })
    ]"
  >
    <CarouselContent class="carousel__content">
      <CarouselItem v-for="(item, index) in shows" :key="index">
        <Card class="carousel-card">
          <CardContent class="carousel-card__content">
            <div class="carousel-show">
              <div v-if="item.image" class="carousel-show__image">
                <img :src="item.image.background" alt="Show cover" />
              </div>
              <div class="carousel-show__title-wrapper">
                <h1 class="carousel-show__title">
                  {{ item.name }}
                </h1>
                <div class="carousel-show__description" v-html="item.summary"></div>
                <Button @click="openDetailPage(item.id)">Find out more</Button>
              </div>
            </div>
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

.carousel-card {
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
  text-align: left;
}

.carousel-show__title {
  margin-bottom: 16px;
}

.carousel-show__description {
  font-size: 13px;
  width: 600px;
  margin-bottom: 16px;
}

.carousel button:first-of-type {
  left: 30px;
}
.carousel button:last-of-type {
  right: 30px;
}
@media screen and (max-width: 600px) {
  .carousel-show__description {
    padding-right: 160px;
  }
}
</style>
