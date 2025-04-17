<template>
  <div class="min-h-screen bg-gray-100">
    <div class="flex h-screen">
      <!-- Barra lateral esquerda com ícones -->
      <div class="w-16 bg-gray-800 flex flex-col items-center py-4 space-y-4">
        <button v-for="section in sections" :key="section.id" @click="activeSection = section.id"
          class="p-2 rounded-lg hover:bg-gray-700 transition-colors"
          :class="{ 'bg-gray-700': activeSection === section.id }">
          <component :is="section.icon" class="w-6 h-6 text-white" />
        </button>
      </div>

      <!-- Painel de edição -->
      <div class="w-96 bg-white border-r border-gray-200 overflow-y-auto" v-if="activeSection">
        <div class="p-4">
          <h2 class="text-lg font-semibold mb-4">{{ getActiveSectionTitle() }}</h2>
          <!-- Componente de edição será renderizado aqui -->
          <component :is="getEditorComponent()" v-if="curriculum" v-model="curriculum[activeSection]" />
        </div>
      </div>

      <!-- Visualização do currículo -->
      <div class="flex-1 overflow-y-auto p-8">
        <div class="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
          <template v-if="curriculum">
            <!-- Barra de ferramentas -->
            <div class="flex justify-between items-center mb-4">
              <select v-model="selectedTheme"
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option v-for="theme in themes" :key="theme.id" :value="theme.id">
                  {{ theme.name }}
                </option>
              </select>
              <div class="flex space-x-4">
                <button @click="saveCurriculum"
                  class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  Salvar Currículo
                </button>
                <button @click="openFileInput"
                  class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  Carregar Novo Currículo
                </button>
                <input ref="fileInput" type="file" accept=".curriculum" class="hidden" @change="handleFileUpload">
              </div>
            </div>
            <!-- Preview do currículo -->
            <CurriculumPreview :curriculum="curriculum" :selectedTheme="selectedTheme as 'classic' | 'modern'" />
          </template>
          <template v-else>
            <div class="text-center py-12">
              <h3 class="text-lg font-medium text-gray-900 mb-4">
                Nenhum currículo carregado
              </h3>
              <div class="space-x-4">
                <button @click="createNewCurriculum"
                  class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                  Criar Novo
                </button>
                <button @click="openFileInput"
                  class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  Carregar Arquivo
                </button>
                <input ref="fileInput" type="file" accept=".curriculum" class="hidden" @change="handleFileUpload">
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
import type { Curriculum } from '~/types/curriculum'

import BasicInfoEditor from '~/components/editors/BasicInfoEditor.vue'
import WorkExperienceEditor from '~/components/editors/WorkExperienceEditor.vue'
import EducationEditor from '~/components/editors/EducationEditor.vue'
import CertificationsEditor from '~/components/editors/CertificationsEditor.vue'
import SkillsEditor from '~/components/editors/SkillsEditor.vue'
import VolunteerEditor from '~/components/editors/VolunteerEditor.vue'
import AwardsEditor from '~/components/editors/AwardsEditor.vue'
import PublicationsEditor from '~/components/editors/PublicationsEditor.vue'
import InterestsEditor from '~/components/editors/InterestsEditor.vue'
import ReferencesEditor from '~/components/editors/ReferencesEditor.vue'

type ActiveSection = keyof Curriculum;

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

const curriculum = ref<Curriculum | null>(null) // Define o tipo do curriculum
const activeSection = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

const themes = [
  { id: 'classic', name: 'Tema Clássico' },
  { id: 'modern', name: 'Tema Moderno' }
]

const selectedTheme = ref('modern')

const getActiveSectionTitle = () => {
  const section = sections.find(s => s.id === activeSection.value)
  return section ? section.title : ''
}

const getEditorComponent = () => {
  const componentMap = {
    basics: BasicInfoEditor,
    work: WorkExperienceEditor,
    education: EducationEditor,
    certifications: CertificationsEditor,
    skills: SkillsEditor,
    volunteer: VolunteerEditor,
    awards: AwardsEditor,
    publications: PublicationsEditor,
    interests: InterestsEditor,
    references: ReferencesEditor
    // Adicione outros editores conforme necessário
  }
  return activeSection.value ? componentMap[activeSection.value as keyof typeof componentMap] : null
}

const createNewCurriculum = () => {
  curriculum.value = {
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
    education: [],
    certifications: [],
    skills: [],
    volunteer: [],
    awards: [],
    publications: [],
    interests: [],
    references: []
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
    const parsedCurriculum = JSON.parse(text) as Curriculum
    curriculum.value = parsedCurriculum
    activeSection.value = 'basics'
  } catch (error) {
    alert('Erro ao carregar o arquivo. Certifique-se que é um arquivo .curriculum válido.')
  }
}

const saveCurriculum = () => {
  if (!curriculum.value) {
    alert('Nenhum currículo disponível para salvar.')
    return
  }

  // Formatar o nome do arquivo
  const name = curriculum.value.basics?.name?.replace(/\s+/g, '-').toLowerCase() || 'curriculo'
  const rule = curriculum.value.basics?.label?.replace(/\s+/g, '-').toLowerCase() || 'sem-titulo'
  const year = new Date().getFullYear()
  const fileName = `${name}-${rule}-${year}.curriculum`

  // Criar o arquivo JSON
  const fileContent = JSON.stringify(curriculum.value, null, 2)
  const blob = new Blob([fileContent], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  // Criar um link para download
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()

  // Limpar o objeto URL
  URL.revokeObjectURL(url)
}
</script>