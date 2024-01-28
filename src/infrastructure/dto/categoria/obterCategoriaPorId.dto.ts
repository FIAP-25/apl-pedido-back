import { AutoMap } from '@automapper/classes';

export class ObterCategoriaPorIdOutput {
    @AutoMap()
    id: string;

    @AutoMap()
    descricao: string;
}
