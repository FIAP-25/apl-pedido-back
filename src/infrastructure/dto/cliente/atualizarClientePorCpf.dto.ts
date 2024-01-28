import { AutoMap } from '@automapper/classes';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class AtualizarClientePorCpfInput {
    cpf?: string;

    @AutoMap()
    @ApiPropertyOptional()
    email: string;

    @AutoMap()
    @ApiPropertyOptional()
    nomeCompleto: string;
}

export class AtualizarClientePorCpfOutput {
    @AutoMap()
    cpf: string;

    @AutoMap()
    email: string;

    @AutoMap()
    nomeCompleto: string;
}
