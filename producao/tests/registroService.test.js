const { buscarRegistrosFuncionarioService } = require('../services/registroService');

const registrosMock = [
  { employeeName: 'Ana', productionDate: '01/05' },
  { employeeName: 'Bia', productionDate: '02/05' }
];

describe('registroService', () => {
  it('deve retornar registros filtrados para funcionário existente', async () => {
    const lerRegistrosMock = () => registrosMock;
    const resultado = await buscarRegistrosFuncionarioService('Ana', lerRegistrosMock);
    expect(resultado).toEqual([
      { employeeName: 'Ana', productionDate: '01/05' }
    ]);
  });

  it('deve retornar array vazio para funcionário inexistente', async () => {
    const lerRegistrosMock = () => registrosMock;
    const resultado = await buscarRegistrosFuncionarioService('Carlos', lerRegistrosMock);
    expect(resultado).toEqual([]);
  });

  it('deve retornar array vazio se lerRegistros lançar erro', async () => {
    const lerRegistrosMock = () => { throw new Error('Falha de leitura'); };
    const resultado = await buscarRegistrosFuncionarioService('Ana', lerRegistrosMock);
    expect(resultado).toEqual([]);
  });
});
