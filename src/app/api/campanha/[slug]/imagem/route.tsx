import { ImageResponse } from 'next/og';
import { createClient } from '@/lib/supabase/server';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    const supabase = await createClient();

    // 1. Fetch Raffle Data
    const { data: raffle, error: raffleError } = await supabase
        .from('raffles')
        .select('*')
        .eq('slug', slug)
        .single();

    if (raffleError || !raffle) {
        return new Response('Campanha não encontrada', { status: 404 });
    }

    // 2. Fetch Purchases/Participants
    const { data: purchases } = await supabase
        .from('purchases')
        .select('status, numbers')
        .eq('raffle_id', raffle.id);

    // 3. Map status of each number
    const statusMap = new Map<number, 'pago' | 'reservado' | 'livre'>();
    purchases?.forEach(p => {
        const status = p.status === 'confirmed' || p.status === 'paid' || p.status === 'paid_delayed' ? 'pago' : 'reservado';
        p.numbers.forEach((num: number) => {
            statusMap.set(num, status);
        });
    });

    const totalNumbers = raffle.total_numbers;
    const price = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(raffle.ticket_price);
    const date = new Date(raffle.draw_date).toLocaleDateString('pt-BR');

    // Percentage sold
    const paidCount = Array.from(statusMap.values()).filter(s => s === 'pago').length;
    const percentageSold = Math.round((paidCount / totalNumbers) * 100);

    // Grid Calculation
    let cols = 10;
    if (totalNumbers > 100) cols = 20;
    if (totalNumbers > 500) cols = 25;

    const boxSize = Math.floor((1000 - (cols * 4)) / cols);
    const fontSize = totalNumbers > 100 ? (totalNumbers > 500 ? 12 : 16) : 24;

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    backgroundColor: 'white',
                    padding: '60px 40px',
                    fontFamily: 'sans-serif',
                }}
            >
                {/* TOPO */}
                < div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '40px' }}>
                    <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#1a1a1a', textAlign: 'center', marginBottom: '10px' }}>
                        ⚡ CAMPANHA DO {raffle.title.toUpperCase()}
                    </div>
                    < div style={{ fontSize: '28px', color: '#666', marginBottom: '5px' }}>
                        Cada número {price}
                    </div>
                    < div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>
                        Sorteio {date}
                    </div>
                </div>

                {/* LEGENDA */}
                <div style={{ display: 'flex', gap: '30px', marginBottom: '40px', fontSize: '20px', fontWeight: '600' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '20px', height: '20px', backgroundColor: '#22c55e', borderRadius: '4px' }}> </div>
                        < span > Livre </span>
                    </div>
                    < div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '20px', height: '20px', backgroundColor: '#eab308', borderRadius: '4px' }}> </div>
                        < span > Reservado </span>
                    </div>
                    < div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '20px', height: '20px', backgroundColor: '#94a3b8', borderRadius: '4px' }}> </div>
                        < span > Pago </span>
                    </div>
                </div>

                {/* GRADE */}
                <div
                    style={
                        {
                            display: 'flex',
                            flexWrap: 'wrap',
                            width: '1000px',
                            justifyContent: 'center',
                            gap: '4px',
                            marginBottom: '40px',
                        }
                    }
                >
                    {
                        Array.from({ length: totalNumbers }, (_, i) => {
                            const num = i + 1;
                            const status = statusMap.get(num) || 'livre';
                            const bgColor = status === 'pago' ? '#94a3b8' : status === 'reservado' ? '#eab308' : '#22c55e';

                            return (
                                <div
                                    key={num}
                                    style={{
                                        width: `${boxSize}px`,
                                        height: `${boxSize}px`,
                                        backgroundColor: bgColor,
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: `${fontSize}px`,
                                        fontWeight: 'bold',
                                        borderRadius: '4px',
                                    }
                                    }
                                >
                                    {num}
                                </div>
                            );
                        })}
                </div>

                {/* RODAPÉ */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 'auto' }}>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#0052FF', marginBottom: '10px' }}>
                        Pagamento via site: ticketon.com.br
                    </div>
                    < div style={{
                        fontSize: '36px',
                        fontWeight: 'bold',
                        color: 'white',
                        backgroundColor: '#1a1a1a',
                        padding: '10px 40px',
                        borderRadius: '50px'
                    }}>
                        {percentageSold} % VENDIDO
                    </div>
                </div>
            </div>
        ),
        {
            width: 1080,
            height: 1350,
        }
    );
}
