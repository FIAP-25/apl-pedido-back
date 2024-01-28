import { AutoMap } from '@automapper/classes';

export class ObterCategoriasOutput {
    @AutoMap()
    id: string;

    @AutoMap()
    descricao: string;
}
