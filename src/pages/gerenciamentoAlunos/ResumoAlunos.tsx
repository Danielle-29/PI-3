import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell } from "recharts"; 
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Typography, Box, Card, CardContent, Divider } from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';
import BarChartIcon from '@mui/icons-material/BarChart';

interface ResumoCurso {
  totalAlunos: number;
  curso: string;
}

const ResumoEstatistico: React.FC = () => {
  const [resumo, setResumo] = useState<Record<string, ResumoCurso>>({});
  const [error, setError] = useState<string | null>(null);

  const COLORS = ["#1B4BD2", "#824295", "#00C49F", "#FF8042"];

  useEffect(() => {
    async function fetchResumo() {
      try {
        const response = await fetch("https://obterresumoestatisticov2-lrmzy6mw5q-rj.a.run.app");
        const data = await response.json();
        setResumo(data);
      } catch (err) {
        console.error("Erro ao buscar resumo:", err);
        setError("Erro ao carregar dados.");
      }
    }
    fetchResumo();
  }, []);

  const data = Object.values(resumo);

  const totalAlunos = data.reduce((acc, cur) => acc + cur.totalAlunos, 0);

  return (
    <div className="container-resumo">
      <Box className="titulo-resumo">
        <Typography variant="h5" sx={{ color: "#1B4BD2", fontWeight: "bold" }}>
          <BarChartIcon sx={{ verticalAlign: "middle", mr: 1 }} /> Resumo Estatístico por Curso
        </Typography>
      </Box>

      <Card className="grafico">
        <CardContent>
          <Typography variant="h6" align="center" gutterBottom>
            Distribuição de Alunos
          </Typography>
          {data.length > 0 ? (
            <PieChart width={400} height={300}>
              <Pie
                data={data}
                dataKey="totalAlunos"
                nameKey="curso"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label={({ name, value }) => {
                  const cursoNome = name.charAt(0).toUpperCase() + name.slice(1);
                  const percentual = ((value / totalAlunos) * 100).toFixed(0);
                  return `${cursoNome}: ${percentual}%`;
                }}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          ) : (
            <Typography align="center" color="textSecondary">
              No data to display
            </Typography>
          )}
        </CardContent>
      </Card>

      <Card className="grafico">
        <CardContent>
          <Typography variant="h6" align="center" gutterBottom>
            Informações dos Cursos
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center"><b>Curso</b></TableCell>
                  <TableCell align="center"><b>Total de Alunos</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((curso, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">
                      {curso.curso.charAt(0).toUpperCase() + curso.curso.slice(1)}
                    </TableCell>
                    <TableCell align="center">{curso.totalAlunos}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumoEstatistico;
