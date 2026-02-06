
"use client";

import { useState, useMemo } from "react";
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
  Search
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

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("raffles");
  const [raffles, setRaffles] = useState<any[]>(MOCK_RAFFLES);
  const [sales, setSales] = useState<any[]>(MOCK_PARTICIPANTS);
  const [editingRaffle, setEditingRaffle] = useState<any>(null);
  
  // States for Draw and Summary
  const [drawingRaffle, setDrawingRaffle] = useState<any>(null);
  const [summaryRaffle, setSummaryRaffle] = useState<any>(null);
  const [winner, setWinner] = useState<any>(null);
  const [isDrawing, setIsDrawing] = useState(false);

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

  const handleShareWhatsApp = (raffle: any) => {
    const url = `${window.location.origin}/rifa/${raffle.slug}`;
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

  const performDraw = (raffle: any) => {
    const confirmedParticipants = sales.filter(s => s.raffleId === raffle.id && s.status === 'confirmed');
    
    if (confirmedParticipants.length === 0) {
      toast({
        variant: "destructive",
        title: "Sorteio Impossível",
        description: "Não há participantes com pagamento confirmado nesta rifa.",
      });
      return;
    }

    setIsDrawing(true);
    setDrawingRaffle(raffle);
    setWinner(null);

    // Simulação de animação de sorteio
    setTimeout(() => {
      const allConfirmedNumbers: {num: number, buyer: any}[] = [];
      confirmedParticipants.forEach(p => {
        p.selectedNumbers.forEach((n: number) => {
          allConfirmedNumbers.push({ num: n, buyer: p });
        });
      });

      const randomIndex = Math.floor(Math.random() * allConfirmedNumbers.length);
      const chosen = allConfirmedNumbers[randomIndex];
      
      setWinner(chosen);
      setIsDrawing(false);

      // Atualiza status da rifa
      setRaffles(prev => prev.map(r => 
        r.id === raffle.id ? { ...r, status: 'drawn', winner: chosen.buyer.name, winningNumber: chosen.num } : r
      ));
    }, 3000);
  };

  const getRaffleSummary = (raffleId: string) => {
    return sales.filter(s => s.raffleId === raffleId && s.status === 'confirmed');
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
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Suas Campanhas</h2>
            </div>

            {raffles.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-muted flex flex-col items-center px-6">
                <Package className="w-12 h-12 text-muted-foreground opacity-20 mb-4" />
                <p className="text-muted-foreground font-semibold">Nenhuma rifa encontrada</p>
                <p className="text-sm text-muted-foreground mb-6">Crie sua primeira rifa para começar.</p>
                <CreateRaffleDialog onCreate={handleCreateRaffle} />
              </div>
            ) : (
              <div className="grid gap-6">
                {raffles.map((raffle: any) => (
                  <Card key={raffle.id} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all bg-white rounded-2xl">
                    <div className="flex flex-col lg:flex-row">
                      <div className="relative w-full lg:w-64 h-48 lg:h-auto shrink-0 bg-slate-100">
                        {raffle.imageUrl && (
                          <Image src={raffle.imageUrl} alt={raffle.title} fill className="object-cover" />
                        )}
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                          <Badge variant={raffle.status === 'active' ? 'default' : raffle.status === 'drawn' ? 'secondary' : 'outline'} className="shadow-lg px-3 py-1 font-bold">
                            {raffle.status === 'active' ? 'ATUANDO' : raffle.status === 'drawn' ? 'SORTEADA' : 'ENCERRADA'}
                          </Badge>
                          {raffle.status === 'drawn' && (
                            <Badge className="bg-green-500 text-white border-none shadow-md">
                              Ganhador: {raffle.winningNumber}
                            </Badge>
                          )}
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
                            onClick={() => handleShareWhatsApp(raffle)}
                            className="gap-2 text-[10px] font-bold h-10 border-2 border-green-200 text-green-600 hover:bg-green-50"
                          >
                            <MessageCircle className="w-3.5 h-3.5 fill-current" /> WHATSAPP
                          </Button>

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
                            className="gap-2 text-[10px] font-bold h-10 border-2 border-primary/40 text-primary-foreground"
                          >
                            <FileText className="w-3.5 h-3.5" /> RESUMO
                          </Button>
                        </div>

                        <div className="pt-2">
                          {raffle.status === 'drawn' ? (
                            <Button 
                              disabled
                              className="w-full h-12 bg-muted text-muted-foreground font-black text-sm gap-2 rounded-xl"
                            >
                              <Trophy className="w-4 h-4" /> SORTEIO REALIZADO: {raffle.winner}
                            </Button>
                          ) : (
                            <Button 
                              onClick={() => performDraw(raffle)}
                              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-black text-sm gap-2 rounded-xl shadow-md transition-all active:scale-95"
                            >
                              <Dices className="w-5 h-5" /> REALIZAR SORTEIO AGORA
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="participants" className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Fluxo de Caixa e Reservas</h2>
              <Badge variant="outline" className="bg-white">{sales.length} Lançamentos</Badge>
            </div>

            {sales.length === 0 ? (
              <div className="py-24 text-center bg-white rounded-2xl border-2 border-dashed flex flex-col items-center px-6">
                <Users className="w-12 h-12 opacity-10 mb-4" />
                <p className="font-semibold text-muted-foreground">Aguardando vendas...</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {sales.map((sale: any) => (
                  <Card key={sale.id} className="border-none shadow-sm p-4 hover:bg-white transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="space-y-1">
                          <p className="font-bold text-base leading-none">{sale.name}</p>
                          <p className="text-xs text-muted-foreground font-medium">{sale.whatsapp}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {sale.selectedNumbers?.map((n: number) => (
                              <Badge key={n} variant="secondary" className="text-[9px] px-1.5 h-4 font-black">
                                {n.toString().padStart(2, '0')}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-none pt-3 md:pt-0">
                        <div className="text-left md:text-right">
                          <p className="text-lg font-black text-foreground">R$ {sale.totalAmount?.toFixed(2) || (sale.selectedNumbers.length * (raffles.find(r => r.id === sale.raffleId)?.pricePerNumber || 0)).toFixed(2)}</p>
                          <Badge 
                            variant={sale.status === 'confirmed' ? 'default' : 'outline'}
                            className={sale.status === 'pending' ? 'bg-rifa-reserved/10 text-rifa-reserved border-rifa-reserved/20' : 'bg-green-500 hover:bg-green-600 border-none text-white'}
                          >
                            {sale.status === 'confirmed' ? 'PAGO ✓' : 'PENDENTE'}
                          </Badge>
                        </div>
                        
                        {sale.status === 'pending' && (
                          <Button 
                            size="sm" 
                            onClick={() => confirmPayment(sale.id)} 
                            className="gap-2 bg-green-500 hover:bg-green-600 text-white font-bold h-10 shadow-sm"
                          >
                            <CheckCircle className="w-4 h-4" /> CONFIRMAR
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Sorteio Dialog */}
      <Dialog open={!!drawingRaffle} onOpenChange={(open) => !open && setDrawingRaffle(null)}>
        <DialogContent className="sm:max-w-md text-center py-10">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-center">
              {isDrawing ? "Sorteando..." : "Resultado do Sorteio"}
            </DialogTitle>
            <DialogDescription className="text-center">
              Rifa: {drawingRaffle?.title}
            </DialogDescription>
          </DialogHeader>

          <div className="py-8 flex flex-col items-center">
            {isDrawing ? (
              <div className="relative w-32 h-32 flex items-center justify-center">
                <div className="absolute inset-0 border-8 border-primary/20 rounded-full animate-spin border-t-primary" />
                <Dices className="w-12 h-12 text-primary-foreground animate-bounce" />
              </div>
            ) : (
              winner && (
                <div className="space-y-6 animate-in zoom-in duration-500">
                  <div className="relative">
                    <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center mx-auto shadow-2xl border-4 border-white">
                      <span className="text-5xl font-black text-primary-foreground">{winner.num}</span>
                    </div>
                    <Zap className="absolute -top-4 -right-4 w-10 h-10 text-yellow-500 fill-current animate-pulse" />
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Ganhador(a)</p>
                    <h3 className="text-3xl font-black text-foreground">{winner.buyer.name}</h3>
                    <p className="text-sm font-medium text-muted-foreground">{winner.buyer.whatsapp}</p>
                  </div>

                  <Button 
                    className="w-full h-14 bg-green-500 hover:bg-green-600 text-white font-black text-lg gap-2 rounded-2xl"
                    onClick={() => {
                      const text = `🏆 *PARABÉNS!* Você foi o ganhador da rifa *${drawingRaffle.title}* com o número *${winner.num}*! 🥳 Entraremos em contato para a entrega do prêmio.`;
                      window.open(`https://wa.me/${winner.buyer.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
                    }}
                  >
                    <MessageCircle className="w-6 h-6 fill-current" /> AVISAR GANHADOR
                  </Button>
                </div>
              )
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Resumo Dialog */}
      <Dialog open={!!summaryRaffle} onOpenChange={(open) => !open && setSummaryRaffle(null)}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Resumo de Pagantes</DialogTitle>
            <DialogDescription>
              {summaryRaffle?.title}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto py-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                <p className="text-[10px] font-bold text-green-700 uppercase">Confirmados</p>
                <p className="text-2xl font-black text-green-800">{getRaffleSummary(summaryRaffle?.id).length}</p>
              </div>
              <div className="bg-primary/10 p-4 rounded-xl border border-primary/20">
                <p className="text-[10px] font-bold text-primary-foreground uppercase">Total Arrecadado</p>
                <p className="text-2xl font-black text-primary-foreground">
                  R$ {(getRaffleSummary(summaryRaffle?.id).reduce((acc, curr) => acc + (curr.selectedNumbers.length * summaryRaffle?.pricePerNumber), 0)).toFixed(2)}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-muted-foreground uppercase">Lista de Participantes (PAGOS)</p>
              <div className="border rounded-xl divide-y bg-muted/20">
                {getRaffleSummary(summaryRaffle?.id).length === 0 ? (
                  <div className="p-8 text-center text-sm text-muted-foreground">Nenhum pagamento confirmado ainda.</div>
                ) : (
                  getRaffleSummary(summaryRaffle?.id).map((p: any) => (
                    <div key={p.id} className="p-3 flex justify-between items-center bg-white">
                      <div>
                        <p className="font-bold text-sm">{p.name}</p>
                        <p className="text-[10px] text-muted-foreground">{p.whatsapp}</p>
                      </div>
                      <div className="flex gap-1">
                        {p.selectedNumbers.map((n: number) => (
                          <span key={n} className="text-[10px] font-black bg-muted px-1.5 py-0.5 rounded">
                            {n.toString().padStart(2, '0')}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t">
            <Button className="w-full gap-2 font-bold" onClick={() => setSummaryRaffle(null)}>
              Fechar Resumo
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
