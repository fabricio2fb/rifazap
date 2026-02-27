
/**
 * Utilitário para integração com a API da SyncPay
 * Focado em conformidade SaaS, evitando termos de jogo/rifa.
 */

const SYNCPAY_CLIENT_ID = process.env.SYNCPAY_CLIENT_ID;
const SYNCPAY_CLIENT_SECRET = process.env.SYNCPAY_CLIENT_SECRET;
const SYNCPAY_API_URL = process.env.SYNCPAY_API_URL || 'https://api.syncpay.com.br';

interface SyncPayTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
}

interface SyncPayPixResponse {
    id: string;
    pix_code: string; // BR code
    pix_url: string;  // QR code image or similar
    amount: number;
    status: string;
}

/**
 * Gera um token de autenticação Bearer
 */
export async function getSyncPayToken(): Promise<string> {
    if (!SYNCPAY_CLIENT_ID || !SYNCPAY_CLIENT_SECRET) {
        throw new Error("Configurações da SyncPay (Client ID/Secret) não encontradas no .env.local");
    }

    console.log(`[SyncPay] Tentando autenticação em: ${SYNCPAY_API_URL}`);

    // Tentamos o endpoint V1 primeiro (conforme guia inicial)
    // Se falhar, tentamos o endpoint genérico /auth/token
    const endpoints = [
        `${SYNCPAY_API_URL}/api/partner/v1/auth-token`,
        `${SYNCPAY_API_URL}/auth/token`
    ];

    let lastError = null;

    for (const url of endpoints) {
        try {
            console.log(`[SyncPay] Testando endpoint: ${url}`);

            // Removendo 'Origin' que causou erro 500 no servidor deles (Laravel/CORS)
            const requestHeaders = {
                'Content-Type': 'application/json',
                'Accept': 'application/json, text/plain, */*',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            };

            const response = await fetch(url, {
                method: 'POST',
                headers: requestHeaders,
                body: JSON.stringify({
                    clientId: SYNCPAY_CLIENT_ID.trim(),
                    clientSecret: SYNCPAY_CLIENT_SECRET.trim()
                }),
                cache: 'no-store'
            });

            if (response.ok) {
                const data: SyncPayTokenResponse = await response.json();
                console.log("[SyncPay] Autenticação bem-sucedida!");
                return data.access_token;
            }

            // Se falhou, pegamos o status e o texto para debug
            const errorText = await response.text();
            console.error(`[SyncPay] Erro em ${url} (Status ${response.status}):`, errorText);

            // Tentativa com snake_case
            console.log(`[SyncPay] Tentando snake_case em ${url}...`);
            const responseSnake = await fetch(url, {
                method: 'POST',
                headers: requestHeaders,
                body: JSON.stringify({
                    client_id: SYNCPAY_CLIENT_ID.trim(),
                    client_secret: SYNCPAY_CLIENT_SECRET.trim()
                }),
                cache: 'no-store'
            });

            if (responseSnake.ok) {
                const data: SyncPayTokenResponse = await responseSnake.json();
                console.log("[SyncPay] Autenticação bem-sucedida (via snake_case)!");
                return data.access_token;
            }

            const errorTextSnake = await responseSnake.text();
            console.error(`[SyncPay] Erro snake_case em ${url} (Status ${responseSnake.status}):`, errorTextSnake);
            lastError = errorTextSnake || errorText;

        } catch (err: any) {
            console.error(`[SyncPay] Falha crítica na requisição para ${url}:`, err.message);
            lastError = err.message;
        }
    }

    throw new Error(`Falha na autenticação com a SyncPay: ${JSON.stringify(lastError)}`);
}

/**
 * Cria uma cobrança PIX (Cash-in) para ativação de software
 * @param params Dados da transação
 */
export async function createSyncPayPix(params: {
    raffleId: string;
    amount: number;
    customer: {
        name: string;
        cpf: string;
        email: string;
        phone: string;
    };
    postbackUrl: string;
}): Promise<any> {
    const token = await getSyncPayToken();

    // Payload conforme a documentação oficial da SyncPay (apidog)
    // Usamos 'client' em vez de 'customer' e 'webhook_url' em vez de 'postbackUrl'
    const payload = {
        amount: params.amount,
        description: `Ativação de Software SaaS - Campanha ${params.raffleId}`,
        webhook_url: params.postbackUrl,
        client: {
            name: params.customer.name,
            cpf: params.customer.cpf.replace(/\D/g, ''),
            email: params.customer.email,
            phone: params.customer.phone.replace(/\D/g, ''),
            externaRef: params.raffleId // Campo comum para referência
        }
    };

    console.log(`[SyncPay] Solicitando PIX em: ${SYNCPAY_API_URL}/api/partner/v1/cash-in`);

    const response = await fetch(`${SYNCPAY_API_URL}/api/partner/v1/cash-in`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
        console.error("Erro ao criar PIX na SyncPay:", data);
        throw new Error(data.message || "Erro ao gerar cobrança PIX");
    }

    return data;
}
