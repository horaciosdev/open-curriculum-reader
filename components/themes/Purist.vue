<template>
    <div>
        <!-- Basics -->
        <div v-if="curriculum.basics">
            <img v-if="curriculum.basics.image" :src="curriculum.basics.image" :alt="curriculum.basics.name"
                @error="onImageError">
            <h1>{{ curriculum.basics.name }}</h1>
            <p>{{ curriculum.basics.label }}</p>
            <p>{{ curriculum.basics.summary }}</p>

            <div v-if="curriculum.basics.location">
                <span v-if="curriculum.basics.location.address">{{ curriculum.basics.location.address }}, </span>
                <span>{{ curriculum.basics.location.city }}</span>
                <span v-if="curriculum.basics.location.region">, {{ curriculum.basics.location.region }}</span>
                <span> - {{ curriculum.basics.location.countryCode }}</span>
            </div>

            <div v-if="curriculum.basics.identifiers?.length">
                <span v-for="id in curriculum.basics.identifiers">{{ id.type }}: {{ id.value }}</span>
            </div>

            <div v-if="curriculum.basics.profiles?.length">
                <a v-for="profile in curriculum.basics.profiles" :href="profile.url" target="_blank">
                    <div>
                        {{ profile.network }}
                    </div>
                </a>
            </div>
        </div>

        <!-- Work -->
        <div v-if="curriculum.work?.length">
            <h2>Experiência Profissional</h2>
            <div v-for="job in curriculum.work">
                <div>
                    <h3>{{ job.position }}</h3>
                    <div>
                        {{ job.organization }}
                        <a v-if="job.url" :href="job.url" target="_blank">(Website)</a>
                    </div>
                    <div>
                        {{ formatDate(job.startDate) }} - {{ job.endDate ? formatDate(job.endDate) : 'Presente' }}
                    </div>
                </div>
                <ul v-if="job.highlights?.length">
                    <li v-for="highlight in job.highlights">{{ highlight }}</li>
                </ul>
            </div>
        </div>

        <!-- Education -->
        <div v-if="curriculum.education?.length">
            <h2>Educação</h2>
            <div v-for="edu in curriculum.education">
                <div>
                    <h3>{{ edu.institution }}</h3>
                    <div>{{ edu.studyType }} em {{ edu.area }}</div>
                    <div v-if="edu.score">Nota: {{ edu.score }}</div>
                    <div>
                        {{ formatDate(edu.startDate) }} - {{ edu.endDate ? formatDate(edu.endDate) : 'Presente' }}
                    </div>
                </div>
                <ul v-if="edu.courses?.length">
                    <li v-for="course in edu.courses">{{ course }}</li>
                </ul>
            </div>
        </div>

        <!-- Certifications -->
        <div v-if="curriculum.certifications?.length">
            <h2>Certificações</h2>
            <div v-for="cert in curriculum.certifications">
                <h3>{{ cert.name }}</h3>
                <p>{{ cert.issuer }}</p>
                <div>
                    <span>{{ formatDate(cert.date) }}</span> -
                    <a v-if="cert.url" :href="cert.url" target="_blank">Verificar</a>
                </div>
            </div>
        </div>

        <!-- Skills -->
        <div v-if="curriculum.skills?.length">
            <h2>Habilidades</h2>
            <div v-for="(skills, category) in groupedSkills">
                <h3>{{ category }}</h3>
                <div>
                    <div v-for="skill in skills">
                        <span>{{ skill.name }}</span>
                        <div v-if="skill.keywords?.length">{{ skill.keywords.join(', ') }}</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Volunteer -->
        <div v-if="curriculum.volunteer?.length">
            <h2>Trabalho Voluntário</h2>
            <div v-for="vol in curriculum.volunteer">
                <div>
                    <h3>{{ vol.position }}</h3>
                    <div>{{ vol.organization }}</div>
                    <div>
                        {{ formatDate(vol.startDate) }} - {{ vol.endDate ? formatDate(vol.endDate) : 'Presente' }}
                    </div>
                </div>
                <ul v-if="vol.highlights?.length">
                    <li v-for="highlight in vol.highlights">{{ highlight }}</li>
                </ul>
            </div>
        </div>

        <!-- Awards -->
        <div v-if="curriculum.awards?.length">
            <h2>Prêmios</h2>
            <div v-for="award in curriculum.awards">
                <h3>{{ award.title }}</h3>
                <p>{{ award.awarder }}</p>
                <p>{{ formatDate(award.date) }}</p>
            </div>
        </div>

        <!-- Publications -->
        <div v-if="curriculum.publications?.length">
            <h2>Publicações</h2>
            <div v-for="pub in curriculum.publications">
                <h3>{{ pub.name }}</h3>
                <p>{{ pub.publisher }}</p>
                <div>
                    <span>{{ formatDate(pub.releaseDate) }}</span> -
                    <a v-if="pub.url" :href="pub.url" target="_blank">Acessar publicação</a>
                </div>
            </div>
        </div>

        <!-- Interests -->
        <div v-if="curriculum.interests?.length">
            <h2>Interesses</h2>
            <div v-for="interest in curriculum.interests">
                <h3>{{ interest.name }}</h3>
                <div v-if="interest.keywords?.length">
                    <span v-for="keyword in interest.keywords">{{ keyword }}</span>
                </div>
            </div>
        </div>

        <!-- References -->
        <div v-if="curriculum.references?.length">
            <h2>Referências</h2>
            <div v-for="ref in curriculum.references">
                <div>
                    <h3>{{ ref.name }}</h3>
                </div>
                <p>"{{ ref.reference }}"</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'

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
        const category = skill.category || 'other'
        if (!acc[category]) acc[category] = []
        acc[category].push(skill)
        return acc
    }, {})
})

const onImageError = () => {
    imageLoadError.value = true
}
</script>

<style scoped>
/* Reset mínimo para garantir estilos padrão consistentes */
:root {
    font-family: serif;
    /* Fallback para o padrão */
    line-height: 1.5;
}

h1 {
    font-size: 2em;
    margin: 0.67em 0;
}

h2 {
    font-size: 1.5em;
    margin: 0.75em 0;
}

h3 {
    font-size: 1.17em;
    margin: 0.83em 0;
}

p {
    margin: 1em 0;
}

a {
    color: -webkit-link;
    text-decoration: underline;
    cursor: pointer;
}

ul {
    display: block;
    list-style-type: disc;
    margin: 1em 0;
    padding-left: 40px;
}

li {
    display: list-item;
}

img {
    display: inline-block;
    max-width: 150px;
}
</style>