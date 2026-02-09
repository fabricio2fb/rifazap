
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const supabase = await createClient();
    const { phone } = await request.json();

    const { data: customer, error } = await supabase
        .from('customers')
        .select(`
      *,
      purchases (
        id,
        numbers,
        total_amount,
        status,
        created_at,
        raffle:raffles (
          title,
          slug,
          draw_date
        )
      )
    `)
        .eq('phone', phone)
        .single();

    if (error || !customer) {
        return NextResponse.json(
            { error: 'Nenhuma compra encontrada com este número' },
            { status: 404 }
        );
    }

    // Atualizar último login
    await supabase
        .from('customers')
        .update({ last_login: new Date().toISOString() })
        .eq('id', customer.id);

    return NextResponse.json(customer);
}
