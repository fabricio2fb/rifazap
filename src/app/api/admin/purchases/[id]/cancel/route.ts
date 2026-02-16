
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const id = (await params).id;
    const supabase = await createClient();

    // 1. Verificar autenticação
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
        return NextResponse.json({ error: 'Sem permissão para cancelar esta venda' }, { status: 403 });
    }

    // 3. Executar o cancelamento
    const { error: updateError } = await supabase
        .from('purchases')
        .update({ status: 'cancelled' })
        .eq('id', id);

    if (updateError) {
        return NextResponse.json({ error: 'Erro ao cancelar no banco' }, { status: 500 });
    }

    // Deletar números reservados
    await supabase.from('reserved_numbers').delete().eq('purchase_id', id);

    return NextResponse.json({ success: true });
}
