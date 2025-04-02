import React, { useEffect, useState } from "react";
import { Button, Stack } from "@mui/material";
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
          setPerfil(dados.perfil); // perfil: admin | professor | funcionario
        }
      } else {
        setPerfil(null);
      }
    });

    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    await logoutUsuario();
    navigate("/login");
  };

  return (
    <header aria-label="Cabeçalho do site">
      <div className="container-header">
        <div className="logo">
          <Link to="/">
            <img
              className="logo-img"
              src={logo}
              alt="Logo Centro de formação Carlos Kopcak"
              title="Centro de Formação Carlos Kopcak"
            />
          </Link>
        </div>

        <div className="links-menu">
          <nav aria-label="Menu principal">
            <Stack direction="row" spacing={2}>
              {isAuthenticated ? (
                <>
                  {perfil === "admin" && (
                    <Link to="/cadastrar-usuario">
                      <Button
                        className="custom-button"
                        sx={{ color: "#1B4BD2", "&:hover": { color: "#824295" } }}
                      >
                        Cadastrar Usuário
                      </Button>
                    </Link>
                  )}

                  <Link to="/resumo-estatistico">
                    <Button
                      className="custom-button"
                      sx={{ color: "#1B4BD2", "&:hover": { color: "#E43858" } }}
                    >
                      Resumo Estatístico
                    </Button>
                  </Link>

                  <Button
                    className="custom-button"
                    onClick={handleLogout}
                    sx={{ color: "#1B4BD2", "&:hover": { color: "#E43858" } }}
                  >
                    Sair
                  </Button>
                </>
              ) : (
                <>
                  {location.pathname !== "/login" && (
                    <Link to="/login">
                      <Button
                        className="custom-button"
                        sx={{ color: "#1B4BD2", "&:hover": { color: "#824295" } }}
                      >
                        Login
                      </Button>
                    </Link>
                  )}
                </>
              )}
            </Stack>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

