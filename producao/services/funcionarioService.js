/**
 * Serviço para operações de funcionário e agregação de dados
 * - Lista dados de um funcionário específico
 * - Agrega totais por função
 */
const { loadCsv } = require("../services/fileService");
const { filterByEmployee } = require("../services/filterService");
const { mapToDomain, groupByDate, aggregateByFunction } = require("../services/transformService");

/**
 * Lista dados de um funcionário específico, agrupando por data e função
 * @param {string} funcionario Nome do funcionário
 * @returns {Promise<{registros: Object, funcoes: Object}>}
 */
async function listarDadosFuncionarioService(funcionario) {
    const year = new Date().getFullYear();
    const registros = await loadCsv(year);
    const filtrados = filterByEmployee(registros, funcionario);
    const domain = mapToDomain(filtrados);
    const registrosAgrupados = groupByDate(domain);
    const totaisPorFuncao = aggregateByFunction(domain);
    return {
        registros: registrosAgrupados,
        funcoes: totaisPorFuncao
    };
}

/**
 * Lista nomes únicos de funcionários a partir dos registros do ano atual
 * @returns {Promise<string[]>} Lista de nomes
 */
async function listarNomesFuncionariosService() {
    const year = new Date().getFullYear();
    const registros = await loadCsv(year);
    return [...new Set(registros.map(r => r.employeeName).filter(nome => nome && nome.trim()))];
}

module.exports = {
    listarDadosFuncionarioService,
    listarNomesFuncionariosService
};
