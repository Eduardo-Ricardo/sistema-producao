# Documentação da API

## Visão Geral
Este documento detalha as APIs disponíveis no sistema de gestão, incluindo endpoints, parâmetros e exemplos de uso.

## Módulo de Produção

### Registro de Produção
- **Endpoint**: `/api/producao/registrar`
- **Método**: POST
- **Descrição**: Registra produção diária de um funcionário
- **Parâmetros**:
  ```json
  {
    "funcionario": "string",
    "data": "YYYY-MM-DD",
    "maquina": "string",
    "quantidade": "number"
  }
  ```
- **Resposta de Sucesso**:
  ```json
  {
    "status": "success",
    "message": "Produção registrada com sucesso"
  }
  ```

### Consulta de Produção
- **Endpoint**: `/api/producao/consultar`
- **Método**: GET
- **Descrição**: Retorna dados de produção filtrados
- **Parâmetros Query**:
  - `funcionario`: Nome do funcionário (opcional)
  - `dataInicio`: Data inicial (YYYY-MM-DD)
  - `dataFim`: Data final (YYYY-MM-DD)
  - `maquina`: ID da máquina (opcional)
- **Resposta**:
  ```json
  {
    "registros": [
      {
        "funcionario": "string",
        "data": "YYYY-MM-DD",
        "maquina": "string",
        "quantidade": "number"
      }
    ]
  }
  ```

## Módulo de Fluxo de Caixa

### Registro de Transação
- **Endpoint**: `/api/caixa/registrar`
- **Método**: POST
- **Descrição**: Registra uma transação financeira
- **Parâmetros**:
  ```json
  {
    "tipo": "entrada|saida",
    "valor": "number",
    "descricao": "string",
    "data": "YYYY-MM-DD"
  }
  ```
- **Resposta de Sucesso**:
  ```json
  {
    "status": "success",
    "message": "Transação registrada"
  }
  ```

### Consulta de Transações
- **Endpoint**: `/api/caixa/consultar`
- **Método**: GET
- **Descrição**: Retorna transações financeiras
- **Parâmetros Query**:
  - `dataInicio`: Data inicial (YYYY-MM-DD)
  - `dataFim`: Data final (YYYY-MM-DD)
  - `tipo`: entrada|saida (opcional)
- **Resposta**:
  ```json
  {
    "transacoes": [
      {
        "tipo": "string",
        "valor": "number",
        "descricao": "string",
        "data": "YYYY-MM-DD"
      }
    ],
    "saldo": "number"
  }
  ```

## Códigos de Erro Comuns

- **400**: Requisição inválida
  ```json
  {
    "status": "error",
    "message": "Descrição do erro",
    "details": {}
  }
  ```

- **404**: Recurso não encontrado
  ```json
  {
    "status": "error",
    "message": "Recurso não encontrado"
  }
  ```

- **500**: Erro interno do servidor
  ```json
  {
    "status": "error",
    "message": "Erro interno do servidor"
  }
  ```

## Exemplos de Uso

### Registrar Produção
```bash
curl -X POST http://localhost:3000/api/producao/registrar \
  -H "Content-Type: application/json" \
  -d '{
    "funcionario": "João Silva",
    "data": "2025-04-22",
    "maquina": "M001",
    "quantidade": 100
  }'
```

### Consultar Fluxo de Caixa
```bash
curl "http://localhost:3000/api/caixa/consultar?dataInicio=2025-04-01&dataFim=2025-04-30"
```

## Notas de Implementação

1. Todas as datas devem estar no formato ISO (YYYY-MM-DD)
2. Valores monetários são representados em centavos
3. Autenticação será implementada em versões futuras
4. Rate limiting: 100 requisições por minuto por IP

## Manutenção e Atualizações

Este documento deve ser atualizado quando:
1. Novos endpoints são adicionados
2. Parâmetros são modificados
3. Comportamentos são alterados
4. Novas funcionalidades são implementadas