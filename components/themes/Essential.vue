<template>
    <div class="mx-auto p-6 bg-white shadow-sm rounded-lg">
      <!-- Basics -->
      <div v-if="curriculum.basics" class="mb-8">
        <div class="flex flex-col md:flex-row items-start md:items-center gap-6 mb-4">
          <img v-if="curriculum.basics.image && !imageLoadError"
               :src="curriculum.basics.image"
               :alt="curriculum.basics.name"
               @error="onImageError"
               class="w-32 h-32 rounded-full object-cover border-2 border-gray-200" />
          <div>
            <h1 class="text-3xl font-bold text-gray-800">{{ curriculum.basics.name }}</h1>
            <p class="text-xl text-gray-600 font-medium">{{ curriculum.basics.label }}</p>

            <div v-if="curriculum.basics.location" class="flex items-center mt-2 text-gray-600">
              <MapPinIcon class="w-4 h-4 mr-1" />
              <span v-if="curriculum.basics.location.address">{{ curriculum.basics.location.address }}, </span>
              <span>{{ curriculum.basics.location.city }}</span>
              <span v-if="curriculum.basics.location.region">, {{ curriculum.basics.location.region }}</span>
              <span> - {{ curriculum.basics.location.countryCode }}</span>
            </div>

            <!-- Identifiers (email, phone, etc) -->
            <div v-if="curriculum.basics.identifiers?.length" class="flex flex-wrap gap-4 mt-2">
              <div v-for="id in curriculum.basics.identifiers" class="flex items-center text-gray-600">
                <component
                  :is="getIdentifierIcon(id.type)"
                  class="w-4 h-4 mr-1" />
                <span>{{ id.value }}</span>
              </div>
            </div>
          </div>
        </div>

        <p class="text-gray-700 mb-4">{{ curriculum.basics.summary }}</p>

        <!-- Social profiles -->
        <div v-if="curriculum.basics.profiles?.length" class="flex flex-wrap gap-3 mt-3">
          <a v-for="profile in curriculum.basics.profiles"
             :href="profile.url"
             target="_blank"
             class="inline-flex items-center px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors">
            <component :is="getSocialIcon(profile.network)" class="w-4 h-4 mr-1" />
            {{ profile.network }}
          </a>
        </div>
      </div>

      <!-- Work -->
      <div v-if="curriculum.work?.length" class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 border-b border-gray-300 pb-2 mb-4">
          <BriefcaseIcon class="w-5 h-5 inline mr-2" />
          Experiência Profissional
        </h2>
        <div v-for="job in curriculum.work" class="mb-6">
          <div class="flex flex-col md:flex-row md:justify-between mb-2">
            <div>
              <h3 class="text-xl font-semibold text-gray-800">{{ job.position }}</h3>
              <div class="text-lg text-gray-700">
                {{ job.organization }}
                <a v-if="job.url" :href="job.url" target="_blank" class="text-blue-600 hover:underline ml-1">(Website)</a>
              </div>
            </div>
            <div class="text-gray-600 font-medium mt-1 md:mt-0">
              {{ formatDate(job.startDate) }} - {{ job.endDate ? formatDate(job.endDate) : 'Presente' }}
            </div>
          </div>
          <ul v-if="job.highlights?.length" class="list-disc pl-6 text-gray-700">
            <li v-for="highlight in job.highlights" class="mb-1">{{ highlight }}</li>
          </ul>
        </div>
      </div>

      <!-- Education -->
      <div v-if="curriculum.education?.length" class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 border-b border-gray-300 pb-2 mb-4">
          <AcademicCapIcon class="w-5 h-5 inline mr-2" />
          Educação
        </h2>
        <div v-for="edu in curriculum.education" class="mb-6">
          <div class="flex flex-col md:flex-row md:justify-between mb-2">
            <div>
              <h3 class="text-xl font-semibold text-gray-800">{{ edu.institution }}</h3>
              <div class="text-lg text-gray-700">{{ edu.studyType }} em {{ edu.area }}</div>
              <div v-if="edu.score" class="text-gray-600">Nota: {{ edu.score }}</div>
            </div>
            <div class="text-gray-600 font-medium mt-1 md:mt-0">
              {{ formatDate(edu.startDate) }} - {{ edu.endDate ? formatDate(edu.endDate) : 'Presente' }}
            </div>
          </div>
          <ul v-if="edu.courses?.length" class="list-disc pl-6 text-gray-700">
            <li v-for="course in edu.courses" class="mb-1">{{ course }}</li>
          </ul>
        </div>
      </div>

      <!-- Certifications -->
      <div v-if="curriculum.certifications?.length" class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 border-b border-gray-300 pb-2 mb-4">
          <CheckBadgeIcon class="w-5 h-5 inline mr-2" />
          Certificações
        </h2>
        <div v-for="cert in curriculum.certifications" class="mb-4">
          <h3 class="text-xl font-semibold text-gray-800">{{ cert.name }}</h3>
          <p class="text-gray-700">{{ cert.issuer }}</p>
          <div class="flex items-center text-gray-600">
            <CalendarIcon class="w-4 h-4 mr-1" />
            <span>{{ formatDate(cert.date) }}</span>
            <span v-if="cert.url" class="ml-2">-
              <a :href="cert.url" target="_blank" class="text-blue-600 hover:underline ml-1">Verificar</a>
            </span>
          </div>
        </div>
      </div>

      <!-- Skills -->
      <div v-if="curriculum.skills?.length" class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 border-b border-gray-300 pb-2 mb-4">
          <BoltIcon class="w-5 h-5 inline mr-2" />
          Habilidades
        </h2>
        <div v-for="(skills, category) in groupedSkills" class="mb-4">
          <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ category }}</h3>
          <div class="flex flex-wrap gap-2">
            <div v-for="skill in skills"
                 class="px-3 py-1 bg-gray-100 rounded-lg">
              <span class="font-medium">{{ skill.name }}</span>
              <div v-if="skill.keywords?.length" class="text-sm text-gray-600">
                {{ skill.keywords.join(', ') }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Volunteer -->
      <div v-if="curriculum.volunteer?.length" class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 border-b border-gray-300 pb-2 mb-4">
          <HeartIcon class="w-5 h-5 inline mr-2" />
          Trabalho Voluntário
        </h2>
        <div v-for="vol in curriculum.volunteer" class="mb-6">
          <div class="flex flex-col md:flex-row md:justify-between mb-2">
            <div>
              <h3 class="text-xl font-semibold text-gray-800">{{ vol.position }}</h3>
              <div class="text-lg text-gray-700">{{ vol.organization }}</div>
            </div>
            <div class="text-gray-600 font-medium mt-1 md:mt-0">
              {{ formatDate(vol.startDate) }} - {{ vol.endDate ? formatDate(vol.endDate) : 'Presente' }}
            </div>
          </div>
          <ul v-if="vol.highlights?.length" class="list-disc pl-6 text-gray-700">
            <li v-for="highlight in vol.highlights" class="mb-1">{{ highlight }}</li>
          </ul>
        </div>
      </div>

      <!-- Awards -->
      <div v-if="curriculum.awards?.length" class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 border-b border-gray-300 pb-2 mb-4">
          <TrophyIcon class="w-5 h-5 inline mr-2" />
          Prêmios
        </h2>
        <div v-for="award in curriculum.awards" class="mb-4">
          <h3 class="text-xl font-semibold text-gray-800">{{ award.title }}</h3>
          <p class="text-gray-700">{{ award.awarder }}</p>
          <div class="flex items-center text-gray-600">
            <CalendarIcon class="w-4 h-4 mr-1" />
            <span>{{ formatDate(award.date) }}</span>
          </div>
        </div>
      </div>

      <!-- Publications -->
      <div v-if="curriculum.publications?.length" class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 border-b border-gray-300 pb-2 mb-4">
          <BookOpenIcon class="w-5 h-5 inline mr-2" />
          Publicações
        </h2>
        <div v-for="pub in curriculum.publications" class="mb-4">
          <h3 class="text-xl font-semibold text-gray-800">{{ pub.name }}</h3>
          <p class="text-gray-700">{{ pub.publisher }}</p>
          <div class="flex items-center text-gray-600">
            <CalendarIcon class="w-4 h-4 mr-1" />
            <span>{{ formatDate(pub.releaseDate) }}</span>
            <span v-if="pub.url" class="ml-2">-
              <a :href="pub.url" target="_blank" class="text-blue-600 hover:underline ml-1">Acessar publicação</a>
            </span>
          </div>
        </div>
      </div>

      <!-- Interests -->
      <div v-if="curriculum.interests?.length" class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 border-b border-gray-300 pb-2 mb-4">
          <SparklesIcon class="w-5 h-5 inline mr-2" />
          Interesses
        </h2>
        <div class="flex flex-wrap gap-4">
          <div v-for="interest in curriculum.interests" class="mb-2">
            <h3 class="text-lg font-semibold text-gray-800">{{ interest.name }}</h3>
            <div v-if="interest.keywords?.length" class="flex flex-wrap gap-2 mt-1">
              <span v-for="keyword in interest.keywords"
                    class="px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                {{ keyword }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- References -->
      <div v-if="curriculum.references?.length" class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 border-b border-gray-300 pb-2 mb-4">
          <UserGroupIcon class="w-5 h-5 inline mr-2" />
          Referências
        </h2>
        <div v-for="ref in curriculum.references" class="mb-4 p-4 bg-gray-50 rounded-lg">
          <div class="mb-2">
            <h3 class="text-xl font-semibold text-gray-800">{{ ref.name }}</h3>
          </div>
          <p class="text-gray-700 italic">"{{ ref.reference }}"</p>
        </div>
      </div>
    </div>
  </template>

  <script setup>
  import { computed, ref } from 'vue'
  import {
    BriefcaseIcon,
    AcademicCapIcon,
    CheckBadgeIcon,
    BoltIcon,
    HeartIcon,
    TrophyIcon,
    BookOpenIcon,
    SparklesIcon,
    UserGroupIcon,
    MapPinIcon,
    EnvelopeIcon,
    PhoneIcon,
    GlobeAltIcon,
    CalendarIcon
  } from '@heroicons/vue/24/outline'

  const props = defineProps({
    curriculum: Object
  })

  const imageLoadError = ref(false)

  const formatDate = (date) => {
    if (!date) return ''
    const [year, month] = date.split('-')
    return `${month}/${year}`
  }

  const groupedSkills = computed(() => {
    if (!props.curriculum.skills) return {}
    return props.curriculum.skills.reduce((acc, skill) => {
      const category = skill.category || 'Outros'
      if (!acc[category]) acc[category] = []
      acc[category].push(skill)
      return acc
    }, {})
  })

  const onImageError = () => {
    imageLoadError.value = true
  }

  const getIdentifierIcon = (type) => {
    const typeMap = {
      'email': EnvelopeIcon,
      'phone': PhoneIcon,
      'website': GlobeAltIcon
    }
    return typeMap[type.toLowerCase()] || GlobeAltIcon
  }

  const getSocialIcon = (network) => {
    // Na versão 2, retornamos GlobeAltIcon como ícone padrão para redes sociais
    return GlobeAltIcon
  }
  </script>