// Testes para transformService.js
const { mapToDomain, groupByDate, aggregateByFunction } = require('../controllers/transformService');

const mockRecords = [
  { employeeName: 'Luiz', employeeRole: 'Fechar_Fundilho', startTime: '08:00', endTime: '10:00', productionCount: 120, productionDate: '02/05/2025' },
  { employeeName: 'Luiz', employeeRole: 'Fechar_Lateral', startTime: '10:00', endTime: '12:00', productionCount: 80, productionDate: '02/05/2025' },
  { employeeName: 'Luiz', employeeRole: 'Fechar_Lateral', startTime: '13:00', endTime: '15:00', productionCount: 100, productionDate: '03/05/2025' },
  { employeeName: 'Ana', employeeRole: 'Costurar_Pala', startTime: '08:00', endTime: '09:00', productionCount: 50, productionDate: '02/05/2025' }
];

console.log('Testando mapToDomain...');
const domain = mapToDomain(mockRecords);
console.assert(domain[0].duracaoHoras === 2, 'Duração deve ser 2 horas');
console.assert(domain[0].registroEspecial === false, 'Não deve ser registro especial');

console.log('Testando groupByDate...');
const grouped = groupByDate(domain);
console.assert(grouped.length === 2, 'Deve haver 2 datas agrupadas');
console.assert(grouped[0].data === '02/05/2025', 'Primeira data deve ser 02/05/2025');
console.assert(grouped[0].registros.length === 3, 'Deve haver 3 registros no dia 02/05/2025');

console.log('Testando aggregateByFunction...');
const aggregated = aggregateByFunction(domain);
console.assert(aggregated.length === 3, 'Deve haver 3 funções agregadas');
console.assert(aggregated[0].hasOwnProperty('funcao'), 'Deve ter campo funcao');
console.assert(typeof aggregated[0].total === 'number', 'Total deve ser número');

console.log('Todos os testes passaram!');
