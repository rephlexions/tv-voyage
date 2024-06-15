<script setup lang="ts">
import { Card, CardContent, CardFooter } from '@/components/ui/card';

defineProps({
  path: {
    type: String
  },
  releaseDate: {
    type: String
  },
  title: {
    type: String
  },
  voteAverage: {
    type: Number
  }
});
</script>
<template>
  <Card class="hover:cursor-pointer">
    <CardContent class="w-full p-0">
      <img
        class="rounded-lg rounded-b-none object-cover aspect-2/3 hover:brightness-75 transition-all duration-300 ease-in-out"
        :src="`https://image.tmdb.org/t/p/w342/${path}`"
      />
    </CardContent>
    <CardFooter class="flex flex-col gap-1 p-2 w-auto h-[80px] items-start text-sm">
      <slot name="card-footer"></slot>
    </CardFooter>
  </Card>
</template>
<style scoped></style>
