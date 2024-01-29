import { BaseController } from '@/application/controller/base/base.controller';
import { Test, TestingModule } from '@nestjs/testing';

describe('BaseController', () => {
    let controller: BaseController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BaseController]
        }).compile();

        controller = module.get<BaseController>(BaseController);
    });

    it('deve redirecionar para a documentação Swagger', () => {
        expect(controller.redirectToSwagger).toBeDefined();
        expect(() => controller.redirectToSwagger()).not.toThrow();
    });
});
