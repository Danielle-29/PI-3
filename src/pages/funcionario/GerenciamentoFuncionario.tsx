import React from "react";
import { useNavigate } from "react-router-dom";
import "../gerenciamento/gerenciamento.css";

import alunosImg from "../../assets/undraw_educator_6dgp.png";
import listaImg from "../../assets/undraw_Collaboration_re_vyau.webp";

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActionArea,
} from "@mui/material";

const GerenciamentoFuncionario: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className="container-gerenciamento">
      <h1>Gerenciamento</h1>
      <p>Escolha uma das opções abaixo para gerenciar:</p>

      <div className="card-container">
        {/* Card - Gerenciamento de Alunos */}
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

        {/* Card - Consulta de Presença */}
        <div className="card-item" onClick={() => navigate("/funcionario/consulta-presenca")}>
          <Card sx={{ maxWidth: 300 }}>
            <CardActionArea>
              <CardMedia
                component="img"
                height="140"
                image={listaImg}
                alt="Consulta de Presença"
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  Consulta de Presença
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default GerenciamentoFuncionario;
