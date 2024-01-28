import { AutoMap } from '@automapper/classes';

export class ObterClientesOutput {
    @AutoMap()
    cpf: string;

    @AutoMap()
    email: string;

    @AutoMap()
    nomeCompleto: string;
}
