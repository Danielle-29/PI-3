import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { TextField, Button, Box, Typography, Card, CardContent } from "@mui/material";

const EditarAluno: React.FC = () => {
  const { curso, turma, id } = useParams<{ curso: string; turma: string; id: string }>();
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAluno() {
      if (!curso || !turma || !id) return;
      const alunoRef = doc(db, `cursos/${curso}/turmas/${turma}/alunos`, id);
      const alunoSnap = await getDoc(alunoRef);

      if (alunoSnap.exists()) {
        const data = alunoSnap.data();
        setNome(data.nome || "");
        setEmail(data.email || "");
      }
      setLoading(false);
    }

    fetchAluno();
  }, [curso, turma, id]);

  async function handleSalvar() {
    if (!curso || !turma || !id) return;
    const alunoRef = doc(db, `cursos/${curso}/turmas/${turma}/alunos`, id);

    await updateDoc(alunoRef, {
      nome,
      email,
    });

    navigate("/gerenciamentoAlunos");
  }

  function handleCancelar() {
    navigate("/gerenciamentoAlunos");
  }

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" p={2}>
      <Card sx={{ width: 400, p: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" mb={3} textAlign="center">
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
          <Box mt={3} display="flex" justifyContent="space-between">
            <Button variant="contained" color="primary" onClick={handleSalvar}>
              Salvar
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleCancelar}>
              Cancelar
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EditarAluno;
