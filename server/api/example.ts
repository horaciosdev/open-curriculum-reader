export default defineEventHandler(async (event) => {
  try {
    // Para desenvolvimento, usa o filesystem
    if (process.env.NODE_ENV !== 'production') {
      const fileContent = await useStorage('myFileSystem').getItem('example.cvt');
      if (fileContent) return fileContent;
    }

    // Para produção, carrega o arquivo estático
    const response = await fetch(new URL('/example.cvt', event.node.req.url));
    if (!response.ok) {
      throw new Error("Arquivo não encontrado");
    }
    return await response.text();

  } catch (error) {
    console.error("Erro ao ler o arquivo:", error);
    setResponseStatus(event, 500);
    return { error: "Erro ao carregar o currículo de exemplo" };
  }
});