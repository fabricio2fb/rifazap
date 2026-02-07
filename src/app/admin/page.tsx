
"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  ExternalLink, 
  Package, 
  User, 
  CheckCircle, 
  ArrowLeft, 
  Zap, 
  MessageCircle, 
  Pencil,
  Dices,
  Users,
  Eye,
  FileText,
  Search,
  Timer,
  Info,
  Calendar
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { CreateRaffleDialog } from "@/components/admin/CreateRaffleDialog";
import { EditRaffleDialog } from "@/components/admin/EditRaffleDialog";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { MOCK_RAFFLES, MOCK_PARTICIPANTS } from "@/lib/mock-data";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("raffles");
  const [raffles, setRaffles] = useState<any[]>(MOCK_RAFFLES);
  const [sales, setSales] = useState<any[]>(MOCK_PARTICIPANTS);
  const [editingRaffle, setEditingRaffle] = useState<any>(null);
  
  // States for Draw
  const [drawingRaffle, setDrawingRaffle] = useState<any>(null);
  const [drawStep, setDrawStep] = useState<'idle' | 'counting' | 'finished'>('idle');
  const [countdown, setCountdown] = useState(5);
  const [winner, setWinner] = useState<any>(null);
  const [currentSpinNumber, setCurrentSpinNumber] = useState(0);

  // States for Summary and Winner Details
  const [summaryRaffle, setSummaryRaffle] = useState<any>(null);
  const [viewingWinner, setViewingWinner] = useState<any>(null);

  const { toast } = useToast();

  const confirmPayment = (saleId: string) => {
    setSales(prev => prev.map(sale => 
      sale.id === saleId ? { ...sale, status: 'confirmed' } : sale
    ));
    toast({ 
      title: "Pagamento confirmado!", 
      description: "O participante agora está com os números garantidos." 
    });
  };

  const handleUpdateRaffle = (updatedRaffle: any) => {
    setRaffles(prev => prev.map(r => r.id === updatedRaffle.id ? updatedRaffle : r));
    toast({
      title: "Rifa Atualizada!",
      description: "As informações foram alteradas com sucesso.",
    });
  };

  const handleCreateRaffle = (newRaffle: any) => {
    setRaffles([newRaffle, ...raffles]);
    toast({
      title: "Rifa Criada!",
      description: "Sua nova rifa foi adicionada à lista.",
    });
  };

  const confirmedNumbersForRaffle = useMemo(() => {
    if (!drawingRaffle) return [];
    const confirmedParticipants = sales.filter(s => s.raffleId === drawingRaffle.id && s.status === 'confirmed');
    const allNumbers: {num: number, buyer: any}[] = [];
    confirmedParticipants.forEach(p => {
      p.selectedNumbers.forEach((n: number) => {
        allNumbers.push({ num: n, buyer: p });
      });
    });
    return allNumbers;
  }, [drawingRaffle, sales]);

  const startDrawCeremony = () => {
    if (confirmedNumbersForRaffle.length === 0) {
      toast({
        variant: "destructive",
        title: "Sorteio Impossível",
        description: "Não há participantes com pagamento confirmado.",
      });
      return;
    }

    setDrawStep('counting');
    setCountdown(5);
    setWinner(null);

    // Countdown and Spin logic
    let count = 5;
    const interval = setInterval(() => {
      count -= 1;
      setCountdown(count);
      if (count <= 0) {
        clearInterval(interval);
        clearInterval(spinInterval);
        
        // Pick Winner
        const randomIndex = Math.floor(Math.random() * confirmedNumbersForRaffle.length);
        const chosen = confirmedNumbersForRaffle[randomIndex];
        setWinner(chosen);
        setDrawStep('finished');

        // Update Raffle Status
        setRaffles(prev => prev.map(r => 
          r.id === drawingRaffle.id ? { ...r, status: 'drawn', winner: chosen.buyer.name, winningNumber: chosen.num } : r
        ));
      }
    }, 1000);

    const spinInterval = setInterval(() => {
      setCurrentSpinNumber(Math.floor(Math.random() * 100));
    }, 100);
  };

  const getRaffleSummary = (raffleId: string) => {
    return sales.filter(s => s.raffleId === raffleId);
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/">
              <div className="p-2 hover:bg-muted rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </div>
            </Link>
            <h1 className="font-bold text-lg sm:text-xl">Painel RifaZap</h1>
          </div>
          <CreateRaffleDialog onCreate={handleCreateRaffle} />
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
        <Tabs defaultValue="raffles" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white p-1 h-12 rounded-xl shadow-sm border mb-6">
            <TabsTrigger value="raffles" className="rounded-lg font-semibold">Minhas Rifas</TabsTrigger>
            <TabsTrigger value="participants" className="rounded-lg font-semibold">Vendas</TabsTrigger>
          </TabsList>

          <TabsContent value="raffles" className="space-y-4">
            {raffles.map((raffle: any) => (
              <Card key={raffle.id} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all bg-white rounded-2xl">
                <div className="flex flex-col lg:flex-row">
                  <div className="relative w-full lg:w-64 h-48 lg:h-auto shrink-0 bg-slate-100">
                    {raffle.imageUrl && (
                      <Image src={raffle.imageUrl} alt={raffle.title} fill className="object-cover" />
                    )}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      <Badge variant={raffle.status === 'active' ? 'default' : raffle.status === 'drawn' ? 'secondary' : 'outline'} className="shadow-lg px-3 py-1 font-bold">
                        {raffle.status === 'active' ? 'ATIVA' : raffle.status === 'drawn' ? 'SORTEADA' : 'ENCERRADA'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex-1 p-6 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <CardTitle className="text-xl font-black">{raffle.title}</CardTitle>
                      <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {raffle.totalNumbers} Cotas</span>
                        <span className="text-foreground">R$ {raffle.pricePerNumber?.toFixed(2)} / cada</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-dashed">
                      <Link href={`/rifa/${raffle.slug}`} target="_blank" className="w-full">
                        <Button variant="outline" size="sm" className="w-full gap-2 text-[10px] font-bold h-10 border-2">
                          <Eye className="w-3.5 h-3.5" /> VER PÚBLICA
                        </Button>
                      </Link>

                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setEditingRaffle(raffle)}
                        className="gap-2 text-[10px] font-bold h-10 border-2"
                      >
                        <Pencil className="w-3.5 h-3.5" /> EDITAR
                      </Button>

                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setSummaryRaffle(raffle)}
                        className="gap-2 text-[10px] font-bold h-10 border-2"
                      >
                        <FileText className="w-3.5 h-3.5" /> RESUMO
                      </Button>
                      
                      <Button 
                        variant="default" 
                        size="sm" 
                        onClick={() => {
                          setDrawingRaffle(raffle);
                          setDrawStep('idle');
                        }}
                        disabled={raffle.status === 'drawn'}
                        className="gap-2 text-[10px] font-bold h-10 shadow-md bg-primary text-primary-foreground"
                      >
                        <Dices className="w-3.5 h-3.5" /> SORTEAR
                      </Button>
                    </div>

                    {raffle.status === 'drawn' && (
                      <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <Trophy className="w-8 h-8 text-green-600" />
                          <div>
                            <p className="text-[10px] font-bold text-green-700 uppercase">Ganhador</p>
                            <p className="font-black text-green-800 text-lg">{raffle.winner}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-[10px] font-bold text-green-700 uppercase">Número</p>
                            <p className="font-black text-2xl text-green-800">{raffle.winningNumber}</p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => {
                              const p = sales.find(s => s.name === raffle.winner && s.raffleId === raffle.id);
                              if (p) setViewingWinner({ ...p, winningNumber: raffle.winningNumber });
                            }}
                            className="border-green-200 text-green-700 hover:bg-green-100 font-bold h-10 px-4"
                          >
                            DETALHES
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="participants" className="space-y-4">
            <div className="grid gap-3">
              {sales.map((sale: any) => (
                <Card key={sale.id} className="border-none shadow-sm p-4 hover:bg-white transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <p className="font-bold text-base">{sale.name}</p>
                      <p className="text-xs text-muted-foreground font-medium">{sale.whatsapp}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {sale.selectedNumbers?.map((n: number) => (
                          <Badge key={n} variant="secondary" className="text-[9px] px-1.5 h-4 font-black">
                            {n.toString().padStart(2, '0')}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-lg font-black text-foreground">R$ {(sale.selectedNumbers.length * (raffles.find(r => r.id === sale.raffleId)?.pricePerNumber || 0)).toFixed(2)}</p>
                        <Badge 
                          variant={sale.status === 'confirmed' ? 'default' : 'outline'}
                          className={sale.status === 'confirmed' ? 'bg-green-500 text-white' : ''}
                        >
                          {sale.status === 'confirmed' ? 'PAGO' : 'PENDENTE'}
                        </Badge>
                      </div>
                      
                      {sale.status === 'pending' && (
                        <Button 
                          size="sm" 
                          onClick={() => confirmPayment(sale.id)} 
                          className="bg-green-500 hover:bg-green-600 text-white font-bold h-10"
                        >
                          <CheckCircle className="w-4 h-4" /> CONFIRMAR
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Ganhador Detalhado Dialog */}
      <Dialog open={!!viewingWinner} onOpenChange={(open) => !open && setViewingWinner(null)}>
        <DialogContent className="sm:max-w-md rounded-3xl p-0 overflow-hidden">
          <div className="bg-green-500 p-6 text-white text-center">
            <Trophy className="w-12 h-12 mx-auto mb-2" />
            <DialogTitle className="text-2xl font-black text-white">DADOS DO GANHADOR</DialogTitle>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-4">
              <div className="bg-muted/30 p-4 rounded-2xl border">
                <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1 tracking-widest">Nome do Participante</p>
                <p className="text-lg font-black">{viewingWinner?.name}</p>
              </div>
              <div className="bg-muted/30 p-4 rounded-2xl border">
                <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1 tracking-widest">WhatsApp de Contato</p>
                <p className="text-lg font-black">{viewingWinner?.whatsapp}</p>
              </div>
              <div className="bg-muted/30 p-4 rounded-2xl border">
                <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1 tracking-widest">Cotas Adquiridas</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {viewingWinner?.selectedNumbers.map((n: number) => (
                    <Badge 
                      key={n} 
                      variant={n === viewingWinner?.winningNumber ? "default" : "outline"} 
                      className={n === viewingWinner?.winningNumber ? "bg-green-500 text-white border-none h-8 w-10 flex items-center justify-center font-black" : "h-8 w-10 flex items-center justify-center font-bold opacity-60"}
                    >
                      {n.toString().padStart(2, '0')}
                    </Badge>
                  ))}
                </div>
                {viewingWinner?.winningNumber && (
                  <p className="mt-2 text-[10px] font-bold text-green-600 uppercase">⭐ Número {viewingWinner.winningNumber} foi o sorteado</p>
                )}
              </div>
              <div className="bg-muted/30 p-4 rounded-2xl border">
                <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1 tracking-widest">Data do Registro</p>
                <p className="text-sm font-bold">{viewingWinner?.createdAt && new Date(viewingWinner.createdAt).toLocaleString('pt-BR')}</p>
              </div>
            </div>
            <Button 
              className="w-full h-14 bg-green-500 hover:bg-green-600 text-white font-black text-lg gap-3 rounded-2xl shadow-lg mt-4"
              onClick={() => {
                const text = `🏆 *PARABÉNS!* Você foi o ganhador! Estou entrando em contato para combinarmos a entrega do prêmio.`;
                window.open(`https://wa.me/${viewingWinner.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
              }}
            >
              <MessageCircle className="w-6 h-6 fill-current" /> CONTATAR GANHADOR
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sorteio Dialog */}
      <Dialog open={!!drawingRaffle} onOpenChange={(open) => !open && setDrawingRaffle(null)}>
        <DialogContent className="sm:max-w-2xl text-center p-0 overflow-hidden rounded-3xl">
          <div className="p-8 space-y-6">
            <DialogHeader>
              <DialogTitle className="text-3xl font-black text-center flex items-center justify-center gap-2">
                <Trophy className="w-8 h-8 text-primary-foreground" />
                SORTEIO PROFISSIONAL
              </DialogTitle>
              <DialogDescription className="text-center font-bold text-lg">
                Rifa: {drawingRaffle?.title}
              </DialogDescription>
            </DialogHeader>

            {drawStep === 'idle' && (
              <div className="space-y-6">
                <div className="bg-muted/50 p-6 rounded-2xl text-left border">
                  <h4 className="font-black text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Users className="w-4 h-4" /> Participantes Aptos ({confirmedNumbersForRaffle.length})
                  </h4>
                  <ScrollArea className="h-64 pr-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {confirmedNumbersForRaffle.map((item, idx) => (
                        <div key={idx} className="bg-white p-3 rounded-xl border flex justify-between items-center shadow-sm">
                          <div>
                            <p className="font-bold text-xs">{item.buyer.name}</p>
                            <p className="text-[10px] text-muted-foreground">{item.buyer.whatsapp}</p>
                          </div>
                          <Badge className="font-black text-lg h-8 w-10 flex items-center justify-center">
                            {item.num.toString().padStart(2, '0')}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                <Button 
                  onClick={startDrawCeremony}
                  disabled={confirmedNumbersForRaffle.length === 0}
                  className="w-full h-16 bg-primary hover:bg-primary/90 text-primary-foreground font-black text-xl gap-3 rounded-2xl shadow-xl transition-all active:scale-95"
                >
                  <Dices className="w-8 h-8" /> INICIAR SORTEIO AGORA
                </Button>
              </div>
            )}

            {drawStep === 'counting' && (
              <div className="py-20 space-y-12 animate-in zoom-in duration-500">
                <div className="relative">
                  <div className="w-48 h-48 bg-primary rounded-full flex items-center justify-center mx-auto shadow-[0_0_60px_rgba(255,221,43,0.4)] animate-pulse border-8 border-white">
                    <span className="text-7xl font-black text-primary-foreground">
                      {currentSpinNumber.toString().padStart(2, '0')}
                    </span>
                  </div>
                  <div className="absolute inset-0 border-4 border-dashed border-primary/30 rounded-full animate-spin duration-[3000ms]" />
                </div>
                
                <div className="space-y-2">
                  <p className="text-2xl font-black text-muted-foreground uppercase tracking-[0.3em]">Sorteando em</p>
                  <p className="text-6xl font-black text-primary-foreground animate-bounce">{countdown}s</p>
                </div>
              </div>
            )}

            {drawStep === 'finished' && winner && (
              <div className="py-8 space-y-8 animate-in zoom-in duration-500">
                <div className="relative">
                  <div className="w-48 h-48 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-2xl border-8 border-white">
                    <span className="text-7xl font-black text-white">{winner.num.toString().padStart(2, '0')}</span>
                  </div>
                  <Zap className="absolute -top-6 -right-6 w-16 h-16 text-yellow-500 fill-current animate-bounce" />
                </div>
                
                <div className="space-y-2">
                  <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">GANHADOR(A)</p>
                  <h3 className="text-4xl font-black text-foreground">{winner.buyer.name}</h3>
                </div>

                <div className="grid grid-cols-1 gap-3 px-6">
                  <Button 
                    className="w-full h-16 bg-green-500 hover:bg-green-600 text-white font-black text-xl gap-3 rounded-2xl shadow-lg"
                    onClick={() => {
                      const text = `🏆 *PARABÉNS!* Você foi o ganhador da rifa *${drawingRaffle.title}* com o número *${winner.num}*! 🥳`;
                      window.open(`https://wa.me/${winner.buyer.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
                    }}
                  >
                    <MessageCircle className="w-7 h-7 fill-current" /> AVISAR GANHADOR
                  </Button>
                  <Button variant="ghost" onClick={() => setDrawingRaffle(null)} className="font-bold">
                    Fechar Sorteio
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Resumo Detalhado Dialog */}
      <Dialog open={!!summaryRaffle} onOpenChange={(open) => !open && setSummaryRaffle(null)}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col p-0 rounded-3xl overflow-hidden">
          <div className="bg-primary p-8 text-primary-foreground relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <FileText className="w-24 h-24" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-primary-foreground">RESUMO DETALHADO</DialogTitle>
              <DialogDescription className="text-primary-foreground/90 font-bold text-lg">
                {summaryRaffle?.title}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
              <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-black/10">
                <p className="text-[10px] font-bold uppercase tracking-widest text-black">Total Vendas</p>
                <p className="text-2xl font-black text-black">{getRaffleSummary(summaryRaffle?.id).length}</p>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-black/10">
                <p className="text-[10px] font-bold uppercase tracking-widest text-black">Confirmadas</p>
                <p className="text-2xl font-black text-black">
                  {getRaffleSummary(summaryRaffle?.id).filter(s => s.status === 'confirmed').length}
                </p>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-black/10">
                <p className="text-[10px] font-bold uppercase tracking-widest text-black">Pendentes</p>
                <p className="text-2xl font-black text-black">
                  {getRaffleSummary(summaryRaffle?.id).filter(s => s.status === 'pending').length}
                </p>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-black/10">
                <p className="text-[10px] font-bold uppercase tracking-widest text-black">Arrecadado</p>
                <p className="text-2xl font-black text-black">
                  R$ {getRaffleSummary(summaryRaffle?.id)
                    .filter(s => s.status === 'confirmed')
                    .reduce((acc, curr) => acc + (curr.selectedNumbers.length * (summaryRaffle?.pricePerNumber || 0)), 0)
                    .toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8">
            <h4 className="font-black text-sm uppercase tracking-widest mb-4 flex items-center gap-2 text-muted-foreground">
              <Users className="w-4 h-4" /> Detalhamento de Compradores
            </h4>
            
            <div className="space-y-3">
              {getRaffleSummary(summaryRaffle?.id).length === 0 ? (
                <div className="py-20 text-center border-2 border-dashed rounded-3xl bg-muted/20">
                  <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p className="font-bold text-muted-foreground">Nenhuma venda registrada.</p>
                </div>
              ) : (
                getRaffleSummary(summaryRaffle?.id).map((p: any) => (
                  <div key={p.id} className="p-5 border rounded-2xl bg-white shadow-sm flex flex-col sm:flex-row justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-black text-lg">{p.name}</p>
                        <Badge variant={p.status === 'confirmed' ? 'default' : 'outline'} className={p.status === 'confirmed' ? 'bg-green-500 text-white' : ''}>
                          {p.status === 'confirmed' ? 'PAGO' : 'PENDENTE'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
                        <span className="flex items-center gap-1.5"><MessageCircle className="w-3.5 h-3.5" /> {p.whatsapp}</span>
                        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(p.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 justify-end content-center max-w-[200px]">
                      {p.selectedNumbers.map((n: number) => (
                        <span key={n} className="text-xs font-black bg-muted px-2 py-1 rounded-lg border shadow-sm">
                          {n.toString().padStart(2, '0')}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <DialogFooter className="p-6 bg-muted/30 border-t">
            <Button className="w-full h-12 rounded-xl font-black" onClick={() => setSummaryRaffle(null)}>
              FECHAR RELATÓRIO
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <EditRaffleDialog 
        raffle={editingRaffle} 
        isOpen={!!editingRaffle} 
        onClose={() => setEditingRaffle(null)} 
        onUpdate={handleUpdateRaffle} 
      />
    </div>
  );
}
