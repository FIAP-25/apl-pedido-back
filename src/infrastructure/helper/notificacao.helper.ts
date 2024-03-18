import { INotificacaoHelper } from '@/domain/contract/helper/notificacao.interface';

export class NotificacaoHelper implements INotificacaoHelper {
    async enviarEmail(destinatario: string, assunto: string, corpo: string): Promise<any> {
        console.log(`Simulando envio de e-mail para: ${destinatario}`);
        console.log(`Assunto: ${assunto}`);
        console.log(`Corpo: ${corpo}`);
        return Promise.resolve();
    }
}
