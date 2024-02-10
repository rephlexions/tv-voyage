<script setup lang="ts">
// import { RouterLink, RouterView } from 'vue-router'
import TopNav from './components/TopNav.vue'
import HomeView from './views/HomeView.vue'
</script>

<template>
  <header>
    <div class="bg-primary">
      <TopNav></TopNav>
    </div>
  </header>
  <HomeView></HomeView>
</template>

<style scoped>
* {
  font-family: 'Inter-Regular' !important;
}
</style>
