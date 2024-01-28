import { mapper } from '@/application/mapper/base.mapper';
import { Produto } from '@/domain/entity/produto.model';
import { IProdutoRepository } from '@/domain/contract/repository/produto.interface';
import { ProdutoEntity } from '@/infrastructure/entity/produto.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere } from 'typeorm';
import { Repository } from 'typeorm/repository/Repository';

@Injectable()
export class ProdutoRepository implements IProdutoRepository {
    constructor(
        @InjectRepository(ProdutoEntity)
        private repository: Repository<ProdutoEntity>
    ) {}

    async find(): Promise<Produto[]> {
        const produto = await this.repository.find();
        return mapper.mapArray(produto, ProdutoEntity, Produto);
    }

    async findById(id: string): Promise<Produto> {
        const produto = await this.repository.findOneBy({ id: id });
        return mapper.map(produto, ProdutoEntity, Produto);
    }

    async findBy(where: FindOptionsWhere<ProdutoEntity>): Promise<Produto[]> {
        const produtos = await this.repository.find({
            where: where,
            relations: {
                categoria: true
            }
        });

        return mapper.mapArray(produtos, ProdutoEntity, Produto);
    }

    async save(produto: Produto): Promise<Produto> {
        const resultado = await this.repository.save(produto);
        return resultado;
    }

    async saveMany(produtos: Produto[]): Promise<Produto[]> {
        const resultado = await this.repository.save(produtos);
        return resultado;
    }

    async remove(id: string): Promise<void> {
        await this.repository.delete(id);
    }
}
