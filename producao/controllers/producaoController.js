// producaoController.js
// Controller principal do módulo de produção
// Responsável por orquestrar as requisições HTTP, delegando a lógica de negócio para os serviços

const fs = require("fs");
const { get } = require("http");
const path = require("path");
const csv = require("csv-parser");
const { setMachineMap, getMachineMap } = require("./machineMapController");
const { getLotesRemessas, addRemessa, addLote } = require("./lotesController");
const { lerArquivoCSV } = require("../utils/fileUtils");
const { loadCsv } = require("../services/fileService");
const { filterByEmployee } = require("../services/filterService");
const { mapToDomain, groupByDate, aggregateByFunction } = require("../services/transformService");
const { getResumo, getCalendario } = require("../services/fichaFuncionarioService");
const { lerRegistrosAnoAtual, buscarUltimoRegistroFuncionario, buscarRegistrosFuncionarioService, listarProducaoService } = require("../services/registroService");
const { listarDadosFuncionarioService, listarNomesFuncionariosService } = require("../services/funcionarioService");
const { atualizarQuantidadesLotesService } = require("../services/loteService");

// Caminho da pasta "data" e arquivos
const pastaDados = path.join(__dirname, "../data");
const machineMapPath = path.join(pastaDados, "machineMap.json");
const lotesRemessasPath = path.join(pastaDados, "lotesRemessas.json");

// Garante que a pasta "data" exista
function garantirPastaDados() {
    if (!fs.existsSync(pastaDados)) {
        console.log("[LOG] Pasta 'data' não encontrada. Criando...");
        fs.mkdirSync(pastaDados, { recursive: true });
    } else{
        return true; // Retorna true para indicar que a pasta já existe
    }
}

/**
 * Adiciona um registro de produção (quantidade ou lote) ao CSV do ano atual.
 * Atualiza lotes se necessário.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
function adicionarProducao(req, res) {
    garantirPastaDados();

    const { employeeName, employeeRole, startTime, endTime, productionCount, productionDate, tipoEntrada, lotes } = req.body;

    console.log("[LOG] Dados recebidos para registro:", req.body);

    if (!employeeName || !employeeRole || !productionCount || !productionDate) {
        return res.status(400).json({ error: "Preencha os campos obrigatórios!" });
    }

    let linha;
    if (tipoEntrada === "lote") {
        // Se for entrada por lotes, registra os códigos dos lotes na linha
        const lotesCodigos = lotes.map(lote => `${lote.tamanho}${lote.numero}`).join("+");
        linha = `${employeeName},${employeeRole},${startTime},${endTime},${lotesCodigos},${productionDate}\n`;
    } else {
        // Se for entrada por quantidade, registra normalmente
        linha = `${employeeName},${employeeRole},${startTime},${endTime},${productionCount},${productionDate}\n`;
    }

    const nomeArquivo = `${new Date().getFullYear()}.csv`;
    const caminhoArquivo = path.join(pastaDados, nomeArquivo);

    try {
        fs.appendFileSync(caminhoArquivo, linha);
        console.log("[LOG] Produção registrada com sucesso.");
        
        // Se foi registrado por lotes, atualiza as quantidades nos lotes
        if (tipoEntrada === "lote" && lotes) {
            atualizarQuantidadesLotesService(lotes);
        }

        res.json({ message: "Produção registrada com sucesso!" });
    } catch (error) {
        console.error("[ERRO] Falha ao salvar os dados no arquivo:", error);
        res.status(500).json({ error: "Erro ao salvar os dados!" });
    }
}

/**
 * Controller: Carrega o último registro de um funcionário
 * Endpoint: GET /producao/ultimo-registro?employeeName=xxx
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
function carregarUltimoRegistro(req, res) {
    const { employeeName } = req.query;
    if (!employeeName) {
        return res.status(400).json({ error: "O nome do funcionário é obrigatório!" });
    }
    const registro = buscarUltimoRegistroFuncionario(employeeName);
    if (!registro) {
        return res.status(404).json({ error: "Nenhum registro encontrado para o funcionário!" });
    }
    res.json(registro);
}

/**
 * Controller: Lista dados de um funcionário específico
 * Endpoint: GET /producao/dados-funcionario?funcionario=xxx
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function listarDadosFuncionario(req, res) {
    console.log("[LOG] Iniciando listagem dos dados do funcionário...");
    const funcionario = req.query.funcionario;
    if (!funcionario) {
        return res.status(400).json({ error: "O nome do funcionário é obrigatório!" });
    }
    try {
        const resultado = await listarDadosFuncionarioService(funcionario);
        res.json(resultado);
    } catch (error) {
        console.error("[ERRO] Falha ao listar os dados do funcionário:", error);
        res.status(500).json({ error: "Erro ao listar os dados do funcionário!" });
    }
}

/**
 * Controller: Lista nomes únicos de funcionários
 * Endpoint: GET /producao/nomes-funcionarios
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function listarNomesFuncionarios(req, res) {
    try {
        const nomes = await listarNomesFuncionariosService();
        res.json(nomes);
    } catch (error) {
        console.error("[ERRO] Falha ao listar os nomes dos funcionários:", error);
        res.status(500).json({ error: "Erro ao listar os nomes dos funcionários!" });
    }
}

/**
 * Controller: Lista todos os registros de produção do ano atual
 * Endpoint: GET /producao/listar
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function listarProducao(req, res) {
    try {
        const registros = listarProducaoService();
        res.json(registros);
    } catch (error) {
        console.error("[ERRO] Falha ao listar produção:", error);
        res.status(500).json({ error: "Erro ao listar produção!" });
    }
}

/**
 * Controller: Busca registros de produção de um funcionário para o calendário
 * Endpoint: GET /producao/buscar-registros-funcionario?employeeName=xxx
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function buscarRegistrosFuncionario(req, res) {
    const { employeeName } = req.query;
    if (!employeeName) {
        return res.status(400).json({ error: "O nome do funcionário é obrigatório!" });
    }
    try {
        const registros = await buscarRegistrosFuncionarioService(employeeName);
        res.json({ registros });
    } catch (error) {
        console.error("[ERRO] Falha ao buscar registros do funcionário:", error);
        res.status(500).json({ error: "Erro ao processar os dados!" });
    }
}

/**
 * Retorna o resumo de produção do funcionário para um mês/ano.
 * Endpoint: GET /ficha-funcionario/resumo
 * Parâmetros: funcionario, mes, ano
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function resumoFichaFuncionario(req, res) {
    try {
        const { funcionario, mes, ano } = req.query;
        if (!funcionario || !mes || !ano) {
            return res.status(400).json({ error: "Parâmetros obrigatórios: funcionario, mes, ano" });
        }
        const resumo = await getResumo({ funcionario, mes, ano });
        res.json(resumo);
    } catch (error) {
        console.error("[ERRO] Falha ao gerar resumo da ficha do funcionário:", error);
        res.status(500).json({ error: "Erro ao gerar resumo da ficha do funcionário" });
    }
}

/**
 * Retorna o calendário de registros do funcionário para um mês/ano.
 * Endpoint: GET /ficha-funcionario/calendario
 * Parâmetros: funcionario, mes, ano
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function calendarioFichaFuncionario(req, res) {
    try {
        const { funcionario, mes, ano } = req.query;
        if (!funcionario || !mes || !ano) {
            return res.status(400).json({ error: "Parâmetros obrigatórios: funcionario, mes, ano" });
        }
        const calendario = await getCalendario({ funcionario, mes, ano });
        res.json(calendario);
    } catch (error) {
        console.error("[ERRO] Falha ao gerar calendário da ficha do funcionário:", error);
        res.status(500).json({ error: "Erro ao gerar calendário da ficha do funcionário" });
    }
}

/**
 * Calcula o número de dias úteis de um mês/ano (exclui sábados e domingos).
 * @param {number} mes - Mês (1-12)
 * @param {number} ano - Ano (ex: 2025)
 * @returns {number} Dias úteis
 */
function calcularDiasUteis(mes, ano) {
    let diasUteis = 0;
    const diasNoMes = new Date(ano, mes, 0).getDate();
    for (let dia = 1; dia <= diasNoMes; dia++) {
        const data = new Date(ano, mes - 1, dia);
        const diaSemana = data.getDay();
        if (diaSemana !== 0 && diaSemana !== 6) diasUteis++; // 0=Domingo, 6=Sábado
    }
    return diasUteis;
}

module.exports = {
    listarProducao,
    adicionarProducao,
    carregarUltimoRegistro,
    listarDadosFuncionario,
    listarNomesFuncionarios,
    getLotesRemessas,
    addRemessa,
    addLote,
    setMachineMap,
    getMachineMap,
    buscarRegistrosFuncionario,
    resumoFichaFuncionario,
    calendarioFichaFuncionario
};