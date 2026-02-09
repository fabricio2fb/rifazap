
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const slug = (await params).slug;
    const supabase = await createClient();
    const body = await request.json();
    const { name, phone, numbers } = body;

    // 1. Buscar ou criar cliente
    let { data: customer } = await supabase
        .from('customers')
        .select('*')
        .eq('phone', phone)
        .single();

    if (!customer) {
        const { data: newCustomer, error: customerError } = await supabase
            .from('customers')
            .insert({ name, phone })
            .select()
            .single();

        if (customerError) {
            return NextResponse.json({ error: 'Erro ao criar cliente' }, { status: 500 });
        }
        customer = newCustomer;
    }

    // 2. Buscar rifa
    const { data: raffle } = await supabase
        .from('raffles')
        .select('id, ticket_price')
        .eq('slug', slug)
        .single();

    if (!raffle) {
        return NextResponse.json({ error: 'Rifa não encontrada' }, { status: 404 });
    }

    // 3. Verificar disponibilidade dos números
    const { data: existing } = await supabase
        .from('reserved_numbers')
        .select('number')
        .eq('raffle_id', raffle.id)
        .in('number', numbers);

    if (existing && existing.length > 0) {
        return NextResponse.json(
            { error: 'Alguns números já estão reservados' },
            { status: 400 }
        );
    }

    // 4. Criar compra
    const totalAmount = numbers.length * raffle.ticket_price;
    const { data: purchase, error: purchaseError } = await supabase
        .from('purchases')
        .insert({
            raffle_id: raffle.id,
            customer_id: customer.id,
            numbers,
            total_amount: totalAmount,
            status: 'pending'
        })
        .select()
        .single();

    if (purchaseError) {
        return NextResponse.json({ error: 'Erro ao criar compra' }, { status: 500 });
    }

    // 5. Reservar números (expiram em 15 minutos)
    const reservations = numbers.map((num: number) => ({
        raffle_id: raffle.id,
        number: num,
        customer_id: customer.id,
        purchase_id: purchase.id,
        expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString()
    }));

    const { error: reservationError } = await supabase.from('reserved_numbers').insert(reservations);

    if (reservationError) {
        return NextResponse.json({ error: 'Erro ao reservar números' }, { status: 500 });
    }

    return NextResponse.json({
        success: true,
        purchaseId: purchase.id,
        customerId: customer.id
    });
}
