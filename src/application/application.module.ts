import UseCaseModule from '@/usecase/usecase.module';
import { Module, Options } from '@nestjs/common';
import { BaseController } from './controller/base/base.controller';
import { CategoriaController } from './controller/categoria/categoria.controller';
import { ClienteController } from './controller/cliente/cliente.controller';
import { HealthController } from './controller/health/health.controller';
import { PedidoController } from './controller/pedido/pedido.controller';
import { ProdutoController } from './controller/produto/produto.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
    imports: [
        UseCaseModule,
        ClientsModule.register([
            {
                name: 'PAYMENT_SERVICE',
                transport: Transport.RMQ,
                options: {
                    urls: ['amqps://beigjrvu:OVMxq6Oi3OOHJAwRVL9DLyqWUazLUysc@woodpecker.rmq.cloudamqp.com/beigjrvu'],
                    queue: 'payment-queue',
                    queueOptions: {
                        durable: false
                    }
                }
            }
        ])
    ],
    controllers: [ClienteController, CategoriaController, ProdutoController, PedidoController, HealthController, BaseController]
})
export default class ApplicationModule {}
