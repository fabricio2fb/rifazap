
"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { NumberGrid } from "@/components/raffle/NumberGrid";
import { CheckoutModal } from "@/components/raffle/CheckoutModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Calendar, Trophy, CheckCircle, Info } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { MOCK_RAFFLES, MOCK_PARTICIPANTS } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";

export default function PublicRafflePage() {
  const { slug } = useParams();
  const { toast } = useToast();
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const raffle = useMemo(() => 
    MOCK_RAFFLES.find(r => r.slug === slug) || MOCK_RAFFLES[0]
  , [slug]);

  // Atualiza tags Open Graph dinamicamente (para preview em navegadores, embora WhatsApp exija SSR para o card completo)
  useEffect(() => {
    if (raffle) {
      document.title = raffle.title;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) metaDescription.setAttribute("content", raffle.description);
    }
  }, [raffle]);

  const paidNumbers = useMemo(() => 
    MOCK_PARTICIPANTS
      .filter(p => p.raffleId === raffle.id && p.status === 'confirmed')
      .flatMap(p => p.selectedNumbers) || [], 
  [raffle]);

  const reservedNumbers = useMemo(() => 
    MOCK_PARTICIPANTS
      .filter(p => p.raffleId === raffle.id && p.status === 'pending')
      .flatMap(p => p.selectedNumbers) || [], 
  [raffle]);

  if (!raffle) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-background">
        <h1 className="text-2xl font-bold mb-2">Rifa não encontrada</h1>
        <p className="text-muted-foreground mb-6">Verifique se o link está correto.</p>
        <Button onClick={() => window.location.href = '/'}>Voltar para Início</Button>
      </div>
    );
  }

  const totalSold = paidNumbers.length + reservedNumbers.length;
  const progressPercent = (totalSold / raffle.totalNumbers) * 100;

  const handleNumberClick = (num: number) => {
    setSelectedNumbers(prev => 
      prev.includes(num) ? prev.filter(n => n !== num) : [...prev, num]
    );
  };

  const shareOnWhatsApp = () => {
    const url = window.location.href;
    const price = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(raffle.pricePerNumber);
    const date = new Date(raffle.drawDate).toLocaleDateString('pt-BR');
    
    const text = `🎟️ *RIFA ATIVA*

*Prêmio:* ${raffle.title}
*Valor por número:* ${price}
*Sorteio:* ${date}

👉 *Garanta o seu número:* ${url}`;

    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
  };

  return (
    <div className="max-w-xl mx-auto pb-32 bg-white min-h-screen">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        {raffle.imageUrl && (
          <Image 
            src={raffle.imageUrl} 
            alt={raffle.title} 
            fill 
            className="object-cover"
            priority
          />
        )}
        <div className="absolute top-4 left-4">
          <Badge className="bg-rifa-available text-white border-none px-3 py-1 text-sm font-bold uppercase tracking-wider">
            {raffle.status === 'active' ? 'Ativa' : raffle.status}
          </Badge>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold leading-tight">{raffle.title}</h1>
          <p className="text-muted-foreground">{raffle.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted/30 p-4 rounded-xl border border-border flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg text-primary-foreground">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold">Valor</p>
              <p className="font-bold text-lg">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(raffle.pricePerNumber)}
              </p>
            </div>
          </div>
          <div className="bg-muted/30 p-4 rounded-xl border border-border flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg text-green-700">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold">Sorteio</p>
              <p className="font-bold text-sm">{new Date(raffle.drawDate).toLocaleDateString('pt-BR')}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span>Progresso da Rifa</span>
            <span>{Math.round(progressPercent)}% Vendido</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        <div className="flex flex-col gap-3">
          <Button 
            className="w-full gap-2 font-bold h-14 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl shadow-md transition-all active:scale-95" 
            onClick={shareOnWhatsApp}
          >
            <MessageCircle className="w-6 h-6 fill-current" /> Compartilhar no WhatsApp
          </Button>
          
          {raffle.whatsappGroupLink && (
            <Button 
              variant="outline" 
              className="w-full gap-2 border-green-200 text-green-600 hover:bg-green-50 font-bold h-12 rounded-xl"
              onClick={() => window.open(raffle.whatsappGroupLink, '_blank')}
            >
              <MessageCircle className="w-4 h-4" /> Grupo WhatsApp
            </Button>
          )}
        </div>

        <div className="pt-4 space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Info className="w-5 h-5 text-primary-foreground/50" />
            Selecione seus números
          </h2>
          
          <div className="flex flex-wrap gap-4 text-xs font-semibold uppercase">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-rifa-available/20 border border-rifa-available/20" />
              <span>Livre</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-rifa-reserved" />
              <span>Reservado</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-rifa-paid" />
              <span>Pago</span>
            </div>
          </div>

          <NumberGrid
            totalNumbers={raffle.totalNumbers}
            paidNumbers={paidNumbers}
            reservedNumbers={reservedNumbers}
            selectedNumbers={selectedNumbers}
            onNumberClick={handleNumberClick}
          />
        </div>
      </div>

      {selectedNumbers.length > 0 && (
        <div className="fixed bottom-6 left-6 right-6 z-50 animate-in slide-in-from-bottom-4">
          <Button 
            onClick={() => setIsCheckoutOpen(true)}
            className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl flex items-center justify-between px-6 border-4 border-white"
          >
            <div className="text-left">
              <p className="text-xs opacity-70 font-semibold uppercase">{selectedNumbers.length} números selecionados</p>
              <p className="text-xl font-bold">Quero esses!</p>
            </div>
            <div className="bg-white/20 p-2 rounded-lg">
              <CheckCircle className="w-6 h-6" />
            </div>
          </Button>
        </div>
      )}

      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)}
        selectedNumbers={selectedNumbers}
        raffle={raffle}
      />
    </div>
  );
}
