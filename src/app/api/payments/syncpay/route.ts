import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { createSyncPayPix } from "@/lib/syncpay";

export async function POST(request: Request) {
    try {
        const { raffleId } = await request.json();

        if (!raffleId) {
            return NextResponse.json({ error: "ID da campanha é obrigatório" }, { status: 400 });
        }

        const supabase = await createAdminClient();

        console.log("[SyncPay] Criando pagamento para via raffleId:", raffleId);

        // 1. Buscar detalhes da campanha
        // Note: Se o join com 'profiles' falhar, removeremos ele para isolar o problema
        const { data: raffle, error: raffleError } = await supabase
            .from('raffles')
            .select('*')
            .eq('id', raffleId)
            .single();

        if (raffleError) {
            console.error("[SyncPay] Erro Supabase raffles:", raffleError);
            return NextResponse.json({
                error: "Campanha não encontrada",
                details: `${raffleError.message} (ID: ${raffleId})`
            }, { status: 404 });
        }

        if (!raffle) {
            console.error("[SyncPay] Campanha não encontrada (vazio)");
            return NextResponse.json({
                error: "Campanha não encontrada",
                details: `Vazio para ID: ${raffleId}`
            }, { status: 404 });
        }

        // Buscar o perfil separadamente para ser mais seguro contra problemas de relacionamento
        const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, email, whatsapp')
            .eq('id', raffle.organizer_id)
            .single();

        if (raffle.status !== 'pending_payment') {
            return NextResponse.json({ error: "Campanha já está ativa ou em status inválido" }, { status: 400 });
        }

        // Determinar o valor (Básico R$ 14,90 ou PRO R$ 25,90)
        // O campo 'plan' armazena o tipo ('basic' ou 'pro')
        const isPro = raffle.plan === 'pro' || raffle.is_pro === true;
        const amount = isPro ? 25.90 : 14.90;

        // 2. Gerar Cobrança na SyncPay
        // Usamos os dados do perfil do organizador para o faturamento (SaaS)

        // URL de Webhook dinâmica (ajustar conforme domínio final)
        const host = request.headers.get('host');
        const protocol = host?.includes('localhost') ? 'http' : 'https';
        const postbackUrl = `${protocol}://${host}/api/webhooks/syncpay`;

        const pixData = await createSyncPayPix({
            raffleId: raffle.id,
            amount,
            customer: {
                name: profile?.full_name || "Organizador Apoiêfy",
                cpf: "00000000000", // Idealmente teríamos o CPF no perfil, usando mock por enquanto se não houver
                email: profile?.email || "contato@apoiêfy.com.br",
                phone: profile?.whatsapp || "00000000000"
            },
            postbackUrl
        });

        console.log("[SyncPay] Resposta bruta da API:", JSON.stringify(pixData, null, 2));

        // 3. Retornar os dados do PIX para o frontend
        // Tentamos extrair o código de vários lugares possíveis comuns em APIs de PIX
        const pix_code =
            pixData.pix_code ||
            pixData.data?.pix_code ||
            pixData.qrcode ||
            pixData.data?.qrcode ||
            pixData.payload?.pix_code ||
            pixData.data?.copy_paste;

        const pix_url =
            pixData.pix_url ||
            pixData.data?.pix_url ||
            pixData.qr_code_url ||
            pixData.data?.qr_code_url;

        console.log("[SyncPay] Código PIX extraído:", pix_code ? "SIM (Encontrado)" : "NÃO (Vazio)");

        const responsePayload = {
            success: true,
            pix_code,
            pix_url,
            amount: amount,
            status: 'pending'
        };

        console.log("[SyncPay] Retornando ao frontend:", responsePayload);

        return NextResponse.json(responsePayload);

    } catch (error: any) {
        console.error("Error creating SyncPay payment:", error);
        return NextResponse.json({
            error: "Erro ao processar pagamento",
            details: error.message
        }, { status: 500 });
    }
}
