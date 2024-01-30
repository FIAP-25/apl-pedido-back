import { HealthController } from '@/application/controller/health/health.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';

describe('HealthController', () => {
    let controller: HealthController;
    let mockResponse: Response;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [HealthController]
        }).compile();

        controller = module.get<HealthController>(HealthController);
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
            set: jest.fn().mockReturnThis()
        } as unknown as Response;
    });

    it('deve retornar informações de saúde do sistema', () => {
        controller.health(mockResponse);

        expect(mockResponse.set).toHaveBeenCalledWith('Cache-Control', 'no-cache');
        expect(mockResponse.send).toHaveBeenCalledWith(
            expect.objectContaining({
                uptime: expect.any(Number),
                status: 'Online',
                timestamp: expect.any(Number)
            })
        );
    });

    it('deve lidar com erro ao retornar informações de saúde do sistema', () => {
        jest.spyOn(mockResponse, 'send').mockImplementation(() => {
            throw new Error('Erro ao obter informações de saúde');
        });

        let error;
        try {
            controller.health(mockResponse);
        } catch (e) {
            error = e;
        }

        expect(error).toBeDefined();
        expect(error.message).toEqual('Erro ao obter informações de saúde');
        expect(mockResponse.status).toHaveBeenCalledWith(503);
    });
});
