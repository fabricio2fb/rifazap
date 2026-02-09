import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const payload = await request.json();
        console.log("GGCheckout Webhook Received:", payload);

        // GGCheckout usually sends 'external_id' which we use for Raffle ID
        // and 'status' or 'payment_status'
        const raffleId = payload.external_id || payload.external_reference || payload.id_rifa;
        const status = payload.status || payload.payment_status;

        if (!raffleId) {
            return NextResponse.json({ error: "Missing raffle identifier" }, { status: 400 });
        }

        // Typical "success" statuses for payment gateways
        const isSuccess = status === "approved" || status === "paid" || status === "completed" || status === "success";

        if (isSuccess) {
            const supabase = await createClient();

            const { data, error } = await supabase
                .from('raffles')
                .update({ status: 'active' })
                .eq('id', raffleId)
                .select();

            if (error) {
                console.error("Error updating raffle status:", error);
                return NextResponse.json({ error: "Database update failed" }, { status: 500 });
            }

            console.log(`Raffle ${raffleId} activated via GGCheckout.`);
            return NextResponse.json({ success: true, message: "Raffle activated" });
        }

        return NextResponse.json({ success: true, message: "Webhook received but status not successful" });
    } catch (error) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
