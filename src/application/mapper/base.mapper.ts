import { Pedido } from '@/domain/entity/pedido.model';

import { AdicionarPedidoInput, AdicionarPedidoOutput } from '@/infrastructure/dto/pedido/adicionarPedido.dto';
import { AtualizarStatusPedidoInput, AtualizarStatusPedidoOutput } from '@/infrastructure/dto/pedido/atualizarPedido.dto';
import { ObterPedidoPorIdOutput } from '@/infrastructure/dto/pedido/obterPedidoPorId.dto';
import { PedidoEntity } from '@/infrastructure/entity/pedido.entity';
import { classes } from '@automapper/classes';
import { createMap, createMapper, forMember, mapFrom } from '@automapper/core';

export const mapper = createMapper({
    strategyInitializer: classes()
});

// #region Pedido
createMap(
    mapper,
    PedidoEntity,
    Pedido,
    forMember(
        (destination) => destination.id,
        mapFrom((source) => source.id)
    ),
    forMember(
        (destination) => destination.status,
        mapFrom((source) => source.status)
    ),
    // forMember(
    //     (destination) => destination.cliente,
    //     mapFrom((source) => source.cliente)
    // ),
    forMember(
        (destination) => destination.valorTotal,
        mapFrom((source) => source.valorTotal)
    ),
    // forMember(
    //     (destination) => destination.pedidoProdutos,
    //     mapFrom((source) => source.pedidoProdutos)
    // ),
    forMember(
        (destination) => destination.dataCadastro,
        mapFrom((source) => source.dataCadastro)
    ),
    forMember(
        (destination) => destination.dataAtualizacao,
        mapFrom((source) => source.dataAtualizacao)
    ),
    forMember(
        (destination) => destination.pagamentoStatus,
        mapFrom((source) => source.pagamentoStatus)
    )
);

createMap(
    mapper,
    Pedido,
    PedidoEntity,
    forMember(
        (destination) => destination.id,
        mapFrom((source) => source.id)
    ),
    forMember(
        (destination) => destination.status,
        mapFrom((source) => source.status)
    ),
    // forMember(
    //     (destination) => destination.cliente,
    //     mapFrom((source) => source.cliente)
    // ),
    forMember(
        (destination) => destination.valorTotal,
        mapFrom((source) => source.valorTotal)
    ),
    // forMember(
    //     (destination) => destination.pedidoProdutos,
    //     mapFrom((source) => source.pedidoProdutos)
    // ),
    forMember(
        (destination) => destination.dataCadastro,
        mapFrom((source) => source.dataCadastro)
    ),
    forMember(
        (destination) => destination.dataAtualizacao,
        mapFrom((source) => source.dataAtualizacao)
    ),
    forMember(
        (destination) => destination.pagamentoStatus,
        mapFrom((source) => source.pagamentoStatus)
    )
);

createMap(mapper, AdicionarPedidoInput, Pedido);
createMap(mapper, Pedido, AdicionarPedidoOutput);

createMap(mapper, AtualizarStatusPedidoInput, Pedido);
createMap(mapper, Pedido, AtualizarStatusPedidoOutput);

createMap(mapper, Pedido, ObterPedidoPorIdOutput);
// #endregion
