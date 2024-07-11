<script setup lang="ts">
import TopNav from './components/TopNav.vue';
import Toaster from '@/components/ui/toast/Toaster.vue';
import { Analytics } from '@vercel/analytics/next';
</script>

<template>
  <TopNav></TopNav>
  <Toaster />
  <Analytics />
  <RouterView></RouterView>
</template>

<style scoped></style>
