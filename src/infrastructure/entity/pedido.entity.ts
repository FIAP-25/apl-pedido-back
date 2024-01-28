import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ClienteEntity } from './cliente.entity';
import { PedidoProdutoEntity } from './pedido-produto.entity';
import { PedidoStatusEntity } from './pedido-status.entity';

@Entity('pedido')
export class PedidoEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
        transformer: {
            to(data: number): number {
                return data;
            },
            from(data: string): number {
                return parseFloat(data);
            }
        }
    })
    valorTotal: number;

    @ManyToOne(() => PedidoStatusEntity, (status) => status.pedidos, {
        eager: true
    })
    status: PedidoStatusEntity;

    @ManyToOne(() => ClienteEntity, (cliente) => cliente.pedidos)
    cliente: ClienteEntity;

    @OneToMany(() => PedidoProdutoEntity, (pedidoProduto) => pedidoProduto.pedido)
    pedidoProdutos: PedidoProdutoEntity[];

    @CreateDateColumn()
    dataCadastro: Date;

    @UpdateDateColumn()
    dataAtualizacao: Date;

    @Column()
    pagamentoStatus: string;
}
