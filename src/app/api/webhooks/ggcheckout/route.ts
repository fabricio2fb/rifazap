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

        // Helper to extract nested fields
        const extractId = (obj: any): string | null => {
            if (!obj) return null;
            return obj.external_id ||
                obj.raffle_id ||
                obj.external_reference ||
                obj.reference ||
                obj.src ||
                obj.ref ||
                obj.id_rifa ||
                (obj.metadata && (obj.metadata.raffle_id || obj.metadata.external_id || obj.metadata.src || obj.metadata.ref));
        };

        const raffleId = extractId(payload) || extractId(payload.data) || extractId(payload.transaction) || payload.id;

        const rawStatus = String(
            payload.status ||
            payload.payment_status ||
            payload.event ||
            (payload.data && payload.data.status) ||
            (payload.transaction && payload.transaction.status) ||
            ""
        ).toLowerCase();

        console.log(`[Webhook] Processing Raffle: ${raffleId}, Status: ${rawStatus}`);

        let raffleToActivateId = raffleId;

        // --- LOGIC IF NO ID IS PROVIDED BY GGCHECKOUT ---
        if (!raffleToActivateId) {
            console.log("[Webhook] Nenhuma ID de campanha foi encontrada neste pagamento. Ignorando evento para prevenir ativação indesejada de outras campanhas.");
            return NextResponse.json({ success: true, message: "ID não reconhecida, ignorando webhook" }, { status: 200 });
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

        if (isSuccess && raffleToActivateId) {
            const supabase = await createAdminClient();

            const { error } = await supabase
                .from('raffles')
                .update({ status: 'active' })
                .eq('id', raffleToActivateId);

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