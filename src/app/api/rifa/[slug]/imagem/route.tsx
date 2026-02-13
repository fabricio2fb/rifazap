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

        // 5. Grid Calculation (Resolution 800x1000)
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
        const fontSize = totalNumbers > 100 ? (totalNumbers > 500 ? 10 : 14) : 20;
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
                        backgroundColor: '#FFFFFF',
                        padding: '40px',
                    }}
                >
                    {/* TOPO */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '30px', backgroundColor: '#FFFFFF' }}>
                        <div style={{ display: 'flex', fontSize: '40px', fontWeight: 'bold', color: '#1A1A1A', textAlign: 'center', marginBottom: '5px', backgroundColor: '#FFFFFF' }}>
                            ⚡ RIFA DO {raffle.title.toUpperCase()}
                        </div>
                        <div style={{ display: 'flex', fontSize: '24px', color: '#666666', marginBottom: '5px', backgroundColor: '#FFFFFF' }}>
                            Cada número {price}
                        </div>
                        <div style={{ display: 'flex', fontSize: '20px', fontWeight: 'bold', color: '#EF4444', backgroundColor: '#FFFFFF' }}>
                            Sorteio {date}
                        </div>
                    </div>

                    {/* LEGENDA */}
                    <div style={{ display: 'flex', marginBottom: '30px', fontSize: '16px', fontWeight: '600', backgroundColor: '#FFFFFF' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px', backgroundColor: '#FFFFFF' }}>
                            <div style={{ width: '16px', height: '16px', backgroundColor: '#22C55E', borderRadius: '4px', marginRight: '6px', border: '1px solid #16a34a' }}></div>
                            <span style={{ color: '#000000' }}>Livre</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px', backgroundColor: '#FFFFFF' }}>
                            <div style={{ width: '16px', height: '16px', backgroundColor: '#EAB308', borderRadius: '4px', marginRight: '6px', border: '1px solid #ca8a04' }}></div>
                            <span style={{ color: '#000000' }}>Reservado</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
                            <div style={{ width: '16px', height: '16px', backgroundColor: '#94A3B8', borderRadius: '4px', marginRight: '6px', border: '1px solid #64748b' }}></div>
                            <span style={{ color: '#000000' }}>Pago</span>
                        </div>
                    </div>

                    {/* GRADE */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: `${gridWidth}px`,
                            alignItems: 'center',
                            marginBottom: '30px',
                            backgroundColor: '#FFFFFF',
                        }}
                    >
                        {rows.map((row, rowIndex) => (
                            <div key={rowIndex} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', backgroundColor: '#FFFFFF' }}>
                                {row.map((num) => {
                                    const status = statusMap.get(num) || 'livre';
                                    const bgColor = status === 'pago' ? '#94A3B8' : status === 'reservado' ? '#EAB308' : '#22C55E';
                                    const borderColor = status === 'pago' ? '#64748b' : status === 'reservado' ? '#ca8a04' : '#16a34a';

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
                                                borderRadius: '3px',
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

                    {/* RODAPÉ */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 'auto', backgroundColor: '#FFFFFF' }}>
                        <div style={{ display: 'flex', fontSize: '28px', fontWeight: 'bold', color: '#0052FF', marginBottom: '8px', backgroundColor: '#FFFFFF' }}>
                            rifazap.vercel.app
                        </div>
                        <div style={{
                            fontSize: '32px',
                            fontWeight: 'bold',
                            color: '#FFFFFF',
                            backgroundColor: '#1A1A1A',
                            padding: '8px 30px',
                            borderRadius: '40px',
                            display: 'flex',
                        }}>
                            {percentageSold}% VENDIDO
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
