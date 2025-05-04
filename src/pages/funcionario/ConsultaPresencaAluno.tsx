import React, { useState } from "react";
import {
  Box,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import { db } from "../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import "./PlanejamentoFuncionario.css";

const ConsultaPresencaFuncionario: React.FC = () => {
  const [curso, setCurso] = useState("");
  const [turmas, setTurmas] = useState<string[]>([]);
  const [turmaSelecionada, setTurmaSelecionada] = useState("");
  const [resumoPresencas, setResumoPresencas] = useState<{ data: string; presentes: number; faltas: number }[]>([]);

  const buscarTurmas = async (cursoSelecionado: string) => {
    setCurso(cursoSelecionado);
    setTurmaSelecionada("");
    setResumoPresencas([]);
    const turmasRef = collection(db, "cursos", cursoSelecionado, "turmas");
    const snapshot = await getDocs(turmasRef);
    const listaTurmas = snapshot.docs.map(doc => doc.id);
    setTurmas(listaTurmas);
  };

  const buscarResumo = async () => {
    if (!curso || !turmaSelecionada) return;
    const presencaRef = collection(db, "cursos", curso, "turmas", turmaSelecionada, "presencas");
    const snapshot = await getDocs(presencaRef);

    const resumo: { data: string; presentes: number; faltas: number }[] = snapshot.docs.map((doc) => {
      const alunos = doc.data().alunos || [];
      const presentes = alunos.filter((a: any) => a.presente === true).length;
      const faltas = alunos.length - presentes;
      return {
        data: doc.id,
        presentes,
        faltas
      };
    });

    setResumoPresencas(resumo);
  };

  return (
    <div className="page-container">
      <div className="container-list">
        <Typography variant="h5" align="center" fontWeight="bold" sx={{ color: "#1B4BD2", mb: 3 }}>
          Datas com chamada registrada
        </Typography>

        <Box display="flex" gap={2} mb={3} flexWrap="wrap" justifyContent="center">
          <FormControl sx={{ minWidth: 150 }} size="small">
            <InputLabel>Curso</InputLabel>
            <Select value={curso} onChange={(e) => buscarTurmas(e.target.value)} label="Curso">
              <MenuItem value="ingles">Inglês</MenuItem>
              <MenuItem value="espanhol">Espanhol</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150 }} size="small" disabled={!turmas.length}>
            <InputLabel>Turma</InputLabel>
            <Select value={turmaSelecionada} onChange={(e) => setTurmaSelecionada(e.target.value)} label="Turma">
              {turmas.map((turma) => (
                <MenuItem key={turma} value={turma}>{turma}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button variant="contained" onClick={buscarResumo} disabled={!turmaSelecionada}>
            Buscar
          </Button>
        </Box>

        {resumoPresencas.length > 0 && (
          <TableContainer component={Paper} sx={{ maxWidth: 600, margin: "0 auto" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Data</strong></TableCell>
                  <TableCell><strong>Presentes</strong></TableCell>
                  <TableCell><strong>Faltas</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {resumoPresencas.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.data}</TableCell>
                    <TableCell>{item.presentes}</TableCell>
                    <TableCell>{item.faltas}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    </div>
  );
};

export default ConsultaPresencaFuncionario;
