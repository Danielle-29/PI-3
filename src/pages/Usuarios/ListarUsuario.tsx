import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const ListarUsuario: React.FC = () => {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [idParaExcluir, setIdParaExcluir] = useState<string | null>(null);
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const carregarUsuarios = async () => {
    setCarregando(true);
    const usuariosRef = collection(db, "usuarios");
    const snapshot = await getDocs(usuariosRef);
    const dados = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setUsuarios(dados);
    setCarregando(false);
  };

  const confirmarExclusao = (id: string) => {
    setIdParaExcluir(id);
    setDialogOpen(true);
  };

  const excluirUsuario = async () => {
    if (idParaExcluir) {
      await deleteDoc(doc(db, "usuarios", idParaExcluir));
      setUsuarios((prev) => prev.filter((user) => user.id !== idParaExcluir));
      setDialogOpen(false);
    }
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 5, mb: 6, px: 2 }}>
      <Typography
        variant={isMobile ? "h5" : "h4"}
        align="center"
        mb={4}
        sx={{ fontWeight: "bold", color: "#1B4BD2" }}
      >
        Usuários Cadastrados
      </Typography>

      {carregando ? (
        <Box textAlign="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper elevation={3} sx={{ borderTop: "2px solid #ccc", borderBottom: "2px solid #ccc" }}>
          <TableContainer>
            <Table size={isMobile ? "small" : "medium"}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>Nome</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Perfil</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usuarios.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.nome}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.perfil}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Editar">
                        <IconButton onClick={() => navigate(`/editar-usuario/${user.id}`)}>
                          <Edit color="primary" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir">
                        <IconButton onClick={() => confirmarExclusao(user.id)}>
                          <Delete color="error" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Deseja realmente excluir este usuário?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button onClick={excluirUsuario} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ListarUsuario;
