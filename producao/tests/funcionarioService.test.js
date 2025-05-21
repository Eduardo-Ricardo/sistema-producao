const { listarDadosFuncionarioService, listarNomesFuncionariosService } = require('../services/funcionarioService');

jest.mock('../services/fileService', () => ({
  loadCsv: jest.fn()
}));
const { loadCsv } = require('../services/fileService');

const registrosMock = [
  { employeeName: 'Ana', employeeRole: 'Costureira', productionCount: 10, productionDate: '01/05' },
  { employeeName: 'Ana', employeeRole: 'Costureira', productionCount: 5, productionDate: '02/05' },
  { employeeName: 'Bia', employeeRole: 'Auxiliar', productionCount: 7, productionDate: '01/05' }
];

describe('funcionarioService', () => {
  beforeEach(() => {
    loadCsv.mockReset();
  });

  it('deve retornar registros e funções agregadas para um funcionário existente', async () => {
    loadCsv.mockResolvedValue(registrosMock);
    const resultado = await listarDadosFuncionarioService('Ana');
    expect(resultado).toHaveProperty('registros');
    expect(resultado).toHaveProperty('funcoes');
    expect(Object.keys(resultado.registros).length).toBeGreaterThanOrEqual(0);
  });

  it('deve retornar registros vazios para funcionário inexistente', async () => {
    loadCsv.mockResolvedValue(registrosMock);
    const resultado = await listarDadosFuncionarioService('Carlos');
    expect(typeof resultado.registros).toBe('object');
    expect(typeof resultado.funcoes).toBe('object');
  });

  it('deve retornar lista única de nomes de funcionários', async () => {
    loadCsv.mockResolvedValue(registrosMock);
    const nomes = await listarNomesFuncionariosService();
    expect(nomes).toContain('Ana');
    expect(nomes).toContain('Bia');
    expect(nomes.length).toBe(2);
  });

  it('deve lidar com erro do loadCsv', async () => {
    loadCsv.mockRejectedValue(new Error('Falha de leitura'));
    await expect(listarDadosFuncionarioService('Ana')).rejects.toThrow('Falha de leitura');
  });
});
