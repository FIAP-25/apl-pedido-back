export const validarEmail = (email: string): boolean => {
    if (!email) {
        return false;
    }

    // Expressão regular para validar o formato geral do e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!emailRegex.test(email)) {
        return false;
    }

    const [localPart, domainPart] = email.split('@');

    // Verifica se o domínio contém pontos consecutivos ou começa/termina com ponto
    if (domainPart.startsWith('.') || domainPart.endsWith('.') || domainPart.includes('..')) {
        return false;
    }

    // Verificar cada parte do domínio para garantir que não comece ou termine com hífen
    const domainParts = domainPart.split('.');
    for (const part of domainParts) {
        if (part.startsWith('-') || part.endsWith('-')) {
            return false;
        }
    }

    // Expressão regular para validar a parte local do e-mail
    // Esta expressão exclui caracteres especiais não permitidos, incluindo o '&'
    const localPartRegex = /^[a-zA-Z0-9.!#$%'*+/=?^_`{|}~-]+$/;

    return localPartRegex.test(localPart);
};
