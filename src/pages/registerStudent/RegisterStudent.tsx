import { db } from "../../firebaseConfig";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormData, schema } from "../../utils/FormInterfaces";
import { cadastrarAluno } from "../../utils/firestoreService";
import { collection, getDocs } from "firebase/firestore";

import "./registerStudent.css";

const RegisterStudent: React.FC = () => {
  const [cursoMatriculado, setCursoMatriculado] = useState("");
  const [turma, setTurma] = useState("");
  const [turmasDisponiveis, setTurmasDisponiveis] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const carregarTurmas = async () => {
      if (!cursoMatriculado) return;
      const snapshot = await getDocs(collection(db, "cursos", cursoMatriculado, "turmas"));
      const turmas = snapshot.docs.map(doc => doc.id);
      setTurmasDisponiveis(turmas);
    };
    carregarTurmas();
  }, [cursoMatriculado]);

  const onSubmit = async (data: FormData) => {
    console.log("🚨 Enviando dados do formulário", data);

    try {
      await cadastrarAluno(cursoMatriculado, turma, data);
      setModalVisible(true);
      console.log("Aluno cadastrado com sucesso!", data);
    } catch (error) {
      console.error("Erro ao cadastrar aluno:", error);
    }
  };

  return (
    <div className="container-register">
      <h1 className="form-title">Formulário de Matrícula</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-centered">
          <div className="field-single">
            <label>Curso*</label>
            <select value={cursoMatriculado} onChange={(e) => setCursoMatriculado(e.target.value)} required>
              <option value="">Selecione</option>
              <option value="ingles">Inglês</option>
              <option value="espanhol">Espanhol</option>
            </select>
          </div>
          <div className="field-single">
            <label>Turma*</label>
            <select value={turma} onChange={(e) => setTurma(e.target.value)} required>
              <option value="">Selecione</option>
              {turmasDisponiveis.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {cursoMatriculado && turma && (
          <>
            <div className="double-field">
              <div>
                <label>Nome Completo*</label>
                <input {...register("nomeCompleto")} />
                {errors.nomeCompleto && <p className="errors">{errors.nomeCompleto.message}</p>}
              </div>
              <div>
                <label>Data de Nascimento*</label>
                <input type="date" {...register("dataNascimento")} />
                {errors.dataNascimento && <p className="errors">{errors.dataNascimento.message}</p>}
              </div>
            </div>

            <div className="double-field">
              <div>
                <label>Idade*</label>
                <input {...register("idade")} />
                {errors.idade && <p className="errors">{errors.idade.message}</p>}
              </div>
              <div>
                <label>Gênero*</label>
                <select {...register("genero")}>
                  <option value="">Selecione</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                </select>
                {errors.genero && <p className="errors">{errors.genero.message}</p>}
              </div>
            </div>

            <div className="double-field">
              <div>
                <label>Estado Civil*</label>
                <select {...register("estadoCivil")}>
                  <option value="">Selecione</option>
                  <option value="Solteiro(a)">Solteiro(a)</option>
                  <option value="Casado(a)">Casado(a)</option>
                  <option value="Divorciado(a)">Divorciado(a)</option>
                  <option value="Separado(a)">Separado(a)</option>
                </select>
                {errors.estadoCivil && <p className="errors">{errors.estadoCivil.message}</p>}
              </div>
              <div>
                <label>Nome da Mãe*</label>
                <input {...register("nomeMae")} />
                {errors.nomeMae && <p className="errors">{errors.nomeMae.message}</p>}
              </div>
            </div>

            <div className="double-field">
              <div>
                <label>Nome do Pai</label>
                <input {...register("nomePai")} />
              </div>
              <div>
                <label>Nacionalidade*</label>
                <input {...register("nacionalidade")} />
                {errors.nacionalidade && <p className="errors">{errors.nacionalidade.message}</p>}
              </div>
            </div>

            <div className="double-field">
              <div>
                <label>Naturalidade*</label>
                <input {...register("naturalidade")} />
                {errors.naturalidade && <p className="errors">{errors.naturalidade.message}</p>}
              </div>
              <div>
                <label>Cor/Etnia*</label>
                <input {...register("corEtnia")} />
                {errors.corEtnia && <p className="errors">{errors.corEtnia.message}</p>}
              </div>
            </div>

            <div className="double-field">
              <div>
                <label>Situação Ocupacional</label>
                <input {...register("situacaoOcupacional")} />
              </div>
              <div>
                <label>Saúde</label>
                <textarea {...register("saude")} />
              </div>
            </div>

            <div className="double-field">
              <div>
                <label>Rua*</label>
                <input {...register("endereco.rua")} />
              </div>
              <div>
                <label>Complemento</label>
                <input {...register("endereco.complemento")} />
              </div>
            </div>

            <div className="double-field">
              <div>
                <label>Bairro*</label>
                <input {...register("endereco.bairro")} />
              </div>
              <div>
                <label>Cidade*</label>
                <input {...register("endereco.cidade")} />
              </div>
            </div>

            <div className="double-field">
              <div>
                <label>UF*</label>
                <input {...register("endereco.uf")} />
              </div>
              <div>
                <label>CEP*</label>
                <input type="text" {...register("endereco.cep")} />
              </div>
            </div>

            <div className="double-field">
              <div>
                <label>Telefone*</label>
                <input type="tel" {...register("endereco.telefone1")} />
              </div>
              <div>
                <label>Email*</label>
                <input type="email" {...register("endereco.email")} />
              </div>
            </div>

            <div className="double-field">
              <div>
                <label>Documento</label>
                <input {...register("endereco.documento")} />
              </div>
              <div>
                <label>Matrícula</label>
                <input {...register("matricula")} />
              </div>
            </div>

            <div className="form-section">
              <p className="titulos"><strong>Responsável</strong> <span>(Preencher se menor de idade)</span></p>
              <div className="double-field">
                <div>
                  <label>Nome</label>
                  <input {...register("responsavel.nome")} />
                </div>
                <div>
                  <label>CPF</label>
                  <input {...register("responsavel.cpf")} />
                </div>
              </div>
              <div className="double-field">
                <div>
                  <label>RG</label>
                  <input {...register("responsavel.rg")} />
                </div>
                <div>
                  <label>Telefone para Contato</label>
                  <input {...register("responsavel.telefoneContato")} />
                </div>
              </div>
            </div>

            <div className="form-footer">
              <button aria-label="cadastrar aluno" type="submit" className="btn-submit">CADASTRAR</button>
            </div>
          </>
        )}
      </form>

      {modalVisible && (
        <div className="modal">
          <div className="modal-content">
            <p>Aluno cadastrado com sucesso!</p>
            <button aria-label="modal cadastro realizado" onClick={() => setModalVisible(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterStudent;
