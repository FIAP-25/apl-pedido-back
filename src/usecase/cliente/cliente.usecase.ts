import { mapper } from '@/application/mapper/base.mapper';
import { IClienteRepository } from '@/domain/contract/repository/cliente.interface';
import { IClienteUseCase } from '@/domain/contract/usecase/cliente.interface';
import { Cliente } from '@/domain/entity/cliente.model';
import { ErroNegocio } from '@/domain/exception/erro.module';
import { AdicionarClienteInput, AdicionarClienteOutput } from '@/infrastructure/dto/cliente/adicionarCliente.dto';
import { AtualizarClientePorCpfInput, AtualizarClientePorCpfOutput } from '@/infrastructure/dto/cliente/atualizarClientePorCpf.dto';
import { ObterClientePorCpfOutput } from '@/infrastructure/dto/cliente/obterClientePorCpf.dto';
import { ObterClientesOutput } from '@/infrastructure/dto/cliente/obterClientes.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ClienteUseCase implements IClienteUseCase {
    constructor(private clienteRepository: IClienteRepository) {}

    async adicionarCliente(input: AdicionarClienteInput): Promise<AdicionarClienteOutput> {
        const cliente: Cliente = mapper.map(input, AdicionarClienteInput, Cliente);
        cliente.cpf = cliente?.cpf?.toString();
        cliente.email = cliente.email ?? '';

        const clienteExiste = await this.clienteRepository.findByCPF(cliente.cpf);

        if (clienteExiste) {
            throw new ErroNegocio('cliente-cpf-cadastrado');
        }

        cliente.validarClienteAdicionar();

        const clienteAdicionado = await this.clienteRepository.save(cliente);
        return mapper.map(clienteAdicionado, Cliente, AdicionarClienteOutput);
    }

    async removerClientePorCpf(cpf: string): Promise<void> {
        const clienteExiste = await this.clienteRepository.findByCPF(cpf);

        if (!clienteExiste) {
            throw new ErroNegocio('cliente-nao-cadastrado');
        }

        await this.clienteRepository.remove(cpf);
    }

    async atualizarClientePorCpf(input: AtualizarClientePorCpfInput): Promise<AtualizarClientePorCpfOutput> {
        const cliente: Cliente = mapper.map(input, AtualizarClientePorCpfInput, Cliente);

        if (!cliente?.email && !cliente?.nomeCompleto) {
            throw new ErroNegocio('body-vazio');
        }

        cliente.cpf = cliente?.cpf?.toString();
        cliente.email = cliente.email ?? '';

        const clienteExiste = await this.clienteRepository.findByCPF(cliente.cpf);

        if (!clienteExiste) {
            throw new ErroNegocio('cliente-nao-cadastrado');
        }

        cliente.validarClienteAtualizar();

        const produtoAtualizado = await this.clienteRepository.save(cliente);

        return mapper.map(produtoAtualizado, Cliente, AtualizarClientePorCpfOutput);
    }

    async obterClientePorCpf(cpf: string): Promise<ObterClientePorCpfOutput> {
        const cliente = await this.clienteRepository.findByCPF(cpf);

        if (!cliente) {
            throw new ErroNegocio('cliente-nao-cadastrado');
        }

        return mapper.map(cliente, Cliente, ObterClientePorCpfOutput);
    }

    async obterClientes(): Promise<ObterClientesOutput[]> {
        const cliente = await this.clienteRepository.find();

        return mapper.mapArray(cliente, Cliente, ObterClientesOutput);
    }
}
