// filterService.js
// Serviço para filtros de registros de produção

/**
 * Filtra registros por funcionário (case insensitive)
 * @param {Array} records - Array de objetos de produção
 * @param {string} name - Nome do funcionário
 * @returns {Array}
 */
function filterByEmployee(records, name) {
    if (!name) return records;
    return records.filter(r => r.employeeName && r.employeeName.toLowerCase() === name.toLowerCase());
}

/**
 * Filtra registros por intervalo de datas (inclusive)
 * @param {Array} records - Array de objetos de produção
 * @param {string} start - Data inicial no formato DD/MM/YYYY
 * @param {string} end - Data final no formato DD/MM/YYYY
 * @returns {Array}
 */
function filterByDateRange(records, start, end) {
    if (!start && !end) return records;
    const parse = (str) => {
        if (!str) return null;
        const [d, m, y] = str.split('/').map(Number);
        return new Date(y, m - 1, d);
    };
    const dStart = parse(start);
    const dEnd = parse(end);
    return records.filter(r => {
        const d = parse(r.productionDate);
        if (!d) return false;
        if (dStart && d < dStart) return false;
        if (dEnd && d > dEnd) return false;
        return true;
    });
}

module.exports = { filterByEmployee, filterByDateRange };
