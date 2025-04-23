<template>
    <div class="space-y-8 font-serif">
      <!-- Informações Básicas -->
      <div v-if="curriculum.basics" class="space-y-4 text-center border-b pb-8">
        <div class="flex flex-col items-center">
          <div
            v-if="!curriculum.basics.image || imageLoadError"
            class="w-32 h-32 rounded-full bg-blue-500 text-white flex items-center justify-center text-4xl font-bold mb-4"
          >
            {{ curriculum.basics.name ? curriculum.basics.name.slice(0, 2).toUpperCase() : '' }}
          </div>
          <img
            v-else
            :src="curriculum.basics.image"
            :alt="curriculum.basics.name"
            @error="onImageError"
            class="w-32 h-32 rounded-full object-cover mb-4"
          />
          <div>
            <h1 class="text-4xl font-bold text-gray-900">{{ curriculum.basics.name }}</h1>
            <p class="mt-2 text-xl text-gray-600 italic">{{ curriculum.basics.label }}</p>
            <p class="mt-4 text-gray-700 max-w-2xl mx-auto">{{ curriculum.basics.summary }}</p>
          </div>
        </div>

        <div class="flex flex-wrap justify-center gap-4">
          <div v-if="curriculum.basics.location" class="flex items-center text-gray-600">
            <span v-if="curriculum.basics.location.address">{{ curriculum.basics.location.address }}, </span>
            <span>{{ curriculum.basics.location.city }}</span>
            <span v-if="curriculum.basics.location.region">, {{ curriculum.basics.location.region }}</span>
            <span> - {{ curriculum.basics.location.countryCode }}</span>
          </div>

          <div v-if="curriculum.basics.identifiers?.length" class="flex gap-4">
            <span v-for="id in curriculum.basics.identifiers" :key="id.type" class="text-gray-600">
              {{ id.type }}: {{ id.value }}
            </span>
          </div>
        </div>

        <div v-if="curriculum.basics.profiles?.length" class="flex justify-center gap-4">
          <a
            v-for="profile in curriculum.basics.profiles"
            :key="profile.url"
            :href="profile.url"
            target="_blank"
            class="text-blue-800 hover:text-blue-600 flex items-center gap-2"
          >
            {{ profile.network }}
            <span v-if="profile.username" class="text-gray-500">({{ profile.username }})</span>
          </a>
        </div>
      </div>

      <!-- Experiência Profissional -->
      <div v-if="curriculum.work?.length" class="space-y-6">
        <h2 class="text-2xl font-semibold text-gray-900 text-center border-b pb-2">Experiência Profissional</h2>
        <div class="space-y-8">
          <div v-for="job in curriculum.work" :key="job.organization" class="border-l-2 border-gray-300 pl-4">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-lg font-medium text-gray-900">{{ job.position }}</h3>
                <div class="text-gray-600">
                  {{ job.organization }}
                  <a v-if="job.url" :href="job.url" target="_blank" class="text-blue-800 hover:text-blue-600 ml-2">
                    (Website)
                  </a>
                </div>
              </div>
              <div class="text-sm text-gray-500 italic">
                {{ formatDate(job.startDate) }} - {{ job.endDate ? formatDate(job.endDate) : 'Presente' }}
              </div>
            </div>
            <ul v-if="job.highlights?.length" class="mt-2 list-disc list-inside text-gray-700">
              <li v-for="highlight in job.highlights" :key="highlight">{{ highlight }}</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Educação -->
      <div v-if="curriculum.education?.length" class="space-y-6">
        <h2 class="text-2xl font-semibold text-gray-900 text-center border-b pb-2">Educação</h2>
        <div class="space-y-8">
          <div v-for="edu in curriculum.education" :key="edu.institution" class="border-l-2 border-gray-300 pl-4">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-lg font-medium text-gray-900">{{ edu.institution }}</h3>
                <div class="text-gray-600">{{ edu.studyType }} em {{ edu.area }}</div>
                <div v-if="edu.score" class="text-gray-500">Nota: {{ edu.score }}</div>
              </div>
              <div class="text-sm text-gray-500 italic">
                {{ formatDate(edu.startDate) }} - {{ edu.endDate ? formatDate(edu.endDate) : 'Presente' }}
              </div>
            </div>
            <ul v-if="edu.courses?.length" class="mt-2 list-disc list-inside text-gray-700">
              <li v-for="course in edu.courses" :key="course">{{ course }}</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Certificações -->
      <div v-if="curriculum.certifications?.length" class="space-y-6">
        <h2 class="text-2xl font-semibold text-gray-900 text-center border-b pb-2">Certificações</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="cert in curriculum.certifications" :key="cert.name" class="border rounded p-4">
            <h3 class="font-medium text-gray-900">{{ cert.name }}</h3>
            <p class="text-gray-600">{{ cert.issuer }}</p>
            <div class="flex justify-between items-center mt-2">
              <span class="text-sm text-gray-500 italic">{{ formatDate(cert.date) }}</span>
              <a v-if="cert.url" :href="cert.url" target="_blank" class="text-blue-800 hover:text-blue-600 text-sm">
                Verificar
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Habilidades -->
      <div v-if="curriculum.skills?.length" class="space-y-6">
        <h2 class="text-2xl font-semibold text-gray-900 text-center border-b pb-2">Habilidades</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div v-for="(skills, category) in groupedSkills" :key="category" class="space-y-2">
            <h3 class="text-lg font-medium text-gray-900 capitalize">{{ category }}</h3>
            <div class="flex flex-wrap gap-2">
              <div v-for="skill in skills" :key="skill.name" class="border rounded px-3 py-1">
                <span class="font-medium">{{ skill.name }}</span>
                <div v-if="skill.keywords?.length" class="text-sm text-gray-600">
                  {{ skill.keywords.join(', ') }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Trabalho Voluntário -->
      <div v-if="curriculum.volunteer?.length" class="space-y-6">
        <h2 class="text-2xl font-semibold text-gray-900 text-center border-b pb-2">Trabalho Voluntário</h2>
        <div class="space-y-8">
          <div v-for="vol in curriculum.volunteer" :key="vol.organization" class="border-l-2 border-gray-300 pl-4">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-lg font-medium text-gray-900">{{ vol.position }}</h3>
                <div class="text-gray-600">{{ vol.organization }}</div>
              </div>
              <div class="text-sm text-gray-500 italic">
                {{ formatDate(vol.startDate) }} - {{ vol.endDate ? formatDate(vol.endDate) : 'Presente' }}
              </div>
            </div>
            <ul v-if="vol.highlights?.length" class="mt-2 list-disc list-inside text-gray-700">
              <li v-for="highlight in vol.highlights" :key="highlight">{{ highlight }}</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Prêmios -->
      <div v-if="curriculum.awards?.length" class="space-y-6">
        <h2 class="text-2xl font-semibold text-gray-900 text-center border-b pb-2">Prêmios</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="award in curriculum.awards" :key="award.title" class="border rounded p-4">
            <h3 class="font-medium text-gray-900">{{ award.title }}</h3>
            <p class="text-gray-600">{{ award.awarder }}</p>
            <p class="text-sm text-gray-500 italic mt-2">{{ formatDate(award.date) }}</p>
          </div>
        </div>
      </div>

      <!-- Publicações -->
      <div v-if="curriculum.publications?.length" class="space-y-6">
        <h2 class="text-2xl font-semibold text-gray-900 text-center border-b pb-2">Publicações</h2>
        <div class="space-y-6">
          <div v-for="pub in curriculum.publications" :key="pub.name" class="border-l-2 border-gray-300 pl-4">
            <h3 class="font-medium text-gray-900">{{ pub.name }}</h3>
            <p class="text-gray-600">{{ pub.publisher }}</p>
            <div class="flex justify-between items-center mt-2">
              <span class="text-sm text-gray-500 italic">{{ formatDate(pub.releaseDate) }}</span>
              <a v-if="pub.url" :href="pub.url" target="_blank" class="text-blue-800 hover:text-blue-600 text-sm">
                Acessar publicação
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Interesses -->
      <div v-if="curriculum.interests?.length" class="space-y-6">
        <h2 class="text-2xl font-semibold text-gray-900 text-center border-b pb-2">Interesses</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="interest in curriculum.interests" :key="interest.name" class="border rounded p-4">
            <h3 class="font-medium text-gray-900">{{ interest.name }}</h3>
            <div v-if="interest.keywords?.length" class="flex flex-wrap gap-2 mt-2">
              <span v-for="keyword in interest.keywords" :key="keyword" class="border rounded px-3 py-1 text-sm">
                {{ keyword }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Referências -->
      <div v-if="curriculum.references?.length" class="space-y-6">
        <h2 class="text-2xl font-semibold text-gray-900 text-center border-b pb-2">Referências</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div v-for="ref in curriculum.references" :key="ref.name" class="border rounded p-6">
            <div class="flex items-center mb-4">
              <div class="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-medium">
                {{ ref.name.charAt(0) }}
              </div>
              <div class="ml-4">
                <h3 class="font-medium text-gray-900">{{ ref.name }}</h3>
              </div>
            </div>
            <p class="text-gray-700 italic">"{{ ref.reference }}"</p>
          </div>
        </div>
      </div>
    </div>
  </template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Curriculum } from 'open-cvt'

const props = defineProps<{
  curriculum: Curriculum
}>()

const imageLoadError = ref(false)

const formatDate = (date: string) => {
  if (!date) return ''
  const [year, month] = date.split('-')
  return `${month}/${year}`
}

const groupedSkills = computed(() => {
  if (!props.curriculum.skills) return {}
  return props.curriculum.skills.reduce((acc, skill) => {
    const category = skill.category || 'other'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(skill)
    return acc
  }, {} as Record<string, Curriculum['skills']>)
})

const onImageError = () => {
  imageLoadError.value = true
}
</script>