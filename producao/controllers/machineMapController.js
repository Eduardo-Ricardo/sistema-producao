const fs = require("fs");
const path = require("path");

const pastaDados = path.join(__dirname, "../data");
const machineMapPath = path.join(pastaDados, "machineMap.json");

/**
 * Garante que a pasta de dados exista, criando-a se necessário.
 */
function garantirPastaDados() {
    if (!fs.existsSync(pastaDados)) {
        console.log("[LOG] Pasta 'data' não encontrada. Criando...");
        fs.mkdirSync(pastaDados, { recursive: true });
    }
}

// Define a estrutura básica padrão para o machineMap
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

/**
 * Salva o mapa de máquinas (machineMap) recebido no corpo da requisição.
 * Converte formato antigo se necessário e garante todas as seções.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
function setMachineMap(req, res) {
    console.log("[LOG] Iniciando salvamento do machineMap...");

    garantirPastaDados();

    const machineMap = req.body;
    console.log("[LOG] Dados recebidos para o machineMap:", machineMap);

    try {
        // Verifica se o machineMap já tem a estrutura esperada
        let machineMapValidado = { ...machineMap };
        
        // Se for do formato antigo (plano), converte para o novo formato (por seções)
        if (Object.keys(machineMap).length > 0 && !machineMap["1_Frente"] && typeof Object.values(machineMap)[0] === 'string') {
            console.log("[LOG] Convertendo machineMap de formato antigo para novo...");
            machineMapValidado = migrarParaNovaEstrutura(machineMap);
        } else {
            // Garante que todas as seções estejam presentes
            Object.keys(estruturaBasica).forEach(secao => {
                if (!machineMapValidado[secao]) {
                    machineMapValidado[secao] = {};
                }
            });
        }

        fs.writeFileSync(machineMapPath, JSON.stringify(machineMapValidado, null, 2));
        console.log("[LOG] Machine map salvo com sucesso!");
        res.json({ message: "Machine map salvo com sucesso!" });
    } catch (error) {
        console.error("[ERRO] Falha ao salvar o machineMap:", error);
        res.status(500).json({ error: "Erro ao salvar o machineMap!" });
    }
}

/**
 * Retorna o mapa de máquinas (machineMap) atual.
 * Se não existir, cria com estrutura básica.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
function getMachineMap(req, res) {
    console.log("[LOG] Iniciando carregamento do machineMap...");

    garantirPastaDados();

    try {
        let machineMap = { ...estruturaBasica };

        if (fs.existsSync(machineMapPath)) {
            const dadosArquivo = JSON.parse(fs.readFileSync(machineMapPath, "utf8"));

            // Verifica se o arquivo tem o formato antigo (plano)
            if (Object.keys(dadosArquivo).length > 0 && !dadosArquivo["1_Frente"] && typeof Object.values(dadosArquivo)[0] === 'string') {
                console.log("[LOG] Formato antigo de machineMap detectado. Usando sem converter.");
                // Apenas usa o formato antigo na resposta, sem reescrever o arquivo
                res.json(dadosArquivo);
                return;
            } else {
                // Usa o formato novo, mesclando com a estrutura básica
                machineMap = { ...estruturaBasica, ...dadosArquivo };
            }
        } else {
            // Cria um arquivo novo apenas se não existir
            fs.writeFileSync(machineMapPath, JSON.stringify(estruturaBasica, null, 2));
        }

        console.log("[LOG] Machine map carregado com sucesso:", machineMap);
        res.json(machineMap);
    } catch (error) {
        console.error("[ERRO] Falha ao carregar o machineMap:", error);
        res.status(500).json({ error: "Erro ao carregar o machineMap!" });
    }
}

/**
 * Migra um machineMap do formato antigo (plano) para o novo (por seções).
 * @param {Object} machineMapAntigo
 * @returns {Object} Novo machineMap estruturado por seções
 */
function migrarParaNovaEstrutura(machineMapAntigo) {
    const machineMapNovo = { ...estruturaBasica };
    
    Object.entries(machineMapAntigo).forEach(([funcao, maquina]) => {
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

        machineMapNovo[secaoEncontrada][funcao] = maquina;
    });
    
    return machineMapNovo;
}

module.exports = {
    setMachineMap,
    getMachineMap
};