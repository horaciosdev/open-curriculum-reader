<template>
  <div class="education-editor w-full">
    <div class="space-y-6">
      <div v-for="(education, index) in localEducation" :key="index"
        class="mb-4 bg-gray-50 p-4 rounded-lg border border-gray-200 relative">
        <button type="button" @click="removeEducation(index)"
          class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
          <XMarkIcon class="w-3 h-3" />
        </button>

        <div class="grid grid-cols-2 gap-3 mb-3">
          <div class="col-span-2">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="institution">
              Instituição
            </label>
            <input v-model="education.institution" type="text" placeholder="Nome da instituição*" required
              class="w-full px-3 py-2 border rounded border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
          </div>

          <div>
            <label class="block text-gray-700 text-sm font-bold mb-2" for="studyType">
              Tipo de Estudo
            </label>
            <select v-model="education.studyType"
              class="w-full px-3 py-2 border rounded border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
              <option value="EnsinoFundamentalIncompleto">Ensino Fundamental Incompleto</option>
              <option value="EnsinoFundamentalCompleto">Ensino Fundamental Completo</option>
              <option value="EnsinoMedioIncompleto">Ensino Médio Incompleto</option>
              <option value="EnsinoMedioCompleto">Ensino Médio Completo</option>
              <option value="Tecnologo">Tecnólogo</option>
              <option value="BachareladoIncompleto">Bacharelado Incompleto</option>
              <option value="BachareladoCompleto">Bacharelado Completo</option>
              <option value="LicenciaturaIncompleta">Licenciatura Incompleta</option>
              <option value="LicenciaturaCompleta">Licenciatura Completa</option>
              <option value="PosGraduacaoIncompleta">Pós-Graduação Incompleta</option>
              <option value="PosGraduacaoCompleta">Pós-Graduação Completa</option>
              <option value="Especializacao">Especialização</option>
              <option value="MestradoIncompleto">Mestrado Incompleto</option>
              <option value="MestradoCompleto">Mestrado Completo</option>
              <option value="DoutoradoIncompleto">Doutorado Incompleto</option>
              <option value="DoutoradoCompleto">Doutorado Completo</option>
              <option value="Certificado">Certificado</option>
              <option value="Diploma">Diploma</option>
              <option value="Autodidata">Autodidata</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          <div>
            <label class="block text-gray-700 text-sm font-bold mb-2" for="area">
              Área de Estudo
            </label>
            <input v-model="education.area" type="text" placeholder="Área de estudo*" required
              class="w-full px-3 py-2 border rounded border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
          </div>

          <div>
            <label class="block text-gray-700 text-sm font-bold mb-2" for="startDate">
              Data de Início
            </label>
            <input v-model="education.startDate" type="date" required
              class="w-full px-3 py-2 border rounded border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
          </div>

          <div>
            <label class="block text-gray-700 text-sm font-bold mb-2" for="endDate">
              Data de Término
            </label>
            <input v-model="education.endDate" type="date" placeholder="Deixe em branco se ainda estiver cursando"
              class="w-full px-3 py-2 border rounded border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
          </div>

          <div class="col-span-2">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="courses">
              Cursos
            </label>
            <div v-if="education && education.courses" v-for="(course, courseIndex) in education.courses"
              :key="courseIndex" class="flex items-center gap-2 mb-2">
              <input v-model="education.courses[courseIndex]" type="text" placeholder="Nome do curso"
                class="flex-grow px-3 py-2 border rounded border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
              <button type="button" @click="removeCourse(index, courseIndex)"
                class="bg-red-500 text-white text-xs px-2 py-1 rounded">
                <XMarkIcon class="w-3 h-3" />
              </button>
            </div>
            <button type="button" @click="addCourse(index)"
              class="w-full bg-blue-500 text-white px-4 py-2 rounded mt-2">
              Adicionar Curso
            </button>
          </div>
        </div>
      </div>

      <button type="button" @click="addEducation" class="w-full bg-blue-500 text-white px-4 py-2 rounded mt-2">
        Adicionar Educação
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { ref, watch } from 'vue'
import { Curriculum } from 'open-cvt'

// Define props com o tipo Curriculum['education']
const props = defineProps({
  modelValue: {
    type: Array as () => Curriculum['education'],
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

// Cria uma cópia local do modelValue com o tipo correto
const localEducation = ref<Curriculum['education']>(
  props.modelValue.map(education => ({
    institution: education.institution || '',
    studyType: education.studyType || '',
    area: education.area || '',
    startDate: education.startDate || '',
    endDate: education.endDate || null,
    courses: education.courses || []
  }))
)

// Observa mudanças e emite atualizações
watch(localEducation, (newValue) => {
  emit('update:modelValue', newValue)
}, { deep: true })

// Função para adicionar uma nova entrada de educação
function addEducation() {
  localEducation.value.push({
    institution: '',
    studyType: '',
    area: '',
    startDate: '',
    endDate: null,
    courses: []
  })
}

// Função para remover uma entrada de educação
function removeEducation(index: number) {
  localEducation.value.splice(index, 1)
}

// Função para adicionar um curso
function addCourse(educationIndex: number) {
  localEducation.value[educationIndex].courses?.push('')
}

// Função para remover um curso
function removeCourse(educationIndex: number, courseIndex: number) {
  localEducation.value[educationIndex].courses?.splice(courseIndex, 1)
}
</script>