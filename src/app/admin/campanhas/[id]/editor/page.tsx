"use client";

import { useState, useEffect, use } from "react";
import { ArrowLeft, Save, Loader2, Settings, Palette, Bell, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Calendar, Trophy, CheckCircle, Info, Ticket, Zap, AlertCircle, Clock, Shield } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { NumberGrid } from "@/components/campanha/NumberGrid";

function useCountdown(targetDate: string | undefined, enabled: boolean) {
    const [timeLeft, setTimeLeft] = useState<{ d: number, h: number, m: number, s: number } | null>(null);

    useEffect(() => {
        if (!enabled || !targetDate) {
            setTimeLeft(null);
            return;
        }

        const target = new Date(targetDate.includes('Z') ? targetDate : targetDate.replace(' ', 'T') + 'Z').getTime();

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const difference = target - now;

            if (difference <= 0) {
                clearInterval(interval);
                setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
            } else {
                setTimeLeft({
                    d: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    h: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    m: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                    s: Math.floor((difference % (1000 * 60)) / 1000)
                });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate, enabled]);

    return timeLeft;
}

// Live preview component
function LivePreview({ raffle, settings, mode }: { raffle: any, settings: any, mode: 'mobile' | 'desktop' }) {
    const timeLeft = useCountdown(raffle.draw_date, settings.countdown?.enabled);
    const totalNumbers = raffle.total_numbers || 100;
    const isDark = settings.theme === 'dark';
    const primaryColor = settings.primaryColor || '#2563eb';

    // Simulate some paid and reserved numbers for realistic preview
    const paidNumbers = [1, 5, 12];
    const reservedNumbers = [3, 8];
    const progressPercent = ((paidNumbers.length + reservedNumbers.length) / totalNumbers) * 100;
    return (
        <div
            className={`w-full h-full overflow-y-auto relative transition-colors duration-300 custom-scrollbar ${mode === 'mobile' ? 'border-[8px] border-slate-800 rounded-[2.5rem]' : 'rounded-xl'}`}
            style={{
                backgroundColor: settings.backgroundColor || (settings.theme === 'dark' ? '#0f172a' : '#ffffff'),
                color: settings.theme === 'dark' ? '#f8fafc' : '#0f172a'
            }}
        >
            {mode === 'mobile' && (
                <div className="absolute top-0 inset-x-0 h-6 bg-slate-800 rounded-t-2xl flex items-center justify-center z-30">
                    <div className="w-16 h-1.5 bg-slate-600 rounded-full"></div>
                </div>
            )}

            {settings.banner?.enabled && settings.banner.text && (
                <div
                    className={`w-full text-center py-2 px-4 shadow-sm relative z-20 ${mode === 'mobile' ? 'mt-6' : ''}`}
                    style={{ backgroundColor: settings.banner.color || '#ef4444', color: '#ffffff' }}
                >
                    <span className="font-bold text-[10px] md:text-xs uppercase tracking-widest">{settings.banner.text}</span>
                </div>
            )}

            {/* Countdown Header */}
            {settings.countdown?.enabled && timeLeft && (
                <div className={`w-full py-4 flex flex-col items-center justify-center z-10 border-b shadow-sm ${mode === 'mobile' && (!settings.banner?.enabled || !settings.banner?.text) ? 'mt-6' : ''} ${settings.theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-900 border-slate-200 text-white'}`}>
                    <span className="font-bold text-[10px] uppercase tracking-wider mb-2 opacity-90 flex items-center gap-1" style={{ color: settings.primaryColor }}>
                        <Clock className="w-4 h-4" /> Encerra em:
                    </span>
                    <div className="flex items-center justify-center gap-4 drop-shadow-md">
                        {[
                            { v: timeLeft.d, l: 'Dias' },
                            { v: timeLeft.h, l: 'Horas' },
                            { v: timeLeft.m, l: 'Min' },
                            { v: timeLeft.s, l: 'Seg' }
                        ].map((unit, i) => (
                            <div key={i} className="flex flex-col items-center">
                                <div className="text-2xl font-black tabular-nums leading-none">{unit.v.toString().padStart(2, '0')}</div>
                                <span className="text-[10px] uppercase font-bold opacity-70 mt-1">{unit.l}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {settings.countdown?.enabled && !timeLeft && (
                <div className={`w-full py-4 flex flex-col items-center justify-center z-10 border-b shadow-sm ${mode === 'mobile' && (!settings.banner?.enabled || !settings.banner?.text) ? 'mt-6' : ''} ${settings.theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-900 border-slate-200 text-white'}`}>
                    <span className="font-bold text-xs uppercase tracking-wider mb-1 opacity-90 flex items-center gap-1 text-red-500">
                        <Clock className="w-4 h-4" /> Sorteio Encerrado
                    </span>
                </div>
            )}

            <div className={`mx-auto ${mode === 'desktop' ? 'max-w-5xl py-8 px-8 grid grid-cols-2 gap-10 items-start' : 'max-w-md'}`}>
                {/* Left side on desktop, top on mobile */}
                <div className="flex flex-col space-y-6">
                    <div className={`${mode === 'desktop' ? 'rounded-2xl shadow-md border border-slate-200/50 dark:border-slate-800' : ''} relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center`}>
                        {raffle.image_url ? (
                            <Image src={raffle.image_url} alt="Capa" fill className="object-cover" />
                        ) : (
                            <span className="text-4xl text-slate-400">🖼️</span>
                        )}
                    </div>
                </div>

                {/* Right side on desktop, bottom on mobile */}
                <div className={`${mode === 'desktop' ? '' : 'p-6 pt-2'} space-y-6`}>
                    <div>
                        <h1 className="text-2xl font-bold leading-tight">{raffle.title || "Título da Campanha"}</h1>
                        <p className="opacity-70 mt-2 text-sm">{raffle.description || "Descrição da campanha..."}</p>
                    </div>

                    {settings.rules?.enabled && (
                        <div className="pt-2 pb-2">
                            <h3 className="font-bold mb-2 flex items-center gap-2 text-sm">
                                <AlertCircle className="w-4 h-4" style={{ color: settings.primaryColor }} /> Regras da Campanha
                            </h3>
                            <p className="text-xs opacity-70 whitespace-pre-wrap leading-relaxed p-4 rounded-xl border" style={{ backgroundColor: settings.theme === 'dark' ? '#1e293b' : '#f8fafc', borderColor: settings.theme === 'dark' ? '#334155' : '#e2e8f0' }}>
                                {settings.rules.content || "Nenhuma regra definida."}
                            </p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-3" style={{ backgroundColor: settings.theme === 'dark' ? '#1e293b' : '#f8fafc' }}>
                            <div className="p-2 rounded-lg text-white" style={{ backgroundColor: settings.primaryColor }}>
                                🏆
                            </div>
                            <div>
                                <p className="text-[10px] opacity-60 uppercase font-bold tracking-wider">Valor do Bilhete</p>
                                <p className="font-black text-lg">R$ {(raffle.ticket_price || 0).toFixed(2).replace('.', ',')}</p>
                            </div>
                        </div>
                        <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-3" style={{ backgroundColor: settings.theme === 'dark' ? '#1e293b' : '#f8fafc' }}>
                            <div className="p-2 rounded-lg text-white bg-green-500">
                                📅
                            </div>
                            <div>
                                <p className="text-[10px] opacity-60 uppercase font-bold tracking-wider">Data do Sorteio</p>
                                <p className="font-black text-sm">{raffle.draw_date ? new Date(raffle.draw_date).toLocaleDateString('pt-BR') : 'A definir'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="pointer-events-none opacity-90 grayscale-[0.2]">
                        <NumberGrid
                            totalNumbers={Math.min(100, totalNumbers)}
                            paidNumbers={paidNumbers}
                            reservedNumbers={reservedNumbers}
                            selectedNumbers={[]}
                            onNumberClick={() => { }}
                            primaryColor={primaryColor}
                        />
                    </div>

                    <Button className="w-full h-14 rounded-xl text-white font-bold text-lg tracking-wide uppercase shadow-lg shadow-orange-500/20" style={{ backgroundColor: settings.primaryColor }}>
                        Comprar Tickets
                    </Button>

                    {settings.bonusTiers && settings.bonusTiers.length > 0 && (
                        <div className={`p-5 rounded-2xl border-2 transition-all ${settings.theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'} mt-6`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-sm shrink-0 ${settings.theme === 'dark' ? 'bg-slate-700 text-slate-400' : 'bg-white border text-slate-400'}`}>
                                    🎁
                                </div>
                                <div>
                                    <h3 className="font-bold leading-tight">
                                        Bônus: {settings.bonusTiers[0]?.prizeName || 'Prêmios Extras'}
                                    </h3>
                                    <p className="text-xs mt-1 leading-snug opacity-70">
                                        {settings.bonusTiers[0]?.description || 'Compre mais tickets e destrave prêmios exclusivos.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {mode === 'mobile' && settings.rules?.enabled && (
                        <div className="pt-6 border-t border-slate-100 dark:border-slate-700 mt-6">
                            <h3 className="font-bold mb-3 flex items-center gap-2">
                                <span className="text-lg">📋</span> Regras da Campanha
                            </h3>
                            <p className="text-xs opacity-70 whitespace-pre-wrap leading-relaxed p-4 rounded-xl" style={{ backgroundColor: settings.theme === 'dark' ? '#1e293b' : '#f8fafc' }}>
                                {settings.rules.content || "Nenhuma regra definida."}
                            </p>
                        </div>
                    )}

                    {settings.badges?.verified && (
                        <div className="flex justify-center items-center gap-2 mt-8 text-green-600 bg-green-50 dark:bg-green-900/20 p-3 rounded-xl text-xs font-bold uppercase tracking-wider border border-green-100 dark:border-green-800/30">
                            <Shield className="w-4 h-4" /> Organizador Verificado
                        </div>
                    )}

                    {!settings.hideTicketonBranding && (
                        <div className="pt-8 pb-4 text-center space-y-4 opacity-50">
                            <div className="font-bold text-sm tracking-widest uppercase">TicketOn</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Urgency Popup Simulation */}
            {settings.urgencyPopup?.enabled && (
                <div className={`absolute top-4 left-1/2 -translate-x-1/2 z-40 bg-white rounded-xl shadow-2xl p-3 flex items-center gap-3 border border-slate-200 w-[90%] max-w-xs animate-in slide-in-from-top-4 ${mode === 'mobile' ? 'mt-4' : ''}`}>
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <span className="text-xl">🛍️</span>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-800">João (11 9***-9999)</p>
                        <p className="text-[10px] text-slate-500 font-medium">acabou de comprar 5 tickets!</p>
                    </div>
                </div>
            )}

            {settings.support?.enabled && (
                <div className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-xl text-2xl z-50">
                    <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                </div>
            )}
        </div>
    );
}

export default function RaffleEditorPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { toast } = useToast();

    const [activeTab, setActiveTab] = useState("design");
    const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');
    const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile');
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [raffle, setRaffle] = useState<any>({});

    const [settings, setSettings] = useState<any>({
        theme: 'light',
        primaryColor: '#ea580c',
        support: { enabled: false, whatsapp: '' },
        countdown: { enabled: false, targetDate: '' },
        badges: { verified: true },
        rules: { enabled: false, content: '' },
        hideTicketonBranding: false,
        packages: [], // { quantity: 10, discount: 10, active: true } (percentual)
        coupons: [] // { code: 'VIP', discount: 15, active: true } (percentual)
    });

    useEffect(() => {
        const fetchRaffle = async () => {
            try {
                const res = await fetch(`/api/admin/raffles/${id}`);
                const data = await res.json();
                if (data.raffle) {
                    setRaffle(data.raffle);
                    if (data.raffle.settings && Object.keys(data.raffle.settings).length > 0) {
                        setSettings({ ...settings, ...data.raffle.settings });
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchRaffle();
    }, [id]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch(`/api/admin/raffles/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ settings })
            });

            if (!res.ok) throw new Error("Erro ao salvar");

            toast({ title: "Salvo com sucesso!", description: "As configurações da sua rifa foram atualizadas na página pública." });
        } catch (error) {
            toast({ variant: "destructive", title: "Erro ao salvar", description: "Verifique sua conexão." });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;

    return (
        <div className="flex flex-col flex-1 h-full min-h-0 bg-[#fafaf7] dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 w-full overflow-hidden">
            {/* Header */}
            <div className="h-16 shrink-0 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between px-6 z-10 w-full shadow-sm">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="font-bold text-lg leading-none">Editor da Rifa</h1>
                        <p className="text-xs text-[#f97316] font-bold mt-1 max-w-[150px] md:max-w-xs truncate">{raffle.title || 'Carregando...'}</p>
                    </div>
                </div>
                <Button size="sm" className="bg-[#f97316] hover:bg-[#ea580c] text-white font-bold tracking-wide h-10 px-6 rounded-xl shadow-md" onClick={handleSave} disabled={saving}>
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    SALVAR ALTERAÇÕES
                </Button>
            </div>

            {/* Mobile Header Tabs */}
            <div className="md:hidden flex border-b dark:border-zinc-800 bg-white dark:bg-zinc-900 z-10">
                <button
                    onClick={() => setMobileTab('editor')}
                    className={`flex-1 py-3 font-bold text-sm ${mobileTab === 'editor' ? 'text-[#f97316] border-b-2 border-[#f97316]' : 'text-slate-500 dark:text-zinc-400'}`}
                >
                    Ferramentas
                </button>
                <button
                    onClick={() => setMobileTab('preview')}
                    className={`flex-1 py-3 font-bold text-sm ${mobileTab === 'preview' ? 'text-[#f97316] border-b-2 border-[#f97316]' : 'text-slate-500 dark:text-zinc-400'}`}
                >
                    Pré-visualização
                </button>
            </div>

            <div className="flex flex-col md:flex-row flex-1 min-h-0 overflow-hidden">
                {/* Editor Sidebar */}
                <aside className={`w-full md:w-[400px] flex-col bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800 shadow-sm z-20 shrink-0 ${mobileTab === 'editor' ? 'flex' : 'hidden md:flex'}`}>
                    <div className="grid grid-cols-2 p-4 border-b border-slate-100 dark:border-zinc-800 gap-2 shrink-0">
                        {[
                            { id: 'design', icon: Palette, label: 'Design' },
                            { id: 'avisos', icon: Bell, label: 'Avisos' },
                            { id: 'confianca', icon: Shield, label: 'Confiança' },
                            { id: 'conversao', icon: ShoppingBag, label: 'Vendas' },
                        ].map(t => (
                            <button
                                key={t.id}
                                onClick={() => setActiveTab(t.id)}
                                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-colors ${activeTab === t.id ? 'bg-orange-50 dark:bg-[#ea580c] text-[#f97316] dark:text-white' : 'text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800'}`}
                            >
                                <t.icon className="w-4 h-4" /> {t.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar pb-24">
                        {/* DESIGN TAB */}
                        {activeTab === 'design' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                                <div>
                                    <h3 className="font-bold text-lg mb-1 dark:text-zinc-100">Cores e Tema</h3>
                                    <p className="text-sm text-slate-500 dark:text-zinc-400 mb-4">Personalize a aparência da sua página.</p>

                                    <Label className="text-xs uppercase text-slate-400 font-bold mb-3 block tracking-wider">Tema Base</Label>
                                    <div className="grid grid-cols-2 gap-3 mb-6">
                                        <div onClick={() => setSettings({ ...settings, theme: 'light' })} className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${settings.theme === 'light' ? 'border-[#f97316] bg-orange-50/50 dark:bg-orange-950/20' : 'border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700'}`}>
                                            <span className="font-bold text-slate-800 dark:text-zinc-100">Claro</span>
                                        </div>
                                        <div onClick={() => setSettings({ ...settings, theme: 'dark' })} className={`p-4 rounded-xl border-2 cursor-pointer transition-all bg-slate-900 ${settings.theme === 'dark' ? 'border-[#f97316]' : 'border-slate-800 hover:border-slate-700'}`}>
                                            <span className="font-bold text-white">Escuro</span>
                                        </div>
                                    </div>

                                    <Label className="text-xs uppercase text-slate-400 font-bold mb-3 block tracking-wider">Cor de Fundo Opcional</Label>
                                    <div className="flex flex-wrap items-center gap-3 mb-8">
                                        <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-slate-300 shadow-sm shrink-0">
                                            <input
                                                type="color"
                                                value={settings.backgroundColor || (settings.theme === 'dark' ? '#0f172a' : '#ffffff')}
                                                onChange={(e) => setSettings({ ...settings, backgroundColor: e.target.value })}
                                                className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"
                                            />
                                        </div>
                                        <Input
                                            type="text"
                                            placeholder="#ffffff"
                                            value={settings.backgroundColor || ''}
                                            onChange={(e) => setSettings({ ...settings, backgroundColor: e.target.value })}
                                            className="w-28 h-10 uppercase font-mono text-sm font-bold bg-slate-50"
                                        />
                                        <span className="text-xs text-slate-400 ml-2 leading-tight">Deixe vazio para usar a cor<br />padrão do Tema Base.</span>
                                    </div>

                                    <Label className="text-xs uppercase text-slate-400 font-bold mb-3 block tracking-wider">Cor Primária (Botões e Destaques)</Label>
                                    <div className="flex flex-wrap gap-3 mb-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        {['#ea580c', '#2563eb', '#16a34a', '#dc2626', '#eab308', '#9333ea', '#db2777', '#0891b2', '#000000'].map(c => (
                                            <button
                                                key={c}
                                                onClick={() => setSettings({ ...settings, primaryColor: c })}
                                                className={`w-10 h-10 rounded-full cursor-pointer ring-offset-2 transition-all hover:scale-110 flex items-center justify-center ${settings.primaryColor === c ? 'ring-2 ring-slate-800 scale-110 shadow-md' : 'border border-black/10'}`}
                                                style={{ backgroundColor: c }}
                                            >
                                                {settings.primaryColor === c && <div className="w-3 h-3 bg-white rounded-full opacity-80" />}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="text-sm font-semibold text-slate-600">Ou digite o Hexadecimal:</span>
                                        <Input
                                            type="text"
                                            value={settings.primaryColor}
                                            onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                                            className="w-28 h-10 uppercase font-mono text-sm font-bold bg-slate-50"
                                        />
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 pt-8">
                                    <h3 className="font-bold text-lg mb-1">Branding TicketOn</h3>
                                    <p className="text-sm text-slate-500 mb-4">Remova nossa logo do rodapé para uma experiência mais Premium.</p>
                                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-sm">
                                        <span className="text-sm font-bold text-slate-700 dark:text-zinc-200">Ocultar marca "TicketOn"</span>
                                        <Switch checked={settings.hideTicketonBranding} onCheckedChange={(c) => setSettings({ ...settings, hideTicketonBranding: c })} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* AVISOS TAB */}
                        {activeTab === 'avisos' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                                <div>
                                    <h3 className="font-bold text-lg mb-1 flex items-center gap-2"><Bell className="w-5 h-5 text-[#f97316]" /> Contador Regressivo</h3>
                                    <p className="text-sm text-slate-500 mb-4">Crie senso de urgência mostrando o tempo exato e correndo até o sorteio.</p>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-sm">
                                            <span className="text-sm font-bold text-slate-700 dark:text-zinc-200">Ativar Contador de Urgência</span>
                                            <Switch checked={settings.countdown?.enabled} onCheckedChange={(c) => setSettings({ ...settings, countdown: { ...settings.countdown, enabled: c } })} />
                                        </div>
                                    </div>
                                </div>

                                {/* Banners de Notificação (Notificações Customizáveis) */}
                                <div className="space-y-4 pt-4 border-t border-slate-100">
                                    <h3 className="font-bold text-lg mb-1 flex items-center gap-2">📢 Banners Fixos</h3>
                                    <p className="text-sm text-slate-500">Mostre alertas no topo da página (Ex: Promoção relâmpago!).</p>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-sm">
                                            <span className="text-sm font-bold text-slate-700 dark:text-zinc-200">Ativar Banner Personalizado</span>
                                            <Switch checked={settings.banner?.enabled} onCheckedChange={(c) => setSettings({ ...settings, banner: { ...settings.banner, enabled: c } })} />
                                        </div>

                                        {settings.banner?.enabled && (
                                            <div className="space-y-3 p-5 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-sm bg-slate-50/50 dark:bg-zinc-900/30">
                                                <div className="space-y-2">
                                                    <Label className="font-bold dark:text-zinc-200">Texto do Banner</Label>
                                                    <Input placeholder="Ex: COMPRE 10 LEVE MAIS 2!" value={settings.banner?.text || ''} onChange={(e) => setSettings({ ...settings, banner: { ...settings.banner, text: e.target.value } })} className="bg-white dark:bg-zinc-950 dark:border-zinc-800" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="font-bold dark:text-zinc-200">Cor de Fundo do Banner</Label>
                                                    <div className="flex gap-2 items-center">
                                                        <input type="color" value={settings.banner?.color || '#ef4444'} onChange={(e) => setSettings({ ...settings, banner: { ...settings.banner, color: e.target.value } })} className="w-10 h-10 cursor-pointer rounded border dark:border-zinc-700" />
                                                        <span className="text-xs text-slate-500 dark:text-zinc-400 uppercase font-mono">{settings.banner?.color || '#ef4444'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Urgency Popups */}
                                <div className="space-y-4 pt-4 border-t border-slate-100">
                                    <h3 className="font-bold text-lg mb-1 flex items-center gap-2">🔥 Popups de Urgência</h3>
                                    <p className="text-sm text-slate-500">Popups dinâmicos simulando aprovações em tempo real.</p>

                                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-sm">
                                        <span className="text-sm font-bold text-slate-700 dark:text-zinc-200">Notificações de Compras</span>
                                        <Switch checked={settings.urgencyPopup?.enabled} onCheckedChange={(c) => setSettings({ ...settings, urgencyPopup: { ...settings.urgencyPopup, enabled: c } })} />
                                    </div>

                                    {settings.urgencyPopup?.enabled && (
                                        <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50 rounded-xl flex items-start gap-3">
                                            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                            <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
                                                Popups falsos do tipo "João (11 9***-9999) acabou de comprar 3 tickets" aparecerão aleatoriamente para os visitantes.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* CONFIANCA TAB */}
                        {activeTab === 'confianca' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                                <div>
                                    <h3 className="font-bold text-lg mb-1 flex items-center gap-2"><Shield className="w-5 h-5 text-[#f97316]" /> Botão de Suporte</h3>
                                    <p className="text-sm text-slate-500 mb-4">Adiciona um botão flutuante para os clientes tirarem dúvidas direto no seu Zap.</p>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-sm">
                                            <span className="text-sm font-bold text-slate-700 dark:text-zinc-200">Ativar Botão do WhatsApp</span>
                                            <Switch checked={settings.support?.enabled} onCheckedChange={(c) => setSettings({ ...settings, support: { ...settings.support, enabled: c } })} />
                                        </div>

                                        {settings.support?.enabled && (
                                            <div className="space-y-3 p-5 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-sm bg-slate-50/50 dark:bg-zinc-900/30">
                                                <div className="space-y-2">
                                                    <Label className="font-bold flex items-center gap-2 dark:text-zinc-200"><span className="text-green-500">📱</span> Número do seu WhatsApp</Label>
                                                    <Input placeholder="5511999999999" value={settings.support?.whatsapp || ''} onChange={(e) => setSettings({ ...settings, support: { ...settings.support, whatsapp: e.target.value } })} className="bg-white dark:bg-zinc-950 dark:border-zinc-800 h-11" />
                                                </div>
                                                <p className="text-[11px] text-slate-500 dark:text-zinc-500 leading-relaxed font-medium">Use código do país + DDD + Número. Ex: 55119XXXXXXXX</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 pt-8">
                                    <h3 className="font-bold text-lg mb-1 flex items-center gap-2">📋 Selo e Regras</h3>
                                    <p className="text-sm text-slate-500 mb-4">Deixe as regras claras para evitar problemas de transparência com seus compradores.</p>

                                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-sm mb-4">
                                        <span className="text-sm font-bold text-slate-700 dark:text-zinc-200">Mostrar bloco de regras</span>
                                        <Switch checked={settings.rules?.enabled} onCheckedChange={(c) => setSettings({ ...settings, rules: { ...settings.rules, enabled: c } })} />
                                    </div>

                                    {settings.rules?.enabled && (
                                        <div className="space-y-2">
                                            <Label className="font-bold dark:text-zinc-200">Texto das Regras</Label>
                                            <Textarea
                                                placeholder="Ex: O sorteio será realizado pela Loteria Federal do dia X. Pagamentos não confirmados em 15 minutos serão cancelados automaticamente..."
                                                className="min-h-[160px] bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 resize-none"
                                                value={settings.rules?.content || ''}
                                                onChange={(e) => setSettings({ ...settings, rules: { ...settings.rules, content: e.target.value } })}
                                                maxLength={1000}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* CONVERSAO TAB */}
                        {activeTab === 'conversao' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300 pb-12">

                                {/* Pacotes Promocionais */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-bold text-lg mb-1 flex items-center gap-2"><ShoppingBag className="w-5 h-5 text-[#f97316]" /> Pacotes Promocionais</h3>
                                            <p className="text-sm text-slate-500">Descontos automáticos por quantidade comprada.</p>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 space-y-4 shadow-sm">
                                        {(settings.packages || []).map((pkg: any, index: number) => (
                                            <div key={index} className="flex items-center gap-3 bg-white dark:bg-zinc-900 p-3 rounded-lg border border-slate-200 dark:border-zinc-700 shadow-sm relative">
                                                <div className="flex-1 space-y-1">
                                                    <Label className="text-[10px] uppercase font-bold text-slate-500 dark:text-zinc-400">Quantidade</Label>
                                                    <Input type="number" value={pkg.quantity} onChange={(e) => {
                                                        const newPkgs = [...settings.packages];
                                                        newPkgs[index].quantity = parseInt(e.target.value);
                                                        setSettings({ ...settings, packages: newPkgs });
                                                    }} className="h-9 font-bold dark:bg-zinc-950 dark:border-zinc-800" />
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <Label className="text-[10px] uppercase font-bold text-slate-500 dark:text-zinc-400">% Desconto</Label>
                                                    <Input type="number" value={pkg.discount} onChange={(e) => {
                                                        const newPkgs = [...settings.packages];
                                                        newPkgs[index].discount = parseFloat(e.target.value);
                                                        setSettings({ ...settings, packages: newPkgs });
                                                    }} className="h-9 font-bold text-green-600 dark:text-green-500 dark:bg-zinc-950 dark:border-zinc-800" />
                                                </div>
                                                <button onClick={() => {
                                                    const newPkgs = settings.packages.filter((_: any, i: number) => i !== index);
                                                    setSettings({ ...settings, packages: newPkgs });
                                                }} className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold shadow-sm hover:scale-110 transition-transform">
                                                    ✕
                                                </button>
                                            </div>
                                        ))}

                                        <Button
                                            variant="outline"
                                            className="w-full border-dashed border-2 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 font-bold dark:bg-transparent"
                                            onClick={() => setSettings({ ...settings, packages: [...(settings.packages || []), { quantity: 10, discount: 5, active: true }] })}
                                        >
                                            + Adicionar Pacote Promocional
                                        </Button>
                                    </div>
                                </div>

                                {/* Cupons de Desconto */}
                                <div className="space-y-4 pt-4 border-t border-slate-100">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-bold text-lg mb-1 flex items-center gap-2">🎟️ Cupons de Código</h3>
                                            <p className="text-sm text-slate-500">Ex: VIP10, MAEDOSAMUEL etc.</p>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 space-y-4 shadow-sm">
                                        {(settings.coupons || []).map((coupon: any, index: number) => (
                                            <div key={index} className="flex items-center gap-3 bg-white dark:bg-zinc-900 p-3 rounded-lg border border-slate-200 dark:border-zinc-700 shadow-sm relative">
                                                <div className="flex-[2] space-y-1">
                                                    <Label className="text-[10px] uppercase font-bold text-slate-500 dark:text-zinc-400">Código</Label>
                                                    <Input type="text" value={coupon.code} onChange={(e) => {
                                                        const newCoupons = [...settings.coupons];
                                                        newCoupons[index].code = e.target.value.toUpperCase();
                                                        setSettings({ ...settings, coupons: newCoupons });
                                                    }} className="h-9 font-bold uppercase dark:bg-zinc-950 dark:border-zinc-800" placeholder="EX: VIP10" />
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <Label className="text-[10px] uppercase font-bold text-slate-500 dark:text-zinc-400">% Desc.</Label>
                                                    <Input type="number" value={coupon.discount} onChange={(e) => {
                                                        const newCoupons = [...settings.coupons];
                                                        newCoupons[index].discount = parseFloat(e.target.value);
                                                        setSettings({ ...settings, coupons: newCoupons });
                                                    }} className="h-9 font-bold text-green-600 dark:text-green-500 dark:bg-zinc-950 dark:border-zinc-800" />
                                                </div>
                                                <button onClick={() => {
                                                    const newCoupons = settings.coupons.filter((_: any, i: number) => i !== index);
                                                    setSettings({ ...settings, coupons: newCoupons });
                                                }} className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold shadow-sm hover:scale-110 transition-transform">
                                                    ✕
                                                </button>
                                            </div>
                                        ))}

                                        <Button
                                            variant="outline"
                                            className="w-full border-dashed border-2 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 font-bold dark:bg-transparent"
                                            onClick={() => setSettings({ ...settings, coupons: [...(settings.coupons || []), { code: '', discount: 10, active: true }] })}
                                        >
                                            + Adicionar Cupom
                                        </Button>
                                    </div>
                                </div>

                                {/* Bônus Garantido / Premiação por Quantidade */}
                                <div className="space-y-4 pt-4 border-t border-slate-100">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-bold text-lg mb-1 flex items-center gap-2">🎁 Bônus Garantido</h3>
                                            <p className="text-sm text-slate-500">Prêmios extras ao alcançar quantidades de tickets.</p>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 space-y-4 shadow-sm">
                                        {(settings.bonusTiers || []).map((bonus: any, index: number) => (
                                            <div key={index} className="flex flex-col gap-3 bg-white dark:bg-zinc-900 p-4 rounded-lg border border-slate-200 dark:border-zinc-700 shadow-sm relative">
                                                <div className="flex gap-3">
                                                    <div className="w-24 space-y-1">
                                                        <Label className="text-[10px] uppercase font-bold text-slate-500 dark:text-zinc-400">Qtd. Tickets</Label>
                                                        <Input type="number" value={bonus.targetTickets} onChange={(e) => {
                                                            const newBonus = [...settings.bonusTiers];
                                                            newBonus[index].targetTickets = parseInt(e.target.value);
                                                            setSettings({ ...settings, bonusTiers: newBonus });
                                                        }} className="h-9 font-bold text-[#f97316] dark:bg-zinc-950 dark:border-zinc-800" placeholder="Ex: 5" />
                                                    </div>
                                                    <div className="flex-1 space-y-1">
                                                        <Label className="text-[10px] uppercase font-bold text-slate-500 dark:text-zinc-400">Nome do Brinde</Label>
                                                        <Input type="text" value={bonus.prizeName} onChange={(e) => {
                                                            const newBonus = [...settings.bonusTiers];
                                                            newBonus[index].prizeName = e.target.value;
                                                            setSettings({ ...settings, bonusTiers: newBonus });
                                                        }} className="h-9 font-bold dark:bg-zinc-950 dark:border-zinc-800" placeholder="Ex: Fone de Ouvido" />
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-[10px] uppercase font-bold text-slate-500 dark:text-zinc-400">Descrição do Prêmio</Label>
                                                    <Input type="text" value={bonus.description} onChange={(e) => {
                                                        const newBonus = [...settings.bonusTiers];
                                                        newBonus[index].description = e.target.value;
                                                        setSettings({ ...settings, bonusTiers: newBonus });
                                                    }} className="h-9 text-xs dark:bg-zinc-950 dark:border-zinc-800" placeholder="Ex: Um fone Bluetooth exclusivo na cor preta." />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-[10px] uppercase font-bold text-slate-500 dark:text-zinc-400">Link do Prêmio (Opcional)</Label>
                                                    <Input type="url" value={bonus.prizeUrl || ''} onChange={(e) => {
                                                        const newBonus = [...settings.bonusTiers];
                                                        newBonus[index].prizeUrl = e.target.value;
                                                        setSettings({ ...settings, bonusTiers: newBonus });
                                                    }} className="h-9 text-xs dark:bg-zinc-950 dark:border-zinc-800" placeholder="Ex: https://linkdoebook.com/baixar" />
                                                </div>
                                                <button onClick={() => {
                                                    const newBonus = settings.bonusTiers.filter((_: any, i: number) => i !== index);
                                                    setSettings({ ...settings, bonusTiers: newBonus });
                                                }} className="absolute top-2 right-2 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold shadow-sm hover:scale-110 transition-transform">
                                                    ✕
                                                </button>
                                            </div>
                                        ))}

                                        <Button
                                            variant="outline"
                                            className="w-full border-dashed border-2 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 font-bold text-[#f97316] dark:bg-transparent"
                                            onClick={() => setSettings({ ...settings, bonusTiers: [...(settings.bonusTiers || []), { targetTickets: 10, prizeName: '', description: '', active: true }] })}
                                        >
                                            + Nova Faixa de Bônus
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </aside>

                {/* Live Preview Area */}
                <main className={`flex-1 bg-[#e2e8f0] dark:bg-zinc-950 md:bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] md:dark:bg-[radial-gradient(theme(colors.zinc.800)_1px,transparent_1px)] [background-size:16px_16px] flex flex-col items-center justify-center p-0 md:p-8 overflow-hidden relative ${mobileTab === 'preview' ? 'flex' : 'hidden md:flex'}`}>

                    {/* View Controls */}
                    <div className="absolute top-4 md:top-6 left-1/2 -translate-x-1/2 flex items-center bg-white/90 dark:bg-zinc-900/90 backdrop-blur rounded-full shadow-sm border border-slate-200 dark:border-zinc-800 p-1 z-10 transition-transform hover:scale-105">
                        <button
                            onClick={() => setPreviewMode('mobile')}
                            className={`px-5 py-2 rounded-full text-xs font-bold transition-colors ${previewMode === 'mobile' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-zinc-800'}`}
                        >
                            📱 Celular
                        </button>
                        <button
                            onClick={() => setPreviewMode('desktop')}
                            className={`px-5 py-2 rounded-full text-xs font-bold transition-colors ${previewMode === 'desktop' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-zinc-800'}`}
                        >
                            💻 Computador
                        </button>
                    </div>

                    {/* Device Simulator */}
                    <div className={`transition-all duration-500 ease-in-out origin-center bg-white dark:bg-zinc-950 overflow-auto md:overflow-hidden md:shadow-2xl flex-shrink-0
                        ${previewMode === 'mobile'
                            ? 'w-full h-full rounded-none scale-100 md:w-[390px] md:h-[844px] md:rounded-[3rem] md:ring-[14px] md:ring-slate-900 md:dark:ring-zinc-800 md:scale-[0.75] lg:scale-[0.80] xl:scale-[0.85]'
                            : 'w-full h-full rounded-none scale-100 md:w-[90%] md:h-[85%] md:rounded-2xl md:ring-1 md:ring-slate-300 md:dark:ring-zinc-800 md:scale-100 md:max-w-5xl md:mt-8'
                        }
                    `}>
                        <LivePreview raffle={raffle} settings={settings} mode={previewMode} />
                    </div>
                </main>
            </div>
        </div>
    );
}
