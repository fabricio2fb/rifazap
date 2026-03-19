'use client';

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, Ticket, Calendar, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

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

    const handleDownloadCSV = () => {
        const headers = ["Número reservado", "Nome do comprador", "Telefone", "Status do pagamento", "Data da reserva"];
        const rows = raffleSales.map(s => [
            `"${(s.selectedNumbers || []).join(', ')}"`,
            `"${s.name}"`,
            `"${s.whatsapp}"`,
            `"${s.status === 'paid' ? 'Pago' : s.status === 'pending' ? 'Pendente' : s.status}"`,
            `"${new Date(s.createdAt).toLocaleString('pt-BR')}"`
        ]);

        const csvContent = [
            headers.join(';'),
            ...rows.map(r => r.join(';'))
        ].join('\n');

        const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `relatorio-${raffle.slug}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Resumo da Campanha</DialogTitle>
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
                        <div className="flex-1">
                            <h3 className="font-bold text-lg">{raffle.title}</h3>
                            <p className="text-sm text-muted-foreground">
                                Status: {raffle.status === 'active' ? 'Ativa' : 'Encerrada'}
                            </p>
                        </div>
                        <Button
                            onClick={handleDownloadCSV}
                            variant="outline"
                            className="bg-[#F5C518] border-none text-navy hover:bg-[#d4a914] font-bold gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Baixar relatório
                        </Button>
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
                                    Tickets Vendidos
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
                                    Data do Resultado
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
