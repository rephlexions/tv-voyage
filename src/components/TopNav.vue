<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const search = ref('')
const router = useRouter()

const setSearch = () => {
  router.push({ path: `/search/${search.value}` })
}
</script>
<template>
  <nav class="topNav bg-primary">
    <a href="/" class="topNav__logo"> <img src="../assets/logo.svg" alt="TV Voyage logo" /></a>
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
