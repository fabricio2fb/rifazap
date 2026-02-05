
"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { NumberGrid } from "@/components/raffle/NumberGrid";
import { CheckoutModal } from "@/components/raffle/CheckoutModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, MessageCircle, Calendar, Trophy, CheckCircle, Info, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useCollection, useFirestore } from "@/firebase";
import { collection, query, where, limit } from "firebase/firestore";

export default function PublicRafflePage() {
  const { slug } = useParams();
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const db = useFirestore();

  // Buscar dados da rifa pelo slug
  const raffleQuery = useMemo(() => 
    db ? query(collection(db, "raffles"), where("slug", "==", slug), limit(1)) : null
  , [db, slug]);
  
  const { data: raffleData, loading: raffleLoading } = useCollection<any>(raffleQuery);
  const raffle = raffleData?.[0];

  // Buscar participantes da rifa
  const participantsQuery = useMemo(() => 
    db && raffle ? query(collection(db, "participants"), where("raffleId", "==", raffle.id)) : null
  , [db, raffle]);
  
  const { data: participants } = useCollection<any>(participantsQuery);

  const paidNumbers = useMemo(() => 
    participants?.filter(p => p.status === 'confirmed').flatMap(p => p.selectedNumbers) || [], 
  [participants]);

  const reservedNumbers = useMemo(() => 
    participants?.filter(p => p.status === 'pending').flatMap(p => p.selectedNumbers) || [], 
  [participants]);

  if (raffleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary-foreground" />
      </div>
    );
  }

  if (!raffle) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-background">
        <h1 className="text-2xl font-bold mb-2">Rifa não encontrada</h1>
        <p className="text-muted-foreground mb-6">Verifique se o link está correto ou se a rifa ainda está ativa.</p>
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

  const shareRaffle = () => {
    if (navigator.share) {
      navigator.share({
        title: raffle.title,
        text: raffle.description,
        url: window.location.href,
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto pb-32 bg-white min-h-screen">
      {/* Visual Header */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image 
          src={raffle.imageUrl} 
          alt={raffle.title} 
          fill 
          className="object-cover"
          priority
        />
        <div className="absolute top-4 left-4">
          <Badge className="bg-rifa-available text-white border-none px-3 py-1 text-sm font-bold uppercase tracking-wider">
            {raffle.status === 'active' ? 'Ativa' : raffle.status}
          </Badge>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Raffle Details */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold leading-tight">{raffle.title}</h1>
          <p className="text-muted-foreground">{raffle.description}</p>
        </div>

        {/* Stats Card */}
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

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span>Progresso da Rifa</span>
            <span>{Math.round(progressPercent)}% Vendido</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 gap-2" onClick={shareRaffle}>
            <Share2 className="w-4 h-4" /> Compartilhar
          </Button>
          {raffle.whatsappGroupLink && (
            <Button 
              variant="outline" 
              className="flex-1 gap-2 border-green-200 text-green-600 hover:bg-green-50"
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
          
          {/* Status Legend */}
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

      {/* Floating Action Bar */}
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
