import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const payload = await request.json();
        const url = new URL(request.url);
        const token = url.searchParams.get('token');
        const validToken = process.env.GGCHECKOUT_WEBHOOK_SECRET || 'sec_ggchk_9a8b7c6d5e4f3g2h1';

        if (token !== validToken) {
            console.error("[Webhook] Invalid security token.");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        console.log("GGCheckout Webhook Received:", payload);

        const raffleId =
            payload.external_id ||
            payload.raffle_id ||
            payload.external_reference ||
            payload.id ||
            payload.id_rifa ||
            (payload.metadata && (payload.metadata.raffle_id || payload.metadata.external_id));

        const rawStatus = String(
            payload.status ||
            payload.payment_status ||
            payload.event ||
            ""
        ).toLowerCase();

        console.log(`[Webhook] Processing Raffle: ${raffleId}, Status: ${rawStatus}`);

        if (!raffleId) {
            return NextResponse.json({ success: true }, { status: 200 });
        }

        const successStatuses = [
            "approved",
            "paid",
            "completed",
            "success",
            "pix_paid",
            "card_paid",
            "pix paid",
            "card paid",
            "pago"
        ];

        const isSuccess = successStatuses.some(s => rawStatus.includes(s));

        if (isSuccess) {
            const supabase = await createAdminClient();

            const { error } = await supabase
                .from('raffles')
                .update({ status: 'active' })
                .eq('id', raffleId);

            if (error) {
                console.error("Database error:", error);
                return NextResponse.json({ error: "DB error" }, { status: 500 });
            }

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Webhook error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}