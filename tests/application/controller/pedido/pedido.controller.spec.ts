import { PedidoController } from '@/application/controller/pedido/pedido.controller';
import { IPedidoUseCase } from '@/domain/contract/usecase/pedido.interface';
import { Cliente } from '@/domain/entity/cliente.model';
import { PedidoStatus } from '@/domain/entity/pedido-status.model';
import { Pedido } from '@/domain/entity/pedido.model';
import { AdicionarPedidoInput, AdicionarPedidoOutput } from '@/infrastructure/dto/pedido/adicionarPedido.dto';
import { AtualizarStatusPedidoInput, AtualizarStatusPedidoOutput } from '@/infrastructure/dto/pedido/atualizarPedido.dto';
import { webhookPedido } from '@/infrastructure/dto/pedido/webhookPedido.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';

describe('PedidoController', () => {
    let controller: PedidoController;
    let mockPedidoUseCase: jest.Mocked<IPedidoUseCase>;

    beforeEach(async () => {
        mockPedidoUseCase = {
            adicionarPedido: jest.fn(),
            removerPedidoPorId: jest.fn(),
            atualizarPedidoStatusPorId: jest.fn(),
            obterPedidos: jest.fn(),
            webhookConfirmacaoPagamento: jest.fn(),
            obterFilaPedidos: jest.fn(),
            obterPedidoPorId: jest.fn(),
            obterStatusPedidosPorId: jest.fn()
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [PedidoController],
            providers: [{ provide: IPedidoUseCase, useValue: mockPedidoUseCase }]
        }).compile();

        controller = module.get<PedidoController>(PedidoController);
    });

    it('deve adicionar um pedido', async () => {
        const input: AdicionarPedidoInput = new AdicionarPedidoInput();
        const expectedOutput: AdicionarPedidoOutput = {
            id: '123',
            valorTotal: 100,
            pedidoProdutos: [],
            dataCadastro: new Date(),
            status: new PedidoStatus(),
            dataAtualizacao: new Date(),
            pagamentoStatus: 'Pago',
            cliente: new Cliente()
        };
        mockPedidoUseCase.adicionarPedido.mockResolvedValue(expectedOutput);

        const response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;

        await controller.adicionarPedido(input, response);

        expect(response.status).toHaveBeenCalledWith(200);
        expect(response.json).toHaveBeenCalledWith({ id: expectedOutput.id });
        expect(mockPedidoUseCase.adicionarPedido).toHaveBeenCalledWith(input);
    });

    it('deve remover um pedido por id', async () => {
        const id = '123';

        const response = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            sendStatus: jest.fn()
        } as unknown as Response;

        await controller.removerPedidoPorId(id, response);

        expect(response.status).toHaveBeenCalledWith(204);
        expect(response.send).toHaveBeenCalled();
        expect(mockPedidoUseCase.removerPedidoPorId).toHaveBeenCalledWith(id);
    });

    it('deve atualizar o status do pedido pelo id', async () => {
        const id = '123';
        const input = new AtualizarStatusPedidoInput();
        const expectedOutput: AtualizarStatusPedidoOutput = {
            id: id,
            status: new PedidoStatus(),
            valorTotal: 0,
            pedidoProdutos: [],
            dataCadastro: new Date(),
            dataAtualizacao: new Date(),
            pagamentoStatus: 'Pago',
            cliente: new Cliente()
        };
        mockPedidoUseCase.atualizarPedidoStatusPorId.mockResolvedValue(expectedOutput);

        const response = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
        await controller.atualizarPedidoStatusPorId(id, input, response);

        expect(response.json).toHaveBeenCalledWith({ dados: expectedOutput });
        expect(mockPedidoUseCase.atualizarPedidoStatusPorId).toHaveBeenCalledWith(id, input);
    });

    it('deve obter pedidos', async () => {
        const expectedOutput: Pedido[] = [];
        mockPedidoUseCase.obterPedidos.mockResolvedValue(expectedOutput);

        const response = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
        await controller.obterPedidos(response);

        expect(response.json).toHaveBeenCalledWith({ dados: expectedOutput });
        expect(mockPedidoUseCase.obterPedidos).toHaveBeenCalled();
    });

    it('deve processar webhook de confirmação do pedido', async () => {
        const id = '123';
        const input = new webhookPedido();
        const expectedOutput: Pedido = {
            id: id,
            status: new PedidoStatus(),
            valorTotal: 0,
            pedidoProdutos: [],
            dataCadastro: new Date(),
            dataAtualizacao: new Date(),
            pagamentoStatus: 'Pago',
            cliente: new Cliente()
        };
        mockPedidoUseCase.webhookConfirmacaoPagamento.mockResolvedValue(expectedOutput);

        const response = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
        await controller.webhookConfirmacaoPedido(id, input, response);

        expect(response.json).toHaveBeenCalledWith({ dados: expectedOutput });
        expect(mockPedidoUseCase.webhookConfirmacaoPagamento).toHaveBeenCalledWith(input);
    });

    it('deve obter a fila de pedidos', async () => {
        const expectedOutput: Pedido[] = [];
        mockPedidoUseCase.obterFilaPedidos.mockResolvedValue(expectedOutput);

        const response = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
        await controller.obterPedidosFila(response);

        expect(response.json).toHaveBeenCalledWith({ dados: expectedOutput });
        expect(mockPedidoUseCase.obterFilaPedidos).toHaveBeenCalled();
    });
});
