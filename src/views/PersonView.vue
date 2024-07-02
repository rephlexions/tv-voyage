<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { watch } from 'vue';
import { tmdb } from '@/api/tmdb';
import { useToast } from '@/components/ui/toast/use-toast';
import dayjs from 'dayjs';
import type { Person } from '@/types/types';
import { isError } from '@/utils/utils';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/vue';
import { useRouter } from 'vue-router';
import MediaCarousel from '@/components/MediaCarousel.vue';
import CarouselItem from '@/components/ui/carousel/CarouselItem.vue';
import MediaCard from '@/components/MediaCard.vue';
import { Gender } from '@/enums/enums';

const route = useRoute();
const router = useRouter();
const { toast } = useToast();
const showBackButton = ref(false);
let personID = route.params.id as string;

let person = ref<Person | null>(null);

async function getPerson() {
  try {
    await tmdb.personDetail(personID).then((result) => {
      if (isError(result)) {
        throw new Error(result.message);
      }
      person.value = result as Person;
    });
  } catch (error) {
    toast({
      title: 'An error occurred',
      description: `${error}`,
      variant: 'destructive'
    });
  }
}

function goBack() {
  router.go(-1);
}

onMounted(() => {
  if (route.meta.fromWithinApp) {
    showBackButton.value = true;
  }
  getPerson();
});
watch(
  () => route.params.id,
  (newId) => {
    personID = newId as string;
    getPerson();
  }
);
</script>
<template>
  <main class="bg-primary p-16 pt-4">
    <Button v-if="showBackButton" @click="goBack" class="mb-4 dark">
      <Icon icon="akar-icons:arrow-left" />
    </Button>
    <div v-if="person" class="flex flex-row gap-8">
      <div>
        <div class="min-w-[300px] w-[300px]">
          <img
            class="object-cover aspect-2/3 rounded-lg"
            :src="`https://image.tmdb.org/t/p/w780/${person.profile_path}`"
          />
        </div>
        <div>
          <h3
            class="scroll-m-20 text-md font-semibold tracking-tight text-white transition-colors first:mt-0 md:text-2xl"
          >
            Personal info
          </h3>
          <h4 class="text-md font-bold text-white">Known for</h4>
          <p>{{ person.known_for_department }}</p>
          <h4 class="text-md font-bold text-white">Gender</h4>
          <p>{{ Gender[person.gender] }}</p>
          <h4 class="text-md font-bold text-white">Birthday</h4>
          <p>{{ dayjs(person.birthday).format('MMMM D, YYYY') }}</p>
          <h4 class="text-md font-bold text-white">Place of birth</h4>
          <p>{{ person.place_of_birth }}</p>
          <h4 class="text-md font-bold text-white" v-if="person.deathday">Death day</h4>
          <p v-if="person.deathday">{{ person.deathday }}</p>
          <h4 class="text-md font-bold text-white">Also Known As</h4>
          <p v-for="(item, index) in person.also_known_as" :key="index">{{ item }}</p>
        </div>
      </div>

      <div class="flex flex-col">
        <div>
          <h1
            class="scroll-m-20 text-xl font-bold tracking-tight text-white transition-colors first:mt-0 md:text-3xl"
          >
            {{ person.name }}
          </h1>
          <h3
            class="scroll-m-20 text-md font-semibold tracking-tight text-white transition-colors first:mt-0 md:text-2xl mt-7"
          >
            Biography
          </h3>
          <p class="scroll-m-20 text-sm text-white mt-1">
            {{ person.biography }}
          </p>
        </div>
        <!-- <MediaCarousel>
          <template v-slot:carousel-title>
            <h2 class="mb-4 text-3xl font-semibold text-slate-100">Cast</h2>
          </template>
          <template v-slot:carousel-item>
            <CarouselItem
              v-for="item in credits?.cast.slice(0, 15)"
              :key="item.id"
              class="basis-1/10"
            >
              <MediaCard
                @click="openPersonDetailView(item.id)"
                :path="item.profile_path"
                class="max-w-[120px]"
              >
                <template v-slot:card-footer>
                  <div class="h-[80px]">
                    <p class="text-slate-800 font-semibold">{{ item.name }}</p>
                    <p class="text-slate-500">{{ item.character }}</p>
                  </div>
                </template>
              </MediaCard>
            </CarouselItem>
          </template>
        </MediaCarousel> -->
      </div>
    </div>
  </main>
</template>
