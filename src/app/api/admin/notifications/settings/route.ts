
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

    // 2. Executar o upsert das configurações
    const { data, error } = await supabase
        .from('notification_settings')
        .upsert({ user_id: user.id, ...body })
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: 'Erro ao salvar configurações' }, { status: 500 });
    }

    return NextResponse.json(data);
}
