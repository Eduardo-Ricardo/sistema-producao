# Problemas Conhecidos e Soluções

## Problemas Ativos

### 1. Menu Principal não Funciona Corretamente
**Status**: Em investigação  
**Módulo**: common  
**Impacto**: Alto  
**Descrição**: O menu principal da aplicação não está funcionando após atualizações recentes.  
**Solução Temporária**: Acessar as páginas diretamente por URL.  
**Próximos Passos**: Atualizar a pasta common conforme mencionado em Importante.txt.

### 2. Filtros de Dados com Comportamento Inconsistente
**Status**: Identificado  
**Módulo**: producao  
**Impacto**: Médio  
**Descrição**: Os filtros de visualização de dados às vezes não mostram todos os resultados esperados.  
**Solução Temporária**: Limpar os filtros e aplicar novamente.  
**Próximos Passos**: Refatorar o sistema de filtros (planejado para v1.5).

### 3. Fluxo de Caixa em Desenvolvimento
**Status**: Planejado  
**Módulo**: fluxo-caixa  
**Impacto**: Médio  
**Descrição**: Módulo ainda não está completamente funcional.  
**Solução Temporária**: Usar planilhas externas para controle financeiro.  
**Próximos Passos**: Implementação completa planejada para v2.0.

## Problemas Resolvidos

### 1. Servidor Node.js Iniciando
**Versão Resolvida**: 1.0.0  
**Solução**: Ajuste nas dependências e correção do script de inicialização.

### 2. Registro de Produção
**Versão Resolvida**: 1.0.0  
**Solução**: Implementação do sistema de armazenamento em CSV.

## Dicas de Solução de Problemas

### Geral
1. Limpar cache do navegador
2. Verificar console do navegador (F12)
3. Reiniciar o servidor Node.js
4. Verificar logs do servidor

### Específicos por Módulo

#### Módulo de Produção
1. Verificar permissões dos arquivos CSV
2. Confirmar formato correto dos dados
3. Validar mapeamento de máquinas

#### Módulo de Fluxo de Caixa
1. Aguardar implementação completa
2. Usar sistema alternativo temporariamente

## Relatando Novos Problemas

Ao identificar um novo problema:

1. Verificar se já não está listado aqui
2. Coletar informações relevantes:
   - Módulo afetado
   - Passos para reproduzir
   - Comportamento esperado vs atual
   - Logs de erro (se disponíveis)
3. Documentar no formato padrão usado neste arquivo
4. Atualizar o CHANGELOG.md se necessário

## Atualizações

Este documento deve ser atualizado quando:
1. Novos problemas são identificados
2. Problemas existentes são resolvidos
3. Soluções temporárias são descobertas
4. Informações de impacto mudam