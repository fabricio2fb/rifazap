
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCollection, useFirestore, useUser, useAuth } from "@/firebase";
import { collection, query, orderBy, doc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Trophy, ExternalLink, Package, User, CheckCircle, LogOut, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { CreateRaffleDialog } from "@/components/admin/CreateRaffleDialog";
import { Raffle } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const { user, loading: userLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("raffles");
  const db = useFirestore();
  const { toast } = useToast();

  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/login");
    }
  }, [user, userLoading, router]);

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

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push("/");
    }
  };

  if (userLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl font-bold text-foreground">Painel RifaZap</h1>
              <Badge variant="outline" className="font-normal text-xs">{user.email}</Badge>
            </div>
            <p className="text-muted-foreground">Gerencie suas rifas e participantes</p>
          </div>
          <div className="flex gap-2">
            <CreateRaffleDialog />
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Sair">
              <LogOut className="w-5 h-5 text-muted-foreground" />
            </Button>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white p-1 h-12 rounded-xl shadow-sm border">
            <TabsTrigger value="raffles" className="px-6 rounded-lg data-[state=active]:bg-primary">Rifas</TabsTrigger>
            <TabsTrigger value="participants" className="px-6 rounded-lg data-[state=active]:bg-primary">Vendas / Pagamentos</TabsTrigger>
          </TabsList>

          <TabsContent value="raffles" className="mt-6 space-y-4">
            {rafflesLoading && <div className="text-center py-12">Carregando rifas...</div>}
            
            {!rafflesLoading && raffles?.length === 0 && (
              <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-muted flex flex-col items-center">
                <Package className="w-12 h-12 text-muted-foreground mb-4 opacity-20" />
                <p className="text-muted-foreground font-medium">Nenhuma rifa encontrada. Crie sua primeira rifa!</p>
              </div>
            )}

            <div className="grid gap-4">
              {raffles?.map((raffle) => (
                <Card key={raffle.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative w-full sm:w-48 h-32 bg-slate-100">
                      {raffle.imageUrl && (
                        <Image 
                          src={raffle.imageUrl} 
                          alt={raffle.title} 
                          fill 
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl mb-1">{raffle.title}</CardTitle>
                          <p className="text-sm text-muted-foreground line-clamp-1">{raffle.description}</p>
                        </div>
                        <Badge variant={raffle.status === 'active' ? 'default' : 'secondary'}>
                          {raffle.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex gap-4 text-sm font-medium">
                          <span>{raffle.totalNumbers} números</span>
                          <span>R$ {raffle.pricePerNumber.toFixed(2)}</span>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/rifa/${raffle.slug}`} target="_blank">
                            <Button variant="outline" size="sm" className="gap-2">
                              Ver Pública <ExternalLink className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button variant="secondary" size="sm">Editar</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="participants" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Últimas Reservas</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {salesLoading && <div className="text-center py-12">Carregando vendas...</div>}
                
                {!salesLoading && (!sales || sales.length === 0) && (
                  <div className="py-24 text-center text-muted-foreground flex flex-col items-center">
                    <User className="w-12 h-12 opacity-10 mb-4" />
                    Nenhuma venda registrada ainda.
                  </div>
                )}

                <div className="divide-y">
                  {sales?.map((sale) => (
                    <div key={sale.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-muted/10 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden border shrink-0 bg-slate-100">
                          {sale.raffleImageUrl ? (
                            <Image 
                              src={sale.raffleImageUrl} 
                              alt={sale.raffleTitle || "Rifa"} 
                              fill 
                              className="object-cover"
                            />
                          ) : (
                            <Package className="w-full h-full p-4 opacity-10" />
                          )}
                        </div>
                        
                        <div>
                          <p className="font-bold text-foreground">{sale.name}</p>
                          <p className="text-sm text-muted-foreground">{sale.whatsapp}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {sale.selectedNumbers.map((n: number) => (
                              <Badge key={n} variant="outline" className="text-[10px] px-1 h-4">{n.toString().padStart(2, '0')}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="text-right">
                          <p className="text-sm font-bold">R$ {sale.totalAmount?.toFixed(2)}</p>
                          <Badge 
                            variant={sale.status === 'confirmed' ? 'default' : 'outline'}
                            className={sale.status === 'pending' ? 'bg-rifa-reserved/10 text-rifa-reserved border-rifa-reserved/20' : ''}
                          >
                            {sale.status === 'confirmed' ? 'Pago' : 'Pendente'}
                          </Badge>
                        </div>
                        {sale.status === 'pending' && (
                          <Button size="sm" onClick={() => confirmPayment(sale.id)} className="gap-2">
                            <CheckCircle className="w-4 h-4" /> Confirmar
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
