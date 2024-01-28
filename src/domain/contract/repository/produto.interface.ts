import { Produto } from '@/domain/entity/produto.model';
import { ProdutoEntity } from '@/infrastructure/entity/produto.entity';
import { FindOptionsWhere } from 'typeorm';

export abstract class IProdutoRepository {
    abstract find(): Promise<Produto[]>;
    abstract findById(id: string): Promise<Produto>;
    abstract findBy(where: FindOptionsWhere<ProdutoEntity>): Promise<Produto[]>;
    abstract save(produto: Produto): Promise<Produto>;
    abstract saveMany(produto: Produto[]): Promise<Produto[]>;
    abstract remove(id: string): Promise<void>;
}
