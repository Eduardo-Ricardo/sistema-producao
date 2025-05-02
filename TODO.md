# Relatório e TODO - Sistema de Gestão (02/05/2025)

## Estado Atual do Sistema
- Sistema estável após restauração da versão funcional
- Prioridade atual: recuperação de funcionalidades da versão instável
- **Versões Git:**
  - Versão estável: `c8b6377` (atual)
  - Versão instável: `90ce0da` (contém funcionalidades a serem recuperadas)
  - Branch criado para mescla das versões

## Tarefas Completadas
1. [x] Restaurar funcionalidade básica do sistema
   - [x] Verificar último commit estável
   - [x] Criar branch de backup do estado atual
   - [x] Voltar para versão funcional

2. [x] Recuperar página de registro (registrar.html)
   - [x] Garantir que o dropdown de funções carregue corretamente
   - [x] Validar seleção de máquinas
   - [x] Testar registro de produção

3. [x] Recuperar página de funcionários (ficha-funcionario.html)
   - [x] Verificar carregamento de dados
   - [x] Testar filtros e visualizações

## Plano de Ação para Recuperação de Funcionalidades
1. [x] Identificar funcionalidades estáveis na versão instável (`90ce0da`)
   - [x] Interface menu, registro, dados CSV, machine_map atualizado, functionGroup
2. [ ] Mesclar funcionalidades recuperadas na branch de mescla
   - [x] Interface Menu
   - [ ] Interface Registro
   - [x] data.csv
   - [x] machineMap.json
      - [ ] Necessário atualizar nome mostrado na GUI.
   - [x] funcionGroup.json
3. [ ] Testar exaustivamente as funcionalidades mescladas
4. [ ] Realizar commit no branch principal (`main`) após validação

## Observações
- Manter backup do functionGroups.json durante o processo de atualização
- Implementar mudanças gradualmente para evitar instabilidade no sistema
- Testar exaustivamente cada nova feature antes de integrá-la ao sistema principal

## Mapeamento de Commits
- **Commit Instável:**
  - Hash: `90ce0da`
  - Descrição: Versão instável com funcionalidades adicionais, mas com instabilidades.

- **Commit Estável:**
  - Hash: `c8b6377`
  - Descrição: Versão funcional para a qual voltamos, implementa funções adicionais e sistema de lotes.

- **Commit de Recuperação:**
  - Hash: `80baae2`
  - Descrição: Recuperação da pasta public do módulo common e do arquivo 2025.csv da versão instável.

- **Commit de Recuperação da Interface:**
  - Hash: (a ser gerado)
  - Descrição: Recuperação da interface da página registrar.html da versão instável.