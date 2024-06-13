<script setup lang="ts">
import TopNav from './components/TopNav.vue';
import Toaster from '@/components/ui/toast/Toaster.vue';
</script>

<template>
  <TopNav></TopNav>
  <Toaster />
  <RouterView></RouterView>
</template>

<style scoped></style>
