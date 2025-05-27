export class Account {
    constructor(
        public id: string,
        public saldo: number
    ) {}

    public deposito(quantia: number) {
        this.saldo += quantia;
    }

    public saque(quantia: number) {
        if(quantia > this.saldo) throw new Error('Saldo insuficiente');
        this.saldo -= quantia;
    }
}

export class AccountRepository {
    private accounts: Map<string, Account> = new Map();

    constructor() {
        // Inicializar contas fictícias
        this.accounts.set('1001', new Account('1001', 500));
        this.accounts.set('1002', new Account('1002', 300));
        this.accounts.set('1003', new Account('1003', 700));
    }

    find(id: string): Account | undefined {
        return this.accounts.get(id);
    }
}


