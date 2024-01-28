import { IPedidoProdutoRepository } from '@/domain/contract/repository/pedido-produto.interface';
import { IPedidoStatusRepository } from '@/domain/contract/repository/pedido-status.interface';
import { IPedidoRepository } from '@/domain/contract/repository/pedido.interface';
import { PedidoUseCase } from '@/usecase/pedido/pedido.usecase';

const mockPedidoRepository: IPedidoRepository = {
    findById: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    removeById: jest.fn()
};

const mockPedidoStatusRepository: IPedidoStatusRepository = {
    findByTag: jest.fn(),
    find: jest.fn(),
    saveMany: jest.fn(),
    initialPopulate: jest.fn()
};

const mockPedidoProdutoRepository: IPedidoProdutoRepository = {
    find: jest.fn(),
    findById: jest.fn(),
    save: jest.fn(),
    saveMany: jest.fn(),
    removeById: jest.fn()
};

describe('PedidoUseCase', () => {
    let pedidoUseCase: PedidoUseCase;

    beforeEach(() => {
        pedidoUseCase = new PedidoUseCase(mockPedidoRepository, mockPedidoStatusRepository, mockPedidoProdutoRepository);
    });

    describe('removerPedidoPorId', () => {
        it('should remove an existing order by ID successfully', async () => {
            // Mock the behavior of the `removeById` method
            const orderId = '1';
            mockPedidoRepository.removeById('1');

            // Call the method
            await pedidoUseCase.removerPedidoPorId(orderId);

            // Assertions
            expect(mockPedidoRepository.removeById).toHaveBeenCalledWith(orderId);
        });
    });
});
