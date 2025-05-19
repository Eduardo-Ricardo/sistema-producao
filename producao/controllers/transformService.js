// transformService.js
// Serviço para transformação e agregação de registros de produção

/**
 * Adiciona campos derivados: duração em horas e flag de registro especial
 * @param {Array} records
 * @returns {Array}
 */
function mapToDomain(records) {
    return records.map(r => {
        const duracao = calcularDuracaoEmHoras(r.startTime, r.endTime);
        return {
            ...r,
            duracaoHoras: duracao,
            registroEspecial: r.startTime === '00:00' && r.endTime === '00:00'
        };
    });
}

function calcularDuracaoEmHoras(inicio, fim) {
    if (inicio === '00:00' && fim === '00:00') return 1;
    if (!inicio || !fim || inicio === 'N/A' || fim === 'N/A') return 0;
    const [h1, m1] = inicio.split(':').map(Number);
    const [h2, m2] = fim.split(':').map(Number);
    let min = (h2 * 60 + m2) - (h1 * 60 + m1);
    if (min < 0) min += 24 * 60;
    return min / 60;
}

/**
 * Agrupa registros por data (DD/MM/YYYY)
 * @param {Array} records
 * @returns {Array<{data: string, registros: Array}>}
 */
function groupByDate(records) {
    const grupos = {};
    records.forEach(r => {
        if (!grupos[r.productionDate]) grupos[r.productionDate] = [];
        grupos[r.productionDate].push(r);
    });
    return Object.entries(grupos).map(([data, registros]) => ({
        data,
        registros: registros.sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''))
    })).sort((a, b) => {
        const [dA, mA, yA] = a.data.split('/').map(Number);
        const [dB, mB, yB] = b.data.split('/').map(Number);
        const dateA = new Date(yA, mA - 1, dA);
        const dateB = new Date(yB, mB - 1, dB);
        return dateA - dateB;
    });
}

/**
 * Agrega totais e médias por função
 * @param {Array} records
 * @returns {Array<{funcao: string, total: number, quantidade_registros: number, registros_sem_tempo: number, total_horas: number, media_por_hora: number}>}
 */
function aggregateByFunction(records) {
    const funcoes = [...new Set(records.map(r => r.employeeRole))].filter(f => !!f && f !== 'N/A');
    return funcoes.map(funcao => {
        const registros = records.filter(r => r.employeeRole === funcao);
        const producoesHora = registros.filter(r => !r.registroEspecial && r.duracaoHoras > 0)
            .map(r => r.productionCount / r.duracaoHoras);
        const total = registros.reduce((acc, r) => acc + (parseInt(r.productionCount, 10) || 0), 0);
        const totalHoras = registros.filter(r => !r.registroEspecial)
            .reduce((acc, r) => acc + (r.duracaoHoras || 0), 0);
        const mediaProducaoHora = producoesHora.length > 0 ? Math.round(producoesHora.reduce((a, b) => a + b, 0) / producoesHora.length) : 0;
        return {
            funcao,
            total,
            quantidade_registros: registros.length,
            registros_sem_tempo: registros.filter(r => r.registroEspecial).length,
            total_horas: Number(totalHoras.toFixed(2)),
            media_por_hora: mediaProducaoHora
        };
    });
}

module.exports = { mapToDomain, groupByDate, aggregateByFunction };
