const fs = require("fs");
const { get } = require("http");
const path = require("path");
const csv = require("csv-parser");
const { setMachineMap, getMachineMap } = require("./machineMapController");
const { getLotesRemessas, addRemessa, addLote } = require("./lotesController");
const { lerArquivoCSV } = require("../utils/fileUtils");
const { loadCsv } = require("./fileService");
const { filterByEmployee } = require("./filterService");
const { mapToDomain, groupByDate, aggregateByFunction } = require("./transformService");

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

// Função para adicionar um registro de produção
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
            atualizarQuantidadesLotes(lotes);
        }

        res.json({ message: "Produção registrada com sucesso!" });
    } catch (error) {
        console.error("[ERRO] Falha ao salvar os dados no arquivo:", error);
        res.status(500).json({ error: "Erro ao salvar os dados!" });
    }
}

// Função auxiliar para atualizar as quantidades dos lotes após uso
function atualizarQuantidadesLotes(lotesUsados) {
    console.log("[LOG] Atualizando quantidades dos lotes após uso...");

    try {
        const lotesRemessas = JSON.parse(fs.readFileSync(lotesRemessasPath, "utf8"));
        let atualizou = false;

        lotesRemessas.remessas.forEach(remessa => {
            if (remessa.lotes) {
                remessa.lotes.forEach(lote => {
                    const loteUsado = lotesUsados.find(l => 
                        l.tamanho === lote.tamanho && 
                        l.numero === lote.numero
                    );
                    
                    if (loteUsado) {
                        lote.quantidade = Math.max(0, lote.quantidade - loteUsado.quantidade);
                        atualizou = true;
                    }
                });
            }
        });

        if (atualizou) {
            fs.writeFileSync(lotesRemessasPath, JSON.stringify(lotesRemessas, null, 2));
            console.log("[LOG] Quantidades dos lotes atualizadas com sucesso.");
        }
    } catch (error) {
        console.error("[ERRO] Falha ao atualizar quantidades dos lotes:", error);
    }
}

// Função para carregar o último registro de um funcionário
function carregarUltimoRegistro(req, res) {
    console.log("[LOG] Iniciando a função carregarUltimoRegistro...");
    const { employeeName } = req.query;

    if (!employeeName) {
        console.warn("[AVISO] Nome do funcionário não fornecido.");
        return res.status(400).json({ error: "O nome do funcionário é obrigatório!" });
    }

    console.log(`[LOG] Nome do funcionário recebido: ${employeeName}`);

    const nomeArquivo = `${new Date().getFullYear()}.csv`;
    const caminhoArquivo = path.join(pastaDados, nomeArquivo);

    if (!fs.existsSync(caminhoArquivo)) {
        console.warn(`[AVISO] Arquivo ${nomeArquivo} não encontrado no caminho ${caminhoArquivo}.`);
        return res.status(404).json({ error: "Nenhum registro encontrado!" });
    }

    try {
        console.log(`[LOG] Lendo o arquivo: ${caminhoArquivo}`);
        const dados = fs.readFileSync(caminhoArquivo, "utf-8");
        const linhas = dados.split("\n").filter(linha => linha.trim() !== "");
        console.log(`[LOG] Total de linhas lidas: ${linhas.length}`);

        const registros = linhas.map(linha => {
            const [employeeName, employeeRole, startTime, endTime, productionCount, productionDate] = linha.split(",");
            return {
                employeeName: employeeName.trim(),
                employeeRole: employeeRole.trim(),
                startTime: startTime.trim(),
                endTime: endTime.trim(),
                productionCount: parseInt(productionCount.trim(), 10),
                productionDate: productionDate.trim()
            };
        }).filter(registro => registro.employeeName === employeeName);

        console.log(`[LOG] Registros filtrados para o funcionário ${employeeName}:`, registros);

        if (registros.length === 0) {
            console.warn(`[AVISO] Nenhum registro encontrado para o funcionário ${employeeName}.`);
            return res.status(404).json({ error: "Nenhum registro encontrado para o funcionário!" });
        }

        const registroMaisRecente = registros.reduce((maisRecente, registro) => {
            const [dia, mes] = registro.productionDate.split("/").map(Number);
            const dataAtual = new Date(new Date().getFullYear(), mes - 1, dia);
            const [diaMaisRecente, mesMaisRecente] = maisRecente.productionDate.split("/").map(Number);
            const dataMaisRecente = new Date(new Date().getFullYear(), mesMaisRecente - 1, diaMaisRecente);

            return dataAtual > dataMaisRecente ? registro : maisRecente;
        });

        console.log(`[LOG] Registro mais recente encontrado:`, registroMaisRecente);
        res.json(registroMaisRecente);
    } catch (error) {
        console.error("[ERRO] Falha ao processar o arquivo:", error);
        res.status(500).json({ error: "Erro ao processar os dados!" });
    }
}

// Função para listar dados de um funcionário específico
async function listarDadosFuncionario(req, res) {
    console.log("[LOG] Iniciando listagem dos dados do funcionário...");

    const funcionario = req.query.funcionario;
    console.log("[LOG] Nome do funcionário recebido:", funcionario);

    try {
        const year = new Date().getFullYear();
        const registros = await loadCsv(year);
        const filtrados = filterByEmployee(registros, funcionario);
        const domain = mapToDomain(filtrados);
        const registrosAgrupados = groupByDate(domain);
        const totaisPorFuncao = aggregateByFunction(domain);

        res.json({
            registros: registrosAgrupados,
            funcoes: totaisPorFuncao
        });
    } catch (error) {
        console.error("[ERRO] Falha ao listar os dados do funcionário:", error);
        res.status(500).json({ error: "Erro ao listar os dados do funcionário!" });
    }
}

// Função para listar os nomes dos funcionários
async function listarNomesFuncionarios(req, res) {
    console.log("[LOG] Iniciando listagem dos nomes dos funcionários...");
    try {
        const year = new Date().getFullYear();
        const registros = await loadCsv(year);
        const nomes = [...new Set(registros.map(r => r.employeeName).filter(nome => nome && nome.trim()))];
        console.log("[LOG] Nomes dos funcionários extraídos e filtrados:", nomes);
        res.json(nomes);
    } catch (error) {
        console.error("[ERRO] Falha ao listar os nomes dos funcionários:", error);
        res.status(500).json({ error: "Erro ao listar os nomes dos funcionários!" });
    }
}

// Função para listar registros de produção
async function listarProducao(req, res) {
    try {
        const year = new Date().getFullYear();
        const registros = await loadCsv(year);
        res.json(registros);
    } catch (error) {
        console.error("[ERRO] Falha ao listar produção:", error);
        res.status(500).json({ error: "Erro ao listar produção!" });
    }
}

// Função para buscar registros de produção de um funcionário para o calendário
async function buscarRegistrosFuncionario(req, res) {
    console.log("[LOG] Iniciando busca de registros para o calendário...");
    const { employeeName } = req.query;

    if (!employeeName) {
        console.warn("[AVISO] Nome do funcionário não fornecido.");
        return res.status(400).json({ error: "O nome do funcionário é obrigatório!" });
    }

    console.log(`[LOG] Nome do funcionário recebido: ${employeeName}`);

    try {
        const year = new Date().getFullYear();
        const registros = await loadCsv(year);
        const filtrados = filterByEmployee(registros, employeeName);
        res.json({ registros: filtrados });
    } catch (error) {
        console.error("[ERRO] Falha ao buscar registros do funcionário:", error);
        res.status(500).json({ error: "Erro ao processar os dados!" });
    }
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
    buscarRegistrosFuncionario
};