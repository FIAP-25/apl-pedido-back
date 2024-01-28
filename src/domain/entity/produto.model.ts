import { AutoMap } from '@automapper/classes';
import { Categoria } from './categoria.model';
import { ErroNegocio } from '../exception/erro.module';

export class Produto {
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

    validarProduto(): boolean {
        if (this.nome === '' || this.nome === undefined) throw new ErroNegocio('produto-nome-vazio');

        if (this.preco <= 0) throw new ErroNegocio('produto-preco-menor-zero');
        if (!this.categoria) throw new ErroNegocio('produto-sem-categoria');
        return true;
    }
}
