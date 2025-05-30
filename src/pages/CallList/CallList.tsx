import ingles from "../../assets/estados-unidos.webp";
import espanhol from "../../assets/espanha.webp";
import "./callList.css";
import React, { useState, useEffect } from "react";
import { db } from '../../firebaseConfig';
import { collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Checkbox, Button, MenuItem, Select, InputLabel,
  FormControl, TablePagination, TextField, Box
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import dayjs, { Dayjs } from "dayjs";
import 'dayjs/locale/pt-br';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";

const CallList: React.FC = () => {
  const [curso, setCurso] = useState<string | null>(null);
  const [turmas, setTurmas] = useState<string[]>([]);
  const [turmaSelecionada, setTurmaSelecionada] = useState<string>("");
  const [alunos, setAlunos] = useState<any[]>([]);
  const [contagemPresente, setContagemPresente] = useState(0);
  const [contagemAusente, setContagemAusente] = useState(0);
  const [exibirContagem, setExibirContagem] = useState(false);
  const [popupAberto, setPopupAberto] = useState(false);
  const [dataSelecionada, setDataSelecionada] = useState<Dayjs>(dayjs());
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  const handleChangePage = (event: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const salvarPresenca = async () => {
    const dataKey = dataSelecionada.format("YYYY-MM-DD");
    const listaAtualizada = alunos.map((aluno) => ({
      ...aluno,
      presente: aluno.presente || false,
      ausente: aluno.presente ? false : true,
    }));

    const presencaRef = doc(db, "cursos", curso!, "turmas", turmaSelecionada, "presencas", dataKey);

    try {
      await setDoc(presencaRef, { alunos: listaAtualizada });
      setAlunos(listaAtualizada);
      atualizarContagem(listaAtualizada);
      setExibirContagem(true);
      setPopupAberto(true);
    } catch (error) {
      console.error("Erro ao salvar presença:", error);
      alert("Erro ao salvar presença.");
    }
  };

  const atualizarContagem = (lista: any[]) => {
    const presentes = lista.filter((aluno) => aluno.presente).length;
    const ausentes = lista.filter((aluno) => aluno.ausente).length;
    setContagemPresente(presentes);
    setContagemAusente(ausentes);
  };

  const carregarTurmas = async (cursoSelecionado: string) => {
    const snapshot = await getDocs(collection(db, "cursos", cursoSelecionado, "turmas"));
    const turmasEncontradas = snapshot.docs.map(doc => doc.id);
    setTurmas(turmasEncontradas);
  };

  const carregarAlunos = async () => {
    if (!curso || !turmaSelecionada || !dataSelecionada) return;
    const dataKey = dataSelecionada.format("YYYY-MM-DD");
    try {
      const presencaRef = doc(db, "cursos", curso, "turmas", turmaSelecionada, "presencas", dataKey);
      const presencaSnap = await getDoc(presencaRef);
      if (presencaSnap.exists()) {
        const dados = presencaSnap.data();
        setAlunos(dados.alunos || []);
      } else {
        const snapshot = await getDocs(collection(db, 'cursos', curso, 'turmas', turmaSelecionada, 'alunos'));
        const dadosFirestore = snapshot.docs.map(doc => doc.data());
        dadosFirestore.sort((a, b) => {
          const nomeA = (a.nome || a.nomeCompleto || "").toLowerCase();
          const nomeB = (b.nome || b.nomeCompleto || "").toLowerCase();
          return nomeA.localeCompare(nomeB);
        });
        setAlunos(dadosFirestore);
      }
      setExibirContagem(false);
    } catch (error) {
      console.error('Erro ao buscar alunos do Firestore:', error);
    }
  };

  const handleCursoClick = async (nomeCurso: string) => {
    setCurso(nomeCurso);
    setTurmaSelecionada("");
    setAlunos([]);
    await carregarTurmas(nomeCurso);
  };

  const handleCheckboxChange = (index: number, type: 'presente' | 'ausente') => {
    setAlunos((prev) =>
      prev.map((aluno, i) =>
        i === index
          ? {
              ...aluno,
              [type]: !aluno[type],
              ...(type === 'presente' ? { ausente: false } : { presente: false })
            }
          : aluno
      )
    );
  };

  return (
    <div className="page-container">
      <div className="container-list">
        <h1>Lista de Presença</h1>
        <Typography variant="subtitle1" fontSize={18} gutterBottom>
          Escolha o curso
        </Typography>
        <div className="card" style={{ justifyContent: 'center', gap: '20rem'}}>
          <Card onClick={() => handleCursoClick('ingles')} sx={{ maxWidth: 400 }}>
            <CardActionArea>
              <CardMedia component="img" height="250" image={ingles} alt="Inglês" />
              <CardContent>
                <Typography gutterBottom variant="h5">Inglês</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card onClick={() => handleCursoClick('espanhol')} sx={{ maxWidth: 400 }}>
            <CardActionArea>
              <CardMedia component="img" height="250" image={espanhol} alt="Espanhol" />
              <CardContent>
                <Typography gutterBottom variant="h5">Espanhol</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </div>

        {curso && (
          <Box textAlign="center" mt={4}>
            <Box display="flex" justifyContent="center" alignItems="center" gap={2} mb={2}>
              <FormControl size="small" sx={{ width: 250 }}>
                <InputLabel id="turma-select-label">Turma</InputLabel>
                <Select
                  labelId="turma-select-label"
                  value={turmaSelecionada}
                  label="Turma"
                  onChange={(e) => setTurmaSelecionada(e.target.value)}
                >
                  {turmas.map((turma) => (
                    <MenuItem key={turma} value={turma}>{turma}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                <DatePicker
                  label="Data da Chamada"
                  value={dataSelecionada}
                  onChange={(newValue) => {
                    if (newValue) setDataSelecionada(newValue);
                  }}
                  inputFormat="DD/MM/YYYY"
                  renderInput={(params) => <TextField {...params} size="small" />}
                />
              </LocalizationProvider>
            </Box>

            <Button aria-label="carregamento de alunos" variant="contained" onClick={carregarAlunos} disabled={!turmaSelecionada}>
              Carregar Alunos
            </Button>
          </Box>
        )}

        {exibirContagem && (
          <div className="contagem-presenca">
            <p>Presentes: {contagemPresente}</p>
            <p>Ausentes: {contagemAusente}</p>
          </div>
        )}

        {alunos.length > 0 && (
          <>
            <TableContainer component={Paper} sx={{ maxWidth: 1200, mx: "auto", mt: 3}}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell><strong>Nome</strong></TableCell>
                    <TableCell align="center"><strong>Presente</strong></TableCell>
                    <TableCell align="center"><strong>Ausente</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {alunos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((aluno, index) => (
                    <TableRow key={index}>
                      <TableCell>{aluno.nome || aluno.nomeCompleto || "sem nome"}</TableCell>
                      <TableCell align="center">
                        <Checkbox
                          checked={aluno.presente || false}
                          onChange={() => handleCheckboxChange(index + page * rowsPerPage, 'presente')}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Checkbox
                          checked={aluno.ausente || false}
                          onChange={() => handleCheckboxChange(index + page * rowsPerPage, 'ausente')}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={alunos.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 15, 25]}
              />
            </TableContainer>

            <Box textAlign="center">
              <Button aria-label="salvar presença" variant="contained" color="primary" onClick={salvarPresenca} sx={{ mt: 3 }}>
                Salvar Presença
              </Button>
            </Box>
          </>
        )}

        <Dialog open={popupAberto} onClose={() => setPopupAberto(false)}>
          <DialogTitle>✅ Presenças registradas com sucesso!</DialogTitle>
          <DialogActions>
            <Button aria-label="popup marcação presença" onClick={() => setPopupAberto(false)} autoFocus>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default CallList;
