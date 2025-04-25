<template>
    <div class="mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
        <!-- Header com dados básicos -->
        <div v-if="curriculum.basics" class="relative">
            <!-- Banner decorativo -->
            <div class="bg-gradient-to-r from-blue-500 to-indigo-600 h-32 w-full"></div>

            <div class="px-8 pt-6 pb-4 relative">
                <!-- Foto + Info básica -->
                <div class="flex flex-col md:flex-row">
                    <!-- Foto do perfil -->
                    <div class="mr-6 -mt-20 mb-4 md:mb-0">
                        <img v-if="curriculum.basics.image && !imageLoadError" :src="curriculum.basics.image"
                            :alt="curriculum.basics.name" @error="onImageError"
                            class="w-32 h-32 object-cover rounded-full border-4 border-white shadow-md" />
                        <div v-else
                            class="w-32 h-32 flex items-center justify-center bg-gray-200 rounded-full border-4 border-white shadow-md">
                            <UserCircleIcon class="w-20 h-20 text-gray-400" />
                        </div>
                    </div>

                    <!-- Nome e título -->
                    <div class="flex-1">
                        <h1 class="text-3xl font-bold text-gray-800">{{ curriculum.basics.name }}</h1>
                        <p class="text-xl text-blue-600 font-medium">{{ curriculum.basics.label }}</p>

                        <!-- Informações de contato em linha numa barra -->
                        <div class="mt-4 flex flex-wrap items-center gap-4 text-gray-600">
                            <!-- Localização -->
                            <div v-if="curriculum.basics.location" class="flex items-center">
                                <MapPinIcon class="w-4 h-4 mr-1 text-blue-500" />
                                <span>{{ curriculum.basics.location.city }}{{ curriculum.basics.location.region ? ', ' +
                                    curriculum.basics.location.region : '' }} - {{
                                    curriculum.basics.location.countryCode }}</span>
                            </div>

                            <!-- Identificadores (email, telefone, etc) -->
                            <div v-for="id in curriculum.basics.identifiers" class="flex items-center">
                                <IdentificationIcon class="w-4 h-4 mr-1 text-blue-500" />
                                <span>{{ id.type }} - {{ id.value }}</span>
                            </div>
                        </div>

                        <!-- Social profiles -->
                        <div v-if="curriculum.basics.profiles?.length" class="mt-4 flex flex-wrap gap-2">
                            <a v-for="profile in curriculum.basics.profiles" :href="profile.url" target="_blank"
                                class="inline-flex items-center px-3 py-1 bg-gray-100 hover:bg-blue-50 hover:text-blue-600 rounded-full text-gray-700 transition-colors border border-gray-200">
                                <component :is="getSocialIcon(profile.network)" class="w-4 h-4 mr-1" />
                                {{ profile.network }}
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Resumo profissional -->
                <div class="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-md">
                    <p class="text-gray-700 italic">{{ curriculum.basics.summary }}</p>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
            <!-- Coluna da esquerda - Informações secundárias -->
            <div class="md:col-span-1">
                <!-- Skills -->
                <div v-if="curriculum.skills?.length" class="mb-8">
                    <h2 class="text-xl font-bold text-gray-800 border-b-2 border-blue-500 pb-2 mb-4 flex items-center">
                        <BoltIcon class="w-5 h-5 mr-2 text-blue-500" />
                        Habilidades
                    </h2>
                    <div v-for="(skills, category) in groupedSkills" class="mb-6">
                        <h3 class="text-lg font-semibold text-gray-700 mb-2">{{ category }}</h3>
                        <div class="flex flex-wrap gap-2">
                            <div v-for="skill in skills"
                                class="px-3 py-1 bg-gray-100 hover:bg-blue-50 transition-colors rounded-lg border border-gray-200">
                                <div class="font-medium">{{ skill.name }}</div>
                                <div v-if="skill.keywords?.length" class="text-xs text-gray-500 mt-1">
                                    {{ skill.keywords.join(' • ') }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Educação -->
                <div v-if="curriculum.education?.length" class="mb-8">
                    <h2 class="text-xl font-bold text-gray-800 border-b-2 border-blue-500 pb-2 mb-4 flex items-center">
                        <AcademicCapIcon class="w-5 h-5 mr-2 text-blue-500" />
                        Educação
                    </h2>
                    <div v-for="edu in curriculum.education"
                        class="mb-4 p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                        <div>
                            <h3 class="text-lg font-semibold text-gray-800">{{ edu.institution }}</h3>
                            <div class="text-blue-600">{{ edu.studyType }} em {{ edu.area }}</div>
                            <div v-if="edu.score" class="text-gray-600 text-sm">
                                <StarIcon class="w-4 h-4 inline text-yellow-500" /> Nota: {{ edu.score }}
                            </div>
                            <div class="text-gray-500 text-sm flex items-center mt-1">
                                <CalendarIcon class="w-3 h-3 mr-1" />
                                {{ formatDate(edu.startDate) }} - {{ edu.endDate ? formatDate(edu.endDate) : 'Presente'
                                }}
                            </div>
                        </div>
                        <ul v-if="edu.courses?.length" class="list-disc pl-5 mt-2 text-sm text-gray-600">
                            <li v-for="course in edu.courses" class="mb-1">{{ course }}</li>
                        </ul>
                    </div>
                </div>

                <!-- Certificações -->
                <div v-if="curriculum.certifications?.length" class="mb-8">
                    <h2 class="text-xl font-bold text-gray-800 border-b-2 border-blue-500 pb-2 mb-4 flex items-center">
                        <CheckBadgeIcon class="w-5 h-5 mr-2 text-blue-500" />
                        Certificações
                    </h2>
                    <div v-for="cert in curriculum.certifications"
                        class="mb-3 p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                        <h3 class="text-lg font-semibold text-gray-800">{{ cert.name }}</h3>
                        <p class="text-gray-600">{{ cert.issuer }}</p>
                        <div class="flex items-center text-gray-500 text-sm mt-1">
                            <CalendarIcon class="w-3 h-3 mr-1" />
                            <span>{{ formatDate(cert.date) }}</span>
                            <span v-if="cert.url" class="ml-2">
                                <a :href="cert.url" target="_blank"
                                    class="text-blue-600 hover:underline flex items-center">
                                    <LinkIcon class="w-3 h-3 mr-1" /> Verificar
                                </a>
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Interesses -->
                <div v-if="curriculum.interests?.length" class="mb-8">
                    <h2 class="text-xl font-bold text-gray-800 border-b-2 border-blue-500 pb-2 mb-4 flex items-center">
                        <SparklesIcon class="w-5 h-5 mr-2 text-blue-500" />
                        Interesses
                    </h2>
                    <div class="flex flex-wrap gap-3">
                        <div v-for="interest in curriculum.interests" class="mb-2">
                            <h3 class="text-lg font-semibold text-gray-800">{{ interest.name }}</h3>
                            <div v-if="interest.keywords?.length" class="flex flex-wrap gap-1 mt-1">
                                <span v-for="keyword in interest.keywords"
                                    class="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                                    {{ keyword }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Coluna da direita - Experiência principal -->
            <div class="md:col-span-2">
                <!-- Experiência Profissional -->
                <div v-if="curriculum.work?.length" class="mb-8">
                    <h2 class="text-xl font-bold text-gray-800 border-b-2 border-blue-500 pb-2 mb-4 flex items-center">
                        <BriefcaseIcon class="w-5 h-5 mr-2 text-blue-500" />
                        Experiência Profissional
                    </h2>

                    <div class="relative">
                        <!-- Linha do tempo vertical -->
                        <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                        <div v-for="(job, index) in curriculum.work"
                            :class="{ 'mb-8': index !== curriculum.work.length - 1 }" class="relative pl-12">
                            <!-- Círculo na linha do tempo -->
                            <div
                                class="absolute left-0 top-1.5 w-8 h-8 bg-blue-100 rounded-full border-2 border-blue-500 flex items-center justify-center">
                                <BriefcaseIcon class="w-4 h-4 text-blue-500" />
                            </div>

                            <div
                                class="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                                <div class="flex flex-col md:flex-row md:justify-between mb-2">
                                    <div>
                                        <h3 class="text-xl font-semibold text-gray-800">{{ job.position }}</h3>
                                        <div class="text-lg text-blue-600 flex items-center">
                                            <BuildingOfficeIcon class="w-4 h-4 mr-1" />
                                            {{ job.organization }}
                                            <a v-if="job.url" :href="job.url" target="_blank"
                                                class="ml-1 text-blue-600 hover:underline">
                                                <LinkIcon class="w-4 h-4" />
                                            </a>
                                        </div>
                                    </div>
                                    <div
                                        class="text-gray-500 font-medium flex items-center mt-2 md:mt-0 text-sm md:text-base">
                                        <CalendarIcon class="w-4 h-4 mr-1" />
                                        {{ formatDate(job.startDate) }} - {{ job.endDate ? formatDate(job.endDate) :
                                        'Presente' }}
                                    </div>
                                </div>
                                <ul v-if="job.highlights?.length" class="mt-3 space-y-2">
                                    <li v-for="highlight in job.highlights" class="flex items-start">
                                        <CheckCircleIcon class="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                        <span class="text-gray-700">{{ highlight }}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Trabalho Voluntário -->
                <div v-if="curriculum.volunteer?.length" class="mb-8">
                    <h2 class="text-xl font-bold text-gray-800 border-b-2 border-blue-500 pb-2 mb-4 flex items-center">
                        <HeartIcon class="w-5 h-5 mr-2 text-blue-500" />
                        Trabalho Voluntário
                    </h2>

                    <div class="space-y-4">
                        <div v-for="vol in curriculum.volunteer"
                            class="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                            <div class="flex flex-col md:flex-row md:justify-between mb-2">
                                <div>
                                    <h3 class="text-xl font-semibold text-gray-800">{{ vol.position }}</h3>
                                    <div class="text-blue-600">{{ vol.organization }}</div>
                                </div>
                                <div
                                    class="text-gray-500 font-medium flex items-center mt-2 md:mt-0 text-sm md:text-base">
                                    <CalendarIcon class="w-4 h-4 mr-1" />
                                    {{ formatDate(vol.startDate) }} - {{ vol.endDate ? formatDate(vol.endDate) :
                                    'Presente' }}
                                </div>
                            </div>
                            <ul v-if="vol.highlights?.length" class="mt-3 space-y-2">
                                <li v-for="highlight in vol.highlights" class="flex items-start">
                                    <HeartIcon class="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                                    <span class="text-gray-700">{{ highlight }}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- Prêmios -->
                <div v-if="curriculum.awards?.length" class="mb-8">
                    <h2 class="text-xl font-bold text-gray-800 border-b-2 border-blue-500 pb-2 mb-4 flex items-center">
                        <TrophyIcon class="w-5 h-5 mr-2 text-blue-500" />
                        Prêmios
                    </h2>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div v-for="award in curriculum.awards"
                            class="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                            <div class="flex items-center mb-2">
                                <div class="bg-yellow-100 rounded-full p-2 mr-3">
                                    <TrophyIcon class="w-5 h-5 text-yellow-600" />
                                </div>
                                <h3 class="text-lg font-semibold text-gray-800">{{ award.title }}</h3>
                            </div>
                            <p class="text-gray-700">{{ award.awarder }}</p>
                            <div class="flex items-center text-gray-500 text-sm mt-2">
                                <CalendarIcon class="w-3 h-3 mr-1" />
                                <span>{{ formatDate(award.date) }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Publicações -->
                <div v-if="curriculum.publications?.length" class="mb-8">
                    <h2 class="text-xl font-bold text-gray-800 border-b-2 border-blue-500 pb-2 mb-4 flex items-center">
                        <BookOpenIcon class="w-5 h-5 mr-2 text-blue-500" />
                        Publicações
                    </h2>

                    <div class="space-y-4">
                        <div v-for="pub in curriculum.publications"
                            class="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                            <h3 class="text-lg font-semibold text-gray-800">{{ pub.name }}</h3>
                            <p class="text-gray-700 flex items-center">
                                <BookOpenIcon class="w-4 h-4 mr-1 text-blue-500" />
                                {{ pub.publisher }}
                            </p>
                            <div class="flex items-center justify-between mt-2">
                                <div class="text-gray-500 text-sm flex items-center">
                                    <CalendarIcon class="w-3 h-3 mr-1" />
                                    <span>{{ formatDate(pub.releaseDate) }}</span>
                                </div>
                                <a v-if="pub.url" :href="pub.url" target="_blank"
                                    class="text-blue-600 hover:text-blue-800 flex items-center text-sm">
                                    <ArrowTopRightOnSquareIcon class="w-4 h-4 mr-1" />
                                    Acessar publicação
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Referências -->
                <div v-if="curriculum.references?.length">
                    <h2 class="text-xl font-bold text-gray-800 border-b-2 border-blue-500 pb-2 mb-4 flex items-center">
                        <UserGroupIcon class="w-5 h-5 mr-2 text-blue-500" />
                        Referências
                    </h2>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div v-for="ref in curriculum.references"
                            class="p-5 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                            <div class="flex items-start mb-3">
                                <div class="bg-blue-100 rounded-full p-2 mr-3">
                                    <UserIcon class="w-5 h-5 text-blue-600" />
                                </div>
                                <h3 class="text-lg font-semibold text-gray-800 mt-1">{{ ref.name }}</h3>
                            </div>
                            <p class="text-gray-700 italic pl-2 border-l-4 border-blue-200 py-1">
                                "{{ ref.reference }}"
                            </p>
                        </div>
                    </div>
                </div>
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
    CalendarIcon,
    LinkIcon,
    ArrowTopRightOnSquareIcon,
    BuildingOfficeIcon,
    CheckCircleIcon,
    StarIcon,
    UserCircleIcon,
    UserIcon,
    IdentificationIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
    curriculum: Object
})

const imageLoadError = ref(false)

const formatDate = (date) => {
    if (!date) return ''
    const [year, month] = date.split('-')

    // Tenta converter o mês de número para nome
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    const monthName = monthNames[parseInt(month) - 1] || month

    return `${monthName}/${year}`
}

const getCurrentDate = () => {
    const now = new Date()
    const day = now.getDate()
    const month = now.getMonth() + 1
    const year = now.getFullYear()
    return `${day}/${month}/${year}`
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

const getSocialIcon = (network) => {
    // Simplificado - na implementação real poderia ter ícones específicos
    return GlobeAltIcon
}
</script>