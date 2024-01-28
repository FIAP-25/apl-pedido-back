import InfrastructureModule from '@/infrastructure/infrastructure.module';
import { Module } from '@nestjs/common';
import { CategoriaUseCase } from './categoria/categoria.usecase';
import { ClienteUseCase } from './cliente/cliente.usecase';
import { ProdutoUseCase } from './produto/produto.usecase';
import { PedidoUseCase } from './pedido/pedido.usecase';
import { ICategoriaUseCase } from '@/domain/contract/usecase/categoria.interface';
import { IClienteUseCase } from '@/domain/contract/usecase/cliente.interface';
import { IPedidoUseCase } from '@/domain/contract/usecase/pedido.interface';
import { IProdutoUseCase } from '@/domain/contract/usecase/produto.interface';

@Module({
    imports: [InfrastructureModule],
    providers: [
        { provide: IClienteUseCase, useClass: ClienteUseCase },
        { provide: ICategoriaUseCase, useClass: CategoriaUseCase },
        { provide: IProdutoUseCase, useClass: ProdutoUseCase },
        { provide: IPedidoUseCase, useClass: PedidoUseCase }
    ],
    exports: [IClienteUseCase, ICategoriaUseCase, IProdutoUseCase, IPedidoUseCase]
})
export default class UseCaseModule {}
