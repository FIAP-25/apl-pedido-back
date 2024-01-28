import { Categoria } from '@/domain/entity/categoria.model';
import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class AtualizarProdutoPorIdInput {
    @AutoMap()
    id: string;

    @AutoMap()
    @ApiProperty({ required: true })
    nome: string;

    @AutoMap()
    @ApiProperty({ required: true })
    descricao: string;

    @ApiProperty({ required: true })
    categoriaId: string;

    @AutoMap()
    @ApiProperty({ required: true })
    preco: number;
}

export class AtualizarProdutoPorIdOutput {
    @AutoMap()
    id: string;

    @AutoMap()
    descricao: string;

    @AutoMap()
    categoria: Categoria;

    @AutoMap()
    preco: number;
}
