'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, Ticket, Calendar } from "lucide-react";

interface RaffleSummaryDialogProps {
    raffle: any;
    sales: any[]; // All sales data to filter from
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function RaffleSummaryDialog({
    raffle,
    sales,
    isOpen,
    onOpenChange,
}: RaffleSummaryDialogProps) {
    if (!raffle) return null;

    // Filter sales for this raffle
    const raffleSales = sales.filter((s) => s.raffleId === raffle.id);

    // Calculate stats
    const totalSales = raffleSales.length;
    const confirmedSales = raffleSales.filter(
        (s) => s.status === "confirmed" || s.status === "paid" || s.status === "paid_delayed"
    );
    const pendingSales = raffleSales.filter((s) => s.status === "pending");

    const totalRevenue = confirmedSales.reduce((acc, curr) => acc + curr.total, 0);
    const potentialRevenue = pendingSales.reduce((acc, curr) => acc + curr.total, 0);

    const totalNumbersSold = confirmedSales.reduce(
        (acc, curr) => acc + (curr.selectedNumbers?.length || 0),
        0
    );

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Resumo da Rifa</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                        {raffle.imageUrl && (
                            <img
                                src={raffle.imageUrl}
                                alt={raffle.title}
                                className="w-16 h-16 rounded-md object-cover"
                            />
                        )}
                        <div>
                            <h3 className="font-bold text-lg">{raffle.title}</h3>
                            <p className="text-sm text-muted-foreground">
                                Status: {raffle.status === 'active' ? 'Ativa' : 'Encerrada'}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Arrecadado
                                </CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalRevenue)}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    + {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(potentialRevenue)} pendente
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Cotas Vendidas
                                </CardTitle>
                                <Ticket className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {totalNumbersSold} <span className="text-sm text-muted-foreground font-normal">/ {raffle.totalNumbers}</span>
                                </div>
                                <div className="w-full bg-secondary h-2 mt-2 rounded-full overflow-hidden">
                                    <div
                                        className="bg-primary h-full transition-all"
                                        style={{ width: `${(totalNumbersSold / raffle.totalNumbers) * 100}%` }}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Participantes
                                </CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{confirmedSales.length}</div>
                                <p className="text-xs text-muted-foreground">
                                    {pendingSales.length} aguardando pagamento
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Data do Sorteio
                                </CardTitle>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-lg font-bold">
                                    {raffle.drawDate ? new Date(raffle.drawDate).toLocaleDateString('pt-BR') : 'Não definida'}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
