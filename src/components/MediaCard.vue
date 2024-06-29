<script setup lang="ts">
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface MediaCardProps {
  path: string;
}
defineProps<MediaCardProps>();
</script>
<template>
  <Card class="hover:cursor-pointer max-w-[221px] p-0">
    <CardContent class="w-full p-0">
      <img
        class="max-h-[330px] rounded-lg rounded-b-none object-cover aspect-2/3 hover:brightness-75 transition-all duration-300 ease-in-out"
        :src="`https://image.tmdb.org/t/p/w780/${path}`"
      />
    </CardContent>
    <CardFooter class="flex flex-col gap-0.5 p-1 items-start text-sm">
      <slot name="card-footer"></slot>
    </CardFooter>
  </Card>
</template>
<style scoped></style>
