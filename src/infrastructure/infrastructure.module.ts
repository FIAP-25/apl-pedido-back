import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaEntity } from './entity/categoria.entity';
import { ClienteEntity } from './entity/cliente.entity';
import { PedidoProdutoEntity } from './entity/pedido-produto.entity';
import { PedidoStatusEntity } from './entity/pedido-status.entity';
import { PedidoEntity } from './entity/pedido.entity';
import { ProdutoEntity } from './entity/produto.entity';
import { CategoriaRepository } from './repository/categoria/categoria.repository';
import { ClienteRepository } from './repository/cliente/cliente.repository';
import { ConnectionModule } from './repository/helper/connection.module';
import { ProdutoRepository } from './repository/produto/produto.repository';
import { PedidoRepository } from './repository/pedido/pedido.repository';
import { PedidoStatusRepository } from './repository/pedido-status/pedido-status.repository';
import { PedidoProdutoRepository } from './repository/pedido-produto/pedido-produto.repository';
import { IClienteRepository } from '@/domain/contract/repository/cliente.interface';
import { ICategoriaRepository } from '@/domain/contract/repository/categoria.interface';
import { IPedidoProdutoRepository } from '@/domain/contract/repository/pedido-produto.interface';
import { IPedidoStatusRepository } from '@/domain/contract/repository/pedido-status.interface';
import { IPedidoRepository } from '@/domain/contract/repository/pedido.interface';
import { IProdutoRepository } from '@/domain/contract/repository/produto.interface';
import { IAxiosClient } from '@/domain/contract/client/axios.interface';
import { AxiosClient } from './client/axios.client';
@Module({
    imports: [TypeOrmModule.forFeature([CategoriaEntity, ClienteEntity, PedidoEntity, PedidoProdutoEntity, PedidoStatusEntity, ProdutoEntity, PedidoEntity, PedidoStatusEntity]), ConnectionModule],
    providers: [
        { provide: IClienteRepository, useClass: ClienteRepository },
        { provide: ICategoriaRepository, useClass: CategoriaRepository },
        { provide: IProdutoRepository, useClass: ProdutoRepository },
        { provide: IPedidoRepository, useClass: PedidoRepository },
        { provide: IPedidoStatusRepository, useClass: PedidoStatusRepository },
        { provide: IPedidoProdutoRepository, useClass: PedidoProdutoRepository },
        { provide: IAxiosClient, useClass: AxiosClient }
    ],
    exports: [IClienteRepository, ICategoriaRepository, IProdutoRepository, IPedidoRepository, IPedidoStatusRepository, IPedidoProdutoRepository, IAxiosClient, ConnectionModule]
})
export default class InfrastructureModule {}
