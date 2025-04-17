<template>
  <div class="basic-info-editor w-full">
    <div class="mb-6 flex justify-center relative">
      <input
        type="file"
        ref="imageUpload"
        @change="handleImageUpload"
        accept="image/*"
        class="hidden"
      />
      <div
        @click="triggerImageUpload"
        @dragover.prevent="dragOver"
        @dragleave.prevent="dragLeave"
        @drop.prevent="handleDrop"
        :class="[
          'relative w-40 h-40 rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors group',
          isDragging ? 'bg-blue-100 border-blue-300' : 'bg-gray-100 border-dashed border-gray-300 hover:bg-gray-200'
        ]"
      >
        <div
          v-if="!localBasicInfo.image"
          class="text-center text-gray-500 flex flex-col items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-2 text-gray-400 group-hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span class="text-sm">
            {{ isDragging ? 'Solte a imagem aqui' : 'Adicionar Foto' }}
          </span>
        </div>
        <img
          v-else
          :src="localBasicInfo.image"
          alt="Profile"
          class="w-full h-full object-cover rounded-full"
        />
        <button
          v-if="localBasicInfo.image"
          @click.stop="removeImage"
          class="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
        >
          <XMarkIcon class="w-4 h-4" />
        </button>
      </div>
    </div>

    <div class="space-y-6">
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="name">
          Nome Completo
        </label>
        <input
          v-model="localBasicInfo.name"
          type="text"
          id="name"
          class="w-full px-3 py-2 border rounded border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="label">
          Título Profissional
        </label>
        <input
          v-model="localBasicInfo.label"
          type="text"
          id="label"
          class="w-full px-3 py-2 border rounded border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="summary">
          Resumo Profissional
        </label>
        <textarea
          v-model="localBasicInfo.summary"
          id="summary"
          class="w-full px-3 py-2 border rounded border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          rows="4"
          required
        ></textarea>
      </div>

      <div class="mb-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <label class="block text-gray-700 text-sm font-bold mb-3">
          Identificadores
        </label>
        <div
          v-for="(identifier, index) in localBasicInfo.identifiers"
          :key="index"
          class="flex items-center gap-2 mb-3 p-2 bg-white border border-gray-200 rounded relative"
        >
          <select
            v-model="identifier.type"
            class="flex-shrink-0 w-auto px-2 py-2 border rounded border-gray-300"
          >
            <option value="CPF">CPF</option>
            <option value="CNPJ">CNPJ</option>
            <option value="Passport">Passaporte</option>
            <option value="Other">Outro</option>
          </select>
          <input
            v-model="identifier.value"
            type="text"
            class="flex-grow px-3 py-2 border rounded border-gray-300 min-w-0"
            :placeholder="`Digite o ${identifier.type}`"
          />
          <button
            type="button"
            @click="removeIdentifier(index)"
            class="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded"
          >
            <XMarkIcon class="w-3 h-3" />
          </button>
        </div>
        <button
          type="button"
          @click="addIdentifier"
          class="w-full bg-blue-500 text-white px-4 py-2 rounded mt-2"
        >
          Adicionar Identificador
        </button>
      </div>

      <div class="mb-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <label class="block text-gray-700 text-sm font-bold mb-3">
          Localização
        </label>
        <div class="grid grid-cols-2 gap-3">
          <input
            v-model="localBasicInfo.location.city"
            type="text"
            placeholder="Cidade*"
            required
            class="w-full px-3 py-2 border rounded border-gray-300 col-span-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <input
            v-model="localBasicInfo.location.region"
            type="text"
            placeholder="Estado (Sigla)"
            class="w-full px-3 py-2 border rounded border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <input
            v-model="localBasicInfo.location.countryCode"
            type="text"
            placeholder="País* (BR)"
            required
            class="w-full px-3 py-2 border rounded border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <input
            v-model="localBasicInfo.location.address"
            type="text"
            placeholder="Endereço (opcional)"
            class="w-full px-3 py-2 border rounded border-gray-300 col-span-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div class="mb-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <label class="block text-gray-700 text-sm font-bold mb-3">
          Perfis
        </label>
        <div
          v-for="(profile, index) in localBasicInfo.profiles"
          :key="index"
          class="flex flex-col gap-2 mb-3 p-2 bg-white border border-gray-200 rounded relative"
        >
          <div class="flex items-center gap-2">
            <select
              v-model="profile.network"
              class="flex-shrink-0 w-auto px-2 py-2 border rounded border-gray-300"
            >
              <option value="LinkedIn">LinkedIn</option>
              <option value="GitHub">GitHub</option>
              <option value="Lattes">Lattes</option>
              <option value="Other">Outro</option>
            </select>
            <input
              v-model="profile.url"
              type="url"
              placeholder="URL do Perfil*"
              required
              class="flex-grow px-3 py-2 border rounded border-gray-300 min-w-0"
            />
          </div>
          <input
            v-model="profile.username"
            type="text"
            placeholder="Nome de Usuário (opcional)"
            class="w-full px-3 py-2 border rounded border-gray-300"
          />
          <button
            type="button"
            @click="removeProfile(index)"
            class="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded"
          >
            <XMarkIcon class="w-3 h-3" />
          </button>
        </div>
        <button
          type="button"
          @click="addProfile"
          class="w-full bg-blue-500 text-white px-4 py-2 rounded mt-2"
        >
          Adicionar Perfil
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { ref, watch } from 'vue'
import type { Curriculum } from '../../types/curriculum'

// Define props com o tipo Curriculum['basics']
const props = defineProps<{
  modelValue: Curriculum['basics']
}>()

const emit = defineEmits(['update:modelValue'])

// Cria uma cópia local do modelValue para evitar mutação direta
const localBasicInfo = ref<Curriculum['basics']>({
  name: props.modelValue.name || '',
  label: props.modelValue.label || '',
  summary: props.modelValue.summary || '',
  image: props.modelValue.image || '',
  identifiers: props.modelValue.identifiers || [],
  location: {
    address: props.modelValue.location?.address || '',
    city: props.modelValue.location.city || '',
    region: props.modelValue.location?.region || '',
    countryCode: props.modelValue.location.countryCode || 'BR'
  },
  profiles: props.modelValue.profiles || []
})

// Observa mudanças e emite atualizações em tempo real
watch(
  localBasicInfo,
  (newValue) => {
    // Valida campos obrigatórios antes de emitir
    if (
      newValue.name &&
      newValue.summary &&
      newValue.location.city &&
      newValue.location.countryCode &&
      newValue.profiles.length > 0
    ) {
      emit('update:modelValue', newValue)
    }
  },
  { deep: true }
)

// Funções para adicionar/remover identificadores
const addIdentifier = () => {
  localBasicInfo.value.identifiers?.push({
    type: 'CPF', // Valor padrão
    value: ''
  })
}

const removeIdentifier = (index: number) => {
  localBasicInfo.value.identifiers?.splice(index, 1)
}

// Funções para adicionar/remover perfis
const addProfile = () => {
  localBasicInfo.value.profiles.push({
    network: 'LinkedIn', // Valor padrão
    url: '',
    username: '' // Campo opcional
  })
}

const removeProfile = (index: number) => {
  localBasicInfo.value.profiles.splice(index, 1)
}

// Funções para upload de imagem
const imageUpload = ref<HTMLInputElement | null>(null)

const handleImageUpload = (event: any) => {
  const file = event.target.files[0]
  const reader = new FileReader()
  reader.onload = () => {
    localBasicInfo.value.image = reader.result as string
    emit('update:modelValue', { ...localBasicInfo.value, image: reader.result as string }) // Atualiza o modelo
  }
  reader.readAsDataURL(file)
}

const triggerImageUpload = () => {
  imageUpload.value?.click()
}

const removeImage = () => {
  localBasicInfo.value.image = ''
}

// Funções para arrastar e soltar imagem
const isDragging = ref(false)

const dragOver = () => {
  isDragging.value = true
}

const dragLeave = () => {
  isDragging.value = false
}

const handleDrop = (event: any) => {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  const reader = new FileReader()
  reader.onload = () => {
    localBasicInfo.value.image = reader.result as string
    emit('update:modelValue', { ...localBasicInfo.value, image: reader.result as string }) // Atualiza o modelo
  }
  reader.readAsDataURL(file)
}
</script>