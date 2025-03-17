const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Rota para salvar a produção no CSV
app.post("/salvar", (req, res) => {
    const { employeeName, employeeRole, startTime, endTime, productionCount, productionDate } = req.body;

    console.log("Dados recebidos:", req.body); // Log dos dados recebidos no servidor


    if (!employeeName || !employeeRole || !startTime || !endTime || !productionCount || !productionDate) {
        return res.status(400).json({ error: "Preencha todos os campos!" });
    }

    const linha = `${employeeName}, ${employeeRole}, ${startTime},${endTime},${productionCount},${productionDate}\n`;

    fs.appendFile("data.csv", linha, (err) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao salvar os dados!" });
        }
        console.log("Dados salvos com sucesso!");
        res.json({ message: "Produção registrada com sucesso!" });
    });
});

app.get("/dados", (req, res) => {
    fs.readFile("data.csv", "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao ler o arquivo CSV!" });
        }

        const linhas = data.split("\n").filter(linha => linha.trim() !== "");
        const registros = linhas.map(linha => {
            const [employeeName, employeeRole, startTime, endTime, productionCount, productionDate] = linha.split(",");
            return { employeeName, employeeRole, startTime, endTime, productionCount, productionDate };
        });

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
