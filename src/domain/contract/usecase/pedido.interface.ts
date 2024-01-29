import { Pedido } from '@/domain/entity/pedido.model';
import { AdicionarPedidoInput, AdicionarPedidoOutput } from '@/infrastructure/dto/pedido/adicionarPedido.dto';
import { AtualizarStatusPedidoInput, AtualizarStatusPedidoOutput } from '@/infrastructure/dto/pedido/atualizarPedido.dto';
import { ObterPedidoPorIdOutput } from '@/infrastructure/dto/pedido/obterPedidoPorId.dto';
import { webhookPedido } from '@/infrastructure/dto/pedido/webhookPedido.dto';

export abstract class IPedidoUseCase {
    abstract adicionarPedido(input: AdicionarPedidoInput): Promise<AdicionarPedidoOutput>;
    abstract removerPedidoPorId(id: string): Promise<void>;
    abstract atualizarPedidoStatusPorId(id: string, input: AtualizarStatusPedidoInput): Promise<AtualizarStatusPedidoOutput>;
    abstract obterPedidoPorId(id: string): Promise<ObterPedidoPorIdOutput>;
    abstract obterPedidos(): Promise<ObterPedidoPorIdOutput[]>;
    abstract obterStatusPedidosPorId(id: string): Promise<string>;
    abstract webhookConfirmacaoPagamento(body: webhookPedido): Promise<Pedido>;
    abstract obterFilaPedidos(): Promise<any>;
    abstract enviarPagamento(id: string): Promise<void>;
    abstract enviarProducao(id: string): Promise<void>;
}
