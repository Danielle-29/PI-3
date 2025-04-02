import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebaseConfig";
import Home from "../pages/home/Home";
import Login from "../pages/login/Login";
import RegisterStudent from "../pages/registerStudent/RegisterStudent";
import CallList from "../pages/CallList/CallList";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import FormSent from "../pages/formSent/FormSent";
import NotFound from "../pages/notFound/NotFound";
import ResumoEstatistico from "../pages/resumoEstatistico/ResumoEstatistico";
import CadastrarUsuario from "../pages/cadastrarUsuario/CadastrarUsuario";


const PrivateRoute = ({ element }: { element: JSX.Element }) => {
  const [user, loading] = useAuthState(auth);

  if (loading) return <p>Carregando...</p>; // Pode substituir por um spinner

  return user ? element : <Navigate to="/login" />;
};

const Router = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* Rota pública */}
        <Route path="/login" element={<Login />} />

        {/* Rotas privadas */}
        <Route path="/" element={<PrivateRoute element={<Home />} />} />
        <Route path="/cadastro-aluno" element={<PrivateRoute element={<RegisterStudent />} />} />
        <Route path="/lista-de-presenca" element={<PrivateRoute element={<CallList />} />} />
        <Route path="/form-enviado" element={<PrivateRoute element={<FormSent />} />} />
        <Route path="/resumo-estatistico" element={<PrivateRoute element={<ResumoEstatistico />} />} />
        <Route path="/cadastrar-usuario" element={<PrivateRoute element={<CadastrarUsuario />} />} />

        {/* Rota de erro */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default Router;