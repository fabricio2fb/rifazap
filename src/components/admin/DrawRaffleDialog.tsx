'use client';

import { useState, useMemo, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Trophy, Dices, PartyPopper, Eye, CheckCircle, Smartphone, User } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { createClient } from '@/lib/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface DrawRaffleDialogProps {
    raffle: any;
    sales: any[];
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onDrawComplete: (winnerData: any) => void;
}

export function DrawRaffleDialog({
    raffle,
    sales,
    isOpen,
    onOpenChange,
    onDrawComplete
}: DrawRaffleDialogProps) {
    const [step, setStep] = useState<'idle' | 'counting' | 'finished'>('idle');
    const [countdown, setCountdown] = useState(5);
    const [currentSpinNumber, setCurrentSpinNumber] = useState(0);
    const [winner, setWinner] = useState<any>(null);
    const [showDetails, setShowDetails] = useState(false);
    const { toast } = useToast();
    const supabase = createClient();

    // Reset state when opening
    useEffect(() => {
        if (isOpen) {
            setStep('idle');
            setWinner(null);
            setCountdown(5);
            setShowDetails(false);
        }
    }, [isOpen]);

    const confirmedNumbers = useMemo(() => {
        if (!raffle) return [];
        const confirmedParticipants = sales.filter(s =>
            s.raffleId === raffle?.id &&
            (s.status === 'confirmed' || s.status === 'paid' || s.status === 'paid_delayed')
        );
        const allNumbers: { num: number, buyer: any }[] = [];
        confirmedParticipants.forEach(p => {
            p.selectedNumbers?.forEach((n: number) => {
                allNumbers.push({ num: n, buyer: p });
            });
        });
        return allNumbers;
    }, [raffle, sales]);

    const startDraw = () => {
        if (confirmedNumbers.length === 0) {
            toast({
                variant: "destructive",
                title: "Sorteio Impossível",
                description: "Não há participantes aptos para este sorteio.",
            });
            return;
        }

        setStep('counting');
        setCountdown(5);

        // Countdown logic
        let count = 5;
        const countInterval = setInterval(() => {
            count -= 1;
            setCountdown(count);
            if (count < 0) {
                clearInterval(countInterval);
                finishDraw();
            }
        }, 1000);

        // Spin animation logic
        const spinInterval = setInterval(() => {
            const max = raffle.totalNumbers || 100;
            setCurrentSpinNumber(Math.floor(Math.random() * max));
        }, 50);

        (window as any)._spinInterval = spinInterval;
    };

    const finishDraw = async () => {
        clearInterval((window as any)._spinInterval);

        const randomIndex = Math.floor(Math.random() * confirmedNumbers.length);
        const chosen = confirmedNumbers[randomIndex];

        setWinner(chosen);
        setStep('finished');
        setCurrentSpinNumber(chosen.num);

        try {
            const res = await fetch(`/api/admin/raffles/${raffle.id}/draw`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    winnerNumber: chosen.num,
                    winnerName: chosen.buyer.name
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Erro ao salvar ganhador');
            }

            onDrawComplete(chosen);
        } catch (error) {
            console.error("Error saving winner:", error);
            toast({
                variant: "destructive", title: "Erro ao salvar", description: "Ocorreu um erro ao salvar o ganhador no banco."
            });
        }
    };

    const maskPhone = (phone: string) => {
        if (!phone) return "Not available";
        // Simple mask: (XX) 9XXXX-YYYY -> (XX) 9****-YYYY
        return phone.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2****-$4');
    };

    if (!raffle) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] text-center p-0 overflow-hidden bg-gradient-to-b from-white to-slate-50 border-0 shadow-2xl">
                <div className="absolute top-0 left-0 right-0 h-32 bg-primary/10 -z-10 rounded-b-[100px]" />

                <DialogHeader className="p-6 pb-2 relative z-10">
                    <DialogTitle className="text-2xl font-black flex justify-center items-center gap-2 uppercase tracking-wide text-primary">
                        {step === 'finished' ? 'Ganhador Definido' : 'Realizar Sorteio'}
                    </DialogTitle>
                </DialogHeader>

                <div className="px-6 pb-8 space-y-8 min-h-[400px] flex flex-col justify-center">
                    {step === 'idle' && (
                        <div className="space-y-6 animate-in fade-in zoom-in duration-300">
                            <div className="relative mx-auto w-40 h-40">
                                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-20" />
                                <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-primary/20">
                                    <Trophy className="w-16 h-16 text-yellow-500 fill-yellow-500" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="font-bold text-xl">{raffle.title}</h3>
                                <p className="text-muted-foreground text-sm">
                                    <span className="font-bold text-primary">{confirmedNumbers.length}</span> cotas participando
                                </p>
                            </div>

                            <Button
                                onClick={startDraw}
                                size="lg"
                                className="w-full font-black text-lg h-16 rounded-2xl shadow-lg hover:scale-[1.02] transition-transform"
                            >
                                <Dices className="mr-2 w-6 h-6" /> GIRAR ROLETA
                            </Button>
                        </div>
                    )}

                    {step === 'counting' && (
                        <div className="space-y-8 flex flex-col items-center justify-center h-full">
                            <div className="relative">
                                <span className="text-[10rem] font-black text-slate-200 leading-none select-none">
                                    {countdown > 0 ? countdown : "GO"}
                                </span>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-slate-900 text-white px-8 py-4 rounded-2xl shadow-2xl border-4 border-white/20">
                                        <p className="text-6xl font-mono font-black tracking-widest">
                                            {currentSpinNumber.toString().padStart(3, '0')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <p className="font-bold text-primary animate-pulse text-lg uppercase tracking-widest">Sorteando...</p>
                        </div>
                    )}

                    {step === 'finished' && winner && (
                        <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
                            <div className="flex flex-col items-center gap-4">
                                <div className="bg-green-100 p-4 rounded-full">
                                    <PartyPopper className="w-12 h-12 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase text-muted-foreground tracking-widest mb-1">Número Sorteado</p>
                                    <div className="text-7xl font-black text-slate-900 tracking-tighter drop-shadow-sm">
                                        {winner.num.toString().padStart(2, '0')}
                                    </div>
                                </div>
                            </div>

                            <Card className="border-primary/20 bg-primary/5 shadow-inner">
                                <CardContent className="p-6">
                                    <div className="flex flex-col gap-1 items-center">
                                        <h3 className="font-black text-2xl text-primary">{winner.buyer.name}</h3>
                                        <p className="font-medium text-muted-foreground flex items-center gap-2">
                                            <Smartphone className="w-4 h-4" />
                                            {showDetails ? winner.buyer.whatsapp : maskPhone(winner.buyer.whatsapp)}
                                        </p>

                                        {showDetails && (
                                            <div className="mt-4 grid grid-cols-2 gap-4 w-full pt-4 border-t border-primary/10">
                                                <div className="text-center">
                                                    <p className="text-xs text-muted-foreground uppercase font-bold">Total Cotas</p>
                                                    <p className="font-black text-lg">{winner.buyer.selectedNumbers?.length || 1}</p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-xs text-muted-foreground uppercase font-bold">Valor Pago</p>
                                                    <p className="font-black text-lg">R$ {winner.buyer.total?.toFixed(2)}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="grid grid-cols-2 gap-3">
                                <Button
                                    variant="outline"
                                    className="h-12 font-bold border-2"
                                    onClick={() => setShowDetails(!showDetails)}
                                >
                                    {showDetails ? (
                                        <>Esconder Dados</>
                                    ) : (
                                        <><Eye className="mr-2 w-4 h-4" /> Ver Detalhes</>
                                    )}
                                </Button>
                                <Button
                                    className="h-12 font-bold bg-green-600 hover:bg-green-700 text-white shadow-lg"
                                    onClick={() => onOpenChange(false)}
                                >
                                    <CheckCircle className="mr-2 w-4 h-4" /> Concluir
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
