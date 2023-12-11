import UseCaseModule from '@/usecase/usecase.module';
import { Module } from '@nestjs/common';
import { BaseController } from './controller/base/base.controller';
import { HeatlhController } from './controller/health/health.controller';
import { PedidoController } from './controller/pedido/pedido.controller';

@Module({
    imports: [UseCaseModule],
    controllers: [PedidoController, HeatlhController, BaseController]
})
export default class ApplicationModule { }
