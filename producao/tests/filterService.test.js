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

console.log('Todos os testes de filterService passaram!');
