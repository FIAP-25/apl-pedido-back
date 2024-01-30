import { ClienteController } from '@/application/controller/cliente/cliente.controller';
import { IClienteUseCase } from '@/domain/contract/usecase/cliente.interface';
import { AdicionarClienteInput, AdicionarClienteOutput } from '@/infrastructure/dto/cliente/adicionarCliente.dto';
import { AtualizarClientePorCpfInput, AtualizarClientePorCpfOutput } from '@/infrastructure/dto/cliente/atualizarClientePorCpf.dto';
import { ObterClientePorCpfOutput } from '@/infrastructure/dto/cliente/obterClientePorCpf.dto';
import { ObterClientesOutput } from '@/infrastructure/dto/cliente/obterClientes.dto';
import { Response } from 'express';

jest.mock('@/domain/contract/usecase/cliente.interface');

describe('ClienteController', () => {
    let controller: ClienteController;
    let mockClienteUseCase: jest.Mocked<IClienteUseCase>;
    let mockResponse: jest.Mocked<Response>;

    beforeEach(() => {
        mockClienteUseCase = {
            adicionarCliente: jest.fn(),
            removerClientePorCpf: jest.fn(),
            atualizarClientePorCpf: jest.fn(),
            obterClientes: jest.fn(),
            obterClientePorCpf: jest.fn()
        };

        controller = new ClienteController(mockClienteUseCase);
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn().mockReturnThis()
        } as unknown as jest.Mocked<Response>;
    });

    it('deve adicionar um cliente', async () => {
        const input: AdicionarClienteInput = {
            cpf: '90088522091',
            email: 'test@email.com',
            nomeCompleto: 'Osvaldo test'
        };
        const clienteAdicionado: AdicionarClienteOutput = new AdicionarClienteOutput();
        mockClienteUseCase.adicionarCliente.mockResolvedValue(clienteAdicionado);

        const result = await controller.adicionarCliente(input, mockResponse);

        expect(mockClienteUseCase.adicionarCliente).toHaveBeenCalledWith(input);
        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.json).toHaveBeenCalledWith({ dados: clienteAdicionado });
    });

    it('deve remover um cliente por CPF', async () => {
        const cpf = '90088522091';
        await controller.removerClientePorCPF(cpf, mockResponse);

        expect(mockClienteUseCase.removerClientePorCpf).toHaveBeenCalledWith(cpf);
        expect(mockResponse.status).toHaveBeenCalledWith(204);
    });

    it('deve atualizar um cliente pelo CPF', async () => {
        const cpf = '90088522091';
        const input: AtualizarClientePorCpfInput = {
            email: 'test@email.com.br',
            nomeCompleto: 'Osvaldo test'
        };
        const clienteAtualizado: AtualizarClientePorCpfOutput = new AtualizarClientePorCpfOutput();
        mockClienteUseCase.atualizarClientePorCpf.mockResolvedValue(clienteAtualizado);

        const result = await controller.atualizarClientePorCPF(cpf, input, mockResponse);

        expect(mockClienteUseCase.atualizarClientePorCpf).toHaveBeenCalledWith({ ...input, cpf });
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({ dados: clienteAtualizado });
    });

    it('deve obter a lista de clientes', async () => {
        const clientes: ObterClientesOutput[] = [new ObterClientesOutput(), new ObterClientesOutput()];
        mockClienteUseCase.obterClientes.mockResolvedValue(clientes);

        const result = await controller.obterClientes(mockResponse);

        expect(mockClienteUseCase.obterClientes).toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({ dados: clientes });
    });

    it('deve obter um cliente pelo CPF', async () => {
        const cpf = '90088522091';
        const cliente: ObterClientePorCpfOutput = {
            cpf: '90088522091',
            email: 'test@email.com',
            nomeCompleto: 'osvaldo test'
        };
        mockClienteUseCase.obterClientePorCpf.mockResolvedValue(cliente);

        const result = await controller.obterClientePorCPF(cpf, mockResponse);

        expect(mockClienteUseCase.obterClientePorCpf).toHaveBeenCalledWith(cpf);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({ dados: cliente });
    });
});
