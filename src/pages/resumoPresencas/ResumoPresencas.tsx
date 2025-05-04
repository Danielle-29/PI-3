import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import "./resumoPresencas.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const ResumoPresencas: React.FC = () => {
  const [mesSelecionado, setMesSelecionado] = useState<number>(4); // Maio (0 = Jan)
  const [cursoSelecionado, setCursoSelecionado] = useState<string>("espanhol");
  const [totalPresencas, setTotalPresencas] = useState<number>(0);
  const [totalFaltas, setTotalFaltas] = useState<number>(0);

  const cursos = ["espanhol", "ingles"];

  const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const buscarPresencas = async () => {
    let presencas = 0;
    let faltas = 0;

    const turmasSnapshot = await getDocs(collection(db, `cursos/${cursoSelecionado}/turmas`));
    for (const turmaDoc of turmasSnapshot.docs) {
      const turmaId = turmaDoc.id;
      const presencasSnapshot = await getDocs(collection(db, `cursos/${cursoSelecionado}/turmas/${turmaId}/presencas`));
      for (const doc of presencasSnapshot.docs) {
        const [ano, mes, dia] = doc.id.split("-").map(Number);
        const dataChamada = new Date(ano, mes - 1, dia); // Correção aqui

        if (dataChamada.getMonth() === mesSelecionado) {
          const data = doc.data();
          const alunos = data.alunos || [];
          for (const aluno of alunos) {
            if (aluno.presente) presencas++;
            else faltas++;
          }
        }
      }
    }

    console.log(`✅ Total de presenças: ${presencas}, Total de faltas: ${faltas}`);
    setTotalPresencas(presencas);
    setTotalFaltas(faltas);
  };

  useEffect(() => {
    buscarPresencas();
  }, [mesSelecionado, cursoSelecionado]);

  const data = {
    labels: ["Presença", "Faltas"],
    datasets: [
      {
        data: [totalPresencas, totalFaltas],
        backgroundColor: ["#4CAF50", "#F44336"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const dataset = context.dataset;
            const total = dataset.data.reduce((a: number, b: number) => a + b, 0);
            const value = context.parsed;
            const percent = total ? ((value * 100) / total).toFixed(1) : 0;
            return `${context.label}: ${percent}%`;
          },
        },
      },
    },
  };

  return (
    <Box>
      <h2 className="titulo-resumo" style={{ textAlign: "center", marginBottom: "20px"}}>
        Resumo de Presenças por Curso
      </h2>
      <Box className="filtros-container">
        <FormControl sx={{ minWidth: 120 }} variant="outlined">
          <InputLabel shrink id="mes-label">Mês</InputLabel>
          <Select
          labelId="mes-label"
            value={mesSelecionado}
            onChange={(e) => setMesSelecionado(Number(e.target.value))}
          >
            {meses.map((mes, index) => (
              <MenuItem key={index} value={index + 1}>
                {mes}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <InputLabel>Curso</InputLabel>
          <Select
            value={cursoSelecionado}
            onChange={(e) => setCursoSelecionado(e.target.value)}
          >
            {cursos.map((curso) => (
              <MenuItem key={curso} value={curso}>
                {curso.charAt(0).toUpperCase() + curso.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box className="grafico-container">
        <Doughnut data={data} options={options} />
      </Box>
    </Box>
  );
};

export default ResumoPresencas;
