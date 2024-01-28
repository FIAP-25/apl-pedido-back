import { Cliente } from '@/domain/entity/cliente.model';

export abstract class IClienteRepository {
    abstract find(): Promise<Cliente[]>;
    abstract findByCPF(cpf: string): Promise<Cliente>;
    abstract save(cliente: Cliente): Promise<Cliente>;
    abstract saveMany(clientes: Cliente[]): Promise<Cliente[]>;
    abstract remove(id: string): Promise<void>;
}
