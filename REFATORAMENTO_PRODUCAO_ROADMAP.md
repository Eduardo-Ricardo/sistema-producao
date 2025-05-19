# Roadmap: Refatoramento dos Controllers de Produção

Branch: `refactor-producao` criada ✅

Objetivo: Modularizar e limpar a pasta `producao/controllers`, separando responsabilidades e removendo duplicações.

## Estado Atual
- Branch criada: `refactor-producao`
- fileService.js criado e função `loadCsv(year)` implementada ✅
- filterService.js criado e funções de filtro implementadas ✅
- transformService.js criado e funções implementadas ✅
- Plano de atividades definido neste roadmap.

## Etapas

1. fileService (Concluído)
   - [x] Criar `producao/controllers/fileService.js`
   - [x] Implementar função `loadCsv(year)` usando `lerArquivoCSV`
   - [x] Mapear linhas CSV em objetos nomeados

2. filterService (Concluído)
   - [x] Criar `producao/controllers/filterService.js`
   - [x] Implementar `filterByEmployee(records, name)`
   - [x] Implementar `filterByDateRange(records, start, end)`

3. transformService (Concluído)
   - [x] Criar `producao/controllers/transformService.js`
   - [x] Implementar `mapToDomain(records)` para adicionar duração e flags
   - [x] Implementar `groupByDate(mapped)` para agrupamento diário
   - [x] Implementar `aggregateByFunction(mapped)` para totais e médias

4. Refatorar `producaoController.js` (Concluído)
   - [x] Orquestrar chamadas aos serviços criados
   - [x] Remover parsing manual de CSV e filtros duplicados
   - [x] Garantir consistência de formatos de data

5. Rotas e integrações (Pendente)
   - [ ] Atualizar `producao/routes/index.js` para usar novos controllers
   - [ ] Testar endpoints via Postman ou curl

6. Frontend (Pendente)
   - [ ] Ajustar chamadas em `public/js/dados.js` para novos endpoints
   - [ ] Remover filtragem extra no frontend

7. Testes (Pendente)
   - [ ] Escrever testes unitários para cada serviço em `producao/tests`
   - [ ] Validar cenários de filtro de datas e agregação

---

> Este roadmap deve guiar o refatoramento, garantindo que cada passo seja testado e integrado antes de seguir adiante.
