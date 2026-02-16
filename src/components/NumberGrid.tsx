
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type NumberStatus = 'available' | 'reserved' | 'paid';

interface ReservedNumber {
    number: number;
    status: NumberStatus;
}

export function NumberGrid({
    raffleId,
    totalNumbers,
    onSelectionChange
}: {
    raffleId: string;
    totalNumbers: number;
    onSelectionChange?: (numbers: number[]) => void;
}) {
    const [reservedNumbers, setReservedNumbers] = useState<ReservedNumber[]>([]);
    const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
    const supabase = createClient();

    useEffect(() => {
        // Buscar números iniciais
        fetchReservedNumbers();

        // Inscrever em mudanças em tempo real
        const channel = supabase
            .channel('reserved-numbers-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'reserved_numbers',
                    filter: `raffle_id=eq.${raffleId}`
                },
                (payload) => {
                    console.log('Mudança detectada:', payload);
                    fetchReservedNumbers(); // Simples re-fetch para garantir consistência
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [raffleId]);

    async function fetchReservedNumbers() {
        const { data } = await supabase
            .from('reserved_numbers')
            .select('number, status, expires_at')
            .eq('raffle_id', raffleId);

        const now = new Date().toISOString();

        // Mapear para o formato correto e filtrar expirados
        const formattedData = (data || [])
            .filter(item => {
                if (item.status === 'paid') return true;
                return item.expires_at > now;
            })
            .map(item => ({
                number: item.number,
                status: item.status as NumberStatus
            }));

        setReservedNumbers(formattedData);

        // Remove from selection if it becomes reserved
        setSelectedNumbers(prev => {
            const newSelection = prev.filter(n => !formattedData.find(r => r.number === n));
            if (newSelection.length !== prev.length) {
                onSelectionChange?.(newSelection);
            }
            return newSelection;
        });
    }

    const toggleNumber = (number: number) => {
        if (reservedNumbers.find(r => r.number === number)) return;

        setSelectedNumbers(prev => {
            const newSelection = prev.includes(number)
                ? prev.filter(n => n !== number)
                : [...prev, number];

            onSelectionChange?.(newSelection);
            return newSelection;
        });
    };

    // Gerar grid de números
    const numbers = Array.from({ length: totalNumbers }, (_, i) => i + 1);

    const getStatusColor = (number: number) => {
        if (selectedNumbers.includes(number)) return 'bg-blue-600 text-white ring-2 ring-blue-600 ring-offset-2';

        const reserved = reservedNumbers.find(r => r.number === number);
        if (!reserved) return 'bg-gray-100 hover:bg-gray-200 text-gray-800 hover:scale-105 active:scale-95 cursor-pointer'; // Disponível
        if (reserved.status === 'paid') return 'bg-red-500 text-white cursor-not-allowed opacity-80'; // Pago
        return 'bg-yellow-400 text-gray-800 cursor-not-allowed opacity-80'; // Reservado
    };

    return (
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10">
            {numbers.map((number) => (
                <button
                    key={number}
                    onClick={() => toggleNumber(number)}
                    className={`p-2 rounded-lg text-center text-sm font-bold transition-all duration-200 ${getStatusColor(number)}`}
                    disabled={!!reservedNumbers.find(r => r.number === number)}
                >
                    {number}
                </button>
            ))}
        </div>
    );
}
