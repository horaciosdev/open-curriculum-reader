export default defineEventHandler(async (event) => {
  try {
    // Para desenvolvimento, usa o filesystem
    if (process.env.NODE_ENV !== 'production') {
      const fileContent = await useStorage('myFileSystem').getItem('example.cvt');
      if (fileContent) return fileContent;
    }

    // Para produção, carrega o arquivo estático usando o caminho absoluto
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';

    const url = `${baseUrl}/public/server/example.cvt`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Arquivo não encontrado: ${response.status}`);
    }

    return await response.text();

  } catch (error) {
    console.error("Erro ao ler o arquivo:", error);
    setResponseStatus(event, 500);
    return { error: `Erro ao carregar o currículo de exemplo: ${(error as Error).message}` };
  }
});