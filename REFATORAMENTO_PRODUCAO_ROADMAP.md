# Refatoramento Produção - Roadmap

## Etapas

1. **Mapear responsabilidades do controller de produção**
   - [x] Analisar e documentar funções e responsabilidades do controller original.

2. **Criar serviços separados**
   - [x] Criar `fileService.js` para leitura e mapeamento do CSV.
   - [x] Criar `filterService.js` para filtros por funcionário e data.
   - [x] Criar `transformService.js` para mapeamento, agrupamento e agregação.

3. **Refatorar controller para usar serviços**
   - [x] Refatorar `producaoController.js` para orquestrar os serviços, eliminando parsing manual e duplicações.

4. **Atualizar rotas e integração global**
   - [x] Atualizar rotas em `producao/routes/index.js`, `common/routes.js` e `common/app.js` para garantir integração com os novos controllers/serviços.

5. **Testar endpoints**
   - [x] Testar todos os endpoints principais via Postman e PowerShell (`Invoke-RestMethod`).

6. **Refatorar frontend para consumir dados processados**
   - [x] Remover lógica de filtragem, agrupamento e transformação de dados do frontend (`ui.js`, `filtros.js`).
   - [x] Garantir que o frontend apenas exiba os dados já processados vindos do backend.
   - [x] Adicionar comentários nos arquivos JS do frontend indicando que não há mais processamento de dados local.
   - [x] Validar integração frontend-backend.

---

## Próximas etapas

7. **Testes unitários avançados**
   - [ ] Escrever testes unitários mais completos para cada serviço em `producao/tests/`.
   - [ ] Validar cenários de filtro de datas e agregação.

8. **Ajustes finos e documentação**
   - [ ] Realizar eventuais ajustes finos de integração frontend-backend conforme evolução do sistema.
   - [ ] Atualizar documentação técnica e de uso.

---

## Observações
- A pasta `producao/utils/` foi mantida para centralizar utilidades de leitura de arquivos.
- Todos os commits até a etapa 6 foram realizados na branch `refactor-producao`.
- O sistema está pronto para avançar para a etapa de testes unitários avançados e ajustes finos.
