// fileService.js
// Serviço para leitura e parsing de CSV de produção
const path = require('path');
const { lerArquivoCSV } = require('../utils/fileUtils');

/**
 * Carrega o CSV de produção do ano especificado e retorna um array de objetos nomeados.
 * @param {number|string} year - Ano do arquivo CSV (ex: 2025)
 * @returns {Promise<Array<{employeeName: string, employeeRole: string, startTime: string, endTime: string, productionCount: string, productionDate: string}>>}
 */

async function loadCsv(year) {
    const pastaDados = path.join(__dirname, '../data');
    const nomeArquivo = `${year}.csv`;
    const caminhoArquivo = path.join(pastaDados, nomeArquivo);
    // Usa lerArquivoCSV, que já retorna array de arrays
    const registros = await lerArquivoCSV(caminhoArquivo, { headers: false });
    // Mapeia para objetos nomeados
    return registros.map(registro => ({
        employeeName: registro[0] || '',
        employeeRole: registro[1] || '',
        startTime: registro[2] || '',
        endTime: registro[3] || '',
        productionCount: registro[4] || '',
        productionDate: registro[5] || ''
    }));
}

module.exports = { loadCsv };
