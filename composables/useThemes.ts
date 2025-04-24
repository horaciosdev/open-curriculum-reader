// composables/useThemes.ts
import { ref, computed } from 'vue'

// Importações estáticas dos temas
import Classic from '~/components/themes/Classic.vue'
import Modern from '~/components/themes/Modern.vue'
import RPG from '~/components/themes/RPG.vue'
// Importe outros temas aqui se necessário

export function useThemes() {
  // Lista de temas disponíveis
  const availableThemes = [
    { id: 'classic', name: 'Classic', component: Classic },
    { id: 'modern', name: 'Modern', component: Modern },
    { id: 'rpg', name: 'RPG', component: RPG },
    // Adicione outros temas aqui
  ]

  const selectedThemeId = ref('classic')

  // Componente do tema atual
  const currentThemeComponent = computed(() => {
    const theme = availableThemes.find(t => t.id === selectedThemeId.value)
    return theme?.component || Classic
  })

  return {
    themes: availableThemes,
    selectedThemeId,
    currentThemeComponent
  }
}