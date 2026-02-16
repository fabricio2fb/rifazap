
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

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
        number,
        status,
        expires_at
      )
    `)
        .eq('slug', slug)
        .eq('status', 'active')
        .single();

    if (error || !raffle) {
        return NextResponse.json({ error: 'Rifa não encontrada' }, { status: 404 });
    }

    // Filtra números expirados antes de retornar
    const now = new Date().toISOString();
    // 1. Filtra números expirados localmente para o retorno imediato
    const expiredReservations = raffle.reserved_numbers.filter((rn: any) => {
        if (rn.status === 'paid') return false;
        return rn.expires_at <= now;
    });

    // 2. Limpeza Proativa: Se houver expirados, deleta do banco para avisar via Realtime
    if (expiredReservations.length > 0) {
        const expiredIds = expiredReservations.map((rn: any) => rn.id);
        // Rodamos em background/paralelo ou aguardamos? 
        // Aqui aguardamos para garantir que o retorno esteja limpo
        await supabase
            .from('reserved_numbers')
            .delete()
            .in('id', expiredIds);
    }

    // 3. Resultado limpo para o usuário
    raffle.reserved_numbers = raffle.reserved_numbers.filter((rn: any) => {
        if (rn.status === 'paid') return true;
        return rn.expires_at > now;
    });

    return NextResponse.json(raffle);
}
