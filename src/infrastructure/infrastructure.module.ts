import { IPedidoProdutoRepository } from '@/domain/contract/repository/pedido-produto.interface';
import { IPedidoStatusRepository } from '@/domain/contract/repository/pedido-status.interface';
import { IPedidoRepository } from '@/domain/contract/repository/pedido.interface';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PedidoProdutoEntity } from './entity/pedido-produto.entity';
import { PedidoStatusEntity } from './entity/pedido-status.entity';
import { PedidoEntity } from './entity/pedido.entity';
import { ConnectionModule } from './repository/helper/connection.module';
import { PedidoProdutoRepository } from './repository/pedido-produto/pedido-produto.repository';
import { PedidoStatusRepository } from './repository/pedido-status/pedido-status.repository';
import { PedidoRepository } from './repository/pedido/pedido.repository';
@Module({
    imports: [TypeOrmModule.forFeature([PedidoEntity, PedidoProdutoEntity, PedidoStatusEntity, PedidoEntity, PedidoStatusEntity]), ConnectionModule],
    providers: [
        { provide: IPedidoRepository, useClass: PedidoRepository },
        { provide: IPedidoStatusRepository, useClass: PedidoStatusRepository },
        { provide: IPedidoProdutoRepository, useClass: PedidoProdutoRepository }
    ],
    exports: [IPedidoRepository, IPedidoStatusRepository, IPedidoProdutoRepository, ConnectionModule]
})
export default class InfrastructureModule { }
