import React, { useEffect } from 'react';
import { enviarDadosParaSubcolecoes } from '../utils/firestoreService';  // Importa a nova função para subcoleções

const ChamadaFirestore: React.FC = () => {
  useEffect(() => {
    enviarDadosParaSubcolecoes();  // Chama a função para enviar os dados
  }, []);

  return (
    <div aria-live='polite' role='status'>
      <h1>Enviando dados para o Firestore...</h1>
    </div>
  );
};

export default ChamadaFirestore;
