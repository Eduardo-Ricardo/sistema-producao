const express = require("express");
const {
    listarProducao,
    adicionarProducao,
    setMachineMap,
    getMachineMap,
    listarDadosFuncionario,
    listarNomesFuncionarios,
} = require("../controllers/producaoController");

const router = express.Router();

// Rota para listar registros de produção
router.get("/dados", listarProducao);

// Rota para adicionar um registro de produção
router.post("/salvar", adicionarProducao);

// Rota para salvar o machineMap
router.post("/setMachineMap", setMachineMap);

// Rota para carregar o machineMap
router.get("/getMachineMap", getMachineMap);

// Rota para listar dados de um funcionário específico
router.get("/dados-funcionario", listarDadosFuncionario);

// Rota para listar os nomes dos funcionários
router.get("/nomes-funcionarios", listarNomesFuncionarios);

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
