import { AutoMap } from '@automapper/classes';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AdicionarClienteInput {
    @AutoMap()
    @ApiProperty({ required: true })
    cpf: number;

    @AutoMap()
    @ApiPropertyOptional()
    email: string;

    @AutoMap()
    @ApiProperty({ required: true })
    nomeCompleto: string;
}

export class AdicionarClienteOutput {
    @AutoMap()
    cpf: string;

    @AutoMap()
    email: string;

    @AutoMap()
    nomeCompleto: string;
}
