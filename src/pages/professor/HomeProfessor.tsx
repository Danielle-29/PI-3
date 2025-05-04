import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Paper, Divider, Button, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import 'dayjs/locale/pt-br';

import { db } from "../../firebaseConfig";
import { doc, setDoc, collection, getDoc, getDocs } from "firebase/firestore";
import "./HomeProfessor.css";

const HomeProfessor: React.FC = () => {
  const [dataSelecionada, setDataSelecionada] = useState<Dayjs | null>(dayjs());
  const [planejamento, setPlanejamento] = useState<string>("");
  const [curso, setCurso] = useState<string>("");
  const [turma, setTurma] = useState<string>("");
  const [turmasDisponiveis, setTurmasDisponiveis] = useState<string[]>([]);

  useEffect(() => {
    const carregarTurmas = async () => {
      if (!curso) return;
      const snap = await getDocs(collection(db, "cursos", curso, "turmas"));
      const nomes = snap.docs.map((doc) => doc.id);
      setTurmasDisponiveis(nomes);
    };
    carregarTurmas();
  }, [curso]);

  useEffect(() => {
    const carregarPlanejamento = async () => {
      if (!dataSelecionada || !curso || !turma) return;

      const dataKey = dataSelecionada.format("YYYY-MM-DD");
      const docRef = doc(db, "cursos", curso, "turmas", turma, "planejamentos", dataKey);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const dados = docSnap.data();
        setPlanejamento(dados.texto || "");
      } else {
        setPlanejamento("");
      }
    };

    carregarPlanejamento();
  }, [dataSelecionada, curso, turma]);

  const handleSalvar = async () => {
    if (!dataSelecionada || !curso || !turma) return;
    const dataKey = dataSelecionada.format("YYYY-MM-DD");

    try {
      await setDoc(
        doc(db, "cursos", curso, "turmas", turma, "planejamentos", dataKey),
        { texto: planejamento }
      );
      alert("✅ Planejamento salvo com sucesso no Firebase!");
    } catch (error) {
      console.error("Erro ao salvar no Firebase:", error);
      alert("❌ Erro ao salvar planejamento");
    }
  };

  const handleExcluir = async () => {
    setPlanejamento("");
  };

  return (
    <Box className="home-professor-container" display="flex" flexDirection="column" gap={4} mt={3}>
      <Typography variant="h5" align="center" fontWeight="bold" sx={{ color: "#1B4BD2" }}>
        Planejamento de Aulas
      </Typography>

      <Box display="flex" justifyContent="center" gap={2}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Curso</InputLabel>
          <Select value={curso} onChange={(e) => setCurso(e.target.value)} label="Curso">
            <MenuItem value="ingles">Inglês</MenuItem>
            <MenuItem value="espanhol">Espanhol</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 200 }} disabled={!curso}>
          <InputLabel>Turma</InputLabel>
          <Select value={turma} onChange={(e) => setTurma(e.target.value)} label="Turma">
            {turmasDisponiveis.map((t) => (
              <MenuItem key={t} value={t}>{t}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={4}>
        {/* Calendário */}
        <Paper className="calendario-box" elevation={3} sx={{ p: 2, minWidth: 360 }}>
          <Typography variant="h6" align="center" gutterBottom>
            Calendário de Aulas
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"pt-br"}>
            <StaticDatePicker
              displayStaticWrapperAs="desktop"
              value={dataSelecionada}
              onChange={(newValue) => setDataSelecionada(newValue)}
              renderInput={(params) => <TextField {...params} style={{ display: "none" }} />}
            />
          </LocalizationProvider>
        </Paper>

        {/* Planejamento */}
        <Paper elevation={3} sx={{ p: 2, flex: 1 }}>
          <Typography variant="h6" align="center" gutterBottom>
            Anotações do Dia
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {dataSelecionada?.format("DD/MM/YYYY")}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <TextField
            label="Conteúdo da aula"
            multiline
            minRows={6}
            fullWidth
            value={planejamento}
            onChange={(e) => setPlanejamento(e.target.value)}
            placeholder="Ex: Revisão do presente simples, prática de leitura e vocabulário"
            variant="outlined"
          />
          <Box display="flex" justifyContent="flex-end" gap={8} mt={8}>
            <Button aria-label="Salvar" variant="contained" color="primary" onClick={handleSalvar}>
              Salvar
            </Button>
            <Button aria-label="Excluir" variant="outlined" color="error" onClick={handleExcluir}>
              Excluir
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default HomeProfessor;
