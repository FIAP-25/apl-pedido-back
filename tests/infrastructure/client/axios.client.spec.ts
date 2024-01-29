import { AxiosClient } from '@/infrastructure/client/axios.client';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AxiosClient', () => {
    let axiosClient: AxiosClient;
    const urlBasePagamento = 'http://localhost/pagamento';
    const urlBaseProducao = 'http://localhost/producao';

    beforeEach(() => {
        process.env.URL_BASE_PAGAMENTO = urlBasePagamento;
        process.env.URL_BASE_PRODUCAO = urlBaseProducao;
        axiosClient = new AxiosClient();
    });

    const testCases = [
        { api: 'pagamento' as const, urlBase: urlBasePagamento },
        { api: 'producao' as const, urlBase: urlBaseProducao }
    ];

    testCases.forEach(({ api, urlBase }) => {
        it(`deve fazer uma chamada GET corretamente para a API de ${api}`, async () => {
            const mockResponse = { data: 'resposta_mock' };
            mockedAxios.get.mockResolvedValue(mockResponse);

            const response = await axiosClient.executarChamada(api, 'get', '/caminho', null);

            expect(mockedAxios.get).toHaveBeenCalledWith(`${urlBase}/caminho`);
            expect(response).toEqual(mockResponse);
        });

        it(`deve fazer uma chamada POST corretamente para a API de ${api}`, async () => {
            const mockResponse = { data: 'resposta_mock' };
            mockedAxios.post.mockResolvedValue(mockResponse);

            const response = await axiosClient.executarChamada(api, 'post', '/caminho', { chave: 'valor' });

            expect(mockedAxios.post).toHaveBeenCalledWith(`${urlBase}/caminho`, { chave: 'valor' });
            expect(response).toEqual(mockResponse);
        });

        it(`deve fazer uma chamada PUT corretamente para a API de ${api}`, async () => {
            const mockResponse = { data: 'resposta_mock' };
            mockedAxios.put.mockResolvedValue(mockResponse);

            const response = await axiosClient.executarChamada(api, 'put', '/caminho', { chave: 'valor' });

            expect(mockedAxios.put).toHaveBeenCalledWith(`${urlBase}/caminho`, { chave: 'valor' });
            expect(response).toEqual(mockResponse);
        });

        it(`deve fazer uma chamada PATCH corretamente para a API de ${api}`, async () => {
            const mockResponse = { data: 'resposta_mock' };
            mockedAxios.patch.mockResolvedValue(mockResponse);

            const response = await axiosClient.executarChamada(api, 'patch', '/caminho', { chave: 'valor' });

            expect(mockedAxios.patch).toHaveBeenCalledWith(`${urlBase}/caminho`, { chave: 'valor' });
            expect(response).toEqual(mockResponse);
        });

        it(`deve fazer uma chamada DELETE corretamente para a API de ${api}`, async () => {
            const mockResponse = { data: 'resposta_mock' };
            mockedAxios.delete.mockResolvedValue(mockResponse);

            const response = await axiosClient.executarChamada(api, 'delete', '/caminho', {});

            expect(mockedAxios.delete).toHaveBeenCalledWith(`${urlBase}/caminho`);
            expect(response).toEqual(mockResponse);
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
});
