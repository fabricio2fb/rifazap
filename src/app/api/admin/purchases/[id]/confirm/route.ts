
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
        .select('*, raffles(organizer_id)')
        .eq('id', id)
        .single();

    if (purchaseError || !purchase) {
        return NextResponse.json({ error: 'Compra não encontrada' }, { status: 404 });
    }

    // @ts-ignore - raffles is a single object because of the relationship
    if (purchase.raffles.organizer_id !== user.id) {
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
    // Se a reserva expirou e foi deletada pela limpeza proativa, precisamos re-inserir.
    const purchaseNumbers = purchase.numbers || [];

    // Verificar se algum dos números já foi pego por outra pessoa nesse meio tempo
    const { data: existingReservations } = await supabase
        .from('reserved_numbers')
        .select('number, purchase_id')
        .eq('raffle_id', purchase.raffle_id)
        .in('number', purchaseNumbers);

    const conflicts = (existingReservations || []).filter(rn => rn.purchase_id !== id);

    if (conflicts.length > 0) {
        return NextResponse.json({
            error: 'Não foi possível confirmar: Alguns destes números foram reservados por outra pessoa após a expiração.',
            conflictingNumbers: conflicts.map(c => c.number)
        }, { status: 409 });
    }

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

    return NextResponse.json({ success: true });
}
