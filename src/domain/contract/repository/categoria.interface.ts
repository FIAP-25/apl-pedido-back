import { Categoria } from '@/domain/entity/categoria.model';

export abstract class ICategoriaRepository {
    abstract find(): Promise<Categoria[]>;
    abstract findById(id: string): Promise<Categoria>;
    abstract save(categoria: Categoria): Promise<Categoria>;
    abstract saveMany(categoria: Categoria[]): Promise<Categoria[]>;
    abstract remove(id: string): Promise<void>;

    abstract initialPopulate(): Promise<void>;
}
