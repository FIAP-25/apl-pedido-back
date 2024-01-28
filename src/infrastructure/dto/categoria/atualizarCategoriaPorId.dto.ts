import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class AtualizarCategoriaPorIdInput {
    @AutoMap()
    @ApiProperty({ required: true })
    descricao: string;
}

export class AtualizarCategoriaPorIdOutput {
    @AutoMap()
    id: string;

    @AutoMap()
    descricao: string;
}
