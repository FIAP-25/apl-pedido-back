export abstract class INotificacaoHelper {
    abstract enviarEmail(destinatario: string, assunto: string, corpo: string): Promise<any>;
}
