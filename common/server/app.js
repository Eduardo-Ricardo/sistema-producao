const express = require("express");
const cors = require("cors");
const path = require("path");

// Importar as rotas dos módulos
const producaoRoutes = require("../../producao/controllers/routes");
const fluxoCaixaRoutes = require("../../fluxo-caixa/controllers/routes");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos do módulo common
app.use(express.static(path.join(__dirname, "../public")));

// Servir arquivos estáticos do módulo producao
app.use('/producao', express.static(path.join(__dirname, "../../producao/public")));

// Servir arquivos estáticos do módulo fluxo-caixa
app.use('/fluxo-caixa', express.static(path.join(__dirname, "../../fluxo-caixa/public")));

// Definir rotas de cada módulo
app.use("/producao", producaoRoutes);
app.use("/fluxo-caixa", fluxoCaixaRoutes);

// Rota principal
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`[LOG] Servidor rodando em http://localhost:${PORT}`);
});
