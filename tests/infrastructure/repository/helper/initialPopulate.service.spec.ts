import { ICategoriaRepository } from '@/domain/contract/repository/categoria.interface';
import { IPedidoStatusRepository } from '@/domain/contract/repository/pedido-status.interface';
import { InitialPopulateService } from '@/infrastructure/repository/helper/initialPopulate.service';

describe('InitialPopulateService', () => {
    let service: InitialPopulateService;
    let mockCategoriaRepository: jest.Mocked<ICategoriaRepository>;
    let mockPedidoStatusRepository: jest.Mocked<IPedidoStatusRepository>;

    beforeEach(() => {
        mockCategoriaRepository = {
            find: jest.fn(),
            findById: jest.fn(),
            save: jest.fn(),
            saveMany: jest.fn(),
            remove: jest.fn(),
            initialPopulate: jest.fn()
        };

        mockPedidoStatusRepository = {
            find: jest.fn(),
            findByTag: jest.fn(),
            saveMany: jest.fn(),
            initialPopulate: jest.fn()
        };

        service = new InitialPopulateService(mockCategoriaRepository, mockPedidoStatusRepository);
    });

    it('deve chamar o método de povoamento inicial das categorias', async () => {
        await service.onApplicationBootstrap();
        expect(mockCategoriaRepository.initialPopulate).toHaveBeenCalled();
    });

    it('deve chamar o método de povoamento inicial dos status de pedido', async () => {
        await service.onApplicationBootstrap();
        expect(mockPedidoStatusRepository.initialPopulate).toHaveBeenCalled();
    });
});
