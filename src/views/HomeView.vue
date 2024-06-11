<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Ref } from 'vue'
import { tmdb } from '@/api/tmdb'
import type { MovieCollection, Movie } from '@/types/types'
import { useToast } from '@/components/ui/toast/use-toast'
import HeroCarousel from '@/components/HeroCarousel.vue'
import PosterCard from '@/components/PosterCard.vue'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'
import { Button } from '@/components/ui/button'

const { toast } = useToast()

const nowPlaying: Ref<Movie[]> = ref([])
const upcoming: Ref<Movie[]> = ref([])
const topRated: Ref<Movie[]> = ref([])
onMounted(async () => {
  Promise.all([
    tmdb.nowPlaying(),
    tmdb.topRated(),
    tmdb.upcoming(),
    tmdb.trendingMovies({ language: 'en-US' })
  ])
    .then((results) => {
      nowPlaying.value = (results[0] as MovieCollection).results.slice(0, 5)
      topRated.value = (results[1] as MovieCollection).results.slice(0, 15)
      upcoming.value = (results[2] as MovieCollection).results.slice(0, 5)
    })
    .catch((error) => {
      toast({
        title: 'An error occurred',
        description: `${error}`,
        variant: 'destructive'
      })
    })
})
</script>

<template>
  <main class="bg-primary text-primary-foreground">
    <HeroCarousel :shows="[...nowPlaying, ...upcoming]"></HeroCarousel>
    <div class="p-16">
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
          <CarouselItem
            v-for="(item, index) in topRated"
            :key="index"
            class="md:basis-1/4 lg:basis-1/6"
          >
            <PosterCard
              class=""
              :key="item.id"
              :path="item.poster_path"
              :release-date="item.release_date"
              :title="item.title"
              :vote-average="item.vote_average"
            ></PosterCard>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  </main>
</template>
<style scoped></style>
