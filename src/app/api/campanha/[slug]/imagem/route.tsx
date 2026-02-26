import React from 'react';
import { ImageResponse } from 'next/og';
import { createAdminClient } from '@/lib/supabase/server';
import { NextRequest } from 'next/server';

// ─── Tipos ────────────────────────────────────────────────────────────────────

type NumStatus = 'pago' | 'reservado' | 'livre';

type RaffleTheme =
    | 'mint'
    | 'gold'
    | 'pink'
    | 'solar'
    | 'nebula'
    | 'scrapbook'
    | 'calor'
    | 'juliana'
    | 'creme';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatBRL(value: number) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
}

function formatDate(d: string | null) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('pt-BR');
}

/**
 * Calcula quantas colunas e tamanho de célula usar baseado no total de números.
 * Retorna config para o grid de células (via flex wrap, pois ImageResponse não suporta CSS grid).
 */
function gridConfig(total: number, containerWidth: number) {
    let cols = 10;
    let gap = 8;

    if (total > 100 && total <= 200) { cols = 15; gap = 6; }
    else if (total > 200 && total <= 300) { cols = 20; gap = 6; }
    else if (total > 300 && total <= 500) { cols = 25; gap = 4; }
    else if (total > 500 && total <= 1000) { cols = 40; gap = 3; }
    else if (total > 1000) { cols = 50; gap = 2; }

    const padding = 32;
    const innerWidth = containerWidth - padding * 2;
    const totalGapW = (cols - 1) * gap;
    const boxSize = Math.floor((innerWidth - totalGapW) / cols);
    const fontSize = boxSize >= 40 ? 22 : boxSize >= 26 ? 16 : boxSize >= 18 ? 11 : 8;

    return { cols, gap, boxSize, fontSize, padding };
}

/** Renderiza a grade de números (flex-wrap, compatível com ImageResponse) */
function NumberGrid({
    total,
    statusMap,
    containerWidth,
    cellBg,
    cellBgReserved,
    cellBgPago,
    cellColor,
    cellColorReserved,
    cellColorPago,
    cellRadius = 8,
    containerBg,
    containerBorder,
    containerRadius = 20,
}: {
    total: number;
    statusMap: Map<number, NumStatus>;
    containerWidth: number;
    cellBg: string;
    cellBgReserved: string;
    cellBgPago: string;
    cellColor: string;
    cellColorReserved: string;
    cellColorPago: string;
    cellRadius?: number;
    containerBg: string;
    containerBorder: string;
    containerRadius?: number;
}) {
    const { gap, boxSize, fontSize, padding } = gridConfig(total, containerWidth);

    const cells = Array.from({ length: total }, (_, i) => {
        const num = i + 1;
        const status = statusMap.get(num) ?? 'livre';
        const bg =
            status === 'pago' ? cellBgPago :
                status === 'reservado' ? cellBgReserved :
                    cellBg;
        const color =
            status === 'pago' ? cellColorPago :
                status === 'reservado' ? cellColorReserved :
                    cellColor;

        return (
            <div
                key={num}
                style={{
                    width: boxSize,
                    height: boxSize,
                    backgroundColor: bg,
                    color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize,
                    fontWeight: 700,
                    borderRadius: cellRadius,
                    margin: gap / 2,
                    flexShrink: 0,
                }}
            >
                {String(num).padStart(total > 99 ? 3 : 2, '0')}
            </div>
        );
    });

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: containerBg,
                border: containerBorder,
                borderRadius: containerRadius,
                padding,
                width: containerWidth,
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    width: '100%',
                    justifyContent: 'center',
                    margin: -(gap / 2),
                }}
            >
                {cells}
            </div>
        </div>
    );
}

/** Barra de progresso reutilizável */
function ProgressBar({
    pct,
    trackBg,
    fillBg,
    labelColor,
    pctColor,
    width,
}: {
    pct: number;
    trackBg: string;
    fillBg: string;
    labelColor: string;
    pctColor: string;
    width: number;
}) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', width, marginBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 18, color: labelColor, fontWeight: 700 }}>PROGRESSO</span>
                <span style={{ fontSize: 18, color: pctColor, fontWeight: 800 }}>{pct}% VENDIDO</span>
            </div>
            <div style={{ display: 'flex', width: '100%', height: 14, backgroundColor: trackBg, borderRadius: 8, overflow: 'hidden' }}>
                <div style={{ display: 'flex', width: `${pct}%`, height: '100%', backgroundColor: fillBg }} />
            </div>
        </div>
    );
}

/** Legenda Livre / Reservado / Pago */
function Legend({
    livreColor,
    reservadoColor,
    pagoColor,
    textColor,
}: {
    livreColor: string;
    reservadoColor: string;
    pagoColor: string;
    textColor: string;
}) {
    const item = (bg: string, label: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 22, height: 22, backgroundColor: bg, borderRadius: 11 }} />
            <span style={{ fontSize: 22, color: textColor, fontWeight: 600 }}>{label}</span>
        </div>
    );
    return (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 44, marginBottom: 36 }}>
            {item(livreColor, 'Livre')}
            {item(reservadoColor, 'Reservado')}
            {item(pagoColor, 'Pago')}
        </div>
    );
}

// ─── TEMPLATES ────────────────────────────────────────────────────────────────

/**
 * MINT — fundo verde escuro, anel esmeralda, info em glassmorphism
 */
function TemplateMint({ raffle, statusMap, pct, total, price, date }: TemplateProps) {
    const W = 1080;
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: W, backgroundColor: '#041f16', padding: '56px 40px', fontFamily: 'sans-serif' }}>
            {/* Header */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 36 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#34d399', letterSpacing: 6, textTransform: 'uppercase', marginBottom: 10 }}>RIFA OFICIAL</span>
                <span style={{ fontSize: 62, fontWeight: 900, color: '#ffffff', letterSpacing: -1, textTransform: 'uppercase' }}>{raffle.title}</span>
            </div>

            {/* Imagem do produto + anel */}
            {raffle.image_url && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 220, height: 220, borderRadius: 110, background: 'conic-gradient(#34d399, #059669, #34d399)', padding: 6 }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={raffle.image_url} width={208} height={208} style={{ borderRadius: 104, objectFit: 'cover' }} alt="" />
                    </div>
                </div>
            )}

            {/* Info strip */}
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', backgroundColor: 'rgba(52,211,153,0.07)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 24, padding: '24px 40px', width: 920, marginBottom: 32 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ fontSize: 16, color: 'rgba(52,211,153,0.6)', fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6 }}>VALOR DA COTA</span>
                    <span style={{ fontSize: 44, color: '#34d399', fontWeight: 900 }}>{price}</span>
                </div>
                <div style={{ width: 1, height: 60, backgroundColor: 'rgba(52,211,153,0.2)' }} />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ fontSize: 16, color: 'rgba(52,211,153,0.6)', fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6 }}>SORTEIO</span>
                    <span style={{ fontSize: 44, color: '#34d399', fontWeight: 900 }}>{date}</span>
                </div>
            </div>

            <Legend livreColor="#34d399" reservadoColor="#f97316" pagoColor="#475569" textColor="rgba(187,247,208,0.8)" />
            <ProgressBar pct={pct} trackBg="rgba(255,255,255,0.07)" fillBg="#34d399" labelColor="rgba(167,243,208,0.6)" pctColor="#f97316" width={920} />

            <NumberGrid
                total={total} statusMap={statusMap} containerWidth={920}
                cellBg="rgba(255,255,255,0.05)" cellBgReserved="rgba(249,115,22,0.18)" cellBgPago="rgba(71,85,105,0.4)"
                cellColor="rgba(187,247,208,0.6)" cellColorReserved="#f97316" cellColorPago="rgba(148,163,184,0.5)"
                cellRadius={8}
                containerBg="rgba(52,211,153,0.04)" containerBorder="1px solid rgba(52,211,153,0.1)" containerRadius={20}
            />

            <div style={{ display: 'flex', marginTop: 32, fontSize: 16, color: 'rgba(52,211,153,0.25)', fontWeight: 800, letterSpacing: 6 }}>VERIFIED RAFFLE</div>
        </div>
    );
}

/**
 * GOLD — fundo preto absoluto, detalhes dourados, linha topo
 */
function TemplateGold({ raffle, statusMap, pct, total, price, date }: TemplateProps) {
    const W = 1080;
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: W, backgroundColor: '#050505', padding: '0 40px 56px', fontFamily: 'sans-serif' }}>
            {/* Linha dourada topo */}
            <div style={{ display: 'flex', width: '100%', height: 4, background: 'linear-gradient(90deg, transparent, #ca8a04, #fbbf24, #ca8a04, transparent)', marginBottom: 48 }} />

            <span style={{ fontSize: 64, fontWeight: 900, color: '#fbbf24', letterSpacing: -1, marginBottom: 40, fontStyle: 'italic' }}>{raffle.title}</span>

            {raffle.image_url && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 220, height: 220, borderRadius: 110, background: 'conic-gradient(#fbbf24, #92400e, #fbbf24)', padding: 6 }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={raffle.image_url} width={208} height={208} style={{ borderRadius: 104, objectFit: 'cover' }} alt="" />
                    </div>
                </div>
            )}

            {/* Info grid 2x2 */}
            <div style={{ display: 'flex', gap: 2, width: 920, marginBottom: 32, backgroundColor: 'rgba(202,138,4,0.15)', borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(202,138,4,0.2)' }}>
                {[
                    { label: 'COTA', value: price },
                    { label: 'SORTEIO', value: date },
                ].map(({ label, value }) => (
                    <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', padding: '24px 20px' }}>
                        <span style={{ fontSize: 15, color: 'rgba(202,138,4,0.6)', fontWeight: 800, letterSpacing: 3, marginBottom: 8 }}>{label}</span>
                        <span style={{ fontSize: 40, color: '#fbbf24', fontWeight: 900 }}>{value}</span>
                    </div>
                ))}
            </div>

            <Legend livreColor="#fbbf24" reservadoColor="#f97316" pagoColor="#475569" textColor="rgba(253,230,138,0.6)" />
            <ProgressBar pct={pct} trackBg="rgba(202,138,4,0.1)" fillBg="#fbbf24" labelColor="rgba(251,191,36,0.5)" pctColor="#fff" width={920} />

            <NumberGrid
                total={total} statusMap={statusMap} containerWidth={920}
                cellBg="rgba(255,255,255,0.03)" cellBgReserved="rgba(249,115,22,0.18)" cellBgPago="rgba(71,85,105,0.4)"
                cellColor="rgba(253,230,138,0.4)" cellColorReserved="#f97316" cellColorPago="rgba(148,163,184,0.4)"
                cellRadius={8}
                containerBg="rgba(202,138,4,0.03)" containerBorder="1px solid rgba(202,138,4,0.1)" containerRadius={20}
            />

            <div style={{ display: 'flex', marginTop: 32, fontSize: 16, color: 'rgba(202,138,4,0.3)', fontWeight: 800, letterSpacing: 6 }}>ELITE CIRCLE EDITION</div>
        </div>
    );
}

/**
 * PINK — fundo rosa pastel, tipografia serifada, ribbon vermelho
 */
function TemplatePink({ raffle, statusMap, pct, total, price, date }: TemplateProps) {
    const W = 1080;
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: W, backgroundColor: '#fff0f3', padding: '56px 40px', fontFamily: 'sans-serif' }}>
            <span style={{ fontSize: 100, fontWeight: 900, color: 'rgba(244,63,94,0.15)', letterSpacing: -2, lineHeight: 1, marginBottom: -20 }}>RIFA</span>
            <span style={{ fontSize: 52, fontWeight: 700, color: '#9f1239', fontStyle: 'italic', marginBottom: 32 }}>solidária</span>
            <span style={{ fontSize: 22, color: '#7a3040', fontWeight: 400, marginBottom: 36, textAlign: 'center' }}>{raffle.title}</span>

            {raffle.image_url && (
                <div style={{ display: 'flex', marginBottom: 32 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={raffle.image_url} width={200} height={200} style={{ borderRadius: 100, objectFit: 'cover', border: '6px solid #f43f5e' }} alt="" />
                </div>
            )}

            {/* Ribbon */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#e11d48', padding: '22px 48px', width: 1080, marginBottom: 32, marginLeft: -40, marginRight: -40 }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.75)', fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase' }}>🎁 PRÊMIO</span>
                    <span style={{ fontSize: 44, color: '#fff', fontWeight: 900 }}>{raffle.prize_description || price}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.75)', fontWeight: 800, letterSpacing: 2 }}>SORTEIO</span>
                    <span style={{ fontSize: 44, color: '#fff', fontWeight: 900 }}>{date}</span>
                </div>
            </div>

            <Legend livreColor="#e11d48" reservadoColor="#f97316" pagoColor="#fda4af" textColor="rgba(159,18,57,0.7)" />
            <ProgressBar pct={pct} trackBg="rgba(244,63,94,0.1)" fillBg="#e11d48" labelColor="rgba(159,18,57,0.6)" pctColor="#e11d48" width={920} />

            <NumberGrid
                total={total} statusMap={statusMap} containerWidth={920}
                cellBg="rgba(255,255,255,0.8)" cellBgReserved="rgba(249,115,22,0.12)" cellBgPago="#fda4af"
                cellColor="rgba(159,18,57,0.7)" cellColorReserved="#f97316" cellColorPago="#9f1239"
                cellRadius={100}
                containerBg="rgba(244,63,94,0.05)" containerBorder="1px solid rgba(244,63,94,0.12)" containerRadius={20}
            />
        </div>
    );
}

/**
 * SOLAR — fundo terracota escuro, anel fogo, gradiente laranja-amarelo
 */
function TemplateSolar({ raffle, statusMap, pct, total, price, date }: TemplateProps) {
    const W = 1080;
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: W, backgroundColor: '#3a0a02', padding: '56px 40px', fontFamily: 'sans-serif' }}>
            <span style={{ fontSize: 66, fontWeight: 900, color: '#fb923c', textTransform: 'uppercase', letterSpacing: -1, marginBottom: 36 }}>{raffle.title}</span>

            {raffle.image_url && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 220, height: 220, borderRadius: 110, background: 'conic-gradient(#fb923c, #ef4444, #fbbf24, #ef4444, #fb923c)', padding: 6 }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={raffle.image_url} width={208} height={208} style={{ borderRadius: 104, objectFit: 'cover' }} alt="" />
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(251,146,60,0.12)', borderRadius: 24, padding: '24px 40px', width: 920, marginBottom: 32 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ fontSize: 15, color: 'rgba(251,146,60,0.55)', fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6 }}>VALOR DA COTA</span>
                    <span style={{ fontSize: 44, color: '#fff', fontWeight: 900 }}>{price}</span>
                </div>
                <div style={{ width: 1, height: 60, backgroundColor: 'rgba(251,146,60,0.18)' }} />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ fontSize: 15, color: 'rgba(251,146,60,0.55)', fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6 }}>SORTEIO</span>
                    <span style={{ fontSize: 44, color: '#fff', fontWeight: 900 }}>{date}</span>
                </div>
            </div>

            <Legend livreColor="#fb923c" reservadoColor="#fbbf24" pagoColor="#475569" textColor="rgba(254,215,170,0.7)" />
            <ProgressBar pct={pct} trackBg="rgba(0,0,0,0.3)" fillBg="#fb923c" labelColor="rgba(251,146,60,0.6)" pctColor="#fbbf24" width={920} />

            <NumberGrid
                total={total} statusMap={statusMap} containerWidth={920}
                cellBg="rgba(255,255,255,0.04)" cellBgReserved="rgba(249,115,22,0.25)" cellBgPago="rgba(71,85,105,0.4)"
                cellColor="rgba(254,215,170,0.5)" cellColorReserved="#fbbf24" cellColorPago="rgba(148,163,184,0.4)"
                cellRadius={8}
                containerBg="rgba(251,146,60,0.04)" containerBorder="1px solid rgba(251,146,60,0.1)" containerRadius={20}
            />
        </div>
    );
}

/**
 * NEBULA — fundo roxo profundo, anel indigo-violeta
 */
function TemplateNebula({ raffle, statusMap, pct, total, price, date }: TemplateProps) {
    const W = 1080;
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: W, backgroundColor: '#10002b', padding: '56px 40px', fontFamily: 'sans-serif' }}>
            <span style={{ fontSize: 66, fontWeight: 900, color: '#818cf8', textTransform: 'uppercase', letterSpacing: -1, marginBottom: 36 }}>{raffle.title}</span>

            {raffle.image_url && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 220, height: 220, borderRadius: 110, background: 'conic-gradient(#818cf8, #4f46e5, #c084fc, #4f46e5, #818cf8)', padding: 6 }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={raffle.image_url} width={208} height={208} style={{ borderRadius: 104, objectFit: 'cover' }} alt="" />
                    </div>
                </div>
            )}

            {/* Info band roxa */}
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#4f46e5', borderRadius: 24, padding: '24px 40px', width: 920, marginBottom: 32 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ fontSize: 15, color: 'rgba(199,210,254,0.65)', fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6 }}>VALOR DA COTA</span>
                    <span style={{ fontSize: 44, color: '#fff', fontWeight: 900 }}>{price}</span>
                </div>
                <div style={{ width: 1, height: 60, backgroundColor: 'rgba(255,255,255,0.18)' }} />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ fontSize: 15, color: 'rgba(199,210,254,0.65)', fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6 }}>SORTEIO</span>
                    <span style={{ fontSize: 44, color: '#fff', fontWeight: 900 }}>{date}</span>
                </div>
            </div>

            <Legend livreColor="#818cf8" reservadoColor="#f97316" pagoColor="#475569" textColor="rgba(199,210,254,0.6)" />
            <ProgressBar pct={pct} trackBg="rgba(99,102,241,0.12)" fillBg="#818cf8" labelColor="rgba(165,180,252,0.5)" pctColor="#c084fc" width={920} />

            <NumberGrid
                total={total} statusMap={statusMap} containerWidth={920}
                cellBg="rgba(255,255,255,0.04)" cellBgReserved="rgba(249,115,22,0.2)" cellBgPago="rgba(71,85,105,0.4)"
                cellColor="rgba(165,180,252,0.4)" cellColorReserved="#f97316" cellColorPago="rgba(148,163,184,0.4)"
                cellRadius={6}
                containerBg="rgba(99,102,241,0.04)" containerBorder="1px solid rgba(99,102,241,0.12)" containerRadius={20}
            />

            <div style={{ display: 'flex', marginTop: 32, fontSize: 16, color: 'rgba(99,102,241,0.3)', fontWeight: 800, letterSpacing: 6 }}>
                {total} NÚMEROS DISPONÍVEIS
            </div>
        </div>
    );
}

/**
 * SCRAPBOOK — papel kraft, visual caderno/artesanal
 * Nota: sem fontes cursivas (ImageResponse não carrega Google Fonts por padrão).
 * Use fontFamily customizada via `fonts` no ImageResponse se quiser Dancing Script.
 */
function TemplateScrapbook({ raffle, statusMap, pct, total, price, date }: TemplateProps) {
    const W = 1080;
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: W, backgroundColor: '#fdf6e3', padding: '0 0 56px', fontFamily: 'serif', border: '8px solid #b5894a' }}>
            {/* Header verde rasgado */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-end', width: '100%', backgroundColor: '#2d5a3d', padding: '40px 48px 48px', marginBottom: 40, position: 'relative' }}>
                <span style={{ fontSize: 22, color: '#a8e6c0', fontWeight: 800, letterSpacing: 5, textTransform: 'uppercase', marginBottom: 6 }}>✦ RIFA SOLIDÁRIA ✦</span>
                <span style={{ fontSize: 72, color: '#fff', fontWeight: 900, lineHeight: 1 }}>{raffle.title}</span>
                {raffle.description && (
                    <span style={{ fontSize: 22, color: 'rgba(200,230,208,0.8)', marginTop: 10 }}>{raffle.description}</span>
                )}
                {/* Selo preço */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 40, right: 48, width: 120, height: 120, backgroundColor: '#c8860a', borderRadius: 60, border: '4px dashed rgba(255,255,255,0.4)' }}>
                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>cada nº</span>
                    <span style={{ fontSize: 28, color: '#fff', fontWeight: 900, lineHeight: 1 }}>{price}</span>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '0 48px' }}>
                {/* Status legend artesanal */}
                <div style={{ display: 'flex', gap: 32, marginBottom: 28, backgroundColor: 'rgba(255,255,255,0.7)', padding: '14px 32px', borderRadius: 16, border: '1px dashed #c8b89a' }}>
                    {[
                        { color: '#4a7c59', label: 'Livre' },
                        { color: '#e67e22', label: 'Reservado' },
                        { color: '#b0bec5', label: 'Pago' },
                    ].map(({ color, label }) => (
                        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 16, height: 16, backgroundColor: color, borderRadius: 8 }} />
                            <span style={{ fontSize: 20, color: '#4a3728', fontWeight: 700 }}>{label}</span>
                        </div>
                    ))}
                </div>

                {/* Progress */}
                <div style={{ display: 'flex', flexDirection: 'column', width: 984, marginBottom: 28 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: 16, color: '#4a3728', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2 }}>PROGRESSO</span>
                        <span style={{ fontSize: 16, color: '#c0392b', fontWeight: 800 }}>{pct}% vendido</span>
                    </div>
                    <div style={{ display: 'flex', width: '100%', height: 12, backgroundColor: '#e8d5b5', borderRadius: 20 }}>
                        <div style={{ display: 'flex', width: `${pct}%`, height: '100%', backgroundColor: '#4a7c59', borderRadius: 20 }} />
                    </div>
                </div>

                <NumberGrid
                    total={total} statusMap={statusMap} containerWidth={984}
                    cellBg="rgba(255,255,255,0.9)" cellBgReserved="#fdebd0" cellBgPago="#b0bec5"
                    cellColor="#6b5040" cellColorReserved="#d35400" cellColorPago="#37474f"
                    cellRadius={100}
                    containerBg="rgba(255,255,255,0.55)" containerBorder="2px dashed #c8b89a" containerRadius={16}
                />

                {/* Footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: 984, marginTop: 32, paddingTop: 20, borderTop: '2px dashed #c8b89a' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: 15, color: '#8a6a50', textTransform: 'uppercase', letterSpacing: 2, fontWeight: 700 }}>Chave Pix</span>
                        <span style={{ fontSize: 26, color: '#2d5a3d', fontWeight: 900 }}>{raffle.pix_key || '(11) 99999-0000'}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <span style={{ fontSize: 15, color: '#8a6a50', textTransform: 'uppercase', letterSpacing: 2, fontWeight: 700 }}>Sorteio</span>
                        <span style={{ fontSize: 36, color: '#3a2a1a', fontWeight: 900 }}>{date}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * CALOR — gradiente vibrante rosa/laranja, estilo stories BR
 */
function TemplateCalor({ raffle, statusMap, pct, total, price, date }: TemplateProps) {
    const W = 1080;
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: W, backgroundColor: '#0d001a', fontFamily: 'sans-serif', overflow: 'hidden' }}>
            {/* Hero gradiente */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-end', width: '100%', height: 280, background: 'linear-gradient(135deg, #ff0080, #ff4500, #ff8c00, #ffcc00)', padding: '0 48px 40px', position: 'relative' }}>
                {/* Padrão xadrez sutil */}
                <div style={{ position: 'absolute', inset: 0, opacity: 0.08, backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)', backgroundSize: '18px 18px' }} />
                <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
                    <span style={{ fontSize: 18, color: 'rgba(0,0,0,0.5)', fontWeight: 800, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 6 }}>🔥 CORRE QUE TÁ ACABANDO!</span>
                    <span style={{ fontSize: 72, color: '#fff', fontWeight: 900, lineHeight: 1, textShadow: '0 3px 12px rgba(0,0,0,0.35)' }}>{raffle.title}</span>
                    {raffle.subtitle && <span style={{ fontSize: 24, color: 'rgba(255,255,255,0.85)', marginTop: 8 }}>{raffle.subtitle}</span>}
                </div>
                {/* Badge preço */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 32, right: 48, width: 130, height: 130, backgroundColor: '#fff', borderRadius: 65, boxShadow: '0 8px 24px rgba(0,0,0,0.25)' }}>
                    <span style={{ fontSize: 14, color: '#ff4500', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>apenas</span>
                    <span style={{ fontSize: 32, color: '#1a0030', fontWeight: 900, lineHeight: 1 }}>{price}</span>
                    <span style={{ fontSize: 12, color: '#888', fontWeight: 700, textTransform: 'uppercase' }}>por número</span>
                </div>
            </div>

            {/* Corpo */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '40px 48px 56px', backgroundColor: '#0d001a' }}>
                {/* Prêmio strip */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,0,128,0.1)', border: '1px solid rgba(255,69,0,0.25)', borderRadius: 20, padding: '20px 32px', width: 984, marginBottom: 32 }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: 15, color: 'rgba(255,200,100,0.65)', fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 4 }}>🎁 PRÊMIO</span>
                        <span style={{ fontSize: 36, color: '#fff', fontWeight: 900 }}>{raffle.prize_description || raffle.title}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <span style={{ fontSize: 15, color: 'rgba(255,200,100,0.65)', fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 4 }}>SORTEIO</span>
                        <span style={{ fontSize: 36, color: '#fff', fontWeight: 900 }}>{date}</span>
                    </div>
                </div>

                <Legend livreColor="#ff0080" reservadoColor="#ffcc00" pagoColor="#4a5568" textColor="rgba(255,255,255,0.55)" />
                <ProgressBar pct={pct} trackBg="rgba(255,255,255,0.07)" fillBg="linear-gradient(90deg, #ff0080, #ffcc00)" labelColor="rgba(255,255,255,0.35)" pctColor="#ffcc00" width={984} />

                <NumberGrid
                    total={total} statusMap={statusMap} containerWidth={984}
                    cellBg="rgba(255,255,255,0.05)" cellBgReserved="rgba(255,204,0,0.18)" cellBgPago="rgba(74,85,104,0.45)"
                    cellColor="rgba(255,255,255,0.35)" cellColorReserved="#ffcc00" cellColorPago="rgba(255,255,255,0.4)"
                    cellRadius={7}
                    containerBg="rgba(255,0,128,0.03)" containerBorder="1px solid rgba(255,69,0,0.1)" containerRadius={20}
                />

                {/* Footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: 984, marginTop: 32, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '12px 24px' }}>
                        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>Pix</span>
                        <span style={{ fontSize: 26, color: '#ff4500', fontWeight: 800 }}>{raffle.pix_key || '(11) 99999-0000'}</span>
                    </div>
                    <span style={{ fontSize: 26, color: '#ffcc00', fontWeight: 900 }}>🎉 Sorteio: {date}</span>
                </div>
            </div>
        </div>
    );
}

/**
 * JULIANA — rosa pastel clean, estilo screenshot enviado
 */
function TemplateJuliana({ raffle, statusMap, pct, total, price, date }: TemplateProps) {
    const W = 1080;
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: W, backgroundColor: '#fce8e4', padding: '56px 48px', fontFamily: 'sans-serif' }}>
            {/* Título */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 40, textAlign: 'center' }}>
                <span style={{ fontSize: 88, fontWeight: 900, color: '#2d1b1b', lineHeight: 1, letterSpacing: -2 }}>RIFA</span>
                <span style={{ fontSize: 52, fontWeight: 700, color: '#c96a50', fontStyle: 'italic', marginTop: -8 }}>{raffle.organizer_name ? `da ${raffle.organizer_name}` : 'Solidária'}</span>
                <span style={{ fontSize: 24, color: '#7a5050', fontWeight: 400, marginTop: 12 }}>
                    {raffle.description || `Ajude comprando um número por ${price}!`}
                </span>
            </div>

            {raffle.image_url && (
                <div style={{ display: 'flex', marginBottom: 36 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={raffle.image_url} width={200} height={200} style={{ borderRadius: 100, objectFit: 'cover', border: '6px solid #f9c0b0' }} alt="" />
                </div>
            )}

            {/* Legend */}
            <div style={{ display: 'flex', gap: 32, marginBottom: 24, justifyContent: 'center' }}>
                {[
                    { color: '#4caf50', label: 'Livre' },
                    { color: '#f97316', label: 'Reservado' },
                    { color: '#c9c9c9', label: 'Pago' },
                ].map(({ color, label }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 18, height: 18, backgroundColor: color, borderRadius: 9 }} />
                        <span style={{ fontSize: 20, color: '#7a5050', fontWeight: 600 }}>{label}</span>
                    </div>
                ))}
            </div>

            {/* Progress */}
            <div style={{ display: 'flex', flexDirection: 'column', width: 984, marginBottom: 28 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 14, color: '#b07060', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2 }}>PREMIUM PROGRESS</span>
                    <span style={{ fontSize: 14, color: '#b07060', fontWeight: 800 }}>{pct}% VENDIDO</span>
                </div>
                <div style={{ display: 'flex', width: '100%', height: 8, backgroundColor: 'rgba(0,0,0,0.08)', borderRadius: 20 }}>
                    <div style={{ display: 'flex', width: `${pct}%`, height: '100%', backgroundColor: '#e86c4a', borderRadius: 20 }} />
                </div>
            </div>

            <NumberGrid
                total={total} statusMap={statusMap} containerWidth={984}
                cellBg="rgba(255,255,255,0.7)" cellBgReserved="rgba(249,115,22,0.12)" cellBgPago="#d8d8d8"
                cellColor="#6b4040" cellColorReserved="#f97316" cellColorPago="#888"
                cellRadius={100}
                containerBg="transparent" containerBorder="none" containerRadius={0}
            />

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: 984, marginTop: 32, paddingTop: 20, borderTop: '1.5px solid rgba(180,100,80,0.15)' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: 14, color: '#b07060', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2 }}>PRÊMIO</span>
                    <span style={{ fontSize: 40, color: '#e86c4a', fontWeight: 900, lineHeight: 1 }}>{raffle.prize_description || 'R$ 100,00'}</span>
                    <span style={{ fontSize: 18, color: '#e86c4a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>no banco</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span style={{ fontSize: 14, color: '#b07060', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2 }}>DATA DO SORTEIO</span>
                    <span style={{ fontSize: 36, color: '#2d1b1b', fontWeight: 900 }}>{date}</span>
                </div>
            </div>
        </div>
    );
}

/**
 * CREME — bege quente, coração decorativo, estilo screenshot enviado
 */
function TemplateCreme({ raffle, statusMap, pct, total, price, date }: TemplateProps) {
    const W = 1080;
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: W, backgroundColor: '#f5edd8', padding: '56px 48px', fontFamily: 'sans-serif' }}>
            {/* Header com coração */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', width: '100%', marginBottom: 36 }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: 88, fontWeight: 900, color: '#3a2a10', lineHeight: 1, letterSpacing: -2 }}>RIFA</span>
                    <span style={{ fontSize: 52, fontWeight: 700, color: '#c0823a', fontStyle: 'italic', marginTop: -8 }}>Solidária</span>
                    <span style={{ fontSize: 22, color: '#7a6040', fontWeight: 400, marginTop: 12, maxWidth: 700, lineHeight: 1.4 }}>
                        {raffle.description || 'Ajude nossa instituição e concorra a um prêmio de R$ 100,00.'}
                    </span>
                </div>
                {/* Coração decorativo */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 110, height: 110, backgroundColor: '#f5e6b0', borderRadius: 22, boxShadow: '0 4px 14px rgba(0,0,0,0.08)', flexShrink: 0, marginTop: 8, fontSize: 52 }}>
                    🤍
                </div>
            </div>

            {/* Badge preço */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#3a2a10', borderRadius: 50, padding: '18px 40px', marginBottom: 32 }}>
                <span style={{ fontSize: 22, color: '#f5edd8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 3 }}>
                    CADA NÚMERO VALE {price}
                </span>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: 32, marginBottom: 24, justifyContent: 'flex-start', width: '100%' }}>
                {[
                    { color: '#4caf50', label: 'Livre' },
                    { color: '#f97316', label: 'Reservado' },
                    { color: '#c9c9c9', label: 'Pago' },
                ].map(({ color, label }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 18, height: 18, backgroundColor: color, borderRadius: 9 }} />
                        <span style={{ fontSize: 20, color: '#7a6040', fontWeight: 600 }}>{label}</span>
                    </div>
                ))}
            </div>

            {/* Progress */}
            <div style={{ display: 'flex', flexDirection: 'column', width: 984, marginBottom: 28 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 14, color: '#a08050', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2 }}>PREMIUM PROGRESS</span>
                    <span style={{ fontSize: 14, color: '#a08050', fontWeight: 800 }}>{pct}% VENDIDO</span>
                </div>
                <div style={{ display: 'flex', width: '100%', height: 8, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 20 }}>
                    <div style={{ display: 'flex', width: `${pct}%`, height: '100%', backgroundColor: '#c0823a', borderRadius: 20 }} />
                </div>
            </div>

            <NumberGrid
                total={total} statusMap={statusMap} containerWidth={984}
                cellBg="rgba(255,255,255,0.6)" cellBgReserved="rgba(249,115,22,0.1)" cellBgPago="#d8d8d8"
                cellColor="#6b5030" cellColorReserved="#f97316" cellColorPago="#888"
                cellRadius={10}
                containerBg="transparent" containerBorder="none" containerRadius={0}
            />

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: 984, marginTop: 32, paddingTop: 20, borderTop: '1.5px solid rgba(160,120,60,0.18)' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: 14, color: '#a08050', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2 }}>DATA DO SORTEIO</span>
                    <span style={{ fontSize: 44, color: '#3a2a10', fontWeight: 900, lineHeight: 1 }}>{date}</span>
                </div>
                <span style={{ fontSize: 18, color: '#a08050', fontWeight: 400, maxWidth: 300, textAlign: 'right', lineHeight: 1.4 }}>
                    O sorteio acontecerá quando todos os números forem vendidos!
                </span>
            </div>
        </div>
    );
}

// ─── Mapa de temas ─────────────────────────────────────────────────────────────

type TemplateProps = {
    raffle: any;
    statusMap: Map<number, NumStatus>;
    pct: number;
    total: number;
    price: string;
    date: string;
};

const TEMPLATES: Record<RaffleTheme, (props: TemplateProps) => React.ReactElement> = {
    mint: TemplateMint,
    gold: TemplateGold,
    pink: TemplatePink,
    solar: TemplateSolar,
    nebula: TemplateNebula,
    scrapbook: TemplateScrapbook,
    calor: TemplateCalor,
    juliana: TemplateJuliana,
    creme: TemplateCreme,
};

const DEFAULT_THEME: RaffleTheme = 'juliana';

// ─── Altura da imagem por volume de números ────────────────────────────────────

function imageHeight(total: number): number {
    if (total <= 50) return 1200;
    if (total <= 100) return 1400;
    if (total <= 200) return 1600;
    if (total <= 300) return 1800;
    if (total <= 500) return 2200;
    return 2800; // 500-1000+
}

// ─── Route Handler ─────────────────────────────────────────────────────────────

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const { searchParams } = new URL(request.url);
        const theme = (searchParams.get('theme') as RaffleTheme) ?? DEFAULT_THEME;

        // Caso especial: 'demo' para gerar miniaturas de preview no painel
        if (slug === 'demo') {
            const raffle = {
                title: 'EXEMPLO DE RIFA PRO',
                description: 'Esta é uma rifa de demonstração para exibir o layout escolhido.',
                image_url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1080&auto=format&fit=crop',
                ticket_price: 1.5,
                total_numbers: 100,
                draw_date: new Date().toISOString(),
                pix_key: '(11) 99999-9999',
            };
            const statusMap = new Map<number, NumStatus>();
            for (let i = 1; i <= 65; i++) statusMap.set(i, 'pago');
            for (let i = 66; i <= 85; i++) statusMap.set(i, 'reservado');

            const total = raffle.total_numbers;
            const price = formatBRL(raffle.ticket_price);
            const date = formatDate(raffle.draw_date);
            const paidCount = 65;
            const pct = Math.round((paidCount / total) * 100);

            const renderFn = TEMPLATES[theme] ?? TEMPLATES[DEFAULT_THEME];
            const element = renderFn({ raffle, statusMap, pct, total, price, date });

            return new ImageResponse(element, { width: 1080, height: imageHeight(total) });
        }

        const supabase = await createAdminClient();

        // 1. Busca a rifa
        const { data: raffle, error: raffleError } = await supabase
            .from('raffles')
            .select('*')
            .eq('slug', slug)
            .single();

        if (raffleError || !raffle) {
            return new Response('Campanha não encontrada', { status: 404 });
        }

        const dbTheme = (searchParams.get('theme') as RaffleTheme) ?? raffle?.settings?.image_theme ?? DEFAULT_THEME;

        // 2. Busca participações
        const { data: purchases } = await supabase
            .from('purchases')
            .select('status, numbers')
            .eq('raffle_id', raffle.id);

        // 3. Monta statusMap
        const statusMap = new Map<number, NumStatus>();
        purchases?.forEach(p => {
            const s: NumStatus =
                p.status === 'confirmed' || p.status === 'paid' || p.status === 'paid_delayed'
                    ? 'pago'
                    : 'reservado';
            p.numbers.forEach((n: number) => statusMap.set(n, s));
        });

        // 4. Métricas
        const total = raffle.total_numbers || 1;
        const price = formatBRL(raffle.ticket_price || 0);
        const date = formatDate(raffle.draw_date);
        const paidCount = Array.from(statusMap.values()).filter(s => s === 'pago').length;
        const pct = Math.round((paidCount / total) * 100);

        // 5. Seleciona template
        const renderFn = TEMPLATES[dbTheme] ?? TEMPLATES[DEFAULT_THEME];
        const element = renderFn({ raffle, statusMap, pct, total, price, date });

        return new ImageResponse(element, {
            width: 1080,
            height: imageHeight(total),
        });

    } catch (error: any) {
        console.error('OG image error:', error);
        return new Response(
            JSON.stringify({ error: error.message ?? 'Erro interno' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
