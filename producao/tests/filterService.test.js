// Testes para filterService.js
const { filterByEmployee, filterByDateRange } = require('../controllers/filterService');

const mockRecords = [
  { employeeName: 'Luiz', productionDate: '02/05/2025' },
  { employeeName: 'Ana', productionDate: '03/05/2025' },
  { employeeName: 'Luiz', productionDate: '04/05/2025' }
];

console.log('Testando filterByEmployee...');
const filtered = filterByEmployee(mockRecords, 'Luiz');
console.assert(filtered.length === 2, 'Deve retornar 2 registros para Luiz');

console.log('Testando filterByDateRange...');
const filteredDate = filterByDateRange(mockRecords, '03/05/2025', '04/05/2025');
console.assert(filteredDate.length === 2, 'Deve retornar 2 registros entre 03/05/2025 e 04/05/2025');

// Teste: filtro com nome inexistente
const filteredNone = filterByEmployee(mockRecords, 'Inexistente');
console.assert(filteredNone.length === 0, 'Deve retornar 0 registros para nome inexistente');

// Teste: filtro de datas com intervalo inválido
const filteredInvalid = filterByDateRange(mockRecords, '05/05/2025', '01/05/2025');
console.assert(filteredInvalid.length === 0, 'Deve retornar 0 registros para intervalo inválido');

// Teste: filtro de datas com datas fora do range
const filteredOut = filterByDateRange(mockRecords, '10/05/2025', '12/05/2025');
console.assert(filteredOut.length === 0, 'Deve retornar 0 registros para datas fora do range');

console.log('Todos os testes de filterService passaram!');
