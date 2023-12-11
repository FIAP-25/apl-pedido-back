import { IPedidoStatusRepository } from '@/domain/contract/repository/pedido-status.interface';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';

@Injectable()
export class InitialPopulateService implements OnApplicationBootstrap {
    constructor(private pedidoStatusRepository: IPedidoStatusRepository) { }

    async onApplicationBootstrap(): Promise<void> {
        console.log('[Database]Populando o banco de dados...');

        // await this.categoriaRepository.initialPopulate();
        await this.pedidoStatusRepository.initialPopulate();
    }
}
