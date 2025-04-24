# Guia de Desenvolvimento

## Ambiente de Desenvolvimento

### Pré-requisitos
- Node.js (versão recomendada: 18+)
- NPM ou Yarn
- Editor de código (recomendado: VS Code)
- Git para controle de versão

### Configuração Inicial
1. Clone o repositório
2. Execute `npm install` nas pastas:
   - common/
   - producao/
   - fluxo-caixa/

### Executando o Projeto
1. Use o arquivo `IniciarServidor.bat` na raiz do projeto
   ou
2. Manualmente:
   ```bash
   cd common
   node app.js
   ```

## Estrutura de Diretórios

### Módulo Common (/common)
- `app.js` - Ponto de entrada do servidor
- `routes.js` - Rotas principais
- `public/` - Arquivos estáticos compartilhados
  - CSS base e componentes reutilizáveis
  - Scripts comuns
  - Página inicial

### Módulo Produção (/producao)
- `controllers/` - Lógica de negócio
- `data/` - Arquivos CSV e configurações
- `public/` - Interface do usuário
  - HTML para diferentes visualizações
  - Scripts específicos de produção
  - Estilos específicos

### Módulo Fluxo de Caixa (/fluxo-caixa)
- `controllers/` - Rotas e lógica
- `public/` - Interface do usuário
  - Formulários de entrada/saída
  - Visualizações de relatórios

## Padrões de Código

### JavaScript
- Use const/let em vez de var
- Evite código aninhado profundo
- Documente funções complexas
- Use async/await para código assíncrono

### HTML/CSS
- Mantenha CSS modular
- Use classes semânticas
- Siga o padrão BEM para nomenclatura
- Mantenha responsividade em mente

### Organização de Arquivos
- Um arquivo por funcionalidade
- Nomes descritivos e em inglês
- Separar lógica de apresentação

## Fluxo de Trabalho

### Novo Recurso
1. Verifique o roadmap
2. Desenvolva em um módulo específico
3. Teste localmente
4. Atualize a documentação

### Correções
1. Identifique o módulo afetado
2. Faça alterações mínimas necessárias
3. Teste amplamente
4. Atualize documentação se necessário

## Melhores Práticas

### Geral
- Mantenha o código DRY (Don't Repeat Yourself)
- Comente código complexo
- Atualize a documentação junto com o código
- Faça commits pequenos e frequentes

### Frontend
- Use JavaScript modular
- Evite manipulação direta do DOM
- Mantenha consistência visual
- Implemente feedback ao usuário

### Backend
- Valide entradas de dados
- Use tratamento de erros
- Mantenha logs relevantes
- Siga princípios REST

## Resolução de Problemas

### Problemas Comuns
1. **Servidor não inicia**
   - Verifique se a porta 3000 está livre
   - Confirme que todas as dependências estão instaladas

2. **Dados não aparecem**
   - Verifique permissões de arquivo CSV
   - Confirme formato dos dados
   - Verifique console do navegador

3. **Menu não funciona**
   - Atualize a pasta common
   - Verifique conflitos de CSS
   - Confirme carregamento de scripts

## Recursos e Referências

### Documentação
- [README.md](./README.md) - Visão geral
- [architecture.md](./architecture.md) - Arquitetura
- [roadmap.md](./roadmap.md) - Planejamento

### Links Úteis
- [Node.js Docs](https://nodejs.org/docs)
- [Express.js Guide](https://expressjs.com/guide)
- [CSV Parsing](https://www.npmjs.com/package/csv-parse)

## Contatos e Suporte

Para questões relacionadas ao desenvolvimento, use:
1. Documentação em /docs
2. Issues no repositório
3. Comunicação direta com a equipe

## Atualizações do Guia
Este guia deve ser atualizado sempre que:
- Novos padrões são estabelecidos
- Processos mudam
- Novas ferramentas são adotadas