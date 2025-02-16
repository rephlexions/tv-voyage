<script setup lang="ts">
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';

const search = ref('');
const router = useRouter();

const setSearch = () => {
	router.push({ path: `/search/${search.value}` });
};
</script>
<template>
	<nav class="bg-primary flex justify-between align-middle h-16 pr-10 pl-10 pt-4">
		<RouterLink to="/" class="hover:cursor-pointer"> <img src="../assets/logo.svg" alt="Home" /></RouterLink>

		<div class="flex gap-4">
			<Input v-model="search" class="dark" id="search" type="text" placeholder="Search" aria-label="Search input" />
			<Button class="dark" @click="setSearch" type="submit" aria-label="Search button">Search</Button>
		</div>
	</nav>
</template>
<style scoped></style>
