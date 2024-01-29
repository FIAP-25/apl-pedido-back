import { IAxiosClient } from '@/domain/contract/client/axios.interface';
import { IClienteRepository } from '@/domain/contract/repository/cliente.interface';
import { IPedidoProdutoRepository } from '@/domain/contract/repository/pedido-produto.interface';
import { IPedidoStatusRepository } from '@/domain/contract/repository/pedido-status.interface';
import { IPedidoRepository } from '@/domain/contract/repository/pedido.interface';
import { IProdutoRepository } from '@/domain/contract/repository/produto.interface';
import { Categoria } from '@/domain/entity/categoria.model';
import { Cliente } from '@/domain/entity/cliente.model';
import { PedidoProduto } from '@/domain/entity/pedido-produto.model';
import { PedidoStatus } from '@/domain/entity/pedido-status.model';
import { Pedido } from '@/domain/entity/pedido.model';
import { Produto } from '@/domain/entity/produto.model';
import { ErroNegocio } from '@/domain/exception/erro.module';
import { AdicionarPedidoInput } from '@/infrastructure/dto/pedido/adicionarPedido.dto';
import { AtualizarStatusPedidoInput } from '@/infrastructure/dto/pedido/atualizarPedido.dto';
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
    let mockClienteRepository: jest.Mocked<IClienteRepository>;
    let mockProdutoRepository: jest.Mocked<IProdutoRepository>;
    let mockAxiosClient: jest.Mocked<IAxiosClient>;

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
            saveMany: jest.fn().mockImplementation(async (pedidoProdutos) => pedidoProdutos),
            removeById: jest.fn().mockResolvedValue(undefined)
        } as jest.Mocked<IPedidoProdutoRepository>;

        mockClienteRepository = {
            find: jest.fn().mockResolvedValue([]),
            findByCPF: jest.fn(),
            save: jest.fn(),
            saveMany: jest.fn(),
            remove: jest.fn().mockResolvedValue(undefined)
        } as jest.Mocked<IClienteRepository>;

        mockProdutoRepository = {
            find: jest.fn().mockResolvedValue([]),
            findById: jest.fn(),
            findBy: jest.fn(),
            save: jest.fn(),
            saveMany: jest.fn(),
            remove: jest.fn().mockResolvedValue(undefined)
        } as jest.Mocked<IProdutoRepository>;

        mockAxiosClient = {
            executarChamada: jest.fn()
        } as jest.Mocked<IAxiosClient>;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PedidoUseCase,
                { provide: IPedidoRepository, useValue: mockPedidoRepository },
                { provide: IPedidoStatusRepository, useValue: mockPedidoStatusRepository },
                { provide: IPedidoProdutoRepository, useValue: mockPedidoProdutoRepository },
                { provide: IClienteRepository, useValue: mockClienteRepository },
                { provide: IProdutoRepository, useValue: mockProdutoRepository },
                { provide: IAxiosClient, useValue: mockAxiosClient }
            ]
        }).compile();

        useCase = module.get<PedidoUseCase>(PedidoUseCase);
    });

    it('deve adicionar um pedido', async () => {
        const produtoMock1: Produto = {
            id: 'produto1',
            nome: 'Produto 1',
            descricao: 'Descrição do Produto 1',
            preco: 10.0,
            categoria: new Categoria(),
            validarProduto: function (): boolean {
                throw new Error('Function not implemented.');
            }
        };

        const produtoMock2: Produto = {
            id: 'produto2',
            nome: 'Produto 2',
            descricao: 'Descrição do Produto 2',
            preco: 15.0,
            categoria: new Categoria(),
            validarProduto: function (): boolean {
                throw new Error('Function not implemented.');
            }
        };

        const pedidoProdutoMock1: PedidoProduto = {
            id: '1',
            quantidade: 2,
            produto: produtoMock1
        };

        const pedidoProdutoMock2: PedidoProduto = {
            id: '2',
            quantidade: 3,
            produto: produtoMock2
        };

        const input: AdicionarPedidoInput = {
            clienteCPF: '12345678901',
            pedidoProdutos: [pedidoProdutoMock1, pedidoProdutoMock2]
        };

        const mockCliente: Cliente = {
            cpf: '12345678901',
            email: 'teste@email.com.br',
            nomeCompleto: 'osvaldo teste',
            validarClienteAdicionar: function (): boolean {
                throw new Error('Function not implemented.');
            },
            validarClienteAtualizar: function (): boolean {
                throw new Error('Function not implemented.');
            }
        };
        mockClienteRepository.findByCPF.mockResolvedValue(mockCliente);

        const mockStatus: PedidoStatus = {
            tag: 'pedido_recebido',
            descricao: ''
        };
        mockPedidoStatusRepository.findByTag.mockResolvedValue(mockStatus);

        mockProdutoRepository.find.mockResolvedValue([produtoMock1, produtoMock2]);

        const mockPedidoSalvo = new Pedido();
        mockPedidoSalvo.id = '1';
        mockPedidoSalvo.cliente = mockCliente;
        mockPedidoSalvo.status = mockStatus;
        mockPedidoSalvo.pedidoProdutos = input.pedidoProdutos.map((pp) => ({ ...pp, pedido: mockPedidoSalvo }));
        mockPedidoRepository.save.mockResolvedValue(mockPedidoSalvo);

        mockPedidoProdutoRepository.saveMany.mockResolvedValue(mockPedidoSalvo.pedidoProdutos);
        mockAxiosClient.executarChamada.mockResolvedValue(Promise.resolve({ data: 'resultado_mock' }));

        const resultado = await useCase.adicionarPedido(input);

        expect(resultado).toEqual(
            expect.objectContaining({
                cliente: expect.objectContaining({ cpf: input.clienteCPF }),
                status: expect.objectContaining({ tag: mockStatus.tag }),
                pedidoProdutos: expect.arrayContaining([expect.objectContaining({ produto: produtoMock1, quantidade: 2 }), expect.objectContaining({ produto: produtoMock2, quantidade: 3 })])
            })
        );
        expect(mockClienteRepository.findByCPF).toHaveBeenCalledWith(input.clienteCPF);
        expect(mockPedidoStatusRepository.findByTag).toHaveBeenCalledWith('pedido_recebido');
        expect(mockProdutoRepository.find).toHaveBeenCalled();
        expect(mockPedidoRepository.save).toHaveBeenCalled();
        expect(mockPedidoProdutoRepository.saveMany).toHaveBeenCalledWith(expect.anything());
    });

    it('deve remover um pedido por id', async () => {
        const id = '123';
        await useCase.removerPedidoPorId(id);
        expect(mockPedidoRepository.removeById).toHaveBeenCalledWith(id);
    });

    it('deve atualizar o status de um pedido', async () => {
        const id = '123';
        const input: AtualizarStatusPedidoInput = {
            statusTag: 'novo_status'
        };

        const pedidoMock = new Pedido();
        mockPedidoRepository.findById.mockResolvedValue(pedidoMock);
        const statusMock = new PedidoStatus();
        mockPedidoStatusRepository.findByTag.mockResolvedValue(statusMock);

        await useCase.atualizarPedidoStatusPorId(id, input);

        expect(mockPedidoRepository.save).toHaveBeenCalledWith(expect.objectContaining({ status: statusMock }));
    });

    it('deve obter um pedido pelo id', async () => {
        const id = '123';

        const mockStatus = new PedidoStatus();
        mockStatus.tag = 'status_tag';

        const mockPedido = new Pedido();
        mockPedido.id = id;
        mockPedido.status = mockStatus;

        mockPedidoRepository.findById.mockResolvedValue(mockPedido);

        const resultado = await useCase.obterPedidoPorId(id);

        expect(resultado).toEqual(
            expect.objectContaining({
                id: mockPedido.id,
                status: expect.objectContaining({
                    tag: mockPedido.status.tag
                })
            })
        );
        expect(mockPedidoRepository.findById).toHaveBeenCalledWith(id);
    });

    it('deve obter pedidos', async () => {
        const mockPedidos = [new Pedido(), new Pedido()];
        mockPedidoRepository.find.mockResolvedValue(mockPedidos);

        const resultado = await useCase.obterPedidos();

        expect(resultado).toEqual(mockPedidos);
        expect(mockPedidoRepository.find).toHaveBeenCalled();
    });

    it('deve obter status do pedido por id', async () => {
        const id = '123';
        const mockPedido = new Pedido();
        mockPedido.status = new PedidoStatus();
        mockPedido.status.tag = 'algum_status';

        mockPedidoRepository.findById.mockResolvedValue(mockPedido);

        const status = await useCase.obterStatusPedidosPorId(id);

        expect(status).toEqual('algum_status');
        expect(mockPedidoRepository.findById).toHaveBeenCalledWith(id);
    });

    it('deve processar webhook de confirmação de pagamento', async () => {
        const input = new webhookPedido();
        input.id = '123';
        input.aprovado = false;

        const mockPedido = new Pedido();
        mockPedido.id = input.id;
        mockPedido.pagamentoStatus = 'pagamento_pendente';

        mockPedidoRepository.findById.mockResolvedValue(mockPedido);
        mockPedidoRepository.save.mockImplementation((pedido) =>
            Promise.resolve({
                ...pedido,
                pagamentoStatus: input.aprovado ? 'pedido_aprovado' : 'pedido_nao_aprovado'
            })
        );

        mockAxiosClient.executarChamada.mockResolvedValue({ data: 'resultado_mock' });

        const resultado = await useCase.webhookConfirmacaoPagamento(input);

        expect(resultado.pagamentoStatus).toEqual('pedido_nao_aprovado');
        expect(mockPedidoRepository.findById).toHaveBeenCalledWith(input.id);
        expect(mockPedidoRepository.save).toHaveBeenCalledWith(expect.objectContaining({ pagamentoStatus: 'pedido_nao_aprovado' }));
        expect(mockAxiosClient.executarChamada).toHaveBeenCalledWith('producao', 'post', `producao/cadastrar`, { pedidoId: input.id });
    });

    it('deve obter a fila de pedidos', async () => {
        const pedidoPronto = new Pedido();
        pedidoPronto.id = '1';
        pedidoPronto.status = { tag: 'pedido_pronto', descricao: 'Pedido pronto.' };

        const pedidoEmPreparacao = new Pedido();
        pedidoEmPreparacao.id = '2';
        pedidoEmPreparacao.status = { tag: 'pedido_em_preparacao', descricao: 'Pedido em preparação.' };

        const pedidoRecebido = new Pedido();
        pedidoRecebido.id = '3';
        pedidoRecebido.status = { tag: 'pedido_recebido', descricao: 'Pedido recebido.' };

        const mockPedidos = [pedidoPronto, pedidoEmPreparacao, pedidoRecebido];
        mockPedidoRepository.find.mockResolvedValue(mockPedidos);

        const resultado = await useCase.obterFilaPedidos();

        expect(resultado[0].status.tag).toEqual('pedido_pronto');
        expect(resultado[1].status.tag).toEqual('pedido_em_preparacao');
        expect(resultado[2].status.tag).toEqual('pedido_recebido');
        expect(mockPedidoRepository.find).toHaveBeenCalled();
    });

    it('deve lançar erro se o cliente não estiver cadastrado', async () => {
        const input: AdicionarPedidoInput = {
            clienteCPF: '12345678901',
            pedidoProdutos: []
        };
        mockClienteRepository.findByCPF.mockResolvedValue(null as unknown as Cliente);
        await expect(useCase.adicionarPedido(input)).rejects.toThrow(ErroNegocio);
    });
});
