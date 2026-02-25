"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { NumberGrid } from "@/components/campanha/NumberGrid";
import { CheckoutModal } from "@/components/campanha/CheckoutModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Calendar, Trophy, CheckCircle, Info, Ticket, Zap, AlertCircle, Clock, Shield } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";

import { MyNumbersModal } from "@/components/campanha/MyNumbersModal";

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

export default function RaffleView({ initialRaffle, initialParticipants }: { initialRaffle: any, initialParticipants: any[] }) {
    const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isMyNumbersOpen, setIsMyNumbersOpen] = useState(false);
    const [participants, setParticipants] = useState<any[]>(initialParticipants);
    const supabase = createClient();
    const { toast } = useToast();

    const settings = initialRaffle.settings || {};
    const primaryColor = settings.primaryColor || '#2563eb'; // fallback default blue
    const isDark = settings.theme === 'dark';

    // Urgency Popup Logic
    const [showUrgencyPopup, setShowUrgencyPopup] = useState(false);
    const [urgencyData, setUrgencyData] = useState({ name: '', phone: '', quantity: 0 });

    useEffect(() => {
        if (!settings.urgencyPopup?.enabled) return;

        const firstNames = ['João', 'Maria', 'Pedro', 'Ana', 'Lucas', 'Carlos', 'José', 'Marcos', 'Fernanda', 'Rafael', 'André', 'Carla'];
        const phonePrefixes = ['11', '21', '31', '41', '51', '81', '85', '71', '62'];

        let timeoutId: NodeJS.Timeout;
        const showPopup = () => {
            const name = firstNames[Math.floor(Math.random() * firstNames.length)];
            const ddd = phonePrefixes[Math.floor(Math.random() * phonePrefixes.length)];
            const qty = Math.floor(Math.random() * 8) + 2;

            setUrgencyData({ name, phone: `(${ddd}) 9***-9999`, quantity: qty });
            setShowUrgencyPopup(true);

            setTimeout(() => setShowUrgencyPopup(false), 5000);

            const nextTime = Math.floor(Math.random() * (45000 - 15000 + 1) + 15000);
            timeoutId = setTimeout(showPopup, nextTime);
        };

        timeoutId = setTimeout(showPopup, 8000);
        return () => clearTimeout(timeoutId);
    }, [settings.urgencyPopup?.enabled]);

    const timeLeft = useCountdown(initialRaffle.drawDate, settings.countdown?.enabled);

    useEffect(() => {
        const channel = supabase
            .channel(`raffle-${initialRaffle.id}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'purchases',
                    filter: `raffle_id=eq.${initialRaffle.id}`
                },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        const newParticipant = {
                            raffleId: payload.new.raffle_id,
                            status: payload.new.status,
                            selectedNumbers: payload.new.numbers
                        };
                        setParticipants(prev => [...prev, newParticipant]);

                        toast({
                            title: "Nova reserva!",
                            description: "Alguém acabou de reservar tickets nesta campanha.",
                        });
                    } else if (payload.eventType === 'UPDATE') {
                        setParticipants(prev => prev.map(p => {
                            const isMatch = JSON.stringify(p.selectedNumbers) === JSON.stringify(payload.old?.numbers || payload.new.numbers);
                            if (isMatch) {
                                return {
                                    ...p,
                                    status: payload.new.status,
                                    selectedNumbers: payload.new.numbers
                                };
                            }
                            return p;
                        }));
                    } else if (payload.eventType === 'DELETE') {
                        setParticipants(prev => prev.filter(p =>
                            JSON.stringify(p.selectedNumbers) !== JSON.stringify(payload.old.numbers)
                        ));
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [initialRaffle.id, supabase, toast]);

    const paidNumbers = useMemo(() =>
        participants
            .filter(p => ['confirmed', 'paid', 'paid_delayed'].includes(p.status))
            .flatMap(p => p.selectedNumbers) || [],
        [participants]);

    const reservedNumbers = useMemo(() =>
        participants
            .filter(p => ['pending', 'waiting_payment'].includes(p.status))
            .flatMap(p => p.selectedNumbers) || [],
        [participants]);

    const soldNumbersSet = useMemo(() => {
        const set = new Set<number>();
        participants.forEach(p => {
            if (['confirmed', 'paid', 'paid_delayed', 'pending', 'waiting_payment'].includes(p.status)) {
                p.selectedNumbers.forEach((n: number) => set.add(n));
            }
        });
        return set;
    }, [participants]);

    const totalSold = soldNumbersSet.size;
    const progressPercent = (totalSold / initialRaffle.totalNumbers) * 100;

    const handleNumberClick = (num: number) => {
        setSelectedNumbers(prev =>
            prev.includes(num) ? prev.filter(n => n !== num) : [...prev, num]
        );
    };

    const shareOnWhatsApp = () => {
        const url = `https://ticketon.com.br/campanha/${initialRaffle.slug}`;
        const price = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(initialRaffle.pricePerNumber);
        const date = new Date(initialRaffle.drawDate).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });

        const text = `🎟️ CAMPANHA ATIVA\n\nPrêmio: ${initialRaffle.title}\nValor do ticket: ${price}\nResultado: ${date}\n\n👉 Garanta o seu ticket:\n${url}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    const shareWithImage = async () => {
        toast({ title: "Gerando imagem...", description: "Aguarde enquanto preparamos sua imagem." });
        try {
            const slugEncoded = encodeURIComponent(initialRaffle.slug);
            const response = await fetch(`/api/campanha/${slugEncoded}/imagem?t=${Date.now()}`);
            if (!response.ok) throw new Error('Erro ao gerar imagem');
            const blob = await response.blob();

            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = `status-campanha.png`;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => { window.URL.revokeObjectURL(downloadUrl); document.body.removeChild(a); }, 1000);

            toast({ title: "Imagem baixada!", description: "Anexe-a no WhatsApp para completar." });
            shareOnWhatsApp();
        } catch (error) {
            toast({ variant: 'destructive', title: "Falha", description: "Tente novamente em instantes." });
        }
    };

    const openSupportLink = () => {
        const phone = settings.support?.whatsapp?.replace(/\D/g, '') || '5511999999999';
        const msg = encodeURIComponent(`Olá, estou com uma dúvida sobre a campanha: ${initialRaffle.title}`);
        window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
    };

    // Calculate Bonus Garantido logic
    const bonusTiers = settings.bonusTiers || [];
    const sortedBonuses = [...bonusTiers].sort((a: any, b: any) => a.targetTickets - b.targetTickets);
    let unlockedBonus: any = null;
    let nextBonus: any = null;

    for (let i = 0; i < sortedBonuses.length; i++) {
        if (selectedNumbers.length >= sortedBonuses[i].targetTickets) {
            unlockedBonus = sortedBonuses[i];
        }
        if (selectedNumbers.length < sortedBonuses[i].targetTickets && !nextBonus) {
            nextBonus = sortedBonuses[i];
        }
    }

    return (
        <div className={`max-w-xl mx-auto pb-32 min-h-screen transition-colors duration-300 custom-scrollbar`} style={{ backgroundColor: settings?.backgroundColor || (isDark ? '#0f172a' : '#ffffff'), color: isDark ? '#f8fafc' : '#0f172a' }}>
            {settings.banner?.enabled && settings.banner.text && (
                <div
                    className="w-full text-center py-2 px-4 shadow-sm relative z-20"
                    style={{ backgroundColor: settings.banner.color || '#ef4444', color: '#ffffff' }}
                >
                    <span className="font-bold text-[10px] md:text-xs uppercase tracking-widest">{settings.banner.text}</span>
                </div>
            )}

            {/* Countdown Header */}
            {settings.countdown?.enabled && timeLeft && (
                <div className={`w-full py-4 flex flex-col items-center justify-center z-10 border-b shadow-sm ${isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-900 border-slate-200 text-white'}`}>
                    <span className="font-bold text-[10px] uppercase tracking-wider mb-2 opacity-90 flex items-center gap-1" style={{ color: primaryColor }}>
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
                <div className={`w-full py-4 flex flex-col items-center justify-center z-10 border-b shadow-sm ${isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-900 border-slate-200 text-white'}`}>
                    <span className="font-bold text-xs uppercase tracking-wider mb-1 opacity-90 flex items-center gap-1 text-red-500">
                        <Clock className="w-4 h-4" /> Sorteio Encerrado
                    </span>
                </div>
            )}

            <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                {initialRaffle.imageUrl ? (
                    <Image
                        src={initialRaffle.imageUrl.includes('cloudinary.com') ? initialRaffle.imageUrl.replace('/upload/', '/upload/q_auto,f_auto/') : initialRaffle.imageUrl}
                        alt={initialRaffle.title}
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">🖼️</div>
                )}

                <div className="absolute top-4 left-4 z-20">
                    <Badge className="text-white border-none px-3 py-1 text-sm font-bold uppercase tracking-wider shadow-md" style={{ backgroundColor: initialRaffle.status === 'active' ? primaryColor : '#64748b' }}>
                        {initialRaffle.status === 'active' ? 'Ativa' : initialRaffle.status}
                    </Badge>
                </div>
            </div>

            <div className="p-6 pt-4 space-y-6">
                <div>
                    <h1 className="text-2xl font-bold leading-tight">{initialRaffle.title}</h1>
                    <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{initialRaffle.description}</p>
                </div>

                {settings.rules?.enabled && (
                    <div className="pt-2 pb-2">
                        <h3 className="font-bold mb-2 flex items-center gap-2 text-sm">
                            <AlertCircle className="w-4 h-4" style={{ color: primaryColor }} /> Regras da Campanha
                        </h3>
                        <p className="text-xs opacity-70 whitespace-pre-wrap leading-relaxed p-4 rounded-xl border" style={{ backgroundColor: isDark ? '#1e293b' : '#f8fafc', borderColor: isDark ? '#334155' : '#e2e8f0' }}>
                            {settings.rules.content || "Nenhuma regra definida."}
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div className={`p-4 rounded-xl border flex items-center gap-3 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="p-2 rounded-lg text-white" style={{ backgroundColor: primaryColor }}>
                            <Trophy className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] opacity-60 uppercase font-bold tracking-wider">Valor</p>
                            <p className="font-black text-lg">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(initialRaffle.pricePerNumber)}
                            </p>
                        </div>
                    </div>
                    <div className={`p-4 rounded-xl border flex items-center gap-3 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="p-2 bg-green-500 rounded-lg text-white">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] opacity-60 uppercase font-bold tracking-wider">Resultado</p>
                            <p className="font-black text-sm">
                                {new Date(initialRaffle.drawDate.includes('Z') ? initialRaffle.drawDate : initialRaffle.drawDate.replace(' ', 'T') + 'Z').toLocaleDateString('pt-BR')}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                        <span>Progresso da Campanha</span>
                        <span style={{ color: primaryColor }}>{Math.round(progressPercent)}% Vendido</span>
                    </div>
                    <Progress value={progressPercent} className="h-2" style={{ backgroundColor: `${primaryColor}20` }} indicatorColor={primaryColor} />
                </div>

                <div className="flex flex-col gap-3">
                    <Button
                        className="w-full gap-2 font-bold h-14 text-white rounded-xl shadow-md transition-all active:scale-95"
                        style={{ backgroundColor: primaryColor }}
                        onClick={shareWithImage}
                    >
                        <Image src="/favicon-32x32.png" alt="Logo" width={24} height={24} className="rounded" /> Compartilhar com Imagem
                    </Button>

                    <Button
                        variant="outline"
                        className={`w-full gap-2 border-[#25D366] text-[#25D366] hover:bg-green-50 dark:hover:bg-[#25D366]/10 font-bold h-12 rounded-xl ${isDark ? 'bg-transparent' : ''}`}
                        onClick={shareOnWhatsApp}
                    >
                        <MessageCircle className="w-6 h-6 fill-current" /> Apenas Texto
                    </Button>

                    {initialRaffle.whatsappGroupLink && (
                        <Button
                            variant="outline"
                            className={`w-full gap-2 border-green-200 text-green-600 hover:bg-green-50 dark:border-green-800 dark:text-green-500 dark:hover:bg-green-900/20 font-bold h-12 rounded-xl ${isDark ? 'bg-transparent' : ''}`}
                            onClick={() => window.open(initialRaffle.whatsappGroupLink, '_blank')}
                        >
                            <MessageCircle className="w-4 h-4" /> Grupo WhatsApp
                        </Button>
                    )}

                    <Button
                        variant="outline"
                        className={`w-full gap-2 font-bold h-12 rounded-xl ${isDark ? 'bg-transparent border-slate-700 text-slate-300' : 'border-slate-200 text-slate-600'}`}
                        onClick={() => setIsMyNumbersOpen(true)}
                    >
                        <Ticket className="w-4 h-4" /> Meus Tickets
                    </Button>
                </div>

                {/* Bônus Garantido Section */}
                {sortedBonuses.length > 0 && (
                    <div className={`p-5 rounded-2xl border-2 transition-all ${unlockedBonus ? `bg-green-50/80 border-green-200 dark:bg-green-900/20 dark:border-green-800/50` : (isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200')}`}>
                        <div className="flex items-center gap-4 mb-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-sm shrink-0 ${unlockedBonus ? 'bg-green-500 text-white' : (isDark ? 'bg-slate-700 text-slate-400' : 'bg-white border text-slate-400')}`}>
                                🎁
                            </div>
                            <div>
                                <h3 className={`font-bold leading-tight ${unlockedBonus ? 'text-green-700 dark:text-green-400' : ''}`}>
                                    {unlockedBonus ? `Parabéns! Você ganhou: ${unlockedBonus.prizeName}` : `Bônus: ${nextBonus?.prizeName || 'Prêmios Extras'}`}
                                </h3>
                                <p className={`text-xs mt-1 leading-snug ${unlockedBonus ? 'text-green-600/80 dark:text-green-400/80' : 'opacity-70'}`}>
                                    {unlockedBonus ? unlockedBonus.description : (nextBonus?.description || 'Compre mais tickets e destrave prêmios exclusivos.')}
                                </p>
                            </div>
                        </div>

                        {nextBonus && (
                            <div className={`space-y-2 mt-4 pt-4 border-t ${unlockedBonus ? 'border-green-200/50 dark:border-green-800/50' : (isDark ? 'border-white/5' : 'border-black/5')}`}>
                                <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider">
                                    <span className={unlockedBonus ? 'text-green-700/60 dark:text-green-400/60' : 'opacity-60'}>
                                        Faltam {nextBonus.targetTickets - selectedNumbers.length} tickets
                                    </span>
                                    <span style={{ color: primaryColor }}>Próximo: {nextBonus.prizeName}</span>
                                </div>
                                <div className={`h-2.5 rounded-full overflow-hidden ${unlockedBonus ? 'bg-green-200/50 dark:bg-green-900/50' : (isDark ? 'bg-slate-700' : 'bg-slate-200')}`}>
                                    <div
                                        className="h-full rounded-full transition-all duration-500 ease-out"
                                        style={{
                                            width: `${Math.min(100, (selectedNumbers.length / nextBonus.targetTickets) * 100)}%`,
                                            backgroundColor: primaryColor
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                        {!nextBonus && unlockedBonus && (
                            <div className="mt-4 pt-4 border-t border-green-200/50 dark:border-green-800/50 text-center text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-widest">
                                Você desbloqueou todos os bônus! 🎉
                            </div>
                        )}
                    </div>
                )}

                <div className={`pt-4 space-y-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <Info className="w-5 h-5 opacity-50" />
                        Selecione seus tickets
                    </h2>

                    <div className="flex flex-wrap gap-4 text-xs font-semibold uppercase">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-sm bg-campanha-available" />
                            <span className="text-sm font-medium opacity-70 whitespace-nowrap">Livre</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#f97316' }} />
                            <span className="text-sm font-medium opacity-70 whitespace-nowrap">Reservado</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-sm bg-slate-400" />
                            <span>Pago</span>
                        </div>
                    </div>

                    <NumberGrid
                        totalNumbers={initialRaffle.totalNumbers}
                        paidNumbers={paidNumbers}
                        reservedNumbers={reservedNumbers}
                        selectedNumbers={selectedNumbers}
                        onNumberClick={handleNumberClick}
                        primaryColor={primaryColor}
                    />
                </div>



                {settings.badges?.verified && (
                    <div className="flex justify-center items-center gap-2 mt-8 text-green-600 bg-green-50 dark:bg-green-900/20 p-3 rounded-xl text-xs font-bold uppercase tracking-wider border border-green-100 dark:border-green-800">
                        <Shield className="w-4 h-4" /> Organizador Verificado
                    </div>
                )}

                {/* Branding ALWAYS, but Report ALWAYS accessible */}
                {!settings.hideTicketonBranding && (
                    <div className="pt-12 pb-2 text-center space-y-4">
                        <div className="flex items-center justify-center gap-2 opacity-50">
                            <Zap className="w-4 h-4" />
                            <span className="font-bold text-sm uppercase tracking-wider">TicketOn</span>
                        </div>
                        <p className="text-[10px] opacity-60 max-w-xs mx-auto leading-relaxed">
                            Esta campanha é de responsabilidade do organizador. A TicketOn fornece a tecnologia para realização do evento.
                        </p>
                    </div>
                )}

                <div className={`pb-8 text-center ${settings.hideTicketonBranding ? 'pt-12' : 'pt-2'}`}>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-[10px] uppercase font-bold tracking-wider opacity-70 hover:opacity-100 transition-opacity hover:text-red-500"
                        onClick={() => {
                            const message = `*Denúncia da Campanha: ${initialRaffle.title}*\n\nLink: https://ticketon.com.br/campanha/${initialRaffle.slug}\n\nMotivo: `;
                            window.open(`https://wa.me/5511999999999?text=${encodeURIComponent(message)}`, '_blank');
                        }}
                    >
                        <AlertCircle className="w-3 h-3 mr-1.5" />
                        Denunciar Campanha
                    </Button>
                </div>
            </div>

            {selectedNumbers.length > 0 && (
                <div className="fixed bottom-6 left-6 right-6 z-40 animate-in slide-in-from-bottom-4 max-w-xl mx-auto">
                    <Button
                        onClick={() => setIsCheckoutOpen(true)}
                        className="w-full h-16 rounded-2xl text-white shadow-2xl flex items-center justify-between px-6 border-[3px] border-white dark:border-slate-800"
                        style={{ backgroundColor: primaryColor }}
                    >
                        <div className="text-left">
                            <p className="text-xs opacity-80 font-semibold uppercase">{selectedNumbers.length} tickets selecionados</p>
                            <p className="text-xl font-bold">Quero esses!</p>
                        </div>
                        <div className="bg-white/20 p-2 rounded-lg">
                            <CheckCircle className="w-6 h-6" />
                        </div>
                    </Button>
                </div>
            )
            }

            {
                settings.support?.enabled && (
                    <div
                        onClick={openSupportLink}
                        className="fixed bottom-[90px] right-6 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-xl z-30 cursor-pointer hover:scale-105 transition-transform"
                    >
                        <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                    </div>
                )
            }

            {
                showUrgencyPopup && (
                    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-3 flex items-center gap-3 border border-slate-200 dark:border-slate-700 w-[90%] max-w-sm animate-in slide-in-from-top-4 fade-in duration-300">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                            <span className="text-xl">🛍️</span>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{urgencyData.name} {urgencyData.phone}</p>
                            <p className="text-[10px] text-slate-500 font-medium">acabou de comprar {urgencyData.quantity} tickets!</p>
                        </div>
                    </div>
                )
            }

            {
                initialRaffle && (
                    <CheckoutModal
                        isOpen={isCheckoutOpen}
                        onClose={() => setIsCheckoutOpen(false)}
                        selectedNumbers={selectedNumbers}
                        raffle={initialRaffle}
                    />
                )
            }

            {
                initialRaffle && (
                    <MyNumbersModal
                        isOpen={isMyNumbersOpen}
                        onClose={() => setIsMyNumbersOpen(false)}
                        raffleId={initialRaffle.id}
                        settings={settings}
                    />
                )
            }
        </div >
    );
}
