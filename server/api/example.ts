// server/api/example.ts
export default defineEventHandler(async (event) => {
  try {
    const fileContent = await useStorage('myFileSystem').getItem('example.cvt');

    if (!fileContent) {
      throw new Error("Arquivo não encontrado na storage");
    }

    return fileContent;

  } catch (error) {
    console.error("Erro ao ler o arquivo:", error);
    setResponseStatus(event, 500);
    return { error: "Erro ao carregar o currículo de exemplo" };
  }
});
