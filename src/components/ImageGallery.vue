<script setup lang="ts">
import { ref } from 'vue';
import { watchOnce } from '@vueuse/core';
import { Carousel, type CarouselApi, CarouselContent, CarouselItem } from './ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { Card, CardContent } from './ui/card';
import type { Image } from '../types/types';

interface ImageGalleryProps {
  images: Image[];
}
defineProps<ImageGalleryProps>();

const emblaMainApi = ref<CarouselApi>();
const emblaThumbnailApi = ref<CarouselApi>();
const selectedIndex = ref(0);

function onSelect() {
  if (!emblaMainApi.value || !emblaThumbnailApi.value) return;
  selectedIndex.value = emblaMainApi.value.selectedScrollSnap();
  emblaThumbnailApi.value.scrollTo(emblaMainApi.value.selectedScrollSnap());
}

function onThumbClick(index: number) {
  if (!emblaMainApi.value || !emblaThumbnailApi.value) return;
  emblaMainApi.value.scrollTo(index);
}

watchOnce(emblaMainApi, (emblaMainApi) => {
  if (!emblaMainApi) return;

  onSelect();
  emblaMainApi.on('select', onSelect);
  emblaMainApi.on('reInit', onSelect);
});
</script>

<template>
  <div class="w-full sm:w-auto">
    <Carousel
      class="relative w-full"
      @init-api="(val) => (emblaMainApi = val)"
      :opts="{
        loop: true
      }"
      :plugins="[
        Autoplay({
          delay: 5000
        })
      ]"
    >
      <CarouselContent>
        <CarouselItem v-for="(image, index) in images" :key="index">
          <div class="p-1 max-h-[600px]">
            <Card class="border-0">
              <CardContent class="p-0">
                <img
                  class="rounded-lg rounded-b-none object-cover w-full"
                  :src="`https://image.tmdb.org/t/p/w780/${image.file_path}`"
                />
              </CardContent>
            </Card>
          </div>
        </CarouselItem>
      </CarouselContent>
    </Carousel>

    <Carousel class="relative w-full" @init-api="(val) => (emblaThumbnailApi = val)">
      <CarouselContent class="flex gap-1 ml-0">
        <CarouselItem
          v-for="(image, index) in images"
          :key="index"
          class="pl-0 basis-1/4 cursor-pointer"
          @click="onThumbClick(index)"
        >
          <div class="p-1" :class="index === selectedIndex ? '' : 'opacity-50'">
            <Card class="border-0">
              <CardContent class="p-0">
                <img
                  class="object-cover aspect-2/3 hover:brightness-75 transition-all duration-300 ease-in-out"
                  :src="`https://image.tmdb.org/t/p/w780/${image.file_path}`"
                />
              </CardContent>
            </Card>
          </div>
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  </div>
</template>
