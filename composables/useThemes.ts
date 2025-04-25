// composables/useThemes.ts
import { ref, computed } from 'vue'

// Importações estáticas dos temas
import Purist from '~/components/themes/Purist.vue'
import Essential from '~/components/themes/Essential.vue'
import Enhanced from '~/components/themes/Enhanced.vue'
import Sophisticated from '~/components/themes/Sophisticated.vue'
import Premium from '~/components/themes/Premium.vue'
import Classic from '~/components/themes/Classic.vue'
import Modern from '~/components/themes/Modern.vue'
import RPG from '~/components/themes/RPG.vue'
import Vibrant from '~/components/themes/Vibrant.vue'
// Importe outros temas aqui se necessário

export function useThemes() {
  // Lista de temas disponíveis
  const availableThemes = [
    { id: 'purist', name: 'Purist', component: Purist },
    { id: 'essential', name: 'Essential', component: Essential },
    { id: 'enhanced', name: 'Enhanced', component: Enhanced },
    { id: 'sophisticated', name: 'Sophisticated', component: Sophisticated },
    { id: 'premium', name: 'Premium', component: Premium },
    { id: 'classic', name: 'Classic', component: Classic },
    { id: 'modern', name: 'Modern', component: Modern },
    { id: 'rpg', name: 'RPG', component: RPG },
    { id: 'vibrant', name: 'Vibrant', component: Vibrant },
    // Adicione outros temas aqui
  ]

  const selectedThemeId = ref('premium') // Tema padrão

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