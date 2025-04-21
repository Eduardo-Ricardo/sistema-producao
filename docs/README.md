# Sistema de Gestão de Produção e Fluxo de Caixa

## Visão Geral

Este projeto consiste em um **sistema de gestão de produção** e **controle de fluxo de caixa** desenvolvido em módulos independentes, mas integrados. Seu objetivo principal é registrar, exibir e gerenciar a produção diária de funcionários, bem como controlar entradas e saídas financeiras da empresa.

**Usuário final atual:**

- Desenvolvedor (fase de testes e validações).

## Estrutura do Projeto

O repositório está organizado em quatro pastas principais, cada uma com responsabilidades definidas:

```
📁 sistema-gestao
├── 📂 common/
├── 📂 producao/
├── 📂 fluxo-caixa/
├── 📂 docs/
└── IniciarServidor.bat
```

### common

- **Descrição:** Módulo principal do servidor Node.js e recursos compartilhados.
- **Conteúdo:**
  - `app.js` (inicialização do servidor)
  - `routes.js` (definição de rotas globais)
  - `public/` (HTML, CSS e JS comuns)

### producao

- **Descrição:** Registro e visualização de produção dos funcionários.
- **Conteúdo:**
  - `controllers/` (lógica de backend)
  - `data/` (arquivos CSV e mapeamento de máquinas)
  - `public/` (frontend específico de produção)
  - `routes/` (rotas de API)

### fluxo-caixa

- **Descrição:** Sistema de entrada e saída financeira.
- **Conteúdo:**
  - `controllers/routes.js` (rotas de fluxo de caixa)
  - `public/caixa.html` (interface básica)

### docs

- **Descrição:** Documentação do projeto.
- **Arquivos:** `roadmap.md`, `architecture.md`, `README.md` geral.

## Funcionalidades

### Implementadas

- **Módulo Produção**
  - Cadastro de produção via frontend.
  - Consulta e exibição de registros por funcionário, consumindo a API Node.js.

### Pendentes

- **Módulo Produção**
  - Tratar e renderizar corretamente os dados recebidos do servidor.
  - Refatorar interface para melhorar usabilidade e design.
- **Módulo Fluxo de Caixa**
  - Desenvolver backend em Node.js para persistência de dados financeiros.
  - Criar interface para registrar entradas e saídas.

## Tecnologias Utilizadas

- **Backend:** Node.js, Express.js
- **Frontend:** HTML5, CSS3, JavaScript
- **Banco de dados leve:** CSV para produção

## Instruções de Uso

1. **Instalar Dependências**
   ```bash
   # Exemplo para módulo Produção
   cd producao
   npm install
   ```
2. **Iniciar Servidor**
   ```bash
   cd common
   node app.js
   ```
   ou execute `IniciarServidor.bat` na raiz do projeto.
3. **Acessar Sistema**
   - Abra o navegador em `http://localhost:3000`.

## Problemas Conhecidos

- Interface funcional, mas necessita refatoração completa para melhor usabilidade.
- Backend do módulo Fluxo de Caixa ainda não implementado.
- Alguns filtros de dados não mostram resultados corretamente.

## Próximos Passos

1. Refatorar toda a interface de produção.
2. Implementar análises e relatórios avançados para o módulo produção.
3. Concluir backend e frontend do módulo fluxo de caixa.
4. Atualizar documentação detalhando endpoints e uso interno.

## Estrutura de Código Detalhada

```
📁 sistema-gestao
├── 📂 common
│   ├── app.js
│   ├── routes.js
│   └── public/
├── 📂 producao
│   ├── controllers/
│   ├── data/
│   ├── public/
│   ├── routes/
│   └── package.json
├── 📂 fluxo-caixa
│   ├── controllers/
│   ├── public/
│   └── package.json
├── 📂 docs
│   ├── roadmap.md
│   ├── architecture.md
│   └── README.md
└── IniciarServidor.bat
```

---

