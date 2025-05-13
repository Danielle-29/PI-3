<div align="center">

<p>Projeto Integrador para o curso de Tecnologia da Informação da Universidade Virtual do Estado de São Paulo (UNIVESP)</p>

### Otimizando dados do Centro de Idiomas do Centro de Formação Carlos Kopcak

<img align="center" width="100px" src="./src/assets/logo_kopcak.png" alt="Logotipo do Centro de Formação Carlos Kopcak"><br>

</div>

## Índice

  * [1. Proposta Atual](#1-proposta-atual)
  * [2. Tecnologias e Ferramentas Atuais](#2-tecnologias-e-ferramentas-atuais)
  * [3. Grupo Atual de Desenvolvedores](#3-grupo-atual-de-desenvolvedores)
  * [4. Melhorias Implementadas](#4-melhorias-implementadas)
  * [5. Histórico Anterior](#5-histórico-anterior)
      * [5.1. Contexto e Objetivo Inicial](#51-contexto-e-objetivo-inicial)
      * [5.2. Tecnologias Anteriores](#52-tecnologias-anteriores)
      * [5.3. Desenvolvedores Anteriores](#53-desenvolvedores-anteriores)
      * [5.4. Principais Funcionalidades Desenvolvidas](#54-principais-funcionalidades-desenvolvidas)

-----

## 1. Proposta Atual

Este projeto tem como objetivo aprimorar o software de organização de dados acadêmicos e administrativos para o Centro de Idiomas do Polo UAB Diadema, dando continuidade ao trabalho de 2024. A atual fase foca em tornar o software mais funcional conforme solicitação da Coordenadora do Centro para professores e coordenação, com foco em controle de chamada, gestão de alunos e visualização de dados por frequência com a visualização de informações consolidadas de forma simples e acessível. O antigo sistema baseado em Moodle apresentava limitações técnicas e dificuldades de navegação, principalmente para usuários com menos familiaridade com tecnologia.


A solução proposta foi redesenhar o sistema com foco na experiência do usuário, organizando perfis específicos para cada tipo de acesso (administração, professor e funcionário), com controle por autenticação. Foram desenvolvidas funcionalidades como a chamada digital com registro de conteúdo, cálculo automático de frequência por aluno. O desenvolvimento atual utiliza tecnologias modernas como React com TypeScript no front-end, Firebase (Firestore, Authentication e Cloud Functions) no back-end, e Material UI (MUI) para a interface visual, com foco em acessibilidade e integração contínua via Vercel.

### ✅ Requisitos Atendidos

**Requisitos Técnicos obrigatórios do PI 3:**
- [x] Uso de banco de dados (Firestore)
- [x] Uso de computação em nuvem (Firebase + Vercel)
- [x] Script web com framework (React + TypeScript)
- [x] Implementação de acessibilidade (contraste, foco, responsividade)
- [x] Controle de versão com Git e GitHub
- [x] Deploy em nuvem com acesso público (Vercel)
- [x] Testes (unitários com `ts-node` e manuais documentados)
- [x] Implementação de "entre API, análise de dados ou IoT" → ✅ API com operações Firestore (leitura/escrita de dados em tempo real)

**Requisitos Funcionais (solicitados pela coordenação):**
- [x] Substituir o uso do Moodle
- [x] Registro de presença com conteúdo por aula
- [x] Visualização de frequência por aluno e cálculo de percentual
- [x] Cadastro e gerenciamento de alunos e usuários
- [x] Separação de acesso por tipo de perfil
- [x] Alteração da paleta de cores da logo e site

-----

## 2. Tecnologias e Ferramentas Atuais

- React com TypeScript para o front-end;
- Firebase para autenticação, armazenamento (Firestore) e Cloud Functions;
- Material UI (MUI) para componentes visuais acessíveis e responsivos;
- Git/GitHub para controle de versão;
- Power BI para visualização de dados;
- Jest e testes manuais documentados;
- Vercel para deploy contínuo e hospedagem.


-----

## 3. Grupo Atual de Desenvolvedores

| Aluno                             | RA       |
| ------------------------------    | -------- |
| Alberto Ferreira Borges de Gouvea | 2207479  |
| Andre Luiz Gomes Martins          | 2218473  |
| Danielle Dos Santos Bonfim        | 2220085  |
| Edcarlos De Sousa Santos          | 2205440  |
| Fernando Barbosa Ferraz           | 2222816  |
| Luiz Antonio Mendes De Lima       | 23203395 |
| Sandra Maria Felix De Araujo      | 2222006  |
| Thais Stella Teixeira             | 1402571  |

-----

## 4. Melhorias Implementadas

- 🔐 Autenticação com Firebase e controle de acesso por perfil (admin, professor, funcionário)
- ✅ Tela de chamada com registro de presença e conteúdo (professor)
- 📊 Painel de frequência por aluno com cálculo de presença e botão de impressão (professor e admin)
- 📋 Tela de cadastro e gerenciamento de usuários e alunos (admin e funcionário)
- 🎨 Redesign visual com foco em contraste, responsividade e acessibilidade
- 🔍 Testes manuais documentados e testes unitários simples com `ts-node`
- 🚀 Deploy contínuo via Vercel com repositório público no GitHub

-----

## 5. Histórico Anterior

### 5.1. Contexto e Objetivo Inicial

O projeto inicial (2024) visava criar um software para organizar dados do Centro de Idiomas (alunos, professores, presença, materiais), substituindo processos manuais e arquivos dispersos. A primeira fase explorou o uso do Moodle como plataforma.

### 5.2. Tecnologias Anteriores

React com TypeScript;
CSS3;
Material UI (MUI);
VSCode;
Vercel;
Firebase (Authentication e Firestore).


### 5.3. Desenvolvedores Anteriores

Camila Nazaré Pereira Gonçalves (23208252), Danielle dos Santos Bonfim (2220085), Edcarlos de Sousa Santos (2205440), Fernando Caires Borges Gonçalves (23203515), Fernando Barbosa Ferraz (2222816), Maria Ana Lourenço Rocha (2228655), Sandra Maria Felix de Araujo (2222006), Thais Stella Teixeira (1402571).

### 5.4. Funcionalidades Desenvolvidas na Primeira Fase (2024)

Na etapa anterior do projeto, foram desenvolvidas funcionalidades iniciais para validar a proposta junto ao Centro de Formação, incluindo:

- Tela inicial com link de acesso ao Moodle
- Cadastro de usuários com perfis distintos e autenticação via Firebase
- Lista de presença básica com seleção de curso
- Painel estatístico com visualização de número de matrículas por idioma










