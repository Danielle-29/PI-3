import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import ingles from './ingles.json';
import espanhol from './espanhol.json';
import italiano from './italiano.json';
import * as serviceAccount from '../serviceAccountKey.json'; // Caminho para sua chave do Firebase Admin

initializeApp({
  credential: cert(serviceAccount as any),
});

const db = getFirestore();

async function importarAlunos(curso: string, alunos: any[]) {
  console.log(`Importando alunos de ${curso}...`);

  for (const aluno of alunos) {
    await db.collection("cursos").doc(curso).collection("alunos").add(aluno);
  }

  console.log(`${alunos.length} alunos importados para o curso de ${curso} com sucesso!`);
}

async function main() {
  await importarAlunos("ingles", ingles);
  await importarAlunos("espanhol", espanhol);
  await importarAlunos("italiano", italiano);
  process.exit(0);
}

main().catch((error) => {
  console.error("Erro ao importar alunos:", error);
  process.exit(1);
});
