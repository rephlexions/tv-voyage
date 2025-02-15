<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { watch } from 'vue';
import { tmdb } from '@/api/tmdb';
import { useToast } from '@/components/ui/toast/use-toast';
import dayjs from 'dayjs';
import type { JSONValue, MediaType, MovieCreditsResults, Person, TVCreditsResults } from '@/types/types';
import { isError } from '@/utils/utils';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/vue';
import { useRouter } from 'vue-router';
import MediaCarousel from '@/components/MediaCarousel.vue';
import CarouselItem from '@/components/ui/carousel/CarouselItem.vue';
import MediaCard from '@/components/MediaCard.vue';
import { ScrollArea } from '@/components/ui/scroll-area';
import MovieRating from '@/components/MovieRating.vue';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { Gender } from '@/enums/enums';
import type { Movie } from '@/types/movie';

const route = useRoute();
const router = useRouter();
const { toast } = useToast();
const showBackButton = ref(false);
let personID = route.params.id as string;
const defaultAccordionValue = 'item-2';

let person = ref<Person | null>(null);
let movieCredits = ref<MovieCreditsResults | null>(null);
let tvCredits = ref<TVCreditsResults | null>(null);

const bestCredits = computed(() => {
	if (movieCredits.value && movieCredits.value.cast.length) {
		const credits = [...movieCredits.value.cast];
		credits.sort((a, b) => b.popularity - a.popularity);

		return credits.slice(0, 10);
	}
	return null;
});

const actingCredits = computed(() => {
	if (movieCredits.value) {
		const credits: Movie[] = [...movieCredits.value.cast];
		return credits;
	}
	return null;
});

const accordionItems = computed(() => {
	return [
		{
			value: 'item-1',
			title: 'Upcoming',
			content: actingCredits.value?.filter((item) => item.release_date === '' || dayjs(item.release_date).isAfter(dayjs())),
		},
		{
			value: 'item-2',
			title: 'Released',
			content: actingCredits.value
				?.filter((item) => dayjs(item.release_date).isBefore(dayjs()))
				.sort((a, b) => b.release_date.localeCompare(a.release_date)),
		},
	];
});

function getDetails() {
	Promise.allSettled([tmdb.personDetail(personID), tmdb.personMovieCredits(personID), tmdb.personTvCredits(personID)])
		.then((results) => {
			const handlers = [
				(value: JSONValue) => {
					person.value = value as Person;
				},
				(value: JSONValue) => {
					movieCredits.value = value as MovieCreditsResults;
				},
				(value: JSONValue) => {
					tvCredits.value = value as TVCreditsResults;
				},
			];

			results.forEach((result, index) => {
				try {
					if (result.status === 'fulfilled') {
						if (isError(result.value)) {
							throw new Error(result.value.message);
						} else {
							handlers[index](result.value);
						}
					} else if (result.status === 'rejected') {
						throw new Error(result.reason);
					}
				} catch (error) {
					toast({
						title: 'A server error occurred',
						description: `${error}`,
						variant: 'destructive',
					});
				}
			});
		})
		.catch((error) => {
			toast({
				title: 'A network error occurred',
				description: `${error}`,
				variant: 'destructive',
			});
		});
}

function goBack() {
	router.go(-1);
}

function openDetailView(id: number, mediaType: MediaType = 'movie') {
	router.push({
		name: 'view',
		params: { id: id.toString(), type: mediaType },
	});
}

onMounted(() => {
	if (route.meta.fromWithinApp) {
		showBackButton.value = true;
	}
	getDetails();
});

watch(
	() => route.params.id,
	(newId) => {
		personID = newId as string;
		getDetails();
	},
);
</script>
<template>
	<main class="bg-primary p-16 pt-4">
		<Button v-if="showBackButton" @click="goBack" class="mb-4 dark">
			<Icon icon="akar-icons:arrow-left" />
		</Button>
		<div v-if="person" class="flex flex-col md:flex-row gap-16">
			<div class="flex flex-col gap-4">
				<div class="min-w-[300px] w-[300px]">
					<img
						class="object-cover aspect-2/3 rounded-lg"
						:src="`https://image.tmdb.org/t/p/w780/${person.profile_path}`"
						loading="lazy"
					/>
				</div>
				<div class="flex flex-col gap-1">
					<h3 class="text-md font-semibold tracking-tight text-white transition-colors md:text-2xl mb-4">Personal details</h3>
					<h4 class="text-md font-bold text-white">Known for</h4>
					<p>{{ person.known_for_department }}</p>
					<Separator />
					<h4 class="text-md font-bold text-white">Gender</h4>
					<p>{{ Gender[person.gender] }}</p>
					<Separator />
					<h4 class="text-md font-bold text-white">Birthday</h4>
					<p>{{ dayjs(person.birthday).format('MMMM D, YYYY') }}</p>
					<Separator />
					<h4 class="text-md font-bold text-white">Place of birth</h4>
					<p>{{ person.place_of_birth }}</p>
					<Separator v-if="person.deathday" />
					<h4 v-if="person.deathday" class="text-md font-bold text-white">Died</h4>
					<p v-if="person.deathday">{{ dayjs(person.deathday).format('MMMM D, YYYY') }}</p>
					<Separator />
					<h4 class="text-md font-bold text-white">Also known as</h4>
					<p v-for="(item, index) in person.also_known_as" :key="index">{{ item }}</p>
				</div>
			</div>

			<div class="flex flex-col w-full">
				<div class="mb-4">
					<h1 class="text-xl font-bold tracking-tight text-white transition-colors md:text-3xl mb-4">
						{{ person.name }}
					</h1>
					<div v-if="person.biography">
						<h3 class="text-md font-semibold tracking-tight text-white transition-colors md:text-2xl mb-1">Biography</h3>
						<ScrollArea class="h-[200px] rounded-md">
							<p class="text-sm text-white mb-4 w-full">
								{{ person.biography }}
							</p>
						</ScrollArea>
					</div>
				</div>
				<MediaCarousel>
					<template v-slot:carousel-title>
						<h3 class="text-md font-semibold tracking-tight text-white transition-colors md:text-2xl mb-4">Best known for</h3>
					</template>
					<template v-slot:carousel-item>
						<CarouselItem v-for="item in bestCredits" :key="item.id" class="basis-1/2 sm:basis-1/3 md:basis-1/4 xl:basis-1/6">
							<MediaCard @click="openDetailView(item.id, item.media_type)" class="max-w-[220px]">
								<template v-slot:card-content>
									<img
										v-if="item.backdrop_path"
										class="max-h-[332px] rounded-lg rounded-b-none object-cover aspect-2/3"
										:src="`https://image.tmdb.org/t/p/w780/${item.backdrop_path}`"
										loading="lazy"
									/>
									<img
										v-else
										src="../assets/no-poster.png"
										class="h-[123px] max-h-[123px] w-[223px] object-cover aspect-2/3"
									/>
								</template>
								<template v-slot:card-footer>
									<div class="h-[60px] flex flex-col justify-around">
										<span class="text-slate-800 font-semibold">
											{{ item.title }} ({{ dayjs(item.release_date, 'YYYY MMMM DD').year() }})
										</span>
										<MovieRating :rating="item.vote_average" />
									</div>
								</template>
							</MediaCard>
						</CarouselItem>
					</template>
				</MediaCarousel>
				<h3 class="text-xl font-bold tracking-tight text-white transition-colors first:mt-0 md:text-2xl mt-6">Credits</h3>
				<Accordion type="single" class="w-full h-full" collapsible :default-value="defaultAccordionValue">
					<AccordionItem v-for="item in accordionItems" :key="item.value" :value="item.value">
						<AccordionTrigger class="text-md font-semibold">{{ item.title }}</AccordionTrigger>
						<AccordionContent v-if="item.content">
							<ScrollArea class="h-[600px] rounded-md p-4">
								<div v-for="(media, index) in item.content" :key="media.id" class="flex flex-col flex-wrap gap-4 mb-4">
									<div class="flex flex-row flex-nowrap gap-1">
										<div
											@click="openDetailView(media.id, 'movie')"
											class="min-w-[80px] w-[80px] hover:cursor-pointer hover:brightness-75 transition-all duration-300 ease-in-out"
										>
											<img
												v-if="media.poster_path"
												class="object-cover aspect-2/3 rounded-lg"
												:src="`https://image.tmdb.org/t/p/w780/${media.poster_path}`"
												loading="lazy"
												alt="Movie poster"
											/>
											<img
												v-else
												class="max-h-[332px] rounded-lg object-cover aspect-2/3"
												src="../assets/no-poster.png"
												loading="lazy"
												alt="No poster"
											/>
										</div>
										<div class="flex flex-col justify-between p-4">
											<h4
												@click="openDetailView(media.id, 'movie')"
												class="text-md font-bold text-white hover:cursor-pointer hover:underline"
											>
												{{ media.title }}
											</h4>
											<p class="text-sm to-slate-400">{{ media.character }}</p>
											<p v-if="media.release_date" class="text-sm text-white">
												{{ dayjs(media.release_date).format('MMMM D, YYYY') }}
											</p>
										</div>
									</div>
									<Separator v-if="item.content?.length && index < item.content?.length - 1" />
								</div>
							</ScrollArea>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</div>
		</div>
	</main>
</template>
