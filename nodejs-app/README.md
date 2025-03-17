# Interface do Sistema de Produção Diária

## 📌 Visão Geral

Esta interface web permite o registro e a visualização da produção diária dos funcionários.

- **Registro de Produção:** Através da página `index.html`, os usuários podem inserir informações sobre a produção diária.
- **Visualização de Registros:** A página `visualizar.html` permite consultar os registros salvos no banco de dados CSV.

## 🚀 Funcionalidades

### 🔹 Implementadas:

- Formulário para entrada de dados.
- Envio dos dados ao servidor Node.js.
- Exibição dos registros salvos na tabela.
- Atualização automática da tabela ao carregar a página.

### 🔹 Em andamento:

- Melhorar a interface gráfica para melhor usabilidade.
- Criar um menu de navegação entre as páginas.
- Criar um botão para iniciar o servidor automaticamente.

## 📂 Estrutura da Interface

```
📁 nodejs-app
├── index.html       # Página de entrada de dados
├── visualizar.html  # Página para visualizar registros
├── script.js        # Código para envio e carregamento de dados
├── style.css        # Estilos da interface
└── app.js           # Servidor backend em Node.js
```

## 📋 Como Usar

### 🔹 1. Iniciar o Servidor

Para garantir que os dados sejam processados corretamente, o servidor deve estar rodando.

```sh
cd nodejs-app
node app.js
```

### 🔹 2. Acessar as Páginas

- **Registro de Produção:** Abra `index.html` no navegador.
- **Visualização dos Registros:** Abra `visualizar.html` no navegador.

### 🔹 3. Registrar Produção

1. Preencha os campos obrigatórios no `index.html`.
2. Clique em "Registrar Produção".
3. Aguarde a mensagem de sucesso.

### 🔹 4. Consultar Registros

1. Acesse `visualizar.html`.
2. Clique no botão "Atualizar Dados" para carregar as informações mais recentes.

## 📝 Notas de Desenvolvimento

📌 Última atualização: **(coloque a data da última modificação)**

📌 Últimas alterações:

- Criada interface para visualizar registros.
- Ajustado o formato dos arquivos CSV.
- Melhorada a validação dos dados antes do envio.

📌 Próximos passos:

- Criar um menu de navegação.
- Melhorar o design da interface.
- Criar um botão para inicializar o servidor diretamente da interface.

## 🛠 Tecnologias Utilizadas

- **HTML/CSS/JavaScript** (interface gráfica e interatividade)
- **Node.js e Express.js** (backend para manipulação dos dados)
- **CSV** (armazenamento dos registros)

---

Este README será atualizado conforme melhorias forem implementadas. 🚀

