import { PedidoProdutoEntity } from '@/infrastructure/entity/pedido-produto.entity';
import { PedidoStatusEntity } from '@/infrastructure/entity/pedido-status.entity';
import { PedidoEntity } from '@/infrastructure/entity/pedido.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DATABASE_HOST,
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_SCHEMA,
            port: Number(process.env.DATABASE_PORT),
            entities: [PedidoEntity, PedidoProdutoEntity, PedidoStatusEntity],
            synchronize: true
        })
    ]
})
export class ConnectionModule { }
