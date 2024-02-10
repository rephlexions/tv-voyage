<script setup lang="ts">
import { useShows } from '@/store/shows'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import type { Genre } from '@/types/Genre'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'
import { Card, CardContent } from '@/components/ui/card'

const showsStore = useShows()
const { genres, latestShows, firstCarousel, secondCarousel, isRequestLoading } =
  storeToRefs(showsStore)

onMounted(() => {
  showsStore.fetchShows().then(() => {
    const types = ['Science-Fiction', 'Action', 'Romance']
    types.forEach((type, index) => {
      const genreIndex = genres.value.findIndex((genre: Genre) => genre.name === type)
      if (genreIndex) {
        const genre: Genre = genres.value[genreIndex]
        showsStore.setShowsByGenre(genre, index)
      }
    })
    showsStore.setTopShows(10)
    showsStore.setLatestShows(4)
  })
})
</script>

})

<template>
  <main class="bg-primary text-primary-foreground">
    <Carousel
      class="carousel dark"
      :opts="{
        loop: true
      }"
    >
      <CarouselContent class="carousel__content">
        <CarouselItem v-for="(item, index) in latestShows" :key="index">
          <Card class="carousel-card">
            <CardContent class="carousel-card__content">
              <div class="carousel-show">
                <div class="carousel-show__image">
                  <img :src="item.image.background" alt="Show cover" />
                </div>
                <div class="carousel-show__title-wrapper">
                  <h1 class="carousel-show__title">{{ item.name }}</h1>
                  <div class="carousel-show__description" v-html="item.summary"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>

    <h2>Science-Fiction</h2>
    <div class="shows">
      <div class="shows__card" v-for="show in firstCarousel" :key="show.id">
        <img :src="show.image.medium" alt="Show cover" srcset="" />
        <h2>{{ show.name }}</h2>
      </div>
    </div>
    <h2>Action</h2>
    <div class="shows">
      <div class="shows__card" v-for="show in secondCarousel" :key="show.id">
        <img :src="show.image.medium" alt="Show cover" srcset="" />
        <h2>{{ show.name }}</h2>
      </div>
    </div>
  </main>
</template>
<style scoped>
.shows__card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.shows {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
}

.carousel {
  width: 100%;
  height: 80vh;
  margin-left: auto;
  margin-right: auto;
  border: none;
}

.carousel__content {
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
}
</style>
