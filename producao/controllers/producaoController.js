const fs = require("fs");
const path = require("path");

// Caminho da pasta "data" e arquivos
const pastaDados = path.join(__dirname, "../data");
const machineMapPath = path.join(pastaDados, "machineMap.json");

// Garante que a pasta "data" exista
function garantirPastaDados() {
    if (!fs.existsSync(pastaDados)) {
        console.log("[LOG] Pasta 'data' não encontrada. Criando...");
        fs.mkdirSync(pastaDados, { recursive: true });
    } else{
        console.log("[LOG] Pasta 'data' já existe.");
    }
}

// Função para listar registros de produção
function listarProducao(req, res) {
    garantirPastaDados(); // Garante que a pasta exista antes de acessar o arquivo

    const nomeArquivo = `${new Date().getFullYear()}.csv`;
    const caminhoArquivo = path.join(pastaDados, nomeArquivo);

    console.log("[LOG] Tentando ler o arquivo:", caminhoArquivo);

    if (!fs.existsSync(caminhoArquivo)) {
        return res.status(404).json({ error: "Arquivo não encontrado!" });
    }

    try {
        const dados = fs.readFileSync(caminhoArquivo, "utf-8");
        const linhas = dados.split("\n").filter(linha => linha.trim() !== "");
        const registros = linhas.map(linha => {
            const [employeeName, employeeRole, startTime, endTime, productionCount, productionDate] = linha.split(",");
            return { employeeName, employeeRole, startTime, endTime, productionCount, productionDate };
        });

        res.json(registros);
    } catch (error) {
        console.error("[ERRO] Falha ao ler o arquivo:", error);
        res.status(500).json({ error: "Erro ao ler o arquivo de produção!" });
    }
}

// Função para adicionar um registro de produção
function adicionarProducao(req, res) {
    garantirPastaDados(); // Garante que a pasta exista antes de acessar o arquivo

    const { employeeName, employeeRole, startTime, endTime, productionCount, productionDate } = req.body;

    console.log("[LOG] Dados recebidos para registro:", req.body);

    if (!employeeName || !employeeRole || !startTime || !endTime || !productionCount || !productionDate) {
        return res.status(400).json({ error: "Preencha todos os campos!" });
    }

    const linha = `${employeeName},${employeeRole},${startTime},${endTime},${productionCount},${productionDate}\n`;
    const nomeArquivo = `${new Date().getFullYear()}.csv`;
    const caminhoArquivo = path.join(pastaDados, nomeArquivo);

    try {
        fs.appendFileSync(caminhoArquivo, linha);
        console.log("[LOG] Produção registrada com sucesso.");
        res.json({ message: "Produção registrada com sucesso!" });
    } catch (error) {
        console.error("[ERRO] Falha ao salvar os dados no arquivo:", error);
        res.status(500).json({ error: "Erro ao salvar os dados!" });
    }
}

// Função para carregar o último registro de um funcionário
function carregarUltimoRegistro(req, res) {
    const { employeeName } = req.query;

    if (!employeeName) {
        return res.status(400).json({ error: "O nome do funcionário é obrigatório!" });
    }

    const nomeArquivo = `${new Date().getFullYear()}.csv`;
    const caminhoArquivo = path.join(pastaDados, nomeArquivo);

    if (!fs.existsSync(caminhoArquivo)) {
        return res.status(404).json({ error: "Nenhum registro encontrado!" });
    }

    try {
        const dados = fs.readFileSync(caminhoArquivo, "utf-8");
        const linhas = dados.split("\n").filter(linha => linha.trim() !== "");
        const registros = linhas.map(linha => {
            const [employeeName, employeeRole, startTime, endTime, productionCount, productionDate] = linha.split(",");
            return { employeeName, employeeRole, startTime, endTime, productionCount, productionDate };
        }).filter(registro => registro.employeeName === employeeName);

        if (registros.length === 0) {
            return res.status(404).json({ error: "Nenhum registro encontrado para o funcionário!" });
        }

        res.json(registros[registros.length - 1]);
    } catch (error) {
        console.error("[ERRO] Falha ao ler o arquivo:", error);
        res.status(500).json({ error: "Erro ao ler o arquivo de produção!" });
    }
}

// Função para salvar o machineMap
function salvarMachineMap(req, res) {
    garantirPastaDados(); // Garante que a pasta exista antes de acessar o arquivo

    const machineMap = req.body;

    console.log("[LOG] Salvando machineMap:", machineMap);

    try {
        fs.writeFileSync(machineMapPath, JSON.stringify(machineMap, null, 2));
        console.log("[LOG] Machine map salvo com sucesso!");
        res.json({ message: "Machine map salvo com sucesso!" });
    } catch (error) {
        console.error("[ERRO] Falha ao salvar o machineMap:", error);
        res.status(500).json({ error: "Erro ao salvar o machineMap!" });
    }
}

// Função para carregar o machineMap
function carregarMachineMap(req, res) {
    garantirPastaDados(); // Garante que a pasta exista antes de acessar o arquivo

    console.log("[LOG] Carregando machineMap...");
    console.log("[LOG] Caminho do arquivo machineMap.json:", machineMapPath);

    if (!fs.existsSync(machineMapPath)) {
        console.warn("[AVISO] Arquivo machineMap.json não encontrado. Criando arquivo vazio...");
        fs.writeFileSync(machineMapPath, JSON.stringify({}));
    }

    try {
        const machineMap = JSON.parse(fs.readFileSync(machineMapPath, "utf8"));
        res.json(machineMap);
    } catch (error) {
        console.error("[ERRO] Falha ao carregar o machineMap:", error);
        res.status(500).json({ error: "Erro ao carregar o machineMap!" });
    }
}

module.exports = {
    listarProducao,
    adicionarProducao,
    carregarUltimoRegistro,
    salvarMachineMap,
    carregarMachineMap,
};