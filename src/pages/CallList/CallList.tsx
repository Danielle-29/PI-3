import ingles from "../../assets/estados-unidos.webp";
import espanhol from "../../assets/espanha.webp";
import "./callList.css";
import React, { useState, useEffect } from "react";
import { db } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, Checkbox, Button, Alert, MenuItem, Select, 
  InputLabel, FormControl, TablePagination } from '@mui/material';

interface Aluno {
  nome: string;
  nomeCompleto?: string;
  documento?: string;
  numero?: string | number;
  presente?: boolean;
  ausente?: boolean;
}

const TEMPO_LIMITE = 10000;

const CallList: React.FC = () => {
  const [curso, setCurso] = useState<string | null>(null);
  const [turmas, setTurmas] = useState<string[]>([]);
  const [turmaSelecionada, setTurmaSelecionada] = useState<string>("");
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [contagemPresente, setContagemPresente] = useState<number>(0);
  const [contagemAusente, setContagemAusente] = useState<number>(0);
  const [exibirContagem, setExibirContagem] = useState<boolean>(false);
  const [alertaVisivel, setAlertaVisivel] = useState<boolean>(false);

  const [page, setPage] = useState(0);
const [rowsPerPage, setRowsPerPage] = useState(15);

const handleChangePage = (event: unknown, newPage: number) => {
  setPage(newPage);
};

const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
  setRowsPerPage(parseInt(event.target.value, 10));
  setPage(0);
};


  const carregarPresencas = () => {
    const presencasSalvas = localStorage.getItem("presencas");
    const tempoSalvo = localStorage.getItem("tempoSalvo");

    if (presencasSalvas && tempoSalvo) {
      const agora = Date.now();
      const tempoPassado = agora - parseInt(tempoSalvo);

      if (tempoPassado < TEMPO_LIMITE) {
        return JSON.parse(presencasSalvas);
      } else {
        localStorage.removeItem("presencas");
        localStorage.removeItem("tempoSalvo");
      }
    }
    return [];
  };

  const salvarPresenca = () => {
    localStorage.setItem("presencas", JSON.stringify(alunos));
    localStorage.setItem("tempoSalvo", Date.now().toString());
    atualizarContagem();
    setExibirContagem(true);
    setAlertaVisivel(true);

    setTimeout(() => {
      setAlertaVisivel(false);
    }, 3000);
  };

  const atualizarContagem = () => {
    const presentes = alunos.filter(aluno => aluno.presente).length;
    const ausentes = alunos.filter(aluno => aluno.ausente).length;
    setContagemPresente(presentes);
    setContagemAusente(ausentes);
  };

  const carregarTurmas = async (cursoSelecionado: string) => {
    const snapshot = await getDocs(collection(db, "cursos", cursoSelecionado, "turmas"));
    const turmasEncontradas = snapshot.docs.map(doc => doc.id);
    setTurmas(turmasEncontradas);
  };

  const carregarAlunos = async () => {
    if (!curso || !turmaSelecionada) return;
    try {
      const snapshot = await getDocs(collection(db, 'cursos', curso, 'turmas', turmaSelecionada, 'alunos'));
      const dadosFirestore = snapshot.docs.map(doc => doc.data() as Aluno);
      const presencasSalvas = carregarPresencas();
      const alunosComPresenca = dadosFirestore.map((aluno) => {
        const nomeParaComparar = aluno.nome || aluno.nomeCompleto || "";
        const alunoPresenca = presencasSalvas.find((p: Aluno) => (p.nome || p.nomeCompleto) === nomeParaComparar);
        return {
          ...aluno,
          ...alunoPresenca
        };
      });
      alunosComPresenca.sort((a, b) => {
        const nomeA = (a.nome || a.nomeCompleto || "").toLowerCase();
        const nomeB = (b.nome || b.nomeCompleto || "").toLowerCase();
        return nomeA.localeCompare(nomeB);
      });      
      setAlunos(alunosComPresenca);
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
        <p>Escolha o curso</p>

        <div className="card">
          <div role="button" onClick={() => handleCursoClick('ingles')} aria-label="Selecionar curso de Inglês" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && handleCursoClick('ingles')}>
            <Card sx={{ maxWidth: 360 }}>
              <CardActionArea>
                <CardMedia component="img" height="140" image={ingles} alt="Inglês" title="Inglês" />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">Inglês</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </div>
          <div role="button" onClick={() => handleCursoClick('espanhol')} aria-label="Selecionar curso de Espanhol" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && handleCursoClick('espanhol')}>
            <Card sx={{ maxWidth: 360 }}>
              <CardActionArea>
                <CardMedia component="img" height="140" image={espanhol} alt="Espanhol" title="Espanhol" />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">Espanhol</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </div>
        </div>

        {curso && (
          <div>
            <FormControl fullWidth sx={{ my: 3 }}>
              <InputLabel id="turma-select-label">Selecione a turma</InputLabel>
              <Select
                labelId="turma-select-label"
                value={turmaSelecionada}
                label="Selecione a turma"
                onChange={(e) => setTurmaSelecionada(e.target.value)}
              >
                {turmas.map((turma) => (
                  <MenuItem key={turma} value={turma}>{turma}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              onClick={carregarAlunos}
              disabled={!turmaSelecionada}
              sx={{ mb: 3 }}
            >
              Carregar Alunos
            </Button>

            {alertaVisivel && (
              <Alert severity="success" onClose={() => setAlertaVisivel(false)} sx={{ maxWidth: '400px', margin: '0 auto' }}>
                Presença salva com sucesso!
              </Alert>
            )}

            {exibirContagem && (
              <div className="contagem-presenca">
                <p>Presentes: {contagemPresente}</p>
                <p>Ausentes: {contagemAusente}</p>
              </div>
            )}

<TableContainer component={Paper} sx={{ maxWidth: '1200px', margin: '0 auto' }}>
  <Table sx={{ minWidth: 700 }} aria-label="attendance table">
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
          <TableCell>{aluno.nome || aluno.nomeCompleto || "em nome"}</TableCell>
          <TableCell align="center">
            <Checkbox
              checked={aluno.presente || false}
              onChange={() => handleCheckboxChange(index + page * rowsPerPage, 'presente')}
              color="primary"
            />
          </TableCell>
          <TableCell align="center">
            <Checkbox
              checked={aluno.ausente || false}
              onChange={() => handleCheckboxChange(index + page * rowsPerPage, 'ausente')}
              color="secondary"
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


            <div>
              <Button variant="contained" color="primary" onClick={salvarPresenca} sx={{ marginTop: '20px' }}>
                Salvar Presença
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallList;


