
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const id = (await params).id;
    const supabase = await createClient();
    const { winnerNumber, winnerName } = await request.json();

    // 1. Verificar autenticação
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // 2. Verificar se o usuário é o dono da rifa
    const { data: raffle, error: fetchError } = await supabase
        .from('raffles')
        .select('organizer_id')
        .eq('id', id)
        .single();

    if (fetchError || !raffle) {
        return NextResponse.json({ error: 'Rifa não encontrada' }, { status: 404 });
    }

    if (raffle.organizer_id !== user.id) {
        return NextResponse.json({ error: 'Sem permissão para realizar o sorteio desta rifa' }, { status: 403 });
    }

    // 3. Executar o update do ganhador
    const { error: updateError } = await supabase
        .from('raffles')
        .update({
            status: 'drawn',
            winner_number: winnerNumber,
            winner: winnerName
        })
        .eq('id', id);

    if (updateError) {
        return NextResponse.json({ error: 'Erro ao salvar ganhador' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
