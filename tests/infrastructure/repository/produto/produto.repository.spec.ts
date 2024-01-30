import { Produto } from '@/domain/entity/produto.model';
import { ProdutoEntity } from '@/infrastructure/entity/produto.entity';
import { ProdutoRepository } from '@/infrastructure/repository/produto/produto.repository';
import { DeleteResult, Repository } from 'typeorm';

describe('ProdutoRepository', () => {
    let produtoRepository: ProdutoRepository;
    let mockRepository: jest.Mocked<Repository<ProdutoEntity>>;

    beforeEach(() => {
        // Criar um mock manual para o Repository
        mockRepository = {
            find: jest.fn(),
            findOneBy: jest.fn(),
            save: jest.fn(),
            delete: jest.fn()
        } as unknown as jest.Mocked<Repository<ProdutoEntity>>;

        produtoRepository = new ProdutoRepository(mockRepository);
    });

    it('deve retornar uma lista de produtos', async () => {
        const produtosEntityMock = [new ProdutoEntity(), new ProdutoEntity()];
        mockRepository.find.mockResolvedValue(produtosEntityMock);

        const produtos = await produtoRepository.find();

        expect(produtos).toHaveLength(2);
        expect(mockRepository.find).toHaveBeenCalled();
    });

    it('deve retornar um produto pelo id', async () => {
        const produtoEntityMock = new ProdutoEntity();
        mockRepository.findOneBy.mockResolvedValue(produtoEntityMock);

        const produto = await produtoRepository.findById('1');

        expect(produto).toEqual(produtoEntityMock);
        expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: '1' });
    });

    it('deve salvar um produto', async () => {
        const produtoEntityMock = new ProdutoEntity();
        mockRepository.save.mockResolvedValue(produtoEntityMock);

        const produto = new Produto();
        const resultado = await produtoRepository.save(produto);

        expect(resultado).toEqual(produtoEntityMock);
        expect(mockRepository.save).toHaveBeenCalledWith(produto);
    });

    it('deve salvar vários produtos', async () => {
        // Mock de entidades ProdutoEntity
        const produtoEntityMock1 = new ProdutoEntity();
        produtoEntityMock1.id = '1';
        produtoEntityMock1.nome = 'Produto 1';
        // ... outros atributos de ProdutoEntity

        const produtoEntityMock2 = new ProdutoEntity();
        produtoEntityMock2.id = '2';
        produtoEntityMock2.nome = 'Produto 2';
        // ... outros atributos de ProdutoEntity

        const produtosEntityMock = [produtoEntityMock1, produtoEntityMock2];

        // Mock da função save do repositório para retornar os produtos mockados
        // Utilizando 'any' para contornar a incompatibilidade de tipos
        mockRepository.save.mockResolvedValue(produtosEntityMock as any);

        // Criação de produtos para serem salvos
        const produto1 = new Produto();
        produto1.id = '1';
        produto1.nome = 'Produto 1';
        // ... outros atributos de Produto

        const produto2 = new Produto();
        produto2.id = '2';
        produto2.nome = 'Produto 2';
        // ... outros atributos de Produto

        const produtos = [produto1, produto2];

        // Execução do método saveMany
        const resultado = await produtoRepository.saveMany(produtos);

        // Verificações
        expect(resultado).toEqual(produtosEntityMock as any);
        expect(mockRepository.save).toHaveBeenCalledWith(produtos);
    });

    it('deve remover um produto pelo id', async () => {
        // Cria um mock do DeleteResult
        const deleteResultMock: Partial<DeleteResult> = {
            affected: 1,
            raw: {} // Pode ser um objeto vazio ou um mock mais detalhado se necessário
        };

        // Configura o mock do método delete do repositório para retornar o DeleteResult mockado
        mockRepository.delete.mockResolvedValue(deleteResultMock as DeleteResult);

        // Executa o método remove do repositório
        await produtoRepository.remove('1');

        // Verifica se o método delete foi chamado corretamente com o id fornecido
        expect(mockRepository.delete).toHaveBeenCalledWith('1');
    });
});
