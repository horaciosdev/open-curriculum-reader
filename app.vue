<template>
  <div class="min-h-screen bg-gray-100">
    <div class="flex h-screen">
      <!-- Barra lateral esquerda com ícones -->
      <div v-if="curriculum" class="w-16 bg-gray-800 flex flex-col items-center py-4 space-y-4">
        <button v-for="section in sections" :key="section.id" @click="handleSectionClick(section.id)"
          class="p-2 rounded-lg hover:bg-gray-700 transition-colors"
          :class="{ 'bg-gray-700': activeSection === section.id }">
          <component :is="section.icon" class="w-6 h-6 text-white" />
        </button>
      </div>

      <!-- Painel de edição -->
      <div class="w-[600px] bg-white border-r border-gray-200 overflow-y-auto" v-if="activeSection && curriculum">
        <div class="p-4 pb-96">
          <h2 class="text-lg font-semibold mb-4">{{ getActiveSectionTitle() }}</h2>
          <!-- Componente de edição será renderizado aqui -->
          <component :is="getEditorComponent()" v-if="curriculum" v-model="curriculum[activeSection]" />
        </div>
      </div>

      <!-- Visualização do currículo -->
      <div class="flex-1 overflow-y-auto p-8">

        <!-- Mensagem de erro -->
        <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong class="font-bold">Erro: </strong>
          <span class="block sm:inline">{{ errorMessage }}</span>
        </div>

        <!-- Barra de ferramentas -->
        <div v-if="curriculum"
          class="sticky top-0 z-10 print:hidden max-w-4xl mx-auto rounded-lg shadow-lg p-4 mb-4 border border-gray-400 bg-white">


          <div class="flex justify-between items-center mb-4">
            <!-- Selecione o tema -->
            <select v-model="selectedThemeId"
              class="inline-flex items-center px-4 py-1 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option v-for="theme in themes" :key="theme.id" :value="theme.id">
                {{ theme.name }}
              </option>
            </select>

            <button @click="createNewCurriculum"
              class="inline-flex items-center px-4 py-1 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700">
              Criar Novo
            </button>
          </div>

          <div class="flex flex-wrap gap-2 items-center">
            <div class="flex flex-wrap gap-2 justify-start items-center flex-grow">
              <button @click="printCurriculum"
                class="inline-flex items-center px-4 py-1 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50">
                <PrinterIcon class="mr-2 h-5 w-5" />
                Imprimir
              </button>
              <button @click="saveCurriculum"
                class="inline-flex items-center px-4 py-1 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50">
                <ArrowDownOnSquareIcon class="mr-2 h-5 w-5" />
                Salvar Currículo
              </button>
              <button @click="openFileInput"
                class="inline-flex items-center px-4 py-1 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50">
                <ArrowUpOnSquareIcon class="mr-2 h-5 w-5" />
                Carregar Novo Currículo
              </button>
              <input ref="fileInput" type="file" accept=".cvt" class="hidden" @change="handleFileUpload">
            </div>
            <div class="flex justify-end">
              <button @click="loadExampleCurriculum"
                class="inline-flex items-center px-4 py-1 border border-transparent rounded-md shadow-md text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:bg-gradient-to-l focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition ease-in-out duration-150">
                Currículo de Exemplo
              </button>
            </div>
          </div>

        </div>

        <div class="max-w-8xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-4">
          <template v-if="curriculum">
            <!-- Preview do currículo -->
            <CurriculumPreview :curriculum="curriculum" :themeComponent="currentThemeComponent" />
          </template>
          <template v-else>
            <div class="text-center py-12">
              <h3 class="text-lg font-medium text-gray-900 mb-4">
                Nenhum currículo carregado
              </h3>
              <div class="flex flex-col justify-center gap-4 items-center">
                <div class="flex gap-4">
                  <button @click="loadExampleCurriculum"
                    class="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-md text-md font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition ease-in-out duration-150 animate-pulse">
                    <DocumentArrowDownIcon class="-ml-1 mr-3 h-5 w-5" />
                    Veja o Currículo de Exemplo
                  </button>
                </div>
                <div class="flex gap-4">
                  <span>OU</span>
                </div>
                <div class="flex gap-4">
                  <button @click="createNewCurriculum"
                    class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                    Criar Novo Currículo
                  </button>
                  <button @click="openFileInput"
                    class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    Carregar Arquivo *.cvt
                  </button>
                  <input ref="fileInput" type="file" accept=".cvt" class="hidden" @change="handleFileUpload">
                </div>
              </div>
            </div>
          </template>
        </div>
        <About v-if="!curriculum" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
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
  UserGroupIcon,
  ArrowUpOnSquareIcon,
  ArrowDownOnSquareIcon,
  PrinterIcon,
  PlusIcon,
  DocumentArrowDownIcon
} from '@heroicons/vue/24/outline'

import { validate, Curriculum } from 'open-cvt'

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

import { useThemes } from '~/composables/useThemes'
const { themes, selectedThemeId, currentThemeComponent } = useThemes()

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

const errorMessage = ref<string | null>(null)

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

const handleSectionClick = (sectionId: string) => {
  if (activeSection.value === sectionId) {
    activeSection.value = null
  } else {
    activeSection.value = sectionId
  }
}

const createNewCurriculum = () => {
  errorMessage.value = null;

  activeSection.value = null

  curriculum.value = Object.assign({}, {
    meta: {
      formatVersion: '1.0.0',
      createdAt: new Date().toISOString(),
      language: 'pt'
    },
    basics: {
      name: 'Currículo Exemplo',
      label: 'Desenvolvedor Web',
      summary: 'Desenvolvedor web com experiência em Vue.js e Node.js.',
      location: {
        city: 'Porto Alegre',
        countryCode: 'BR',
      },
      profiles: [{
        network: 'LinkedIn',
        url: 'https://www.linkedin.com/in/exemplo',
        username: 'exemplo'
      }],
      identifiers: []
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
  }) as Curriculum

  setTimeout(() => {
    activeSection.value = 'basics'
  }, 100)
}

const openFileInput = () => {
  fileInput.value?.click()
}

const handleFileUpload = async (event: Event) => {
  errorMessage.value = null;

  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  activeSection.value = null;

  try {
    const text = await file.text()

    // Validate the curriculum first
    const validationErrors = validate(text)

    // Check if validation failed
    if (validationErrors === null) {
      throw new Error('Erro ao fazer o parsing do arquivo CVT')
    }

    if (validationErrors.length > 0) {
      // If there are validation errors, show them
      const error = validationErrors.join('\n')
      console.log(`Arquivo inválido:\n${error}`)

      errorMessage.value = "Arquivo inválido. O arquivo não pode ser carregado.";
      return
    }

    // If validation passes, parse the curriculum
    const parsedCurriculum = JSON.parse(text) as Curriculum
    curriculum.value = parsedCurriculum
    activeSection.value = 'basics'

  } catch (error) {
    alert('Erro ao carregar o arquivo. Certifique-se que é um arquivo .cvt válido.')
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
  const fileName = `${name}-${rule}-${year}.cvt`

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

const printCurriculum = () => {
  window.print()
}

const loadExampleCurriculum = async () => {
  errorMessage.value = null;
  try {
    const { data, error } = await useFetch('/api/example');
    console.log('Currículo de exemplo:', JSON.stringify(data.value));

    if (error.value) {
      throw new Error(error.value.message || 'Não foi possível carregar o currículo de exemplo da API');
    }

    curriculum.value = data.value;
  } catch (error) {
    console.error('Erro ao carregar currículo de exemplo da API:', error);
    errorMessage.value = "Erro ao carregar o currículo de exemplo da API";
  }
}
</script>