<!-- components/CurriculumPreview.vue -->
<template>
  <div class="curriculum-preview bg-white min-h-screen">
    <component :is="themeComponent" :curriculum="curriculum" />
  </div>
</template>

<script setup lang="ts">
import { Curriculum } from 'open-cvt'

const props = defineProps({
  curriculum: {
    type: Object as () => Curriculum,
    required: true
  },
  themeComponent: {
    type: Object,
    required: true
  }
})
</script>