import React, { useEffect, useState } from "react";
import { Button, Stack, Typography } from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth } from "../../firebaseConfig";
import { logoutUsuario } from "../../utils/authService";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

import "./header.css";
import logo from "../../assets/logo_kopcak.png";

const Header: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [perfil, setPerfil] = useState<string | null>(null);
  const [nomeUsuario, setNomeUsuario] = useState<string>("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setIsAuthenticated(!!user);

      if (user) {
        const docRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const dados = docSnap.data();
          setPerfil(dados.perfil);
          setNomeUsuario(dados.nome || "");
        }
      } else {
        setPerfil(null);
        setNomeUsuario("");
      }
    });

    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    await logoutUsuario();
    navigate("/login");
  };

  const rotaLogo = () => {
    if (perfil === "admin") return "/resumo-estatistico";
    if (perfil === "professor") return "/";
    if (perfil === "funcionario") return "/";
    return "/";
  };

  return (
    <header aria-label="Cabeçalho do site">
      <a href="#conteudo-principal" className="skip-link">Pular para o conteúdo</a>
      <div className="container-header">
        <div className="logo">
          <img
            className="logo-img"
            src={logo}
            alt="Logo Centro de formação Carlos Kopcak"
            title="Centro de Formação Carlos Kopcak"
            onClick={() => navigate(rotaLogo())}
            style={{ cursor: "pointer" }}
          />
        </div>

        <div className="links-menu">
          <Stack direction="row" spacing={2} alignItems="center">
            {isAuthenticated && nomeUsuario && (
              <Typography variant="body1" sx={{ fontWeight: "bold", color: "#1B4BD2" }}>
                Olá, {nomeUsuario}!
              </Typography>
            )}

            {isAuthenticated ? (
              <>
                {perfil === "admin" && (
                  <>
                    <Link to="/cadastrar-usuario">
                      <Button className="custom-button" sx={{ color: "#1B4BD2", "&:hover": { color: "#824295" } }}>
                        Cadastrar Usuário
                      </Button>
                    </Link>
                    <Link to="/cadastro-aluno">
                      <Button className="custom-button" sx={{ color: "#1B4BD2", "&:hover": { color: "#824295" } }}>
                        Cadastrar Aluno
                      </Button>
                    </Link>
                  </>
                )}

                {perfil === "funcionario" && (
                  <Link to="/cadastro-aluno">
                    <Button className="custom-button" sx={{ color: "#1B4BD2", "&:hover": { color: "#824295" } }}>
                      Cadastrar Aluno
                    </Button>
                  </Link>
                )}

                {perfil === "professor" && (
                  <>
                    <Link to="/painel-frequencia">
                      <Button className="custom-button" sx={{ color: "#1B4BD2", "&:hover": { color: "#824295" } }}>
                        Painel de Frequência
                      </Button>
                    </Link>
                    <Link to="/lista-de-presenca">
                      <Button className="custom-button" sx={{ color: "#1B4BD2", "&:hover": { color: "#824295" } }}>
                        Lista de Presença
                      </Button>
                    </Link>
                  </>
                )}

                {(perfil === "admin" || perfil === "funcionario") && (
                  <Link to="/gerenciamento">
                    <Button className="custom-button" sx={{ color: "#1B4BD2", "&:hover": { color: "#824295" } }}>
                      Gerenciamento
                    </Button>
                  </Link>
                )}

                <Button
                  className="custom-button"
                  onClick={handleLogout}
                  sx={{ color: "#1B4BD2", "&:hover": { color: "#824295" } }}
                >
                  Sair
                </Button>
              </>
            ) : (
              location.pathname !== "/login" && (
                <Link to="/login">
                  <Button className="custom-button" sx={{ color: "#1B4BD2", "&:hover": { color: "#824295" } }}>
                    Login
                  </Button>
                </Link>
              )
            )}
          </Stack>
        </div>
      </div>
    </header>
  );
};

export default Header;
