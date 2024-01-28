import { customResponseSuccess, noContent, ok } from '@/application/helper/http.helper';
import { IPedidoUseCase } from '@/domain/contract/usecase/pedido.interface';

import { AdicionarPedidoInput } from '@/infrastructure/dto/pedido/adicionarPedido.dto';
import { AtualizarStatusPedidoInput } from '@/infrastructure/dto/pedido/atualizarPedido.dto';
import { webhookPedido } from '@/infrastructure/dto/pedido/webhookPedido.dto';
import { Body, Controller, Delete, Get, Param, Patch, Post, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Pedidos')
@Controller('api/pedidos')
export class PedidoController {
    constructor(private pedidoUseCase: IPedidoUseCase) {}

    @Post()
    @ApiOperation({ summary: 'Adiciona um pedido' })
    async adicionarPedido(@Body() body: AdicionarPedidoInput, @Res() res: Response): Promise<any> {
        const pedido = body;
        const pedidoAdicionado = await this.pedidoUseCase.adicionarPedido(pedido);

        return customResponseSuccess(pedidoAdicionado.id, res);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remove um pedido pelo id' })
    async removerPedidoPorId(@Param('id') id: string, @Res() res: Response): Promise<any> {
        await this.pedidoUseCase.removerPedidoPorId(id);

        return noContent(res);
    }

    @Patch('/status/:id')
    @ApiOperation({ summary: 'Atualiza o status do pedido pelo id' })
    async atualizarPedidoStatusPorId(@Param('id') id: string, @Body() body: AtualizarStatusPedidoInput, @Res() res: Response): Promise<any> {
        const pedidoAtualizado = await this.pedidoUseCase.atualizarPedidoStatusPorId(id, body);

        return ok(pedidoAtualizado, res);
    }

    @Get()
    @ApiOperation({ summary: 'Obtem pedidos' })
    async obterPedidos(@Res() res: Response): Promise<any> {
        const pedidos = await this.pedidoUseCase.obterPedidos();

        return ok(pedidos, res);
    }

    @Patch('/webhook')
    @ApiOperation({ summary: 'Webhook de confirmação do pedido' })
    async webhookConfirmacaoPedido(@Param('id') id: string, @Body() body: webhookPedido, @Res() res: Response): Promise<any> {
        const pedidos = await this.pedidoUseCase.webhookConfirmacaoPagamento(body);

        return ok(pedidos, res);
    }

    @Get('/fila')
    @ApiOperation({ summary: 'Obtem fila de pedidos' })
    async obterPedidosFila(@Res() res: Response): Promise<any> {
        const pedidos = await this.pedidoUseCase.obterFilaPedidos();

        return ok(pedidos, res);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obter pedido pelo id' })
    async obterPedidoPorId(@Param('id') id: string, @Res() res: Response): Promise<any> {
        const pedido = await this.pedidoUseCase.obterPedidoPorId(id);

        return ok(pedido, res);
    }
}
