import { db } from '../firebaseConfig';  
import { collection, addDoc } from 'firebase/firestore';
import inglesData from '../aulas/ingles.json';
import espanholData from '../aulas/espanhol.json';
import italianoData from '../aulas/italiano.json';

// Função para enviar dados para subcoleções
export const enviarDadosParaSubcolecoes = async () => {
  try {
    const inglesCollection = collection(db, "cursos", "ingles", "alunos");
    for (const aluno of inglesData) {
      await addDoc(inglesCollection, {
        nome: aluno.NOME,
        documento: aluno.DOCUMENTO,
        numero: aluno.NUMERO,
        matricula: aluno.MATRICULA
      });
    }

    const espanholCollection = collection(db, "cursos", "espanhol", "alunos");
    for (const aluno of espanholData) {
      await addDoc(espanholCollection, {
        nome: aluno.NOME,
        documento: aluno.DOCUMENTO,
        numero: aluno.NUMERO,
        matricula: aluno.MATRICULA
      });
    }

    const italianoCollection = collection(db, "cursos", "italiano", "alunos");
    for (const aluno of italianoData) {
      await addDoc(italianoCollection, {
        nome: aluno.NOME,
        documento: aluno.DOCUMENTO,
        numero: aluno.NUMERO,
        matricula: aluno.MATRICULA
      });
    }

    console.log('Dados enviados para as subcoleções com sucesso!');
  } catch (e) {
    console.error("Erro ao enviar dados para as subcoleções: ", e);
  }
};
  // Função para cadastrar aluno diretamente do formulário
export const cadastrarAluno = async (curso: string, alunoData: { nome: string; documento: string; numero: string; matricula: string }) => {
  try {
    const cursoCollection = collection(db, "cursos", curso, "alunos");
    await addDoc(cursoCollection, alunoData);
    console.log(`Aluno cadastrado com sucesso no curso ${curso}!`);
  } catch (error) {
    console.error(`Erro ao cadastrar aluno no curso ${curso}: `, error);
    throw error;
  }
};
