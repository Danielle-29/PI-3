// Arquivo: src/pages/gerenciamentoAlunos/EditarAluno.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  TextField,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Paper,
} from "@mui/material";

const EditarAluno: React.FC = () => {
  const { cursoId, turmaId, alunoId } = useParams<{ cursoId: string; turmaId: string; alunoId: string }>();
  const navigate = useNavigate();
  const [idade, setIdade] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAluno() {
      if (!cursoId || !turmaId || !alunoId) return;
      const alunoRef = doc(db, `cursos/${cursoId}/turmas/${turmaId}/alunos`, alunoId);
      const alunoSnap = await getDoc(alunoRef);

      if (alunoSnap.exists()) {
        const data = alunoSnap.data();
        setNome(data.nomeCompleto || "");
        setEmail(data.email || "");
        setIdade(data.idade || "");
      }
      setLoading(false);
    }

    fetchAluno();
  }, [cursoId, turmaId, alunoId]);

  async function handleSalvar() {
    if (!cursoId || !turmaId || !alunoId) return;
    const alunoRef = doc(db, `cursos/${cursoId}/turmas/${turmaId}/alunos`, alunoId);

    await updateDoc(alunoRef, {
      nomeCompleto: nome,
      email,
      idade,
    });

    navigate("/admin/gerenciamento-alunos");
  }

  function handleCancelar() {
    navigate("/admin/gerenciamento-alunos");
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" p={2}>
      {loading ? (
        <CircularProgress />
      ) : (
        <Paper elevation={3} sx={{ width: 400, p: 3 }}>
          <Typography variant="h5" mb={3} textAlign="center" sx={{ fontWeight: "bold", color: "#1B4BD2" }}>
            Editar Aluno
          </Typography>
          <TextField
            fullWidth
            label="Nome"
            margin="normal"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            fullWidth
            label="Idade"
            margin="normal"
            value={idade}
            onChange={(e) => setIdade(e.target.value)}
          />
          <Box mt={3} display="flex" justifyContent="space-between">
            <Button variant="contained" color="primary" onClick={handleSalvar}>
              Salvar
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleCancelar}>
              Cancelar
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default EditarAluno;
