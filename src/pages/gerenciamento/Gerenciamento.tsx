import React from "react";
import { useNavigate } from "react-router-dom";
import "./gerenciamento.css";

import alunosImg from "../../assets/undraw_educator_6dgp.png";
import usuariosImg from "../../assets/undraw_live-collaboration_i8an.png";
import listaImg from "../../assets/undraw_Collaboration_re_vyau.webp";

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActionArea,
} from "@mui/material";

const Gerenciamento: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className="container-gerenciamento">
      <h1>Gerenciamento</h1>
      <p>Escolha uma das opções abaixo para gerenciar o sistema:</p>

      <div className="card-container">
        <div className="card-item" onClick={() => navigate("/admin/gerenciamento-alunos")}> 
          <Card sx={{ maxWidth: 300 }}>
            <CardActionArea>
              <CardMedia
                component="img"
                height="140"
                image={alunosImg}
                alt="Gerenciar Alunos"
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  Gerenciamento de Alunos
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </div>

        <div className="card-item" onClick={() => navigate("/Usuarios")}> 
          <Card sx={{ maxWidth: 300 }}>
            <CardActionArea>
              <CardMedia
                component="img"
                height="140"
                image={usuariosImg}
                alt="Gerenciar Usuários"
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  Gerenciamento de Usuários
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </div>

        <div className="card-item" onClick={() => navigate("/lista-de-presenca")}> 
          <Card sx={{ maxWidth: 300 }}>
            <CardActionArea>
              <CardMedia
                component="img"
                height="140"
                image={listaImg}
                alt="Lista de Presença"
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  Lista de Presença
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default Gerenciamento;
