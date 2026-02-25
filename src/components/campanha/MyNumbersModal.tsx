"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Loader2, Ticket, CheckCircle2, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { QRCodeSVG } from "qrcode.react";

interface MyNumbersModalProps {
    isOpen: boolean;
    onClose: () => void;
    raffleId: string;
    settings?: any;
}

export function MyNumbersModal({ isOpen, onClose, raffleId, settings }: MyNumbersModalProps) {
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<any[] | null>(null);
    const supabase = createClient();

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!phone) return;

        setLoading(true);
        setResults(null);

        try {
            const normalizedPhone = phone.replace(/\D/g, "");

            // 1. Find customer
            const { data: customer } = await supabase
                .from("customers")
                .select("id")
                .eq("phone", normalizedPhone)
                .single();

            if (!customer) {
                setResults([]);
                return;
            }

            // 2. Find purchases
            const { data: purchases } = await supabase
                .from("purchases")
                .select("*")
                .eq("customer_id", customer.id)
                .eq("raffle_id", raffleId)
                .order("created_at", { ascending: false });

            setResults(purchases || []);
        } catch (error) {
            console.error("Error searching numbers:", error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md overflow-hidden flex flex-col max-h-[90vh]">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="text-2xl font-black">Meus Tickets</DialogTitle>
                    <DialogDescription className="text-base font-medium">
                        Digite seu WhatsApp para encontrar seus tickets comprados.
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6 pt-2 flex-1 overflow-y-auto space-y-6">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="relative flex-1">
                            <Input
                                placeholder="Ex: 11999999999"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="h-12 pl-10 text-lg font-medium"
                            />
                            <Search className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
                        </div>
                        <Button type="submit" disabled={loading} className="h-12 px-6 font-bold">
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Buscar"}
                        </Button>
                    </form>

                    {results !== null && (
                        <div className="space-y-4">
                            {results.length > 0 && results.filter(p => p.status === 'confirmed').reduce((acc, p) => acc + (p.numbers?.length || 0), 0) > 0 && (() => {
                                const confirmedTickets = results.filter((p: any) => p.status === 'confirmed').reduce((acc: number, p: any) => acc + (p.numbers?.length || 0), 0);
                                const sortedBonuses = [...(settings?.bonusTiers || [])].sort((a: any, b: any) => b.targetTickets - a.targetTickets);
                                const unlockedBonus = sortedBonuses.find(b => confirmedTickets >= b.targetTickets);

                                if (unlockedBonus && unlockedBonus.prizeUrl) {
                                    return (
                                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex flex-col items-center text-center space-y-3 shadow-sm mb-6">
                                            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl shadow-sm">🎁</div>
                                            <div>
                                                <p className="font-bold text-green-800 text-sm">Parabéns! Você ganhou: {unlockedBonus.prizeName}</p>
                                                <p className="text-xs text-green-600/80 mb-4 mt-1">{unlockedBonus.description}</p>
                                                <a href={unlockedBonus.prizeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#25D366] text-white px-5 py-2.5 rounded-lg text-xs font-bold shadow-sm hover:bg-green-600 transition-colors uppercase tracking-widest">
                                                    🔗 Acessar Meu Prêmio
                                                </a>
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            })()}

                            {results.length > 0 ? (
                                results.map((purchase) => (
                                    <div
                                        key={purchase.id}
                                        className="p-4 rounded-2xl border-2 border-muted bg-muted/30 space-y-3"
                                    >
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                                <Clock className="w-3 h-3" />
                                                {new Date(purchase.created_at).toLocaleDateString("pt-BR")}
                                            </div>
                                            <Badge
                                                variant={purchase.status === "confirmed" ? "default" : "secondary"}
                                                className={`font-bold ${purchase.status === "confirmed"
                                                    ? "bg-green-500 hover:bg-green-600"
                                                    : "bg-orange-500 hover:bg-orange-600"
                                                    } text-white`}
                                            >
                                                {purchase.status === "confirmed" ? "PAGO" : "PENDENTE"}
                                            </Badge>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {purchase.numbers.map((num: number) => (
                                                <div
                                                    key={num}
                                                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border-2 border-primary/20 text-primary font-black text-sm shadow-sm"
                                                >
                                                    {num.toString().padStart(2, "0")}
                                                </div>
                                            ))}
                                        </div>

                                        {purchase.status === "confirmed" && (
                                            <div className="pt-4 mt-2 border-t border-muted-foreground/10 flex flex-col items-center justify-center space-y-3">
                                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest text-center">QR Code do Ingresso</p>
                                                <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                                                    <QRCodeSVG
                                                        value={`ID:${purchase.id}|RAFFLE:${raffleId}`}
                                                        size={120}
                                                        level={"Q"}
                                                        includeMargin={false}
                                                    />
                                                </div>
                                                <p className="text-[10px] text-muted-foreground/60 text-center max-w-[200px] leading-tight">
                                                    Apresente este código se solicitado pelo organizador para validação dos bilhetes.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="py-12 text-center space-y-3">
                                    <Ticket className="w-12 h-12 text-muted-foreground/30 mx-auto" />
                                    <p className="text-muted-foreground font-medium">
                                        Nenhum ticket encontrado para este telefone.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="p-4 border-t bg-muted/10">
                    <Button variant="ghost" className="w-full font-bold" onClick={onClose}>
                        Fechar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
