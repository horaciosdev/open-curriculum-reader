<template>
  <div class="interests-editor w-full">
    <div class="space-y-6">
      <div
        v-for="(interest, index) in localInterests"
        :key="index"
        class="mb-4 bg-gray-50 p-4 rounded-lg border border-gray-200 relative"
      >
        <button
          type="button"
          @click="removeInterest(index)"
          class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded"
        >
          <XMarkIcon class="w-3 h-3" />
        </button>

        <div class="grid grid-cols-2 gap-3 mb-3">
          <div class="col-span-2">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="name">
              Nome do Interesse
            </label>
            <input
              v-model="interest.name"
              type="text"
              placeholder="Nome do interesse*"
              required
              class="w-full px-3 py-2 border rounded border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div class="col-span-2">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="keywords">
              Palavras-chave
            </label>
            <div
              v-if="Array.isArray(interest.keywords)"
              v-for="(keyword, keywordIndex) in interest.keywords"
              :key="keywordIndex"
              class="flex items-center gap-2 mb-2"
            >
              <input
                v-model="interest.keywords[keywordIndex]"
                type="text"
                placeholder="Palavra-chave"
                class="flex-grow px-3 py-2 border rounded border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="button"
                @click="removeKeyword(index, keywordIndex)"
                class="bg-red-500 text-white text-xs px-2 py-1 rounded"
              >
                <XMarkIcon class="w-3 h-3" />
              </button>
            </div>
            <button
              type="button"
              @click="addKeyword(index)"
              class="w-full bg-blue-500 text-white px-4 py-2 rounded mt-2"
            >
              Adicionar Palavra-chave
            </button>
          </div>
        </div>
      </div>

      <button
        type="button"
        @click="addInterest"
        class="w-full bg-blue-500 text-white px-4 py-2 rounded mt-2"
      >
        Adicionar Interesse
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { ref, watch } from 'vue'
import type { Curriculum } from '../../types/curriculum'

// Define props com o tipo Curriculum['interests']
const props = defineProps({
  modelValue: {
    type: Array as () => Curriculum['interests'],
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

// Cria uma cópia local do modelValue com o tipo correto
const localInterests = ref<Curriculum['interests']>(
  (props.modelValue || []).map(interest => ({
    name: interest.name || '',
    keywords: interest.keywords || []
  }))
)

// Observa mudanças e emite atualizações
watch(localInterests, (newValue) => {
  // Valida campos obrigatórios antes de emitir
  const validInterests = newValue?.filter(interest =>
    interest.name
  )

  emit('update:modelValue', validInterests)
}, { deep: true })

// Função para adicionar um novo interesse
function addInterest() {
  localInterests.value?.push({
    name: '',
    keywords: []
  })
}

// Função para remover um interesse
function removeInterest(index: number) {
  localInterests.value?.splice(index, 1)
}

// Função para adicionar uma palavra-chave
function addKeyword(interestIndex: number) {
  localInterests.value?.[interestIndex].keywords?.push('')
}

// Função para remover uma palavra-chave
function removeKeyword(interestIndex: number, keywordIndex: number) {
  localInterests.value?.[interestIndex].keywords?.splice(keywordIndex, 1)
}
</script>