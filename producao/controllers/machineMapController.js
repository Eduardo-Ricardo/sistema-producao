const fs = require("fs");
const path = require("path");

const pastaDados = path.join(__dirname, "../data");
const machineMapPath = path.join(pastaDados, "machineMap.json");

function garantirPastaDados() {
    if (!fs.existsSync(pastaDados)) {
        console.log("[LOG] Pasta 'data' não encontrada. Criando...");
        fs.mkdirSync(pastaDados, { recursive: true });
    }
}

function setMachineMap(req, res) {
    console.log("[LOG] Iniciando salvamento do machineMap...");

    garantirPastaDados();

    const machineMap = req.body;
    console.log("[LOG] Dados recebidos para o machineMap:", machineMap);

    const estruturaBasica = [
        "1_Frente",
        "2_Traseira",
        "3_Montagem",
        "4_Bolso_Lateral",
        "5_Costura_Interna",
        "6_Barras",
        "7_Cos_Elastico",
        "8_Acabamento"
    ];

    const machineMapValidado = { ...machineMap };
    estruturaBasica.forEach(secao => {
        if (!machineMapValidado[secao]) {
            machineMapValidado[secao] = {};
        }
    });

    try {
        fs.writeFileSync(machineMapPath, JSON.stringify(machineMapValidado, null, 2));
        console.log("[LOG] Machine map salvo com sucesso!");
        res.json({ message: "Machine map salvo com sucesso!" });
    } catch (error) {
        console.error("[ERRO] Falha ao salvar o machineMap:", error);
        res.status(500).json({ error: "Erro ao salvar o machineMap!" });
    }
}

function getMachineMap(req, res) {
    console.log("[LOG] Iniciando carregamento do machineMap...");

    garantirPastaDados();

    const estruturaBasica = {
        "1_Frente": {},
        "2_Traseira": {},
        "3_Montagem": {},
        "4_Bolso_Lateral": {},
        "5_Costura_Interna": {},
        "6_Barras": {},
        "7_Cos_Elastico": {},
        "8_Acabamento": {}
    };

    try {
        let machineMap = estruturaBasica;

        if (fs.existsSync(machineMapPath)) {
            const dadosArquivo = JSON.parse(fs.readFileSync(machineMapPath, "utf8"));

            if (Object.keys(dadosArquivo).length > 0 && !dadosArquivo["1_Frente"]) {
                Object.entries(dadosArquivo).forEach(([funcao, maquina]) => {
                    let secaoEncontrada = "1_Frente";

                    const funcaoLower = funcao.toLowerCase();
                    if (funcaoLower.includes("traseira") || funcaoLower.includes("pala traseira")) {
                        secaoEncontrada = "2_Traseira";
                    } else if (funcaoLower.includes("lateral")) {
                        secaoEncontrada = "3_Montagem";
                    } else if (funcaoLower.includes("bolso")) {
                        secaoEncontrada = "4_Bolso_Lateral";
                    } else if (funcaoLower.includes("entreperna")) {
                        secaoEncontrada = "5_Costura_Interna";
                    } else if (funcaoLower.includes("barra")) {
                        secaoEncontrada = "6_Barras";
                    } else if (funcaoLower.includes("cós") || funcaoLower.includes("elastico")) {
                        secaoEncontrada = "7_Cos_Elastico";
                    }

                    machineMap[secaoEncontrada][funcao] = maquina;
                });

                fs.writeFileSync(machineMapPath, JSON.stringify(machineMap, null, 2));
            } else {
                machineMap = { ...estruturaBasica, ...dadosArquivo };
            }
        } else {
            fs.writeFileSync(machineMapPath, JSON.stringify(estruturaBasica, null, 2));
        }

        console.log("[LOG] Machine map carregado com sucesso:", machineMap);
        res.json(machineMap);
    } catch (error) {
        console.error("[ERRO] Falha ao carregar o machineMap:", error);
        res.status(500).json({ error: "Erro ao carregar o machineMap!" });
    }
}

module.exports = {
    setMachineMap,
    getMachineMap
};