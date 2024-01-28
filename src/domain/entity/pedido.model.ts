import { PedidoProduto } from '@/domain/entity/pedido-produto.model';
import { AutoMap } from '@automapper/classes';
import { Cliente } from '@/domain/entity/cliente.model';
import { PedidoStatus } from './pedido-status.model';

export class Pedido {
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
