<script setup lang="ts">
import { Icon } from '@iconify/vue'
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
  },
  voteAverage: {
    type: Number
  }
})
</script>
<template>
  <Card class="hover:cursor-pointer">
    <CardContent class="w-full p-0">
      <img
        class="rounded-lg rounded-b-none object-cover aspect-2/3"
        :src="`https://image.tmdb.org/t/p/original/${path}`"
      />
    </CardContent>
    <CardFooter class="flex flex-col gap-1 p-2 w-auto h-[80px] items-start text-sm">
      <div class="flex">
        <div v-if="voteAverage" class="flex items-center gap-1">
          <Icon icon="openmoji:star" class="text-xl" />
          <span class="text-slate-500">{{ voteAverage.toFixed(2) }}</span>
        </div>
        <!-- <div v-if="releaseDate" class="text-slate-500 ml-auto">
          {{ dayjs(releaseDate, 'YYYY MMMM DD').year() }}
        </div> -->
      </div>
      <p v-if="title" class="text-slate-800">
        {{ title }} ({{ dayjs(releaseDate, 'YYYY MMMM DD').year() }})
      </p>
    </CardFooter>
  </Card>
</template>
<style scoped></style>
