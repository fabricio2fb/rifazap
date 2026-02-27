import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const payload = await request.json();

        console.log("[SyncPay Webhook] Recebido:", JSON.stringify(payload, null, 2));

        // 1. Validar evento (cashin.update) e status (completed)
        if (payload.event !== 'cashin.update') {
            return NextResponse.json({ received: true, message: "Evento ignorado" });
        }

        const data = payload.data;
        if (!data) {
            return NextResponse.json({ error: "Payload sem dados" }, { status: 400 });
        }

        // 2. Verificar se o pagamento foi concluído
        if (data.status !== 'completed') {
            console.log(`[SyncPay Webhook] Pagamento id:${data.id} com status:${data.status}. Aguardando conclusão.`);
            return NextResponse.json({ received: true });
        }

        // 3. Extrair a ID da campanha (externaRef que enviamos)
        const raffleId =
            data.client?.externaRef ||
            data.externaRef ||
            data.metadata?.raffle_id ||
            payload.externaRef ||
            payload.client?.externaRef;

        if (!raffleId) {
            console.error("[SyncPay Webhook] Erro: externaRef (raffleId) não encontrado no payload.");
            return NextResponse.json({ error: "Raffle ID not found" }, { status: 400 });
        }

        console.log(`[SyncPay Webhook] Ativando campanha: ${raffleId}`);

        // 4. Ativar a campanha no Supabase
        const supabase = await createAdminClient();

        // Verificamos o valor para garantir (opcional)
        // data.amount

        const { error } = await supabase
            .from('raffles')
            .update({ status: 'active' })
            .eq('id', raffleId)
            .eq('status', 'pending_payment'); // Segurança extra: só ativa se estiver pendente

        if (error) {
            console.error("[SyncPay Webhook] Erro ao atualizar banco:", error);
            return NextResponse.json({ error: "Database error" }, { status: 500 });
        }

        console.log(`[SyncPay Webhook] Campanha ${raffleId} ativada com sucesso!`);
        return NextResponse.json({ success: true, activated: raffleId });

    } catch (error: any) {
        console.error("[SyncPay Webhook] Internal Error:", error);
        return NextResponse.json({ error: "Webhook Error", details: error.message }, { status: 500 });
    }
}
