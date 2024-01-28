import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { PedidoEntity } from './pedido.entity';
import { ProdutoEntity } from './produto.entity';

@Entity('cliente')
export class ClienteEntity {
    @PrimaryColumn()
    cpf: string;

    @Column()
    email: string;

    @Column()
    nomeCompleto: string;

    @Column()
    token: string;

    // Relação para indicar os pedidos desse cliente
    @OneToMany(() => PedidoEntity, (produto) => produto.cliente)
    pedidos: ProdutoEntity[];

    validarClienteAdicionar(): boolean {
        return true;
    }

    validarClienteAtualizar(): boolean {
        return true;
    }
}
