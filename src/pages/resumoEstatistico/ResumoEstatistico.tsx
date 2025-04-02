import React, { useEffect, useState } from "react";
import './resumoEstatistico.css';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts'; 
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

  useEffect(() => {
    const fetchResumo = async () => {
      try {
        const response = await fetch("https://southamerica-east1-pi-carlos-kopcak.cloudfunctions.net/obterResumoEstatisticoV2");
        if (!response.ok) {
          throw new Error("Erro ao buscar dados");
        }
        const data = await response.json();
        setResumo(data);
      } catch (error) {
        setError("Não foi possível carregar os dados.");
      }
    };

    fetchResumo();
  }, []);

  if (error) return <p>{error}</p>;

  const totalAlunosGeral = Object.values(resumo).reduce((acc, cur) => acc + cur.totalAlunos, 0);

  const pieChartData = Object.entries(resumo).map(([curso, { totalAlunos }]) => ({
    id: curso,
    value: totalAlunos,
    label: `${((totalAlunos / totalAlunosGeral) * 100).toFixed(0)}%`,
  }));

  const rows = Object.entries(resumo).map(([curso, { totalAlunos }]) => ({
    name: curso.charAt(0).toUpperCase() + curso.slice(1), 
    totalAlunos,
  }));

  return (
    <div className="container-resumo">
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography variant="h5" sx={{ color: "#1B4BD2", fontWeight: "bold" }}>
          <BarChartIcon sx={{ verticalAlign: "middle", mr: 1 }} />Resumo Estatístico por Curso
        </Typography>
      </Box>

      <Box display="flex" justifyContent="center" mb={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom align="center">
              Distribuição de Alunos
            </Typography>
            <PieChart
              series={[{
                data: pieChartData,
                arcLabel: (item) => item.label ?? '',
                arcLabelMinAngle: 10
              }]}
              sx={{ [`& .${pieArcLabelClasses.root}`]: { fill: 'white', fontSize: 14 } }}
              width={350}
              height={300}
            />
          </CardContent>
        </Card>
      </Box>

      <Box display="flex" justifyContent="center">
        <Card sx={{ maxWidth: 500, width: '100%' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: "#1B4BD2" }}>
              <InfoIcon sx={{ verticalAlign: "middle", mr: 1 }} /> Informações dos Cursos
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <TableContainer component={Paper}>
              <Table size="small" aria-label="tabela de cursos">
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell><strong>Curso</strong></TableCell>
                    <TableCell align="right"><strong>Total de Alunos</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.name}>
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="right">{row.totalAlunos}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>

    </div>
  );
};

export default ResumoEstatistico;

