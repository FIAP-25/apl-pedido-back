import { ICategoriaRepository } from '@/domain/contract/repository/categoria.interface';
import { Categoria } from '@/domain/entity/categoria.model';
import { ErroNegocio } from '@/domain/exception/erro.module';
import { AdicionarCategoriaInput } from '@/infrastructure/dto/categoria/adicionarCategoria.dto';
import { CategoriaUseCase } from '@/usecase/categoria/categoria.usecase';
import { Test, TestingModule } from '@nestjs/testing';

jest.mock('@/application/mapper/base.mapper', () => ({
    mapper: {
        map: jest.fn().mockImplementation((source, _sourceIdentifier, destinationIdentifier) => {
            if (destinationIdentifier === Categoria) {
                return Object.assign(new Categoria(), source);
            }
            return source;
        }),
        mapArray: jest.fn().mockImplementation((entities) => entities)
    }
}));

describe('CategoriaUseCase', () => {
    let useCase: CategoriaUseCase;
    let mockCategoriaRepository: jest.Mocked<ICategoriaRepository>;

    beforeEach(async () => {
        mockCategoriaRepository = {
            find: jest.fn(),
            findById: jest.fn(),
            save: jest.fn(),
            saveMany: jest.fn(),
            remove: jest.fn(),
            initialPopulate: jest.fn()
        } as jest.Mocked<ICategoriaRepository>;

        const module: TestingModule = await Test.createTestingModule({
            providers: [CategoriaUseCase, { provide: ICategoriaRepository, useValue: mockCategoriaRepository }]
        }).compile();

        useCase = module.get<CategoriaUseCase>(CategoriaUseCase);
    });

    it('deve adicionar uma categoria', async () => {
        const input: AdicionarCategoriaInput = { descricao: 'Nova Categoria' };
        const categoria = new Categoria();
        categoria.descricao = input.descricao;

        mockCategoriaRepository.save.mockResolvedValue(categoria);

        const resultado = await useCase.adicionarCategoria(input);

        expect(mockCategoriaRepository.save).toHaveBeenCalledWith(categoria);
        expect(resultado.descricao).toBe(input.descricao);
    });

    it('deve remover uma categoria por id', async () => {
        const id = '123';
        await useCase.removerCategoriaPorId(id);
        expect(mockCategoriaRepository.remove).toHaveBeenCalledWith(id);
    });

    it('deve atualizar uma categoria por id', async () => {
        const id = '123';
        const categoriaAtualizada = new Categoria();
        categoriaAtualizada.id = id;
        categoriaAtualizada.descricao = 'Categoria Atualizada';

        mockCategoriaRepository.findById.mockResolvedValue(categoriaAtualizada);
        mockCategoriaRepository.save.mockResolvedValue(categoriaAtualizada);

        const resultado = await useCase.atualizarCategoriaPorId(id, { descricao: 'Categoria Atualizada' });

        expect(mockCategoriaRepository.findById).toHaveBeenCalledWith(id);
        expect(mockCategoriaRepository.save).toHaveBeenCalledWith(categoriaAtualizada);
        expect(resultado.descricao).toBe('Categoria Atualizada');
    });

    it('deve obter uma categoria por id', async () => {
        const id = '123';
        const categoriaMock = new Categoria();
        categoriaMock.id = id;
        categoriaMock.descricao = 'Categoria Teste';

        mockCategoriaRepository.findById.mockResolvedValue(categoriaMock);

        const resultado = await useCase.obterCategoriaPorId(id);

        expect(mockCategoriaRepository.findById).toHaveBeenCalledWith(id);
        expect(resultado.descricao).toBe(categoriaMock.descricao);
    });

    it('deve listar todas as categorias', async () => {
        const categoriasMock = [new Categoria(), new Categoria()];
        mockCategoriaRepository.find.mockResolvedValue(categoriasMock);

        const resultado = await useCase.obterCategorias();

        expect(mockCategoriaRepository.find).toHaveBeenCalled();
        expect(resultado.length).toBe(2);
    });

    it('deve lançar erro quando tentar atualizar uma categoria inexistente', async () => {
        const id = 'inexistente';
        mockCategoriaRepository.findById.mockResolvedValue(null as unknown as Categoria);

        await expect(useCase.atualizarCategoriaPorId(id, { descricao: 'Nova Descrição' })).rejects.toThrow(ErroNegocio);
    });
});
