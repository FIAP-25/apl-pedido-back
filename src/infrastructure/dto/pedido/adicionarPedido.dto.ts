import { Cliente } from '@/domain/entity/cliente.model';
import { PedidoProduto } from '@/domain/entity/pedido-produto.model';
import { PedidoStatus } from '@/domain/entity/pedido-status.model';
import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class AdicionarPedidoInput {
    @AutoMap()
    @ApiProperty({ required: true })
    clienteCPF: string;

    @AutoMap()
    @ApiProperty({ required: true, type: [PedidoProduto] })
    pedidoProdutos: PedidoProduto[];
}

export class AdicionarPedidoOutput {
    @AutoMap()
    id: string;

    @AutoMap()
    status: PedidoStatus;

    @AutoMap()
    cliente: Cliente;

    @AutoMap()
    valorTotal: number;

    @AutoMap()
    pedidoProdutos: PedidoProduto[];

    @AutoMap()
    dataCadastro: Date;

    @AutoMap()
    dataAtualizacao: Date;

    @AutoMap()
    pagamentoStatus: string;
}
