<template>
  <div class="publications-editor w-full">
    <div class="space-y-6">
      <div
        v-for="(publication, index) in localPublications"
        :key="index"
        class="mb-4 bg-gray-50 p-4 rounded-lg border border-gray-200 relative"
      >
        <button
          type="button"
          @click="removePublication(index)"
          class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded"
        >
          <XMarkIcon class="w-3 h-3" />
        </button>

        <div class="grid grid-cols-2 gap-3 mb-3">
          <div class="col-span-2">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="name">
              Nome da Publicação
            </label>
            <input
              v-model="publication.name"
              type="text"
              placeholder="Nome da publicação*"
              required
              class="w-full px-3 py-2 border rounded border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-gray-700 text-sm font-bold mb-2" for="publisher">
              Publicado por
            </label>
            <input
              v-model="publication.publisher"
              type="text"
              placeholder="Nome do publicador*"
              required
              class="w-full px-3 py-2 border rounded border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-gray-700 text-sm font-bold mb-2" for="releaseDate">
              Data de Publicação
            </label>
            <input
              v-model="publication.releaseDate"
              type="date"
              required
              class="w-full px-3 py-2 border rounded border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div class="col-span-2">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="url">
              URL
            </label>
            <input
              v-model="publication.url"
              type="url"
              placeholder="Link para a publicação*"
              required
              class="w-full px-3 py-2 border rounded border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <button
        type="button"
        @click="addPublication"
        class="w-full bg-blue-500 text-white px-4 py-2 rounded mt-2"
      >
        Adicionar Publicação
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { ref, watch } from 'vue'
import type { Curriculum } from '../types/curriculum'

// Define props com o tipo Curriculum['publications']
const props = defineProps({
  modelValue: {
    type: Array as () => Curriculum['publications'],
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

// Cria uma cópia local do modelValue com o tipo correto
const localPublications = ref<Curriculum['publications']>(
  (props.modelValue || []).map(publication => ({
    name: publication.name || '',
    publisher: publication.publisher || '',
    releaseDate: publication.releaseDate || '',
    url: publication.url || ''
  }))
)

// Observa mudanças e emite atualizações
watch(localPublications, (newValue) => {
  // Valida campos obrigatórios antes de emitir
  const validPublications = newValue?.filter(publication =>
    publication.name &&
    publication.publisher &&
    publication.releaseDate &&
    publication.url
  )

  emit('update:modelValue', validPublications)
}, { deep: true })

// Função para adicionar uma nova publicação
function addPublication() {
  localPublications.value?.push({
    name: '',
    publisher: '',
    releaseDate: '',
    url: ''
  })
}

// Função para remover uma publicação
function removePublication(index: number) {
  localPublications.value?.splice(index, 1)
}
</script>