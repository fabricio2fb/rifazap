import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from 'mercadopago';

// Initialize Mercado Pago
const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN || ''
});

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { raffleId } = await request.json();

        if (!raffleId) {
            return NextResponse.json({ error: "ID da rifa é obrigatório" }, { status: 400 });
        }

        // 1. Verify user authentication
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        // 2. Fetch raffle details (to ensure ownership and get title)
        const { data: raffle, error: raffleError } = await supabase
            .from('raffles')
            .select('*')
            .eq('id', raffleId)
            .eq('organizer_id', user.id)
            .single();

        if (raffleError || !raffle) {
            return NextResponse.json({ error: "Rifa não encontrada ou não autorizada" }, { status: 404 });
        }

        if (!process.env.MP_ACCESS_TOKEN) {
            console.error("[MP Checkout] Access Token is missing!");
            return NextResponse.json({ error: "Configuração do Mercado Pago incompleta (Falta Access Token no Vercel)" }, { status: 500 });
        }

        // 3. Create Mercado Pago PIX Payment
        const payment = new Payment(client);

        // Price: 0.20 as requested for testing
        try {
            const paymentData = await payment.create({
                body: {
                    transaction_amount: 0.20,
                    description: `Ativação de Rifa: ${raffle.title}`,
                    payment_method_id: 'pix',
                    payer: {
                        email: user.email || 'noreply@socialrifa.com.br',
                    },
                    external_reference: raffle.id,
                    notification_url: `https://www.socialrifa.com.br/api/webhooks/mercadopago`,
                }
            });

            console.log(`[MP Checkout] PIX Payment created for Raffle: ${raffleId}. Payment ID: ${paymentData.id}`);

            // Extract PIX data
            const pixData = paymentData.point_of_interaction?.transaction_data;

            return NextResponse.json({
                payment_id: paymentData.id,
                qr_code: pixData?.qr_code || '',
                qr_code_base64: pixData?.qr_code_base64 || '',
            });
        } catch (mpError: any) {
            console.error("[MP Checkout] Mercado Pago API Error:", mpError);
            return NextResponse.json({
                error: "Erro na API do Mercado Pago",
                details: mpError.message || "Erro desconhecido na API"
            }, { status: 502 });
        }

    } catch (error: any) {
        console.error("[MP Checkout] Internal Error:", error);
        return NextResponse.json({
            error: "Erro interno ao gerar checkout",
            message: error.message
        }, { status: 500 });
    }
}
