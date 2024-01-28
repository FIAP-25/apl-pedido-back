import { mapper } from '@/application/mapper/base.mapper';
import { IPedidoProdutoRepository } from '@/domain/contract/repository/pedido-produto.interface';
import { IPedidoStatusRepository } from '@/domain/contract/repository/pedido-status.interface';
import { IPedidoRepository } from '@/domain/contract/repository/pedido.interface';
import { PedidoStatus } from '@/domain/entity/pedido-status.model';
import { Pedido } from '@/domain/entity/pedido.model';
import { AdicionarPedidoInput } from '@/infrastructure/dto/pedido/adicionarPedido.dto';
import { AtualizarStatusPedidoInput } from '@/infrastructure/dto/pedido/atualizarPedido.dto';
import { ObterPedidoPorIdOutput } from '@/infrastructure/dto/pedido/obterPedidoPorId.dto';
import { webhookPedido } from '@/infrastructure/dto/pedido/webhookPedido.dto';
import { PedidoUseCase } from '@/usecase/pedido/pedido.usecase';
import { Test, TestingModule } from '@nestjs/testing';

jest.mock('@/application/mapper/base.mapper', () => ({
    mapper: {
        map: jest.fn().mockImplementation((entity) => entity),
        mapArray: jest.fn().mockImplementation((entities) => entities)
    }
}));

describe('PedidoUseCase', () => {
    let useCase: PedidoUseCase;
    let mockPedidoRepository: jest.Mocked<IPedidoRepository>;
    let mockPedidoStatusRepository: jest.Mocked<IPedidoStatusRepository>;
    let mockPedidoProdutoRepository: jest.Mocked<IPedidoProdutoRepository>;

    beforeEach(async () => {
        mockPedidoRepository = {
            find: jest.fn(),
            findById: jest.fn(),
            save: jest.fn(),
            removeById: jest.fn()
        };

        mockPedidoStatusRepository = {
            find: jest.fn().mockResolvedValue([]),
            findByTag: jest.fn(),
            saveMany: jest.fn().mockResolvedValue([]),
            initialPopulate: jest.fn().mockResolvedValue(undefined),
            removeById: jest.fn().mockResolvedValue(undefined)
        } as jest.Mocked<IPedidoStatusRepository>;

        mockPedidoProdutoRepository = {
            find: jest.fn().mockResolvedValue([]),
            findById: jest.fn(),
            save: jest.fn(),
            saveMany: jest.fn(),
            removeById: jest.fn().mockResolvedValue(undefined)
        } as jest.Mocked<IPedidoProdutoRepository>;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PedidoUseCase,
                {
                    provide: IPedidoRepository,
                    useValue: mockPedidoRepository
                },
                {
                    provide: IPedidoStatusRepository,
                    useValue: mockPedidoStatusRepository
                },
                {
                    provide: IPedidoProdutoRepository,
                    useValue: mockPedidoProdutoRepository
                }
            ]
        }).compile();

        useCase = module.get<PedidoUseCase>(PedidoUseCase);
    });

    // it('deve adicionar um pedido', async () => { TODO ativar quando usecase estiver correto
    //     const input: AdicionarPedidoInput = {
    //         pedidoProdutos: [{ id: '1', quantidade: 2 }],
    //         clienteCPF: '12312312312'
    //     };

    //     const pedidoMock = new Pedido();
    //     mockPedidoRepository.save.mockResolvedValue(pedidoMock);
    //     mockPedidoProdutoRepository.saveMany.mockResolvedValue([
    //         { id: '1', quantidade: 2 },
    //         { id: '2', quantidade: 3 }
    //     ]);

    //     const resultado = await useCase.adicionarPedido(input);

    //     expect(resultado).toEqual(pedidoMock);
    //     expect(mockPedidoRepository.save).toHaveBeenCalled();
    //     expect(mockPedidoProdutoRepository.saveMany).toHaveBeenCalled();
    // });

    it('deve remover um pedido por id', async () => {
        const id = '123';
        await useCase.removerPedidoPorId(id);
        expect(mockPedidoRepository.removeById).toHaveBeenCalledWith(id);
    });

    it('deve atualizar o status de um pedido', async () => {
        const id = '123';
        const input = new AtualizarStatusPedidoInput();
        input.statusTag = 'novo_status';

        const pedidoMock = new Pedido();
        pedidoMock.status = new PedidoStatus();
        pedidoMock.status.tag = input.statusTag;

        const statusMock = new PedidoStatus();
        statusMock.tag = input.statusTag;

        mockPedidoRepository.findById.mockResolvedValue(pedidoMock);
        mockPedidoStatusRepository.findByTag.mockResolvedValue(statusMock);
        mockPedidoRepository.save.mockResolvedValue(pedidoMock);

        const resultado = await useCase.atualizarPedidoStatusPorId(id, input);

        expect(resultado).toEqual(pedidoMock);
        expect(mockPedidoRepository.save).toHaveBeenCalledWith(expect.objectContaining({ status: statusMock }));
        expect(mockPedidoStatusRepository.findByTag).toHaveBeenCalledWith(input.statusTag);
    });

    it('deve obter um pedido pelo id', async () => {
        const id = '123';
        const mockPedido = new Pedido();
        mockPedidoRepository.findById.mockResolvedValue(mockPedido);
        const resultado = await useCase.obterPedidoPorId(id);
        expect(resultado).toEqual(mapper.map(mockPedido, Pedido, ObterPedidoPorIdOutput));
        expect(mockPedidoRepository.findById).toHaveBeenCalledWith(id);
    });

    it('deve obter pedidos', async () => {
        const mockPedidos = [new Pedido(), new Pedido()];
        mockPedidoRepository.find.mockResolvedValue(mockPedidos);
        const resultado = await useCase.obterPedidos();
        expect(resultado).toEqual(mockPedidos.map((p) => mapper.map(p, Pedido, ObterPedidoPorIdOutput)));
        expect(mockPedidoRepository.find).toHaveBeenCalled();
    });

    it('deve obter status do pedido por id', async () => {
        const id = '123';
        const mockPedido = new Pedido();
        mockPedido.status = new PedidoStatus();
        mockPedidoRepository.findById.mockResolvedValue(mockPedido);
        const status = await useCase.obterStatusPedidosPorId(id);
        expect(status).toEqual(mockPedido.status.tag);
        expect(mockPedidoRepository.findById).toHaveBeenCalledWith(id);
    });

    it('deve processar webhook de confirmação de pagamento', async () => {
        const input = new webhookPedido();
        input.id = '123';
        input.aprovado = false;

        const mockPedido = new Pedido();
        mockPedido.pagamentoStatus = 'pagamento_pendente';

        mockPedidoRepository.findById.mockResolvedValue(mockPedido);
        mockPedidoRepository.save.mockImplementation((pedido) =>
            Promise.resolve({
                ...pedido,
                pagamentoStatus: input.aprovado ? 'pedido_aprovado' : 'pedido_nao_aprovado'
            })
        );

        const resultado = await useCase.webhookConfirmacaoPagamento(input);

        expect(resultado.pagamentoStatus).toEqual('pedido_nao_aprovado');
        expect(mockPedidoRepository.findById).toHaveBeenCalledWith(input.id);
        expect(mockPedidoRepository.save).toHaveBeenCalledWith(expect.objectContaining({ pagamentoStatus: 'pedido_nao_aprovado' }));
    });

    it('deve obter a fila de pedidos', async () => {
        const mockPedidos = [
            { ...new Pedido(), status: { tag: 'pedido_pronto', descricao: 'Pedido pronto.' } },
            { ...new Pedido(), status: { tag: 'pedido_em_preparacao', descricao: 'Pedido em preparação.' } },
            { ...new Pedido(), status: { tag: 'pedido_recebido', descricao: 'Pedido recebido.' } }
        ];
        mockPedidoRepository.find.mockResolvedValue(mockPedidos);

        const resultado = await useCase.obterFilaPedidos();

        expect(resultado[0].status.tag).toEqual('pedido_pronto');
        expect(resultado[1].status.tag).toEqual('pedido_em_preparacao');
        expect(resultado[2].status.tag).toEqual('pedido_recebido');
        expect(mockPedidoRepository.find).toHaveBeenCalled();
    });
});
