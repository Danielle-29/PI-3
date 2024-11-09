import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

// Função para registrar um novo usuário
export const registrarUsuario = async (email: string, senha: string, nome: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;

    // Salva o nome do usuário no Firestore
    await setDoc(doc(db, "usuarios", user.uid), {
        nome,
        email,
    });

    return user;
  } catch (error) {
    console.error("Erro ao registrar: ", error);
    throw error;
  }
};

// Função para login
export const loginUsuario = async (email: string, senha: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    return userCredential.user;
  } catch (error) {
    console.error("Erro ao fazer login: ", error);
    throw error;
  }
};

// Função para logout
export const logoutUsuario = async () => {
  try {
    await signOut(auth);
    console.log("Usuário deslogado com sucesso");
  } catch (error) {
    console.error("Erro ao fazer logout: ", error);
    throw error;
  }
};