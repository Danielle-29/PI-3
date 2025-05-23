import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Paper,
  Divider,
  Container
} from "@mui/material";
import { db } from "../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import dayjs from "dayjs";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import NotesIcon from "@mui/icons-material/Notes";
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
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h5" className="titulo-planejamento">
        Planejamento de Aulas (Somente Leitura)
      </Typography>

      <Box display="flex" justifyContent="center" gap={3} mb={4} flexWrap="wrap" mt={4}>
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

      <Box textAlign="center" mb={3}>
        <button aria-label="Buscar Planejamento" className="botao-buscar-planejamento" onClick={carregarPlanejamentos}>
          Buscar Planejamentos
        </button>
      </Box>

      {planejamentos.map((item, index) => (
        <Paper
          key={index}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            boxShadow: 3,
            backgroundColor: "#fafafa"
          }}
        >
          <Box display="flex" alignItems="center" mb={1} gap={1}>
            <CalendarTodayIcon fontSize="small" color="primary" />
            <Typography fontWeight="bold" color="primary" fontSize="16px">
              {dayjs(item.data).format("DD/MM/YYYY")}
            </Typography>
          </Box>
          <Divider sx={{ mb: 1 }} />
          <Box display="flex" alignItems="flex-start" gap={1}>
            <NotesIcon fontSize="small" sx={{ mt: "2px" }} />
            <Typography sx={{ whiteSpace: 'pre-line' }}>{item.texto}</Typography>
          </Box>
        </Paper>
      ))}
    </Container>
  );
};

export default VisualizarPlanejamento;
