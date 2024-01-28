import { Categoria } from '@/domain/entity/categoria.model';
import { AutoMap } from '@automapper/classes';

export class ObterProdutoPorCategoriaOutput {
    @AutoMap()
    id: string;

    @AutoMap()
    nome: string;

    @AutoMap()
    descricao: string;

    @AutoMap()
    categoria: Categoria;

    @AutoMap()
    preco: number;
}
