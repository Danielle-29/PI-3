import { db } from '../firebaseConfig';  
import { collection, addDoc } from 'firebase/firestore';

// Função para cadastrar aluno diretamente do formulário
export const cadastrarAluno = async (
  curso: string, 
  alunoData: { nome: string; documento: string; numero: string; matricula: string }
) => {
  try {
    const cursoCollection = collection(db, "cursos", curso, "alunos");
    await addDoc(cursoCollection, alunoData);
    console.log(`Aluno cadastrado com sucesso no curso ${curso}!`);
  } catch (error) {
    console.error(`Erro ao cadastrar aluno no curso ${curso}: `, error);
    throw error;
  }
};
