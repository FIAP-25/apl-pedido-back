import { IPedidoUseCase } from '@/domain/contract/usecase/pedido.interface';
import InfrastructureModule from '@/infrastructure/infrastructure.module';
import { Module } from '@nestjs/common';
import { PedidoUseCase } from './pedido/pedido.usecase';

@Module({
    imports: [InfrastructureModule],
    providers: [
        { provide: IPedidoUseCase, useClass: PedidoUseCase }
    ],
    exports: [IPedidoUseCase]
})
export default class UseCaseModule { }
