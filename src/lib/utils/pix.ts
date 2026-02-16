
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
    const parts = [
        '000201', // Payload Format Indicator
        '26' + (32 + key.length).toString().padStart(2, '0') + '0014br.gov.bcb.pix01' + key.length.toString().padStart(2, '0') + key, // Merchant Account Information
        '52040000', // Merchant Category Code
        '5303986', // Transaction Currency (986 = BRL)
    ];

    if (amount) {
        const amountStr = amount.toFixed(2);
        parts.push('54' + amountStr.length.toString().padStart(2, '0') + amountStr);
    }

    parts.push('5802BR'); // Country Code
    parts.push('59' + name.length.toString().padStart(2, '0') + name); // Merchant Name
    parts.push('60' + city.length.toString().padStart(2, '0') + city); // Merchant City
    parts.push('62070503***'); // Transaction Specific (No Transaction ID)

    const payload = parts.join('') + '6304';
    const crc = crc16(payload);

    return payload + crc;
}
