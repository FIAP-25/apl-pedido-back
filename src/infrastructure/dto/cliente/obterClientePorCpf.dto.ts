import { AutoMap } from '@automapper/classes';

export class ObterClientePorCpfOutput {
    @AutoMap()
    cpf: string;

    @AutoMap()
    email: string;

    @AutoMap()
    nomeCompleto: string;
}
