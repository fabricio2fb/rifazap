import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from 'mercadopago';

// Initialize Mercado Pago
const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN || ''
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log("[MP Webhook] Received:", JSON.stringify(body, null, 2));

        // Mercado Pago sends 'action' and 'data.id'
        const { action, data } = body;

        // We only care about payment updates
        if (action === 'payment.updated' || action === 'payment.created' || body.type === 'payment') {
            const paymentId = data?.id || body.data?.id || body.id;

            if (!paymentId || paymentId === '123456') { // Skip MP test button ID
                return NextResponse.json({ success: true, message: "Test notification ignored" });
            }

            // 2. Fetch payment details from Mercado Pago
            const payment = new Payment(client);
            const paymentData = await payment.get({ id: paymentId });

            const status = paymentData.status;
            const raffleId = paymentData.external_reference;

            console.log(`[MP Webhook] Payment ${paymentId} | Status: ${status} | Raffle: ${raffleId}`);

            if (status === 'approved' && raffleId) {
                const supabase = await createAdminClient();

                const { data: updated, error: updateError } = await supabase
                    .from('raffles')
                    .update({ status: 'active' })
                    .eq('id', raffleId)
                    .select();

                if (updateError) {
                    console.error("[MP Webhook] Database update failed:", updateError);
                    return NextResponse.json({ error: "Database update failed" }, { status: 500 });
                }

                if (!updated || updated.length === 0) {
                    console.warn(`[MP Webhook] No raffle found with ID ${raffleId}`);
                    return NextResponse.json({ error: "Raffle not found" }, { status: 404 });
                }

                console.log(`[MP Webhook] Raffle ${raffleId} activated via Mercado Pago.`);
                return NextResponse.json({ success: true, message: "Raffle activated" });
            }
        }

        return NextResponse.json({ success: true, message: "Notification received" });

    } catch (error: any) {
        console.error("[MP Webhook] Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
