<script setup lang="ts">
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { storeToRefs } from 'pinia';
import { useGenresStore } from '@/store/genres';
import type { TvShow } from '@/types/tvShow';
import type { Movie } from '@/types/movie';
import MovieRating from './MovieRating.vue';

interface MediaTableProps {
  media: Movie[] | TvShow[];
  label?: string;
}
defineProps<MediaTableProps>();

const genresStore = useGenresStore();
const { allGenres } = storeToRefs(genresStore);
</script>
<template>
  <div class="p-4 pl-0">
    <h2 class="text-2xl font-bold">{{ label }}</h2>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead class="w-min"> Title </TableHead>
          <TableHead class="w-[350px]">Genres</TableHead>
          <TableHead class="text-right"> Score </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="item in media" :key="item.id">
          <TableCell class="font-bold w-min text-nowrap cursor-pointer hover:underline">
            <RouterLink :to="{ name: 'view', params: { id: item.id, type: item.media_type } }">{{
              (item as Movie).title || item.name
            }}</RouterLink>
          </TableCell>
          <TableCell class="flex gap-1 flex-nowrap">
            <Badge
              v-for="genreId in item.genre_ids.slice(0, 1)"
              :key="genreId"
              :variant="'secondary'"
            >
              {{ allGenres.find((genre) => genre.id === genreId)?.name }}
            </Badge>
          </TableCell>
          <TableCell>
            <Badge variant="secondary">
              <MovieRating
                class="ml-auto"
                v-if="item.vote_average"
                :rating="item.vote_average"
              ></MovieRating>
            </Badge>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
<style scoped></style>
