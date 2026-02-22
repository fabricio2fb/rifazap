import React from 'react';
import { ImageResponse } from 'next/og';
import { createAdminClient } from '@/lib/supabase/server';
import { NextRequest } from 'next/server';

// export const runtime = 'edge';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const supabase = await createAdminClient();

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

        const totalNumbers = raffle.total_numbers || 1;
        const price = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(raffle.ticket_price || 0);
        const date = new Date(raffle.draw_date || Date.now()).toLocaleDateString('pt-BR');

        // Percentage sold
        const paidCount = Array.from(statusMap.values()).filter(s => s === 'pago').length;
        const percentageSold = Math.round((paidCount / totalNumbers) * 100);

        // Grid Calculation
        let cols = 10;
        if (totalNumbers > 100) cols = 20;
        if (totalNumbers > 500) cols = 25;

        const gap = 8;
        const innerWidth = 980 - 64; // 980 width - 32px padding per side
        const boxSize = Math.floor((innerWidth - (cols * gap)) / cols);
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
                        backgroundColor: '#f8f9fa',
                        padding: '60px 40px',
                        fontFamily: 'sans-serif',
                    }}
                >
                    {/* TOPO E TÍTULO */}
                    <div style={{ display: 'flex', fontSize: '56px', fontWeight: 'bold', color: '#000000', textAlign: 'center', marginBottom: '40px', maxWidth: '900px', lineHeight: 1.1 }}>
                        {raffle.title?.toUpperCase() || 'CAMPANHA'}
                    </div>

                    {/* CARDS (VALOR / SORTEIO) */}
                    <div style={{ display: 'flex', width: '920px', justifyContent: 'space-between', marginBottom: '50px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px 32px', width: '440px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fef3c7', borderRadius: '12px', width: '64px', height: '64px', marginRight: '24px' }}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                                    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                                    <path d="M4 22h16"></path>
                                    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                                    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                                    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                                </svg>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '18px', color: '#64748b', fontWeight: 'bold', marginBottom: '4px' }}>VALOR DA COTA</span>
                                <span style={{ fontSize: '32px', color: '#0f172a', fontWeight: 'bold' }}>{price}</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px 32px', width: '440px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fee2e2', borderRadius: '12px', width: '64px', height: '64px', marginRight: '24px' }}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '18px', color: '#64748b', fontWeight: 'bold', marginBottom: '4px' }}>SORTEIO DIA</span>
                                <span style={{ fontSize: '32px', color: '#0f172a', fontWeight: 'bold' }}>{date}</span>
                            </div>
                        </div>
                    </div>

                    {/* LEGENDA */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', marginBottom: '40px', fontSize: '24px', color: '#000000' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '24px', height: '24px', backgroundColor: '#22c55e', borderRadius: '12px' }} />
                            <span>Livre</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '24px', height: '24px', backgroundColor: '#f97316', borderRadius: '12px' }} />
                            <span>Reservado</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '24px', height: '24px', backgroundColor: '#cbd5e1', borderRadius: '12px' }} />
                            <span>Pago</span>
                        </div>
                    </div>

                    {/* PROGRESS BAR */}
                    <div style={{ display: 'flex', flexDirection: 'column', width: '920px', marginBottom: '40px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <span style={{ fontSize: '20px', color: '#64748b', fontWeight: 'bold' }}>PROGRESSO DA CAMPANHA</span>
                            <span style={{ fontSize: '20px', color: '#ea580c', fontWeight: 'bold' }}>{`${percentageSold}% VENDIDO`}</span>
                        </div>
                        <div style={{ display: 'flex', width: '100%', height: '16px', backgroundColor: '#e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                            <div style={{ display: 'flex', width: `${percentageSold}%`, height: '100%', backgroundColor: '#f97316' }} />
                        </div>
                    </div>

                    {/* GRADE CONTAINER AMARELO */}
                    <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#fcd34d', border: '6px solid #f59e0b', borderRadius: '24px', padding: '32px', width: '980px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                        <div
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                width: '100%',
                                justifyContent: 'center',
                                gap: `${gap}px`,
                            }}
                        >
                            {Array.from({ length: totalNumbers }, (_, i) => {
                                const num = i + 1;
                                const status = statusMap.get(num) || 'livre';

                                let bgColor = '#ffffff';
                                let txtColor = '#334155';

                                if (status === 'pago') {
                                    bgColor = '#cbd5e1';
                                } else if (status === 'reservado') {
                                    bgColor = '#f97316';
                                    txtColor = '#ffffff';
                                }

                                return (
                                    <div
                                        key={num}
                                        style={{
                                            width: `${boxSize}px`,
                                            height: `${boxSize}px`,
                                            backgroundColor: bgColor,
                                            color: txtColor,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: `${fontSize}px`,
                                            fontWeight: 'bold',
                                            borderRadius: '8px',
                                        }}
                                    >
                                        {`${num}`}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* RODAPÉ */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 'auto', paddingTop: '40px' }}>
                        <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#0f172a', marginBottom: '16px' }}>
                            PARTICIPE AGORA MESMO
                        </div>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#334155', marginBottom: '12px' }}>
                            {`SORTEIO DIA: ${date}`}
                        </div>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#64748b' }}>
                            COMPRA SEGURA • PAGAMENTO VIA SITE
                        </div>
                    </div>
                </div>
            ),
            {
                width: 1080,
                height: 1350,
            }
        );
    } catch (error: any) {
        console.error("Image generation caught error:", error);
        return new Response(JSON.stringify({ error: error.message || 'Erro interno na geração' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
