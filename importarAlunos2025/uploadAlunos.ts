import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

import turma1Ingles from './turmas/ingles/turma_1.json';
import turma2Ingles from './turmas/ingles/turma_2.json';
import turma3Ingles from './turmas/ingles/turma_3.json';
import turma4Ingles from './turmas/ingles/turma_4.json';
import turma1Espanhol from './turmas/espanhol/turma1.json';

import * as serviceAccount from '../serviceAccountKey.json';

// Inicializa o Firebase Admin SDK
initializeApp({
  credential: cert(serviceAccount as any),
});

const db = getFirestore();

async function importarAlunos(curso: string, turma: string, alunos: any[]) {
  console.log(`\uD83D\uDCE6 Importando alunos do curso ${curso} - ${turma}...`);

  if (!Array.isArray(alunos)) {
    console.error(`❌ Os dados da turma ${turma} não são um array válido.`);
    return;
  }

  for (const aluno of alunos) {
    try {
      await db
        .collection('cursos')
        .doc(curso)
        .collection('turmas')
        .doc(turma)
        .collection('alunos')
        .add(aluno);
    } catch (error) {
      console.error(`❌ Erro ao importar aluno da turma ${turma}:`, error);
    }
  }

  console.log(`✅ Turma ${turma} importada com sucesso.`);
}

async function main() {
  try {
    // Inglês
    await importarAlunos('ingles', 'turma_1', turma1Ingles);
    await importarAlunos('ingles', 'turma_2', turma2Ingles);
    await importarAlunos('ingles', 'turma_3', turma3Ingles);
    await importarAlunos('ingles', 'turma_4', turma4Ingles);

    // Espanhol
    await importarAlunos('espanhol', 'turma1', turma1Espanhol);

    console.log('🎉 Todos os alunos foram importados com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro geral na importação:', error);
    process.exit(1);
  }
}

main();
