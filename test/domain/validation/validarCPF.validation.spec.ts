import { validarCPF } from '@/domain/validation/validarCPF.validation';

describe('validarCPF', () => {
    it('deve retornar true para um CPF válido', () => {
        expect(validarCPF('12345678909')).toBe(true);
    });

    it('deve retornar false para um CPF inválido', () => {
        expect(validarCPF('12345678900')).toBe(false);
    });

    it('deve retornar false para um CPF com formato incorreto', () => {
        expect(validarCPF('123456789')).toBe(false);
        expect(validarCPF('123456789012')).toBe(false);
        expect(validarCPF('abcdefghijk')).toBe(false);
    });

    it('deve retornar false para um CPF com números repetidos', () => {
        expect(validarCPF('00000000000')).toBe(false);
        expect(validarCPF('11111111111')).toBe(false);
        expect(validarCPF('22222222222')).toBe(false);
        expect(validarCPF('33333333333')).toBe(false);
        expect(validarCPF('44444444444')).toBe(false);
        expect(validarCPF('55555555555')).toBe(false);
        expect(validarCPF('66666666666')).toBe(false);
        expect(validarCPF('77777777777')).toBe(false);
        expect(validarCPF('88888888888')).toBe(false);
        expect(validarCPF('99999999999')).toBe(false);
    });
});
