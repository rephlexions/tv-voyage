<script setup lang="ts">
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface MediaCardProps {
  path: string;
}
defineProps<MediaCardProps>();
</script>
<template>
  <Card
    class="hover:cursor-pointer max-w-[221px] border-0 hover:brightness-75 transition-all duration-300 ease-in-out"
  >
    <CardContent class="w-full p-0">
      <img
        v-if="path"
        class="max-h-[332px] rounded-lg rounded-b-none object-cover aspect-2/3"
        :src="`https://image.tmdb.org/t/p/w780/${path}`"
      />
      <img
        v-else
        class="max-h-[332px] rounded-lg rounded-b-none object-cover aspect-2/3"
        src="../assets/no-poster.png"
      />
    </CardContent>
    <CardFooter class="flex flex-col gap-0.5 p-3 items-start text-sm">
      <slot name="card-footer"></slot>
    </CardFooter>
  </Card>
</template>
<style scoped></style>
