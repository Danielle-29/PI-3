""import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  useMediaQuery,
  useTheme,
  TextField,
  MenuItem
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";

const EditarUsuario: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [perfil, setPerfil] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        const usuarioRef = doc(db, "usuarios", id!);
        const snapshot = await getDocs(collection(db, "usuarios"));
        const usuario = snapshot.docs.find((doc) => doc.id === id)?.data();

        if (usuario) {
          setNome(usuario.nome);
          setEmail(usuario.email);
          setPerfil(usuario.perfil);
        }
      } catch (error: any) {
        setErro("Erro ao carregar usuário");
      } finally {
        setCarregando(false);
      }
    };
    carregarUsuario();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await doc(db, "usuarios", id!).set({ nome, email, perfil });
      setSucesso(true);
      setErro("");
      setTimeout(() => navigate("/usuarios"), 2000);
    } catch (err: any) {
      setErro("Erro ao atualizar usuário");
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 5, mb: 6, px: 2 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography
          variant={isMobile ? "h5" : "h4"}
          align="center"
          mb={4}
          sx={{ fontWeight: "bold", color: "#1B4BD2" }}
        >
          Editar Usuário
        </Typography>

        {carregando ? (
          <Box textAlign="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            <TextField
              label="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              select
              label="Perfil"
              value={perfil}
              onChange={(e) => setPerfil(e.target.value)}
              fullWidth
              margin="normal"
              required
            >
              <MenuItem value="funcionario">Funcionário</MenuItem>
              <MenuItem value="professor">Professor</MenuItem>
              <MenuItem value="admin">Administrador</MenuItem>
            </TextField>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, backgroundColor: "#1B4BD2", '&:hover': { backgroundColor: "#824295" } }}
            >
              Salvar Alterações
            </Button>
          </form>
        )}

        {erro && <Typography color="error" mt={2}>{erro}</Typography>}
        {sucesso && <Typography color="success.main" mt={2}>Usuário atualizado com sucesso!</Typography>}
      </Paper>
    </Box>
  );
};

export default EditarUsuario;

