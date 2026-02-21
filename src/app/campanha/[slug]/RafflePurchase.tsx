
'use client';

import { useState } from 'react';
import { NumberGrid } from '@/components/NumberGrid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

export default function RafflePurchase({ raffle }: { raffle: any }) {
    const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [purchaseSuccess, setPurchaseSuccess] = useState(false);
    const { toast } = useToast();

    const total = selectedNumbers.length * raffle.ticket_price;

    async function handlePurchase(e: React.FormEvent) {
        e.preventDefault();
        if (selectedNumbers.length === 0) {
            alert('Selecione pelo menos um número.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`/api/campanha_api/${raffle.slug}/purchase`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    phone,
                    numbers: selectedNumbers,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao realizar compra');
            }

            setPurchaseSuccess(true);
            setSelectedNumbers([]);
            setName('');
            setPhone('');

        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    }

    if (purchaseSuccess) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center space-y-4 animate-in zoom-in duration-300">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-3xl">🎉</span>
                </div>
                <h3 className="text-2xl font-bold text-green-900">Reserva Confirmada!</h3>
                <p className="text-green-800">Seus números foram reservados com sucesso.</p>
                <div className="bg-white p-4 rounded-lg border border-green-100 shadow-sm">
                    <p className="font-mono text-sm break-all">Copie o código PIX para pagar (Simulação)</p>
                    <p className="text-xs text-muted-foreground mt-2">O código PIX seria gerado aqui.</p>
                </div>
                <Button onClick={() => setPurchaseSuccess(false)} variant="outline" className="w-full">
                    Fazer nova reserva
                </Button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-xl border overflow-hidden">
            <Toaster />
            <div className="bg-slate-900 p-6 text-white text-center">
                <h2 className="text-xl font-bold flex items-center justify-center gap-2">
                    <Zap className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    Escolha seus números
                </h2>
                <p className="text-slate-400 text-sm mt-1">Clique para selecionar</p>
            </div>

            <div className="p-6 space-y-8">
                {/* Grid */}
                <div className="max-h-[400px] overflow-y-auto scrollbar-thin pr-2">
                    <NumberGrid
                        raffleId={raffle.id}
                        totalNumbers={raffle.total_numbers}
                        onSelectionChange={setSelectedNumbers}
                    />
                </div>

                {/* Selection Summary */}
                <div className="bg-gray-50 p-4 rounded-lg border flex justify-between items-center">
                    <div>
                        <p className="text-sm text-muted-foreground">Selecionados</p>
                        <p className="font-bold text-lg">{selectedNumbers.length} números</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="font-bold text-2xl text-primary">R$ {total.toFixed(2)}</p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handlePurchase} className="space-y-4 pt-4 border-t">
                    <div className="space-y-2">
                        <Label htmlFor="name">Seu Nome Completo</Label>
                        <Input
                            id="name"
                            placeholder="Ex: João da Silva"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                            className="h-12"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">WhatsApp (com DDD)</Label>
                        <Input
                            id="phone"
                            placeholder="(00) 00000-0000"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            required
                            className="h-12"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-14 text-lg font-bold rounded-xl"
                        disabled={loading || selectedNumbers.length === 0}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                Processando...
                            </>
                        ) : (
                            `Pagar R$ ${total.toFixed(2)}`
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
}
