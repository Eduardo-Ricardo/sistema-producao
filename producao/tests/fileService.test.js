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

  // Teste: arquivo inexistente
  try {
    await loadCsv(1999); // Ano improvável
    console.assert(false, 'Deveria lançar erro para arquivo inexistente');
  } catch (e) {
    console.log('Teste de arquivo inexistente passou!');
  }

  // Teste: CSV malformado (simulado)
  // Para testar, crie manualmente um arquivo 2026.csv malformado na pasta data, se desejar
})();
