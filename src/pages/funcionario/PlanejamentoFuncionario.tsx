import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Paper,
  Divider
} from "@mui/material";
import { db } from "../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import dayjs from "dayjs";
import "../funcionario/PlanejamentoFuncionario.css";

const VisualizarPlanejamento: React.FC = () => {
  const [curso, setCurso] = useState("");
  const [turma, setTurma] = useState("");
  const [turmasDisponiveis, setTurmasDisponiveis] = useState<string[]>([]);
  const [planejamentos, setPlanejamentos] = useState<{ data: string; texto: string }[]>([]);

  useEffect(() => {
    const carregarTurmas = async () => {
      if (!curso) return;
      const snap = await getDocs(collection(db, "cursos", curso, "turmas"));
      const nomes = snap.docs.map((doc) => doc.id);
      setTurmasDisponiveis(nomes);
    };
    carregarTurmas();
  }, [curso]);

  const carregarPlanejamentos = async () => {
    if (!curso || !turma) return;
    const snap = await getDocs(collection(db, "cursos", curso, "turmas", turma, "planejamentos"));
    const lista: { data: string; texto: string }[] = [];
    snap.forEach((doc) => {
      const data = doc.id;
      const { texto } = doc.data();
      lista.push({ data, texto });
    });
    lista.sort((a, b) => a.data.localeCompare(b.data));
    setPlanejamentos(lista);
  };

  return (
    <div className="page-container">
      <div className="container-list">
        <Typography variant="h5" align="center" fontWeight="bold" sx={{ color: "#1B4BD2", mb: 3 }}>
          Planejamento de Aulas (Somente Leitura)
        </Typography>

        <Box display="flex" justifyContent="center" gap={3} mb={4}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Curso</InputLabel>
            <Select value={curso} onChange={(e) => setCurso(e.target.value)} label="Curso">
              <MenuItem value="ingles">Inglês</MenuItem>
              <MenuItem value="espanhol">Espanhol</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Turma</InputLabel>
            <Select value={turma} onChange={(e) => setTurma(e.target.value)} label="Turma">
              {turmasDisponiveis.map((t) => (
                <MenuItem key={t} value={t}>{t}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box textAlign="center" mb={2}>
          <button className="btn-submit" onClick={carregarPlanejamentos}>Buscar Planejamentos</button>
        </Box>

        {planejamentos.map((item, index) => (
          <Paper key={index} sx={{ p: 2, mb: 2 }}>
            <Typography fontWeight="bold" color="primary">
              {dayjs(item.data).format("DD/MM/YYYY")}
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Typography>{item.texto}</Typography>
          </Paper>
        ))}
      </div>
    </div>
  );
};

export default VisualizarPlanejamento;
