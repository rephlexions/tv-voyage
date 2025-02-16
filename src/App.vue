<script setup lang="ts">
import TopNav from './components/TopNav.vue';
import Toaster from '@/components/ui/toast/Toaster.vue';
import Footer from '@/components/Footer.vue';
</script>

<template>
	<TopNav></TopNav>
	<Toaster />
	<RouterView class="max-w-[1920px]"></RouterView>
	<Footer></Footer>
</template>

<style scoped></style>
