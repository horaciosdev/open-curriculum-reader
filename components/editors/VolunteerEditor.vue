<template>
    <div class="volunteer-editor w-full">
        <div class="space-y-6">
            <div v-for="(volunteer, index) in localVolunteer" :key="index"
                class="mb-4 bg-gray-50 p-4 rounded-lg border border-gray-200 relative">
                <button type="button" @click="removeVolunteer(index)"
                    class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    <XMarkIcon class="w-3 h-3" />
                </button>

                <div class="grid grid-cols-2 gap-3 mb-3">
                    <div class="col-span-2">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="organization">
                            Organização
                        </label>
                        <input v-model="volunteer.organization" type="text" placeholder="Nome da organização*" required
                            class="w-full px-3 py-2 border rounded border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                    </div>

                    <div class="col-span-2">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="position">
                            Posição
                        </label>
                        <input v-model="volunteer.position" type="text" placeholder="Posição ou cargo*" required
                            class="w-full px-3 py-2 border rounded border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                    </div>

                    <div>
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="startDate">
                            Data de Início
                        </label>
                        <input v-model="volunteer.startDate" type="date" required
                            class="w-full px-3 py-2 border rounded border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                    </div>

                    <div>
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="endDate">
                            Data de Término
                        </label>
                        <input v-model="volunteer.endDate" type="date" placeholder="Deixe vazio se for atual"
                            class="w-full px-3 py-2 border rounded border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                    </div>

                    <div class="col-span-2">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="highlights">
                            Destaques
                        </label>
                        <div v-if="Array.isArray(volunteer.highlights)" v-for="(highlight, highlightIndex) in volunteer.highlights" :key="highlightIndex"
                            class="flex items-center gap-2 mb-2">
                            <input v-model="volunteer.highlights[highlightIndex]" type="text" placeholder="Destaque"
                                class="flex-grow px-3 py-2 border rounded border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                            <button type="button" @click="removeHighlight(index, highlightIndex)"
                                class="bg-red-500 text-white text-xs px-2 py-1 rounded">
                                <XMarkIcon class="w-3 h-3" />
                            </button>
                        </div>
                        <button type="button" @click="addHighlight(index)"
                            class="w-full bg-blue-500 text-white px-4 py-2 rounded mt-2">
                            Adicionar Destaque
                        </button>
                    </div>
                </div>
            </div>

            <button type="button" @click="addVolunteer" class="w-full bg-blue-500 text-white px-4 py-2 rounded mt-2">
                Adicionar Trabalho Voluntário
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { ref, watch } from 'vue'
import type { Curriculum } from '../../types/curriculum'

// Define props com o tipo Curriculum['volunteer']
const props = defineProps({
    modelValue: {
        type: Array as () => Curriculum['volunteer'],
        required: true
    }
})

const emit = defineEmits(['update:modelValue'])

// Cria uma cópia local do modelValue com o tipo correto
const localVolunteer = ref<Curriculum['volunteer']>(
    (props.modelValue || []).map(volunteer => ({
        organization: volunteer.organization || '',
        position: volunteer.position || '',
        startDate: volunteer.startDate || '',
        endDate: volunteer.endDate ?? null, // Garante que endDate seja null ou string
        highlights: volunteer.highlights || []
    }))
)

// Observa mudanças e emite atualizações
watch(localVolunteer, (newValue) => {
    emit('update:modelValue', newValue)
}, { deep: true })

// Função para adicionar um novo trabalho voluntário
function addVolunteer() {
    localVolunteer.value?.push({
        organization: '',
        position: '',
        startDate: '',
        endDate: null,
        highlights: []
    })
}

// Função para remover um trabalho voluntário
function removeVolunteer(index: number) {
    localVolunteer.value?.splice(index, 1)
}

// Função para adicionar um destaque
function addHighlight(volunteerIndex: number) {
    localVolunteer.value?.[volunteerIndex].highlights?.push('')
}

// Função para remover um destaque
function removeHighlight(volunteerIndex: number, highlightIndex: number) {
    localVolunteer.value?.[volunteerIndex].highlights?.splice(highlightIndex, 1)
}
</script>