import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

import Home from "../pages/home/Home";
import HomeProfessor from "../pages/professor/HomeProfessor";
import Login from "../pages/login/Login";
import RegisterStudent from "../pages/registerStudent/RegisterStudent";
import CallList from "../pages/CallList/CallList";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import FormSent from "../pages/formSent/FormSent";
import NotFound from "../pages/notFound/NotFound";
import ResumoEstatistico from "../pages/resumoEstatistico/ResumoEstatistico";
import CadastrarUsuario from "../pages/cadastrarUsuario/CadastrarUsuario";
import Gerenciamento from "../pages/gerenciamento/Gerenciamento";
import ListarUsuario from "../pages/Usuarios/ListarUsuario";
import EditarUsuario from "../pages/Usuarios/EditarUsuario";
import ResumoAlunos from "../pages/gerenciamentoAlunos/ResumoAlunos";
import EditarAluno from "../pages/gerenciamentoAlunos/EditarAluno";
import ResumoPresencas from "../pages/resumoPresencas/ResumoPresencas";


const PrivateRoute = ({ element }: { element: JSX.Element }) => {
  const [user, loading] = useAuthState(auth);
  if (loading) return <p>Carregando...</p>;
  return user ? element : <Navigate to="/login" />;
};

// 🔁 Redirecionamento com base no perfil
const RedirectByPerfil: React.FC = () => {
  const [user, loading] = useAuthState(auth);
  const [perfil, setPerfil] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const carregarPerfil = async () => {
      if (user) {
        const snap = await getDoc(doc(db, "usuarios", user.uid));
        const dados = snap.data();
        if (dados?.perfil === "admin") setPerfil("admin");
        else if (dados?.perfil === "professor") setPerfil("professor");
        else setPerfil("funcionario");
      }
    };
    carregarPerfil();
  }, [user]);

  if (loading || !perfil) return <p>Carregando...</p>;

  if (perfil === "admin") return <Home />;
  if (perfil === "professor") return <HomeProfessor />;
  return <Gerenciamento />;
};

const Router = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* Rotas públicas */}
        <Route path="/login" element={<Login />} />

        {/* Redirecionamento dinâmico baseado no perfil */}
        <Route path="/" element={<PrivateRoute element={<RedirectByPerfil />} />} />

        {/* Rotas privadas fixas */}
        <Route path="/cadastro-aluno" element={<PrivateRoute element={<RegisterStudent />} />} />
        <Route path="/lista-de-presenca" element={<PrivateRoute element={<CallList />} />} />
        <Route path="/form-enviado" element={<PrivateRoute element={<FormSent />} />} />
        <Route path="/resumo-estatistico" element={<PrivateRoute element={<ResumoEstatistico />} />} />
        <Route path="/cadastrar-usuario" element={<PrivateRoute element={<CadastrarUsuario />} />} />
        <Route path="/gerenciamento" element={<PrivateRoute element={<Gerenciamento />} />} />
        <Route path="/usuarios" element={<PrivateRoute element={<ListarUsuario />} />} />
        <Route path="/editar-usuario/:id" element={<PrivateRoute element={<EditarUsuario />} />} />
        <Route path="/admin/gerenciamento-alunos" element={<PrivateRoute element={<ResumoAlunos />} />} />
        <Route path="/admin/editar-aluno/:cursoId/:turmaId/:alunoId" element={<PrivateRoute element={<EditarAluno />} />} />
        <Route path="/admin/resumo-presencas" element={<ResumoPresencas />} />

        {/* Página não encontrada */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default Router;
