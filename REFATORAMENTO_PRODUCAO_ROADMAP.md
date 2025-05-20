# Roadmap do Sistema de Gestão - Nova Fase

## Fase 1: Refatoração do Controller de Produção

### Objetivo
- Tornar o arquivo `producaoController.js` enxuto, com responsabilidades bem definidas e toda lógica de negócio delegada para serviços.
- Facilitar manutenção, testes e evolução do sistema.

### Tarefas
- [ ] Extrair lógica de leitura, parsing, filtragem e agregação para serviços dedicados.
- [ ] Criar serviços para:
  - [ ] Gestão de registros de produção (CRUD, busca, agrupamento)
  - [ ] Gestão de funcionários (listagem, cadastro, etc.)
  - [ ] Gestão de lotes (já parcialmente feito)
- [ ] Manter o controller apenas como orquestrador de requisições e respostas.
- [ ] Documentar todos os serviços e controllers.
- [ ] Garantir cobertura de testes para os serviços extraídos.

---

## Fase 2: Reconstrução da Página Ficha-Funcionário

### Funcionalidades Essenciais a Manter e Aprimorar

- **Calendário de Registros**
  - Visualização mensal destacando dias com e sem registro de produção.
  - Ao clicar em um dia, exibir detalhes da produção daquele dia.

- **Seção Resumo**
  - Total de dias úteis do mês corrente
  - Total de dias com registro
  - Média por hora das 3 principais funções
  - Média de produção diária
  - Comparação com a meta estabelecida (percentual atingido, barra de progresso, etc.)
  - Comparação da produção da semana (atual vs anterior)
  - Comparação da produção mensal (atual vs anterior)

- **Tabela Detalhada por Dia**
  - Listar cada dia do mês/período filtrado
  - Para cada dia, apresentar todas as funções executadas, quantidade de cada função, horários, duração, etc.

---

### 1. Análise e Design (Semana 1)
- [ ] Identificar todos os problemas da página atual
- [ ] Documentar bugs de cálculo e lógica
- [ ] Mapear falhas na apresentação visual
- [ ] Listar funcionalidades ausentes ou incompletas
- [ ] Criar design da nova interface
- [ ] Desenhar wireframes da nova página
- [ ] Definir componentes visuais (tabelas, gráficos, filtros)
- [ ] Projetar visualizações comparativas (metas vs produção real)

### 2. Backend de Suporte (Semana 1-2)
- [ ] Ampliar os serviços existentes no backend
- [ ] Adicionar endpoint para comparação de períodos (semana vs semana, mês vs mês)
- [ ] Desenvolver endpoint para metas de produção por funcionário/função
- [ ] Criar serviço de estatísticas comparativas entre funcionários
- [ ] Validar cálculos de somas e médias no backend
- [ ] Corrigir cálculos de produtividade por hora
- [ ] Implementar cálculos precisos de médias de produção por dia/semana/mês
- [ ] Adicionar testes para garantir precisão dos cálculos

### 3. Implementação do Frontend (Semana 2-3)
- [ ] Criar estrutura HTML limpa e modular
- [ ] Seção de resumo de produção no topo
- [ ] Visualização detalhada por dia/função
- [ ] Área de comparação com metas
- [ ] Filtros intuitivos por período
- [ ] Implementar visualização de dados
- [ ] Tabelas responsivas com totalizadores corretos
- [ ] Gráficos de produção por dia/semana
- [ ] Indicadores visuais de desempenho vs meta
- [ ] Adicionar funcionalidades avançadas
- [ ] Comparação entre funcionários
- [ ] Análise histórica de produção
- [ ] Exportação de dados/relatórios

### 4. Integração e Testes (Semana 3)
- [ ] Conectar frontend aos endpoints do backend
- [ ] Implementar tratamento de erros e estados de carregamento
- [ ] Realizar testes completos com diferentes cenários de dados
- [ ] Validar cálculos exibidos na interface vs esperados

---

## Fase 3: Documentação e Apresentação

### 1. Documentação Técnica (Semana 4)
- [ ] Atualizar documentação na pasta `docs`
- [ ] Diagrama da arquitetura atualizada
- [ ] Documentação de todos os endpoints do backend
- [ ] Manual técnico da estrutura de dados e cálculos
- [ ] Documentar o frontend
- [ ] Descrever componentes e suas responsabilidades
- [ ] Explicar interações e fluxos de dados
- [ ] Criar guia para futuras modificações

### 2. Material para Apresentação (Semana 4)
- [ ] Preparar apresentação visual do sistema
- [ ] Screenshots das telas principais
- [ ] Fluxogramas de processos-chave
- [ ] Exemplos de uso com dados reais
- [ ] Criar demonstração interativa
- [ ] Roteiro da apresentação
- [ ] Casos de uso para demonstração
- [ ] Dados de teste representativos

---

## Fase 4: Módulo de Gerenciamento de Lotes (Futuro)
- [ ] Analisar problemas do módulo atual
- [ ] Redesenhar fluxo de criação e gestão de lotes
- [ ] Implementar novo backend para lotes
- [ ] Criar nova interface para gerenciamento

## Fase 5: Módulo de Gerenciamento de Funcionários (Futuro)
- [ ] Desenvolver sistema de cadastro de funcionários
- [ ] Implementar gestão de metas por funcionário
- [ ] Criar visualizações de desempenho comparativo
- [ ] Integrar com o módulo de produção