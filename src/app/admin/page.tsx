
"use client";

import { useState } from "react";
import { MOCK_RAFFLES, MOCK_PARTICIPANTS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Settings, Trophy, Check, X, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("raffles");

  return (
    <div className="min-h-screen bg-muted/30 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Painel RifaZap</h1>
            <p className="text-muted-foreground">Gerencie suas rifas e participantes</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 gap-2">
            <Plus className="w-5 h-5" /> Criar Nova Rifa
          </Button>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white p-1 h-12 rounded-xl shadow-sm">
            <TabsTrigger value="raffles" className="px-6 rounded-lg data-[state=active]:bg-primary">Rifas</TabsTrigger>
            <TabsTrigger value="participants" className="px-6 rounded-lg data-[state=active]:bg-primary">Vendas / Pagamentos</TabsTrigger>
          </TabsList>

          <TabsContent value="raffles" className="mt-6 space-y-4">
            <div className="grid gap-4">
              {MOCK_RAFFLES.map((raffle) => (
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
                          <span>R$ {raffle.pricePerNumber}</span>
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
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b bg-muted/50">
                      <tr>
                        <th className="text-left p-4">Participante</th>
                        <th className="text-left p-4">WhatsApp</th>
                        <th className="text-left p-4">Números</th>
                        <th className="text-left p-4">Status</th>
                        <th className="text-right p-4">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {MOCK_PARTICIPANTS.map((p) => (
                        <tr key={p.id} className="hover:bg-muted/30">
                          <td className="p-4 font-medium">{p.name}</td>
                          <td className="p-4">{p.whatsapp}</td>
                          <td className="p-4">
                            <div className="flex flex-wrap gap-1">
                              {p.selectedNumbers.map(n => (
                                <Badge key={n} variant="outline" className="bg-white">{n}</Badge>
                              ))}
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge className={p.status === 'confirmed' ? 'bg-rifa-available text-white' : 'bg-rifa-reserved text-white'}>
                              {p.status === 'confirmed' ? 'Pago' : 'Pendente'}
                            </Badge>
                          </td>
                          <td className="p-4 text-right">
                            {p.status === 'pending' ? (
                              <Button variant="outline" size="sm" className="text-rifa-available border-rifa-available hover:bg-rifa-available/10 gap-2">
                                <Check className="w-4 h-4" /> Confirmar
                              </Button>
                            ) : (
                              <Button variant="ghost" size="sm" className="text-muted-foreground">
                                <X className="w-4 h-4" /> Estornar
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
