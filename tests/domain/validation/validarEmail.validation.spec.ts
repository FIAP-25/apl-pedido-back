import { validarEmail } from '@/domain/validation/validarEmail.validation';

describe('validarEmail', () => {
    it('deve retornar true para um e-mail válido', () => {
        expect(validarEmail('email@example.com')).toBe(true);
        expect(validarEmail('nome.sobrenome@example.co.uk')).toBe(true);
        expect(validarEmail('nome+sobrenome@example.com')).toBe(true);
    });

    it('deve retornar false para um e-mail inválido', () => {
        expect(validarEmail('email@')).toBe(false);
        expect(validarEmail('email@.com')).toBe(false);
        expect(validarEmail('@example.com')).toBe(false);
        expect(validarEmail('email@example')).toBe(false);
        expect(validarEmail('email@example..com')).toBe(false);
        expect(validarEmail('email@.example.com')).toBe(false);
        expect(validarEmail('email@example.com.')).toBe(false);
        expect(validarEmail('email@example..com')).toBe(false);
        expect(validarEmail('email@-example.com')).toBe(false);
        expect(validarEmail('email@example.com-')).toBe(false);
        expect(validarEmail('email@example.-com')).toBe(false);
        expect(validarEmail('email@-example.-com')).toBe(false);
        expect(validarEmail('')).toBe(false);
        expect(validarEmail(' ')).toBe(false);
    });

    it('deve retornar false para um e-mail com caracteres inválidos', () => {
        expect(validarEmail('nome sobrenome@example.com')).toBe(false);
        expect(validarEmail('nome<sobrenome>@example.com')).toBe(false);
        expect(validarEmail('nome&sobrenome@example.com')).toBe(false);
        expect(validarEmail('nome"sobrenome@example.com')).toBe(false);
    });
});
