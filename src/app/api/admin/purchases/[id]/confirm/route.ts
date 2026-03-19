
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const id = (await params).id;
    const supabase = await createClient();

    // Verificar autenticação do organizador
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // 2. Buscar a compra e verificar se o usuário é o dono da rifa vinculada
    const { data: purchase, error: purchaseError } = await supabase
        .from('purchases')
        .select('*, raffles(*)')
        .eq('id', id)
        .single();

    if (purchaseError || !purchase) {
        return NextResponse.json({ error: 'Compra não encontrada' }, { status: 404 });
    }

    const raffle = purchase.raffles;
    // @ts-ignore
    if (raffle.organizer_id !== user.id) {
        return NextResponse.json({ error: 'Sem permissão para confirmar esta venda' }, { status: 403 });
    }

    // 3. Atualizar compra
    const { error } = await supabase
        .from('purchases')
        .update({
            status: 'paid',
            confirmed_at: new Date().toISOString(),
            confirmed_by: user.id
        })
        .eq('id', id);

    if (error) {
        return NextResponse.json({ error: 'Erro ao atualizar compra' }, { status: 500 });
    }

    // 4. Garantir que os números estão realmente atribuídos como pagos
    const purchaseNumbers = purchase.numbers || [];

    // Upsert nos números para garantir que fiquem como 'paid'
    const reservationsToUpdate = purchaseNumbers.map((num: number) => ({
        raffle_id: purchase.raffle_id,
        number: num,
        customer_id: purchase.customer_id,
        purchase_id: id,
        status: 'paid'
    }));

    const { error: reserveError } = await supabase
        .from('reserved_numbers')
        .upsert(reservationsToUpdate, { onConflict: 'raffle_id,number' });

    if (reserveError) {
        return NextResponse.json({ error: 'Erro ao garantir reserva dos números' }, { status: 500 });
    }

    // --- TRIGGER NOTIFICATIONS ---
    try {
        const host = request.headers.get('host');
        const protocol = host?.includes('localhost') ? 'http' : 'https';
        const notifyUrl = `${protocol}://${host}/api/notify`;

        // 1. Notificar Comprador (se tiver user_id vinculado ao cliente ou se estiver logado)
        // Buscamos se o cliente tem um perfil ou user_id
        const { data: customer } = await supabase
            .from('customers')
            .select('user_id')
            .eq('id', purchase.customer_id)
            .single();

        if (customer?.user_id) {
            await fetch(notifyUrl, {
                method: 'POST',
                body: JSON.stringify({
                    user_id: customer.user_id,
                    title: 'Pagamento Confirmado! ✅',
                    body: `Seu pagamento foi confirmado! Número [${purchaseNumbers.join(', ')}] garantido.`,
                    url: `/customer/dashboard`
                })
            });
        }

        // 2. Verificar progresso da campanha para o Organizador
        const { count: paidCount } = await supabase
            .from('reserved_numbers')
            .select('*', { count: 'exact', head: true })
            .eq('raffle_id', purchase.raffle_id)
            .eq('status', 'paid');

        if (paidCount !== null) {
            const total = raffle.total_numbers;
            const percentage = (paidCount / total) * 100;

            // Trigger 50% (enviar apenas quando cruza a marca)
            if (paidCount >= total * 0.5 && (paidCount - purchaseNumbers.length) < total * 0.5) {
                await fetch(notifyUrl, {
                    method: 'POST',
                    body: JSON.stringify({
                        user_id: raffle.organizer_id,
                        title: 'Campanha na metade! 🎉',
                        body: `Sua campanha '${raffle.title}' já está na metade!`,
                        url: `/admin/campanhas`
                    })
                });
            }

            // Trigger Esgotado
            if (paidCount >= total) {
                await fetch(notifyUrl, {
                    method: 'POST',
                    body: JSON.stringify({
                        user_id: raffle.organizer_id,
                        title: 'Campanha Esgotada! 🏆',
                        body: `Sua campanha '${raffle.title}' esgotou! Hora de sortear.`,
                        url: `/admin/campanhas`
                    })
                });
            }
        }
    } catch (pushError) {
        console.error('Error triggering push notifications:', pushError);
    }

    return NextResponse.json({ success: true });
}
