import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { raffleId } = await request.json();

        if (!raffleId) {
            return NextResponse.json({ error: "ID da rifa é obrigatório" }, { status: 400 });
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

        // 2. Call GGCheckout API to generate the checkout
        const payload = {
            name: "Ativação de Campanha - " + raffle.title,
            price: 1000, // Representing R$ 10,00 if the API expects cents, or maybe 10 for R$10? Wait... The user example says: "price": 10.
            // But let's check what the user provided:
            // "price": 10,
        };

        const ggCheckoutResponse = await fetch('https://api.ggcheckout.com/v1/checkout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ggck_live_3417c7ce81f0975ee5b88919a8dd492690557a5a2a633c5d0a8727cfc544a666`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: `Ativação de Campanha: ${raffle.title}`,
                price: 10, // R$ 10,00 according to user instructions
                external_id: raffle.id,
                success_url: "https://socialrifa.vercel.app/admin/campanhas",
                webhook_url: "https://socialrifa.vercel.app/api/webhooks/ggcheckout"
            })
        });

        if (!ggCheckoutResponse.ok) {
            const errorData = await ggCheckoutResponse.text();
            console.error("GGCheckout Error:", errorData);
            return NextResponse.json({ error: "Erro ao gerar pagamento com GGCheckout" }, { status: 500 });
        }

        const data = await ggCheckoutResponse.json();

        // The GGCheckout API returns `checkout_url` according to user's instructions.
        return NextResponse.json({
            checkout_url: data.checkout_url
        });

    } catch (error: any) {
        console.error("Error creating GGCheckout payment:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
