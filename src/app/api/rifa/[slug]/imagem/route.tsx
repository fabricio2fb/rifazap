import { ImageResponse } from 'next/og';
import { createClient } from '@/lib/supabase/server';
import { NextRequest } from 'next/server';


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
        return new Response('Rifa não encontrada', { status: 404 });
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
                    height: '1350px',
                    width: '1080px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    backgroundColor: '#FFFFFF',
                    padding: '60px 40px',
                    fontFamily: 'sans-serif',
                }}
            >
                {/* TOPO */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '40px', backgroundColor: '#FFFFFF' }}>
                    <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#1A1A1A', textAlign: 'center', marginBottom: '10px', backgroundColor: '#FFFFFF', display: 'flex' }}>
                        ⚡ RIFA DO {raffle.title.toUpperCase()}
                    </div>
                    <div style={{ fontSize: '28px', color: '#666666', marginBottom: '5px', backgroundColor: '#FFFFFF', display: 'flex' }}>
                        Cada número {price}
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#EF4444', backgroundColor: '#FFFFFF', display: 'flex' }}>
                        Sorteio {date}
                    </div>
                </div>

                {/* LEGENDA */}
                <div style={{ display: 'flex', marginBottom: '40px', fontSize: '20px', fontWeight: '600', backgroundColor: '#FFFFFF' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginRight: '30px', backgroundColor: '#FFFFFF' }}>
                        <div style={{ width: '20px', height: '20px', backgroundColor: '#22C55E', borderRadius: '4px', marginRight: '8px' }}></div>
                        <span style={{ color: '#000000' }}>Livre</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginRight: '30px', backgroundColor: '#FFFFFF' }}>
                        <div style={{ width: '20px', height: '20px', backgroundColor: '#EAB308', borderRadius: '4px', marginRight: '8px' }}></div>
                        <span style={{ color: '#000000' }}>Reservado</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
                        <div style={{ width: '20px', height: '20px', backgroundColor: '#94A3B8', borderRadius: '4px', marginRight: '8px' }}></div>
                        <span style={{ color: '#000000' }}>Pago</span>
                    </div>
                </div>

                {/* GRADE */}
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        width: '1000px',
                        justifyContent: 'center',
                        marginBottom: '40px',
                        backgroundColor: '#FFFFFF',
                    }}
                >
                    {Array.from({ length: totalNumbers }, (_, i) => {
                        const num = i + 1;
                        const status = statusMap.get(num) || 'livre';
                        const bgColor = status === 'pago' ? '#94A3B8' : status === 'reservado' ? '#EAB308' : '#22C55E';

                        return (
                            <div
                                key={num}
                                style={{
                                    width: `${boxSize}px`,
                                    height: `${boxSize}px`,
                                    backgroundColor: bgColor,
                                    color: '#FFFFFF',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: `${fontSize}px`,
                                    fontWeight: 'bold',
                                    borderRadius: '4px',
                                    margin: '2px',
                                }}
                            >
                                {num}
                            </div>
                        );
                    })}
                </div>

                {/* RODAPÉ */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 'auto', backgroundColor: '#FFFFFF' }}>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#0052FF', marginBottom: '10px', backgroundColor: '#FFFFFF', display: 'flex' }}>
                        Pagamento via site: rifazap.vercel.app
                    </div>
                    <div style={{
                        fontSize: '36px',
                        fontWeight: 'bold',
                        color: '#FFFFFF',
                        backgroundColor: '#1A1A1A',
                        padding: '10px 40px',
                        borderRadius: '50px',
                        display: 'flex',
                    }}>
                        {percentageSold}% VENDIDO
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
