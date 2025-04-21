const express = require("express");
const router = express.Router();

// Importar as rotas dos módulos
const producaoRoutes = require("../producao/routes");
const fluxoCaixaRoutes = require("../fluxo-caixa/controllers/routes");

// Definir rotas de cada módulo
router.use("/producao", producaoRoutes);
router.use("/fluxo-caixa", fluxoCaixaRoutes);

module.exports = router;