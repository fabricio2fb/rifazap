import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const payload = await request.json();
        const url = new URL(request.url);
        const token = url.searchParams.get('token');
        const validToken = process.env.APPMAX_WEBHOOK_SECRET || 'sec_appmax_xyz123';

        if (token !== validToken) {
            console.error("[Appmax Webhook] Invalid security token.");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        console.log("Appmax Webhook Received:", payload);

        // --- DEBUG: DUMP PAYLOAD TO FILE SO WE CAN INSPECT IT ---
        try {
            const fs = require('fs');
            const dumpData = {
                timestamp: new Date().toISOString(),
                url: request.url,
                payload: payload
            };
            fs.writeFileSync('appmax_latest_payload.json', JSON.stringify(dumpData, null, 2));
        } catch (e) {
            console.error("Failed to dump appmax webhook payload:", e);
        }

        // Helper to extract nested fields in Appmax Format
        const extractId = (obj: any): string | null => {
            if (!obj) return null;
            return obj.reference ||
                obj.external_reference ||
                obj.src ||
                obj.ref ||
                obj.tracking_id ||
                (obj.data && (obj.data.reference || obj.data.src || obj.data.custom_id));
        };

        const raffleId = extractId(payload);

        // Appmax usually returns statuses like 'approved', 'paid', 'refunded'
        const rawStatus = String(
            payload.event ||
            payload.status ||
            (payload.data && payload.data.status) ||
            ""
        ).toLowerCase();

        console.log(`[Appmax Webhook] Processing Raffle: ${raffleId}, Status: ${rawStatus}`);

        let raffleToActivateId = raffleId;

        // --- FALLBACK LOGIC IF NO ID IS PROVIDED BY APPMAX ---
        if (!raffleToActivateId) {
            console.log("[Appmax Webhook] No direct raffle ID found in payload. Attempting fallback match...");
            const supabase = await createAdminClient();

            // Try to find the absolute most recent 'pending_payment' raffle.
            const { data: recentPendingRaffles, error: pendingErr } = await supabase
                .from('raffles')
                .select('id, title, status')
                .eq('status', 'pending_payment')
                .order('created_at', { ascending: false })
                .limit(1);

            if (recentPendingRaffles && recentPendingRaffles.length > 0) {
                raffleToActivateId = recentPendingRaffles[0].id;
                console.log(`[Appmax Webhook] Fallback matched most recent pending raffle: ${raffleToActivateId}`);
            } else {
                console.log("[Appmax Webhook] No pending raffles found. Ignoring webhook.");
                return NextResponse.json({ success: true, message: "No pending raffles to activate" }, { status: 200 });
            }
        }

        // Checking for successful payment events in Appmax
        const successStatuses = [
            "approved",
            "paid",
            "PixApproved",
            "OrderApproved",
            "pix_approved",
            "order_approved",
            "pagamento aprovado",
            "sucesso"
        ];

        const isSuccess = successStatuses.some(s => rawStatus.includes(s.toLowerCase()));

        if (isSuccess && raffleToActivateId) {
            const supabase = await createAdminClient();

            const { error } = await supabase
                .from('raffles')
                .update({ status: 'active' })
                .eq('id', raffleToActivateId);

            if (error) {
                console.error("Database error in Appmax Webhook:", error);
                return NextResponse.json({ error: "DB error" }, { status: 500 });
            }

            console.log(`[Appmax Webhook] Successfully activated raffle ${raffleToActivateId}`);
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Appmax Webhook API error:", error);
        // Return 200 even on error to prevent Appmax from retrying indefinitely if it's a payload we can't parse
        return NextResponse.json({ success: true, warning: "Internal Error parsing" }, { status: 200 });
    }
}
