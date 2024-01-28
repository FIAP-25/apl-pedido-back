import { AdicionarCategoriaInput, AdicionarCategoriaOutput } from '@/infrastructure/dto/categoria/adicionarCategoria.dto';
import { AtualizarCategoriaPorIdInput, AtualizarCategoriaPorIdOutput } from '@/infrastructure/dto/categoria/atualizarCategoriaPorId.dto';
import { ObterCategoriaPorIdOutput } from '@/infrastructure/dto/categoria/obterCategoriaPorId.dto';
import { ObterCategoriasOutput } from '@/infrastructure/dto/categoria/obterCategorias.dto';

export abstract class ICategoriaUseCase {
    abstract adicionarCategoria(input: AdicionarCategoriaInput): Promise<AdicionarCategoriaOutput>;
    abstract removerCategoriaPorId(id: string): Promise<void>;
    abstract atualizarCategoriaPorId(id: string, input: AtualizarCategoriaPorIdInput): Promise<AtualizarCategoriaPorIdOutput>;
    abstract obterCategoriaPorId(id: string): Promise<ObterCategoriaPorIdOutput>;
    abstract obterCategorias(): Promise<ObterCategoriasOutput[]>;
}
