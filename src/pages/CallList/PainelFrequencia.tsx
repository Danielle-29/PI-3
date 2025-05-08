import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import {
  collection,
  getDocs,
  DocumentData,
} from "firebase/firestore";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  TablePagination,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./PainelFrequencia.css";

const PainelFrequencia = () => {
  const [cursoSelecionado, setCursoSelecionado] = useState("");
  const [turmaSelecionada, setTurmaSelecionada] = useState("");
  const [mesSelecionado, setMesSelecionado] = useState("");
  const [alunos, setAlunos] = useState<DocumentData[]>([]);
  const [datasChamada, setDatasChamada] = useState<string[]>([]);
  const [listaTurmas, setListaTurmas] = useState<string[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [linhasPorPagina, setLinhasPorPagina] = useState(10);

  const navigate = useNavigate();

  useEffect(() => {
    const carregarTurmas = async () => {
      if (!cursoSelecionado) return;

      try {
        const turmasRef = collection(db, `cursos/${cursoSelecionado}/turmas`);
        const snapshot = await getDocs(turmasRef);
        const turmas: string[] = [];

        snapshot.forEach((doc) => {
          turmas.push(doc.id);
        });

        setListaTurmas(turmas.sort());
        console.log("Turmas carregadas:", turmas);
      } catch (error) {
        console.error("Erro ao carregar turmas:", error);
      }
    };

    carregarTurmas();
  }, [cursoSelecionado]);

  useEffect(() => {
    const buscarPresencas = async () => {
      if (!cursoSelecionado || !turmaSelecionada || !mesSelecionado) return;

      try {
        const presencasRef = collection(
          db,
          `cursos/${cursoSelecionado}/turmas/${turmaSelecionada}/presencas`
        );
        const snapshot = await getDocs(presencasRef);

        const alunosMap: Record<string, any> = {};
        const datasSet = new Set<string>();

        snapshot.forEach((doc) => {
          const dataPresenca = doc.id; // ex: "2025-05-06"
          const dataObj = new Date(dataPresenca);
          const mes = dataObj.getMonth() + 1;

          if (mes === parseInt(mesSelecionado)) {
            const dia = String(dataObj.getDate()).padStart(2, '0');
            datasSet.add(dia);

            const dados = doc.data();
            const alunosChamados = dados.alunos || {};

            Object.values(alunosChamados).forEach((aluno: any) => {
              const nome = aluno.nomeCompleto;

              if (!alunosMap[nome]) {
                alunosMap[nome] = {
                  nomeCompleto: nome,
                  chamada: {},
                  totalPresenca: 0,
                  totalChamada: 0,
                };
              }
              alunosMap[nome].chamada[dia] = aluno.presente;
              alunosMap[nome].totalChamada += 1;
              if (aluno.presente) alunosMap[nome].totalPresenca += 1;
            });
          }
        });

        const listaAlunos = Object.values(alunosMap);

        setAlunos(listaAlunos);
        setDatasChamada(Array.from(datasSet).sort((a, b) => parseInt(a) - parseInt(b)));

        console.log("Alunos carregados:", listaAlunos);
        console.log("Datas filtradas do mês:", Array.from(datasSet));
      } catch (error) {
        console.error("Erro ao buscar presenças:", error);
      }
    };

    buscarPresencas();
  }, [cursoSelecionado, turmaSelecionada, mesSelecionado]);

  const meses = [
    { label: "Janeiro", value: "1" },
    { label: "Fevereiro", value: "2" },
    { label: "Março", value: "3" },
    { label: "Abril", value: "4" },
    { label: "Maio", value: "5" },
    { label: "Junho", value: "6" },
    { label: "Julho", value: "7" },
    { label: "Agosto", value: "8" },
    { label: "Setembro", value: "9" },
    { label: "Outubro", value: "10" },
    { label: "Novembro", value: "11" },
    { label: "Dezembro", value: "12" },
  ];

  return (
    <div className="painel-container">
      <Typography variant="h5" gutterBottom>
        Painel de Frequência por Aluno
      </Typography>

      <div className="painel-controles">
        <FormControl style={{ minWidth: 150 }}>
          <InputLabel>Curso</InputLabel>
          <Select
            value={cursoSelecionado}
            onChange={(e) => setCursoSelecionado(e.target.value)}
          >
            <MenuItem value="ingles">Inglês</MenuItem>
            <MenuItem value="espanhol">Espanhol</MenuItem>
          </Select>
        </FormControl>

        <FormControl style={{ minWidth: 150 }}>
          <InputLabel>Turma</InputLabel>
          <Select
            value={turmaSelecionada}
            onChange={(e) => setTurmaSelecionada(e.target.value)}
          >
            {listaTurmas.map((turma) => (
              <MenuItem key={turma} value={turma}>
                {turma.replace("_", " ").toUpperCase()}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl style={{ minWidth: 150 }}>
          <InputLabel>Mês</InputLabel>
          <Select
            value={mesSelecionado}
            onChange={(e) => setMesSelecionado(e.target.value)}
          >
            {meses.map((mes) => (
              <MenuItem key={mes.value} value={mes.value}>{mes.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {alunos.length > 0 && datasChamada.length > 0 && (
        <TableContainer component={Paper} style={{ marginTop: 30 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Aluno</strong></TableCell>
                {datasChamada.map((data) => (
                  <TableCell key={data}><strong>{data}</strong></TableCell>
                ))}
                <TableCell><strong>Total</strong></TableCell>
                <TableCell><strong>% Presença</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {alunos
                .slice(paginaAtual * linhasPorPagina, paginaAtual * linhasPorPagina + linhasPorPagina)
                .map((aluno, idx) => {
                  const totalPresencas = aluno.totalPresenca || 0;
                  const totalChamadas = aluno.totalChamada || datasChamada.length;
                  const percentual = totalChamadas > 0 ? Math.round((totalPresencas / totalChamadas) * 100) : 0;

                  return (
                    <TableRow key={idx}>
                      <TableCell>{aluno.nomeCompleto}</TableCell>
                      {datasChamada.map((data) => (
                        <TableCell key={data}>
                          {aluno.chamada?.[data] === true
                            ? "P"
                            : aluno.chamada?.[data] === false
                            ? "A"
                            : "-"}
                        </TableCell>
                      ))}
                      <TableCell>{totalPresencas}</TableCell>
                      <TableCell>{percentual}%</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={alunos.length}
            rowsPerPage={linhasPorPagina}
            page={paginaAtual}
            onPageChange={(event, novaPagina) => setPaginaAtual(novaPagina)}
            onRowsPerPageChange={(event) => {
              setLinhasPorPagina(parseInt(event.target.value, 10));
              setPaginaAtual(0);
            }}
          />
        </TableContainer>
      )}
    </div>
  );
};

export default PainelFrequencia;
