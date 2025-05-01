// Arquivo: src/pages/professor/HomeProfessor.tsx
import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Paper, Divider, Button } from "@mui/material";
import { LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import "./HomeProfessor.css";

interface ConteudosSalvos {
  [data: string]: string;
}

const HomeProfessor: React.FC = () => {
  const [dataSelecionada, setDataSelecionada] = useState<Dayjs | null>(dayjs());
  const [planejamento, setPlanejamento] = useState<string>("");
  const [conteudosSalvos, setConteudosSalvos] = useState<ConteudosSalvos>(() => {
    const salvo = localStorage.getItem("planejamentosAula");
    return salvo ? JSON.parse(salvo) : {};
  });

  useEffect(() => {
    if (dataSelecionada) {
      const dataKey = dataSelecionada.format("YYYY-MM-DD");
      setPlanejamento(conteudosSalvos[dataKey] || "");
    }
  }, [dataSelecionada, conteudosSalvos]);

  const handleSalvar = () => {
    if (!dataSelecionada) return;
    const dataKey = dataSelecionada.format("YYYY-MM-DD");
    const novo = {
      ...conteudosSalvos,
      [dataKey]: planejamento,
    };
    setConteudosSalvos(novo);
    localStorage.setItem("planejamentosAula", JSON.stringify(novo));
  };

  const handleExcluir = () => {
    if (!dataSelecionada) return;
    const dataKey = dataSelecionada.format("YYYY-MM-DD");
    const novo = { ...conteudosSalvos };
    delete novo[dataKey];
    setConteudosSalvos(novo);
    localStorage.setItem("planejamentosAula", JSON.stringify(novo));
    setPlanejamento("");
  };

  return (
    <Box className="home-professor-container" display="flex" flexDirection="column" gap={4} mt={3}>
      <Typography variant="h5" align="center" fontWeight="bold" sx={{ color: "#1B4BD2" }}>
        Planejamento de Aulas
      </Typography>
      <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={4}>
        {/* Calendário */}
        <Paper className="calendario-box" elevation={3} sx={{ p: 2, minWidth: 360 }}>
          <Typography variant="h6" align="center" gutterBottom>
            Calendário de Aulas
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
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
            <Button variant="contained" color="primary" onClick={handleSalvar}>
              Salvar
            </Button>
            <Button variant="outlined" color="error" onClick={handleExcluir}>
              Excluir
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default HomeProfessor;
