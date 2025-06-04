
# Banco em Rede com Protocolo GBTP

Este projeto é um exemplo educacional para a disciplina de Redes de Computadores, demonstrando a implementação de um sistema bancário simples em rede no modelo cliente-servidor, utilizando TypeScript. O cliente se conecta ao servidor via WebSocket, utilizando um protocolo de aplicação próprio chamado **GBTP**. Este projeto contempla exclusivamente o desenvolvimento da parte back-end da aplicação, sendo o desenvolvimento do front-end de responsabilidade de outros grupos.

## ✅ Objetivo

- Apresentar conceitos de comunicação entre cliente e servidor.
- Demonstrar a criação de um protocolo de aplicação específico.
- Ilustrar o uso de WebSockets para troca de mensagens em tempo real.
- Fornecer um exemplo prático para implementação em sala de aula.

## ✅ Estrutura do Projeto

```
/gabio-server       # Projeto do servidor (Node.js com TypeScript)
README.md          # Documentação do projeto
```

## ✅ gbtp-server

- Servidor Node.js que aceita conexões WebSocket.
- Recebe mensagens no formato **GBTP**, processa operações bancárias e responde com resultados formatados.
- Mantém contas fictícias em memória para simulação das operações.

## ✅ Protocolo de Aplicação: GBTP

O protocolo **GBTP** (Generic Banking Transfer Protocol) define a troca de mensagens entre cliente e servidor.

### ➡️ Solicitação GBTP

Representa uma requisição de operação bancária:

```typescript
export class GBTPRequest {
  operation: string;  // BALANCE | DEPOSIT | WITHDRAW | TRANSFER
  account_id: string;
  to_account_id: string | void;
  value: number;

  constructor(operation: string, account_id: string, to_account_id: string | void, value: number) { ... }

  public static fromString(request: string): GBTPRequest { ... }

  public toString(): string {
    return [
      \`OPERATION:\${this.operation}\`,
      \`ACCOUNT_ID:\${this.account_id}\`,
      \`TO_ACCOUNT_ID:\${this.to_account_id}\`,
      \`VALUE:\${this.value}\`
    ].join('\n');
  }
}
```

**Formato da mensagem:**

```
OPERATION:<BALANCE|DEPOSIT|WITHDRAW|TRANSFER>
ACCOUNT_ID:<identificador da conta de origem>
TO_ACCOUNT_ID:<identificador da conta de destino ou vazio>
VALUE:<valor numérico>
```

### ➡️ Resultado GBTP

Representa o resultado da operação bancária:

```typescript
export class GBTPResult {
  status: string;    // OK | ERROR
  message: string;
  balance: number;

  constructor(status: string, message: string, balance: number) { ... }

  public static fromString(resultMessage: string): GBTPResult { ... }

  public toString() {
        return [
            `STATUS: ${this.status}`,
            `MESSAGE: ${this.message}`,
            `BALANCE: ${this.balance}`
        ].join('\n');
    }
}
```

**Formato da mensagem de resposta:**

```
STATUS:<OK ou ERROR>
MESSAGE:<mensagem descritiva>
BALANCE:<saldo atual ou -1(conta não encontrada)>
```

## ✅ Operações Suportadas

| Operação   | Descrição                                                  |
|------------|------------------------------------------------------------|
| BALANCE    | Consulta o saldo da conta especificada.                   |
| DEPOSIT    | Realiza um depósito na conta especificada.                |
| WITHDRAW   | Realiza um saque na conta especificada.                   |
| TRANSFER   | Transfere valor de uma conta de origem para uma de destino.|

## ✅ Como Executar

### Servidor

```bash
cd gabio-server
npm install
npm run build
npm start
```

O servidor será iniciado e aguardará conexões WebSocket na porta padrão configurada no código **(8080)**.

## ✅ Como Testar

- Conecte-se ao servidor com qualquer cliente WebSocket (por exemplo: `websocat`, `Postman` ou um cliente próprio em HTML/JS).
- Envie mensagens no formato GBTP conforme o protocolo descrito acima.
- Receba respostas formatadas automaticamente com o resultado da operação.

## ✅ Exemplo de Mensagem de Requisição

```
OPERATION:DEPOSIT
ACCOUNT_ID:1001
TO_ACCOUNT_ID:
VALUE:100
```

## ✅ Exemplo de Mensagem de Resposta

```
STATUS:OK
MESSAGE:Depósito realizado com sucesso
BALANCE:600
```

## ✅ Licença

Licença MIT
