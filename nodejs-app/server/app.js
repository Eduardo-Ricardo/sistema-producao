const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post("/salvar", (req, res) => {
    const { employeeName, employeeRole, startTime, endTime, productionCount, productionDate } = req.body;

    console.log("[LOG] Dados recebidos para registro:", req.body);

    if (!employeeName || !employeeRole || !startTime || !endTime || !productionCount || !productionDate) {
        console.error("[ERRO] Campos obrigatórios ausentes!");
        return res.status(400).json({ error: "Preencha todos os campos!" });
    }

// Extrai o ano da data fornecida (formato esperado: DD/MM)
    const [dia, mes] = productionDate.split("/");
    const ano = new Date().getFullYear();
    const pastaDados = path.join(__dirname, "data");
    const nomeArquivo = `${ano}.csv`;
    const caminhoArquivo = path.join(pastaDados, nomeArquivo);

// Garante que a pasta "data" exista dentro de "server"
    if (!fs.existsSync(pastaDados)) {
        console.log("[LOG] Criando pasta de dados:", pastaDados);
        fs.mkdirSync(pastaDados, { recursive: true });
    }

// Formata os dados para salvar no CSV
    const linha = `${employeeName},${employeeRole},${startTime},${endTime},${productionCount},${productionDate}\n`;

// Salva os dados no arquivo correspondente ao ano dentro da pasta correta
    fs.appendFile(caminhoArquivo, linha, (err) => {
        if (err) {
            console.error("[ERRO] Falha ao salvar os dados no arquivo:", err);
            return res.status(500).json({ error: "Erro ao salvar os dados!" });
        }
        console.log(`[LOG] Dados salvos com sucesso em ${caminhoArquivo}`);
        res.json({ message: "Produção registrada com sucesso!" });
    });
});

app.get("/dados", (req, res) => {
    const { employeeName, employeeRole, day, week, month } = req.query;

    // Define o diretório correto para ler os arquivos CSV
    const pastaDados = path.join(__dirname, "data");
    const nomeArquivo = `${new Date().getFullYear()}.csv`;
    const caminhoArquivo = path.join(pastaDados, nomeArquivo);

    console.log("[LOG] Tentando ler o arquivo:", caminhoArquivo);

    fs.readFile(caminhoArquivo, "utf8", (err, data) => {
        if (err) {
            console.error("[ERRO] Falha ao ler o arquivo:", err);
            return res.status(500).json({ error: "Erro ao ler o arquivo CSV!" });
        }

        console.log("[LOG] Arquivo lido com sucesso. Processando dados...");
        const linhas = data.split("\n").filter(linha => linha.trim() !== "");
        let registros = linhas.map(linha => {
            const [employeeName, employeeRole, startTime, endTime, productionCount, productionDate] = linha.split(",");
            return { employeeName, employeeRole, startTime, endTime, productionCount, productionDate };
        });

        console.log("[LOG] Total de registros encontrados:", registros.length);

        if (employeeName) {
            registros = registros.filter(registro => registro.employeeName === employeeName);
            console.log(`[LOG] Registros filtrados por employeeName (${employeeName}):`, registros.length);
        }
        if (employeeRole) {
            registros = registros.filter(registro => registro.employeeRole === employeeRole);
            console.log(`[LOG] Registros filtrados por employeeRole (${employeeRole}):`, registros.length);
        }
        if (day) {
            registros = registros.filter(registro => registro.productionDate.split("/")[0] === day);
            console.log(`[LOG] Registros filtrados por day (${day}):`, registros.length);
        }
        if (month) {
            registros = registros.filter(registro => registro.productionDate.split("/")[1] === month);
            console.log(`[LOG] Registros filtrados por month (${month}):`, registros.length);
        }

        res.json(registros);
    });
});

// Caminho do arquivo machineMap.json
const machineMapPath = path.join(__dirname, "data", "machineMap.json");

// Garantir que a pasta "data" exista
if (!fs.existsSync(path.join(__dirname, "data"))) {
    console.log("[LOG] Pasta 'data' não encontrada. Criando...");
    fs.mkdirSync(path.join(__dirname, "data"), { recursive: true });
}

// Rota para salvar o machineMap no arquivo JSON
app.post("/salvarMachineMap", (req, res) => {
    const machineMap = req.body;

    console.log("[LOG] Salvando machineMap:", machineMap);

    // Salva o machineMap no arquivo JSON
    fs.writeFile(machineMapPath, JSON.stringify(machineMap, null, 2), (err) => {
        if (err) {
            console.error("[ERRO] Falha ao salvar o machineMap:", err);
            return res.status(500).json({ error: "Erro ao salvar o machineMap!" });
        }
        console.log("[LOG] Machine map salvo com sucesso!");
        res.json({ message: "Machine map salvo com sucesso!" });
    });
});

// Rota para carregar o machineMap do arquivo JSON
app.get("/carregarMachineMap", (req, res) => {
    console.log("[LOG] Carregando machineMap...");

    if (fs.existsSync(machineMapPath)) {
        const machineMap = JSON.parse(fs.readFileSync(machineMapPath, "utf8"));
        console.log("[LOG] Machine map carregado com sucesso:", machineMap);
        res.json(machineMap);
    } else {
        console.warn("[AVISO] Arquivo machineMap.json não encontrado. Retornando objeto vazio.");
        res.json({});
    }
});

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/menu.html"));
});

app.listen(PORT, () => {
    console.log(`[LOG] Servidor rodando em http://localhost:${PORT}`);
});
