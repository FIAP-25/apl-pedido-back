import { PedidoStatusEntity } from '@/infrastructure/entity/pedido-status.entity';
import { PedidoStatusRepository } from '@/infrastructure/repository/pedido-status/pedido-status.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

jest.mock('@/application/mapper/base.mapper', () => ({
    mapper: {
        map: jest.fn().mockImplementation((entity) => entity),
        mapArray: jest.fn().mockImplementation((entities) => entities)
    }
}));

describe('PedidoStatusRepository', () => {
    let repository: PedidoStatusRepository;
    let mockPedidoStatusEntityRepository: jest.Mocked<Repository<PedidoStatusEntity>>;

    beforeEach(async () => {
        mockPedidoStatusEntityRepository = {
            find: jest.fn(),
            findOneBy: jest.fn(),
            save: jest.fn(),
            delete: jest.fn()
        } as unknown as jest.Mocked<Repository<PedidoStatusEntity>>;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PedidoStatusRepository,
                {
                    provide: getRepositoryToken(PedidoStatusEntity),
                    useValue: mockPedidoStatusEntityRepository
                }
            ]
        }).compile();

        repository = module.get<PedidoStatusRepository>(PedidoStatusRepository);
    });

    it('deve obter todos os status dos pedidos', async () => {
        const mockPedidoStatus = [new PedidoStatusEntity(), new PedidoStatusEntity()];
        mockPedidoStatusEntityRepository.find.mockResolvedValue(mockPedidoStatus);

        const pedidoStatus = await repository.find();

        expect(pedidoStatus).toEqual(mockPedidoStatus);
        expect(mockPedidoStatusEntityRepository.find).toHaveBeenCalled();
    });

    it('deve obter um status do pedido pela tag', async () => {
        const tag = 'pedido_recebido';
        const mockPedidoStatus = new PedidoStatusEntity();
        mockPedidoStatusEntityRepository.findOneBy.mockResolvedValue(mockPedidoStatus);

        const pedidoStatus = await repository.findByTag(tag);

        expect(pedidoStatus).toEqual(mockPedidoStatus);
        expect(mockPedidoStatusEntityRepository.findOneBy).toHaveBeenCalledWith({ tag });
    });

    it('deve salvar vários status dos pedidos', async () => {
        const pedidoStatuses = [
            { tag: 'novo_status', descricao: 'Novo status' },
            { tag: 'outro_status', descricao: 'Outro status' }
        ];

        const mockPedidoStatuses = pedidoStatuses.map((status) => ({
            ...status,
            id: Math.random().toString(36).substring(7)
        })) as Partial<PedidoStatusEntity>[];

        mockPedidoStatusEntityRepository.save.mockResolvedValue(mockPedidoStatuses as any);

        const resultado = await repository.saveMany(pedidoStatuses as any);

        expect(resultado).toEqual(mockPedidoStatuses);
        expect(mockPedidoStatusEntityRepository.save).toHaveBeenCalledWith(pedidoStatuses);
    });

    it('deve remover um status do pedido pelo ID', async () => {
        const id = '1';
        const mockDeleteResult: DeleteResult = {
            affected: 1,
            raw: []
        };
        mockPedidoStatusEntityRepository.delete.mockResolvedValue(mockDeleteResult);

        await repository.removeById(id);

        expect(mockPedidoStatusEntityRepository.delete).toHaveBeenCalledWith(id);
    });

    it('deve inicializar população de status dos pedidos', async () => {
        const spySaveMany = jest.spyOn(repository, 'saveMany');
        await repository.initialPopulate();

        expect(spySaveMany).toHaveBeenCalled();
    });
});
