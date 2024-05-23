<script setup lang="ts">
import { computed } from 'vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-vue-next'
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const search = ref('')
const router = useRouter()
const route = useRoute()

const isDetailPage = computed(() => {
  return route.params.id || route.params.query ? true : false
})

const setSearch = () => {
  router.push({ path: `/search/${search.value}` })
}
const goBack = () => {
  router.back()
}
</script>
<template>
  <nav class="topNav bg-primary">
    <div class="topNav__left">
      <a href="/" class="topNav__logo"> <img src="../assets/logo.svg" alt="TV Voyage logo" /></a>
      <Button v-if="isDetailPage" @click="goBack" class="back-button dark">
        <ChevronLeft class="w-4 h-4" />
      </Button>
    </div>

    <div class="topNav__input-wrapper">
      <Input
        v-model="search"
        class="topNav__input dark"
        id="search"
        type="text"
        placeholder="Type your favorite TV show..."
      />
      <Button class="dark" @click="setSearch" type="submit">Search</Button>
    </div>
  </nav>
</template>
<style scoped>
.topNav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}

.topNav__left {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 16px;
}
.topNav__logo {
  margin-left: 40px;
}

.topNav__logo:hover {
  cursor: pointer;
}

.topNav__input-wrapper {
  display: flex;
  gap: 16px;
  margin-right: 40px;
}
.topNav__input {
  width: 250px;
  color: #fff;
}
</style>
