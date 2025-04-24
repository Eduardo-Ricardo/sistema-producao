# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Não Lançado]

### Adicionado
- Sistema de documentação expandido na pasta /docs
- Guia de desenvolvimento detalhado
- Documentação da API
- Registro detalhado de mudanças (este arquivo)

### Corrigido
- Problemas identificados no menu principal (em andamento)

### Alterado
- Estrutura da documentação reorganizada
- Melhorias no roadmap do projeto

## [1.0.0] - 2025-04-22

### Adicionado
- Funcionalidade básica do módulo de produção
  - Registro de produção diária
  - Visualização de dados por funcionário
  - Sistema de filtros inicial
- Interface inicial do módulo de fluxo de caixa
- Servidor Node.js com Express
- Estrutura modular do projeto

### Tecnologias Base
- Backend: Node.js com Express
- Frontend: HTML, CSS e JavaScript vanilla
- Armazenamento: Sistema de arquivos (CSV)

## Guia de Versionamento

- Versão MAJOR (X.0.0) - Mudanças incompatíveis com versões anteriores
- Versão MINOR (0.X.0) - Adição de funcionalidades mantendo compatibilidade
- Versão PATCH (0.0.X) - Correções de bugs mantendo compatibilidade

## Convenções de Commit

Para manter o changelog atualizado, usar os seguintes prefixos nos commits:

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Alterações na documentação
- `style:` Formatação, ponto e vírgula, etc; sem alteração de código
- `refactor:` Refatoração de código
- `test:` Adição ou correção de testes
- `chore:` Atualização de tarefas, sem alteração no código de produção