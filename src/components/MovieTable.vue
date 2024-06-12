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
import { Badge } from '@/components/ui/badge';
import type { PropType } from 'vue';
import type { Movie } from '@/types/types';
import MovieRating from './MovieRating.vue';
import dayjs from 'dayjs';
import { storeToRefs } from 'pinia';
import { useGenresStore } from '@/store/genres';

defineProps({
  movies: {
    type: Array as PropType<Movie[]>,
    required: true
  },
  label: {
    type: String
  }
});

const genresStore = useGenresStore();
const { allGenres } = storeToRefs(genresStore);
</script>
<template>
  <Table>
    <TableCaption>{{ label }}</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead class="w-min"> Title </TableHead>
        <TableHead class="w-[350px]">Genres</TableHead>
        <!-- <TableHead class="w-[200px]">Release date</TableHead> -->
        <TableHead class="text-right"> Score </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="(movie, index) in movies" :key="index">
        <TableCell class="font-bold w-min text-nowrap"> {{ movie.title || movie.name }} </TableCell>
        <TableCell class="flex gap-1 flex-nowrap">
          <Badge v-for="genreId in movie.genre_ids" :key="genreId" :variant="'secondary'">
            {{ allGenres.find((genre) => genre.id === genreId)?.name }}
          </Badge>
        </TableCell>
        <!-- <TableCell>
          {{ dayjs(movie.release_date).format('DD-MM-YYYY') }}
        </TableCell> -->
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
