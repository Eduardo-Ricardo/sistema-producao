const express = require("express");
const {
    listarProducao,
    adicionarProducao,
    salvarMachineMap,
    carregarMachineMap,
} = require("./producaoController");

const router = express.Router();

// Rota para listar registros de produção
router.get("/dados", listarProducao);

// Rota para adicionar um registro de produção
router.post("/salvar", adicionarProducao);

// Rota para salvar o machineMap
router.post("/salvarMachineMap", salvarMachineMap);

// Rota para carregar o machineMap
router.get("/carregarMachineMap", carregarMachineMap);

// Rota de teste
router.get("/teste", (req, res) => {
    console.log("[LOG] Rota de teste chamada no módulo Produção");
    res.json({ message: "Rota de teste executada com sucesso!" });
});

// Rota principal do módulo Produção
router.get("/", (req, res) => {
    res.send("Bem-vindo ao módulo Produção!");
});

module.exports = router;
