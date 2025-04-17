<template>
  <div class="basic-info-editor w-full">
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
          class="flex items-center gap-2 mb-3 p-2 bg-white border border-gray-200 rounded relative"
        >
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

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

// Create a deep copy of the modelValue to avoid direct mutation
const localBasicInfo = ref({
  name: props.modelValue.name || '',
  label: props.modelValue.label || '',
  summary: props.modelValue.summary || '',
  image: props.modelValue.image || '',
  identifiers: props.modelValue.identifiers || [],
  location: {
    address: props.modelValue.location?.address || '',
    city: props.modelValue.location?.city || '',
    region: props.modelValue.location?.region || '',
    countryCode: props.modelValue.location?.countryCode || 'BR'
  },
  profiles: props.modelValue.profiles || []
})

// Watch for changes and emit updates in real-time
watch(localBasicInfo, (newValue) => {
  // Validate required fields before emitting
  if (newValue.name && 
      newValue.summary && 
      newValue.location.city && 
      newValue.location.countryCode && 
      newValue.profiles.length > 0) {
    emit('update:modelValue', newValue)
  }
}, { deep: true })

const addIdentifier = () => {
  localBasicInfo.value.identifiers.push({
    type: 'CPF',
    value: ''
  })
}

const removeIdentifier = (index: number) => {
  localBasicInfo.value.identifiers.splice(index, 1)
}

const addProfile = () => {
  localBasicInfo.value.profiles.push({
    network: 'LinkedIn',
    url: '',
    username: ''
  })
}

const removeProfile = (index: number) => {
  localBasicInfo.value.profiles.splice(index, 1)
}
</script>

<style scoped>
.basic-info-editor input, 
.basic-info-editor textarea, 
.basic-info-editor select {
  max-width: 100%;
  box-sizing: border-box;
}
</style>