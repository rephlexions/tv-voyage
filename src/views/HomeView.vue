<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Ref } from 'vue'
import { tmdb } from '@/api/tmdb'
import type { MovieCollection, Movie } from '@/types/types'
import { useToast } from '@/components/ui/toast/use-toast'
import HeroCarousel from '@/components/HeroCarousel.vue'
import PosterCard from '@/components/PosterCard.vue'
import { Icon } from '@iconify/vue'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'

const { toast } = useToast()

const nowPlaying: Ref<Movie[]> = ref([])
const topRated: Ref<Movie[]> = ref([])
onMounted(async () => {
  Promise.all([tmdb.nowPlaying(), tmdb.topRated()])
    .then((results) => {
      nowPlaying.value = (results[0] as MovieCollection).results.slice(0, 5)
      topRated.value = (results[1] as MovieCollection).results.slice(0, 15)
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
    <HeroCarousel :shows="nowPlaying"></HeroCarousel>
    <div class="p-16">
      <h2 class="mb-4 text-3xl font-semibold">Top rated movies</h2>
      <a href="">View more</a>
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
            ></PosterCard>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>

    <!-- <div class="flex w-full gap-2 overflow-x-auto min-h-max">
      <PosterCard
        v-for="item in topRated"
        :key="item.id"
        :path="item.poster_path"
        :release-date="item.release_date"
        :title="item.title"
      ></PosterCard>

      <Icon icon="iconamoon:arrow-right-2" class="text-3xl" />
    </div>
    <div
      class="grid grid-flow-col auto-cols-min overflow-x-auto scroll-smooth snap-mandatory gap-4"
    >
      <PosterCard
        v-for="item in topRated"
        class="snap-start w[183px]"
        :key="item.id"
        :path="item.poster_path"
        :release-date="item.release_date"
        :title="item.title"
      ></PosterCard>

      <Icon icon="iconamoon:arrow-right-2" class="text-3xl" />
    </div> -->
  </main>
</template>
<style scoped></style>
