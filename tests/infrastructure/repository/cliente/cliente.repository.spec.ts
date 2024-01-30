import { Cliente } from '@/domain/entity/cliente.model';
import { ClienteEntity } from '@/infrastructure/entity/cliente.entity';
import { ClienteRepository } from '@/infrastructure/repository/cliente/cliente.repository';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

describe('ClienteRepository', () => {
    let clienteRepository: ClienteRepository;
    let mockRepository: jest.Mocked<Repository<ClienteEntity>>;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                ClienteRepository,
                {
                    provide: getRepositoryToken(ClienteEntity),
                    useValue: {
                        find: jest.fn(),
                        findOneBy: jest.fn(),
                        save: jest.fn(),
                        delete: jest.fn()
                    }
                }
            ]
        }).compile();

        clienteRepository = module.get<ClienteRepository>(ClienteRepository);
        mockRepository = module.get(getRepositoryToken(ClienteEntity));
    });

    it('deve retornar uma lista de clientes', async () => {
        const mockClientes = [{ cpf: '12345678901', email: 'test@example.com', nomeCompleto: 'Test User' }];
        mockRepository.find.mockResolvedValue(mockClientes as ClienteEntity[]); // Mock com tipo correto

        const clientes = await clienteRepository.find();

        expect(clientes).toEqual(mockClientes);
        expect(mockRepository.find).toHaveBeenCalled();
    });

    it('deve retornar um cliente pelo CPF', async () => {
        const cpf = '12345678901';
        const mockCliente = new ClienteEntity(); // Criação de um objeto do tipo ClienteEntity
        mockCliente.cpf = cpf;
        mockCliente.email = 'test@example.com';
        mockCliente.nomeCompleto = 'Test User';

        mockRepository.findOneBy.mockResolvedValue(mockCliente); // Uso do mockCliente como ClienteEntity

        const cliente = await clienteRepository.findByCPF(cpf);

        expect(cliente).toEqual(mockCliente);
        expect(mockRepository.findOneBy).toHaveBeenCalledWith({ cpf });
    });

    it('deve salvar um cliente', async () => {
        const mockCliente = new ClienteEntity(); // Criação de um objeto do tipo ClienteEntity
        mockCliente.cpf = '12345678901';
        mockCliente.email = 'test@example.com';
        mockCliente.nomeCompleto = 'Test User';

        mockRepository.save.mockResolvedValue(mockCliente); // Uso do mockCliente como ClienteEntity

        const cliente = await clienteRepository.save(mockCliente);

        expect(cliente).toEqual(mockCliente);
        expect(mockRepository.save).toHaveBeenCalledWith(mockCliente);
    });

    it('deve salvar vários clientes', async () => {
        // Criação de objetos ClienteEntity
        const clienteEntityMock1 = new ClienteEntity();
        clienteEntityMock1.cpf = '12345678901';
        clienteEntityMock1.email = 'test@example.com';
        clienteEntityMock1.nomeCompleto = 'Test User';

        const clienteEntityMock2 = new ClienteEntity();
        clienteEntityMock2.cpf = '98765432109';
        clienteEntityMock2.email = 'test@example.com';
        clienteEntityMock2.nomeCompleto = 'Test User 2';

        // Criação de objetos Cliente
        const cliente1 = new Cliente();
        cliente1.cpf = '12345678901';
        cliente1.email = 'test@example.com';
        cliente1.nomeCompleto = 'Test User';

        const cliente2 = new Cliente();
        cliente2.cpf = '98765432109';
        cliente2.email = 'test@example.com';
        cliente2.nomeCompleto = 'Test User 2';

        const clientes = [cliente1, cliente2];

        mockRepository.save.mockResolvedValue([clienteEntityMock1, clienteEntityMock2] as any);

        const resultado = await clienteRepository.saveMany(clientes);

        expect(mockRepository.save).toHaveBeenCalledWith(clientes);
        expect(resultado).toEqual([clienteEntityMock1, clienteEntityMock2]);
    });

    it('deve remover um cliente', async () => {
        const cpf = '12345678901';
        const deleteResultMock: DeleteResult = {
            affected: 1,
            raw: {}
        };
        mockRepository.delete.mockResolvedValue(deleteResultMock);

        await clienteRepository.remove(cpf);

        expect(mockRepository.delete).toHaveBeenCalledWith(cpf);
    });
});
