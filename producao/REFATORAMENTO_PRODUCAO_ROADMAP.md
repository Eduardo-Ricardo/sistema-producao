# Refatoração do Controller de Produção - Roadmap Detalhado

## Etapa Atual (Em Progresso)
- [x] Extrair lógica de ficha do funcionário para `services/fichaFuncionarioService.js` (resumo e calendário).
- [x] Refatorar endpoints de ficha do funcionário para delegar ao serviço.
- [x] Documentar controller e serviços extraídos.
- [x] Criar `services/registroService.js` e iniciar extração incremental de métodos.
- [x] Definir plano incremental para extração de métodos do controller para serviços.
- [x] Extrair e delegar lógica de `carregarUltimoRegistro` para `registroService.js`.
- [x] Extrair e delegar lógica de `listarDadosFuncionario` para `funcionarioService.js`.
- [x] Extrair e delegar lógica de `listarNomesFuncionarios` para `funcionarioService.js`.
- [x] Extrair e delegar lógica de `listarProducao` para `registroService.js`.
- [x] Criar serviço dedicado para lotes (`loteService.js`) e delegar atualização de lotes.

## Próximos Passos (Prioridade)
- [ ] Extrair lógica de `buscarRegistrosFuncionario` para `registroService.js`:
    - Serviço retorna registros filtrados para o funcionário.
    - Controller apenas responde.
    - Documentar serviço e controller.
- [ ] Garantir cobertura de testes para os serviços extraídos.
- [ ] Atualizar este roadmap a cada etapa concluída.

## Após Refatoração
- [ ] Avançar para reconstrução da página ficha-funcionário (frontend).
- [ ] Manter padrão de controller enxuto e serviços bem documentados.

---

**Observação:**
- Sempre documentar funções e endpoints (JSDoc).
- Manter controller apenas com validação, chamada de serviço e resposta.
- Atualizar roadmap a cada extração/refatoração.
