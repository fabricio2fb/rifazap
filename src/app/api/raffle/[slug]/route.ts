
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
        status
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
    raffle.reserved_numbers = raffle.reserved_numbers.filter((rn: any) => {
        // Se não tem expires_at (erro de dados), mantemos por segurança ou removemos?
        // Geralmente status 'paid' não tem expires_at ou é infinito.
        if (rn.status === 'paid') return true;
        return rn.expires_at > now;
    });

    return NextResponse.json(raffle);
}
