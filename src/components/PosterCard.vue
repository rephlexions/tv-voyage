<script setup lang="ts">
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import dayjs from 'dayjs'

defineProps({
  path: {
    type: String
  },
  releaseDate: {
    type: String
  },
  title: {
    type: String
  }
})
</script>
<template>
  <Card class="hover:cursor-pointer">
    <CardContent class="w-full p-0">
      <img
        class="rounded-lg object-cover aspect-2/3"
        :src="`https://image.tmdb.org/t/p/original/${path}`"
      />
    </CardContent>
    <CardFooter class="flex flex-col p-1 w-auto h-[80px] align-middle justify-center">
      <p v-if="title" class="text-slate-300 text-center">{{ title }}</p>
      <p v-if="releaseDate" class="text-slate-400 text-left">
        {{ dayjs(releaseDate, 'YYYY MMMM DD').year() }}
      </p>
    </CardFooter>
  </Card>
</template>
<style scoped></style>
