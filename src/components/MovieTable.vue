<script setup lang="ts">
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import type { PropType } from 'vue';
import type { Movie } from '@/types/types';
import MovieRating from './MovieRating.vue';
import dayjs from 'dayjs';

defineProps({
  movies: {
    type: Array as PropType<Movie[]>,
    required: true
  }
});
</script>
<template>
  <Table>
    <TableCaption>A list of your recent invoices.</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead class="w-[300px]"> Title </TableHead>
        <TableHead class="w-[200px]">Genres</TableHead>
        <TableHead class="w-[200px]">Release date</TableHead>
        <TableHead class="text-right"> Score </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="(movie, index) in movies" :key="index">
        <TableCell class="font-bold"> {{ movie.title }} </TableCell>
        <TableCell>{{ movie.genre_ids }}</TableCell>
        <TableCell>
          {{ dayjs(movie.release_date).format('DD-MM-YYYY') }}
        </TableCell>
        <TableCell>
          <MovieRating
            class="ml-auto"
            v-if="movie.vote_average"
            :rating="movie.vote_average"
          ></MovieRating>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
<style scoped></style>
