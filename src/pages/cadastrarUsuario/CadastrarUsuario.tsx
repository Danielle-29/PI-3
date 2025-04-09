import React, { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import {
  TextField,
  Button,
  MenuItem,
  Alert,
  Box,
  Typography,
  Paper,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputLabel,
  OutlinedInput,
  Snackbar,
  Slide
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./CadastrarUsuario.css";
import ilustracao from "../../assets/undraw_Collaboration_re_vyau.webp";

const CadastrarUsuario: React.FC = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [perfil, setPerfil] = useState("funcionario");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [senhaAdmin, setSenhaAdmin] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const carregarNomeAdmin = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const dados = docSnap.data();
          localStorage.setItem("nomeUsuario", dados.nome || "");
        }
      }
    };
    carregarNomeAdmin();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (senha.length < 6) {
      setErro("A senha deve ter no mínimo 6 caracteres.");
      setSucesso(false);
      return;
    }

    setDialogAberto(true);
  };

  const confirmarCadastro = async () => {
    try {
      setCarregando(true);
      const adminUser = auth.currentUser;
      const adminEmail = adminUser?.email || "";

      if (!senhaAdmin || !adminEmail) {
        throw new Error("Senha do administrador não fornecida.");
      }

      await signInWithEmailAndPassword(auth, adminEmail, senhaAdmin);

      const novoUsuario = await createUserWithEmailAndPassword(auth, email, senha);
      const uid = novoUsuario.user.uid;

      await setDoc(doc(db, "usuarios", uid), {
        nome,
        email,
        perfil,
      });

      await signInWithEmailAndPassword(auth, adminEmail, senhaAdmin);

      setSucesso(true);
      setSnackbarOpen(true);
      setErro("");
      setNome("");
      setEmail("");
      setSenha("");
      setPerfil("funcionario");
      setDialogAberto(false);

      setTimeout(() => navigate("/"), 2500);
    } catch (err: any) {
      setErro(err.message);
      setSucesso(false);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <Box className="cadastro-container">
      <Paper elevation={6} className="cadastro-card">
        <Box className="cadastro-imagem">
          <img src={ilustracao} alt="Cadastrar usuário" />
        </Box>

        <Typography
          variant="h5"
          gutterBottom
          className="cadastro-titulo"
        >
          Cadastrar Novo Usuário
        </Typography>

        <form onSubmit={handleSubmit} className="cadastro-form">
          <TextField
            label="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            fullWidth
          />
          <TextField
            select
            label="Perfil"
            value={perfil}
            onChange={(e) => setPerfil(e.target.value)}
            fullWidth
          >
            <MenuItem value="funcionario">Funcionário</MenuItem>
            <MenuItem value="professor">Professor</MenuItem>
          </TextField>
          <Button
            variant="contained"
            type="submit"
            fullWidth
            className="cadastro-botao"
            disabled={carregando}
          >
            {carregando ? <CircularProgress size={24} color="inherit" /> : "Cadastrar"}
          </Button>
        </form>

        {erro && <Alert severity="error" sx={{ mt: 2 }}>{erro}</Alert>}
        {sucesso && (
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={2500}
            onClose={() => setSnackbarOpen(false)}
            TransitionComponent={(props) => <Slide {...props} direction="up" />}
            message="Usuário cadastrado com sucesso!"
          />
        )}
      </Paper>

      <Dialog open={dialogAberto} onClose={() => setDialogAberto(false)}>
        <DialogTitle>Confirmação de Segurança</DialogTitle>
        <DialogContent>
          <InputLabel htmlFor="senha-admin">Digite sua senha para confirmar:</InputLabel>
          <OutlinedInput
            id="senha-admin"
            type="password"
            fullWidth
            autoFocus
            value={senhaAdmin}
            onChange={(e) => setSenhaAdmin(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogAberto(false)}>Cancelar</Button>
          <Button onClick={confirmarCadastro} variant="contained">Confirmar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CadastrarUsuario;
