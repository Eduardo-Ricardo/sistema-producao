const express = require("express");
const cors = require("cors");
const path = require("path");
const routes = require("./routes"); // Importar as rotas dos módulos

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Definição das rotas 
app.use("/", routes);

// Servir arquivos estáticos do módulos
app.use(express.static(path.join(__dirname, "public")));
app.use('/producao', express.static(path.join(__dirname, "../producao/public")));
app.use('/fluxo-caixa', express.static(path.join(__dirname, "../fluxo-caixa/public")));

// Rota principal
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`[LOG] Servidor rodando em http://localhost:${PORT}`);
});
