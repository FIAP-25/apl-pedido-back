import { mapper } from '@/application/mapper/base.mapper';
import { IClienteRepository } from '@/domain/contract/repository/cliente.interface';
import { IPedidoProdutoRepository } from '@/domain/contract/repository/pedido-produto.interface';
import { IPedidoStatusRepository } from '@/domain/contract/repository/pedido-status.interface';
import { IPedidoRepository } from '@/domain/contract/repository/pedido.interface';
import { IProdutoRepository } from '@/domain/contract/repository/produto.interface';
import { IPedidoUseCase } from '@/domain/contract/usecase/pedido.interface';
import { PedidoProduto } from '@/domain/entity/pedido-produto.model';
import { Pedido } from '@/domain/entity/pedido.model';
import { ErroNegocio } from '@/domain/exception/erro.module';
import { AdicionarPedidoInput, AdicionarPedidoOutput } from '@/infrastructure/dto/pedido/adicionarPedido.dto';
import { AtualizarStatusPedidoInput, AtualizarStatusPedidoOutput } from '@/infrastructure/dto/pedido/atualizarPedido.dto';
import { ObterPedidoPorIdOutput } from '@/infrastructure/dto/pedido/obterPedidoPorId.dto';
import { webhookPedido } from '@/infrastructure/dto/pedido/webhookPedido.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PedidoUseCase implements IPedidoUseCase {
    constructor(private clienteRepository: IClienteRepository, private pedidoRepository: IPedidoRepository, private pedidoStatusRepository: IPedidoStatusRepository, private pedidoProdutoRepository: IPedidoProdutoRepository, private produtoRepository: IProdutoRepository) {}

    async adicionarPedido(input: AdicionarPedidoInput): Promise<AdicionarPedidoOutput> {
        const pedido: Pedido = mapper.map(input, AdicionarPedidoInput, Pedido);
        pedido.pedidoProdutos = [];

        pedido.pagamentoStatus = 'pagamento_pendente';

        const pedidoProdutoQuantidadeInvalida = input.pedidoProdutos.some((produto) => produto.quantidade <= 0);

        if (pedidoProdutoQuantidadeInvalida) {
            throw new ErroNegocio('pedido-produto-quantidade-invalida');
        }

        const existeProdutoDuplicado = input.pedidoProdutos.some((produto, index) => input.pedidoProdutos.findIndex((produtoEncontrado) => produtoEncontrado.id === produto.id) !== index);

        if (existeProdutoDuplicado) {
            throw new ErroNegocio('pedido-produto-duplicado');
        }

        if (input.clienteCPF) {
            const clientePedido = await this.clienteRepository.findByCPF(input.clienteCPF);

            if (!clientePedido) {
                throw new ErroNegocio('cliente-nao-cadastrado');
            }

            pedido.cliente = clientePedido;
        }

        const pedidoStatus = await this.pedidoStatusRepository.findByTag('pedido_recebido');

        if (pedidoStatus) {
            pedido.status = pedidoStatus;
        }

        const produtos = await this.produtoRepository.find();

        input.pedidoProdutos.forEach((produto) => {
            const produtoEncontrado = produtos.find((produtoEncontrado) => produtoEncontrado.id === produto.id);

            if (!produtoEncontrado) {
                throw new ErroNegocio('pedido-produto-nao-existe');
            }
        });

        pedido.valorTotal = input.pedidoProdutos
            .map((pedidoProduto) => {
                const produto = produtos.find((produto) => produto.id === pedidoProduto.id);
                if (produto) {
                    return produto?.preco * pedidoProduto.quantidade;
                }
                return 0;
            })
            .reduce((soma, preco) => soma + preco);

        const pedidoAdicionado = await this.pedidoRepository.save(pedido);

        const pedidoProduto = input.pedidoProdutos.map((pedidoProduto) => {
            const produto = produtos.find((produto) => produto.id === pedidoProduto.id);

            return {
                pedido: { ...pedidoAdicionado },
                produto: produto,
                quantidade: pedidoProduto.quantidade
            };
        });

        if (pedidoProduto) {
            pedido.pedidoProdutos = pedidoProduto as PedidoProduto[];
        }

        const pedidoProdutoAdicionado = await this.pedidoProdutoRepository.saveMany(pedido.pedidoProdutos);

        pedidoAdicionado.pedidoProdutos = pedidoProdutoAdicionado.map((pedidoProduto) => {
            return {
                id: pedidoProduto.id,
                produto: pedidoProduto.produto,
                quantidade: pedidoProduto.quantidade
            };
        });

        return mapper.map(pedidoAdicionado, Pedido, AdicionarPedidoOutput);
    }

    async removerPedidoPorId(id: string): Promise<void> {
        await this.pedidoRepository.removeById(id);
    }

    async atualizarPedidoStatusPorId(id: string, input: AtualizarStatusPedidoInput): Promise<AtualizarStatusPedidoOutput> {
        const pedidoEncontrado = await this.pedidoRepository.findById(id);

        if (!pedidoEncontrado) {
            throw new ErroNegocio('pedido-nao-existe');
        }

        const pedidoStatusEncontrado = await this.pedidoStatusRepository.findByTag(input.statusTag);

        pedidoEncontrado.status = pedidoStatusEncontrado;

        const pedidoAtualizado = await this.pedidoRepository.save(pedidoEncontrado);

        return mapper.map(pedidoAtualizado, Pedido, AtualizarStatusPedidoOutput);
    }

    async obterPedidoPorId(id: string): Promise<ObterPedidoPorIdOutput> {
        const pedido = await this.pedidoRepository.findById(id);

        if (!pedido) {
            throw new ErroNegocio('cliente-nao-cadastrado');
        }

        return mapper.map(pedido, Pedido, ObterPedidoPorIdOutput);
    }

    async obterPedidos(): Promise<ObterPedidoPorIdOutput[]> {
        const pedidos = await this.pedidoRepository.find();

        return mapper.mapArray(pedidos, Pedido, ObterPedidoPorIdOutput);
    }

    async obterStatusPedidosPorId(id: string): Promise<string> {
        const pedido = await this.pedidoRepository.findById(id);

        return pedido.status.tag;
    }

    async webhookConfirmacaoPagamento(body: webhookPedido): Promise<Pedido> {
        const pedidoEncontrado = await this.pedidoRepository.findById(body.id);

        pedidoEncontrado.pagamentoStatus = body.aprovado ? 'pedido_aprovado' : 'pedido_nao_aprovado';
        const pedidoAtualizado = await this.pedidoRepository.save(pedidoEncontrado);

        return pedidoAtualizado;
    }

    async obterFilaPedidos(): Promise<any> {
        let pedidos = await this.pedidoRepository.find();

        pedidos = pedidos.filter((pedido) => pedido?.status?.tag !== 'pedido_cancelado' && pedido?.status?.tag !== 'pedido_finalizado');

        const ordemTags = ['pedido_pronto', 'pedido_em_preparacao', 'pedido_recebido'];

        const listaOrdenada = pedidos.sort((a, b) => {
            const tagA = a.status.tag;
            const tagB = b.status.tag;
            const ordemA = ordemTags.indexOf(tagA);
            const ordemB = ordemTags.indexOf(tagB);

            return ordemA - ordemB;
        });

        return listaOrdenada;
    }
}
