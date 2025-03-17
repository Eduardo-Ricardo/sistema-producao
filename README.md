# Sistema de Registro de Produção Diária

## 📌 Visão Geral

Este projeto tem como objetivo registrar a produção diária dos funcionários, armazenando os dados em arquivos CSV organizados por mês e realizando análises estatísticas.

- **Node.js**: Interface para entrada de dados, salvamento em CSV e visualização.
- **Python**: Processamento e análise dos dados (média de produção por funcionário, comparações entre períodos, etc.).

## 🚀 Funcionalidades

### 🔹 Implementadas:

- Interface para entrada de dados
- Interface para visualizar dados salvos
- Criar Menu principal
- Criar repositório no GitHub
- Separação dos registros por ano em arquivos CSV 

### 🔹 Em andamento:

- Otimizar interface de entrada e de visualização de dados
- Criar botão para inicializar o servidor automaticamente

## 📂 Estrutura do Projeto

```
📁 sistema-producao
├── 📂 nodejs-app   # Interface e registro dos dados.
|   |
│   ├── 📂 node_modules   # ?????????
│   |
│   ├── 📂 public   # Arquivos estáticos (HTML, CSS, JS).
|   |    ├── menu.html   # Novo menu principal.
|   |    ├── index.html   # Página de entrada de dados.
|   |    ├── visualizar.html   # Página de visualização.    
|   |    ├── style.css   # Estilos gerais
|   |    └── script.js   # Funções JS globais
|   | 
│   ├── 📂 server        # Código do backend
|   │   ├── app.js       # Servidor Node.js
|   │   ├── routes.js    # Rotas separadas
│   |   ├── 📂 controllers  # Lógica de manipulação dos dados
│   |   └── 📂 data         # Pasta com arquivos CSV organizados
|   |
│   ├── package-lock.json # ???????
│   ├── package.json # Dependências do Node.
|   └── README.md   # Documentação da interface
├── 📂 python-backend # Processamento e análise de dados
│   ├── main.py      # Código principal em Python
│   ├── analysis.py  # Funções de cálculo e comparação
│   └── requirements.txt # Dependências do Python
|
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

