
"use client";

import { useState } from "react";
import { useCollection, useFirestore } from "@/firebase";
import { collection, query, orderBy, doc, updateDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Trophy, ExternalLink, Package, User, CheckCircle, ArrowLeft, MoreVertical, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { CreateRaffleDialog } from "@/components/admin/CreateRaffleDialog";
import { Raffle } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("raffles");
  const db = useFirestore();
  const { toast } = useToast();

  const rafflesQuery = db ? query(collection(db, "raffles"), orderBy("createdAt", "desc")) : null;
  const { data: raffles, loading: rafflesLoading } = useCollection<Raffle>(rafflesQuery);

  const salesQuery = db ? query(collection(db, "participants"), orderBy("createdAt", "desc")) : null;
  const { data: sales, loading: salesLoading } = useCollection<any>(salesQuery);

  const confirmPayment = (saleId: string) => {
    if (!db) return;
    const saleRef = doc(db, "participants", saleId);
    updateDoc(saleRef, { status: 'confirmed' }).then(() => {
      toast({ title: "Pagamento confirmado!", description: "O participante agora está com os números garantidos." });
    });
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      {/* Header Mobile Otimizado */}
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
          <CreateRaffleDialog />
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white p-1 h-12 rounded-xl shadow-sm border mb-6">
            <TabsTrigger value="raffles" className="rounded-lg font-semibold">Minhas Rifas</TabsTrigger>
            <TabsTrigger value="participants" className="rounded-lg font-semibold">Vendas</TabsTrigger>
          </TabsList>

          <TabsContent value="raffles" className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Suas Campanhas</h2>
              <span className="text-xs font-medium text-muted-foreground bg-white px-2 py-1 rounded-md border">{raffles?.length || 0} Ativas</span>
            </div>

            {rafflesLoading && (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                <p>Carregando rifas...</p>
              </div>
            )}
            
            {!rafflesLoading && (!raffles || raffles.length === 0) && (
              <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-muted flex flex-col items-center px-6">
                <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                  <Package className="w-8 h-8 text-muted-foreground opacity-30" />
                </div>
                <p className="text-muted-foreground font-semibold text-lg">Nenhuma rifa por aqui</p>
                <p className="text-sm text-muted-foreground mb-6">Crie sua primeira rifa agora mesmo e comece a vender.</p>
                <CreateRaffleDialog />
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-1">
              {raffles?.map((raffle) => (
                <Card key={raffle.id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all">
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative w-full sm:w-48 h-40 sm:h-auto bg-slate-100 shrink-0">
                      {raffle.imageUrl && (
                        <Image 
                          src={raffle.imageUrl} 
                          alt={raffle.title} 
                          fill 
                          className="object-cover"
                        />
                      )}
                      <div className="absolute top-2 left-2">
                        <Badge variant={raffle.status === 'active' ? 'default' : 'secondary'} className="shadow-sm">
                          {raffle.status === 'active' ? 'Ativa' : 'Encerrada'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex-1 p-5 flex flex-col justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg font-bold">{raffle.title}</CardTitle>
                        <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                          <span className="flex items-center gap-1"><Trophy className="w-3 h-3" /> {raffle.totalNumbers} cotas</span>
                          <span className="font-bold text-foreground">R$ {raffle.pricePerNumber.toFixed(2)} / cada</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between mt-6 gap-3 pt-4 border-t border-dashed">
                        <div className="flex gap-2 w-full sm:w-auto">
                          <Link href={`/rifa/${raffle.slug}`} target="_blank" className="flex-1 sm:flex-none">
                            <Button variant="outline" size="sm" className="w-full gap-2 text-xs font-bold rounded-lg border-2">
                              Ver Pública <ExternalLink className="w-3 h-3" />
                            </Button>
                          </Link>
                          <Button variant="secondary" size="sm" className="flex-1 sm:flex-none text-xs font-bold rounded-lg">Editar</Button>
                        </div>
                        <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                          Criada em: {new Date(raffle.createdAt?.seconds * 1000).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="participants" className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Fluxo de Caixa</h2>
              <Badge variant="outline" className="bg-white">{sales?.length || 0} Reservas</Badge>
            </div>

            {salesLoading && (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                <p>Carregando vendas...</p>
              </div>
            )}
            
            {!salesLoading && (!sales || sales.length === 0) && (
              <div className="py-24 text-center bg-white rounded-2xl border-2 border-dashed flex flex-col items-center px-6">
                <User className="w-12 h-12 opacity-10 mb-4" />
                <p className="font-semibold text-muted-foreground">Aguardando a primeira venda</p>
                <p className="text-sm text-muted-foreground">As reservas aparecerão aqui assim que seus clientes escolherem os números.</p>
              </div>
            )}

            <div className="grid gap-3">
              {sales?.map((sale) => (
                <Card key={sale.id} className="border-none shadow-sm p-4 overflow-hidden relative group">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden border bg-muted shrink-0 shadow-sm">
                        {sale.raffleImageUrl ? (
                          <Image 
                            src={sale.raffleImageUrl} 
                            alt={sale.raffleTitle || "Rifa"} 
                            fill 
                            className="object-cover"
                          />
                        ) : (
                          <Package className="w-full h-full p-3 opacity-20" />
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        <p className="font-bold text-base leading-none">{sale.name}</p>
                        <p className="text-xs text-muted-foreground font-medium">{sale.whatsapp}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {sale.selectedNumbers?.map((n: number) => (
                            <Badge key={n} variant="secondary" className="text-[9px] px-1.5 h-4 font-bold bg-muted/80">
                              {n.toString().padStart(2, '0')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-none pt-3 md:pt-0">
                      <div className="text-left md:text-right">
                        <p className="text-lg font-black text-primary-foreground/90">R$ {sale.totalAmount?.toFixed(2)}</p>
                        <Badge 
                          variant={sale.status === 'confirmed' ? 'default' : 'outline'}
                          className={sale.status === 'pending' ? 'bg-rifa-reserved/10 text-rifa-reserved border-rifa-reserved/20' : 'bg-green-500 hover:bg-green-600 border-none'}
                        >
                          {sale.status === 'confirmed' ? 'Pago ✓' : 'Pendente'}
                        </Badge>
                      </div>
                      
                      {sale.status === 'pending' ? (
                        <Button 
                          size="sm" 
                          onClick={() => confirmPayment(sale.id)} 
                          className="gap-2 bg-green-500 hover:bg-green-600 text-white font-bold h-10 shadow-sm"
                        >
                          <CheckCircle className="w-4 h-4" /> Confirmar
                        </Button>
                      ) : (
                        <div className="h-10 w-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
