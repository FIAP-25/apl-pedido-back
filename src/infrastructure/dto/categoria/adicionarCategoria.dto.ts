import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class AdicionarCategoriaInput {
    @AutoMap()
    @ApiProperty({ required: true })
    descricao: string;
}

export class AdicionarCategoriaOutput {
    @AutoMap()
    id: string;

    @AutoMap()
    descricao: string;
}
