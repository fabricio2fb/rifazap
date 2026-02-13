"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { NumberGrid } from "@/components/raffle/NumberGrid";
import { CheckoutModal } from "@/components/raffle/CheckoutModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Calendar, Trophy, CheckCircle, Info, Ticket } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";

import { MyNumbersModal } from "@/components/raffle/MyNumbersModal";

export default function RaffleView({ initialRaffle, initialParticipants }: { initialRaffle: any, initialParticipants: any[] }) {
    const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isMyNumbersOpen, setIsMyNumbersOpen] = useState(false);
    const [participants, setParticipants] = useState<any[]>(initialParticipants);
    const supabase = createClient();
    const { toast } = useToast();

    // Polling or Realtime could be added here later if needed
    // For now we use the initial data from server

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
                    console.log('Realtime update:', payload);
                    if (payload.eventType === 'INSERT') {
                        const newParticipant = {
                            raffleId: payload.new.raffle_id,
                            status: payload.new.status,
                            selectedNumbers: payload.new.numbers
                        };
                        setParticipants(prev => [...prev, newParticipant]);

                        toast({
                            title: "Nova reserva!",
                            description: "Alguém acabou de reservar números nesta rifa.",
                        });
                    } else if (payload.eventType === 'UPDATE') {
                        setParticipants(prev => prev.map(p => {
                            // This is a bit tricky since we don't have purchase ID in the simplified state
                            // but we can match by the numbers array if they are unique per purchase
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
                        // Handle cancellations if needed (reserved numbers being freed)
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
            .filter(p => p.status === 'confirmed')
            .flatMap(p => p.selectedNumbers) || [],
        [participants]);

    const reservedNumbers = useMemo(() =>
        participants
            .filter(p => p.status === 'pending')
            .flatMap(p => p.selectedNumbers) || [],
        [participants]);

    const totalSold = paidNumbers.length + reservedNumbers.length;
    const progressPercent = (totalSold / initialRaffle.totalNumbers) * 100;

    const handleNumberClick = (num: number) => {
        setSelectedNumbers(prev =>
            prev.includes(num) ? prev.filter(n => n !== num) : [...prev, num]
        );
    };

    const shareOnWhatsApp = () => {
        const url = `https://rifazap.vercel.app/rifa/${initialRaffle.slug}`;
        const price = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(initialRaffle.pricePerNumber);

        // Force Brasilia time for share message
        const date = new Date(initialRaffle.drawDate).toLocaleDateString('pt-BR', {
            timeZone: 'America/Sao_Paulo'
        });

        const text = `🎟️ RIFA ATIVA

Prêmio: ${initialRaffle.title}
Valor por número: ${price}
Sorteio: ${date}

👉 Garanta o seu número:
${url}`;

        const encodedText = encodeURIComponent(text);
        window.open(`https://wa.me/?text=${encodedText}`, '_blank');
    };

    const shareWithImage = async () => {
        toast({
            title: "Gerando imagem...",
            description: "Aguarde enquanto preparamos sua imagem de status.",
        });

        try {
            const slugEncoded = encodeURIComponent(initialRaffle.slug);
            const response = await fetch(`/api/rifa/${slugEncoded}/imagem?t=${Date.now()}`);

            if (!response.ok) {
                const contentType = response.headers.get('content-type');
                let errorMessage = 'Erro ao gerar imagem';
                if (contentType?.includes('application/json')) {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } else {
                    errorMessage = await response.text() || errorMessage;
                }
                throw new Error(errorMessage);
            }

            const blob = await response.blob();

            if (blob.size < 500) {
                throw new Error(`Imagem muito pequena (${blob.size} bytes). Verifique sua conexão.`);
            }

            const price = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(initialRaffle.pricePerNumber);
            const date = new Date(initialRaffle.drawDate).toLocaleDateString('pt-BR', {
                timeZone: 'America/Sao_Paulo'
            });
            const url = `https://rifazap.vercel.app/rifa/${initialRaffle.slug}`;

            const shareText = `🎟️ RIFA ATIVA

Prêmio: ${initialRaffle.title}
Valor por número: ${price}
Sorteio: ${date}

👉 Garanta o seu número:
${url}`;

            // Direct Download + WhatsApp Redirect Flow
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = `status-rifa.png`;
            document.body.appendChild(a);
            a.click();

            // Longer delay for mobile browsers
            setTimeout(() => {
                window.URL.revokeObjectURL(downloadUrl);
                document.body.removeChild(a);
            }, 1000);

            toast({
                title: "Imagem baixada!",
                description: "Agora anexe-a no seu WhatsApp para completar o compartilhamento.",
            });

            // Immediately open WhatsApp
            shareOnWhatsApp();
        } catch (error) {
            console.error('Error sharing image:', error);
            toast({
                variant: 'destructive',
                title: "Falha no download da imagem",
                description: error instanceof Error ? error.message : "Tente novamente em instantes.",
            });
        }
    };

    return (
        <div className="max-w-xl mx-auto pb-32 bg-white min-h-screen">
            <div className="relative aspect-[4/3] w-full overflow-hidden">
                {initialRaffle.imageUrl && (
                    <Image
                        src={initialRaffle.imageUrl}
                        alt={initialRaffle.title}
                        fill
                        className="object-cover"
                        priority
                    />
                )}
                <div className="absolute top-4 left-4">
                    <Badge className="bg-rifa-available text-white border-none px-3 py-1 text-sm font-bold uppercase tracking-wider">
                        {initialRaffle.status === 'active' ? 'Ativa' : initialRaffle.status}
                    </Badge>
                </div>
            </div>

            <div className="p-6 space-y-6">
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold leading-tight">{initialRaffle.title}</h1>
                    <p className="text-muted-foreground">{initialRaffle.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/30 p-4 rounded-xl border border-border flex items-center gap-3">
                        <div className="p-2 bg-primary/20 rounded-lg text-primary-foreground">
                            <Trophy className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase font-semibold">Valor</p>
                            <p className="font-bold text-lg">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(initialRaffle.pricePerNumber)}
                            </p>
                        </div>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-xl border border-border flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg text-green-700">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase font-semibold">Sorteio</p>
                            <p className="font-bold text-sm">
                                {new Date(initialRaffle.drawDate.includes('Z') ? initialRaffle.drawDate : initialRaffle.drawDate.replace(' ', 'T') + 'Z').toLocaleDateString('pt-BR')}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                        <span>Progresso da Rifa</span>
                        <span>{Math.round(progressPercent)}% Vendido</span>
                    </div>
                    <Progress value={progressPercent} className="h-2" />
                </div>

                <div className="flex flex-col gap-3">
                    <Button
                        className="w-full gap-2 font-bold h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-all active:scale-95"
                        onClick={shareWithImage}
                    >
                        <Image src="/favicon-32x32.png" alt="Logo" width={24} height={24} className="rounded" /> Compartilhar com Imagem
                    </Button>

                    <Button
                        variant="outline"
                        className="w-full gap-2 border-[#25D366] text-[#25D366] hover:bg-green-50 font-bold h-12 rounded-xl"
                        onClick={shareOnWhatsApp}
                    >
                        <MessageCircle className="w-6 h-6 fill-current" /> Apenas Texto
                    </Button>

                    {initialRaffle.whatsappGroupLink && (
                        <Button
                            variant="outline"
                            className="w-full gap-2 border-green-200 text-green-600 hover:bg-green-50 font-bold h-12 rounded-xl"
                            onClick={() => window.open(initialRaffle.whatsappGroupLink, '_blank')}
                        >
                            <MessageCircle className="w-4 h-4" /> Grupo WhatsApp
                        </Button>
                    )}

                    <Button
                        variant="outline"
                        className="w-full gap-2 border-blue-200 text-blue-600 hover:bg-blue-50 font-bold h-12 rounded-xl"
                        onClick={() => setIsMyNumbersOpen(true)}
                    >
                        <Ticket className="w-4 h-4" /> Meus Números
                    </Button>
                </div>

                <div className="pt-4 space-y-4">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <Info className="w-5 h-5 text-primary-foreground/50" />
                        Selecione seus números
                    </h2>

                    <div className="flex flex-wrap gap-4 text-xs font-semibold uppercase">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-sm bg-rifa-available" />
                            <span>Livre</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-sm bg-rifa-reserved" />
                            <span>Reservado</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-sm bg-rifa-paid" />
                            <span>Pago</span>
                        </div>
                    </div>

                    <NumberGrid
                        totalNumbers={initialRaffle.totalNumbers}
                        paidNumbers={paidNumbers}
                        reservedNumbers={reservedNumbers}
                        selectedNumbers={selectedNumbers}
                        onNumberClick={handleNumberClick}
                    />
                </div>
            </div>

            {selectedNumbers.length > 0 && (
                <div className="fixed bottom-6 left-6 right-6 z-50 animate-in slide-in-from-bottom-4">
                    <Button
                        onClick={() => setIsCheckoutOpen(true)}
                        className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl flex items-center justify-between px-6 border-4 border-white"
                    >
                        <div className="text-left">
                            <p className="text-xs opacity-70 font-semibold uppercase">{selectedNumbers.length} números selecionados</p>
                            <p className="text-xl font-bold">Quero esses!</p>
                        </div>
                        <div className="bg-white/20 p-2 rounded-lg">
                            <CheckCircle className="w-6 h-6" />
                        </div>
                    </Button>
                </div>
            )}

            {initialRaffle && (
                <CheckoutModal
                    isOpen={isCheckoutOpen}
                    onClose={() => setIsCheckoutOpen(false)}
                    selectedNumbers={selectedNumbers}
                    raffle={initialRaffle}
                />
            )}

            {initialRaffle && (
                <MyNumbersModal
                    isOpen={isMyNumbersOpen}
                    onClose={() => setIsMyNumbersOpen(false)}
                    raffleId={initialRaffle.id}
                />
            )}
        </div>
    );
}
