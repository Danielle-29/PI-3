import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as serviceAccount from "../serviceAccountKey.json";
import turma4 from "./turmas/ingles/turma_4.json";

initializeApp({
  credential: cert(serviceAccount as any),
});

const db = getFirestore();

async function importarAlunos() {
  const curso = "ingles";
  const turma = "turma_4";
  const alunos = turma4 as any [];

  const alunosRef = db
    .collection("cursos")
    .doc(curso)
    .collection("turmas")
    .doc(turma)
    .collection("alunos");

  for (const aluno of alunos) {
    try {
      await alunosRef.add(aluno);
      console.log(`✅ Aluno importado: ${aluno.nomeCompleto}`);
    } catch (erro) {
      console.error(`❌ Erro ao importar ${aluno.nomeCompleto}`, erro);
    }
  }

  console.log("✅ Importação finalizada.");
}

importarAlunos();
