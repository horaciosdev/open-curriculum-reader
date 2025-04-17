<template>
  <div>
    <div class="mb-6 flex justify-end">
      <select
        v-model="selectedTheme"
        class="block w-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      >
        <option v-for="theme in themes" :key="theme.id" :value="theme.id">
          {{ theme.name }}
        </option>
      </select>
    </div>

    <component :is="currentTheme" :resume="resume" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ClassicTheme from './themes/ClassicTheme.vue'
import ModernTheme from './themes/ModernTheme.vue'
import type { Curriculum } from '../types/curriculum' // Importa o tipo Curriculum

const props = defineProps({
  resume: {
    type: Object as () => Curriculum, // Aplica o tipo Curriculum
    required: true
  }
})

const themes = [
  { id: 'classic', name: 'Tema Clássico', component: ClassicTheme },
  { id: 'modern', name: 'Tema Moderno', component: ModernTheme }
]

const selectedTheme = ref('modern')

const currentTheme = computed(() => {
  const theme = themes.find(t => t.id === selectedTheme.value)
  return theme ? theme.component : ModernTheme
})
</script>