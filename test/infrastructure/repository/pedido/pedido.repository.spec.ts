import { Pedido } from '@/domain/entity/pedido.model';
import { PedidoEntity } from '@/infrastructure/entity/pedido.entity';
import { PedidoRepository } from '@/infrastructure/repository/pedido/pedido.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

describe('PedidoRepository', () => {
    let pedidoRepository: PedidoRepository;
    let mockPedidoEntityRepository: jest.Mocked<Repository<PedidoEntity>>;

    beforeEach(async () => {
        mockPedidoEntityRepository = {
            find: jest.fn(),
            findOneBy: jest.fn(),
            save: jest.fn(),
            delete: jest.fn()
        } as unknown as jest.Mocked<Repository<PedidoEntity>>;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PedidoRepository,
                {
                    provide: getRepositoryToken(PedidoEntity),
                    useValue: mockPedidoEntityRepository
                }
            ]
        }).compile();

        pedidoRepository = module.get<PedidoRepository>(PedidoRepository);
    });

    it('deve retornar uma lista de pedidos', async () => {
        const pedidosEntity = [new PedidoEntity(), new PedidoEntity()];
        mockPedidoEntityRepository.find.mockResolvedValue(pedidosEntity);

        const pedidos = await pedidoRepository.find();

        expect(pedidos).toHaveLength(pedidosEntity.length);
        expect(mockPedidoEntityRepository.find).toHaveBeenCalled();
    });

    it('deve retornar um pedido pelo ID', async () => {
        const pedidoEntity = new PedidoEntity();
        const pedidoId = '123';
        mockPedidoEntityRepository.findOneBy.mockResolvedValue(pedidoEntity);

        const pedido = await pedidoRepository.findById(pedidoId);

        expect(pedido).toBeDefined();
        expect(mockPedidoEntityRepository.findOneBy).toHaveBeenCalledWith({ id: pedidoId });
    });

    it('deve salvar um pedido', async () => {
        const pedido = new Pedido();
        const pedidoSalvo = new PedidoEntity();
        mockPedidoEntityRepository.save.mockResolvedValue(pedidoSalvo);

        const resultado = await pedidoRepository.save(pedido);

        expect(resultado).toEqual(pedidoSalvo);
        expect(mockPedidoEntityRepository.save).toHaveBeenCalledWith(pedido);
    });

    it('deve remover um pedido pelo ID', async () => {
        const pedidoId = '123';
        const deleteResultMock: DeleteResult = {
            affected: 1,
            raw: {}
        };
        mockPedidoEntityRepository.delete.mockResolvedValue(deleteResultMock);

        await pedidoRepository.removeById(pedidoId);

        expect(mockPedidoEntityRepository.delete).toHaveBeenCalledWith(pedidoId);
    });
});
