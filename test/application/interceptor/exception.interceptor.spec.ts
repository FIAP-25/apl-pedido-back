import { ExceptionInterceptor } from '@/application/interceptor/exception.interceptor';
import { ErroAcesso, ErroBase, ErroNegocio, ErroSistema, ErroValidacao } from '@/domain/exception/erro.module';
import { ArgumentsHost } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { AbstractHttpAdapter } from '@nestjs/core/adapters/http-adapter';

describe('ExceptionInterceptor', () => {
    let interceptor: ExceptionInterceptor;
    let mockHttpAdapter: jest.Mocked<AbstractHttpAdapter<any, any, any>>;

    beforeEach(async () => {
        mockHttpAdapter = {
            reply: jest.fn(),
            getRequestUrl: jest.fn().mockReturnValue('http://test-url.com')
        } as unknown as jest.Mocked<AbstractHttpAdapter<any, any, any>>;

        const mockHttpAdapterHost: HttpAdapterHost = {
            httpAdapter: mockHttpAdapter
        };
        interceptor = new ExceptionInterceptor(mockHttpAdapterHost);
    });

    const mockArgumentsHost = {
        switchToHttp: () => ({
            getRequest: () => ({}),
            getResponse: () => ({})
        })
    } as unknown as ArgumentsHost;

    it('deve tratar ErroNegocio com o código de status 422', () => {
        const exception = new ErroNegocio('body-vazio');
        interceptor.catch(exception, mockArgumentsHost);

        expect(mockHttpAdapter.reply).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
                tipo: 'ErroNegocio',
                mensagem: exception.mensagem,
                rota: 'http://test-url.com'
            }),
            422
        );
    });

    it('deve tratar ErroAcesso com o código de status 400', () => {
        const exception = new ErroAcesso('body-vazio');
        interceptor.catch(exception, mockArgumentsHost);

        expect(mockHttpAdapter.reply).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
                tipo: 'ErroAcesso',
                mensagem: exception.mensagem,
                rota: 'http://test-url.com'
            }),
            400
        );
    });

    it('deve tratar ErroSistema com o código de status 500', () => {
        const exception = new ErroSistema('body-vazio');
        interceptor.catch(exception, mockArgumentsHost);

        expect(mockHttpAdapter.reply).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
                tipo: 'ErroSistema',
                mensagem: exception.mensagem,
                rota: 'http://test-url.com'
            }),
            500
        );
    });

    it('deve tratar ErroValidacao com o código de status 401', () => {
        const exception = new ErroValidacao('body-vazio');
        interceptor.catch(exception, mockArgumentsHost);

        expect(mockHttpAdapter.reply).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
                tipo: 'ErroValidacao',
                mensagem: exception.mensagem,
                rota: 'http://test-url.com'
            }),
            401
        );
    });

    it('deve tratar exceção genérica com o código de status 500', () => {
        const exception = new Error('Erro genérico');
        interceptor.catch(exception as ErroBase, mockArgumentsHost);

        expect(mockHttpAdapter.reply).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
                tipo: exception.name,
                mensagem: exception.message,
                rota: 'http://test-url.com'
            }),
            500
        );
    });
});
