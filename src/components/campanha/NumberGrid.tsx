
"use client";

import { cn } from "@/lib/utils";
import { NumberStatus } from "@/lib/types";
import { useMemo } from "react";

// Tipagem das propriedades que este componente recebe
// totalNumbers: Quantidade total de bilhetes/números da rifa
// paidNumbers: Array com os números que já foram pagos e não podem ser escolhidos
// reservedNumbers: Array com os números que estão reservados aguardando pagamento
// selectedNumbers: Array de números que o usuário clicou e quer comprar
// onNumberClick: Função disparada quando um número livre é clicado
// primaryColor: Cor de destaque opcional vinda das configurações do criador
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
  // Cria um array numérico contínuo de 1 até o "totalNumbers".
  // O useMemo garante que esse loop só rode de novo se o total mudar.
  const numbers = useMemo(() => Array.from({ length: totalNumbers }, (_, i) => i + 1), [totalNumbers]);

  return (
    // Container principal do Grid. 
    // Adapta o número de colunas conforme o tamanho da tela (5 no mobile, 8 sm, 10 md).
    <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 p-4 bg-white rounded-xl shadow-sm border border-border">
      {numbers.map((num) => {
        // Verifica o status deste número específico checando nos arrays das props
        const isPaid = paidNumbers.includes(num);
        const isReserved = reservedNumbers.includes(num);
        const isSelected = selectedNumbers.includes(num);

        // Define a variável "status" que mapeia para o estilo correto
        let status: NumberStatus = 'available'; // Padrão é livre
        if (isPaid) status = 'paid';
        else if (isReserved) status = 'reserved';

        return (
          <button
            key={num}
            // Botão fica desabilitado se já estiver pago ou reservado
            disabled={isPaid || isReserved}
            // Dispara a prop de seleção ao clicar no número
            onClick={() => onNumberClick(num)}
            // Aplica a cor do tema dinamicamente se o número estiver selecionado
            style={isSelected && primaryColor ? { backgroundColor: primaryColor, borderColor: primaryColor } : {}}
            className={cn(
              // Classes bases: quadrado(aspect-square), centralizado, fonte
              "aspect-square flex items-center justify-center rounded-md text-sm font-semibold transition-all border",
              // Se tiver livre: cor branda. Se não estiver selecionado, aplica os hovers
              status === 'available' && !isSelected && "bg-campanha-available/20 text-campanha-available border-campanha-available/30 hover:bg-campanha-available/30",
              // Se tiver pago: cinza/escuro e não clicável
              status === 'paid' && "bg-campanha-paid text-white border-transparent cursor-not-allowed",
              // Se tiver reservado: laranja e não clicável
              status === 'reserved' && "bg-campanha-reserved text-white border-transparent cursor-not-allowed",
              // Se tiver selecionado E não houver uma cor de tema definida, usa a cor primária padrão
              isSelected && (!primaryColor && "bg-primary border-primary-foreground"),
              // Efeitos extras de quando está selecionado
              isSelected && "text-white shadow-md scale-105"
            )}
          >
            {/* Imprime o número usando 2 casas. Ex: '01', '09', '14' */}
            {num.toString().padStart(2, '0')}
          </button>
        );
      })}
    </div>
  );
}
