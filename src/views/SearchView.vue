<script setup lang="ts">
import { tmdb } from '@/api/tmdb';
import type { MediaType, QueryObject, SearchResults } from '@/types/types';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
import { isError } from '@/utils/utils';
import { useToast } from '@/components/ui/toast/use-toast';
import MediaCard from '@/components/MediaCard.vue';
import MovieRating from '@/components/MovieRating.vue';
import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev
} from '@/components/ui/pagination';
import Button from '@/components/ui/button/Button.vue';
import { Icon } from '@iconify/vue';

const { toast } = useToast();
const route = useRoute();
const router = useRouter();
const searchQuery = ref<string>(route.params.query as string);

const searchResults = ref<SearchResults | null>(null);
const currentPage = ref<number>(1);
const showBackButton = ref(false);

watch(
  () => currentPage.value,
  () => {
    searchMedia();
  }
);

watch(
  () => route.params.query,
  () => {
    searchQuery.value = route.params.query as string;
    searchMedia();
  }
);

function openDetailView(id: number, mediaType: MediaType) {
  router.push({
    name: 'view',
    params: { id: id.toString(), type: mediaType }
  });
}

function goBack() {
  router.go(-1);
}

function searchMedia() {
  const query: QueryObject = { query: searchQuery.value, page: currentPage.value.toString() };

  try {
    tmdb.searchMulti(query).then((results) => {
      if (isError(results)) {
        throw new Error(results.message);
      }
      searchResults.value = results as SearchResults;
    });
  } catch (error) {
    toast({
      title: 'An error occurred',
      description: `${error}`,
      variant: 'destructive'
    });
  }
}

onMounted(() => {
  if (route.meta.fromWithinApp) {
    showBackButton.value = true;
  }
  searchMedia();
});
</script>
<template>
  <main class="bg-primary">
    <Button v-if="showBackButton" @click="goBack" class="mx-16 mb-4 dark">
      <Icon icon="akar-icons:arrow-left" />
    </Button>
    <div class="flex flex-col px-16 pt-4 pb-16">
      <h1 class="text-4xl text-white">Search results for "{{ searchQuery }}"</h1>
      <div class="flex flex-row flex-wrap gap-4 mt-10">
        <template v-if="searchResults">
          <MediaCard
            v-for="result in searchResults.results"
            :key="result.id"
            :path="result.poster_path"
            class=""
            @click="openDetailView(result.id, result.media_type)"
          >
            <template v-slot:card-footer>
              <div class="h-[60px] flex flex-col justify-between">
                <span class="text-slate-800 font-semibold">
                  {{ result.name || result.original_title }} ({{
                    dayjs(result.first_air_date || result.release_date).year()
                  }})
                </span>
                <MovieRating v-if="result.vote_average" :rating="result.vote_average" />
                <span v-else class="text-slate-400">Upcoming</span>
              </div>
            </template>
          </MediaCard>
        </template>
      </div>
      <Pagination
        v-slot="{ page }"
        v-model:page="currentPage"
        :total="searchResults?.total_results"
        :items-per-page="20"
        :sibling-count="1"
        show-edges
        :default-page="1"
        class="flex justify-center mt-10"
      >
        <PaginationList v-slot="{ items }" class="flex items-center gap-1">
          <PaginationFirst />
          <PaginationPrev />

          <template v-for="(item, index) in items">
            <PaginationListItem
              v-if="item.type === 'page'"
              :key="index"
              :value="item.value"
              as-child
            >
              <Button class="w-10 h-10 p-0" :variant="item.value === page ? 'default' : 'outline'">
                {{ item.value }}
              </Button>
            </PaginationListItem>
            <PaginationEllipsis v-else :key="item.type" :index="index" />
          </template>

          <PaginationNext />
          <PaginationLast />
        </PaginationList>
      </Pagination>
    </div>
  </main>
</template>
<style scoped></style>
