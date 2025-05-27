import { WebSocketServer, WebSocket  } from "ws";
import http from 'http';
import { GBTPRequest, GBTPResult } from "./gbtp";
import { Account, AccountRepository } from "./banco";

export class ServerComunicador {

    private httpServer;
    
    private wss;

    private repositorio: AccountRepository;

    constructor(repo: AccountRepository) {

        this.repositorio = repo;

        //criar o servidor http
        this.httpServer = http.createServer((_, res) => {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('WebSocket server is running');
        });

        //criar o servidor websocket
        this.wss = new WebSocketServer({ server: this.httpServer });
        this.setupWebSocketServerConnection();
    }

    public start(port: number) {
        this.httpServer.listen(port, () => {
            console.log(`Servidor WebSocket ouvindo na porta ${port}`);
        });
    }

    private setupWebSocketServerConnection() {
        this.wss.on('connection', (ws: WebSocket) => {
            console.log('Novo cliente conectado');
            this.setupWebSocketMessageHandler(ws);
            this.setupWebSocketCloseHandler(ws);
        });
    }

    private setupWebSocketMessageHandler(ws: WebSocket) {
        ws.on('message', (data) => {
            const msg = data.toString().trim();

            // Se a mensagem for vazia, fecha a conexão
            if (msg === '') {
                ws.close();
                return;
            }

            // Se for uma requisição CNET
            try {
                const requestCNET: GBTPRequest = GBTPRequest.fromString(msg);
                const responseCNET = this.processGBTPRequest(requestCNET);
                ws.send(responseCNET.toString());
            } catch (err: any) {
                const responseCNET = new GBTPResult('ERROR', err.message, -1);
                ws.send(responseCNET.toString());
            }
        });
    }

    private processGBTPRequest(request: GBTPRequest): GBTPResult{
        const account_id: string = request.account_id;
        const value: number = request.value;
        const operation: string = request.operation;
        const to_account_id: string | void = request.to_account_id;
        const account: Account | undefined = this.repositorio.find(account_id);

        if (!account) {
            return new GBTPResult ('ERROR', 'Conta de origem não encontrada', -1);
        }
        if (value < 0) {
            return new GBTPResult('ERROR','Valor não pode ser negativo', account.saldo);
        }

        switch (operation) {
            case 'BALANCE':
                return new GBTPResult('OK', 'Saldo consultado com sucesso', account.saldo);
            case 'DEPOSIT':
                account.deposito(value);
                return new GBTPResult('OK', 'Depósito realizado com sucesso',account.saldo);
            case 'WITHDRAW':
                account.saque(value);
                return new GBTPResult('OK','Saque efetuado', account.saldo);
            case 'TRANSFER':
                if (account.id === to_account_id) {
                    return new GBTPResult('ERROR', 'Conta de origem e destino devem ser diferentes', -1);
                }
                if(typeof to_account_id != 'undefined') {
                    const toAcc = this.repositorio.find(to_account_id);
                    if (!toAcc) return new GBTPResult('ERROR', 'Conta de destino inexistente', -1);
                    account.saque(value);
                    toAcc.deposito(value);
                } 
                return new GBTPResult('OK', 'Transferência concluída', account.saldo);
            default:
                return new GBTPResult('ERROR', 'Operação inválida', account.saldo);
        }
    }

    private setupWebSocketCloseHandler(ws: WebSocket) {
        ws.on('close', () => {
            console.log('Cliente desconectado');
        });
    }
}