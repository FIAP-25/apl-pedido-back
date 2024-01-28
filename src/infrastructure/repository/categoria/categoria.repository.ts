import { mapper } from '@/application/mapper/base.mapper';
import { Categoria } from '@/domain/entity/categoria.model';
import { ICategoriaRepository } from '@/domain/contract/repository/categoria.interface';
import { CategoriaEntity } from '@/infrastructure/entity/categoria.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';

@Injectable()
export class CategoriaRepository implements ICategoriaRepository {
    constructor(
        @InjectRepository(CategoriaEntity)
        private repository: Repository<CategoriaEntity>
    ) {}

    async find(): Promise<Categoria[]> {
        const categoria = await this.repository.find();
        return mapper.mapArray(categoria, CategoriaEntity, Categoria);
    }

    async findById(id: string): Promise<Categoria> {
        const categoria = await this.repository.findOneBy({ id: id });
        return mapper.map(categoria, CategoriaEntity, Categoria);
    }

    async save(categoria: Categoria): Promise<Categoria> {
        const resultado = await this.repository.save(categoria);
        return resultado;
    }

    async saveMany(categorias: Categoria[]): Promise<Categoria[]> {
        const resultado = await this.repository.save(categorias);
        return resultado;
    }

    async remove(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    async initialPopulate(): Promise<void> {
        let categorias: Categoria[] = [];
        const categoriasBase = ['Lanches', 'Bebida', 'Sobremesa', 'Acompanhamento'];
        categorias = categoriasBase.map((descricao) => {
            const categoria = new Categoria();
            categoria.descricao = descricao;
            return categoria;
        });

        await this.saveMany(categorias)
            .then(() => {
                console.log('[Database]: Categorias iniciais incluídas com sucesso!');
            })
            .catch((error) => {
                console.log('[Database]: Categorias iniciais já existem! - ', error.code);
            });
    }
}
