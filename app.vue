<template>
  <div class="min-h-screen bg-gray-100">
    <div class="flex h-screen">
      <!-- Barra lateral esquerda com ícones -->
      <div class="w-16 bg-gray-800 flex flex-col items-center py-4 space-y-4">
        <button
          v-for="section in sections"
          :key="section.id"
          @click="activeSection = section.id"
          class="p-2 rounded-lg hover:bg-gray-700 transition-colors"
          :class="{ 'bg-gray-700': activeSection === section.id }"
        >
          <component
            :is="section.icon"
            class="w-6 h-6 text-white"
          />
        </button>
      </div>

      <!-- Painel de edição -->
      <div
        class="w-96 bg-white border-r border-gray-200 overflow-y-auto"
        v-if="activeSection"
      >
        <div class="p-4">
          <h2 class="text-lg font-semibold mb-4">{{ getActiveSectionTitle() }}</h2>
          <!-- Componente de edição será renderizado aqui -->
          <component
            :is="getEditorComponent()"
            v-if="resume"
            v-model="resume[activeSection]"
          />
        </div>
      </div>

      <!-- Visualização do currículo -->
      <div class="flex-1 overflow-y-auto p-8">
        <div class="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
          <template v-if="resume">
            <!-- Preview do currículo será renderizado aqui -->
            <ResumePreview :resume="resume" />
          </template>
          <template v-else>
            <div class="text-center py-12">
              <h3 class="text-lg font-medium text-gray-900 mb-4">
                Nenhum currículo carregado
              </h3>
              <div class="space-x-4">
                <button
                  @click="createNewResume"
                  class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Criar Novo
                </button>
                <button
                  @click="openFileInput"
                  class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Carregar Arquivo
                </button>
                <input
                  ref="fileInput"
                  type="file"
                  accept=".curriculum"
                  class="hidden"
                  @change="handleFileUpload"
                >
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  UserIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  DocumentCheckIcon,
  WrenchScrewdriverIcon,
  HeartIcon,
  TrophyIcon,
  DocumentTextIcon,
  StarIcon,
  UserGroupIcon
} from '@heroicons/vue/24/outline'
import BasicInfoEditor from '~/components/BasicInfoEditor.vue'
import WorkExperienceEditor from '~/components/WorkExperienceEditor.vue'

const sections = [
  { id: 'basics', icon: UserIcon, title: 'Informações Básicas' },
  { id: 'work', icon: BriefcaseIcon, title: 'Experiência Profissional' },
  { id: 'education', icon: AcademicCapIcon, title: 'Educação' },
  { id: 'certifications', icon: DocumentCheckIcon, title: 'Certificações' },
  { id: 'skills', icon: WrenchScrewdriverIcon, title: 'Habilidades' },
  { id: 'volunteer', icon: HeartIcon, title: 'Trabalho Voluntário' },
  { id: 'awards', icon: TrophyIcon, title: 'Prêmios' },
  { id: 'publications', icon: DocumentTextIcon, title: 'Publicações' },
  { id: 'interests', icon: StarIcon, title: 'Interesses' },
  { id: 'references', icon: UserGroupIcon, title: 'Referências' }
]

const resume = ref(null)
const activeSection = ref(null)
const fileInput = ref(null)

const getActiveSectionTitle = () => {
  const section = sections.find(s => s.id === activeSection.value)
  return section ? section.title : ''
}

const getEditorComponent = () => {
  const componentMap = {
    basics: BasicInfoEditor,
    work: WorkExperienceEditor,
    // Add other section editors as they are created
  }
  return componentMap[activeSection.value]
}

const createNewResume = () => {
  resume.value = {
    meta: {
      formatVersion: '1.0.0',
      createdAt: new Date().toISOString(),
      language: 'pt'
    },
    basics: {
      name: '',
      label: '',
      summary: '',
      location: {
        city: '',
        countryCode: 'BR'
      },
      profiles: []
    },
    work: [],
    // Add other sections as needed
  }
  activeSection.value = 'basics'
}

const openFileInput = () => {
  fileInput.value?.click()
}

const handleFileUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  try {
    const text = await file.text()
    resume.value = JSON.parse(text)
    activeSection.value = 'basics'
  } catch (error) {
    alert('Erro ao carregar o arquivo. Certifique-se que é um arquivo .curriculum válido.')
  }
}
</script>