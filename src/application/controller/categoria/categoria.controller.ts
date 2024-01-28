import { created, noContent, ok } from '@/application/helper/http.helper';
import { ICategoriaUseCase } from '@/domain/contract/usecase/categoria.interface';
import { AdicionarCategoriaInput } from '@/infrastructure/dto/categoria/adicionarCategoria.dto';
import { AtualizarCategoriaPorIdInput } from '@/infrastructure/dto/categoria/atualizarCategoriaPorId.dto';
import { Body, Controller, Delete, Get, Param, Post, Put, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Categorias')
@Controller('api/categorias')
export class CategoriaController {
    constructor(private categoriaUseCase: ICategoriaUseCase) {}

    @Post()
    @ApiOperation({ summary: 'Adiciona uma categoria' })
    async adicionarCategoria(@Body() body: AdicionarCategoriaInput, @Res() res: Response): Promise<any> {
        const categoriaAdicionada = await this.categoriaUseCase.adicionarCategoria(body);

        return created(categoriaAdicionada, res);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remove uma categoria pelo id' })
    async removerCategoriaPorId(@Param('id') id: string, @Res() res: Response): Promise<any> {
        await this.categoriaUseCase.removerCategoriaPorId(id);

        return noContent(res);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Atualiza uma categoria pelo id' })
    async atualizarCategoriaPorId(@Param('id') id: string, @Body() body: AtualizarCategoriaPorIdInput, @Res() res: Response): Promise<any> {
        const categoriaAtualizada = await this.categoriaUseCase.atualizarCategoriaPorId(id, body);

        return ok(categoriaAtualizada, res);
    }

    @Get()
    @ApiOperation({ summary: 'Obtém a lista de categorias' })
    async obterCategorias(@Res() res: Response): Promise<any> {
        const categorias = await this.categoriaUseCase.obterCategorias();

        return ok(categorias, res);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtém uma categoria pelo id' })
    async obterCategoriaPorId(@Param('id') id: string, @Res() res: Response): Promise<any> {
        const categoria = await this.categoriaUseCase.obterCategoriaPorId(id);

        return ok(categoria, res);
    }
}
