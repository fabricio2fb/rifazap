"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
    Trophy,
    Zap,
    MessageCircle,
    Pencil,
    Dices,
    Users,
    Eye,
    FileText,
    Copy,
    Loader2,
    Palette,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Raffle {
    id: string;
    title: string;
    slug: string;
    description: string;
    imageUrl: string;
    pricePerNumber: number;
    totalNumbers: number;
    drawDate: string;
    status: string;
    winningNumber?: number;
    winner?: string;
    [key: string]: any;
}

interface RafflesListProps {
    raffles: Raffle[];
    sales: any[];
    onEdit: (raffle: Raffle) => void;
    onViewSummary: (raffle: Raffle) => void;
    onDraw: (raffle: Raffle) => void;
    onShareWithImage: (raffle: Raffle) => void;
    onViewWinner: (data: { raffle: Raffle; sale: any }) => void;
}

export function RafflesList({
    raffles,
    sales,
    onEdit,
    onViewSummary,
    onDraw,
    onShareWithImage,
    onViewWinner,
}: RafflesListProps) {
    const [pixDialogOpen, setPixDialogOpen] = useState(false);
    const [pixData, setPixData] = useState<{ pix_code: string; amount: number } | null>(null);
    const [loadingPix, setLoadingPix] = useState(false);
    const [copied, setCopied] = useState(false);
    const { toast } = useToast();
    return (
        <div className="space-y-4">
            {raffles.map((raffle) => (
                <Card
                    key={raffle.id}
                    className="overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-500 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-[32px] group"
                >
                    <div className="flex flex-col lg:flex-row min-h-[220px]">
                        <div className="relative w-full lg:w-72 h-56 lg:h-auto shrink-0 bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                            {raffle.imageUrl && (
                                <Image
                                    src={raffle.imageUrl}
                                    alt={raffle.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                            )}
                            <div className="absolute top-3 left-3 flex flex-col gap-2">
                                <Badge
                                    variant={
                                        raffle.status === "active"
                                            ? "default"
                                            : raffle.status === "drawn"
                                                ? "secondary"
                                                : "outline"
                                    }
                                    className={`shadow-lg px-3 py-1 font-bold ${raffle.status === "pending_payment"
                                        ? "border-orange-500 text-orange-600 bg-orange-50"
                                        : ""
                                        }`}
                                >
                                    {raffle.status === "active"
                                        ? "ATIVA"
                                        : raffle.status === "drawn"
                                            ? "CONCLUÍDA"
                                            : raffle.status === "pending_payment"
                                                ? "PGTO PENDENTE"
                                                : "ENCERRADA"}
                                </Badge>
                            </div>
                        </div>

                        <div className="flex-1 p-8 flex flex-col justify-between space-y-6">
                            <div className="space-y-3">
                                <CardTitle className="text-xl sm:text-2xl font-black tracking-tight group-hover:text-primary transition-colors pr-2">
                                    {raffle.title}
                                </CardTitle>
                                <div className="flex flex-wrap items-center gap-2 sm:gap-6 text-[9px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-widest sm:tracking-[0.2em]">
                                    <span className="flex items-center gap-1.5 sm:gap-2 bg-slate-100 dark:bg-zinc-800 dark:text-zinc-300 px-3 py-1.5 rounded-full whitespace-nowrap">
                                        <Users className="w-3.5 h-3.5" /> {raffle.totalNumbers} Tickets
                                    </span>
                                    <span className="text-foreground bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20 whitespace-nowrap">
                                        R$ {raffle.pricePerNumber?.toFixed(2)} / cada
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 pt-6 border-t border-dashed border-slate-200">
                                <Link href={`/campanha/${raffle.slug}`} target="_blank" className="w-full">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full gap-2 text-[10px] font-black h-11 border-2 rounded-2xl hover:bg-slate-50 transition-all uppercase tracking-wider"
                                    >
                                        <Eye className="w-3.5 h-3.5" /> VER SITE
                                    </Button>
                                </Link>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onEdit(raffle)}
                                    className="gap-2 text-[10px] font-black h-11 border-2 rounded-2xl hover:bg-slate-50 transition-all uppercase tracking-wider"
                                >
                                    <Pencil className="w-3.5 h-3.5" /> EDITAR
                                </Button>
                                {raffle.plan === 'pro' && (
                                    <Link href={`/admin/campanhas/${raffle.id}/editor`} className="w-full">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full gap-2 text-[10px] font-black h-11 border-2 border-[#e0891d] text-[#e0891d] rounded-2xl hover:bg-[#fff9f0] dark:hover:bg-[#e0891d]/10 transition-all uppercase tracking-wider bg-transparent"
                                        >
                                            <Palette className="w-3.5 h-3.5" /> Editor PRO
                                        </Button>
                                    </Link>
                                )}

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onViewSummary(raffle)}
                                    className="gap-2 text-[10px] font-black h-11 border-2 rounded-2xl hover:bg-slate-50 transition-all uppercase tracking-wider bg-slate-900 text-white dark:bg-zinc-800 dark:text-white dark:border-zinc-700 hover:text-slate-900 border-transparent dark:hover:bg-zinc-700 dark:hover:text-white"
                                >
                                    <FileText className="w-3.5 h-3.5" /> RESUMO
                                </Button>

                                <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => onDraw(raffle)}
                                    className="gap-2 text-[10px] font-black h-11 shadow-lg bg-slate-900 hover:bg-black text-white rounded-2xl transition-all uppercase tracking-wider"
                                >
                                    <Dices className="w-3.5 h-3.5" /> APURAR
                                </Button>

                                <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => onShareWithImage(raffle)}
                                    className="gap-2 text-[10px] sm:text-[11px] font-black h-11 shadow-lg bg-[#128C7E] hover:bg-[#075E54] text-white rounded-2xl transition-all uppercase tracking-wider col-span-2 md:col-span-2 lg:col-span-1"
                                >
                                    <MessageCircle className="w-3.5 h-3.5 fill-current" /> WHATSAPP
                                </Button>
                            </div>

                            {raffle.status === "pending_payment" && (
                                <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-xl border border-blue-100 dark:border-blue-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-3 text-left">
                                        <Zap className="w-6 h-6 text-blue-600 fill-current" />
                                        <div>
                                            <p className="text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase leading-none mb-1">
                                                Pagamento Necessário
                                            </p>
                                            <p className="text-sm font-medium text-blue-800 dark:text-blue-300 leading-tight">
                                                Sua campanha está salva, mas falta pagar a taxa (R$ {raffle.plan === 'pro' ? '25,90' : '14,90'}) para ativar.
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        className="w-full sm:w-auto bg-[#009EE3] hover:bg-[#007EB5] text-white font-black text-xs gap-2 px-6 h-12 shadow-lg transition-all active:scale-95 shrink-0"
                                        disabled={loadingPix}
                                        onClick={async () => {
                                            try {
                                                setLoadingPix(true);
                                                const res = await fetch('/api/payments/syncpay', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({ raffleId: raffle.id })
                                                });
                                                const data = await res.json();
                                                if (!res.ok) {
                                                    const msg = data.details ? `${data.error}: ${data.details}` : data.error;
                                                    throw new Error(msg || 'Erro ao gerar pagamento');
                                                }

                                                if (data.pix_code) {
                                                    setPixData({ pix_code: data.pix_code, amount: data.amount });
                                                    setPixDialogOpen(true);
                                                }
                                            } catch (err: any) {
                                                toast({
                                                    variant: "destructive",
                                                    title: "Erro no Pagamento",
                                                    description: err.message
                                                });
                                            } finally {
                                                setLoadingPix(false);
                                            }
                                        }}
                                    >
                                        {loadingPix ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-current" />} PAGAR ATIVAÇÃO
                                    </Button>
                                </div>
                            )}

                            {raffle.status === "drawn" && (
                                <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <Trophy className="w-8 h-8 text-green-600" />
                                        <div>
                                            <p className="text-[10px] font-bold text-green-700 uppercase">
                                                Ganhador
                                            </p>
                                            <p className="font-black text-green-800 text-lg">
                                                {raffle.winner}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-green-700 uppercase">
                                                Número
                                            </p>
                                            <p className="font-black text-2xl text-green-800">
                                                {raffle.winningNumber}
                                            </p>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="bg-white border-green-200 text-green-700 hover:bg-green-100 font-bold"
                                            onClick={() => {
                                                const winningSale = sales.find(
                                                    (s) =>
                                                        s.raffleId === raffle.id &&
                                                        s.selectedNumbers.includes(raffle.winningNumber)
                                                );
                                                onViewWinner({
                                                    raffle,
                                                    sale: winningSale || {
                                                        name: raffle.winner,
                                                        whatsapp: "Não encontrado",
                                                        total: 0,
                                                    },
                                                });
                                            }}
                                        >
                                            <Eye className="w-4 h-4 mr-2" />
                                            Ver Detalhes
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            ))}

            {/* SyncPay Payment Dialog */}
            <Dialog open={pixDialogOpen} onOpenChange={setPixDialogOpen}>
                <DialogContent className="max-w-[400px] rounded-[32px] p-8">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black text-center uppercase tracking-tight">Ativação de Campanha</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6 pt-4 text-center">
                        <div className="bg-primary/10 p-6 rounded-[24px] border border-primary/20">
                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Valor do Software</p>
                            <p className="text-4xl font-black text-primary">R$ {pixData?.amount.toFixed(2)}</p>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-slate-50 dark:bg-zinc-800 p-4 rounded-[24px] border border-slate-100 dark:border-zinc-700 flex flex-col items-center gap-4">
                                <div className="w-44 h-44 bg-white dark:bg-zinc-900 rounded-2xl flex items-center justify-center shadow-inner overflow-hidden border-4 border-white">
                                    {pixData?.pix_code ? (
                                        <img
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(pixData.pix_code)}`}
                                            alt="QR Code PIX"
                                            className="w-full h-full object-contain"
                                        />
                                    ) : (
                                        <div className="animate-pulse bg-slate-100 w-full h-full rounded-xl" />
                                    )}
                                </div>

                                <div className="w-full space-y-2">
                                    <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest text-center block">Código Copia e Cola</Label>
                                    <div className="relative">
                                        <Input
                                            readOnly
                                            value={pixData?.pix_code || ""}
                                            className="font-mono text-[10px] h-12 pr-24 bg-white dark:bg-zinc-900 rounded-xl"
                                        />
                                        <Button
                                            size="sm"
                                            className="absolute right-1 top-1 bottom-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-[10px] rounded-lg"
                                            onClick={() => {
                                                if (pixData?.pix_code) {
                                                    navigator.clipboard.writeText(pixData.pix_code);
                                                    setCopied(true);
                                                    setTimeout(() => setCopied(false), 2000);
                                                    toast({ title: "Copiado!", description: "Código PIX copiado." });
                                                }
                                            }}
                                        >
                                            {copied ? "COPIADO!" : "COPIAR"}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <p className="text-[10px] text-muted-foreground leading-relaxed px-4">
                                Pagamento seguro via SyncPay. Após a confirmação, sua campanha será ativada automaticamente.
                            </p>
                        </div>

                        <Button
                            variant="outline"
                            className="w-full h-12 rounded-2xl font-bold text-muted-foreground border-2 mt-4"
                            onClick={() => setPixDialogOpen(false)}
                        >
                            FECHAR
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}