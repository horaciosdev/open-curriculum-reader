// server/api/example.js (ou .ts)
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export default defineEventHandler(async (event) => {
  try {
    const filePath = join(process.cwd(), "public", "example.cvt"); // Caminho para o arquivo na pasta 'public'
    const fileContent = await readFile(filePath, "utf8");

    try {
      const jsonData = JSON.parse(fileContent);
      return jsonData;
    } catch (jsonError) {
      // Se não for JSON, retorna como texto
      setHeader(event, "Content-Type", "text/plain");
      return fileContent;
    }
  } catch (error) {
    console.error("Erro ao ler o arquivo:", error);
    setResponseStatus(event, 500);
    return { error: "Erro ao carregar o currículo de exemplo" };
  }
});
