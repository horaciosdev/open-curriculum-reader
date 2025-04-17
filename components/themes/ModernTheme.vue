<template>
    <div class="space-y-12 font-sans">
      <!-- Informações Básicas -->
      <div v-if="resume.basics" class="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-xl shadow-lg">
        <div class="flex items-start gap-8">
          <div
            v-if="!resume.basics.image || imageLoadError"
            class="w-40 h-40 rounded-xl bg-blue-600 text-white flex items-center justify-center text-5xl font-bold shadow-lg"
          >
            {{ resume.basics.name ? resume.basics.name.slice(0, 2).toUpperCase() : '' }}
          </div>
          <img
            v-else
            :src="resume.basics.image"
            :alt="resume.basics.name"
            @error="onImageError"
            class="w-40 h-40 rounded-xl object-cover shadow-lg"
          />
          <div class="flex-1">
            <h1 class="text-5xl font-bold">{{ resume.basics.name }}</h1>
            <p class="mt-2 text-2xl text-blue-100">{{ resume.basics.label }}</p>
            <p class="mt-4 text-lg text-blue-50">{{ resume.basics.summary }}</p>

            <div class="mt-6 flex flex-wrap gap-4">
              <div v-if="resume.basics.location" class="flex items-center text-blue-100">
                <span v-if="resume.basics.location.address">{{ resume.basics.location.address }}, </span>
                <span>{{ resume.basics.location.city }}</span>
                <span v-if="resume.basics.location.region">, {{ resume.basics.location.region }}</span>
                <span> - {{ resume.basics.location.countryCode }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="resume.basics.identifiers?.length" class="mt-4 flex gap-4">
          <span v-for="id in resume.basics.identifiers" :key="id.type" class="text-blue-100">
            {{ id.type }}: {{ id.value }}
          </span>
        </div>

        <div v-if="resume.basics.profiles?.length" class="mt-6 flex gap-4">
          <a
            v-for="profile in resume.basics.profiles"
            :key="profile.url"
            :href="profile.url"
            target="_blank"
            class="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full transition-colors"
          >
            {{ profile.network }}
            <span v-if="profile.username" class="text-blue-100">({{ profile.username }})</span>
          </a>
        </div>
      </div>

      <!-- Grid de 2 colunas para o conteúdo principal -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Coluna da esquerda -->
        <div class="lg:col-span-2 space-y-12">
          <!-- Experiência Profissional -->
          <div v-if="resume.work?.length" class="space-y-8">
            <h2 class="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <span class="w-8 h-1 bg-blue-600 rounded-full"></span>
              Experiência Profissional
            </h2>
            <div class="space-y-12">
              <div v-for="job in resume.work" :key="job.organization" class="relative pl-8">
                <div class="absolute left-0 top-0 w-2 h-full bg-blue-600 rounded-full"></div>
                <div class="space-y-2">
                  <div class="flex justify-between items-start">
                    <h3 class="text-xl font-semibold text-gray-900">{{ job.position }}</h3>
                    <span class="text-blue-600 font-medium">
                      {{ formatDate(job.startDate) }} - {{ job.endDate ? formatDate(job.endDate) : 'Presente' }}
                    </span>
                  </div>
                  <div class="text-lg text-gray-600">
                    {{ job.organization }}
                    <a v-if="job.url" :href="job.url" target="_blank" class="text-blue-600 hover:text-blue-800 ml-2">
                      (Website)
                    </a>
                  </div>
                  <ul v-if="job.highlights?.length" class="mt-4 space-y-2">
                    <li v-for="highlight in job.highlights" :key="highlight"
                        class="flex items-start gap-2 text-gray-700">
                      <span class="w-1.5 h-1.5 mt-2 bg-blue-600 rounded-full"></span>
                      {{ highlight }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- Educação -->
          <div v-if="resume.education?.length" class="space-y-8">
            <h2 class="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <span class="w-8 h-1 bg-blue-600 rounded-full"></span>
              Educação
            </h2>
            <div class="space-y-8">
              <div v-for="edu in resume.education" :key="edu.institution"
                   class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div class="space-y-2">
                  <div class="flex justify-between items-start">
                    <h3 class="text-xl font-semibold text-gray-900">{{ edu.institution }}</h3>
                    <span class="text-blue-600 font-medium">
                      {{ formatDate(edu.startDate) }} - {{ formatDate(edu.endDate ?? 'Presente') }}
                    </span>
                  </div>
                  <div class="text-lg text-gray-600">{{ edu.studyType }} em {{ edu.area }}</div>
                  <div v-if="edu.score" class="text-gray-500">Nota: {{ edu.score }}</div>
                  <ul v-if="edu.courses?.length" class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                    <li v-for="course in edu.courses" :key="course"
                        class="text-gray-700 bg-gray-50 rounded-lg px-3 py-2">
                      {{ course }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Coluna da direita -->
        <div class="space-y-12">
          <!-- Habilidades -->
          <div v-if="resume.skills?.length" class="space-y-6">
            <h2 class="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <span class="w-8 h-1 bg-blue-600 rounded-full"></span>
              Habilidades
            </h2>
            <div class="space-y-6">
              <div v-for="(skills, category) in groupedSkills" :key="category"
                   class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 class="text-xl font-semibold text-gray-900 capitalize mb-4">{{ category }}</h3>
                <div class="flex flex-wrap gap-2">
                  <div v-for="skill in skills" :key="skill.name"
                       class="bg-blue-50 text-blue-700 rounded-lg px-3 py-2">
                    <span class="font-medium">{{ skill.name }}</span>
                    <div v-if="skill.keywords?.length" class="text-sm text-blue-600 mt-1">
                      {{ skill.keywords.join(', ') }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Certificações -->
          <div v-if="resume.certifications?.length" class="space-y-6">
            <h2 class="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <span class="w-8 h-1 bg-blue-600 rounded-full"></span>
              Certificações
            </h2>
            <div class="space-y-4">
              <div v-for="cert in resume.certifications" :key="cert.name"
                   class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 class="text-lg font-semibold text-gray-900">{{ cert.name }}</h3>
                <p class="text-gray-600">{{ cert.issuer }}</p>
                <div class="flex justify-between items-center mt-4">
                  <span class="text-blue-600">{{ formatDate(cert.date) }}</span>
                  <a v-if="cert.url" :href="cert.url" target="_blank"
                     class="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors">
                    Verificar
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Seções adicionais em layout de grade -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Trabalho Voluntário -->
        <div v-if="resume.volunteer?.length" class="space-y-6">
          <h2 class="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <span class="w-8 h-1 bg-blue-600 rounded-full"></span>
            Trabalho Voluntário
          </h2>
          <div class="space-y-6">
            <div v-for="vol in resume.volunteer" :key="vol.organization"
                 class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div class="space-y-2">
                <div class="flex justify-between items-start">
                  <h3 class="text-xl font-semibold text-gray-900">{{ vol.position }}</h3>
                  <span class="text-blue-600 font-medium">
                    {{ formatDate(vol.startDate) }} - {{ vol.endDate ? formatDate(vol.endDate) : 'Presente' }}
                  </span>
                </div>
                <div class="text-lg text-gray-600">{{ vol.organization }}</div>
                <ul v-if="vol.highlights?.length" class="mt-4 space-y-2">
                  <li v-for="highlight in vol.highlights" :key="highlight"
                      class="flex items-start gap-2 text-gray-700">
                    <span class="w-1.5 h-1.5 mt-2 bg-blue-600 rounded-full"></span>
                    {{ highlight }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Prêmios -->
        <div v-if="resume.awards?.length" class="space-y-6">
          <h2 class="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <span class="w-8 h-1 bg-blue-600 rounded-full"></span>
            Prêmios
          </h2>
          <div class="space-y-4">
            <div v-for="award in resume.awards" :key="award.title"
                 class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 class="text-xl font-semibold text-gray-900">{{ award.title }}</h3>
              <p class="text-gray-600 mt-2">{{ award.awarder }}</p>
              <p class="text-blue-600 font-medium mt-4">{{ formatDate(award.date) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Publicações -->
      <div v-if="resume.publications?.length" class="space-y-6">
        <h2 class="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <span class="w-8 h-1 bg-blue-600 rounded-full"></span>
          Publicações
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="pub in resume.publications" :key="pub.name"
               class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 class="text-xl font-semibold text-gray-900">{{ pub.name }}</h3>
            <p class="text-gray-600 mt-2">{{ pub.publisher }}</p>
            <div class="flex justify-between items-center mt-4">
              <span class="text-blue-600 font-medium">{{ formatDate(pub.releaseDate) }}</span>
              <a v-if="pub.url" :href="pub.url" target="_blank"
                 class="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors">
                Acessar publicação
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Interesses -->
      <div v-if="resume.interests?.length" class="space-y-6">
        <h2 class="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <span class="w-8 h-1 bg-blue-600 rounded-full"></span>
          Interesses
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="interest in resume.interests" :key="interest.name"
               class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 class="text-xl font-semibold text-gray-900">{{ interest.name }}</h3>
            <div v-if="interest.keywords?.length" class="flex flex-wrap gap-2 mt-4">
              <span v-for="keyword in interest.keywords" :key="keyword"
                    class="bg-blue-50 text-blue-700 rounded-lg px-3 py-1 text-sm">
                {{ keyword }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Referências -->
      <div v-if="resume.references?.length" class="space-y-6">
        <h2 class="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <span class="w-8 h-1 bg-blue-600 rounded-full"></span>
          Referências
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div v-for="ref in resume.references" :key="ref.name"
               class="bg-white rounded-xl shadow-lg p-8 relative">
            <div class="absolute -top-4 left-8">
              <div class="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                {{ ref.name.charAt(0) }}
              </div>
            </div>
            <div class="mt-8">
              <h3 class="text-xl font-semibold text-gray-900">{{ ref.name }}</h3>
              <p class="mt-4 text-gray-700 italic text-lg">"{{ ref.reference }}"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Curriculum } from '@/types/curriculum' // Ajuste o caminho conforme necessário

const props = defineProps<{
  resume: Curriculum
}>()

const imageLoadError = ref(false)

const formatDate = (date: string) => {
  if (!date) return ''
  const [year, month] = date.split('-')
  return `${month}/${year}`
}

const groupedSkills = computed(() => {
  if (!props.resume.skills) return {}
  return props.resume.skills.reduce((acc, skill) => {
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