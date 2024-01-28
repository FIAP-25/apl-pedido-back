import { PedidoProduto } from '@/domain/entity/pedido-produto.model';
import { Pedido } from '@/domain/entity/pedido.model';
import { PedidoProdutoEntity } from '@/infrastructure/entity/pedido-produto.entity';
import { PedidoProdutoRepository } from '@/infrastructure/repository/pedido-produto/pedido-produto.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

jest.mock('@/application/mapper/base.mapper', () => ({
    mapper: {
        map: jest.fn().mockImplementation((entity) => entity),
        mapArray: jest.fn().mockImplementation((entities) => entities)
    }
}));

describe('PedidoProdutoRepository', () => {
    let repository: PedidoProdutoRepository;
    let mockPedidoProdutoEntityRepository: jest.Mocked<Repository<PedidoProdutoEntity>>;

    beforeEach(async () => {
        mockPedidoProdutoEntityRepository = {
            find: jest.fn(),
            findOneBy: jest.fn(),
            save: jest.fn(),
            delete: jest.fn()
        } as unknown as jest.Mocked<Repository<PedidoProdutoEntity>>;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PedidoProdutoRepository,
                {
                    provide: getRepositoryToken(PedidoProdutoEntity),
                    useValue: mockPedidoProdutoEntityRepository
                }
            ]
        }).compile();

        repository = module.get<PedidoProdutoRepository>(PedidoProdutoRepository);
    });

    it('deve obter todos os produtos do pedido', async () => {
        const mockPedidosProduto = [new PedidoProdutoEntity(), new PedidoProdutoEntity()];
        mockPedidoProdutoEntityRepository.find.mockResolvedValue(mockPedidosProduto);

        const pedidosProduto = await repository.find();

        expect(pedidosProduto).toEqual(mockPedidosProduto);
        expect(mockPedidoProdutoEntityRepository.find).toHaveBeenCalled();
    });

    it('deve obter um produto do pedido pelo ID', async () => {
        const pedidoId = '123';
        const mockPedidoProduto = new PedidoProdutoEntity();
        mockPedidoProdutoEntityRepository.findOneBy.mockResolvedValue(mockPedidoProduto);

        const pedidoProduto = await repository.findById(pedidoId);

        expect(pedidoProduto).toEqual(mockPedidoProduto);
        expect(mockPedidoProdutoEntityRepository.findOneBy).toHaveBeenCalledWith({ id: pedidoId });
    });

    it('deve salvar um produto do pedido', async () => {
        const pedido = new Pedido();
        const mockPedidoProduto = new PedidoProdutoEntity();
        mockPedidoProdutoEntityRepository.save.mockResolvedValue(mockPedidoProduto);

        const resultado = await repository.save(pedido);

        expect(resultado).toEqual(mockPedidoProduto);
        expect(mockPedidoProdutoEntityRepository.save).toHaveBeenCalledWith(pedido);
    });

    it('deve salvar vários produtos do pedido', async () => {
        const mockPedidosProduto: Partial<PedidoProdutoEntity>[] = [new PedidoProdutoEntity(), new PedidoProdutoEntity()];
        mockPedidoProdutoEntityRepository.save.mockResolvedValue(mockPedidosProduto as any);

        const pedidosProduto = [new PedidoProduto(), new PedidoProduto()];

        const resultado = await repository.saveMany(pedidosProduto);

        expect(resultado).toEqual(mockPedidosProduto);
        expect(mockPedidoProdutoEntityRepository.save).toHaveBeenCalledWith(pedidosProduto);
    });

    it('deve remover um produto do pedido pelo ID', async () => {
        const pedidoId = '123';
        const mockDeleteResult: DeleteResult = {
            affected: 1,
            raw: []
        };
        mockPedidoProdutoEntityRepository.delete.mockResolvedValue(mockDeleteResult);

        await repository.removeById(pedidoId);

        expect(mockPedidoProdutoEntityRepository.delete).toHaveBeenCalledWith(pedidoId);
    });
});
