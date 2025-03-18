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

    console.log("Dados recebidos:", req.body); // Log dos dados recebidos no servidor

    if (!employeeName || !employeeRole || !startTime || !endTime || !productionCount || !productionDate) {
        return res.status(400).json({ error: "Preencha todos os campos!" });
    }

    // Extrai o ano da data fornecida (formato esperado: DD/MM)
    const [dia, mes] = productionDate.split("/");
    const ano = new Date().getFullYear(); // Usa o ano atual como padrão

    // Define o diretório correto para armazenar os arquivos CSV
    const pastaDados = path.join(__dirname, "data"); // Agora salva em "server/data/"
    const nomeArquivo = `${ano}.csv`;
    const caminhoArquivo = path.join(pastaDados, nomeArquivo);

    // Garante que a pasta "data" exista dentro de "server"
    if (!fs.existsSync(pastaDados)) {
        fs.mkdirSync(pastaDados, { recursive: true });
    }

    // Formata os dados para salvar no CSV
    const linha = `${employeeName},${employeeRole},${startTime},${endTime},${productionCount},${productionDate}\n`;

    // Salva os dados no arquivo correspondente ao ano dentro da pasta correta
    fs.appendFile(caminhoArquivo, linha, (err) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao salvar os dados!" });
        }
        console.log(`Dados salvos em ${caminhoArquivo}`);
        res.json({ message: "Produção registrada com sucesso!" });
    });
});

app.get("/dados", (req, res) => {
    const { employeeName, employeeRole, day, week, month } = req.query;

    // Define o diretório correto para ler os arquivos CSV
    const pastaDados = path.join(__dirname, "data");
    const nomeArquivo = `${new Date().getFullYear()}.csv`;
    const caminhoArquivo = path.join(pastaDados, nomeArquivo);
    console.log("Caminho do arquivo: ", caminhoArquivo);

    // Lê o arquivo CSV e converte em um array de objetos    
    fs.readFile(caminhoArquivo, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao ler o arquivo CSV!" });
        }

        const linhas = data.split("\n").filter(linha => linha.trim() !== "");
        let registros = linhas.map(linha => {
            const [employeeName, employeeRole, startTime, endTime, productionCount, productionDate] = linha.split(",");
            return { employeeName, employeeRole, startTime, endTime, productionCount, productionDate };
        });

        // Aplicar filtros
        if (employeeName) {
            registros = registros.filter(registro => registro.employeeName === employeeName);
        }
        if (employeeRole) {
            registros = registros.filter(registro => registro.employeeRole === employeeRole);
        }
        if (day) {
            registros = registros.filter(registro => registro.productionDate.split("/")[0] === day);
        }
        if (week) {
            // Implementar lógica para filtrar por semana
        }
        if (month) {
            registros = registros.filter(registro => registro.productionDate.split("/")[1] === month);
        }

        res.json(registros);
    });
});

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/menu.html"));
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
