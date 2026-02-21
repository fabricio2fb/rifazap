import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { raffleId } = await request.json();

        if (!raffleId) {
            return NextResponse.json({ error: "ID da campanha é obrigatório" }, { status: 400 });
        }

        const supabase = await createAdminClient();

        // 1. Fetch raffle details to ensure it exists
        const { data: raffle, error: raffleError } = await supabase
            .from('raffles')
            .select('id, title, status')
            .eq('id', raffleId)
            .single();

        if (raffleError || !raffle) {
            return NextResponse.json({ error: "Campanha não encontrada" }, { status: 404 });
        }

        if (raffle.status !== 'pending_payment') {
            return NextResponse.json({ error: "Campanha já ativada ou status inválido" }, { status: 400 });
        }

        // 2. Return the static GGCheckout URL provided by the user
        const staticCheckoutUrl = 'https://ggcheckout.com.br/checkout/v2/fhcawWP8XX2R59jn4gcW';
        // We append the raffleId to tracking parameters so that if GGCheckout forwards it via webhook, we can activate automatically.
        const checkoutUrlWithParams = `${staticCheckoutUrl}?src=${raffle.id}&ref=${raffle.id}&external_reference=${raffle.id}`;

        return NextResponse.json({
            checkout_url: checkoutUrlWithParams
        });

    } catch (error: any) {
        console.error("Error creating GGCheckout payment:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
