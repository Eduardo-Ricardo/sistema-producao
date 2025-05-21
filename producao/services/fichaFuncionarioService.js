// fichaFuncionarioService.js
// Serviço responsável por cálculos e agregações da ficha do funcionário
// Fornece funções para obter o resumo e o calendário de registros de produção de um funcionário

const { loadCsv } = require("../services/fileService");
const { filterByEmployee } = require("../services/filterService");
const { mapToDomain, aggregateByFunction } = require("../services/transformService");

/**
 * Calcula o número de dias úteis de um mês/ano (exclui sábados e domingos)
 * @param {number} mes - Mês (1-12)
 * @param {number} ano - Ano (ex: 2025)
 * @returns {number} Dias úteis
 */
function calcularDiasUteis(mes, ano) {
    let diasUteis = 0;
    const diasNoMes = new Date(ano, mes, 0).getDate();
    for (let dia = 1; dia <= diasNoMes; dia++) {
        const data = new Date(ano, mes - 1, dia);
        const diaSemana = data.getDay();
        if (diaSemana !== 0 && diaSemana !== 6) diasUteis++;
    }
    return diasUteis;
}

/**
 * Retorna o resumo de produção do funcionário para um mês/ano
 * @param {Object} params
 * @param {string} params.funcionario - Nome do funcionário
 * @param {number|string} params.mes - Mês (1-12)
 * @param {number|string} params.ano - Ano (ex: 2025)
 * @returns {Promise<Object>} Resumo com dias úteis, dias com registro, médias, meta, etc.
 */
async function getResumo({ funcionario, mes, ano }) {
    const registros = await loadCsv(Number(ano));
    const filtrados = filterByEmployee(registros, funcionario);
    const registrosMes = filtrados.filter(r => {
        if (!r.productionDate) return false;
        const [dia, mesRegistro, anoRegistro] = r.productionDate.split("/");
        return Number(mesRegistro) === Number(mes) && Number(anoRegistro) === Number(ano);
    });
    const domain = mapToDomain(registrosMes);
    const diasUteis = calcularDiasUteis(Number(mes), Number(ano));
    const diasComRegistro = new Set(domain.map(r => r.productionDate)).size;
    const funcoes = aggregateByFunction(domain)
        .sort((a, b) => b.total - a.total)
        .slice(0, 3)
        .map(f => ({ funcao: f.funcao, mediaPorHora: f.totalHoras > 0 ? (f.total / f.totalHoras) : 0 }));
    const mediaDiaria = domain.length > 0 ? (domain.reduce((acc, r) => acc + r.productionCount, 0) / diasComRegistro) : 0;
    const meta = 1000;
    const totalPeriodo = domain.reduce((acc, r) => acc + r.productionCount, 0);
    const percentualMeta = meta > 0 ? (totalPeriodo / meta) * 100 : 0;
    return {
        diasUteis,
        diasComRegistro,
        funcoes,
        mediaDiaria,
        meta,
        percentualMeta,
        comparativoSemana: null,
        comparativoMes: null
    };
}

/**
 * Retorna o calendário de registros do funcionário para um mês/ano
 * @param {Object} params
 * @param {string} params.funcionario - Nome do funcionário
 * @param {number|string} params.mes - Mês (1-12)
 * @param {number|string} params.ano - Ano (ex: 2025)
 * @returns {Promise<{calendario: Array<{dia: number, temRegistro: boolean}>}>}
 */
async function getCalendario({ funcionario, mes, ano }) {
    const registros = await loadCsv(Number(ano));
    const filtrados = filterByEmployee(registros, funcionario);
    const registrosMes = filtrados.filter(r => {
        if (!r.productionDate) return false;
        const [dia, mesRegistro, anoRegistro] = r.productionDate.split("/");
        return Number(mesRegistro) === Number(mes) && Number(anoRegistro) === Number(ano);
    });
    const diasNoMes = new Date(Number(ano), Number(mes), 0).getDate();
    const diasComRegistro = new Set(registrosMes.map(r => parseInt(r.productionDate.split("/")[0], 10)));
    const calendario = [];
    for (let dia = 1; dia <= diasNoMes; dia++) {
        calendario.push({
            dia,
            temRegistro: diasComRegistro.has(dia)
        });
    }
    return { calendario };
}

module.exports = {
    getResumo,
    getCalendario
};