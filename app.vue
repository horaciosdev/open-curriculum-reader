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
            <div class="border border-gray-300 rounded-md shadow-sm flex items-center p-1">
              <SwatchIcon class="inline h-5 w-5 text-gray-700 mr-2" />
              <select v-model="selectedThemeId"
                class="inline-flex items-center px-4 py-1 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option v-for="theme in themes" :key="theme.id" :value="theme.id">
                  {{ theme.name }}
                </option>
              </select>
            </div>

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

        <div class="max-w-7xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-4">
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
  SwatchIcon,
  ArrowLeftIcon,
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

  curriculum.value = {
    "meta": {
      "formatVersion": "1.0.0",
      "createdAt": "2025-04-23",
      "updatedAt": "2025-04-23",
      "language": "pt"
    },
    "basics": {
      "name": "Horácio Schumann",
      "label": "Desenvolvedor Web Full Stack",
      "summary": "Programador com experiência no desenvolvimento de aplicações web escaláveis e interativas. Autodidata, com aprendizado ágil, resolução de problemas, código limpo e comunicação eficaz.",
      "image": "data:image/png;base64,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",
      "identifiers": [
        {
          "type": "CPF",
          "value": "123.456.789-00"
        }
      ],
      "location": {
        "address": "Rua das Tecnologias, 404",
        "city": "Porto Alegre",
        "region": "RS",
        "countryCode": "BR"
      },
      "profiles": [
        {
          "network": "LinkedIn",
          "url": "https://www.linkedin.com/in/horaciosdev",
          "username": "horaciosdev"
        },
        {
          "network": "GitHub",
          "url": "https://github.com/horaciosdev",
          "username": "horaciosdev"
        }
      ]
    },
    "work": [
      {
        "organization": "Kreativitas",
        "position": "Desenvolvedor Full Stack",
        "url": "https://kreativitas.com.br",
        "startDate": "2024-07-01",
        "endDate": "2024-10-31",
        "highlights": [
          "Desenvolvimento de soluções web com inteligência artificial",
          "Criação da plataforma EncontreJá.Ai para busca de animais perdidos utilizando IA",
          "Desenvolvimento do sistema Storyboarder para criação de storyboards com suporte a IA",
          "Criação da landing page promocional para o jogo Rogue Cats",
          "Desenvolvimento da landing page para divulgação da comunidade Tendas e Clãs do Sul"
        ]
      },
      {
        "organization": "Veloce.Tech - Cloudpar",
        "position": "Desenvolvedor Full Stack",
        "url": "https://veloce.tech",
        "startDate": "2023-05-01",
        "endDate": "2024-02-29",
        "highlights": [
          "Desenvolvimento de soluções para gestão empresarial",
          "Criação do Painel Veloce: ERP centralizado para configurações e acessos dos serviços da empresa",
          "Desenvolvimento de plataforma de e-commerce personalizável integrada ao ERP da Veloce",
          "Foco na integração de serviços e automação de processos internos"
        ]
      },
      {
        "organization": "Update Consultoria E Soluções Em Informática",
        "position": "Desenvolvedor Full Stack",
        "url": "https://update.com.br",
        "startDate": "2016-05-01",
        "endDate": "2021-01-31",
        "highlights": [
          "Desenvolvimento e manutenção do Grupo Fortune ERP, sistema que integrava setores como RH, Financeiro e Administrativo",
          "Criação de Discador Personalizado integrado ao serviço VoIP da Tellbox",
          "Desenvolvimento de Sistema de Avaliação 360 para Auxiliadora Predial",
          "Criação de Intranet e Blog para Auxiliadora Predial"
        ]
      }
    ],
    "education": [
      {
        "institution": "FADERGS",
        "studyType": "Tecnologo",
        "area": "Análise e Desenvolvimento de Sistemas",
        "startDate": "2016-01-01",
        "endDate": "2019-12-31",
        "courses": [
          "Desenvolvimento Web",
          "Banco de Dados",
          "Engenharia de Software",
          "Programação Orientada a Objetos"
        ]
      }
    ],
    "certifications": [
      {
        "name": "AWS Certified Developer - Associate",
        "issuer": "Amazon Web Services",
        "date": "2023-03-15",
        "url": "https://www.aws.amazon.com/certification"
      },
      {
        "name": "React Developer Certification",
        "issuer": "Meta",
        "date": "2022-08-20",
        "url": "https://www.meta.com/certifications"
      }
    ],
    "skills": [
      {
        "name": "Front-end",
        "category": "hard",
        "keywords": [
          "React",
          "Next.js",
          "Tailwind",
          "Bootstrap",
          "jQuery",
          "HTML",
          "CSS",
          "JavaScript",
          "TypeScript"
        ]
      },
      {
        "name": "Back-end",
        "category": "hard",
        "keywords": [
          "Node.js",
          "PHP",
          "Laravel",
          "API REST"
        ]
      },
      {
        "name": "Banco de Dados",
        "category": "hard",
        "keywords": [
          "MySQL",
          "PostgreSQL",
          "MongoDB",
          "Prisma"
        ]
      },
      {
        "name": "DevOps",
        "category": "hard",
        "keywords": [
          "Vercel",
          "Linux",
          "Docker"
        ]
      },
      {
        "name": "Ferramentas",
        "category": "tool",
        "keywords": [
          "Git",
          "GitHub",
          "Bitbucket",
          "GitLab",
          "Jira",
          "Trello",
          "ClickUp",
          "Confluence"
        ]
      },
      {
        "name": "Soft Skills",
        "category": "soft",
        "keywords": [
          "Aprendizado ágil",
          "Resolução de problemas",
          "Código limpo",
          "Comunicação eficaz",
          "Autodidata"
        ]
      }
    ],
    "volunteer": [
      {
        "organization": "Programadores do Bem",
        "position": "Mentor Voluntário",
        "startDate": "2022-01-15",
        "endDate": null,
        "highlights": [
          "Mentoria para iniciantes em programação",
          "Participação em eventos de inclusão digital",
          "Desenvolvimento de projetos sociais usando tecnologia"
        ]
      }
    ],
    "awards": [
      {
        "title": "Destaque em Inovação Tecnológica",
        "date": "2023-11-10",
        "awarder": "Associação de Tecnologia do Rio Grande do Sul"
      }
    ],
    "publications": [
      {
        "name": "Implementação de Inteligência Artificial em Aplicações Web",
        "publisher": "Blog TechRS",
        "releaseDate": "2024-02-20",
        "url": "https://techrs.com.br/artigos/ia-web"
      }
    ],
    "interests": [
      {
        "name": "Inteligência Artificial",
        "keywords": [
          "Machine Learning",
          "Processamento de linguagem natural",
          "Visão computacional"
        ]
      },
      {
        "name": "Desenvolvimento de jogos",
        "keywords": [
          "Game design",
          "Programação de jogos",
          "Pixel art"
        ]
      },
      {
        "name": "Música",
        "keywords": [
          "Composição",
          "Produção musical",
          "Guitarra"
        ]
      }
    ],
    "references": [
      {
        "name": "Ana Carolina Santos",
        "reference": "Gerente de Projetos na Kreativitas - Horácio é um desenvolvedor excepcional, com grande capacidade de solucionar problemas complexos e entregar projetos de alta qualidade."
      },
      {
        "name": "Ricardo Mendes",
        "reference": "CTO da Veloce.Tech - O Horácio se destacou pela habilidade técnica e comunicação clara, sendo fundamental para o sucesso de nossos produtos."
      }
    ]
  }
}
</script>