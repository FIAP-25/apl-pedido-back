import { AutoMap } from '@automapper/classes';
import { validarCPF } from '../validation/validarCPF.validation';
import { ErroNegocio } from '../exception/erro.module';
import { validarEmail } from '../validation/validarEmail.validation';

export class Cliente {
    @AutoMap()
    cpf: string;

    @AutoMap()
    email: string;

    @AutoMap()
    nomeCompleto: string;

    @AutoMap()
    token: string;

    validarClienteAdicionar(): boolean {
        if (!validarCPF(this.cpf)) throw new ErroNegocio('cliente-cpf-invalido');

        if (this.email) {
            if (!validarEmail(this.email)) throw new ErroNegocio('cliente-email-invalido');
        }

        if (this.nomeCompleto.length <= 2) throw new ErroNegocio('cliente-nome-invalido');

        return true;
    }

    validarClienteAtualizar(): boolean {
        if (!validarEmail(this.email)) throw new ErroNegocio('cliente-email-invalido');

        if (this.nomeCompleto.length <= 2) throw new ErroNegocio('cliente-nome-invalido');

        return true;
    }
}
