const fs = require("fs");
const { get } = require("http");
const path = require("path");
const csv = require("csv-parser");

// Caminho da pasta "data" e arquivos
const pastaDados = path.join(__dirname, "../data");
const machineMapPath = path.join(pastaDados, "machineMap.json");

// Garante que a pasta "data" exista
function garantirPastaDados() {
    if (!fs.existsSync(pastaDados)) {
        console.log("[LOG] Pasta 'data' não encontrada. Criando...");
        fs.mkdirSync(pastaDados, { recursive: true });
    } else{
        return true; // Retorna true para indicar que a pasta já existe
    }
}

// Função genérica para ler e processar arquivos CSV
function lerArquivoCSV(caminhoArquivo, opcoesOuCallback) {
    if (!fs.existsSync(caminhoArquivo)) {
        throw new Error("Arquivo não encontrado!");
    }

    const resultados = [];
    const opcoes = typeof opcoesOuCallback === "function" ? {} : opcoesOuCallback || {};
    const callback = typeof opcoesOuCallback === "function" ? opcoesOuCallback : null;

    return new Promise((resolve, reject) => {
        fs.createReadStream(caminhoArquivo)
            .pipe(csv(opcoes))
            .on("data", (data) => {
                if (callback) {
                    if (callback(data)) resultados.push(data);
                } else {
                    resultados.push(data);
                }
            })
            .on("end", () => resolve(resultados))
            .on("error", (err) => reject(err));
    });
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
function setMachineMap(req, res) {
    console.log("[LOG] Iniciando salvamento do machineMap...");

    garantirPastaDados(); // Garante que a pasta exista antes de acessar o arquivo

    const machineMap = req.body; // Recebe o objeto machineMap do corpo da requisição
    console.log("[LOG] Dados recebidos para o machineMap:", machineMap);

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
function getMachineMap(req, res) {
    console.log("[LOG] Iniciando carregamento do machineMap...");

    garantirPastaDados(); // Garante que a pasta exista antes de acessar o arquivo

    console.log("[LOG] Caminho do arquivo machineMap.json:", machineMapPath);

    if (!fs.existsSync(machineMapPath)) {
        console.warn("[AVISO] Arquivo machineMap.json não encontrado. Criando arquivo vazio...");
        fs.writeFileSync(machineMapPath, JSON.stringify({}));
    }

    try {
        const machineMap = JSON.parse(fs.readFileSync(machineMapPath, "utf8")); // Lê o arquivo e converte para objeto
        console.log("[LOG] Machine map carregado com sucesso:", machineMap);

        res.json(machineMap); // Retorna o objeto como JSON
    } catch (error) {
        console.error("[ERRO] Falha ao carregar o machineMap:", error);
        res.status(500).json({ error: "Erro ao carregar o machineMap!" });
    }
}

// Função para listar dados de um funcionário específico
async function listarDadosFuncionario(req, res) {
    console.log("[LOG] Iniciando listagem dos dados do funcionário...");

    const funcionario = req.query.funcionario; // Nome do funcionário enviado pelo frontend
    console.log("[LOG] Nome do funcionário recebido:", funcionario);

    const pastaDados = path.join(__dirname, "../data");
    const nomeArquivo = `${new Date().getFullYear()}.csv`;
    const caminhoArquivo = path.join(pastaDados, nomeArquivo);

    console.log("[LOG] Caminho do arquivo CSV:", caminhoArquivo);

    try {
        // Lê o arquivo CSV e filtra os registros pelo nome do funcionário
        const registros = await lerArquivoCSV(caminhoArquivo, { headers: false }); // Sem cabeçalhos
        console.log(`[LOG] Total de registros carregados do arquivo CSV: ${registros.length}`);

        // Filtra os registros onde a primeira coluna (índice 0) corresponde ao nome do funcionário
        const registrosFiltrados = registros
        .filter((registro) => registro[0] === funcionario)
        .map((registro) => ({
        Funcao: registro[1] || "N/A", // Coluna 2: Função
        Inicio: registro[2] || "N/A", // Coluna 3: Início
        Fim: registro[3] || "N/A", // Coluna 4: Fim
        Quantidade: parseInt(registro[4], 10) || 0, // Coluna 5: Quantidade
        Data: registro[5] || "N/A", // Coluna 6: Data
    })); 

        console.log("[LOG] Registros filtrados para o funcionário:", registrosFiltrados);

        res.json(registrosFiltrados);
    } catch (error) {
        console.error("[ERRO] Falha ao listar os dados do funcionário:", error);
        res.status(500).json({ error: "Erro ao listar os dados do funcionário!" });
    }
}

// Função para listar os nomes dos funcionários
async function listarNomesFuncionarios(req, res) {
    console.log("[LOG] Iniciando listagem dos nomes dos funcionários...");

    const pastaDados = path.join(__dirname, "../data");
    const nomeArquivo = `${new Date().getFullYear()}.csv`;
    const caminhoArquivo = path.join(pastaDados, nomeArquivo);

    console.log("[LOG] Caminho do arquivo CSV:", caminhoArquivo);

    try {
        // Lê o arquivo CSV e extrai os registros
        const registros = await lerArquivoCSV(caminhoArquivo, { headers: false }); // Sem cabeçalhos
        console.log(`[LOG] Total de registros carregados do arquivo CSV: ${registros.length}`);

        // Log do primeiro registro para depuração
        if (registros.length > 0) {
            console.log("[LOG] Exemplo de registro carregado:", registros[0]);
        }

        // Extrai os nomes dos funcionários da primeira coluna (índice 0)
        const nomes = [...new Set(registros.map((registro) => registro[0]).filter(nome => nome && nome.trim()))];
        console.log("[LOG] Nomes dos funcionários extraídos e filtrados:", nomes);

        res.json(nomes);
    } catch (error) {
        console.error("[ERRO] Falha ao listar os nomes dos funcionários:", error);
        res.status(500).json({ error: "Erro ao listar os nomes dos funcionários!" });
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


module.exports = {
    lerArquivoCSV,
    listarProducao,
    adicionarProducao,
    carregarUltimoRegistro,
    setMachineMap,
    getMachineMap,
    listarDadosFuncionario,
    listarNomesFuncionarios,
};