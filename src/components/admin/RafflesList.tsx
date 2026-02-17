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
    const [pixData, setPixData] = useState<{ qr_code: string; qr_code_base64: string } | null>(null);
    const [loadingPix, setLoadingPix] = useState(false);
    const { toast } = useToast();
    return (
        <div className="space-y-4">
            {raffles.map((raffle) => (
                <Card
                    key={raffle.id}
                    className="p-6 bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all"
                >
                    <div className="space-y-6">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Image */}
                            <div className="relative w-full md:w-48 h-48 rounded-xl overflow-hidden shadow-md shrink-0">
                                <Image
                                    src={raffle.imageUrl}
                                    alt={raffle.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Info */}
                            <div className="flex-1 space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                    <div>
                                        <CardTitle className="text-2xl font-black text-gray-900 mb-2">
                                            {raffle.title}
                                        </CardTitle>
                                        <div className="flex flex-wrap gap-2">
                                            <Badge
                                                variant={
                                                    raffle.status === "active"
                                                        ? "default"
                                                        : raffle.status === "drawn"
                                                            ? "secondary"
                                                            : "outline"
                                                }
                                                className="text-xs font-bold uppercase"
                                            >
                                                {raffle.status === "active"
                                                    ? "Ativa"
                                                    : raffle.status === "drawn"
                                                        ? "Sorteada"
                                                        : raffle.status === "pending_payment"
                                                            ? "Pago Pendente"
                                                            : "Inativa"}
                                            </Badge>
                                            <Badge variant="outline" className="text-xs">
                                                {raffle.totalNumbers} cotas
                                            </Badge>
                                            <Badge variant="outline" className="text-xs">
                                                R$ {raffle.pricePerNumber.toFixed(2)} / cota
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 shrink-0">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onEdit(raffle)}
                                            className="gap-2"
                                        >
                                            <Pencil className="w-4 h-4" />
                                            Editar
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onViewSummary(raffle)}
                                            className="gap-2"
                                        >
                                            <FileText className="w-4 h-4" />
                                            Resumo
                                        </Button>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-600 line-clamp-2">
                                    {raffle.description}
                                </p>

                                <div className="flex flex-wrap gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4 text-gray-500" />
                                        <span className="font-medium text-gray-700">
                                            {sales.filter((s) => s.raffleId === raffle.id).length} vendas
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Dices className="w-4 h-4 text-gray-500" />
                                        <span className="font-medium text-gray-700">
                                            Sorteio: {new Date(raffle.drawDate).toLocaleDateString("pt-BR")}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            {raffle.status === "active" && (
                                <>
                                    <Link
                                        href={`/${raffle.slug}`}
                                        target="_blank"
                                        className="flex-1"
                                    >
                                        <Button
                                            variant="outline"
                                            className="w-full gap-2 border-2"
                                        >
                                            <Eye className="w-4 h-4" />
                                            Ver Site
                                        </Button>
                                    </Link>
                                    <Button
                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white gap-2"
                                        onClick={() => onShareWithImage(raffle)}
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                        Compartilhar
                                    </Button>
                                    <Button
                                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white gap-2"
                                        onClick={() => onDraw(raffle)}
                                    >
                                        <Dices className="w-4 h-4" />
                                        Sortear
                                    </Button>
                                </>
                            )}
                        </div>

                        {/* Payment Required Banner */}
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
                                    disabled={loadingPix}
                                    onClick={async () => {
                                        try {
                                            setLoadingPix(true);
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

                                            // Display PIX in dialog
                                            setPixData({
                                                qr_code: data.qr_code,
                                                qr_code_base64: data.qr_code_base64
                                            });
                                            setPixDialogOpen(true);
                                        } catch (err: any) {
                                            toast({
                                                variant: "destructive",
                                                title: "Erro no Mercado Pago",
                                                description: err.message
                                            });
                                        } finally {
                                            setLoadingPix(false);
                                        }
                                    }}
                                >
                                    {loadingPix ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-current" />} GERAR PIX
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
                                        <p className="text-xs text-green-600">
                                            Número sorteado: {raffle.winningNumber}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2"
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
                </Card>
            ))}

            {/* PIX Payment Dialog */}
            <Dialog open={pixDialogOpen} onOpenChange={setPixDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Pagamento PIX - R$ 0,20</DialogTitle>
                    </DialogHeader>
                    {pixData && (
                        <div className="space-y-4">
                            <div className="text-sm font-bold text-center">
                                Escaneie o QR Code ou copie o código PIX:
                            </div>

                            <div className="flex justify-center">
                                <img
                                    src={`data:image/png;base64,${pixData.qr_code_base64}`}
                                    alt="QR Code PIX"
                                    className="w-64 h-64 border-4 border-primary rounded-xl"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold">Código PIX (Copia e Cola):</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={pixData.qr_code}
                                        readOnly
                                        className="font-mono text-xs"
                                    />
                                    <Button
                                        onClick={() => {
                                            navigator.clipboard.writeText(pixData.qr_code);
                                            toast({
                                                title: "Copiado!",
                                                description: "Código PIX copiado para a área de transferência."
                                            });
                                        }}
                                        className="shrink-0"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="text-xs text-muted-foreground text-center">
                                Após o pagamento, sua rifa será ativada automaticamente.
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}