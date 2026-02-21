
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { cleanupExpiredReservations } from '@/lib/utils/cleanup';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const slug = (await params).slug;
    const supabase = await createClient();

    const { data: raffle, error } = await supabase
        .from('raffles')
        .select(`
      *,
      reserved_numbers (
        id,
        number,
        status,
        expires_at
      )
    `)
        .eq('slug', slug)
        .eq('status', 'active')
        .single();

    if (error || !raffle) {
        return NextResponse.json({ error: 'Campanha não encontrada' }, { status: 404 });
    }

    // 1. Limpeza Proativa: Remove reservas expiradas do banco (dispara Realtime)
    await cleanupExpiredReservations(raffle.id);

    // 2. Filtra o objeto de retorno para não enviar lixo expirado para o front
    const now = new Date().toISOString();
    raffle.reserved_numbers = raffle.reserved_numbers.filter((rn: any) => {
        if (rn.status === 'paid') return true;
        return rn.expires_at > now;
    });

    return NextResponse.json(raffle);

    return NextResponse.json(raffle);
}
