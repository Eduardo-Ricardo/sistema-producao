const fs = require("fs");
const path = require("path");

const pastaDados = path.join(__dirname, "../data");
const lotesRemessasPath = path.join(pastaDados, "lotesRemessas.json");

/**
 * Garante que a pasta de dados exista, criando-a se necessário.
 */
function garantirPastaDados() {
    if (!fs.existsSync(pastaDados)) {
        console.log("[LOG] Pasta 'data' não encontrada. Criando...");
        fs.mkdirSync(pastaDados, { recursive: true });
    }
}

/**
 * Retorna todas as remessas e lotes cadastrados.
 * Cria o arquivo se não existir.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
function getLotesRemessas(req, res) {
    console.log("[LOG] Iniciando carregamento das remessas e lotes...");
    garantirPastaDados();

    if (!fs.existsSync(lotesRemessasPath)) {
        console.warn("[AVISO] Arquivo lotesRemessas.json não encontrado. Criando arquivo vazio...");
        fs.writeFileSync(lotesRemessasPath, JSON.stringify({ remessas: [] }));
    }

    try {
        const lotesRemessas = JSON.parse(fs.readFileSync(lotesRemessasPath, "utf8"));
        console.log("[LOG] Remessas e lotes carregados com sucesso");
        res.json(lotesRemessas);
    } catch (error) {
        console.error("[ERRO] Falha ao carregar remessas e lotes:", error);
        res.status(500).json({ error: "Erro ao carregar remessas e lotes!" });
    }
}

/**
 * Adiciona uma nova remessa ao sistema.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
function addRemessa(req, res) {
    console.log("[LOG] Iniciando adição de nova remessa...");
    garantirPastaDados();

    const novaRemessa = req.body;

    // Validação básica dos dados da remessa
    if (!novaRemessa.nome || typeof novaRemessa.nome !== "string") {
        return res.status(400).json({ error: "O nome da remessa é obrigatório e deve ser uma string válida." });
    }

    console.log("[LOG] Dados da nova remessa:", novaRemessa);

    try {
        let lotesRemessas = { remessas: [] };
        if (fs.existsSync(lotesRemessasPath)) {
            lotesRemessas = JSON.parse(fs.readFileSync(lotesRemessasPath, "utf8"));
        }

        novaRemessa.id = Date.now().toString();
        novaRemessa.dataRegistro = new Date().toISOString();
        novaRemessa.lotes = novaRemessa.lotes || []; // Garante que a remessa tenha um array de lotes
        lotesRemessas.remessas.push(novaRemessa);

        fs.writeFileSync(lotesRemessasPath, JSON.stringify(lotesRemessas, null, 2));
        console.log("[LOG] Remessa adicionada com sucesso!");
        res.json({ message: "Remessa adicionada com sucesso!", remessaId: novaRemessa.id });
    } catch (error) {
        console.error("[ERRO] Falha ao adicionar remessa:", error);
        res.status(500).json({ error: "Erro ao adicionar remessa!" });
    }
}

/**
 * Adiciona um novo lote a uma remessa existente.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
function addLote(req, res) {
    console.log("[LOG] Iniciando adição de novo lote...");
    const { remessaId } = req.params;
    const novoLote = req.body;

    // Validação básica dos dados do lote
    if (!novoLote.tamanho || typeof novoLote.tamanho !== "string") {
        return res.status(400).json({ error: "O tamanho do lote é obrigatório e deve ser uma string válida." });
    }
    if (!novoLote.quantidade || typeof novoLote.quantidade !== "number" || novoLote.quantidade <= 0) {
        return res.status(400).json({ error: "A quantidade do lote é obrigatória e deve ser um número maior que zero." });
    }

    try {
        const lotesRemessas = JSON.parse(fs.readFileSync(lotesRemessasPath, "utf8"));
        const remessaIndex = lotesRemessas.remessas.findIndex(r => r.id === remessaId);

        if (remessaIndex === -1) {
            return res.status(404).json({ error: "Remessa não encontrada!" });
        }

        if (!lotesRemessas.remessas[remessaIndex].lotes) {
            lotesRemessas.remessas[remessaIndex].lotes = [];
        }

        const lotesDoMesmoTamanho = lotesRemessas.remessas[remessaIndex].lotes
            .filter(l => l.tamanho === novoLote.tamanho);
        const maiorNumero = lotesDoMesmoTamanho.reduce((max, lote) => {
            const num = parseInt(lote.numero) || 0;
            return num > max ? num : max;
        }, 0);

        novoLote.id = Date.now().toString();
        novoLote.numero = (maiorNumero + 1).toString();
        lotesRemessas.remessas[remessaIndex].lotes.push(novoLote);

        fs.writeFileSync(lotesRemessasPath, JSON.stringify(lotesRemessas, null, 2));
        console.log("[LOG] Lote adicionado com sucesso!");
        res.json({ message: "Lote adicionado com sucesso!", loteId: novoLote.id });
    } catch (error) {
        console.error("[ERRO] Falha ao adicionar lote:", error);
        res.status(500).json({ error: "Erro ao adicionar lote!" });
    }
}

module.exports = {
    getLotesRemessas,
    addRemessa,
    addLote
};