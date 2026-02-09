
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

    return NextResponse.json(raffle);
}
