"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Trophy,
    Zap,
    MessageCircle,
    Pencil,
    Dices,
    Users,
    Eye,
    FileText,
} from "lucide-react";
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
    return (
        <div className="space-y-4">
            {raffles.map((raffle) => (
                <Card
                    key={raffle.id}
                    className="overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-500 bg-white/80 backdrop-blur-md rounded-[32px] group"
                >
                    <div className="flex flex-col lg:flex-row min-h-[220px]">
                        <div className="relative w-full lg:w-72 h-56 lg:h-auto shrink-0 bg-slate-100 overflow-hidden">
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
                                            ? "SORTEADA"
                                            : raffle.status === "pending_payment"
                                                ? "PGTO PENDENTE"
                                                : "ENCERRADA"}
                                </Badge>
                            </div>
                        </div>

                        <div className="flex-1 p-8 flex flex-col justify-between space-y-6">
                            <div className="space-y-3">
                                <CardTitle className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors">
                                    {raffle.title}
                                </CardTitle>
                                <div className="flex items-center gap-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                                    <span className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full">
                                        <Users className="w-3.5 h-3.5" /> {raffle.totalNumbers} Cotas
                                    </span>
                                    <span className="text-foreground bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
                                        R$ {raffle.pricePerNumber?.toFixed(2)} / cada
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-6 border-t border-dashed border-slate-200">
                                <Link href={`/rifa/${raffle.slug}`} target="_blank" className="w-full">
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

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onViewSummary(raffle)}
                                    className="gap-2 text-[10px] font-black h-11 border-2 rounded-2xl hover:bg-slate-50 transition-all uppercase tracking-wider"
                                >
                                    <FileText className="w-3.5 h-3.5" /> RESUMO
                                </Button>

                                <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => onDraw(raffle)}
                                    disabled={raffle.status === "drawn"}
                                    className="gap-2 text-[10px] font-black h-11 shadow-lg bg-slate-900 hover:bg-black text-white rounded-2xl transition-all uppercase tracking-wider disabled:opacity-50"
                                >
                                    <Dices className="w-3.5 h-3.5" /> SORTEAR
                                </Button>

                                <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => onShareWithImage(raffle)}
                                    className="gap-2 text-[10px] font-black h-11 shadow-lg bg-[#128C7E] hover:bg-[#075E54] text-white rounded-2xl transition-all uppercase tracking-wider col-span-2 sm:col-span-1"
                                >
                                    <MessageCircle className="w-3.5 h-3.5 fill-current" /> WHATSAPP
                                </Button>
                            </div>

                            {raffle.status === "pending_payment" && (
                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-3 text-left">
                                        <Zap className="w-6 h-6 text-blue-600 fill-current" />
                                        <div>
                                            <p className="text-[10px] font-bold text-blue-700 uppercase leading-none mb-1">
                                                Pagamento Necessário
                                            </p>
                                            <p className="text-sm font-medium text-blue-800 leading-tight">
                                                Sua rifa está salva, mas falta pagar a taxa (R$ 0,20) para ativar.
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        className="w-full sm:w-auto bg-[#009EE3] hover:bg-[#007EB5] text-white font-black text-xs gap-2 px-6 h-12 shadow-lg transition-all active:scale-95 shrink-0"
                                        onClick={async () => {
                                            try {
                                                const res = await fetch('/api/payments/mp/checkout', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({ raffleId: raffle.id })
                                                });
                                                const data = await res.json();
                                                if (!res.ok) {
                                                    const msg = data.details ? `${data.error}: ${data.details}` : data.error;
                                                    throw new Error(msg || 'Erro ao gerar pagamento');
                                                }
                                                window.open(data.init_point, '_blank');
                                            } catch (err: any) {
                                                alert(`Erro no Mercado Pago: ${err.message}`);
                                            }
                                        }}
                                    >
                                        <Zap className="w-4 h-4 fill-current" /> PAGAR COM MERCADO PAGO
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
        </div>
    );
}