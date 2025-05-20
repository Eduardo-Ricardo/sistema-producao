const { atualizarQuantidadesLotesService } = require('../services/loteService');
const fs = require('fs');
const path = require('path');

jest.mock('fs');

const lotesRemessasPath = path.join(__dirname, '../data/lotesRemessas.json');

describe('loteService', () => {
  beforeEach(() => {
    fs.readFileSync.mockReset();
    fs.writeFileSync.mockReset();
  });

  it('deve atualizar quantidade de lote existente', () => {
    const lotesUsados = [{ tamanho: 'P', numero: '001', quantidade: 2 }];
    const lotesRemessas = {
      remessas: [
        { lotes: [{ tamanho: 'P', numero: '001', quantidade: 5 }] }
      ]
    };
    fs.readFileSync.mockReturnValue(JSON.stringify(lotesRemessas));
    fs.writeFileSync.mockImplementation(() => {});
    expect(() => atualizarQuantidadesLotesService(lotesUsados)).not.toThrow();
    expect(fs.writeFileSync).toHaveBeenCalled();
  });

  it('não deve lançar erro se lote não existir', () => {
    const lotesUsados = [{ tamanho: 'M', numero: '999', quantidade: 1 }];
    const lotesRemessas = { remessas: [{ lotes: [{ tamanho: 'P', numero: '001', quantidade: 5 }] }] };
    fs.readFileSync.mockReturnValue(JSON.stringify(lotesRemessas));
    fs.writeFileSync.mockImplementation(() => {});
    expect(() => atualizarQuantidadesLotesService(lotesUsados)).not.toThrow();
    expect(fs.writeFileSync).not.toHaveBeenCalled();
  });

  it('deve lançar erro se leitura do arquivo falhar', () => {
    fs.readFileSync.mockImplementation(() => { throw new Error('Falha de leitura'); });
    expect(() => atualizarQuantidadesLotesService([{ tamanho: 'P', numero: '001', quantidade: 1 }])).toThrow('Falha de leitura');
  });
});
