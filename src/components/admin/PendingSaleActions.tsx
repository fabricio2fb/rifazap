"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Timer, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function PendingSaleActions({ sale, timeDrift, onConfirm, onCancel }: any) {
    const [secondsRemaining, setSecondsRemaining] = useState<number>(600);
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        if (sale.status !== "pending") return;

        const calculateRemainingTime = () => {
            // FORÇA PARSING UTC: Algumas versões de browsers/SUpabase podem omitir o Z ou fuso,
            // garantimos que o Date trate como UTC absoluto.
            const createdAtStr = sale.createdAt.includes('Z') || sale.createdAt.includes('+')
                ? sale.createdAt
                : `${sale.createdAt}Z`;

            const createdAt = new Date(createdAtStr).getTime();
            // Source of Truth: SERVER TIME (Local + Drift)
            const now = Date.now() + (timeDrift || 0);

            const diffMs = now - createdAt;
            const limitMs = 15 * 60 * 1000; // 15 minutos de reserva

            // Valor real sem travas artificiais que escondem erros
            let remaining = Math.floor((limitMs - diffMs) / 1000);

            if (remaining < 0) remaining = 0;

            setSecondsRemaining(remaining);
            setIsExpired(remaining <= 0);
        };

        calculateRemainingTime();
        const interval = setInterval(calculateRemainingTime, 1000);
        return () => clearInterval(interval);
    }, [sale.createdAt, sale.status, timeDrift]);

    const formatTime = (s: number) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // 1. ESTADO: PAGO / CONFIRMADO -> Apenas selo de sucesso, sem botões
    if (sale.status === "confirmed" || sale.status === "paid" || sale.status === "paid_delayed") {
        return (
            <div className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-2xl border border-green-100 gap-2">
                <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <span className="text-[12px] font-black text-green-700 uppercase tracking-tighter text-center">Pagamento Confirmado</span>
            </div>
        );
    }

    // 2. ESTADO: CANCELADO -> Apenas botão de Reviver
    if (sale.status === "cancelled") {
        return (
            <Button size="sm" onClick={() => onConfirm(sale.id, true)} className="bg-amber-500 w-full text-[10px] h-9 text-white font-black shadow-lg shadow-amber-200/50 hover:bg-amber-600">
                <Timer className="w-4 h-4 mr-2" /> PAGO C ATRASO
            </Button>
        );
    }

    // 3. ESTADO: PENDENTE -> Timer + Confirmar/Confirmar Atraso + Cancelar
    return (
        <div className="flex flex-col gap-3 w-full">
            <Badge variant="outline" className={cn(
                "justify-center h-8 text-[11px] font-black tracking-tight border-2",
                isExpired
                    ? "text-red-600 bg-red-50 border-red-100"
                    : "text-orange-600 bg-orange-50 border-orange-100"
            )}>
                {isExpired ? (
                    <span className="flex items-center gap-1.5"><XCircle className="w-3 h-3" /> RESERVA EXPIRADA</span>
                ) : (
                    <span className="flex items-center gap-1.5"><Timer className="w-3 h-3" /> EXPIRA EM: {formatTime(secondsRemaining)}</span>
                )}
            </Badge>

            <div className="flex flex-col gap-2">
                {isExpired ? (
                    <Button
                        size="sm"
                        onClick={() => onConfirm(sale.id, true)}
                        className="text-[11px] h-9 text-white font-black bg-amber-500 hover:bg-amber-600 shadow-md shadow-amber-200 active:scale-95"
                    >
                        CONFIRMAR PAGO C/ ATRASO
                    </Button>
                ) : (
                    <>
                        <Button
                            size="sm"
                            onClick={() => onConfirm(sale.id, false)}
                            className="text-[11px] h-9 text-white font-black bg-green-600 hover:bg-green-700 shadow-md shadow-green-200 active:scale-95"
                        >
                            CONFIRMAR PAGAMENTO
                        </Button>

                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onCancel(sale.id)}
                            className="text-[11px] h-9 text-red-500 hover:bg-red-50 font-bold"
                        >
                            <XCircle className="w-4 h-4 mr-2" /> CANCELAR RESERVA
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}