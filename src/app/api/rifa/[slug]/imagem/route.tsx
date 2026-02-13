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
            return new Response(JSON.stringify({ error: 'Rifa não encontrada' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // 2. Fetch Purchases/Participants
        const { data: purchases } = await supabase
            .from('purchases')
            .select('status, numbers')
            .eq('raffle_id', raffle.id);

        // 3. Status Mapping & Data Prep
        const totalNumbers = raffle.total_numbers;
        const price = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(raffle.ticket_price);

        const statusMap = new Map<number, string>();
        purchases?.forEach(p => {
            const isPaid = ['confirmed', 'paid', 'paid_delayed'].includes(p.status);
            const status = isPaid ? 'pago' : 'reservado';
            p.numbers.forEach((num: number) => {
                statusMap.set(num, status);
            });
        });

        const paidCount = Array.from(statusMap.values()).filter(s => s === 'pago').length;
        const percentageSold = Math.round((paidCount / totalNumbers) * 100);

        // 4. Grid Calculation (Resolution 800x1000)
        let cols = 10;
        if (totalNumbers > 100) cols = 20;
        if (totalNumbers > 500) cols = 25;

        const rows = [];
        const allNums = Array.from({ length: totalNumbers }, (_, i) => i + 1);
        for (let i = 0; i < totalNumbers; i += cols) {
            rows.push(allNums.slice(i, i + cols));
        }

        const gridWidth = 700;
        const boxSize = Math.floor((gridWidth - (cols * 6)) / cols);
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
                        backgroundColor: '#F8FAFC',
                        padding: '30px 40px',
                        position: 'relative',
                    }}
                >
                    {/* BACKGROUND PATTERN */}
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            alignItems: 'center',
                            opacity: 0.05,
                            pointerEvents: 'none',
                        }}
                    >
                        {Array.from({ length: 40 }).map((_, i) => (
                            <div key={i} style={{ fontSize: '60px', margin: '40px' }}>⚡</div>
                        ))}
                    </div>

                    {/* ICONE RAIO */}
                    <div style={{ display: 'flex', fontSize: '60px', marginBottom: '10px', position: 'relative' }}>⚡</div>

                    {/* TITULO */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px', position: 'relative' }}>
                        <div style={{ display: 'flex', fontSize: '64px', fontWeight: 'bold', color: '#000000', textAlign: 'center', lineHeight: '1' }}>
                            RIFA {raffle.title.toUpperCase()}
                        </div>
                        <div style={{ display: 'flex', fontSize: '24px', color: '#1A1A1A', marginTop: '10px' }}>
                            Valor de cada número: <span style={{ fontWeight: 'bold', marginLeft: '6px' }}>{price}</span>
                        </div>
                    </div>

                    {/* LEGENDA CIRCULAR */}
                    <div style={{ display: 'flex', marginBottom: '25px', fontSize: '24px', fontWeight: 'bold', position: 'relative' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginRight: '30px' }}>
                            <div style={{ width: '32px', height: '32px', backgroundColor: '#22C55E', borderRadius: '50%', marginRight: '10px' }}></div>
                            <span style={{ color: '#000000' }}>Livre</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginRight: '30px' }}>
                            <div style={{ width: '32px', height: '32px', backgroundColor: '#F97316', borderRadius: '50%', marginRight: '10px' }}></div>
                            <span style={{ color: '#000000' }}>Reservado</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ width: '32px', height: '32px', backgroundColor: '#CBD5E1', borderRadius: '50%', marginRight: '10px' }}></div>
                            <span style={{ color: '#000000' }}>Pago</span>
                        </div>
                    </div>

                    {/* BARRA DE PROGRESSO */}
                    <div style={{ display: 'flex', flexDirection: 'column', width: '600px', marginBottom: '25px', position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '14px', fontWeight: 'bold', color: '#64748B' }}>
                            <span>Progresso da Rifa</span>
                            <span>{percentageSold}% Vendido</span>
                        </div>
                        <div style={{ display: 'flex', width: '100%', height: '8px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ display: 'flex', width: `${percentageSold}%`, height: '100%', backgroundColor: '#F97316' }}></div>
                        </div>
                    </div>

                    {/* GRADE DE NUMEROS (CONTAINER AMARELO) */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '740px',
                            backgroundColor: '#FFDA5A',
                            borderRadius: '16px',
                            padding: '20px 10px',
                            alignItems: 'center',
                            marginBottom: '30px',
                            position: 'relative',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        {rows.map((row, rowIndex) => (
                            <div key={rowIndex} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                                {row.map((num) => {
                                    const status = statusMap.get(num) || 'livre';
                                    const bgColor = (status === 'pago') ? '#CBD5E1' : (status === 'reservado' ? '#F97316' : '#FFFFFF');
                                    const borderColor = (status === 'pago') ? '#94A3B8' : (status === 'reservado' ? '#EA580C' : '#D1D5DB');

                                    return (
                                        <div
                                            key={num}
                                            style={{
                                                width: `${boxSize}px`,
                                                height: `${boxSize}px`,
                                                backgroundColor: bgColor,
                                                color: '#000000',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: `${fontSize}px`,
                                                fontWeight: 'bold',
                                                borderRadius: '6px',
                                                margin: '3px',
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

                    {/* RODAPÉ */}
                    <div style={{ display: 'flex', marginTop: 'auto', marginBottom: '10px', position: 'relative' }}>
                        <div style={{ display: 'flex', fontSize: '36px', fontWeight: 'bold', color: '#000000', letterSpacing: '1px' }}>
                            PAGAMENTO VIA SITE
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
