<script setup lang="ts">
import { Icon } from '@iconify/vue';

defineProps({
  rating: {
    type: Number,
    required: true
  }
});
</script>
<template>
  <div class="flex items-center gap-1 max-w-fit">
    <Icon icon="openmoji:star" class="text-xl" />
    <span class="text-slate-900">{{ rating.toFixed(2) }}</span>
  </div>
</template>
<style scoped></style>
