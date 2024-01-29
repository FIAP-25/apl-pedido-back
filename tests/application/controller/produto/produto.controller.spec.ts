import { ProdutoController } from '@/application/controller/produto/produto.controller';
import { IProdutoUseCase } from '@/domain/contract/usecase/produto.interface';
import { Categoria } from '@/domain/entity/categoria.model';
import { AdicionarProdutoInput, AdicionarProdutoOutput } from '@/infrastructure/dto/produto/adicionarProduto.dto';
import { AtualizarProdutoPorIdInput, AtualizarProdutoPorIdOutput } from '@/infrastructure/dto/produto/atualizarProdutoPorId.dto';
import { ObterProdutoPorCategoriaOutput } from '@/infrastructure/dto/produto/obterProdutoPorCategoria.dto';
import { ObterProdutoPorIdOutput } from '@/infrastructure/dto/produto/obterProdutoPorId.dto';
import { ObterProdutosOutput } from '@/infrastructure/dto/produto/obterProdutos.dto';
import { Response } from 'express';

jest.mock('@/domain/contract/usecase/produto.interface');

describe('ProdutoController', () => {
    let controller: ProdutoController;
    let mockProdutoUseCase: jest.Mocked<IProdutoUseCase>;
    let mockResponse: jest.Mocked<Response>;

    beforeEach(() => {
        mockProdutoUseCase = {
            adicionarProduto: jest.fn(),
            removerProdutoPorId: jest.fn(),
            atualizarProdutoPorId: jest.fn(),
            obterProdutos: jest.fn(),
            obterProdutoPorId: jest.fn(),
            obterProdutosPorCategoria: jest.fn()
        };

        controller = new ProdutoController(mockProdutoUseCase);
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn().mockReturnThis()
        } as unknown as jest.Mocked<Response>;
    });

    it('deve adicionar um produto', async () => {
        const input: AdicionarProdutoInput = {
            descricao: 'produto',
            nome: 'produto',
            categoriaId: '1',
            preco: 10
        };
        const produtoAdicionado: AdicionarProdutoOutput = {
            id: '1',
            descricao: 'produto',
            nome: 'produto',
            categoria: new Categoria(),
            preco: 10
        };
        mockProdutoUseCase.adicionarProduto.mockResolvedValue(produtoAdicionado);

        await controller.adicionarProduto(input, mockResponse);

        expect(mockProdutoUseCase.adicionarProduto).toHaveBeenCalledWith(input);
        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.json).toHaveBeenCalledWith({ dados: produtoAdicionado });
    });

    it('deve remover um produto por id', async () => {
        const id = '1';

        await controller.removerProdutoPorId(id, mockResponse);

        expect(mockProdutoUseCase.removerProdutoPorId).toHaveBeenCalledWith(id);
        expect(mockResponse.status).toHaveBeenCalledWith(204);
    });

    it('deve atualizar um produto por id', async () => {
        const id = '1';
        const input: AtualizarProdutoPorIdInput = {
            id: id,
            nome: 'produto',
            descricao: 'produto',
            categoriaId: '1',
            preco: 10
        };
        const produtoAtualizado: AtualizarProdutoPorIdOutput = {
            id: id,
            descricao: 'produto',
            categoria: new Categoria(),
            preco: 10
        };
        mockProdutoUseCase.atualizarProdutoPorId.mockResolvedValue(produtoAtualizado);

        await controller.atualizarProdutoPorId(id, input, mockResponse);

        expect(mockProdutoUseCase.atualizarProdutoPorId).toHaveBeenCalledWith({ ...input, id });
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({ dados: produtoAtualizado });
    });

    it('deve obter produtos', async () => {
        const produtos: ObterProdutosOutput[] = [new ObterProdutosOutput(), new ObterProdutosOutput()];
        mockProdutoUseCase.obterProdutos.mockResolvedValue(produtos);

        await controller.obterProdutos(mockResponse);

        expect(mockProdutoUseCase.obterProdutos).toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({ dados: produtos });
    });

    it('deve obter um produto pelo id', async () => {
        const id = '1';
        const produto: ObterProdutoPorIdOutput = {
            id: id,
            nome: 'produto',
            descricao: 'produto',
            categoria: new Categoria(),
            preco: 10
        };
        mockProdutoUseCase.obterProdutoPorId.mockResolvedValue(produto);

        await controller.obterProdutoPorId(id, mockResponse);

        expect(mockProdutoUseCase.obterProdutoPorId).toHaveBeenCalledWith(id);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({ dados: produto });
    });

    it('deve obter produtos por categoria', async () => {
        const categoriaId = '1';
        const produtos: ObterProdutoPorCategoriaOutput[] = [new ObterProdutoPorCategoriaOutput(), new ObterProdutoPorCategoriaOutput()];
        mockProdutoUseCase.obterProdutosPorCategoria.mockResolvedValue(produtos);

        await controller.obterProdutosPorCategoria(categoriaId, mockResponse);

        expect(mockProdutoUseCase.obterProdutosPorCategoria).toHaveBeenCalledWith(categoriaId);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({ dados: produtos });
    });
});
