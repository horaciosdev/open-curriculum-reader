<template>
    <div class="rpg-parchment">
        <!-- Cabeçalho: Ficha de Personagem -->
        <div v-if="curriculum.basics" class="character-sheet">
            <div class="parchment-header">
                <h1 class="character-name">{{ curriculum.basics.name }}</h1>
                <h2 class="character-class">{{ curriculum.basics.label }}</h2>
            </div>

            <div class="character-main-info">
                <div class="character-portrait">
                    <div v-if="!curriculum.basics.image || imageLoadError" class="avatar-placeholder">
                        <span>{{ curriculum.basics.name ? curriculum.basics.name.slice(0, 2).toUpperCase() : ''
                            }}</span>
                    </div>
                    <img v-else :src="curriculum.basics.image" :alt="curriculum.basics.name" @error="onImageError" />
                </div>

                <div class="character-stats">
                    <div class="stat-box">
                        <div class="stat-icon">📜</div>
                        <div class="stat-label">RESUMO</div>
                        <div class="stat-description">{{ curriculum.basics.summary }}</div>
                    </div>
                </div>
            </div>

            <!-- Atributos Regionais -->
            <div v-if="curriculum.basics.location" class="character-attributes">
                <div class="attribute">
                    <i class="icon-castle"></i>
                    <span class="attribute-label">Reino:</span>
                    <span class="attribute-value">
                        <span v-if="curriculum.basics.location.address">{{ curriculum.basics.location.address }},
                        </span>
                        <span>{{ curriculum.basics.location.city }}</span>
                        <span v-if="curriculum.basics.location.region">, {{ curriculum.basics.location.region }}</span>
                        <span> - {{ curriculum.basics.location.countryCode }}</span>
                    </span>
                </div>

                <div v-if="curriculum.basics.identifiers?.length" class="attribute-group">
                    <div v-for="id in curriculum.basics.identifiers" :key="id.type" class="attribute">
                        <i class="icon-scroll"></i>
                        <span class="attribute-label">{{ id.type }}:</span>
                        <span class="attribute-value">{{ id.value }}</span>
                    </div>
                </div>
            </div>

            <!-- Alianças e Guildas -->
            <div v-if="curriculum.basics.profiles?.length" class="guilds-alliances">
                <h3 class="section-title">Alianças & Guildas</h3>
                <div class="guild-badges">
                    <a v-for="profile in curriculum.basics.profiles" :key="profile.url" :href="profile.url"
                        target="_blank" class="guild-badge">
                        <i :class="'icon-' + getNetworkIcon(profile.network)"></i>
                        <span class="guild-name">{{ profile.network }}</span>
                        <span v-if="profile.username" class="guild-rank">{{ profile.username }}</span>
                    </a>
                </div>
            </div>
        </div>

        <!-- Divisor ornamentado entre seções -->
        <div class="section-divider">
            <div class="divider-line"></div>
            <div class="divider-emblem"></div>
            <div class="divider-line"></div>
        </div>

        <!-- Registro de Missões (Experiência) -->
        <div v-if="curriculum.work?.length" class="quest-log">
            <h2 class="section-title main-section">Registro de Missões</h2>
            <div class="quests">
                <div v-for="job in curriculum.work" :key="job.organization" class="quest-card">
                    <div class="quest-header">
                        <div class="quest-icon">
                            <i class="icon-quest"></i>
                        </div>
                        <div class="quest-title-section">
                            <h3 class="quest-title">{{ job.position }}</h3>
                            <h4 class="quest-location">{{ job.organization }}</h4>
                            <a v-if="job.url" :href="job.url" target="_blank" class="quest-map-link">
                                <i class="icon-map"></i> Ver Mapa da Guilda
                            </a>
                        </div>
                        <div class="quest-period">
                            <div class="timespan-badge">
                                {{ formatDate(job.startDate) }} - {{ job.endDate ? formatDate(job.endDate) : 'Atual' }}
                            </div>
                        </div>
                    </div>

                    <div v-if="job.highlights?.length" class="quest-accomplishments">
                        <ul>
                            <li v-for="highlight in job.highlights" :key="highlight">
                                <i class="icon-checkmark"></i>
                                <span>{{ highlight }}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <!-- Academias Mágicas (Educação) -->
        <div v-if="curriculum.education?.length" class="magic-academies">
            <h2 class="section-title main-section">Academias & Treinamentos</h2>
            <div class="schools">
                <div v-for="edu in curriculum.education" :key="edu.institution" class="school-card">
                    <div class="school-banner">
                        <div class="school-emblem">
                            <i class="icon-book"></i>
                        </div>
                        <div class="school-info">
                            <h3 class="school-name">{{ edu.institution }}</h3>
                            <div class="school-focus">{{ edu.studyType }} em {{ edu.area }}</div>
                            <div v-if="edu.score" class="school-mastery">
                                <span class="mastery-label">Domínio:</span>
                                <div class="mastery-bar">
                                    <div class="mastery-fill" :style="{ width: calculateMasteryWidth(edu.score) }">
                                    </div>
                                </div>
                                <span class="mastery-value">{{ edu.score }}</span>
                            </div>
                        </div>
                        <div class="school-period">
                            <div class="timespan-badge">
                                {{ formatDate(edu.startDate) }} - {{ edu.endDate ? formatDate(edu.endDate) : 'Atual' }}
                            </div>
                        </div>
                    </div>

                    <div v-if="edu.courses?.length" class="school-courses">
                        <h4 class="courses-title">Grimórios Estudados:</h4>
                        <ul class="course-list">
                            <li v-for="course in edu.courses" :key="course">
                                <i class="icon-scroll"></i>
                                <span>{{ course }}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <!-- Pergaminhos & Runas (Certificações) -->
        <div v-if="curriculum.certifications?.length" class="certification-scrolls">
            <h2 class="section-title main-section">Pergaminhos & Runas Adquiridas</h2>
            <div class="scrolls-container">
                <div v-for="cert in curriculum.certifications" :key="cert.name" class="scroll-item">
                    <div class="scroll-seal"></div>
                    <div class="scroll-content">
                        <h3 class="scroll-title">{{ cert.name }}</h3>
                        <div class="scroll-issuer">
                            <i class="icon-quill"></i>
                            <span>{{ cert.issuer }}</span>
                        </div>
                        <div class="scroll-date">
                            <i class="icon-hourglass"></i>
                            <span>{{ formatDate(cert.date) }}</span>
                        </div>
                        <a v-if="cert.url" :href="cert.url" target="_blank" class="scroll-verify">
                            <i class="icon-eye"></i> Verificar Autenticidade
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <!-- Árvore de Habilidades (Habilidades) -->
        <div v-if="curriculum.skills?.length" class="skill-tree">
            <h2 class="section-title main-section">Árvore de Habilidades</h2>
            <div class="skill-branches">
                <div v-for="(skills, category) in groupedSkills" :key="category" class="skill-branch">
                    <div class="branch-header">
                        <div class="branch-icon">
                            <i :class="'icon-' + getSkillIcon(category)"></i>
                        </div>
                        <h3 class="branch-title">{{ formatCategory(category) }}</h3>
                    </div>

                    <div class="skills-container">
                        <div v-for="skill in skills" :key="skill.name" class="skill-card">
                            <div class="skill-name">{{ skill.name }}</div>
                            <div v-if="skill.keywords?.length" class="skill-keywords">
                                <span v-for="keyword in skill.keywords" :key="keyword" class="keyword-pill">
                                    {{ keyword }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Atos de Heroísmo (Trabalho Voluntário) -->
        <div v-if="curriculum.volunteer?.length" class="heroic-deeds">
            <h2 class="section-title main-section">Atos de Heroísmo</h2>
            <div class="deeds-container">
                <div v-for="vol in curriculum.volunteer" :key="vol.organization" class="deed-scroll">
                    <div class="deed-icon">
                        <i class="icon-heart"></i>
                    </div>
                    <div class="deed-content">
                        <div class="deed-header">
                            <h3 class="deed-title">{{ vol.position }}</h3>
                            <div class="deed-org">{{ vol.organization }}</div>
                            <div class="deed-period">
                                <div class="timespan-badge small">
                                    {{ formatDate(vol.startDate) }} - {{ vol.endDate ? formatDate(vol.endDate) : 'Atual'
                                    }}
                                </div>
                            </div>
                        </div>

                        <div v-if="vol.highlights?.length" class="deed-highlights">
                            <ul>
                                <li v-for="highlight in vol.highlights" :key="highlight">
                                    <i class="icon-star"></i>
                                    <span>{{ highlight }}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Medalhas & Honrarias (Prêmios) -->
        <div v-if="curriculum.awards?.length" class="medals-honors">
            <h2 class="section-title main-section">Medalhas & Honrarias</h2>
            <div class="medals-display">
                <div v-for="award in curriculum.awards" :key="award.title" class="medal-item">
                    <div class="medal-icon">
                        <i class="icon-medal"></i>
                    </div>
                    <div class="medal-ribbon"></div>
                    <div class="medal-info">
                        <h3 class="medal-title">{{ award.title }}</h3>
                        <div class="medal-awarder">{{ award.awarder }}</div>
                        <div class="medal-date">{{ formatDate(award.date) }}</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tomos Publicados (Publicações) -->
        <div v-if="curriculum.publications?.length" class="published-tomes">
            <h2 class="section-title main-section">Tomos & Tratados Publicados</h2>
            <div class="tomes-shelves">
                <div v-for="pub in curriculum.publications" :key="pub.name" class="tome-book">
                    <div class="tome-spine">
                        <div class="spine-title">{{ pub.name.substring(0, 1) }}</div>
                    </div>
                    <div class="tome-cover">
                        <h3 class="tome-title">{{ pub.name }}</h3>
                        <div class="tome-publisher">
                            <i class="icon-printing-press"></i>
                            <span>{{ pub.publisher }}</span>
                        </div>
                        <div class="tome-date">
                            <i class="icon-calendar"></i>
                            <span>{{ formatDate(pub.releaseDate) }}</span>
                        </div>
                        <a v-if="pub.url" :href="pub.url" target="_blank" class="tome-link">
                            <i class="icon-book-open"></i> Ler Manuscrito
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <!-- Passatempos & Hobbies (Interesses) -->
        <div v-if="curriculum.interests?.length" class="interests-tavern">
            <h2 class="section-title main-section">Passatempos na Taverna</h2>
            <div class="interests-container">
                <div v-for="interest in curriculum.interests" :key="interest.name" class="interest-tankard">
                    <div class="tankard-top">
                        <i class="icon-mug"></i>
                        <h3 class="interest-name">{{ interest.name }}</h3>
                    </div>
                    <div v-if="interest.keywords?.length" class="interest-keywords">
                        <span v-for="keyword in interest.keywords" :key="keyword" class="keyword-tag">
                            {{ keyword }}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Aliados & Testemunhos (Referências) -->
        <div v-if="curriculum.references?.length" class="allies-testimonials">
            <h2 class="section-title main-section">Aliados & Testemunhos</h2>
            <div class="allies-container">
                <div v-for="ref in curriculum.references" :key="ref.name" class="ally-card">
                    <div class="ally-portrait">
                        <div class="ally-avatar">
                            {{ ref.name.charAt(0) }}
                        </div>
                    </div>
                    <div class="ally-testimony">
                        <h3 class="ally-name">{{ ref.name }}</h3>
                        <div class="testimony-scroll">
                            <i class="icon-quote-left"></i>
                            <p class="testimony-text">{{ ref.reference }}</p>
                            <i class="icon-quote-right"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Rodapé com decoração heráldica -->
        <div class="footer-heraldry">
            <div class="heraldry-emblem"></div>
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

const calculateMasteryWidth = (score: string) => {
    // Convert score to percentage width for mastery bar
    if (!score) return '0%'

    // Handle different scoring formats
    if (score.includes('/')) {
        const [value, total] = score.split('/')
        return `${(parseFloat(value) / parseFloat(total)) * 100}%`
    } else if (score.includes('%')) {
        return score
    } else {
        const numScore = parseFloat(score)
        if (isNaN(numScore)) return '50%' // Default if cannot parse

        // Assuming scores are between 0-10 or 0-100
        if (numScore <= 10) {
            return `${numScore * 10}%`
        } else {
            return `${numScore}%`
        }
    }
}

const formatCategory = (category: string) => {
    // Map skill categories to RPG-style names
    const categoryMap: Record<string, string> = {
        'programming': 'Artes Arcanas',
        'languages': 'Linguagens Místicas',
        'frameworks': 'Construtos Mágicos',
        'databases': 'Repositórios de Conhecimento',
        'tools': 'Ferramentas & Artefatos',
        'design': 'Artes Visuais',
        'other': 'Outras Habilidades',
        'soft': 'Habilidades Sociais',
        'hard': 'Habilidades Técnicas'
    }

    return categoryMap[category.toLowerCase()] || category.charAt(0).toUpperCase() + category.slice(1)
}

const getSkillIcon = (category: string) => {
    // Map categories to appropriate RPG icons
    const iconMap: Record<string, string> = {
        'programming': 'wand',
        'languages': 'book',
        'frameworks': 'staff',
        'databases': 'chest',
        'tools': 'tools',
        'design': 'palette',
        'other': 'clover',
        'soft': 'chat',
        'hard': 'shield'
    }

    return iconMap[category.toLowerCase()] || 'star'
}

const getNetworkIcon = (network: string) => {
    // Map network names to icons
    const networkMap: Record<string, string> = {
        'LinkedIn': 'scroll',
        'GitHub': 'code',
        'Twitter': 'bird',
        'Facebook': 'shield',
        'Instagram': 'eye',
        'Website': 'globe',
        'Portfolio': 'castle'
    }

    return networkMap[network] || 'link'
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

<style>
@import url('https://fonts.googleapis.com/css2?family=MedievalSharp&family=Metamorphous&family=Pirata+One&display=swap');

/* RPG Icons - Usando Font Awesome para ilustração, mas idealmente seria um conjunto de ícones RPG */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

/* CSS Reset e estilos base */
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

/* Estilos gerais do tema RPG */
.rpg-parchment {
    background-color: #f8f0d8;
    background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23964B00' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
    font-family: 'Metamorphous', serif;
    color: #5d4037;
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px;
    border: 20px solid transparent;
    border-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='75' height='75'%3E%3Cg fill='none' stroke='%23964B00' stroke-width='2'%3E%3Cpath d='M1 1h73v73H1z'/%3E%3Cpath d='M8 8h59v59H8z'/%3E%3Cpath d='M8 8L1 1m7 66L1 74m59-66l7-7m0 73l-7-7'/%3E%3C/g%3E%3C/svg%3E") 25;
    position: relative;
    overflow: hidden;
}

/* Cabeçalho: Ficha de Personagem */
.character-sheet {
    position: relative;
    background-color: rgba(243, 229, 200, 0.8);
    border: 3px solid #8d6e63;
    border-radius: 15px;
    padding: 30px;
    margin-bottom: 40px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.parchment-header {
    text-align: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #8d6e63;
    margin-bottom: 30px;
}

.character-name {
    font-family: 'Pirata One', cursive;
    font-size: 3rem;
    color: #5d4037;
    margin: 0;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
    letter-spacing: 2px;
}

.character-class {
    font-family: 'MedievalSharp', cursive;
    font-size: 1.8rem;
    color: #8d6e63;
    margin-top: 5px;
    font-style: italic;
}

.character-main-info {
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
    justify-content: center;
    align-items: flex-start;
    margin-bottom: 30px;
}

.character-portrait {
    width: 180px;
    height: 180px;
    background-color: #d7ccc8;
    border: 5px solid #8d6e63;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
    position: relative;
}

.character-portrait img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.avatar-placeholder {
    width: 100%;
    height: 100%;
    background-color: #8d6e63;
    color: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    font-weight: bold;
    font-family: 'Pirata One', cursive;
}

.character-stats {
    flex: 1;
    min-width: 300px;
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.stat-box {
    background-color: rgba(255, 255, 255, 0.5);
    border: 2px solid #8d6e63;
    border-radius: 8px;
    padding: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.stat-icon {
    font-size: 1.8rem;
    margin-bottom: 5px;
}

.stat-label {
    font-family: 'MedievalSharp', cursive;
    font-size: 0.9rem;
    font-weight: bold;
    color: #6d4c41;
    margin-bottom: 10px;
    letter-spacing: 1px;
}

.stat-description {
    font-size: 1rem;
    text-align: center;
    line-height: 1.5;
}

/* Atributos do Personagem */
.character-attributes {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
    margin-bottom: 30px;
}

.attribute {
    display: flex;
    align-items: center;
    gap: 8px;
    background-color: rgba(255, 255, 255, 0.5);
    border: 1px solid #8d6e63;
    border-radius: 20px;
    padding: 5px 15px;
}

.attribute-label {
    font-weight: bold;
    font-size: 0.9rem;
    color: #6d4c41;
}

.attribute-value {
    font-size: 0.9rem;
}

/* Alianças e Guildas */
.guilds-alliances {
    margin-top: 30px;
}

.guild-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    justify-content: center;
}

.guild-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    background-color: #8D6E63;
    color: #FFF8E1;
    border: none;
    border-radius: 20px;
    padding: 8px 15px;
    text-decoration: none;
    transition: all 0.3s ease;
}

.guild-badge:hover {
    background-color: #6D4C41;
    transform: translateY(-2px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
}

.guild-name {
    font-weight: bold;
    font-size: 0.9rem;
}

.guild-rank {
    font-size: 0.8rem;
    opacity: 0.8;
}

/* Divisor de seções */
.section-divider {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    margin: 40px 0;
}

.divider-line {
    flex: 1;
    height: 2px;
    background-color: #8d6e63;
}

.divider-emblem {
    width: 40px;
    height: 40px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%238d6e63' d='M50 0L63 25H37L50 0zM25 37V63L0 50L25 37zM37 75H63L50 100L37 75zM75 63V37L100 50L75 63z'/%3E%3Ccircle fill='%238d6e63' cx='50' cy='50' r='15'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: center;
}

/* Títulos de seção */
.section-title {
    font-family: 'Pirata One', cursive;
    text-align: center;
    color: #5d4037;
    margin-bottom: 25px;
    position: relative;
}

.main-section {
    font-size: 2.5rem;
    padding-bottom: 10px;
    margin-bottom: 30px;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
    position: relative;
}

.main-section::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 150px;
    height: 3px;
    background-color: #8d6e63;
    border-radius: 3px;
}

/* Registro de Missões (Experiência) */
.quest-log {
    margin-bottom: 50px;
}

.quest-card {
    background-color: rgba(243, 229, 200, 0.7);
    border: 2px solid #8d6e63;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 25px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    position: relative;
    overflow: hidden;
}

.quest-header {
    display: flex;
    gap: 15px;
    margin-bottom: 15px;
    align-items: flex-start;
}

.quest-icon {
    font-size: 1.8rem;
    color: #5d4037;
    background-color: #d7ccc8;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #8d6e63;
    flex-shrink: 0;
}

.quest-title-section {
    flex: 1;
}

.quest-title {
    font-family: 'MedievalSharp', cursive;
    font-size: 1.4rem;
    color: #5d4037;
    margin: 0 0 5px 0;
}

.quest-location {
    font-size: 1.1rem;
    color: #6d4c41;
    margin: 0 0 5px 0;
}

.quest-map-link {
    font-size: 0.9rem;
    color: #795548;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 5px;
}

.quest-map-link:hover {
    text-decoration: underline;
}

.quest-period {
    font-size: 0.9rem;
}

.timespan-badge {
    background-color: #8d6e63;
    color: #fff8e1;
    padding: 5px 12px;
    border-radius: 15px;
    font-size: 0.85rem;
    white-space: nowrap;
}

.timespan-badge.small {
    font-size: 0.8rem;
    padding: 3px 10px;
}

.quest-accomplishments {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px dashed #a1887f;
}

.quest-accomplishments ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
}

.quest-accomplishments li {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 10px;
    line-height: 1.4;
}

.quest-accomplishments li i {
    color: #5d4037;
    margin-top: 3px;
    flex-shrink: 0;
}

/* Academias Mágicas (Educação) */
.magic-academies {
    margin-bottom: 50px;
}

.school-card {
    background-color: rgba(243, 229, 200, 0.7);
    border: 2px solid #8d6e63;
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 25px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.school-banner {
    background-color: #8d6e63;
    color: #fff8e1;
    padding: 20px;
    display: flex;
    gap: 15px;
    align-items: center;
}

.school-emblem {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #fff8e1;
    color: #8d6e63;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    flex-shrink: 0;
}

.school-info {
    flex: 1;
}

.school-name {
    font-family: 'MedievalSharp', cursive;
    font-size: 1.4rem;
    margin: 0 0 5px 0;
}

.school-focus {
    font-size: 1rem;
    opacity: 0.9;
}

.school-mastery {
    display: flex;
    gap: 10px;
    align-items: center;
    margin-top: 10px;
}

.mastery-label {
    font-size: 0.85rem;
}

.mastery-bar {
    flex: 1;
    height: 8px;
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
    overflow: hidden;
}

.mastery-fill {
    height: 100%;
    background-color: #fff8e1;
    border-radius: 4px;
    transition: width 0.3s ease;
}

.mastery-value {
    font-size: 0.85rem;
    opacity: 0.8;
}

.school-courses {
    padding: 20px;
}

.courses-title {
    font-family: 'MedievalSharp', cursive;
    font-size: 1.1rem;
    color: #5d4037;
    margin: 0 0 10px 0;
}

.course-list {
    list-style-type: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.course-list li {
    display: flex;
    align-items: center;
    gap: 5px;
    background-color: rgba(141, 110, 99, 0.15);
    padding: 5px 12px;
    border-radius: 15px;
    font-size: 0.9rem;
}

/* Pergaminhos & Runas (Certificações) */
.certification-scrolls {
    margin-bottom: 50px;
}

.scrolls-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
}

.scroll-item {
    flex: 1;
    min-width: 250px;
    max-width: 350px;
    background-color: #f5e9d0;
    border: 2px solid #8d6e63;
    border-radius: 10px;
    padding: 20px;
    position: relative;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
}

.scroll-seal {
    width: 50px;
    height: 50px;
    background-color: #5d4037;
    border-radius: 50%;
    margin-bottom: 15px;
    position: relative;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
}

.scroll-seal::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 30px;
    height: 30px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%23f5e9d0' d='M50 20L55 35H45L50 20zM35 45V55L20 50L35 45zM45 65H55L50 80L45 65zM65 55V45L80 50L65 55z'/%3E%3Ccircle fill='%23f5e9d0' cx='50' cy='50' r='10'/%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
}

.scroll-content {
    text-align: center;
    width: 100%;
}

.scroll-title {
    font-family: 'MedievalSharp', cursive;
    font-size: 1.2rem;
    margin: 0 0 15px 0;
    color: #5d4037;
}

.scroll-issuer,
.scroll-date {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    margin-bottom: 10px;
    font-size: 0.9rem;
}

.scroll-verify {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    color: #5d4037;
    text-decoration: none;
    font-size: 0.85rem;
    margin-top: 10px;
}

.scroll-verify:hover {
    text-decoration: underline;
}

/* Árvore de Habilidades (Habilidades) */
.skill-tree {
    margin-bottom: 50px;
}

.skill-branches {
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
}

.skill-branch {
    flex: 1;
    min-width: 300px;
    margin-bottom: 30px;
}

.branch-header {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 15px;
}

.branch-icon {
    width: 45px;
    height: 45px;
    background-color: #8d6e63;
    color: #fff8e1;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
}

.branch-title {
    font-family: 'MedievalSharp', cursive;
    font-size: 1.3rem;
    color: #5d4037;
    margin: 0;
}

.skills-container {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
}

.skill-card {
    flex: 1;
    min-width: 120px;
    background-color: rgba(243, 229, 200, 0.7);
    border: 1px solid #8d6e63;
    border-radius: 8px;
    padding: 12px;
    text-align: center;
}

.skill-name {
    font-weight: bold;
    font-size: 1rem;
    margin-bottom: 8px;
    color: #5d4037;
}

.skill-keywords {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    justify-content: center;
}

.keyword-pill {
    background-color: rgba(141, 110, 99, 0.2);
    border-radius: 12px;
    padding: 3px 10px;
    font-size: 0.8rem;
    color: #5d4037;
}

/* Atos de Heroísmo (Trabalho Voluntário) */
.heroic-deeds {
    margin-bottom: 50px;
}

.deeds-container {
    display: flex;
    flex-wrap: wrap;
    gap: 25px;
}

.deed-scroll {
    flex: 1;
    min-width: 300px;
    background-color: rgba(243, 229, 200, 0.7);
    border: 2px solid #8d6e63;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    display: flex;
    gap: 15px;
}

.deed-icon {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    background-color: #8d6e63;
    color: #fff8e1;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
}

.deed-content {
    flex: 1;
}

.deed-header {
    margin-bottom: 15px;
}

.deed-title {
    font-family: 'MedievalSharp', cursive;
    font-size: 1.2rem;
    color: #5d4037;
    margin: 0 0 5px 0;
}

.deed-org {
    font-size: 1rem;
    color: #6d4c41;
    margin-bottom: 5px;
}

.deed-period {
    font-size: 0.9rem;
}

.deed-highlights {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px dashed #a1887f;
}

.deed-highlights ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
}

.deed-highlights li {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 10px;
    line-height: 1.4;
    font-size: 0.95rem;
}

.deed-highlights li i {
    color: #8d6e63;
    margin-top: 3px;
    flex-shrink: 0;
}

/* Medalhas & Honrarias (Prêmios) */
.medals-honors {
    margin-bottom: 50px;
}

.medals-display {
    display: flex;
    flex-wrap: wrap;
    gap: 25px;
    justify-content: center;
}

.medal-item {
    flex: 1;
    min-width: 200px;
    max-width: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.medal-icon {
    width: 80px;
    height: 80px;
    background-color: #d4b38d;
    border: 5px solid #8d6e63;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    color: #5d4037;
    margin-bottom: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    position: relative;
    z-index: 2;
}

.medal-ribbon {
    width: 40px;
    height: 80px;
    background-color: #8d6e63;
    margin-top: -30px;
    margin-bottom: 15px;
    position: relative;
    z-index: 1;
}

.medal-info {
    background-color: rgba(243, 229, 200, 0.7);
    border: 2px solid #8d6e63;
    border-radius: 10px;
    padding: 25px 15px 15px;
    margin-top: -30px;
    width: 100%;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.medal-title {
    font-family: 'MedievalSharp', cursive;
    font-size: 1.1rem;
    color: #5d4037;
    margin: 0 0 10px 0;
}

.medal-awarder {
    font-size: 0.9rem;
    margin-bottom: 5px;
}

.medal-date {
    font-size: 0.85rem;
    color: #6d4c41;
}

/* Tomos Publicados (Publicações) */
.published-tomes {
    margin-bottom: 50px;
    page-break-inside: avoid;
}

.tomes-shelves {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: flex-start;
    page-break-inside: avoid;
}

.tome-book {
    flex: 1 1 300px;
    min-height: 200px;
    max-width: 100%;
    display: flex;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
    position: relative;
    page-break-inside: avoid;
    break-inside: avoid;
    margin-bottom: 20px;
    background-color: #fff;
    border-radius: 5px;
    overflow: hidden;
}

.tome-spine {
    width: 35px;
    background-color: #5d4037;
    display: flex;
    align-items: center;
    justify-content: center;
    writing-mode: vertical-rl;
    text-orientation: mixed;
    padding: 10px 0;
    color: #f5f5f5;
    font-family: 'MedievalSharp', cursive;
    font-size: 1.5rem;
    font-weight: bold;
}

.tome-cover {
    flex: 1;
    background-color: #8d6e63;
    color: #fff8e1;
    padding: 20px;
    display: flex;
    flex-direction: column;
    page-break-inside: avoid;
}

.tome-title {
    font-family: 'MedievalSharp', cursive;
    font-size: 1.2rem;
    margin: 0 0 15px 0;
    line-height: 1.3;
    break-after: avoid;
}

.tome-publisher,
.tome-date {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    font-size: 0.9rem;
    opacity: 0.9;
    break-inside: avoid;
}

.tome-link {
    margin-top: auto;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background-color: rgba(255, 248, 225, 0.2);
    padding: 8px 15px;
    border-radius: 5px;
    text-decoration: none;
    color: #fff8e1;
    font-size: 0.9rem;
    transition: background-color 0.3s ease;
    align-self: flex-start;
    break-inside: avoid;
    page-break-inside: avoid;
    max-width: 100%;
}

.tome-link:hover {
    background-color: rgba(255, 248, 225, 0.3);
}

@media print {
    .tome-book {
        flex: 1 1 45%;
        page-break-inside: avoid;
        break-inside: avoid;
    }

    .tome-cover {
        padding: 15px;
    }

    .tome-link {
        word-break: break-word;
        display: block;
    }

    .tome-link::after {
    content: " (" attr(href) ")"; /* Exibe a URL entre parênteses */
    display: block; /* Força a URL a ficar em uma nova linha */
    font-size: 10px; /* Reduz um pouco o tamanho da fonte para caber melhor */
    margin-top: 5px; /* Adiciona um pequeno espaço entre o texto e a URL */
    width: 100%; /* Faz com que a URL ocupe toda a largura disponível */
  }
}

/* Passatempos & Hobbies (Interesses) */
.interests-tavern {
    margin-bottom: 50px;
}

.interests-container {
    display: flex;
    flex-wrap: wrap;
    gap: 25px;
    justify-content: center;
}

.interest-tankard {
    flex: 1;
    min-width: 200px;
    max-width: 300px;
    background-color: rgba(243, 229, 200, 0.7);
    border: 2px solid #8d6e63;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.tankard-top {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
    font-size: 1.5rem;
    color: #5d4037;
}

.interest-name {
    font-family: 'MedievalSharp', cursive;
    font-size: 1.2rem;
    margin: 0;
}

.interest-keywords {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.keyword-tag {
    background-color: rgba(141, 110, 99, 0.2);
    border: 1px dashed #8d6e63;
    border-radius: 15px;
    padding: 5px 12px;
    font-size: 0.85rem;
    color: #5d4037;
}

/* Aliados & Testemunhos (Referências) */
.allies-testimonials {
    margin-bottom: 50px;
}

.allies-container {
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
}

.ally-card {
    flex: 1;
    min-width: 300px;
    background-color: rgba(243, 229, 200, 0.7);
    border: 2px solid #8d6e63;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    display: flex;
    gap: 20px;
}

.ally-portrait {
    flex-shrink: 0;
}

.ally-avatar {
    width: 60px;
    height: 60px;
    background-color: #8d6e63;
    color: #fff8e1;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    font-family: 'Pirata One', cursive;
}

.ally-testimony {
    flex: 1;
}

.ally-name {
    font-family: 'MedievalSharp', cursive;
    font-size: 1.2rem;
    color: #5d4037;
    margin: 0 0 10px 0;
}

.testimony-scroll {
    position: relative;
    font-style: italic;
    line-height: 1.5;
    padding: 10px 15px;
}

.testimony-scroll i {
    color: #a1887f;
    font-size: 1.2rem;
}

.icon-quote-left {
    position: absolute;
    top: 0;
    left: 0;
}

.icon-quote-right {
    position: absolute;
    bottom: 0;
    right: 0;
}

.testimony-text {
    margin: 0;
    padding: 0 15px;
    font-size: 0.95rem;
}

/* Rodapé com decoração heráldica */
.footer-heraldry {
    display: flex;
    justify-content: center;
    padding: 40px 0 20px;
}

.heraldry-emblem {
    width: 100px;
    height: 100px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 120'%3E%3Cpath fill='%238d6e63' d='M50 0L70 20H30L50 0zM20 30H80L50 100L20 30z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: center;
    opacity: 0.5;
}

/* Classes para os ícones (substitua pelos ícones RPG corretos) */
/* Por enquanto vamos usar Font Awesome como exemplo */
.icon-wand:before {
    content: "\f72b";
    font-family: 'Font Awesome 6 Free';
    font-weight: 900;
}

.icon-book:before {
    content: "\f02d";
    font-family: 'Font Awesome 6 Free';
    font-weight: 900;
}

.icon-staff:before {
    content: "\f6b2";
    font-family: 'Font Awesome 6 Free';
    font-weight: 900;
}

.icon-chest:before {
    content: "\f49e";
    font-family: 'Font Awesome 6 Free';
    font-weight: 900;
}

.icon-tools:before {
    content: "\f7d9";
    font-family: 'Font Awesome 6 Free';
    font-weight: 900;
}

.icon-palette:before {
    content: "\f53f";
    font-family: 'Font Awesome 6 Free';
    font-weight: 900;
}

.icon-clover:before {
    content: "\f73f";
    font-family: 'Font Awesome 6 Free';
    font-weight: 900;
}

.icon-chat:before {
    content: "\f4ad";
    font-family: 'Font Awesome 6 Free';
    font-weight: 900;
}

.icon-shield:before {
    content: "\f3ed";
    font-family: 'Font Awesome 6 Free';
    font-weight: 900;
}

.icon-star:before {
    content: "\f005";
    font-family: 'Font Awesome 6 Free';
    font-weight: 900;
}

.icon-scroll:before {
    content: "\f70e";
    font-family: 'Font Awesome 6 Free';
    font-weight: 900;
}

.icon-code:before {
    content: "\f121";
    font-family: 'Font Awesome 6 Free';
    font-weight: 900;
}

.icon-bird:before {
    content: "\f099";
    font-family: 'Font Awesome 6 Brands';
}

.icon-globe:before {
    content: "\f0ac";
    font-family: 'Font Awesome 6 Free';
    font-weight: 900;
}

.icon-castle:before {
    content: "\f6dc";
    font-family: 'Font Awesome 6 Free';
    font-weight: 900;
}

.icon-link:before {
    content: "\f0c1";
    font-family: 'Font Awesome 6 Free';
    font-weight: 900;
}

.icon-eye:before {
    content: "\f06e";
    font-family: 'Font Awesome 6 Free';
    font-weight: 900;
}

.icon-quest:before {
    content: "\f11e";
    font-family: 'Font Awesome 6 Free';
    font-weight: 900;
}

.icon-map:before {
    content: "\f279";
    font-family: 'Font Awesome 6 Free';
    font-weight: 900;
}

.icon-checkmark:before {
    content: "\f00c";
    font-family: 'Font Awesome 6 Free';
    font-weight: 900;
}

.icon-quill:before {
    content: "\f6cf";
    font-family: 'Font Awesome 6 Free';
    font-weight: 900;
}

.icon-hourglass:before {
    content: "\f254";
    font-family: 'Font Awesome 6 Free';
    font-weight: 900;
}

.icon-medal:before {
    content: "\f5a2";
    font-family: 'Font Awesome 6 Free';
    font-weight: 900;
}

.icon-printing-press:before {
    content: "\f5c9";
    font-family: 'Font Awesome 6 Free';
    font-weight: 900;
}

.icon-calendar:before {
    content: "\f133";
    font-family: 'Font Awesome 6 Free';
    font-weight: 900;
}

.icon-book-open:before {
    content: "\f518";
    font-family: 'Font Awesome 6 Free';
    font-weight: 900;
}

.icon-mug:before {
    content: "\f6cf";
    font-family: 'Font Awesome 6 Free';
    font-weight: 900;
}

.icon-heart:before {
    content: "\f004";
    font-family: 'Font Awesome 6 Free';
    font-weight: 900;
}

.icon-quote-left:before {
    content: "\f10d";
    font-family: 'Font Awesome 6 Free';
    font-weight: 900;
}

.icon-quote-right:before {
    content: "\f10e";
    font-family: 'Font Awesome 6 Free';
    font-weight: 900;
}

/* Responsividade */
@media screen and (max-width: 768px) {
    .rpg-parchment {
        padding: 20px;
        border-width: 10px;
    }

    .character-main-info {
        flex-direction: column;
        align-items: center;
    }

    .quest-header,
    .ally-card {
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .quest-period,
    .school-period,
    .deed-period {
        margin-top: 10px;
    }

    .school-banner {
        flex-direction: column;
        text-align: center;
    }

    .deed-scroll {
        flex-direction: column;
        align-items: center;
        text-align: center;
    }
}
</style>