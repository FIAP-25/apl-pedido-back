import { AutoMap } from '@automapper/classes';
import { Pedido } from './pedido.model';
import { Produto } from './produto.model';
import { ApiProperty } from '@nestjs/swagger';

export class PedidoProduto {
    @AutoMap()
    @ApiProperty({ required: true })
    id: string;

    @AutoMap()
    @ApiProperty({ required: true })
    quantidade: number;

    @AutoMap()
    pedido?: Pedido;

    @AutoMap()
    produto: Produto;
}
