/**
 * Serviço para operações de registro de produção
 * - Lê registros do ano atual
 * - Busca o último registro de um funcionário
 */
const fs = require("fs");
const path = require("path");

const pastaDados = path.join(__dirname, "../data");

/**
 * Lê todos os registros do ano atual
 * @returns {Array<Object>} Lista de registros
 */
function lerRegistrosAnoAtual() {
    const nomeArquivo = `${new Date().getFullYear()}.csv`;
    const caminhoArquivo = path.join(pastaDados, nomeArquivo);
    if (!fs.existsSync(caminhoArquivo)) return [];
    const dados = fs.readFileSync(caminhoArquivo, "utf-8");
    const linhas = dados.split("\n").filter(linha => linha.trim() !== "");
    return linhas.map(linha => {
        const [employeeName, employeeRole, startTime, endTime, productionCount, productionDate] = linha.split(",");
        return {
            employeeName: employeeName.trim(),
            employeeRole: employeeRole.trim(),
            startTime: startTime.trim(),
            endTime: endTime.trim(),
            productionCount: parseInt(productionCount.trim(), 10),
            productionDate: productionDate.trim()
        };
    });
}

/**
 * Busca o último registro de um funcionário
 * @param {string} employeeName
 * @returns {Object|null}
 */
function buscarUltimoRegistroFuncionario(employeeName) {
    const registros = lerRegistrosAnoAtual().filter(r => r.employeeName === employeeName);
    if (registros.length === 0) return null;
    return registros.reduce((maisRecente, registro) => {
        const [dia, mes] = registro.productionDate.split("/").map(Number);
        const dataAtual = new Date(new Date().getFullYear(), mes - 1, dia);
        const [diaMaisRecente, mesMaisRecente] = maisRecente.productionDate.split("/").map(Number);
        const dataMaisRecente = new Date(new Date().getFullYear(), mesMaisRecente - 1, diaMaisRecente);
        return dataAtual > dataMaisRecente ? registro : maisRecente;
    });
}

/**
 * Lista todos os registros de produção do ano atual
 * @returns {Array<Object>} Lista de registros
 */
function listarProducaoService() {
    return lerRegistrosAnoAtual();
}

module.exports = {
    lerRegistrosAnoAtual,
    buscarUltimoRegistroFuncionario,
    listarProducaoService
};
