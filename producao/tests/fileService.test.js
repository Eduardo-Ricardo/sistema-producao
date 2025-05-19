// Testes para fileService.js
const { loadCsv } = require('../controllers/fileService');
const path = require('path');

(async () => {
  console.log('Testando loadCsv...');
  // Use o ano do seu arquivo de teste, ex: 2025
  const year = 2025;
  const registros = await loadCsv(year);
  console.assert(Array.isArray(registros), 'Deve retornar um array');
  if (registros.length > 0) {
    const r = registros[0];
    console.assert(r.hasOwnProperty('employeeName'), 'Deve ter campo employeeName');
    console.assert(r.hasOwnProperty('productionDate'), 'Deve ter campo productionDate');
  }
  console.log('Testes de fileService.js passaram!');
})();
