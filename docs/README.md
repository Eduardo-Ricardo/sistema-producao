# PLATAFORMA UNIFICADA DE GESTÃO

## 📌 Visão Geral

Este projeto unificado tem como objetivo centralizar diversas funções essenciais para a gestão da produção e do fluxo de caixa de uma confecção. Ele abrange:

- **Registro de Produção Diária:** Cadastro, visualização, filtros e análise dos dados de produção.

- **Fluxo de Caixa:** (Funcionalidade futura) Registro e análise financeira da empresa.

- **Análises Avançadas:** Média diária, semanal, comparações entre funcionários, metas e gráficos.

**Backend:** Node.js (único backend para todas as funcionalidades).  
**Frontend:** HTML, CSS, JavaScript (com possibilidade de integração com frameworks modernos).  
**Outras Tecnologias:** CSV para armazenamento de dados, integração com Git e CI/CD planejada para o futuro.

## 🚀 Funcionalidades

### 🔹 Implementadas:

- **Geral**
- Menu principal para navegação
- Repositório no GitHub
- Botão para inicializar o servidor automaticamente
---
- **sistema-produção**
- Interface para entrada de dados
- Interface para visualizar dados salvos com filtros (por Funcionário, Função, Dia, Semana, Mês)
- Separação dos registros por ano em arquivos CSV
---
- **sistema-caixa**
- interface de entrada de dados e visualização


### 🔹 Em andamento:

- **Geral**
- Criar pasta "docs" para documentação do sistema
- Atualizar README.md 
- Modularizar proeto e reorganizar diretórios seguindo modelo "monorepo" 
---
- **sistema-produção**
- Otimizar interface de visualização
- Criar sistema para analise de dados  
    - Média diária
    - Média semanal
    - Comparação entre funcionários
    - Adicionar meta
    - Gráfico 
---
- **sistema-caixa**
- Otimizar interface de visualização
- Adicionar funções backend (Salvar, Visualizar, Editar, Excluir)

## 📂 Estrutura do Projeto

<!-- 
ALT + 195 → ├
ALT + 196 → ─
ALT + 179 → │
ALT + 192 → └ 
├── 📂 
-->

```

📁 PLATAFORMA UNIFICADA DE GESTÃO
|
├── 📂 common 
│   ├── 📂 public                 # Arquivos estáticos (HTML, CSS, JS).
│   |    └── menu.html              # Novo menu principal.
│   │
│   └── 📂 server                 # Código do backend
│        └── app.js                 # Servidor Node.js
│    
├── 📂 fluxo-caixa \ nodejs-app
│   ├── 📂 node_modules           # Biblioteca node.
│   ├── 📂 public                 # Arquivos estáticos (HTML, CSS, JS).
│   │    └── caixa.html             # Página de entrada de dados.
|   │
│   ├── 📂 server                     # Código do backend
│   |    ├── 📂 data               # Pasta com arquivos banco de dados
│   │    └── app.js                  # Servidor Node.js
|   │
│   ├── package-lock.json           
│   ├── package.json                # Dependências do Node.js
│   └── README.md    # Documentação da interface
|   
├── 📂 producao \ nodejs-app
│   ├── 📂 node_modules           # Biblioteca node.
│   ├── 📂 public                 # Arquivos estáticos (HTML, CSS, JS).
│   │    ├── registrar.html         # Página de entrada de dados.
│   │    ├── visualizar.html        # Página de visualização.    
|   │    ├── style.css              # Estilos gerais
│   │    └── script.js              # Funções JS globais
|   │
│   ├── 📂 server                     # Código do backend
│   |    ├── 📂 controllers        # Lógica de manipulação dos dados
│   |    ├── 📂 data               # Pasta com arquivos banco de dados
│   │    ├── app.js                  # Servidor Node.js
│   │    └── routes.js               # Rotas separadas 
|   │
│   ├── package-lock.json           
│   ├── package.json                # Dependências do Node.js
│   └── README.md    # Documentação da interface
|   
|
└── 📂 docs                   # Documentação do projeto
    ├── roadmap.md             # Roadmap atualizado e planejamento futuro
    ├── architecture.md        # Arquitetura e diagramas do sistema
    ├── guidelines.md          # Padrões de codificação, testes e práticas recomendadas
    └── README.md        # Documentação geral do projeto



```

## 📋 Como Usar

### 🔹 1. Instalar Dependências

#### Para a parte Node.js:

```sh
cd nodejs-app
npm install
```

#### Para a parte Python:

```sh
cd python-backend
pip install -r requirements.txt
```

### 🔹 2. Executar o Sistema

#### Para rodar a interface e o servidor (Node.js):

```sh
cd nodejs-app
node app.js
```

#### Para processar os dados (Python):

```sh
cd python-backend
python main.py
```

### 🔹 3. Acessar a Interface

- **Para registrar produção:** Abra `index.html` no navegador.
- **Para visualizar os registros salvos:** Abra `visualizar.html` no navegador.

## 📝 Notas de Desenvolvimento

📌 Última atualização: **14/03/2025**

📌 Últimas alterações:

- Criada interface para visualizar os registros.
- Melhorada a validação de dados antes do salvamento.

📌 Próximos passos:

- Criar um menu principal para acesso rápido às interfaces.
- Melhorar o design das interfaces.
- Criar um botão para iniciar o servidor automaticamente.

## 🛠 Tecnologias Utilizadas

- **Node.js** (entrada de dados e salvamento em CSV)
- **Express.js** (servidor web para comunicação entre a interface e o backend)
- **Python** (análise e cálculos)
- **CSV** (armazenamento dos registros)

---

Este README será atualizado conforme o projeto avança. Caso fique muito tempo sem mexer, volte aqui para relembrar o progresso! 🚀

