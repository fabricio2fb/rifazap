
/**
 * Utility to generate Static PIX BRCodes (EMV QRCPS)
 * Based on Central Bank of Brazil specifications.
 */

function crc16(data: string): string {
    let crc = 0xFFFF;
    const polynomial = 0x1021;

    for (let i = 0; i < data.length; i++) {
        let b = data.charCodeAt(i);
        for (let j = 0; j < 8; j++) {
            let bit = ((b >> (7 - j) & 1) === 1);
            let c15 = ((crc >> 15 & 1) === 1);
            crc <<= 1;
            if (c15 !== bit) crc ^= polynomial;
        }
    }

    crc &= 0xFFFF;
    return crc.toString(16).toUpperCase().padStart(4, '0');
}

export function generatePixBRCode(key: string, name: string, city: string, amount?: number): string {
    // 1. Normalização da Chave PIX
    let normalizedKey = key.replace(/\D/g, ''); // Remove tudo que não é número

    // Inteligência para celular: Se tem 11 dígitos e o terceiro dígito é 9, é celular
    if (normalizedKey.length === 11 && normalizedKey.charAt(2) === '9') {
        normalizedKey = '+55' + normalizedKey;
    }
    // Se for e-mail ou chave aleatória, a lógica acima não se aplica (pois key.replace(/\D/g, '') limparia letras)
    // Portanto, se a chave original tinha letras, usamos a original limpa de espaços
    if (/[a-z]/i.test(key)) {
        normalizedKey = key.trim();
    }

    // Função auxiliar para criar campos EMV: Tag + Tamanho + Valor
    const emvField = (tag: string, value: string) => {
        return tag + value.length.toString().padStart(2, '0') + value;
    };

    // Limpa o nome (remove acentos e caracteres especiais para compatibilidade bancária)
    const cleanStr = (str: string) => {
        return str.normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^A-Z0-9 ]/gi, "")
            .toUpperCase()
            .trim();
    };

    // Bancos preferem nomes reais ou o nome da loja sem caracteres estranhos
    const merchantName = cleanStr(name).substring(0, 25) || 'ORGANIZADOR';
    const merchantCity = cleanStr(city).substring(0, 15) || 'CIDADE';

    // Merchant Account Info (Tag 26) para PIX
    const gui = emvField('00', 'br.gov.bcb.pix');
    const keyField = emvField('01', normalizedKey);
    const merchantAccountInfo = emvField('26', gui + keyField);

    const parts = [
        '000201', // Payload Format Indicator
        merchantAccountInfo,
        '52040000', // Merchant Category Code (0000 = Generico)
        '5303986', // Transaction Currency (986 = BRL)
    ];

    if (amount && amount > 0) {
        const amountStr = amount.toFixed(2);
        parts.push(emvField('54', amountStr));
    }

    parts.push('5802BR'); // Country Code
    parts.push(emvField('59', merchantName));
    parts.push(emvField('60', merchantCity));

    // Tag 62 - Campo Adicional (Obrigatório TXID *** para estático)
    const txid = emvField('05', '***');
    parts.push(emvField('62', txid));

    const payload = parts.join('') + '6304';
    const crc = crc16(payload);

    return payload + crc;
}
