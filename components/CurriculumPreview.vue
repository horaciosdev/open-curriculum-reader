<template>
  <div>
    <component :is="currentTheme" :curriculum="curriculum" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ClassicTheme from './themes/ClassicTheme.vue'
import ModernTheme from './themes/ModernTheme.vue'
import type { Curriculum } from '../types/curriculum'

const props = defineProps({
  curriculum: {
    type: Object as () => Curriculum,
    required: true
  },
  selectedTheme: {
    type: String as PropType<'classic' | 'modern'>,
    required: true
  }
})

// Mapeamento de temas disponíveis
const themes = {
  classic: ClassicTheme,
  modern: ModernTheme
}

// Computa o tema atual com base na prop `selectedTheme`
const currentTheme = computed(() => themes[props.selectedTheme as keyof typeof themes] || ModernTheme)
</script>