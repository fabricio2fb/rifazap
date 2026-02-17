import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from 'mercadopago';

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

        // 3. Create Mercado Pago Preference
        const preference = new Preference(client);

        // Price: 0.20 as requested for testing
        const response = await preference.create({
            body: {
                items: [
                    {
                        id: raffle.id,
                        title: `Ativação de Rifa: ${raffle.title}`,
                        quantity: 1,
                        unit_price: 0.20,
                        currency_id: 'BRL',
                    }
                ],
                external_reference: raffle.id,
                notification_url: `https://socialrifa.vercel.app/api/webhooks/mercadopago`, // Use production URL for MP to find it
                back_urls: {
                    success: `https://socialrifa.vercel.app/admin/rifas?success=true`,
                    failure: `https://socialrifa.vercel.app/admin/rifas?error=true`,
                    pending: `https://socialrifa.vercel.app/admin/rifas?pending=true`,
                },
                auto_return: 'approved',
            }
        });

        console.log(`[MP Checkout] Preference created for Raffle: ${raffleId}. ID: ${response.id}`);

        return NextResponse.json({
            id: response.id,
            init_point: response.init_point
        });

    } catch (error: any) {
        console.error("[MP Checkout] Error:", error);
        return NextResponse.json({ error: "Erro ao gerar checkout" }, { status: 500 });
    }
}
