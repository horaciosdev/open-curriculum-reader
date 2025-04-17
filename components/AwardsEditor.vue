<template>
  <div class="awards-editor w-full">
    <div class="space-y-6">
      <div
        v-for="(award, index) in localAwards"
        :key="index"
        class="mb-4 bg-gray-50 p-4 rounded-lg border border-gray-200 relative"
      >
        <button
          type="button"
          @click="removeAward(index)"
          class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded"
        >
          <XMarkIcon class="w-3 h-3" />
        </button>

        <div class="grid grid-cols-2 gap-3 mb-3">
          <div class="col-span-2">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="title">
              Título do Prêmio
            </label>
            <input
              v-model="award.title"
              type="text"
              placeholder="Título do prêmio*"
              required
              class="w-full px-3 py-2 border rounded border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-gray-700 text-sm font-bold mb-2" for="date">
              Data
            </label>
            <input
              v-model="award.date"
              type="date"
              required
              class="w-full px-3 py-2 border rounded border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-gray-700 text-sm font-bold mb-2" for="awarder">
              Concedido por
            </label>
            <input
              v-model="award.awarder"
              type="text"
              placeholder="Nome da entidade que concedeu o prêmio*"
              required
              class="w-full px-3 py-2 border rounded border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <button
        type="button"
        @click="addAward"
        class="w-full bg-blue-500 text-white px-4 py-2 rounded mt-2"
      >
        Adicionar Prêmio
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { ref, watch } from 'vue'
import type { Curriculum } from '../types/curriculum'

// Define props com o tipo Curriculum['awards']
const props = defineProps({
  modelValue: {
    type: Array as () => Curriculum['awards'],
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

// Cria uma cópia local do modelValue com o tipo correto
const localAwards = ref<Curriculum['awards']>(
  (props.modelValue || []).map(award => ({
    title: award.title || '',
    date: award.date || '',
    awarder: award.awarder || ''
  }))
)

// Observa mudanças e emite atualizações
watch(localAwards, (newValue) => {
  // Valida campos obrigatórios antes de emitir
  const validAwards = newValue?.filter(award =>
    award.title &&
    award.date &&
    award.awarder
  )

  emit('update:modelValue', validAwards)
}, { deep: true })

// Função para adicionar um novo prêmio
function addAward() {
  localAwards.value?.push({
    title: '',
    date: '',
    awarder: ''
  })
}

// Função para remover um prêmio
function removeAward(index: number) {
  localAwards.value?.splice(index, 1)
}
</script>