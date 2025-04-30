// Importar os módulos do Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; //Importa o módulo de autenticação
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Suas credenciais do Firebase (copiadas do console)
const firebaseConfig = {
  apiKey: "AIzaSyC7W6j7XaKZMbY6mIsGAZQtHW2XzQJaMpE",
  authDomain: "pi-carlos-kopcak.firebaseapp.com",
  projectId: "pi-carlos-kopcak",
  storageBucket: "pi-carlos-kopcak.appspot.com",
  messagingSenderId: "221680327504",
  appId: "1:221680327504:web:bcee40c7e852cab6bd2a55"
};

// Inicializar o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// Inicializar o Firestore
const db = getFirestore(app);

export { auth, db } ;