<template>
  <div class="work-experience-editor w-full">
    <div class="space-y-6">
      <div
        v-for="(work, index) in localWorkExperience"
        :key="index"
        class="mb-4 bg-gray-50 p-4 rounded-lg border border-gray-200 relative"
      >
        <button
          type="button"
          @click="removeWorkExperience(index)"
          class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded"
        >
          <XMarkIcon class="w-3 h-3" />
        </button>

        <div class="grid grid-cols-2 gap-3 mb-3">
          <div class="col-span-2">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="organization">
              Empresa
            </label>
            <input
              v-model="work.organization"
              type="text"
              placeholder="Nome da empresa*"
              required
              class="w-full px-3 py-2 border rounded border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-gray-700 text-sm font-bold mb-2" for="position">
              Cargo
            </label>
            <input
              v-model="work.position"
              type="text"
              placeholder="Título do cargo*"
              required
              class="w-full px-3 py-2 border rounded border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-gray-700 text-sm font-bold mb-2" for="url">
              Site da Empresa
            </label>
            <input
              v-model="work.url"
              type="url"
              placeholder="URL da empresa (opcional)"
              class="w-full px-3 py-2 border rounded border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-gray-700 text-sm font-bold mb-2" for="startDate">
              Data de Início
            </label>
            <input
              v-model="work.startDate"
              type="month"
              required
              class="w-full px-3 py-2 border rounded border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-gray-700 text-sm font-bold mb-2" for="endDate">
              Data de Término
            </label>
            <input
              v-model="work.endDate"
              type="month"
              placeholder="Deixe em branco para emprego atual"
              class="w-full px-3 py-2 border rounded border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <div class="flex items-center mt-2">
              <input
                type="checkbox"
                id="currentJob"
                :checked="isCurrentJob(index)"
                @change="toggleCurrentJob(index)"
                class="mr-2"
              />
              <label for="currentJob" class="text-sm text-gray-700">
                Emprego Atual
              </label>
            </div>
          </div>

          <div class="col-span-2">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="highlights">
              Principais Realizações
            </label>
            <div
              v-if="work && work.highlights"
              v-for="(highlight, highlightIndex) in work?.highlights"
              :key="highlightIndex"
              class="flex items-center gap-2 mb-2"
            >
              <input
                v-model="work.highlights[highlightIndex]"
                type="text"
                placeholder="Descrição da realização"
                class="flex-grow px-3 py-2 border rounded border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="button"
                @click="removeHighlight(index, highlightIndex)"
                class="bg-red-500 text-white text-xs px-2 py-1 rounded"
              >
                <XMarkIcon class="w-3 h-3" />
              </button>
            </div>
            <button
              type="button"
              @click="addHighlight(index)"
              class="w-full bg-blue-500 text-white px-4 py-2 rounded mt-2"
            >
              Adicionar Realização
            </button>
          </div>
        </div>
      </div>

      <button
        type="button"
        @click="addWorkExperience"
        class="w-full bg-blue-500 text-white px-4 py-2 rounded mt-2"
      >
        Adicionar Experiência Profissional
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { ref, watch, computed } from 'vue'
import type { Curriculum } from '../../types/curriculum'

// Tipar as props com a interface Curriculum
const props = defineProps({
  modelValue: {
    type: Array as () => Curriculum['work'],
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

// Criar uma cópia local do modelValue com o tipo correto
const localWorkExperience = ref<Curriculum['work']>(
  props.modelValue.map(work => ({
    organization: work.organization || '',
    position: work.position || '',
    url: work.url || '',
    startDate: work.startDate || '',
    endDate: work.endDate ?? null,
    highlights: work.highlights || []
  }))
)

// Propriedade computada para verificar se um trabalho é atual
const isCurrentJob = computed(() => (index: number) => {
  return localWorkExperience.value[index].endDate === null
})

// Assistir mudanças e emitir atualizações
watch(localWorkExperience, (newValue) => {
  emit('update:modelValue', newValue)
}, { deep: true })

// Função para adicionar uma nova experiência profissional
function addWorkExperience() {
  localWorkExperience.value.push({
    organization: '',
    position: '',
    url: '',
    startDate: '',
    endDate: null,
    highlights: []
  })
}

// Função para remover uma experiência profissional
function removeWorkExperience(index: number) {
  localWorkExperience.value.splice(index, 1)
}

// Função para adicionar uma realização
function addHighlight(workIndex: number) {
  localWorkExperience.value[workIndex].highlights?.push('')
}

// Função para remover uma realização
function removeHighlight(workIndex: number, highlightIndex: number) {
  localWorkExperience.value[workIndex].highlights?.splice(highlightIndex, 1)
}

// Função para alternar o status de emprego atual
function toggleCurrentJob(index: number) {
  if (localWorkExperience.value[index].endDate === null) {
    localWorkExperience.value[index].endDate = ''
  } else {
    localWorkExperience.value[index].endDate = null
  }
}
</script>