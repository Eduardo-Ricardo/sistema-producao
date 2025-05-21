# Refatoração do registrar-funcao.js e public/js - Roadmap Detalhado

## Diagnóstico
- O arquivo `registrar-funcao.js` está grande, com múltiplas responsabilidades (UI, calendário, integração backend, regras de negócio).
- Funções de calendário duplicadas em relação a `calendario.js`.
- Lógica de funções/máquinas pode ser reaproveitada em outros módulos.
- Algumas regras de negócio deveriam estar no backend/services.

## Padrão de comportamento da refatoração
- Cada etapa do roadmap deve ser realizada de forma incremental, com commit ao final de cada etapa.
- O roadmap deve ser atualizado a cada iteração, refletindo o status de cada item.
- O branch dedicado para a refatoração é `refactor-registrar-funcao`.
- Sempre remover comentários redundantes e manter apenas documentação JSDoc padronizada antes das funções exportadas.
- O processo deve ser rastreável, com histórico de commits claros e descritivos.
- [ANOTAÇÃO] Após cada etapa/subetapa, atualizar o roadmap antes de realizar o commit, para garantir rastreabilidade e não se perder no fluxo.

## Plano de Ação
1. **Mapear e migrar funções de calendário**
   - [x] Identificar funções duplicadas (`getDiasNoMes`, `getPrimeiroDiaSemana`, `ehFimDeSemana`, `dataExisteEmRegistros`, `gerarCalendarioRegistro`).
   - [x] Migrar/centralizar essas funções em `calendario.js`.
   - [x] Adaptar `registrar-funcao.js` para consumir apenas funções exportadas de `calendario.js` e remover implementações duplicadas. (Etapa concluída: duplicidade removida, chamadas adaptadas, JSDoc centralizada)
   - [x] Remover comentários redundantes e padronizar documentação JSDoc em todas as funções do arquivo.

2. **Criar módulo para funções/máquinas**
   - [x] Extrair funções como `encontrarMaquina`, `getFuncoesDaMaquina`, `atualizarOpcoesDisponiveisParaFuncoesAdicionais`, `adicionarFuncaoAdicional` para um novo arquivo (ex: `funcoes-maquinas.js`).
   - [x] Adaptar `registrar-funcao.js` para importar/utilizar esse novo módulo. (Etapa concluída: imports e chamadas adaptadas para o novo módulo)

3. **Manter registrar-funcao.js focado em UI e integração**
   - [ ] Deixar apenas inicialização, configuração de eventos, coleta de dados do formulário e integração com backend.
   - [ ] Garantir que toda lógica de negócio crítica esteja validada também no backend.

4. **Revisar e documentar**
   - [ ] Garantir documentação JSDoc em todos os arquivos e funções exportadas.
   - [ ] Atualizar testes e exemplos de uso, se necessário.

5. **Testar e validar**
   - [ ] Testar a integração entre os módulos refatorados.
   - [ ] Garantir que a experiência do usuário permaneça igual ou melhor.

---
**Observação:**
- Refatoração será feita no branch `refactor-registrar-funcao`.
- Atualizar este roadmap a cada etapa concluída.
