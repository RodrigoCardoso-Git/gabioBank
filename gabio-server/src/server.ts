import { ServerComunicador } from "./server-comunicador";
import { AccountRepository } from "./banco";

const repositorioBanco: AccountRepository = new AccountRepository();

/** Porta em que o servidor irá escutar */
const PORT = 8080;

/** Instância do servidor de comunicação */
const server : ServerComunicador = new ServerComunicador(repositorioBanco);

/** Inicia o servidor na porta especificada */
server.start(PORT);