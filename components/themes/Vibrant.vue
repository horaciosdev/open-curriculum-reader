<template>
    <div class="pb-8 space-y-10 font-[Inter] bg-gradient-to-br from-gray-900 to-gray-800 print:bg-gray-900">
        <!-- Header - Versão Tecnológica Integrada -->
        <div
            class="bg-gradient-to-br from-gray-900 to-gray-800 py-12 print:py-6 print:bg-gray-900 relative border-b border-gray-700">

            <div class="max-w-6xl mx-auto px-4 space-y-8 relative">
                <div class="flex flex-col md:flex-row items-center gap-10">
                    <!-- Avatar Holográfico -->
                    <div class="relative group">
                        <div
                            class="absolute -inset-2 bg-gradient-to-r from-blue-500/40 to-cyan-500/40 rounded-full blur-lg opacity-70 group-hover:opacity-90 transition-all duration-500 animate-pulse">
                        </div>
                        <div
                            class="relative rounded-full p-1 bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-600 shadow-2xl">
                            <div v-if="!curriculum.basics.image || imageLoadError"
                                class="w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-4xl font-bold text-white">
                                {{ curriculum.basics.name?.slice(0, 2).toUpperCase() }}
                            </div>
                            <img v-else :src="curriculum.basics.image"
                                class="w-32 h-32 rounded-full object-cover border-2 border-gray-500/50" />
                        </div>
                    </div>

                    <!-- Info Principal -->
                    <div class="text-center md:text-left space-y-4">
                        <div>
                            <h1
                                class="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                {{ curriculum.basics.name }}
                            </h1>
                            <div
                                class="h-1 mt-2 bg-gradient-to-r from-blue-500/70 to-cyan-500/70 rounded-full w-3/4 mx-auto md:mx-0">
                            </div>
                        </div>

                        <p
                            class="text-2xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">
                            {{ curriculum.basics.label }}
                        </p>

                        <p class="text-lg text-gray-300 max-w-2xl leading-relaxed">
                            {{ curriculum.basics.summary }}
                        </p>
                    </div>
                </div>

                <!-- Barra de Contatos Digital -->
                <div class="flex flex-wrap justify-center gap-3 mt-6">
                    <div v-if="curriculum.basics.location"
                        class="flex items-center gap-3 bg-gray-800/80 px-5 py-3 rounded-xl border border-gray-700 hover:border-cyan-400 transition-all hover:bg-gray-700/60 backdrop-blur-sm">
                        <MapPinIcon class="w-5 h-5 text-cyan-400 flex-shrink-0" />
                        <span class="text-cyan-100 font-medium">{{ locationString }}</span>
                    </div>

                    <div v-for="profile in curriculum.basics.profiles" :key="profile.url"
                        class="flex items-center gap-3 bg-gray-800/80 px-5 py-3 rounded-xl border border-gray-700 hover:border-blue-400 transition-all hover:bg-gray-700/60 backdrop-blur-sm">
                        <a :href="profile.url" target="_blank" class="flex items-center gap-2">
                            <LinkIcon class="w-5 h-5 text-blue-400 flex-shrink-0" />
                            <span class="text-gray-200">{{ profile.network }}:</span>
                            <span class="text-cyan-300 font-medium">{{ profile.username }}</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <!-- Corpo -->
        <div class="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8 print:block">
            <!-- Coluna Esquerda -->
            <div class="md:col-span-1 space-y-8 print:space-y-4">
                <!-- Habilidades -->
                <div v-if="curriculum.skills?.length" class="space-y-4">
                    <h2
                        class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 pl-3 flex items-center gap-2">
                        <WrenchScrewdriverIcon class="w-6 h-6 text-blue-400" />
                        <span class="inline-block">
                            Habilidades
                            <span
                                class="block h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mt-1"></span>
                        </span>
                    </h2>

                    <div class="space-y-4">
                        <div v-for="(skills, category) in groupedSkills" :key="category" class="space-y-2">
                            <h3
                                class="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 text-lg">
                                {{ category }}
                                <span
                                    class="inline-block w-8 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 mt-1"></span>
                            </h3>

                            <div class="flex flex-wrap gap-3">
                                <div v-for="skill in skills" :key="skill.name"
                                    class="px-4 py-2 bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-blue-400 group relative">
                                    <span
                                        class="font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300 group-hover:from-blue-200 group-hover:to-cyan-200">
                                        {{ skill.name }}
                                    </span>
                                    <span v-if="skill.keywords"
                                        class="text-sm text-gray-400 ml-1 group-hover:text-gray-300">
                                        ({{ skill.keywords.join(', ') }})
                                    </span>
                                    <div
                                        class="absolute inset-0 rounded-xl border border-transparent group-hover:border-blue-400/30 group-hover:bg-blue-400/10 transition-all -z-10">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Educação -->
                <div v-if="curriculum.education?.length" class="space-y-4">
                    <h2
                        class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 pl-3 flex items-center gap-2">
                        <AcademicCapIcon class="w-6 h-6 text-blue-400" />
                        <span class="inline-block">
                            Formação
                            <span
                                class="block h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mt-1"></span>
                        </span>
                    </h2>
                    <div class="space-y-4">
                        <div v-for="edu in curriculum.education" :key="edu.institution"
                            class="p-6 bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl border border-gray-600 shadow-lg hover:shadow-xl hover:border-blue-400 transition-all group relative">
                            <h3
                                class="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">
                                {{ edu.institution }}</h3>
                            <p class="text-blue-100 mt-1">{{ edu.studyType }} em {{ edu.area }}</p>
                            <p class="text-sm text-blue-200/80 mt-3">{{ formatDate(edu.startDate) }} - {{ edu.endDate ?
                                formatDate(edu.endDate) : 'Atual' }}</p>
                            <div
                                class="absolute inset-0 rounded-xl border border-transparent group-hover:border-blue-400/30 group-hover:bg-blue-400/10 transition-all -z-10">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Certificações -->
                <div v-if="curriculum.certifications?.length" class="space-y-4">
                    <h2
                        class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 pl-3 flex items-center gap-2">
                        <DocumentTextIcon class="w-6 h-6 text-blue-400" />
                        <span class="inline-block">
                            Certificações
                            <span
                                class="block h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mt-1"></span>
                        </span>
                    </h2>
                    <div class="space-y-4">
                        <div v-for="cert in curriculum.certifications" :key="cert.name"
                            class="p-6 bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl border border-gray-600 shadow-lg hover:shadow-xl hover:border-blue-400 transition-all group relative">
                            <h3
                                class="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">
                                {{ cert.name }}</h3>
                            <p class="text-blue-100 mt-1">{{ cert.issuer }}</p>
                            <div class="flex justify-between items-center mt-4">
                                <span class="text-sm text-blue-200/80">{{ formatDate(cert.date) }}</span>
                                <a v-if="cert.url" :href="cert.url"
                                    class="text-cyan-300 hover:text-cyan-200 text-sm flex items-center gap-1 transition-colors">
                                    Verificar
                                    <ArrowRightIcon class="w-5 h-5" />
                                </a>
                            </div>
                            <div
                                class="absolute inset-0 rounded-xl border border-transparent group-hover:border-blue-400/30 group-hover:bg-blue-400/10 transition-all -z-10">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Interesses -->
                <div v-if="curriculum.interests?.length" class="space-y-4">
                    <h2
                        class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 pl-3 flex items-center gap-2">
                        <SparklesIcon class="w-6 h-6 text-blue-400" />
                        <span class="inline-block">
                            Interesses
                            <span
                                class="block h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mt-1"></span>
                        </span>
                    </h2>
                    <div class="space-y-4">
                        <div v-for="interest in curriculum.interests" :key="interest.name"
                            class="p-6 bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl border border-gray-600 shadow-lg hover:shadow-xl hover:border-blue-400 transition-all group relative">
                            <h3
                                class="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">
                                {{ interest.name }}</h3>
                            <div v-if="interest.keywords" class="flex flex-wrap gap-3 mt-4">
                                <span v-for="keyword in interest.keywords" :key="keyword"
                                    class="px-3 py-1 bg-gray-700 rounded-full text-sm text-cyan-200 border border-gray-600 hover:bg-gray-600 hover:border-cyan-300/50 transition-colors">
                                    {{ keyword }}
                                </span>
                            </div>
                            <div
                                class="absolute inset-0 rounded-xl border border-transparent group-hover:border-blue-400/30 group-hover:bg-blue-400/10 transition-all -z-10">
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Coluna Direita -->
            <div class="md:col-span-2 space-y-8 print:space-y-4">
                <!-- Experiência -->
                <div v-if="curriculum.work?.length" class="space-y-4">
                    <h2
                        class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 pl-3 flex items-center gap-2">
                        <BriefcaseIcon class="w-6 h-6 text-blue-400" />
                        <span class="inline-block">
                            Experiência
                            <span
                                class="block h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mt-1"></span>
                        </span>
                    </h2>
                    <div class="space-y-6">
                        <div v-for="job in curriculum.work" :key="job.organization"
                            class="p-6 bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl border border-gray-600 shadow-lg hover:shadow-xl hover:border-blue-400 transition-all group relative">
                            <div class="flex justify-between items-start">
                                <div>
                                    <h3
                                        class="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">
                                        {{ job.position }}</h3>
                                    <div class="flex items-center gap-2 mt-2">
                                        <span class="text-cyan-200 font-medium">{{ job.organization }}</span>
                                        <a v-if="job.url" :href="job.url"
                                            class="text-blue-300 hover:text-blue-200 transition-colors">
                                            <ArrowTopRightOnSquareIcon class="w-5 h-5" />
                                        </a>
                                    </div>
                                </div>
                                <span class="text-sm text-blue-200/80 whitespace-nowrap">
                                    {{ formatDate(job.startDate) }} → {{ job.endDate ? formatDate(job.endDate) : 'Atual'
                                    }}
                                </span>
                            </div>
                            <ul v-if="job.highlights" class="mt-4 space-y-3 pl-4 border-l-2 border-blue-400/50">
                                <li v-for="highlight in job.highlights" :key="highlight"
                                    class="text-blue-100 flex items-start gap-2">
                                    <ChevronRightIcon class="w-4 h-4 flex-shrink-0 mt-1 text-blue-400" />
                                    {{ highlight }}
                                </li>
                            </ul>
                            <div
                                class="absolute inset-0 rounded-xl border border-transparent group-hover:border-blue-400/30 group-hover:bg-blue-400/10 transition-all -z-10">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Voluntariado -->
                <div v-if="curriculum.volunteer?.length" class="space-y-4">
                    <h2
                        class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 pl-3 flex items-center gap-2">
                        <HeartIcon class="w-6 h-6 text-blue-400" />
                        <span class="inline-block">
                            Voluntariado
                            <span
                                class="block h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mt-1"></span>
                        </span>
                    </h2>
                    <div class="space-y-6">
                        <div v-for="vol in curriculum.volunteer" :key="vol.organization"
                            class="p-6 bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl border border-gray-600 shadow-lg hover:shadow-xl hover:border-blue-400 transition-all group relative">
                            <div class="flex justify-between items-start">
                                <div>
                                    <h3
                                        class="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">
                                        {{ vol.position }}</h3>
                                    <div class="flex items-center gap-2 mt-2">
                                        <span class="text-cyan-200 font-medium">{{ vol.organization }}</span>
                                    </div>
                                </div>
                                <span class="text-sm text-blue-200/80 whitespace-nowrap">
                                    {{ formatDate(vol.startDate) }} → {{ vol.endDate ? formatDate(vol.endDate) : 'Atual'
                                    }}
                                </span>
                            </div>
                            <ul v-if="vol.highlights" class="mt-4 space-y-3 pl-4 border-l-2 border-blue-400/50">
                                <li v-for="highlight in vol.highlights" :key="highlight"
                                    class="text-blue-100 flex items-start gap-2">
                                    <ChevronRightIcon class="w-4 h-4 flex-shrink-0 mt-1 text-blue-400" />
                                    {{ highlight }}
                                </li>
                            </ul>
                            <div
                                class="absolute inset-0 rounded-xl border border-transparent group-hover:border-blue-400/30 group-hover:bg-blue-400/10 transition-all -z-10">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Prêmios -->
                <div v-if="curriculum.awards?.length" class="space-y-4">
                    <h2
                        class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 pl-3 flex items-center gap-2">
                        <TrophyIcon class="w-6 h-6 text-blue-400" />
                        <span class="inline-block">
                            Prêmios
                            <span
                                class="block h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mt-1"></span>
                        </span>
                    </h2>
                    <div class="grid gap-4 md:grid-cols-2">
                        <div v-for="award in curriculum.awards" :key="award.title"
                            class="p-6 bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl border border-gray-600 shadow-lg hover:shadow-xl hover:border-blue-400 transition-all group relative">
                            <h3
                                class="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">
                                {{ award.title }}</h3>
                            <p class="text-blue-100 mt-1">{{ award.awarder }}</p>
                            <div class="flex justify-between items-center mt-4">
                                <span class="text-sm text-blue-200/80">{{ formatDate(award.date) }}</span>
                            </div>
                            <div
                                class="absolute inset-0 rounded-xl border border-transparent group-hover:border-blue-400/30 group-hover:bg-blue-400/10 transition-all -z-10">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Publicações -->
                <div v-if="curriculum.publications?.length" class="space-y-4">
                    <h2
                        class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 pl-3 flex items-center gap-2">
                        <BookOpenIcon class="w-6 h-6 text-blue-400" />
                        <span class="inline-block">
                            Publicações
                            <span
                                class="block h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mt-1"></span>
                        </span>
                    </h2>
                    <div class="space-y-4">
                        <div v-for="pub in curriculum.publications" :key="pub.name"
                            class="p-6 bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl border border-gray-600 shadow-lg hover:shadow-xl hover:border-blue-400 transition-all group relative">
                            <h3
                                class="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">
                                {{ pub.name }}</h3>
                            <p class="text-blue-100 mt-1">{{ pub.publisher }}</p>
                            <div class="flex justify-between items-center mt-4">
                                <span class="text-sm text-blue-200/80">{{ formatDate(pub.releaseDate) }}</span>
                                <a v-if="pub.url" :href="pub.url"
                                    class="text-cyan-300 hover:text-cyan-200 text-sm flex items-center gap-1 transition-colors">
                                    Acessar
                                    <ArrowRightIcon class="w-5 h-5" />
                                </a>
                            </div>
                            <div
                                class="absolute inset-0 rounded-xl border border-transparent group-hover:border-blue-400/30 group-hover:bg-blue-400/10 transition-all -z-10">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Referências -->
                <div v-if="curriculum.references?.length" class="space-y-4">
                    <h2
                        class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 pl-3 flex items-center gap-2">
                        <ChatBubbleLeftRightIcon class="w-6 h-6 text-blue-400" />
                        <span class="inline-block">
                            Referências
                            <span
                                class="block h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mt-1"></span>
                        </span>
                    </h2>
                    <div class="grid gap-4 md:grid-cols-2">
                        <div v-for="ref in curriculum.references" :key="ref.name"
                            class="p-6 bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl border border-gray-600 shadow-lg hover:shadow-xl hover:border-blue-400 transition-all group relative">
                            <div class="flex items-center gap-4">
                                <div
                                    class="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                                    {{ ref.name.charAt(0) }}
                                </div>
                                <h3
                                    class="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">
                                    {{ ref.name }}</h3>
                            </div>
                            <p class="mt-4 text-blue-100 italic">"{{ ref.reference }}"</p>
                            <div
                                class="absolute inset-0 rounded-xl border border-transparent group-hover:border-blue-400/30 group-hover:bg-blue-400/10 transition-all -z-10">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Curriculum } from 'open-cvt'
import {
    MapPinIcon,
    LinkIcon,
    WrenchScrewdriverIcon,
    AcademicCapIcon,
    DocumentTextIcon,
    ArrowRightIcon,
    SparklesIcon,
    BriefcaseIcon,
    ArrowTopRightOnSquareIcon,
    ChevronRightIcon,
    HeartIcon,
    TrophyIcon,
    BookOpenIcon,
    ChatBubbleLeftRightIcon
} from '@heroicons/vue/24/outline'

const props = defineProps<{
    curriculum: Curriculum
}>()

const imageLoadError = ref(false)

const locationString = computed(() => {
    const loc = props.curriculum.basics?.location
    return [loc?.address, loc?.city, loc?.region, loc?.countryCode].filter(Boolean).join(', ')
})

const formatDate = (date: string) => {
    if (!date) return ''
    const [year, month] = date.split('-')
    return `${month}/${year}`
}

const groupedSkills = computed(() => {
    if (!props.curriculum.skills) return {}
    return props.curriculum.skills.reduce((acc: Record<string, Curriculum['skills']>, skill: Curriculum['skills'][number]) => {
        const category = skill.category || 'other'
        if (!acc[category]) acc[category] = []
        acc[category].push(skill)
        return acc
    }, {} as Record<string, Curriculum['skills']>)
})

const onImageError = () => {
    imageLoadError.value = true
}
</script>