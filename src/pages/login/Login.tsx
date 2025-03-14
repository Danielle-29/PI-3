import React, { useState, useEffect } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { loginUsuario } from "../../utils/authService";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import logo from "../../assets/Centro de formação com sombra.webp";
import { Alert } from "@mui/material";
import AlertTitle from "@mui/material/AlertTitle";

const Login: React.FC = () => {

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [showAlert, setShowAlert] = useState(true);
  const [nomeUsuario, setNomeUsuario] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (erro) {

      const hideTimeout = setTimeout(() => setShowAlert(false), 5000);
      const removeTimeout = setTimeout(() => setErro(''), 10000);

      return () => {
        clearTimeout(hideTimeout);
        clearTimeout(removeTimeout);
      };
    }
  }, [erro]);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await loginUsuario(email, senha);
      const usuarioDoc = await getDoc(doc(db, "usuarios", user.uid));
      if (usuarioDoc.exists()) {
        setNomeUsuario(usuarioDoc.data().nome);
        alert(`Bem-vindo, ${usuarioDoc.data().nome}!`);
      }
      navigate('/');
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        setErro('Usuário não encontrado!')
      } else if (error.code === 'auth/wrong-password') {
        setErro('Senha incorreta!');
      } else {
        setErro('Erro ao fazer login. Tenta novamente!');
      }
    }
  };

  return (
    <>
      <div className="login">
        <div className="img-login" aria-label="Logo do Centro de Formação">
          <img
            src={logo}
            alt="logo Centro de formação Carlos Kopcak"
            title="Centro de Formação Carlos Kopcak"
          />
        </div>
        <form onSubmit={handleLogin} className="container-form" aria-labelledby="titulo-login">
          <h1 id="titulo-login">Login</h1>

          <div className="container-inputs">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-required="true"
              aria-describedby="erro-email"
            />

            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              placeholder="Digite sua Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              aria-required="true"
              aria-describedby="erro-senha"
            />
          </div>
          <button className="form-login-btn" type="submit" aria-label="Entrar na conta">
            Entrar
          </button>

          {erro && (
            <Alert
              id="erro-alert"
              severity="error"
              role="alert"
              variant="filled"
              style={{
                color: "white",
                position: "fixed",
                top: "100px",
                right: "20px",
                width: "80%",
                maxWidth: "300px",
                fontSize: "0.85rem",
                padding: "10px",
                opacity: showAlert ? 1 : 0,
                transition: "opacity 1s ease-out",
                height: "auto",
              }}
            >
              <AlertTitle>Aviso</AlertTitle>
              {erro}
            </Alert>
          )}
        </form>
        <p>
          Ainda não tem conta?
          <Link to="/criar-conta" aria-label="Criar uma nova conta">
            <strong> Cadastre-se aqui</strong>
          </Link>
        </p>
      </div>
    </>
  );
};

export default Login;
