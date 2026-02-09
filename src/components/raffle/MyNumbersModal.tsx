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

interface MyNumbersModalProps {
    isOpen: boolean;
    onClose: () => void;
    raffleId: string;
}

export function MyNumbersModal({ isOpen, onClose, raffleId }: MyNumbersModalProps) {
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
                    <DialogTitle className="text-2xl font-black">Meus Números</DialogTitle>
                    <DialogDescription className="text-base font-medium">
                        Digite seu WhatsApp para encontrar seus números comprados.
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
                                    </div>
                                ))
                            ) : (
                                <div className="py-12 text-center space-y-3">
                                    <Ticket className="w-12 h-12 text-muted-foreground/30 mx-auto" />
                                    <p className="text-muted-foreground font-medium">
                                        Nenhum número encontrado para este telefone.
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
