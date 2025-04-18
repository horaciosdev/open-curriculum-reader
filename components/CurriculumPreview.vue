<template>
  <div class="curriculum-preview bg-white min-h-screen">
    <component :is="currentTheme" :curriculum="curriculum" :key="curriculumHash" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import type { Curriculum } from '~/types/curriculum'

const props = defineProps({
  curriculum: {
    type: Object as () => Curriculum,
    required: true
  },
  selectedTheme: {
    type: String,
    required: true
  }
})

const themeComponents = ref<Record<string, any>>({})

// Carrega dinamicamente todos os temas
interface ThemeModule {
  default: Component
}

onMounted(async () => {
  const modules = import.meta.glob<ThemeModule>('./themes/*Theme.vue')

  for (const path in modules) {
    try {
      const module = await modules[path]()
      const fileName = path.split('/').pop()?.replace('.vue', '') || ''
      const themeId = fileName.replace('Theme', '').toLowerCase()

      themeComponents.value[themeId] = module.default
    } catch (error) {
      console.error(`Erro ao carregar tema ${path}:`, error)
    }
  }
})

const currentTheme = computed(() => {
  return themeComponents.value[props.selectedTheme] || Object.values(themeComponents.value)[0]
})

const curriculumHash = computed(() => {
  return JSON.stringify(props.curriculum) + Date.now()
})
</script>