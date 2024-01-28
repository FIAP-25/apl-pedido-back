import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PedidoEntity } from './pedido.entity';
import { ProdutoEntity } from './produto.entity';

@Entity('pedido_produto')
export class PedidoProdutoEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    quantidade: number;

    @ManyToOne(() => PedidoEntity, (pedido) => pedido.pedidoProdutos)
    pedido: PedidoEntity;

    @ManyToOne(() => ProdutoEntity, (produto) => produto.pedidoProdutos)
    produto: ProdutoEntity;
}
