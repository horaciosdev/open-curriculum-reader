import fs from 'fs'
import path from 'path'

export default defineEventHandler(async () => {
  const themesDir = path.resolve(process.cwd(), 'components/themes')

  try {
    const files = fs.readdirSync(themesDir)
    const themeFiles = files.filter(file => /[A-Za-z]+Theme\.vue$/.test(file))

    const themes = themeFiles.map(file => {
      const id = file.replace(/Theme\.vue$/i, '').toLowerCase()
      const name = id
        .split(/[-_]/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      return { id, name }
    })

    return themes
  } catch (error) {
    console.error('Erro ao carregar temas:', error)
    return []
  }
})