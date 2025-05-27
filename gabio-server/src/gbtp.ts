
export class GBTPRequest {
    operation: string;
    account_id: string;
    to_account_id: string | void;
    value: number;

    constructor(operation: string, account_id: string, to_account_id: string | void, value: number) {
        this.operation = operation.toUpperCase();
        this.account_id = account_id.toUpperCase();
        this.to_account_id = to_account_id?.toUpperCase();
        this.value = value;
        this.validate();
    }

    public static fromString(request: string): GBTPRequest{
        const linha = request.trim().split("\n");
        let operation = linha[0].split(":")[1].trim().toUpperCase();
        let account_id = linha[1].split(":")[1].trim().toUpperCase();
        let to_account_id = linha[2].split(":")[1].trim().toUpperCase();
        let value = parseFloat(linha[3].split(":")[1].trim());
        return new GBTPRequest(operation, account_id, to_account_id, value);
    }

    private validate() {
        if(!this.operation || !this.account_id) throw new Error("Operaçã inválida");
        if(isNaN(this.value)) throw new Error ('Valor inválido');
        if(this.operation !== 'BALANCE' && this.operation !== 'DEPOSIT' && this.operation !== 'WITHDRAW' && this.operation !== 'TRANSFER'){
            throw new Error("Operação inválida");
        }
    }

    public toString(){ 
        return [
            `OPERATION:${this.operation}`,
            `ACCOUNT_ID:${this.account_id}`,
            `TO_ACCOUNT_ID:${this.to_account_id}`,
            `VALUE:${this.value}`
        ].join('\n');
    }

}

export class GBTPResult {
    status: string;
    message: string;
    balance: number;

    constructor(status: string, message: string, balance: number) {
        this.status = status;
        this.message = message;
        this.balance = balance;
        this.validate();
    }

    public static fromString(resultMessage: string): GBTPResult {
        const lines = resultMessage.trim().split('\n');
        let balance = parseFloat(lines[0].split(':')[1].trim());
        let status = lines[1].split(':')[1].trim();
        let message = lines[2].split(':')[1].trim();
        return new GBTPResult(status, message, balance);
    }

    public validate(){
        if (isNaN(this.balance)) {
            throw new Error('Resultado inválido');
        }
        if (!this.status || !this.message) {
            throw new Error('Status ou mensagem inválidos');
        }
    }

    toString() {
        return [
            `STATUS:${this.status == 'OK' ? this.balance : 'ERROR'}`,
            `MESSAGE:${this.message}`,
            `BALANCE:${this.balance}`
        ].join('\n');
    }


}