import { mapper } from '@/application/mapper/base.mapper';
import { ICategoriaRepository } from '@/domain/contract/repository/categoria.interface';
import { IProdutoRepository } from '@/domain/contract/repository/produto.interface';
import { IProdutoUseCase } from '@/domain/contract/usecase/produto.interface';
import { Produto } from '@/domain/entity/produto.model';
import { ErroNegocio } from '@/domain/exception/erro.module';
import { AdicionarProdutoInput, AdicionarProdutoOutput } from '@/infrastructure/dto/produto/adicionarProduto.dto';
import { AtualizarProdutoPorIdInput, AtualizarProdutoPorIdOutput } from '@/infrastructure/dto/produto/atualizarProdutoPorId.dto';

import { ObterProdutoPorCategoriaOutput } from '@/infrastructure/dto/produto/obterProdutoPorCategoria.dto';
import { ObterProdutoPorIdOutput } from '@/infrastructure/dto/produto/obterProdutoPorId.dto';
import { ObterProdutosOutput } from '@/infrastructure/dto/produto/obterProdutos.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProdutoUseCase implements IProdutoUseCase {
    constructor(private categoriaRepository: ICategoriaRepository, private produtoRepository: IProdutoRepository) {}

    async adicionarProduto(input: AdicionarProdutoInput): Promise<AdicionarProdutoOutput> {
        if (!input.categoriaId) {
            throw new ErroNegocio('produto-categoria-nao-existe');
        }

        const categoriaProduto = await this.categoriaRepository.findById(input.categoriaId);

        if (!categoriaProduto) {
            throw new ErroNegocio('produto-categoria-nao-existe');
        }

        const produto: Produto = mapper.map(input, AdicionarProdutoInput, Produto);
        produto.categoria = categoriaProduto;

        produto.validarProduto();

        const produtoAdicionado = await this.produtoRepository.save(produto);

        return mapper.map(produtoAdicionado, Produto, AdicionarProdutoOutput);
    }

    async removerProdutoPorId(id: string): Promise<void> {
        await this.produtoRepository.remove(id);
    }

    async atualizarProdutoPorId(input: AtualizarProdutoPorIdInput): Promise<AtualizarProdutoPorIdOutput> {
        if (!input.categoriaId) {
            throw new ErroNegocio('produto-categoria-nao-existe');
        }

        const categoriaProduto = await this.categoriaRepository.findById(input.categoriaId);

        if (!categoriaProduto) {
            throw new ErroNegocio('produto-categoria-nao-existe');
        }

        const produto: Produto = mapper.map(input, AtualizarProdutoPorIdInput, Produto);
        produto.categoria = categoriaProduto;

        produto.validarProduto();

        const produtoAtualizado = await this.produtoRepository.save(produto);

        return mapper.map(produtoAtualizado, Produto, AtualizarProdutoPorIdOutput);
    }

    async obterProdutoPorId(id: string): Promise<ObterProdutoPorIdOutput> {
        const produto = await this.produtoRepository.findById(id);

        if (!produto) {
            throw new ErroNegocio('produto-nao-existe');
        }

        return mapper.map(produto, Produto, ObterProdutoPorIdOutput);
    }

    async obterProdutos(): Promise<ObterProdutosOutput[]> {
        const produtos = await this.produtoRepository.find();

        return mapper.mapArray(produtos, Produto, ObterProdutosOutput);
    }

    async obterProdutosPorCategoria(id: string): Promise<ObterProdutoPorCategoriaOutput[]> {
        const produtos = await this.produtoRepository.findBy({
            categoria: {
                id: id
            }
        });

        return mapper.mapArray(produtos, Produto, ObterProdutoPorCategoriaOutput);
    }
}
