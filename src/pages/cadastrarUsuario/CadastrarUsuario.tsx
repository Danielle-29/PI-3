import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { TextField, Button, MenuItem, Alert, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const CadastrarUsuario: React.FC = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [perfil, setPerfil] = useState("funcionario");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const uid = userCredential.user.uid;

      await setDoc(doc(db, "usuarios", uid), {
        nome,
        email,
        perfil,
      });

      setSucesso(true);
      setErro("");
      setNome("");
      setEmail("");
      setSenha("");
      setPerfil("funcionario");

      setTimeout(() => navigate("/"), 2000);
    } catch (err: any) {
      setErro(err.message);
      setSucesso(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 5 }}>
      <h2>Cadastrar Novo Usuário</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Senha"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          select
          label="Perfil"
          value={perfil}
          onChange={(e) => setPerfil(e.target.value)}
          fullWidth
          margin="normal"
        >
          <MenuItem value="funcionario">Funcionário</MenuItem>
          <MenuItem value="professor">Professor</MenuItem>
        </TextField>

        <Button variant="contained" color="primary" fullWidth type="submit">
          Cadastrar
        </Button>
      </form>

      {erro && <Alert severity="error" sx={{ mt: 2 }}>{erro}</Alert>}
      {sucesso && <Alert severity="success" sx={{ mt: 2 }}>Usuário cadastrado com sucesso!</Alert>}
    </Box>
  );
};

export default CadastrarUsuario;