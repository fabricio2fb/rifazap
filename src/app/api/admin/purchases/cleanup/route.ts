
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { cleanupExpiredReservations } from '@/lib/utils/cleanup';

export async function POST(request: Request) {
    const supabase = await createClient();

    // 1. Verificar autenticação
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    try {
        // 2. Buscar todas as rifas deste organizador
        const { data: raffles } = await supabase
            .from('raffles')
            .select('id')
            .eq('organizer_id', user.id);

        if (raffles) {
            // 3. Executar limpeza para cada rifa
            const cleanupPromises = raffles.map(r => cleanupExpiredReservations(r.id));
            await Promise.all(cleanupPromises);
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
