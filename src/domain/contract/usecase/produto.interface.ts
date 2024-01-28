import { AdicionarProdutoInput, AdicionarProdutoOutput } from '@/infrastructure/dto/produto/adicionarProduto.dto';
import { AtualizarProdutoPorIdInput, AtualizarProdutoPorIdOutput } from '@/infrastructure/dto/produto/atualizarProdutoPorId.dto';

import { ObterProdutoPorCategoriaOutput } from '@/infrastructure/dto/produto/obterProdutoPorCategoria.dto';
import { ObterProdutoPorIdOutput } from '@/infrastructure/dto/produto/obterProdutoPorId.dto';
import { ObterProdutosOutput } from '@/infrastructure/dto/produto/obterProdutos.dto';

export abstract class IProdutoUseCase {
    abstract adicionarProduto(input: AdicionarProdutoInput): Promise<AdicionarProdutoOutput>;
    abstract removerProdutoPorId(id: string): Promise<void>;
    abstract atualizarProdutoPorId(input: AtualizarProdutoPorIdInput): Promise<AtualizarProdutoPorIdOutput>;
    abstract obterProdutoPorId(id: string): Promise<ObterProdutoPorIdOutput>;
    abstract obterProdutos(): Promise<ObterProdutosOutput[]>;
    abstract obterProdutosPorCategoria(id: string): Promise<ObterProdutoPorCategoriaOutput[]>;
}
