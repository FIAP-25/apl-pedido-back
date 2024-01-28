import { created, noContent, ok } from '@/application/helper/http.helper';
import { IClienteUseCase } from '@/domain/contract/usecase/cliente.interface';
import { AdicionarClienteInput } from '@/infrastructure/dto/cliente/adicionarCliente.dto';
import { AtualizarClientePorCpfInput } from '@/infrastructure/dto/cliente/atualizarClientePorCpf.dto';
import { Body, Controller, Delete, Get, Param, Post, Put, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Clientes')
@Controller('api/clientes')
export class ClienteController {
    constructor(private clienteUseCase: IClienteUseCase) {}

    @Post()
    @ApiOperation({ summary: 'Adiciona um cliente' })
    async adicionarCliente(@Body() body: AdicionarClienteInput, @Res() res: Response): Promise<any> {
        const cliente = body;

        const clienteAdicionado = await this.clienteUseCase.adicionarCliente(cliente);

        return created(clienteAdicionado, res);
    }

    @Delete(':cpf')
    @ApiOperation({ summary: 'Remove um cliente pelo cpf' })
    async removerClientePorCPF(@Param('cpf') cpf: string, @Res() res: Response): Promise<any> {
        await this.clienteUseCase.removerClientePorCpf(cpf);

        return noContent(res);
    }

    @Put(':cpf')
    @ApiOperation({ summary: 'Atualiza um cliente pelo CPF' })
    async atualizarClientePorCPF(@Param('cpf') cpf: string, @Body() body: AtualizarClientePorCpfInput, @Res() res: Response): Promise<any> {
        const cliente = body;

        cliente.cpf = cpf;

        const clienteAtualizado = await this.clienteUseCase.atualizarClientePorCpf(cliente);

        return ok(clienteAtualizado, res);
    }

    @Get()
    @ApiOperation({ summary: 'Obtém a lista de clientes' })
    async obterClientes(@Res() res: Response): Promise<any> {
        const cliente = await this.clienteUseCase.obterClientes();

        return ok(cliente, res);
    }

    @Get(':cpf')
    @ApiOperation({ summary: 'Obtém um cliente pelo cpf' })
    async obterClientePorCPF(@Param('cpf') cpf: string, @Res() res: Response): Promise<any> {
        const cliente = await this.clienteUseCase.obterClientePorCpf(cpf);

        return ok(cliente, res);
    }
}
