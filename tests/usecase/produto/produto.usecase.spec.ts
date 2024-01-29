import { ICategoriaRepository } from '@/domain/contract/repository/categoria.interface';
import { IProdutoRepository } from '@/domain/contract/repository/produto.interface';
import { Categoria } from '@/domain/entity/categoria.model';
import { Produto } from '@/domain/entity/produto.model';
import { AdicionarProdutoInput } from '@/infrastructure/dto/produto/adicionarProduto.dto';
import { AtualizarProdutoPorIdInput } from '@/infrastructure/dto/produto/atualizarProdutoPorId.dto';
import { ProdutoUseCase } from '@/usecase/produto/produto.usecase';
import { Test, TestingModule } from '@nestjs/testing';

jest.mock('@/application/mapper/base.mapper', () => ({
    mapper: {
        map: jest.fn().mockImplementation((source, _sourceIdentifier, destinationIdentifier) => {
            if (destinationIdentifier === Produto) {
                // Cria uma instância de Produto com validarProduto mockado
                const mockProduto = new Produto();
                Object.assign(mockProduto, source);
                mockProduto.categoria = new Categoria(); // Se necessário, ajuste conforme a fonte de dados de Categoria
                mockProduto.validarProduto = jest.fn().mockReturnValue(true);
                return mockProduto;
            }
            return source;
        }),
        mapArray: jest.fn().mockImplementation((entities, _sourceIdentifier, destinationIdentifier) => {
            if (destinationIdentifier === Produto) {
                // Mapeia cada entidade para um Produto mockado
                return entities.map((entity) => {
                    const mockProduto = new Produto();
                    Object.assign(mockProduto, entity);
                    mockProduto.categoria = new Categoria(); // Ajuste conforme a fonte de dados de Categoria
                    mockProduto.validarProduto = jest.fn().mockReturnValue(true);
                    return mockProduto;
                });
            }
            return entities;
        })
    }
}));

// Função de fábrica para criar um mock de Produto com a função validarProduto
const criarProdutoMock = (id: string, nome: string, descricao: string, preco: number, categoriaId: string): Produto => {
    const produto = new Produto();
    produto.id = id;
    produto.nome = nome;
    produto.descricao = descricao;
    produto.preco = preco;
    produto.categoria = new Categoria();
    produto.categoria.id = categoriaId;
    produto.validarProduto = jest.fn().mockReturnValue(true);
    return produto;
};

describe('ProdutoUseCase', () => {
    let produtoUseCase: ProdutoUseCase;
    let mockCategoriaRepository: jest.Mocked<ICategoriaRepository>;
    let mockProdutoRepository: jest.Mocked<IProdutoRepository>;

    beforeEach(async () => {
        mockCategoriaRepository = {
            find: jest.fn().mockResolvedValue([]),
            findById: jest.fn(),
            save: jest.fn(),
            saveMany: jest.fn(),
            remove: jest.fn(),
            initialPopulate: jest.fn()
        } as jest.Mocked<ICategoriaRepository>;

        mockProdutoRepository = {
            find: jest.fn().mockResolvedValue([]),
            findById: jest.fn(),
            findBy: jest.fn(),
            save: jest.fn(),
            saveMany: jest.fn(),
            remove: jest.fn()
        } as jest.Mocked<IProdutoRepository>;

        const module: TestingModule = await Test.createTestingModule({
            providers: [ProdutoUseCase, { provide: ICategoriaRepository, useValue: mockCategoriaRepository }, { provide: IProdutoRepository, useValue: mockProdutoRepository }]
        }).compile();

        produtoUseCase = module.get<ProdutoUseCase>(ProdutoUseCase);
    });

    it('deve adicionar um produto', async () => {
        const input: AdicionarProdutoInput = {
            nome: 'Produto Teste',
            descricao: 'Descrição do Produto Teste',
            preco: 10,
            categoriaId: 'categoria-id'
        };

        const produtoMock = criarProdutoMock('1', input.nome, input.descricao, input.preco, input.categoriaId);

        mockCategoriaRepository.findById.mockResolvedValue(new Categoria());
        mockProdutoRepository.save.mockResolvedValue(produtoMock);

        const resultado = await produtoUseCase.adicionarProduto(input);

        expect(mockCategoriaRepository.findById).toHaveBeenCalledWith(input.categoriaId);
        expect(mockProdutoRepository.save).toHaveBeenCalledWith(expect.any(Produto));
        expect(resultado).toEqual(produtoMock);
    });

    it('deve remover um produto por id', async () => {
        const id = 'produto-id';
        mockProdutoRepository.remove.mockResolvedValue();

        await produtoUseCase.removerProdutoPorId(id);

        expect(mockProdutoRepository.remove).toHaveBeenCalledWith(id);
    });

    it('deve atualizar um produto por id', async () => {
        const input: AtualizarProdutoPorIdInput = {
            id: 'produto-id',
            nome: 'Produto Atualizado',
            descricao: 'Descrição Atualizada',
            preco: 15,
            categoriaId: 'categoria-id'
        };

        const categoriaMock = new Categoria();
        categoriaMock.id = input.categoriaId;

        const produtoAtualizado = new Produto();
        produtoAtualizado.id = input.id;
        produtoAtualizado.nome = input.nome;
        produtoAtualizado.descricao = input.descricao;
        produtoAtualizado.preco = input.preco;
        produtoAtualizado.categoria = categoriaMock; // Atribua a categoria diretamente
        produtoAtualizado.validarProduto = jest.fn().mockReturnValue(true);

        mockCategoriaRepository.findById.mockResolvedValue(categoriaMock);
        mockProdutoRepository.save.mockResolvedValue(produtoAtualizado);

        const resultado = await produtoUseCase.atualizarProdutoPorId(input);

        expect(mockCategoriaRepository.findById).toHaveBeenCalledWith(input.categoriaId);
        // Certifique-se de que o objeto passado para save seja igual ao esperado
        expect(mockProdutoRepository.save).toHaveBeenCalledWith(
            expect.objectContaining({
                id: input.id,
                nome: input.nome,
                descricao: input.descricao,
                preco: input.preco,
                categoria: categoriaMock // Verifique se a categoria é a mesma
            })
        );
        expect(resultado).toEqual(produtoAtualizado);
    });

    it('deve obter um produto por id', async () => {
        const id = 'produto-id';
        const produtoMock = criarProdutoMock(id, 'Produto Teste', 'Descrição do Produto Teste', 10, 'categoria-id');

        mockProdutoRepository.findById.mockResolvedValue(produtoMock);

        const resultado = await produtoUseCase.obterProdutoPorId(id);

        expect(mockProdutoRepository.findById).toHaveBeenCalledWith(id);
        expect(resultado).toEqual(produtoMock);
    });

    it('deve obter todos os produtos', async () => {
        const produtosMock = [criarProdutoMock('1', 'Produto 1', 'Descrição do Produto 1', 10, 'categoria-1'), criarProdutoMock('2', 'Produto 2', 'Descrição do Produto 2', 20, 'categoria-2')];

        mockProdutoRepository.find.mockResolvedValue(produtosMock);

        const resultado = await produtoUseCase.obterProdutos();

        expect(mockProdutoRepository.find).toHaveBeenCalled();
        expect(resultado).toEqual(produtosMock);
    });

    it('deve obter produtos por categoria', async () => {
        const categoriaId = 'categoria-id';
        const produtosMock = [criarProdutoMock('1', 'Produto 1', 'Descrição do Produto 1', 10, categoriaId), criarProdutoMock('2', 'Produto 2', 'Descrição do Produto 2', 20, categoriaId)];

        mockProdutoRepository.findBy.mockResolvedValue(produtosMock);

        const resultado = await produtoUseCase.obterProdutosPorCategoria(categoriaId);

        expect(mockProdutoRepository.findBy).toHaveBeenCalledWith({ categoria: { id: categoriaId } });
        expect(resultado).toEqual(produtosMock);
    });
});
