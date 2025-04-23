<template>
  <div class="skills-editor w-full">
    <div class="space-y-6">
      <div v-for="(skill, index) in localSkills" :key="index"
        class="mb-4 bg-gray-50 p-4 rounded-lg border border-gray-200 relative">
        <button type="button" @click="removeSkill(index)"
          class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
          <XMarkIcon class="w-3 h-3" />
        </button>

        <div class="grid grid-cols-2 gap-3 mb-3">
          <div class="col-span-2">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="name">
              Nome da Habilidade
            </label>
            <input v-model="skill.name" type="text" placeholder="Nome da habilidade*" required
              class="w-full px-3 py-2 border rounded border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
          </div>

          <div class="col-span-2">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="category">
              Categoria
            </label>
            <select v-model="skill.category"
              class="w-full px-3 py-2 border rounded border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
              <option value="hard">Habilidades Técnicas</option>
              <option value="soft">Habilidades Comportamentais</option>
              <option value="cloud">Computação em Nuvem</option>
              <option value="devops">DevOps</option>
              <option value="language">Idiomas</option>
              <option value="framework">Frameworks</option>
              <option value="tool">Ferramentas</option>
              <option value="methodology">Metodologias</option>
              <option value="management">Gestão</option>
              <option value="design">Design</option>
              <option value="communication">Comunicação</option>
              <option value="other">Outro</option>
            </select>
          </div>

          <div class="col-span-2">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="keywords">
              Palavras-chave
            </label>
            <div v-if="skill && skill.keywords" v-for="(keyword, keywordIndex) in skill.keywords" :key="keywordIndex"
              class="flex items-center gap-2 mb-2">
              <input v-model="skill.keywords[keywordIndex]" type="text" placeholder="Palavra-chave"
                class="flex-grow px-3 py-2 border rounded border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
              <button type="button" @click="removeKeyword(index, keywordIndex)"
                class="bg-red-500 text-white text-xs px-2 py-1 rounded">
                <XMarkIcon class="w-3 h-3" />
              </button>
            </div>
            <button type="button" @click="addKeyword(index)"
              class="w-full bg-blue-500 text-white px-4 py-2 rounded mt-2">
              Adicionar Palavra-chave
            </button>
          </div>
        </div>
      </div>

      <button type="button" @click="addSkill" class="w-full bg-blue-500 text-white px-4 py-2 rounded mt-2">
        Adicionar Habilidade
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { ref, watch } from 'vue'
import { Curriculum } from 'open-cvt'

// Define props com o tipo Curriculum['skills']
const props = defineProps({
  modelValue: {
    type: Array as () => Curriculum['skills'],
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

// Cria uma cópia local do modelValue com o tipo correto
const localSkills = ref<Curriculum['skills']>(
  props.modelValue?.map(skill => ({
    name: skill.name || '',
    category: skill.category || '',
    keywords: skill.keywords || []
  })) ?? []
)

// Observa mudanças e emite atualizações
watch(localSkills, (newValue) => {
  emit('update:modelValue', newValue)
}, { deep: true })

// Função para adicionar uma nova habilidade
function addSkill() {
  localSkills.value?.push({
    name: '',
    category: '',
    keywords: []
  })
}

// Função para remover uma habilidade
function removeSkill(index: number) {
  localSkills.value?.splice(index, 1)
}

// Função para adicionar uma palavra-chave
function addKeyword(skillIndex: number) {
  localSkills.value?.[skillIndex].keywords?.push('')
}

// Função para remover uma palavra-chave
function removeKeyword(skillIndex: number, keywordIndex: number) {
  localSkills.value?.[skillIndex].keywords?.splice(keywordIndex, 1)
}
</script>