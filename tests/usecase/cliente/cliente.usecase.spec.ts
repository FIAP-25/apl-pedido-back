import { IClienteRepository } from '@/domain/contract/repository/cliente.interface';
import { Cliente } from '@/domain/entity/cliente.model';
import { ErroNegocio } from '@/domain/exception/erro.module';
import { AdicionarClienteInput } from '@/infrastructure/dto/cliente/adicionarCliente.dto';
import { AtualizarClientePorCpfInput } from '@/infrastructure/dto/cliente/atualizarClientePorCpf.dto';
import { ClienteUseCase } from '@/usecase/cliente/cliente.usecase';
import { Test, TestingModule } from '@nestjs/testing';

jest.mock('@/application/mapper/base.mapper', () => ({
    mapper: {
        map: jest.fn().mockImplementation((source, _sourceIdentifier, destinationIdentifier) => {
            if (destinationIdentifier === Cliente) {
                return Object.assign(new Cliente(), source);
            }
            return source;
        }),
        mapArray: jest.fn().mockImplementation((entities) => entities)
    }
}));

describe('ClienteUseCase', () => {
    let useCase: ClienteUseCase;
    let mockClienteRepository: jest.Mocked<IClienteRepository>;

    beforeEach(async () => {
        mockClienteRepository = {
            find: jest.fn(),
            findByCPF: jest.fn(),
            save: jest.fn(),
            saveMany: jest.fn(),
            remove: jest.fn()
        } as jest.Mocked<IClienteRepository>;

        const module: TestingModule = await Test.createTestingModule({
            providers: [ClienteUseCase, { provide: IClienteRepository, useValue: mockClienteRepository }]
        }).compile();

        useCase = module.get<ClienteUseCase>(ClienteUseCase);
    });

    it('deve adicionar um cliente', async () => {
        const input: AdicionarClienteInput = {
            cpf: '90088522091',
            nomeCompleto: 'Nome Cliente',
            email: 'email@cliente.com'
        };

        const clienteMock = new Cliente();
        clienteMock.cpf = input.cpf.toString();
        clienteMock.nomeCompleto = input.nomeCompleto;
        clienteMock.email = input.email;

        mockClienteRepository.findByCPF.mockResolvedValue(null as unknown as Cliente);

        mockClienteRepository.save.mockResolvedValue(clienteMock);

        const resultado = await useCase.adicionarCliente(input);

        expect(mockClienteRepository.findByCPF).toHaveBeenCalledWith(input.cpf);
        expect(mockClienteRepository.save).toHaveBeenCalledWith(expect.any(Cliente));
        expect(resultado).toMatchObject({
            cpf: input.cpf,
            nomeCompleto: input.nomeCompleto,
            email: input.email
        });
    });

    it('deve remover um cliente por CPF', async () => {
        const cpf = '90088522091';
        const clienteMock = new Cliente();
        clienteMock.cpf = cpf;

        mockClienteRepository.findByCPF.mockResolvedValue(clienteMock);
        mockClienteRepository.remove.mockResolvedValue();

        await useCase.removerClientePorCpf(cpf);

        expect(mockClienteRepository.findByCPF).toHaveBeenCalledWith(cpf);
        expect(mockClienteRepository.remove).toHaveBeenCalledWith(cpf);
    });

    it('deve atualizar um cliente por CPF', async () => {
        const input: AtualizarClientePorCpfInput = {
            cpf: '90088522091',
            nomeCompleto: 'Nome Atualizado',
            email: 'novoemail@cliente.com'
        };
        const clienteMock = new Cliente();
        clienteMock.cpf = input.cpf?.toString() ?? '90088522091';
        clienteMock.nomeCompleto = 'Nome Antigo';
        clienteMock.email = 'email@cliente.com';

        mockClienteRepository.findByCPF.mockResolvedValue(clienteMock);

        clienteMock.nomeCompleto = input.nomeCompleto;
        clienteMock.email = input.email;
        mockClienteRepository.save.mockResolvedValue(clienteMock);

        const resultado = await useCase.atualizarClientePorCpf(input);

        expect(mockClienteRepository.findByCPF).toHaveBeenCalledWith(input.cpf);
        expect(mockClienteRepository.save).toHaveBeenCalledWith(expect.any(Cliente));
        expect(resultado).toMatchObject({
            cpf: input.cpf,
            nomeCompleto: input.nomeCompleto,
            email: input.email
        });
    });

    it('deve obter um cliente por CPF', async () => {
        const cpf = '90088522091';
        const clienteMock = new Cliente();
        clienteMock.cpf = cpf;
        clienteMock.nomeCompleto = 'Nome Cliente';
        clienteMock.email = 'email@cliente.com';

        mockClienteRepository.findByCPF.mockResolvedValue(clienteMock);

        const resultado = await useCase.obterClientePorCpf(cpf);

        expect(mockClienteRepository.findByCPF).toHaveBeenCalledWith(cpf);
        expect(resultado).toMatchObject({
            cpf: cpf,
            nomeCompleto: clienteMock.nomeCompleto,
            email: clienteMock.email
        });
    });

    it('deve obter todos os clientes', async () => {
        const clientesMock = [new Cliente(), new Cliente()];

        mockClienteRepository.find.mockResolvedValue(clientesMock);

        const resultado = await useCase.obterClientes();

        expect(mockClienteRepository.find).toHaveBeenCalled();
        expect(resultado.length).toBe(clientesMock.length);
    });

    it('deve lançar erro ao tentar adicionar um cliente já cadastrado', async () => {
        const input: AdicionarClienteInput = {
            cpf: '90088522091',
            nomeCompleto: 'Nome Cliente',
            email: 'email@cliente.com'
        };

        const clienteExistente = new Cliente();
        clienteExistente.cpf = input.cpf;
        clienteExistente.nomeCompleto = input.nomeCompleto;
        clienteExistente.email = input.email;

        mockClienteRepository.findByCPF.mockResolvedValue(clienteExistente);

        await expect(useCase.adicionarCliente(input)).rejects.toThrow(new ErroNegocio('cliente-cpf-cadastrado'));
    });

    it('deve lançar erro ao tentar remover um cliente não cadastrado', async () => {
        const cpf = '90088522091';

        mockClienteRepository.findByCPF.mockResolvedValue(null as unknown as Cliente);

        await expect(useCase.removerClientePorCpf(cpf)).rejects.toThrow(new ErroNegocio('cliente-nao-cadastrado'));
    });

    it('deve lançar erro ao tentar atualizar um cliente não cadastrado', async () => {
        const input: AtualizarClientePorCpfInput = {
            cpf: '90088522091',
            nomeCompleto: 'Nome Atualizado',
            email: 'novoemail@cliente.com'
        };

        mockClienteRepository.findByCPF.mockResolvedValue(null as unknown as Cliente);

        await expect(useCase.atualizarClientePorCpf(input)).rejects.toThrow(new ErroNegocio('cliente-nao-cadastrado'));
    });

    it('deve lançar erro ao tentar obter um cliente por CPF não cadastrado', async () => {
        const cpf = '90088522091';

        mockClienteRepository.findByCPF.mockResolvedValue(null as unknown as Cliente);

        await expect(useCase.obterClientePorCpf(cpf)).rejects.toThrow(new ErroNegocio('cliente-nao-cadastrado'));
    });

    it('deve lançar erro ao tentar atualizar um cliente com body vazio', async () => {
        const input: AtualizarClientePorCpfInput = {
            cpf: '90088522091',
            nomeCompleto: '',
            email: ''
        };

        const clienteExistente = new Cliente();
        clienteExistente.cpf = input.cpf ?? '90088522091';
        clienteExistente.nomeCompleto = 'Nome Cliente';
        clienteExistente.email = 'email@cliente.com';

        mockClienteRepository.findByCPF.mockResolvedValue(clienteExistente);

        await expect(useCase.atualizarClientePorCpf(input)).rejects.toThrow(new ErroNegocio('body-vazio'));
    });

    it('deve lançar erro ao tentar adicionar um cliente com CPF inválido', async () => {
        const input: AdicionarClienteInput = {
            cpf: 'cpf-invalido',
            nomeCompleto: 'Nome Cliente',
            email: 'email@cliente.com'
        };

        await expect(useCase.adicionarCliente(input)).rejects.toThrow(new ErroNegocio('cliente-cpf-invalido'));
    });
});
