const express = require("express");
const {
    listarProducao,
    adicionarProducao,
    setMachineMap,
    getMachineMap,
    listarDadosFuncionario,
    listarNomesFuncionarios,
    getLotesRemessas,
    addRemessa,
    addLote,
    carregarUltimoRegistro
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

// Novas rotas para remessas e lotes
router.get("/remessas", getLotesRemessas);
router.post("/remessas", addRemessa);
router.post("/remessas/:remessaId/lotes", addLote);

// Rota para carregar o último registro de um funcionário
router.get("/ultimo-registro", carregarUltimoRegistro);

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
