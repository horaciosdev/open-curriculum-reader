<template>
  <div class="references-editor w-full">
    <div class="space-y-6">
      <div
        v-for="(reference, index) in localReferences"
        :key="index"
        class="mb-4 bg-gray-50 p-4 rounded-lg border border-gray-200 relative"
      >
        <button
          type="button"
          @click="removeReference(index)"
          class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded"
        >
          <XMarkIcon class="w-3 h-3" />
        </button>

        <div class="grid grid-cols-2 gap-3 mb-3">
          <div class="col-span-2">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="name">
              Nome
            </label>
            <input
              v-model="reference.name"
              type="text"
              placeholder="Nome da referência*"
              required
              class="w-full px-3 py-2 border rounded border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div class="col-span-2">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="reference">
              Referência
            </label>
            <textarea
              v-model="reference.reference"
              placeholder="Detalhes da referência*"
              required
              class="w-full px-3 py-2 border rounded border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            ></textarea>
          </div>
        </div>
      </div>

      <button
        type="button"
        @click="addReference"
        class="w-full bg-blue-500 text-white px-4 py-2 rounded mt-2"
      >
        Adicionar Referência
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { ref, watch } from 'vue'
import type { Curriculum } from '../../types/curriculum'

// Define props com o tipo Curriculum['references']
const props = defineProps({
  modelValue: {
    type: Array as () => Curriculum['references'],
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

// Cria uma cópia local do modelValue com o tipo correto
const localReferences = ref<Curriculum['references']>(
  (props.modelValue || []).map(reference => ({
    name: reference.name || '',
    reference: reference.reference || ''
  }))
)

// Observa mudanças e emite atualizações
watch(localReferences, (newValue) => {
  emit('update:modelValue', newValue)
}, { deep: true })

// Função para adicionar uma nova referência
function addReference() {
  localReferences.value?.push({
    name: '',
    reference: ''
  })
}

// Função para remover uma referência
function removeReference(index: number) {
  localReferences.value?.splice(index, 1)
}
</script>