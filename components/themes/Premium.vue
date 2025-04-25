<template>
    <div :class="['min-h-screen flex flex-col', darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900']">
        <!-- Header with Pattern Background -->
        <div class="cv-header relative overflow-visible">
            <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-20 pointer-events-none">
            </div>
            <div class="relative flex items-center justify-between p-8 border-b"
                :class="darkMode ? 'border-gray-700' : 'border-gray-200'">
                <div class="flex items-center space-x-6">
                    <img v-if="curriculum.basics.image && !imageLoadError" :src="curriculum.basics.image"
                        :alt="curriculum.basics.name" @error="onImageError"
                        class="w-20 h-20 rounded-full border-4 shadow-lg"
                        :class="darkMode ? 'border-blue-400' : 'border-blue-600'" />
                    <div>
                        <h1 class="text-5xl font-extrabold tracking-tight">{{ curriculum.basics.name }}</h1>
                        <p class="text-2xl italic opacity-75 mt-1">{{ curriculum.basics.label }}</p>
                        <p class="mt-3 max-w-xl">{{ curriculum.basics.summary }}</p>
                        <div class="mt-4 text-sm flex flex-wrap items-center gap-4"
                            :class="darkMode ? 'text-gray-400' : 'text-gray-700'">
                            <div class="flex items-center">
                                <MapPinIcon class="w-5 h-5 mr-1" />{{ fullLocation }}
                            </div>
                            <div v-for="id in curriculum.basics.identifiers" :key="id.value" class="flex items-center">
                                <component :is="getIdentifierIcon(id.type)" class="w-5 h-5 mr-1" />{{ id.value }}
                            </div>
                            <div v-if="linkedinProfile" class="flex items-center">
                                <QrCodeIcon class="w-5 h-5 mr-1" /><a :href="linkedinProfile.url" target="_blank"
                                    class="underline">LinkedIn QR</a>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Theme toggle hidden in print -->
                <button @click="toggleDarkMode" class="toggle-theme p-2 rounded-full transition-shadow"
                    :class="darkMode ? 'bg-yellow-300 shadow-md' : 'bg-gray-200 shadow-sm'">
                    <SunIcon v-if="!darkMode" class="w-6 h-6" />
                    <MoonIcon v-else class="w-6 h-6" />
                </button>
            </div>
        </div>

        <main class="flex-1 overflow-y-auto p-8 space-y-16">
            <!-- Work -->
            <section id="work" class="section-transition opacity-100 translate-y-0">
                <h2 class="flex items-center text-3xl font-bold mb-6">
                    <BriefcaseIcon class="w-8 h-8 mr-3 text-blue-500" />Experiência Profissional
                </h2>
                <ol class="border-l-2 relative">
                    <li v-for="(job, i) in curriculum.work" :key="i" class="mb-10 ml-6">
                        <span class="absolute -left-4 flex items-center justify-center w-8 h-8 rounded-full"
                            :class="darkMode ? 'bg-blue-500 text-white' : 'bg-white border-2 border-blue-500 text-blue-500'">{{
                                i + 1 }}</span>
                        <h3 class="text-xl font-semibold">{{ job.position }} <span class="text-sm text-gray-500">@ {{
                            job.organization }}</span></h3>
                        <time :datetime="job.startDate + '-' + job.endDate" class="block text-sm mb-2"
                            :class="darkMode ? 'text-gray-400' : 'text-gray-500'">{{ formatDate(job.startDate) }} – {{
                                job.endDate ? formatDate(job.endDate) : 'Presente' }}</time>
                        <ul class="list-disc pl-5 space-y-2">
                            <li v-for="(h, j) in job.highlights" :key="j">{{ h }}</li>
                        </ul>
                    </li>
                </ol>
            </section>

            <!-- Education -->
            <section id="education" class="section-transition opacity-100 translate-y-0">
                <h2 class="flex items-center text-3xl font-bold mb-6">
                    <AcademicCapIcon class="w-8 h-8 mr-3 text-green-500" />Educação
                </h2>
                <div class="grid md:grid-cols-2 gap-8">
                    <div v-for="(edu, i) in curriculum.education" :key="i"
                        class="p-6 rounded-lg border hover:shadow-md transition-shadow"
                        :class="darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
                        <h3 class="text-xl font-semibold">{{ edu.institution }}</h3>
                        <p class="text-sm text-gray-500">{{ edu.studyType }} em {{ edu.area }}</p>
                        <time class="text-sm mt-2 block" :class="darkMode ? 'text-gray-400' : 'text-gray-500'">{{
                            formatDate(edu.startDate) }} – {{ edu.endDate ? formatDate(edu.endDate) : 'Presente'
                            }}</time>
                        <ul v-if="edu.courses?.length" class="mt-4 list-disc pl-5 space-y-1 text-sm">
                            <li v-for="(c, k) in edu.courses" :key="k">{{ c }}</li>
                        </ul>
                    </div>
                </div>
            </section>

            <!-- Skills -->
            <section id="skills" class="section-transition opacity-100 translate-y-0">
                <h2 class="flex items-center text-3xl font-bold mb-6">
                    <BoltIcon class="w-8 h-8 mr-3 text-yellow-500" />Habilidades
                </h2>
                <div class="flex flex-wrap gap-6">
                    <div v-for="(skills, category) in groupedSkills" :key="category"
                        class="p-4 rounded-lg border hover:shadow-md transition-shadow"
                        :class="darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
                        <h3 class="font-semibold mb-2">{{ category }}</h3>
                        <div class="flex flex-wrap gap-2">
                            <span v-for="(s, i) in skills" :key="i" class="px-3 py-1 rounded-full border text-sm"
                                :class="darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'">{{
                                    s.name }}</span>
                        </div>
                        <div v-if="skills.some(s => s.keywords?.length)" class="mt-2 text-sm"
                            :class="darkMode ? 'text-gray-400' : 'text-gray-600'">{{skills.flatMap(s => s.keywords ||
                                []).join(', ')}}</div>
                    </div>
                </div>
            </section>

            <!-- Certifications -->
            <section id="certifications" class="section-transition opacity-100 translate-y-0">
                <h2 class="flex items-center text-3xl font-bold mb-6">
                    <CheckBadgeIcon class="w-8 h-8 mr-3 text-indigo-500" />Certificações
                </h2>
                <div class="grid md:grid-cols-2 gap-8">
                    <div v-for="(cert, i) in curriculum.certifications" :key="i"
                        class="p-6 rounded-lg border hover:shadow-md transition-shadow"
                        :class="darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
                        <h3 class="text-xl font-semibold">{{ cert.name }}</h3>
                        <p class="text-sm italic mt-1">{{ cert.issuer }}</p>
                        <time class="text-sm mt-2 block" :class="darkMode ? 'text-gray-400' : 'text-gray-500'">{{
                            formatDate(cert.date) }}</time>
                        <a v-if="cert.url" :href="cert.url" target="_blank"
                            class="text-sm underline mt-2 block">Verificar</a>
                    </div>
                </div>
            </section>

            <!-- Volunteer -->
            <section id="volunteer" class="section-transition opacity-100 translate-y-0">
                <h2 class="flex items-center text-3xl font-bold mb-6">
                    <HeartIcon class="w-8 h-8 mr-3 text-red-500" />Trabalho Voluntário
                </h2>
                <div class="space-y-8">
                    <div v-for="(vol, i) in curriculum.volunteer" :key="i"
                        class="p-6 rounded-lg border hover:shadow-md transition-shadow"
                        :class="darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
                        <h3 class="text-xl font-semibold">{{ vol.position }}</h3>
                        <p class="text-sm text-gray-500 mt-1">{{ vol.organization }}</p>
                        <time class="text-sm mt-2 block" :class="darkMode ? 'text-gray-400' : 'text-gray-500'">{{
                            formatDate(vol.startDate) }} – {{ vol.endDate ? formatDate(vol.endDate) : 'Presente'
                            }}</time>
                        <ul v-if="vol.highlights?.length" class="mt-4 list-disc pl-5 space-y-1 text-sm">
                            <li v-for="(h, j) in vol.highlights" :key="j">{{ h }}</li>
                        </ul>
                    </div>
                </div>
            </section>

            <!-- Awards -->
            <section id="awards" class="section-transition opacity-100 translate-y-0">
                <h2 class="flex items-center text-3xl font-bold mb-6">
                    <TrophyIcon class="w-8 h-8 mr-3 text-yellow-500" />Prêmios
                </h2>
                <div class="grid md:grid-cols-2 gap-8">
                    <div v-for="(award, i) in curriculum.awards" :key="i"
                        class="p-6 rounded-lg border hover:shadow-md transition-shadow"
                        :class="darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
                        <h3 class="text-xl font-semibold">{{ award.title }}</h3>
                        <p class="text-sm italic mt-1">{{ award.awarder }}</p>
                        <time class="text-sm mt-2 block" :class="darkMode ? 'text-gray-400' : 'text-gray-500'">{{
                            formatDate(award.date) }}</time>
                    </div>
                </div>
            </section>

            <!-- Publications -->
            <section id="publications" class="section-transition opacity-100 translate-y-0">
                <h2 class="flex items-center text-3xl font-bold mb-6">
                    <BookOpenIcon class="w-8 h-8 mr-3 text-green-600" />Publicações
                </h2>
                <div class="space-y-8">
                    <div v-for="(pub, i) in curriculum.publications" :key="i"
                        class="p-6 rounded-lg border hover:shadow-md transition-shadow"
                        :class="darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
                        <h3 class="text-xl font-semibold">{{ pub.name }}</h3>
                        <p class="text-sm text-gray-500 mt-1">{{ pub.publisher }}</p>
                        <time class="text-sm mt-2 block" :class="darkMode ? 'text-gray-400' : 'text-gray-500'">{{
                            formatDate(pub.releaseDate) }}</time>
                        <a v-if="pub.url" :href="pub.url" target="_blank"
                            class="text-sm underline mt-2 block">Acessar</a>
                    </div>
                </div>
            </section>

            <!-- Interests -->
            <section id="interests" class="section-transition opacity-100 translate-y-0">
                <h2 class="flex items-center text-3xl font-bold mb-6">
                    <SparklesIcon class="w-8 h-8 mr-3 text-pink-500" />Interesses
                </h2>
                <div class="flex flex-wrap gap-6">
                    <div v-for="(int, i) in curriculum.interests" :key="i"
                        class="p-4 rounded-lg border text-sm hover:shadow-md transition-shadow"
                        :class="darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
                        <h3 class="font-semibold mb-2">{{ int.name }}</h3>
                        <div v-if="int.keywords?.length" class="flex flex-wrap gap-2">
                            <span v-for="(kw, j) in int.keywords" :key="j" class="px-2 py-1 rounded-full border"
                                :class="darkMode ? 'border-gray-600' : 'border-gray-200'">{{ kw }}</span>
                        </div>
                    </div>
                </div>
            </section>

            <!-- References -->
            <section id="references" class="section-transition opacity-100 translate-y-0">
                <h2 class="flex items-center text-3xl font-bold mb-6">
                    <UserGroupIcon class="w-8 h-8 mr-3 text-blue-400" />Referências
                </h2>
                <div class="space-y-8">
                    <div v-for="(ref, i) in curriculum.references" :key="i"
                        class="p-6 rounded-lg border hover:shadow-md transition-shadow"
                        :class="darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
                        <h3 class="text-xl font-semibold">{{ ref.name }}</h3>
                        <p class="italic mt-2">"{{ ref.reference }}"</p>
                    </div>
                </div>
            </section>
        </main>

        <footer class="text-center p-4 border-t" :class="darkMode ? 'border-gray-700' : 'border-gray-200'">
            Atualizado em {{ getCurrentDate() }}
        </footer>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
    SunIcon,
    MoonIcon,
    MapPinIcon,
    QrCodeIcon,
    BoltIcon,
    CheckBadgeIcon,
    HeartIcon,
    TrophyIcon,
    BookOpenIcon,
    SparklesIcon,
    UserGroupIcon,
    BriefcaseIcon,
    AcademicCapIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({ curriculum: Object })
const darkMode = ref(false)
const imageLoadError = ref(false)
const showTopButton = ref(false)

const fullLocation = computed(() => {
    const loc = props.curriculum.basics.location
    return `${loc.address ? loc.address + ', ' : ''}${loc.city}, ${loc.region} - ${loc.countryCode}`
})

const linkedinProfile = computed(() => props.curriculum.basics.profiles?.find(p => /linkedin\.com/.test(p.url)))

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

const getIdentifierIcon = (type) => ({ email: 'EnvelopeIcon', phone: 'PhoneIcon', website: 'GlobeAltIcon' }[type.toLowerCase()] || 'GlobeAltIcon')

const getCurrentDate = () => {
    const d = new Date()
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}
</script>

<style scoped>
.section-transition {
    opacity: 1;
    transform: translateY(0);
    transition: all 0.6s ease-out;
}

@media print {

    /* Hide theme toggle */
    .toggle-theme {
        display: none !important;
    }

    /* Remove min-height on print */
    .min-h-screen {
        min-height: auto !important;
    }

    /* Header prints compactly with gradient */
    .cv-header {
        display: block !important;
        overflow: visible !important;
    }

    .cv-header .absolute {
        display: block !important;
    }

    /* Prevent page breaks inside sections */
    .cv-content section {
        page-break-inside: avoid;
    }
}
</style>