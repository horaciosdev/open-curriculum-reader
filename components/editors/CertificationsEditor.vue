<template>
    <div class="certifications-editor w-full">
        <div class="space-y-6">
            <div v-for="(certification, index) in localCertifications" :key="index"
                class="mb-4 bg-gray-50 p-4 rounded-lg border border-gray-200 relative">
                <button type="button" @click="removeCertification(index)"
                    class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    <XMarkIcon class="w-3 h-3" />
                </button>

                <div class="grid grid-cols-2 gap-3 mb-3">
                    <div class="col-span-2">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="name">
                            Nome da Certificação
                        </label>
                        <input v-model="certification.name" type="text" placeholder="Nome da certificação*" required
                            class="w-full px-3 py-2 border rounded border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                    </div>

                    <div class="col-span-2">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="issuer">
                            Emitido por
                        </label>
                        <input v-model="certification.issuer" type="text" placeholder="Organização emissora*" required
                            class="w-full px-3 py-2 border rounded border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                    </div>

                    <div>
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="date">
                            Data de Emissão
                        </label>
                        <input v-model="certification.date" type="date" required
                            class="w-full px-3 py-2 border rounded border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                    </div>

                    <div>
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="url">
                            URL da Certificação
                        </label>
                        <input v-model="certification.url" type="url" placeholder="Link para a certificação (opcional)"
                            class="w-full px-3 py-2 border rounded border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                    </div>
                </div>
            </div>

            <button type="button" @click="addCertification"
                class="w-full bg-blue-500 text-white px-4 py-2 rounded mt-2">
                Adicionar Certificação
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { ref, watch } from 'vue'
import type { Curriculum } from '../../types/curriculum'

// Define props com o tipo Curriculum['certifications']
const props = defineProps({
    modelValue: {
        type: Array as () => Curriculum['certifications'],
        required: true
    }
})

const emit = defineEmits(['update:modelValue'])

// Cria uma cópia local do modelValue com o tipo correto
const localCertifications = ref<Curriculum['certifications']>(
    props.modelValue?.map(certification => ({
        name: certification.name || '',
        issuer: certification.issuer || '',
        date: certification.date || '',
        url: certification.url || ''
    })) ?? []
)

// Observa mudanças e emite atualizações
watch(localCertifications, (newValue) => {
    emit('update:modelValue', newValue)
}, { deep: true })

// Função para adicionar uma nova certificação
function addCertification() {
    localCertifications.value?.push({
        name: '',
        issuer: '',
        date: '',
        url: ''
    })
}

// Função para remover uma certificação
function removeCertification(index: number) {
    localCertifications.value?.splice(index, 1)
}
</script>