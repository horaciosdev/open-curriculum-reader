<template>
  <div :class="['min-h-screen flex flex-col', darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900']">
    <!-- Header -->
    <div class="cv-header flex items-center justify-between p-6 border-b"
         :class="darkMode ? 'border-gray-700' : 'border-gray-200'">
      <div class="flex items-center space-x-4">
        <img v-if="curriculum.basics.image && !imageLoadError" :src="curriculum.basics.image"
             :alt="curriculum.basics.name" @error="onImageError"
             class="w-16 h-16 rounded-full border-2"
             :class="darkMode ? 'border-blue-400' : 'border-blue-600'" />
        <div>
          <h1 class="text-4xl font-extrabold">{{ curriculum.basics.name }}</h1>
          <p class="text-xl italic opacity-75">{{ curriculum.basics.label }}</p>
          <p class="mt-2">{{ curriculum.basics.summary }}</p>
          <div class="mt-2 flex flex-wrap text-sm" :class="darkMode ? 'text-gray-400' : 'text-gray-700'">
            <span v-if="curriculum.basics.location.address">{{ curriculum.basics.location.address }},&nbsp;</span>
            <span>{{ curriculum.basics.location.city }}, {{ curriculum.basics.location.region }} - {{ curriculum.basics.location.countryCode }}</span>
          </div>
        </div>
      </div>
      <button @click="toggleDarkMode" class="toggle-theme p-2 rounded-full"
              :class="darkMode ? 'bg-yellow-300' : 'bg-gray-200'">
        <SunIcon v-if="!darkMode" class="w-6 h-6" />
        <MoonIcon v-else class="w-6 h-6" />
      </button>
    </div>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto p-8 space-y-12">
      <!-- Work -->
      <section>
        <h2 class="text-2xl font-bold mb-4">Experiência Profissional</h2>
        <div v-for="(job, idx) in curriculum.work" :key="idx" class="mb-8 p-4 rounded-lg border"
          :class="darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
          <div class="flex flex-col md:flex-row md:justify-between">
            <div>
              <h3 class="text-xl font-semibold">{{ job.position }}</h3>
              <div class="mt-1 flex items-center text-sm">
                <BuildingOfficeIcon class="w-4 h-4 mr-1" />
                <span v-if="job.url"><a :href="job.url" target="_blank" class="underline">{{ job.organization
                    }}</a></span>
                <span v-else>{{ job.organization }}</span>
              </div>
            </div>
            <div class="mt-2 md:mt-0 text-sm font-medium" :class="darkMode ? 'text-gray-400' : 'text-gray-500'">
              <CalendarIcon class="w-4 h-4 mr-1 inline" />
              {{ formatDate(job.startDate) }} - {{ job.endDate ? formatDate(job.endDate) : 'Presente' }}
            </div>
          </div>
          <ul v-if="job.highlights?.length" class="mt-4 list-disc pl-5 space-y-2">
            <li v-for="(h, i) in job.highlights" :key="i">{{ h }}</li>
          </ul>
        </div>
      </section>

      <!-- Education -->
      <section>
        <h2 class="text-2xl font-bold mb-4">Educação</h2>
        <div v-for="(edu, idx) in curriculum.education" :key="idx" class="mb-8 p-4 rounded-lg border"
          :class="darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
          <h3 class="text-xl font-semibold">{{ edu.institution }}</h3>
          <div class="mt-1 flex items-center text-sm">
            <AcademicCapIcon class="w-4 h-4 mr-1" />
            {{ edu.studyType }} em {{ edu.area }}
          </div>
          <div class="mt-2 text-sm" :class="darkMode ? 'text-gray-400' : 'text-gray-500'">
            <CalendarIcon class="w-4 h-4 mr-1 inline" />
            {{ formatDate(edu.startDate) }} - {{ edu.endDate ? formatDate(edu.endDate) : 'Presente' }}
          </div>
          <ul v-if="edu.courses?.length" class="mt-3 list-disc pl-5 space-y-1 text-sm">
            <li v-for="(c, i) in edu.courses" :key="i">{{ c }}</li>
          </ul>
        </div>
      </section>

      <!-- Certifications -->
      <section>
        <h2 class="text-2xl font-bold mb-4">Certificações</h2>
        <div v-for="(cert, idx) in curriculum.certifications" :key="idx" class="mb-8 p-4 rounded-lg border"
          :class="darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
          <h3 class="text-xl font-semibold">{{ cert.name }}</h3>
          <p class="mt-1 italic text-sm">{{ cert.issuer }}</p>
          <div class="mt-2 text-sm" :class="darkMode ? 'text-gray-400' : 'text-gray-500'">
            <CalendarIcon class="w-4 h-4 mr-1 inline" />
            {{ formatDate(cert.date) }}
            <span v-if="cert.url">&nbsp;|&nbsp;<a :href="cert.url" target="_blank"
                class="underline">Verificar</a></span>
          </div>
        </div>
      </section>

      <!-- Skills -->
      <section>
        <h2 class="text-2xl font-bold mb-4">Habilidades</h2>
        <div v-for="(skills, category) in groupedSkills" :key="category" class="mb-6">
          <h3 class="text-xl font-semibold mb-2">{{ category }}</h3>
          <div class="flex flex-wrap gap-2">
            <span v-for="(s, i) in skills" :key="i" class="px-3 py-1 rounded-full border text-sm"
              :class="darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'">
              {{ s.name }}<span v-if="s.keywords?.length">: {{ s.keywords.join(', ') }}</span>
            </span>
          </div>
        </div>
      </section>

      <!-- Volunteer -->
      <section>
        <h2 class="text-2xl font-bold mb-4">Trabalho Voluntário</h2>
        <div v-for="(vol, idx) in curriculum.volunteer" :key="idx" class="mb-8 p-4 rounded-lg border"
          :class="darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
          <h3 class="text-xl font-semibold">{{ vol.position }}</h3>
          <div class="mt-1 flex items-center text-sm">
            <HeartIcon class="w-4 h-4 mr-1" />
            {{ vol.organization }}
          </div>
          <div class="mt-2 text-sm" :class="darkMode ? 'text-gray-400' : 'text-gray-500'">
            <CalendarIcon class="w-4 h-4 mr-1 inline" />
            {{ formatDate(vol.startDate) }} - {{ vol.endDate ? formatDate(vol.endDate) : 'Presente' }}
          </div>
          <ul v-if="vol.highlights?.length" class="mt-3 list-disc pl-5 space-y-1 text-sm">
            <li v-for="(h, i) in vol.highlights" :key="i">{{ h }}</li>
          </ul>
        </div>
      </section>

      <!-- Awards -->
      <section>
        <h2 class="text-2xl font-bold mb-4">Prêmios</h2>
        <div v-for="(award, idx) in curriculum.awards" :key="idx" class="mb-8 p-4 rounded-lg border"
          :class="darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
          <h3 class="text-xl font-semibold">{{ award.title }}</h3>
          <p class="mt-1 italic text-sm">{{ award.awarder }}</p>
          <div class="mt-2 text-sm" :class="darkMode ? 'text-gray-400' : 'text-gray-500'">
            <CalendarIcon class="w-4 h-4 mr-1 inline" />
            {{ formatDate(award.date) }}
          </div>
        </div>
      </section>

      <!-- Publications -->
      <section>
        <h2 class="text-2xl font-bold mb-4">Publicações</h2>
        <div v-for="(pub, idx) in curriculum.publications" :key="idx" class="mb-8 p-4 rounded-lg border"
          :class="darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
          <h3 class="text-xl font-semibold">{{ pub.name }}</h3>
          <p class="mt-1 flex items-center text-sm">
            <BookOpenIcon class="w-4 h-4 mr-1" />{{ pub.publisher }}
          </p>
          <div class="mt-2 text-sm flex items-center justify-between"
            :class="darkMode ? 'text-gray-400' : 'text-gray-500'">
            <span>
              <CalendarIcon class="w-4 h-4 mr-1 inline" />{{ formatDate(pub.releaseDate) }}
            </span>
            <span v-if="pub.url"><a :href="pub.url" target="_blank" class="underline">Acessar</a></span>
          </div>
        </div>
      </section>

      <!-- Interests -->
      <section>
        <h2 class="text-2xl font-bold mb-4">Interesses</h2>
        <div class="flex flex-wrap gap-4">
          <div v-for="(int, idx) in curriculum.interests" :key="idx" class="p-4 rounded-lg border text-sm"
            :class="darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
            <h3 class="font-semibold mb-1">{{ int.name }}</h3>
            <div v-if="int.keywords?.length" class="flex flex-wrap gap-2">
              <span v-for="(kw, i) in int.keywords" :key="i" class="px-2 py-1 rounded-full border"
                :class="darkMode ? 'border-gray-600' : 'border-gray-200'">{{ kw }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- References -->
      <section>
        <h2 class="text-2xl font-bold mb-4">Referências</h2>
        <div v-for="(ref, idx) in curriculum.references" :key="idx" class="mb-8 p-4 rounded-lg border"
          :class="darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
          <h3 class="text-xl font-semibold">{{ ref.name }}</h3>
          <p class="italic mt-1">"{{ ref.reference }}"</p>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  SunIcon,
  MoonIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  AcademicCapIcon,
  HeartIcon,
  BookOpenIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({ curriculum: Object })
const darkMode = ref(false)
const imageLoadError = ref(false)

const groupedSkills = computed(() => {
  if (!props.curriculum.skills) return {}
  return props.curriculum.skills.reduce((acc, skill) => {
    const cat = skill.category || 'Outros'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(skill)
    return acc
  }, {})
})

const toggleDarkMode = () => { darkMode.value = !darkMode.value }
const onImageError = () => { imageLoadError.value = true }

const formatDate = (date) => {
  if (!date) return ''
  const [year, month] = date.split('-')
  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  return `${monthNames[parseInt(month) - 1]}/${year}`
}
const getCurrentDate = () => {
  const d = new Date()
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
