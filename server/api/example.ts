// server/api/example.ts
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export default defineEventHandler(async (event) => {
  try {
    // Use environment-specific path resolution
    const filePath = process.env.VERCEL 
      ? "/var/task/public/example.cvt" 
      : join(process.cwd(), "public", "example.cvt");

    const fileContent = await readFile(filePath, "utf8");

    try {
      const jsonData = JSON.parse(fileContent);
      return jsonData;
    } catch (jsonError) {
      // If not JSON, return as text
      setHeader(event, "Content-Type", "text/plain");
      return fileContent;
    }
  } catch (error) {
    console.error("Erro ao ler o arquivo:", error);
    setResponseStatus(event, 500);
    return { error: "Erro ao carregar o currículo de exemplo" };
  }
});
