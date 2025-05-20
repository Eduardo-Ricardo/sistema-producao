/**
 * Serviço para operações com lotes e remessas
 * - Atualiza quantidades dos lotes após uso
 * - Lê e salva dados de lotes/remessas
 */
const fs = require("fs");
const path = require("path");

const pastaDados = path.join(__dirname, "../data");
const lotesRemessasPath = path.join(pastaDados, "lotesRemessas.json");

/**
 * Atualiza as quantidades dos lotes após uso
 * @param {Array<{tamanho: string, numero: string, quantidade: number}>} lotesUsados
 */
function atualizarQuantidadesLotesService(lotesUsados) {
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
        }
    } catch (error) {
        console.error("[ERRO] Falha ao atualizar quantidades dos lotes:", error);
        throw error;
    }
}

module.exports = {
    atualizarQuantidadesLotesService
};
