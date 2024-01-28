import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CategoriaEntity } from './categoria.entity';
import { PedidoProdutoEntity } from './pedido-produto.entity';

@Entity('produto')
export class ProdutoEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nome: string;

    @Column()
    descricao: string;

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
    preco: number;

    @ManyToOne(() => CategoriaEntity, (categoria) => categoria.produtos, {
        eager: true
    })
    categoria: CategoriaEntity;

    @OneToMany(() => PedidoProdutoEntity, (pedidoProduto) => pedidoProduto.produto)
    pedidoProdutos: PedidoProdutoEntity[];

    validarProduto(): boolean {
        return true;
    }
}
