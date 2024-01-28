import { AdicionarClienteInput, AdicionarClienteOutput } from '@/infrastructure/dto/cliente/adicionarCliente.dto';
import { AtualizarClientePorCpfInput, AtualizarClientePorCpfOutput } from '@/infrastructure/dto/cliente/atualizarClientePorCpf.dto';
import { ObterClientePorCpfOutput } from '@/infrastructure/dto/cliente/obterClientePorCpf.dto';
import { ObterClientesOutput } from '@/infrastructure/dto/cliente/obterClientes.dto';

export abstract class IClienteUseCase {
    abstract adicionarCliente(input: AdicionarClienteInput): Promise<AdicionarClienteOutput>;
    abstract removerClientePorCpf(cpf: string): Promise<void>;
    abstract atualizarClientePorCpf(input: AtualizarClientePorCpfInput): Promise<AtualizarClientePorCpfOutput>;
    abstract obterClientePorCpf(cpf: string): Promise<ObterClientePorCpfOutput>;
    abstract obterClientes(): Promise<ObterClientesOutput[]>;
}
