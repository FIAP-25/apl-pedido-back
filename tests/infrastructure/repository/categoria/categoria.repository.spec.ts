import { mapper } from '@/application/mapper/base.mapper';
import { Categoria } from '@/domain/entity/categoria.model';
import { CategoriaEntity } from '@/infrastructure/entity/categoria.entity';
import { CategoriaRepository } from '@/infrastructure/repository/categoria/categoria.repository';
import { Repository } from 'typeorm';

jest.mock('@/application/mapper/base.mapper', () => ({
    mapper: {
        mapArray: jest.fn().mockImplementation((entities) => entities),
        map: jest.fn().mockImplementation((entity) => entity)
    }
}));

describe('CategoriaRepository', () => {
    let repository: CategoriaRepository;
    let mockTypeOrmRepository: jest.Mocked<Repository<CategoriaEntity>>;

    beforeEach(() => {
        mockTypeOrmRepository = {
            find: jest.fn(),
            findOneBy: jest.fn(),
            save: jest.fn(),
            delete: jest.fn()
        } as unknown as jest.Mocked<Repository<CategoriaEntity>>;

        repository = new CategoriaRepository(mockTypeOrmRepository);
    });

    it('deve encontrar todas as categorias', async () => {
        const categoriasMock = [new CategoriaEntity(), new CategoriaEntity()];
        mockTypeOrmRepository.find.mockResolvedValue(categoriasMock);

        const categorias = await repository.find();

        expect(categorias).toEqual(categoriasMock);
        expect(mockTypeOrmRepository.find).toHaveBeenCalled();
    });

    it('deve encontrar uma categoria por id', async () => {
        const categoriaMock = new CategoriaEntity();
        categoriaMock.id = '1';
        mockTypeOrmRepository.findOneBy.mockResolvedValue(categoriaMock);

        const categoria = await repository.findById('1');

        expect(categoria).toEqual(categoriaMock);
        expect(mockTypeOrmRepository.findOneBy).toHaveBeenCalledWith({ id: '1' });
    });

    it('deve salvar uma categoria', async () => {
        const categoriaEntityMock = new CategoriaEntity();
        categoriaEntityMock.descricao = 'Categoria Teste';
        mockTypeOrmRepository.save.mockResolvedValue(categoriaEntityMock);

        const categoria = new Categoria();
        categoria.descricao = 'Categoria Teste';

        const categoriaMapped = mapper.map(categoria, Categoria, CategoriaEntity);

        const resultado = await repository.save(categoriaMapped);

        expect(resultado).toEqual(categoriaEntityMock);

        expect(mockTypeOrmRepository.save).toHaveBeenCalledWith(categoriaMapped);
    });

    it('deve salvar várias categorias', async () => {
        const categoriaEntityMock1 = new CategoriaEntity();
        categoriaEntityMock1.descricao = 'Categoria Teste 1';
        const categoriaEntityMock2 = new CategoriaEntity();
        categoriaEntityMock2.descricao = 'Categoria Teste 2';
        const categoriasEntityMock = [categoriaEntityMock1, categoriaEntityMock2];

        const categoria1 = new Categoria();
        categoria1.descricao = 'Categoria Teste 1';
        const categoria2 = new Categoria();
        categoria2.descricao = 'Categoria Teste 2';
        const categorias = [categoria1, categoria2];

        mockTypeOrmRepository.save.mockResolvedValue(categoriasEntityMock as any);

        const resultado = await repository.saveMany(categorias);

        expect(mockTypeOrmRepository.save).toHaveBeenCalledWith(categorias);
        expect(resultado).toEqual(categoriasEntityMock);
    });

    it('deve remover uma categoria', async () => {
        const id = '1';
        const deleteResultMock = { affected: 1, raw: {} };
        mockTypeOrmRepository.delete.mockResolvedValue(deleteResultMock);

        await repository.remove(id);

        expect(mockTypeOrmRepository.delete).toHaveBeenCalledWith(id);
    });

    it('deve realizar o povoamento inicial de categorias', async () => {
        const categoriasBase = ['Lanches', 'Bebida', 'Sobremesa', 'Acompanhamento'];
        const categoriasEntityMock = categoriasBase.map((descricao, index) => {
            const categoriaEntity = new CategoriaEntity();
            categoriaEntity.id = (index + 1).toString();
            categoriaEntity.descricao = descricao;
            return categoriaEntity;
        });

        mockTypeOrmRepository.save.mockResolvedValue(categoriasEntityMock as any);

        await repository.initialPopulate();

        expect(mockTypeOrmRepository.save).toHaveBeenCalledWith(expect.anything());
    });
});
