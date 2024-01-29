type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export abstract class IAxiosClient {
    abstract executarChamada(api: 'pagamento' | 'producao', method: HttpMethod, url: string, body: any): Promise<any>;
}
