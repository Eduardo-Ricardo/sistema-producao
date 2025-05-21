# Refatoração do Controller de Produção - Roadmap Detalhado

## Etapa Atual (Concluída)
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
- [x] Extrair e delegar lógica de `buscarRegistrosFuncionario` para `registroService.js`.
- [x] Garantir cobertura de testes para os serviços extraídos.
- [x] Remover testes antigos que não seguem o padrão Jest.
- [x] Garantir que apenas os testes dos serviços refatorados são executados e passam.
- [x] Expandir cobertura dos testes dos novos serviços, incluindo casos de erro e mocks.
- [x] Ajustes e melhorias nos controllers para integração com frontend refatorado.
- [x] Início da reconstrução da página ficha-funcionário: melhorias na experiência do usuário, validações de filtros, feedback visual e robustez na busca de dados.

## Próximos Passos (Prioridade)
- [ ] Finalizar reconstrução da página ficha-funcionário (frontend), seção por seção.
- [ ] Garantir integração total entre frontend e novos serviços refatorados.
- [ ] Manter padrão de controller enxuto e serviços bem documentados.
- [ ] Revisar e documentar endpoints REST e contratos de dados.
- [ ] Garantir cobertura de testes de integração (API) após ajustes no frontend.
- [ ] Atualizar este roadmap a cada etapa concluída.

## Após Refatoração
- [ ] Evoluir funcionalidades do sistema de produção com base na nova arquitetura.
- [ ] Manter documentação e testes sempre atualizados.

---

**Observação:**
- Sempre documentar funções e endpoints (JSDoc).
- Manter controller apenas com validação, chamada de serviço e resposta.
- Atualizar roadmap a cada extração/refatoração.
