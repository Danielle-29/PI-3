import { db } from '../firebaseConfig';  
import { collection, addDoc } from 'firebase/firestore';

export const cadastrarAluno = async (
  curso: string, 
  turma: string,
  alunoData: any
) => {
  try {
    const turmaCollection = collection(db, "cursos", curso, "turmas", turma, "alunos");
    console.log("📤 Enviando aluno para:", `cursos/${curso}/turmas/${turma}/alunos`);
    console.log("📦 Dados:", alunoData);

    const docRef = await addDoc(turmaCollection, alunoData);
    console.log("✅ Documento criado com ID:", docRef.id); // <-- NOVO LOG IMPORTANTE

    console.log("Aluno cadastrado!");
  } catch (error) {
    console.error("❌ Erro ao cadastrar aluno", error);
    throw error;
  }
};

