
"use client";

import { cn } from "@/lib/utils";
import { NumberStatus } from "@/lib/types";
import { useMemo } from "react";

interface NumberGridProps {
  totalNumbers: number;
  paidNumbers: number[];
  reservedNumbers: number[];
  selectedNumbers: number[];
  onNumberClick: (num: number) => void;
  primaryColor?: string;
}

export function NumberGrid({
  totalNumbers,
  paidNumbers,
  reservedNumbers,
  selectedNumbers,
  onNumberClick,
  primaryColor,
}: NumberGridProps) {
  const numbers = useMemo(() => Array.from({ length: totalNumbers }, (_, i) => i + 1), [totalNumbers]);

  return (
    <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 p-4 bg-white rounded-xl shadow-sm border border-border">
      {numbers.map((num) => {
        const isPaid = paidNumbers.includes(num);
        const isReserved = reservedNumbers.includes(num);
        const isSelected = selectedNumbers.includes(num);

        let status: NumberStatus = 'available';
        if (isPaid) status = 'paid';
        else if (isReserved) status = 'reserved';

        return (
          <button
            key={num}
            disabled={isPaid || isReserved}
            onClick={() => onNumberClick(num)}
            style={isSelected && primaryColor ? { backgroundColor: primaryColor, borderColor: primaryColor } : {}}
            className={cn(
              "aspect-square flex items-center justify-center rounded-md text-sm font-semibold transition-all border",
              status === 'available' && !isSelected && "bg-campanha-available/20 text-campanha-available border-campanha-available/30 hover:bg-campanha-available/30",
              status === 'paid' && "bg-campanha-paid text-white border-transparent cursor-not-allowed",
              status === 'reserved' && "bg-campanha-reserved text-white border-transparent cursor-not-allowed",
              isSelected && (!primaryColor && "bg-primary border-primary-foreground"),
              isSelected && "text-white shadow-md scale-105"
            )}
          >
            {num.toString().padStart(2, '0')}
          </button>
        );
      })}
    </div>
  );
}
