import * as admin from "firebase-admin";
import { onRequest } from "firebase-functions/v2/https";

// Inicializa o Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// Interface para o formato do resumo
interface ResumoCurso {
  totalAlunos: number;
  curso: string;
}

// Função principal
export const obterResumoEstatisticoV2 = onRequest({ region: "southamerica-east1" }, async (request, response) => {
  response.set("Access-Control-Allow-Origin", "*");

  try {
    // Busca todos os cursos
    const cursosSnapshot = await db.collection("cursos").listDocuments();
    const resumo: Record<string, ResumoCurso> = {};

    for (const cursoDoc of cursosSnapshot) {
      const curso = cursoDoc.id;
      let totalAlunos = 0;

      // Busca todas as turmas desse curso
      const turmasSnapshot = await db.collection(`cursos/${curso}/turmas`).listDocuments();

      for (const turmaDoc of turmasSnapshot) {
        // Busca todos os alunos dessa turma
        const alunosSnapshot = await db.collection(`${turmaDoc.path}/alunos`).get();
        totalAlunos += alunosSnapshot.size;
      }

      // Monta o resumo para esse curso
      resumo[curso] = {
        totalAlunos,
        curso,
      };
    }

    console.log("✅ Resumo gerado com sucesso:", resumo);
    response.status(200).json(resumo);

  } catch (error) {
    console.error("❌ Erro ao obter resumo estatístico:", error);
    response.status(500).send("Erro ao obter resumo estatístico.");
  }
});
