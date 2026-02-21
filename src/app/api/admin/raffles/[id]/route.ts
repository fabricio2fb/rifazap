
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const id = (await params).id;
    const supabase = await createClient();
    const body = await request.json();

    // 1. Verificar autenticação
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // 2. Verificar se o usuário é o dono da campanha
    const { data: raffle, error: fetchError } = await supabase
        .from('raffles')
        .select('organizer_id')
        .eq('id', id)
        .single();

    if (fetchError || !raffle) {
        return NextResponse.json({ error: 'Campanha não encontrada' }, { status: 404 });
    }

    if (raffle.organizer_id !== user.id) {
        return NextResponse.json({ error: 'Sem permissão para editar esta campanha' }, { status: 403 });
    }

    // 3. Executar o update
    // Filtramos o body para evitar que o usuário tente alterar campos sensíveis como organizer_id
    const { title, description, image_url, draw_date, whatsapp_contact, whatsapp_group_link, status, winner_number, winner } = body;

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (image_url !== undefined) updateData.image_url = image_url;
    if (draw_date !== undefined) updateData.draw_date = draw_date;
    if (whatsapp_contact !== undefined) updateData.whatsapp_contact = whatsapp_contact;
    if (whatsapp_group_link !== undefined) updateData.whatsapp_group_link = whatsapp_group_link;
    if (status !== undefined) updateData.status = status;
    if (winner_number !== undefined) updateData.winner_number = winner_number;
    if (winner !== undefined) updateData.winner = winner;

    const { data: updated, error: updateError } = await supabase
        .from('raffles')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

    if (updateError) {
        return NextResponse.json({ error: 'Erro ao atualizar campanha' }, { status: 500 });
    }

    return NextResponse.json(updated);
}
