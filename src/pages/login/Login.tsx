import React, { useState, useEffect, useRef } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { loginUsuario } from "../../utils/authService";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import logo from "../../assets/logo_kopcak.png";
import { Alert, InputAdornment, TextField } from "@mui/material";
import AlertTitle from "@mui/material/AlertTitle";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";


const EmailIcon = () => (
  <svg style={{ marginRight: "8px" }} xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" fill="#1B4BD2">
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
);

const LockIcon = () => (
  <svg style={{ marginRight: "8px" }} xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" fill="#1B4BD2">
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M12 17a2 2 0 1 0 .001-3.999A2 2 0 0 0 12 17zm6-6V8a6 6 0 0 0-12 0v3H4v10h16V11h-2zm-2 0H8V8a4 4 0 0 1 8 0v3z" />
  </svg>
);

const Login: React.FC = () => {

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [showAlert, setShowAlert] = useState(true);
  const [nomeUsuario, setNomeUsuario] = useState<string | null>(null);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const navigate = useNavigate();
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

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
        const dados = usuarioDoc.data();
        setNomeUsuario(dados.nome);
  
        // Redirecionamento baseado no perfil
        if (dados.perfil === "admin") {
          navigate("/resumo-estatistico");
        } else {
          navigate("/");
        }
  
        // Mostra o alerta de boas vindas
      } else {
        setErro("Usuário sem dados de perfil no banco de dados!");
      }
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        setErro("Usuário não encontrado!");
      } else if (error.code === "auth/wrong-password") {
        setErro("Senha incorreta!");
      } else {
        setErro("Erro ao fazer login. Tente novamente!");
      }
    }
  };
  

  return (
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
            <TextField
              id="email"
              type="email"
              label="E-mail"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              inputRef={emailInputRef}
              required
              fullWidth
              margin="normal"
              InputProps={{
                startAdornment: <InputAdornment position="start"><EmailIcon /></InputAdornment>,
              }}
            />

          <TextField
            id="senha"
            type={mostrarSenha ? "text" : "password"}
            label="Senha"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            fullWidth
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <button
                    type="button"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    style={{
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      color:"#1B4BD2",
                    }}
                    aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {mostrarSenha ? <VisibilityOff /> : <Visibility />}
                  </button>
                </InputAdornment>
              ),
            }}
            
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
                top: "80px",
                right: "20px",
                width: "80%",
                maxWidth: "300px",
                fontSize: "0.85rem",
                padding: "10px",
                opacity: showAlert ? 1 : 0,
                transition: "opacity 1s ease-out",
                height: "auto",
                zIndex: 10,
              }}
              aria-live="assertive"
            >
              <AlertTitle>Aviso</AlertTitle>
              {erro}
            </Alert>
          )}
        </form>
      </div>
  );
};

export default Login;
