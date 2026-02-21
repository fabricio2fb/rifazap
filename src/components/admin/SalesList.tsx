"use client";

import { Badge } from "@/components/ui/badge";
import { Calendar, Phone, Ticket } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PendingSaleActions } from "./PendingSaleActions";
import { cn } from "@/lib/utils";

interface SalesListProps {
    sales: any[];
    raffles: any[];
    timeDrift: number;
    onConfirm: (id: string, isLate?: boolean) => void;
    onCancel: (id: string) => void;
}

export default function SalesList({ sales, raffles, timeDrift, onConfirm, onCancel }: SalesListProps) {
    return (
        <div className="grid gap-4">
            {sales.map((sale) => {
                const raffle = raffles.find((r) => r.id === sale.raffleId);

                return (
                    <div
                        key={sale.id}
                        className={cn(
                            "group relative overflow-hidden p-8 rounded-[32px] shadow-sm hover:shadow-md transition-all border border-slate-100",
                            sale.status === "confirmed" || sale.status === "paid" || sale.status === "paid_delayed"
                                ? "bg-gradient-to-br from-white to-green-50/30"
                                : sale.status === "pending"
                                    ? "bg-gradient-to-br from-white to-orange-50/30"
                                    : "bg-gradient-to-br from-white to-red-50/30"
                        )}
                    >
                        {/* Status Accent Bar */}
                        <div className={cn(
                            "absolute left-0 top-0 bottom-0 w-1.5",
                            sale.status === "confirmed" || sale.status === "paid" || sale.status === "paid_delayed"
                                ? "bg-green-500"
                                : sale.status === "pending"
                                    ? "bg-orange-500"
                                    : "bg-red-500"
                        )} />

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="space-y-4 flex-1">
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "h-12 w-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm border",
                                        sale.status === "confirmed" || sale.status === "paid" || sale.status === "paid_delayed"
                                            ? "bg-green-100 text-green-700 border-green-200"
                                            : sale.status === "pending"
                                                ? "bg-orange-100 text-orange-700 border-orange-200"
                                                : "bg-red-100 text-red-700 border-red-200"
                                    )}>
                                        {sale.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <span className="font-black text-xl tracking-tight block">
                                            {sale.name}
                                        </span>
                                        <span className={cn(
                                            "text-[10px] font-black uppercase tracking-wider",
                                            sale.status === "confirmed" || sale.status === "paid" || sale.status === "paid_delayed"
                                                ? "text-green-600"
                                                : sale.status === "pending"
                                                    ? "text-orange-600"
                                                    : "text-red-600"
                                        )}>
                                            {sale.status === "confirmed" || sale.status === "paid" || sale.status === "paid_delayed"
                                                ? "Confirmado"
                                                : sale.status === "pending"
                                                    ? "Aguardando"
                                                    : "Cancelado"}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm font-medium text-slate-500">
                                    <div className="flex items-center gap-2.5 text-blue-600 bg-blue-50/50 px-3 py-1.5 rounded-full w-fit border border-blue-100/50">
                                        <Phone className="w-4 h-4" /> {sale.whatsapp}
                                    </div>
                                    <div className="flex items-center gap-2.5 bg-slate-100/50 px-3 py-1.5 rounded-full w-fit border border-slate-200/50 text-slate-700">
                                        <Ticket className="w-4 h-4 text-slate-400" /> {raffle?.title || "Campanha não encontrada"}
                                    </div>
                                    <div className="flex items-center gap-2.5 bg-slate-100/50 px-3 py-1.5 rounded-full w-fit border border-slate-200/50">
                                        <Calendar className="w-4 h-4 text-slate-400" />
                                        {format(new Date(sale.createdAt), "dd MMM 'às' HH:mm", { locale: ptBR })}
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 mt-4">
                                    {sale.selectedNumbers.map((num: number) => (
                                        <span key={num} className="bg-slate-900 text-white min-w-[36px] h-9 flex items-center justify-center rounded-xl text-xs font-black shadow-lg border border-slate-800">
                                            {String(num).padStart(2, '0')}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="w-full md:w-56 border-t md:border-t-0 md:border-l border-slate-200/50 pt-6 md:pt-0 md:pl-8">
                                <PendingSaleActions
                                    sale={sale}
                                    timeDrift={timeDrift}
                                    onConfirm={onConfirm}
                                    onCancel={onCancel}
                                />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
