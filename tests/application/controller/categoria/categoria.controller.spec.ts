import { CategoriaController } from '@/application/controller/categoria/categoria.controller';
import { ICategoriaUseCase } from '@/domain/contract/usecase/categoria.interface';
import { AdicionarCategoriaInput, AdicionarCategoriaOutput } from '@/infrastructure/dto/categoria/adicionarCategoria.dto';
import { AtualizarCategoriaPorIdInput, AtualizarCategoriaPorIdOutput } from '@/infrastructure/dto/categoria/atualizarCategoriaPorId.dto';
import { ObterCategoriaPorIdOutput } from '@/infrastructure/dto/categoria/obterCategoriaPorId.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';

describe('CategoriaController', () => {
    let controller: CategoriaController;
    let mockCategoriaUseCase: jest.Mocked<ICategoriaUseCase>;
    let mockResponse: jest.Mocked<Response>;

    beforeEach(async () => {
        mockCategoriaUseCase = {
            adicionarCategoria: jest.fn(),
            removerCategoriaPorId: jest.fn(),
            atualizarCategoriaPorId: jest.fn(),
            obterCategorias: jest.fn(),
            obterCategoriaPorId: jest.fn()
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [CategoriaController],
            providers: [{ provide: ICategoriaUseCase, useValue: mockCategoriaUseCase }]
        }).compile();

        controller = module.get<CategoriaController>(CategoriaController);
        mockResponse = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis()
        } as unknown as jest.Mocked<Response>;
    });

    it('deve adicionar uma categoria', async () => {
        const categoriaInput: AdicionarCategoriaInput = {
            descricao: 'descricao'
        };
        const categoriaAdicionada: AdicionarCategoriaOutput = {
            id: '1',
            descricao: 'descricao'
        };
        mockCategoriaUseCase.adicionarCategoria.mockResolvedValue(categoriaAdicionada);

        await controller.adicionarCategoria(categoriaInput, mockResponse);

        expect(mockCategoriaUseCase.adicionarCategoria).toHaveBeenCalledWith(categoriaInput);
        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.json).toHaveBeenCalledWith({ dados: categoriaAdicionada });
    });

    it('deve remover uma categoria pelo id', async () => {
        const id = 'id-categoria';
        await controller.removerCategoriaPorId(id, mockResponse);

        expect(mockCategoriaUseCase.removerCategoriaPorId).toHaveBeenCalledWith(id);
        expect(mockResponse.status).toHaveBeenCalledWith(204);
        expect(mockResponse.send).toHaveBeenCalled();
    });

    it('deve atualizar uma categoria pelo id', async () => {
        const id = 'id-categoria';
        const categoriaInput: AtualizarCategoriaPorIdInput = {
            descricao: 'descricao'
        };
        const categoriaAtualizada: AtualizarCategoriaPorIdOutput = {
            id: id,
            descricao: 'descricao atualizada'
        };
        mockCategoriaUseCase.atualizarCategoriaPorId.mockResolvedValue(categoriaAtualizada);

        await controller.atualizarCategoriaPorId(id, categoriaInput, mockResponse);

        expect(mockCategoriaUseCase.atualizarCategoriaPorId).toHaveBeenCalledWith(id, categoriaInput);
        expect(mockResponse.json).toHaveBeenCalledWith({ dados: categoriaAtualizada });
    });

    it('deve obter a lista de categorias', async () => {
        const categorias = [];
        mockCategoriaUseCase.obterCategorias.mockResolvedValue(categorias);

        await controller.obterCategorias(mockResponse);

        expect(mockCategoriaUseCase.obterCategorias).toHaveBeenCalled();
        expect(mockResponse.json).toHaveBeenCalledWith({ dados: categorias });
    });

    it('deve obter uma categoria pelo id', async () => {
        const id = 'id-categoria';
        const categoria: ObterCategoriaPorIdOutput = {
            id: id,
            descricao: 'descricao'
        };
        mockCategoriaUseCase.obterCategoriaPorId.mockResolvedValue(categoria);

        await controller.obterCategoriaPorId(id, mockResponse);

        expect(mockCategoriaUseCase.obterCategoriaPorId).toHaveBeenCalledWith(id);
        expect(mockResponse.json).toHaveBeenCalledWith({ dados: categoria });
    });
});
