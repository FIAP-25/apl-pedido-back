import { created, noContent, ok } from '@/application/helper/http.helper';
import { IProdutoUseCase } from '@/domain/contract/usecase/produto.interface';
import { AdicionarProdutoInput } from '@/infrastructure/dto/produto/adicionarProduto.dto';
import { AtualizarProdutoPorIdInput } from '@/infrastructure/dto/produto/atualizarProdutoPorId.dto';
import { Body, Controller, Delete, Get, Param, Post, Put, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Produtos')
@Controller('api/produtos')
export class ProdutoController {
    constructor(private produtoUseCase: IProdutoUseCase) {}

    @Post()
    @ApiOperation({ summary: 'Adiciona um produto' })
    async adicionarProduto(@Body() body: AdicionarProdutoInput, @Res() res: Response): Promise<any> {
        const produto = body;

        const produtoAdicionado = await this.produtoUseCase.adicionarProduto(produto);

        return created(produtoAdicionado, res);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remove um produto pelo id' })
    async removerProdutoPorId(@Param('id') id: string, @Res() res: Response): Promise<any> {
        await this.produtoUseCase.removerProdutoPorId(id);

        return noContent(res);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Atualiza um produto pelo id' })
    async atualizarProdutoPorId(@Param('id') id: string, @Body() body: AtualizarProdutoPorIdInput, @Res() res: Response): Promise<any> {
        const produto = body;

        produto.id = id;

        const produtoAtualizado = await this.produtoUseCase.atualizarProdutoPorId(produto);

        return ok(produtoAtualizado, res);
    }

    @Get()
    @ApiOperation({ summary: 'Obtém a lista de produtos' })
    async obterProdutos(@Res() res: Response): Promise<any> {
        const produtos = await this.produtoUseCase.obterProdutos();

        return ok(produtos, res);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtém um produto pelo id' })
    async obterProdutoPorId(@Param('id') id: string, @Res() res: Response): Promise<any> {
        const produto = await this.produtoUseCase.obterProdutoPorId(id);

        return ok(produto, res);
    }

    @Get('/categorias/:categoriaId')
    @ApiOperation({ summary: 'Obtém a lista de produtos pela categoriaId' })
    async obterProdutosPorCategoria(@Param('categoriaId') id: string, @Res() res: Response): Promise<any> {
        const produtos = await this.produtoUseCase.obterProdutosPorCategoria(id);

        return ok(produtos, res);
    }
}
