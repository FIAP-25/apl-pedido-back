import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProdutoEntity } from './produto.entity';

@Entity('categoria')
export class CategoriaEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    descricao: string;

    @OneToMany(() => ProdutoEntity, (produto) => produto.categoria)
    produtos: ProdutoEntity[];

    validarCategoria(): boolean {
        return true;
    }
}
