import { Categoria } from '@/domain/entity/categoria.model';
import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class AdicionarProdutoInput {
    @AutoMap()
    @ApiProperty({ required: true })
    descricao: string;

    @AutoMap()
    @ApiProperty({ required: true })
    nome: string;

    @ApiProperty({ required: true })
    categoriaId: string;

    @AutoMap()
    @ApiProperty({ required: true })
    preco: number;
}

export class AdicionarProdutoOutput {
    @AutoMap()
    id: string;

    @AutoMap()
    descricao: string;

    @AutoMap()
    nome: string;

    @AutoMap()
    categoria: Categoria;

    @AutoMap()
    preco: number;
}
