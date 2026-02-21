'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Smartphone, User, Ticket, DollarSign, Calendar } from 'lucide-react';

interface WinnerDetailsDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    winnerSale: any; // The sale object of the winner
    raffle: any;
}

export function WinnerDetailsDialog({
    isOpen,
    onOpenChange,
    winnerSale,
    raffle
}: WinnerDetailsDialogProps) {
    if (!winnerSale || !raffle) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden bg-white">
                <div className="bg-green-600 p-6 text-center text-white relative">
                    <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%,transparent_100%)] bg-[length:10px_10px]" />
                    <div className="relative z-10 flex flex-col items-center gap-3">
                        <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                            <Trophy className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold uppercase tracking-wide">Detalhes do Ganhador</h2>
                            <p className="text-green-100 text-sm max-w-[250px] mx-auto truncate">{raffle.title}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    <div className="text-center space-y-1">
                        <p className="text-xs font-bold text-muted-foreground uppercase">Ganhador</p>
                        <h3 className="text-2xl font-black text-slate-900">{winnerSale.name}</h3>
                    </div>

                    <div className="grid gap-3">
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="p-2 bg-white rounded-lg shadow-sm text-green-600">
                                <Smartphone className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase">WhatsApp</p>
                                <p className="font-semibold text-sm">{winnerSale.whatsapp}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="p-2 bg-white rounded-lg shadow-sm text-blue-600">
                                    <Ticket className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Ticket Sorteado</p>
                                    <p className="font-black text-lg text-blue-700">{raffle.winningNumber}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="p-2 bg-white rounded-lg shadow-sm text-purple-600">
                                    <DollarSign className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Valor Pago</p>
                                    <p className="font-bold text-sm">R$ {winnerSale.total?.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="p-2 bg-white rounded-lg shadow-sm text-orange-600">
                                <Calendar className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase">Data da Compra</p>
                                <p className="font-semibold text-sm">{new Date(winnerSale.createdAt).toLocaleDateString('pt-BR')} às {new Date(winnerSale.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                        </div>
                    </div>

                    <Button size="lg" className="w-full font-bold" onClick={() => onOpenChange(false)}>
                        Fechar Detalhes
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
