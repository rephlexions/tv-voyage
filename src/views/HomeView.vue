<script setup lang="ts">
import { useShows } from '@/store/shows'
import { storeToRefs } from 'pinia'
import { defineComponent, onMounted } from 'vue'

const showsStore = useShows()
const { sfShows, actionsShows, isRequestLoading } = storeToRefs(showsStore)
</script>

})

<template>
  <main>
    <h1>Home</h1>
    <p>Shows: {{ sfShows }}</p>
  </main>
</template>
