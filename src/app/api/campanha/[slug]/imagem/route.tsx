import { ImageResponse } from 'next/og';
import { createClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;

        // Use a direct client to avoid cookie issues in image generation
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        // 1. Fetch Raffle Data
        const { data: raffle, error: raffleError } = await supabase
            .from('raffles')
            .select('*')
            .eq('slug', slug)
            .single();

        if (raffleError || !raffle) {
            return new Response(JSON.stringify({ error: 'Campanha não encontrada' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // 2. Fetch Purchases/Participants
        const { data: purchases } = await supabase
            .from('purchases')
            .select('status, numbers')
            .eq('raffle_id', raffle.id);

        // 3. Status Mapping & Data Prep (ALIGNED WITH RaffleView.tsx)
        const totalNumbers = raffle.total_numbers;
        const price = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(raffle.ticket_price);

        // Use exactly the same filtering as the site
        const statusMap = new Map<number, 'pago' | 'reservado' | 'livre'>();
        purchases?.forEach(p => {
            let status: 'pago' | 'reservado' | null = null;
            if (['confirmed', 'paid', 'paid_delayed'].includes(p.status)) {
                status = 'pago';
            } else if (['pending', 'waiting_payment'].includes(p.status)) {
                status = 'reservado';
            }

            if (status) {
                p.numbers.forEach((num: number) => {
                    statusMap.set(num, status);
                });
            }
        });

        const paidCount = Array.from(statusMap.values()).filter(s => s === 'pago').length;
        const reservedCount = Array.from(statusMap.values()).filter(s => s === 'reservado').length;
        // PERCENTAGE INCLUDES BOTH PAID AND RESERVED (TO MATCH SITE)
        const percentageSold = Math.round(((paidCount + reservedCount) / totalNumbers) * 100);

        // Format draw date
        const drawDateFormatted = new Date(raffle.draw_date).toLocaleDateString('pt-BR', {
            timeZone: 'America/Sao_Paulo'
        });

        // 4. Grid Calculation
        let cols = 10;
        if (totalNumbers > 100) cols = 20;
        if (totalNumbers > 500) cols = 25;

        const rows = [];
        const allNums = Array.from({ length: totalNumbers }, (_, i) => i + 1);
        for (let i = 0; i < totalNumbers; i += cols) {
            rows.push(allNums.slice(i, i + cols));
        }

        const gridWidth = 720;
        const boxSize = Math.floor((gridWidth - (cols * 4)) / cols);
        const fontSize = totalNumbers > 100 ? (totalNumbers > 500 ? 10 : 12) : 18;
        const showNumbers = totalNumbers <= 500;

        const response = new ImageResponse(
            (
                <div
                    style={{
                        height: '1000px',
                        width: '800px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        backgroundColor: '#F3F4F6',
                        padding: '40px 40px',
                        position: 'relative',
                        fontFamily: 'sans-serif',
                    }}
                >
                    {/* BACKGROUND PATTERN - BOLDER */}
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '800px',
                            height: '1000px',
                            display: 'flex',
                            flexWrap: 'wrap',
                            opacity: 0.15,
                            pointerEvents: 'none',
                        }}
                    >
                        {Array.from({ length: 48 }).map((_, i) => (
                            <div key={i} style={{ width: '100px', height: '125px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '60px' }}>⚡</div>
                        ))}
                    </div>

                    {/* HEADER - REMOVED TOP BOLT AS REQUESTED */}
                    <div style={{ display: 'flex', fontSize: '64px', fontWeight: '900', color: '#000000', textAlign: 'center', lineHeight: '1.2', textTransform: 'uppercase', marginBottom: '20px', marginTop: '20px' }}>
                        {raffle.title}
                    </div>

                    {/* STATS BOXES */}
                    <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', gap: '20px', marginBottom: '30px' }}>
                        <div style={{ display: 'flex', flex: 1, backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '15px 20px', border: '1px solid #E5E7EB', alignItems: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                            <div style={{ display: 'flex', fontSize: '32px', marginRight: '15px' }}>🏆</div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '1px' }}>Valor do Ticket</span>
                                <span style={{ fontSize: '24px', fontWeight: '900', color: '#111827' }}>{price}</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flex: 1, backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '15px 20px', border: '1px solid #E5E7EB', alignItems: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                            <div style={{ display: 'flex', fontSize: '32px', marginRight: '15px' }}>📅</div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '1px' }}>Resultado</span>
                                <span style={{ fontSize: '24px', fontWeight: '900', color: '#111827' }}>{drawDateFormatted}</span>
                            </div>
                        </div>
                    </div>

                    {/* LEGENDA */}
                    <div style={{ display: 'flex', marginBottom: '25px', gap: '40px', fontSize: '22px', fontWeight: 'bold' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ width: '28px', height: '28px', backgroundColor: '#22C55E', borderRadius: '50%', marginRight: '10px' }}></div>
                            <span>Livre</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ width: '28px', height: '28px', backgroundColor: '#F97316', borderRadius: '50%', marginRight: '10px' }}></div>
                            <span>Reservado</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ width: '28px', height: '28px', backgroundColor: '#CBD5E1', borderRadius: '50%', marginRight: '10px' }}></div>
                            <span>Pago</span>
                        </div>
                    </div>

                    {/* PROGRESS BAR */}
                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', marginBottom: '30px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '18px', fontWeight: '900', color: '#374151' }}>
                            <span style={{ letterSpacing: '1px' }}>PROGRESSO DA CAMPANHA</span>
                            <span style={{ color: '#F97316' }}>{percentageSold}% VENDIDO</span>
                        </div>
                        <div style={{ display: 'flex', width: '100%', height: '16px', backgroundColor: '#E5E7EB', borderRadius: '8px', overflow: 'hidden', border: '1px solid #D1D5DB' }}>
                            <div style={{ display: 'flex', width: `${percentageSold}%`, height: '100%', backgroundColor: '#F97316' }}></div>
                        </div>
                    </div>

                    {/* NUMBER GRID */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '760px',
                            backgroundColor: '#FCD34D',
                            borderRadius: '24px',
                            padding: '24px 12px',
                            alignItems: 'center',
                            marginBottom: '40px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
                            border: '4px solid #F59E0B',
                        }}
                    >
                        {rows.map((row, rowIndex) => (
                            <div key={rowIndex} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                                {row.map((num) => {
                                    const status = statusMap.get(num) || 'livre';
                                    const bgColor = (status === 'pago') ? '#CBD5E1' : (status === 'reservado' ? '#F97316' : '#FFFFFF');
                                    const borderColor = (status === 'pago') ? '#94A3B8' : (status === 'reservado' ? '#EA580C' : '#E5E7EB');
                                    const textColor = (status === 'reservado') ? '#FFFFFF' : '#1F2937';

                                    return (
                                        <div
                                            key={num}
                                            style={{
                                                width: `${boxSize}px`,
                                                height: `${boxSize}px`,
                                                backgroundColor: bgColor,
                                                color: textColor,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: `${fontSize}px`,
                                                fontWeight: 'bold',
                                                borderRadius: '8px',
                                                margin: '2px',
                                                border: `1px solid ${borderColor}`,
                                            }}
                                        >
                                            {showNumbers ? num : ''}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>

                    {/* FOOTER - ADDED MORE DETAILS */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 'auto' }}>
                        <div style={{ display: 'flex', fontSize: '32px', fontWeight: '900', color: '#111827', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '5px' }}>
                            PARTICIPE AGORA MESMO
                        </div>
                        <div style={{ display: 'flex', fontSize: '20px', fontWeight: 'bold', color: '#1A1A1A', marginBottom: '8px' }}>
                            RESULTADO: {drawDateFormatted}
                        </div>
                        <div style={{ display: 'flex', fontSize: '16px', fontWeight: 'bold', color: '#4B5563' }}>
                            COMPRA SEGURA • PAGAMENTO VIA SITE
                        </div>
                    </div>
                </div>
            ),
            {
                width: 800,
                height: 1000,
            }
        );

        // Set headers separately
        response.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate');
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
    } catch (error) {
        console.error('Error generating image:', error);
        return new Response(JSON.stringify({
            error: 'Erro no servidor ao gerar imagem',
            details: error instanceof Error ? error.message : String(error)
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
