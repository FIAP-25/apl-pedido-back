import { ICategoriaRepository } from '@/domain/contract/repository/categoria.interface';
import { IProdutoRepository } from '@/domain/contract/repository/produto.interface';
import { Categoria } from '@/domain/entity/categoria.model';
import { Produto } from '@/domain/entity/produto.model';
import { ErroNegocio } from '@/domain/exception/erro.module';
import { AdicionarProdutoInput } from '@/infrastructure/dto/produto/adicionarProduto.dto';
import { AtualizarProdutoPorIdInput } from '@/infrastructure/dto/produto/atualizarProdutoPorId.dto';
import { ProdutoUseCase } from '@/usecase/produto/produto.usecase';
import { Test, TestingModule } from '@nestjs/testing';

jest.mock('@/application/mapper/base.mapper', () => ({
    mapper: {
        map: jest.fn().mockImplementation((source, _sourceIdentifier, destinationIdentifier) => {
            if (destinationIdentifier === Produto) {
                const mockProduto = new Produto();
                Object.assign(mockProduto, source);
                mockProduto.categoria = new Categoria();
                mockProduto.validarProduto = jest.fn().mockReturnValue(true);
                return mockProduto;
            }
            return source;
        }),
        mapArray: jest.fn().mockImplementation((entities, _sourceIdentifier, destinationIdentifier) => {
            if (destinationIdentifier === Produto) {
                return entities.map((entity) => {
                    const mockProduto = new Produto();
                    Object.assign(mockProduto, entity);
                    mockProduto.categoria = new Categoria();
                    mockProduto.validarProduto = jest.fn().mockReturnValue(true);
                    return mockProduto;
                });
            }
            return entities;
        })
    }
}));

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
        produtoAtualizado.categoria = categoriaMock;
        produtoAtualizado.validarProduto = jest.fn().mockReturnValue(true);

        mockCategoriaRepository.findById.mockResolvedValue(categoriaMock);
        mockProdutoRepository.save.mockResolvedValue(produtoAtualizado);

        const resultado = await produtoUseCase.atualizarProdutoPorId(input);

        expect(mockCategoriaRepository.findById).toHaveBeenCalledWith(input.categoriaId);
        expect(mockProdutoRepository.save).toHaveBeenCalledWith(
            expect.objectContaining({
                id: input.id,
                nome: input.nome,
                descricao: input.descricao,
                preco: input.preco,
                categoria: categoriaMock
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
        const categoriaMock = new Categoria();
        categoriaMock.id = categoriaId;
        mockCategoriaRepository.findById.mockResolvedValue(categoriaMock);

        const produtosMock = [criarProdutoMock('1', 'Produto 1', 'Descrição do Produto 1', 10, categoriaId), criarProdutoMock('2', 'Produto 2', 'Descrição do Produto 2', 20, categoriaId)];
        mockProdutoRepository.findBy.mockResolvedValue(produtosMock);

        const resultado = await produtoUseCase.obterProdutosPorCategoria(categoriaId);

        expect(mockCategoriaRepository.findById).toHaveBeenCalledWith(categoriaId);
        expect(mockProdutoRepository.findBy).toHaveBeenCalledWith({ categoria: { id: categoriaId } });
        expect(resultado).toEqual(produtosMock);
    });

    it('deve lançar erro ao tentar adicionar um produto com categoria inexistente', async () => {
        const input: AdicionarProdutoInput = {
            nome: 'Produto Teste',
            descricao: 'Descrição do Produto Teste',
            preco: 10,
            categoriaId: 'categoria-inexistente'
        };

        mockCategoriaRepository.findById.mockResolvedValue(null as unknown as Categoria);

        await expect(produtoUseCase.adicionarProduto(input)).rejects.toThrow(new ErroNegocio('produto-categoria-nao-existe'));
    });

    it('deve lançar erro ao tentar atualizar um produto com categoria inexistente', async () => {
        const input: AtualizarProdutoPorIdInput = {
            id: 'produto-id',
            nome: 'Produto Atualizado',
            descricao: 'Descrição Atualizada',
            preco: 15,
            categoriaId: 'categoria-inexistente'
        };

        mockCategoriaRepository.findById.mockResolvedValue(null as unknown as Categoria);

        await expect(produtoUseCase.atualizarProdutoPorId(input)).rejects.toThrow(new ErroNegocio('produto-categoria-nao-existe'));
    });

    it('deve lançar erro ao tentar obter um produto por ID inexistente', async () => {
        const id = 'produto-id-inexistente';
        mockProdutoRepository.findById.mockResolvedValue(null as unknown as Produto);

        await expect(produtoUseCase.obterProdutoPorId(id)).rejects.toThrow(new ErroNegocio('produto-nao-existe'));
    });

    it('deve lançar erro ao tentar remover um produto por ID inexistente', async () => {
        const idInexistente = 'id-inexistente';
        mockProdutoRepository.remove.mockImplementation(() => {
            throw new ErroNegocio('produto-nao-existe');
        });

        await expect(produtoUseCase.removerProdutoPorId(idInexistente)).rejects.toThrow(new ErroNegocio('produto-nao-existe'));
    });

    it('deve lançar erro ao tentar obter produtos por categoria inexistente', async () => {
        const categoriaIdInexistente = 'categoria-inexistente';
        mockCategoriaRepository.findById.mockResolvedValue(null as unknown as Categoria);

        await expect(produtoUseCase.obterProdutosPorCategoria(categoriaIdInexistente)).rejects.toThrow(new ErroNegocio('produto-categoria-nao-existe'));
    });
});
