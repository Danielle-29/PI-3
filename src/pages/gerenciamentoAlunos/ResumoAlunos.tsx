import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
  TablePagination,
  TextField
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import "./resumoAlunos.css";

const ResumoAlunos: React.FC = () => {
  const [alunos, setAlunos] = useState<any[]>([]);
  const [filtro, setFiltro] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    async function buscarAlunos() {
      const cursos = ["espanhol", "ingles"];
      const listaAlunos: any[] = [];

      for (const cursoId of cursos) {
        const turmasRef = collection(db, "cursos", cursoId, "turmas");
        const turmasSnapshot = await getDocs(turmasRef);

        for (const turmaDoc of turmasSnapshot.docs) {
          const turmaId = turmaDoc.id;
          const alunosRef = collection(db, "cursos", cursoId, "turmas", turmaId, "alunos");
          const alunosSnapshot = await getDocs(alunosRef);

          alunosSnapshot.forEach((alunoDoc) => {
            const alunoData = alunoDoc.data();
            listaAlunos.push({
              id: alunoDoc.id,
              ...alunoData,
              curso: cursoId,
              turma: turmaId,
            });
          });
        }
      }

      setAlunos(listaAlunos);
    }

    buscarAlunos();
  }, []);

  const handleExcluir = async (cursoId: string, turmaId: string, alunoId: string) => {
    const confirmar = window.confirm("Tem certeza que deseja excluir este aluno?");
    if (!confirmar) return;

    try {
      const alunoDocRef = doc(db, "cursos", cursoId, "turmas", turmaId, "alunos", alunoId);
      await deleteDoc(alunoDocRef);
      setAlunos((prev) => prev.filter((a) => a.id !== alunoId));
    } catch (erro) {
      console.error("❌ Erro ao excluir aluno: ", erro);
      alert("Erro ao excluir aluno.");
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const alunosFiltrados = alunos.filter((aluno) =>
    (aluno.nomeCompleto || "").toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <Box className="container-resumo-alunos">
      <Typography variant="h5" align="center" gutterBottom>
        Gerenciamento de Alunos
      </Typography>

      <Box mb={2} display="flex" justifyContent="center">
        <TextField
          placeholder="Buscar por nome..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          variant="outlined"
          size="small"
          sx={{ width: "100%", maxWidth: 400 }}
        />
      </Box>

      {alunosFiltrados.length === 0 ? (
        <Typography align="center" className="empty-msg">
          Nenhum aluno encontrado.
        </Typography>
      ) : (
        <Paper>
          <TableContainer className="table-wrapper">
            <Table size={isMobile ? "small" : "medium"}>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Nome</strong></TableCell>
                  <TableCell><strong>Curso</strong></TableCell>
                  <TableCell><strong>Turma</strong></TableCell>
                  <TableCell align="right"><strong>Ações</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {alunosFiltrados.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((aluno) => (
                  <TableRow key={aluno.id}>
                    <TableCell>{aluno.nomeCompleto || aluno.nome || aluno.id}</TableCell>
                    <TableCell>{aluno.curso}</TableCell>
                    <TableCell>{aluno.turma}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Editar">
                        <IconButton onClick={() => navigate(`/admin/editar-aluno/${aluno.curso}/${aluno.turma}/${aluno.id}`)}>
                          <Edit color="primary" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir">
                        <IconButton onClick={() => handleExcluir(aluno.curso, aluno.turma, aluno.id)}>
                          <Delete color="error" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={alunosFiltrados.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Paper>
      )}
    </Box>
  );
};

export default ResumoAlunos;

