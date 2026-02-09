
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

    // Atualizar compra
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

    // Atualizar números reservados para status "paid"
    await supabase
        .from('reserved_numbers')
        .update({ status: 'paid' })
        .eq('purchase_id', id);

    return NextResponse.json({ success: true });
}
