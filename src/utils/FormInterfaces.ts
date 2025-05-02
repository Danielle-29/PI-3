import * as yup from "yup";

interface FormData {
  nomeCompleto: string;
  dataNascimento: string;
  idade: string;
  estadoCivil: string;
  genero: string;
  orientacaoSexual?: string;
  nomeMae: string;
  nomePai?: string;
  nacionalidade: string;
  naturalidade: string;
  corEtnia: string;
  situacaoOcupacional?: string;
  saude?: string;
  matricula?: string;
  endereco: {
    rua: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    uf: string;
    cep: string;
    telefone1: string;
    email: string;
    documento?: string;
  };
  responsavel: {
    nome?: string;
    cpf?: string;
    rg?: string;
    telefoneContato?: string;
  };
}

const schema = yup.object().shape({
  nomeCompleto: yup.string().required("Nome é obrigatório"),
  dataNascimento: yup
    .string()
    .required("Informe a data de nascimento do aluno"),
  idade: yup.string().required("Informe a idade do aluno"),
  estadoCivil: yup.string().required("Estado civil é obrigatório"),
  genero: yup.string().required("Gênero é obrigatório"),
  nomeMae: yup.string().required("Nome da mãe é obrigatório"),
  nomePai: yup.string(),
  nacionalidade: yup.string().required("Nacionalidade é obrigatória"),
  naturalidade: yup.string().required("Naturalidade é obrigatória"),
  corEtnia: yup.string().required("Cor/etnia é obrigatória"),
  situacaoOcupacional: yup.string(),
  saude: yup.string(),
  matricula: yup.string(),
  endereco: yup.object().shape({
    rua: yup.string().required("Rua é obrigatória"),
    bairro: yup.string().required("Bairro é obrigatório"),
    cidade: yup.string().required("Cidade é obrigatória"),
    uf: yup.string().required("UF é obrigatória"),
    cep: yup.string().required("CEP é obrigatório"),
    telefone1: yup.string().required("Telefone 1 é obrigatório"),
    email: yup.string().email().required("Email é obrigatório"),
    documento: yup.string(),
  }),
  responsavel: yup.object().shape({
    nome: yup.string(),
    cpf: yup.string(),
    rg: yup.string(),
    telefoneContato: yup.string(),
  }),
});

export { schema };
export type { FormData };
