import UseCaseModule from '@/usecase/usecase.module';
import { Module } from '@nestjs/common';
import { BaseController } from './controller/base/base.controller';
import { CategoriaController } from './controller/categoria/categoria.controller';
import { ClienteController } from './controller/cliente/cliente.controller';
import { HealthController } from './controller/health/health.controller';
import { PedidoController } from './controller/pedido/pedido.controller';
import { ProdutoController } from './controller/produto/produto.controller';

@Module({
    imports: [UseCaseModule],
    controllers: [ClienteController, CategoriaController, ProdutoController, PedidoController, HealthController, BaseController]
})
export default class ApplicationModule {}
