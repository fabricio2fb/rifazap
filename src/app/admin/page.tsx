
"use client";

import { useState } from "react";
import { useCollection, useFirestore } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Trophy, ExternalLink, Package } from "lucide-react";
import Link from "next/link";
import { CreateRaffleDialog } from "@/components/admin/CreateRaffleDialog";
import { Raffle } from "@/lib/types";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("raffles");
  const db = useFirestore();

  const rafflesQuery = db ? query(collection(db, "raffles"), orderBy("createdAt", "desc")) : null;
  const { data: raffles, loading: rafflesLoading } = useCollection<Raffle>(rafflesQuery);

  return (
    <div className="min-h-screen bg-muted/30 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Painel RifaZap</h1>
            <p className="text-muted-foreground">Gerencie suas rifas e participantes</p>
          </div>
          <CreateRaffleDialog />
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white p-1 h-12 rounded-xl shadow-sm">
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
                      <img src={raffle.imageUrl} alt={raffle.title} className="w-full h-full object-cover" />
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
              <CardContent>
                <div className="py-12 text-center text-muted-foreground">
                  Funcionalidade de vendas sendo integrada...
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
