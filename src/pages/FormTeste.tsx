import { useForm } from "react-hook-form";

type FormTesteData = {
  nome: string;
  idade: string;
};

const FormTeste = () => {
  const { register, handleSubmit } = useForm<FormTesteData>();

  const onSubmit = (data: FormTesteData) => {
    console.log("📤 Dados recebidos no console:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>Nome:</label>
      <input {...register("nome")} />

      <label>Idade:</label>
      <input {...register("idade")} />

      <button type="submit">Enviar</button>
    </form>
  );
};

export default FormTeste;
