
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const supabase = await createClient();
    const body = await request.json();

    // 1. Verificar autenticação
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // 2. Preparar dados da campanha
    // Forçamos o organizer_id para ser o ID do usuário logado (Segurança!)
    const raffleData = {
        ...body,
        organizer_id: user.id,
        status: body.status || 'pending_payment',
        created_at: new Date().toISOString()
    };

    // 3. Inserir no banco
    const { data, error } = await supabase
        .from('raffles')
        .insert(raffleData)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: 'Erro ao criar campanha: ' + error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}
