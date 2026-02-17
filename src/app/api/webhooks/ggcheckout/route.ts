import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const payload = await request.json();
        console.log("GGCheckout Webhook Received:", JSON.stringify(payload, null, 2));

        // Discover Raffle ID from multiple potential fields
        const raffleId =
            payload.external_id ||
            payload.external_reference ||
            payload.id_rifa ||
            (payload.metadata && payload.metadata.raffle_id);

        // Discover status and normalize to lowercase
        const rawStatus = String(payload.status || payload.payment_status || payload.event || "").toLowerCase();

        console.log(`[Webhook] Processing Raffle: ${raffleId}, Status: ${rawStatus}`);

        if (!raffleId) {
            console.log("[Webhook] Missing raffle identifier. This is normal for 'Test Integration' buttons.");
            return NextResponse.json({
                success: true,
                message: "Webhook reachable! (Note: Missing raffle identifier for this test payload)"
            }, { status: 200 });
        }

        // Expanded list of success statuses (case-insensitive due to toLowerCase)
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
            const supabase = await createClient();

            const { data, error } = await supabase
                .from('raffles')
                .update({ status: 'active' })
                .eq('id', raffleId)
                .select();

            if (error) {
                console.error("[Webhook] Database update failed:", error);
                return NextResponse.json({ error: "Database update failed" }, { status: 500 });
            }

            if (!data || data.length === 0) {
                console.warn(`[Webhook] No raffle found with ID ${raffleId}`);
                return NextResponse.json({ error: "Raffle not found" }, { status: 404 });
            }

            console.log(`[Webhook] Raffle ${raffleId} activated successfully.`);
            return NextResponse.json({ success: true, message: "Raffle activated" });
        }

        console.log(`[Webhook] Status ${rawStatus} not recognized as successful. No action taken.`);
        return NextResponse.json({ success: true, message: "Webhook received" });
    } catch (error) {
        console.error("[Webhook] Error processing request:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
