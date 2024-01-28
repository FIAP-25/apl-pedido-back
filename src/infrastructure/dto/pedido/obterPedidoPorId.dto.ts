import { Cliente } from '@/domain/entity/cliente.model';
import { PedidoProduto } from '@/domain/entity/pedido-produto.model';
import { PedidoStatus } from '@/domain/entity/pedido-status.model';
import { AutoMap } from '@automapper/classes';

export class ObterPedidoPorIdOutput {
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
