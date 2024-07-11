<script setup lang="ts">
import { Card, CardContent, CardFooter } from '@/components/ui/card';
</script>
<template>
  <Card
    class="hover:cursor-pointer max-w-[221px] border-0 hover:brightness-75 transition-all duration-300 ease-in-out"
  >
    <CardContent class="w-full p-0">
      <slot name="card-content"></slot>
    </CardContent>
    <CardFooter class="flex flex-col gap-0.5 p-3 items-start text-sm">
      <slot name="card-footer"></slot>
    </CardFooter>
  </Card>
</template>
<style scoped></style>
