"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
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
  Calendar,
  XCircle,
  AlertTriangle,
  Bell,
  Settings,
  Ticket
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { CreateRaffleDialog } from "@/components/admin/CreateRaffleDialog";
import { EditRaffleDialog } from "@/components/admin/EditRaffleDialog";
import { NotificationSettingsDialog } from "@/components/admin/NotificationSettingsDialog";
import { RaffleSummaryDialog } from "@/components/admin/RaffleSummaryDialog";
import { DrawRaffleDialog } from "@/components/admin/DrawRaffleDialog";
import { WinnerDetailsDialog } from "@/components/admin/WinnerDetailsDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const PendingSaleActions = ({ sale, onConfirm, onCancel }: { sale: any, onConfirm: (id: string, isLate?: boolean) => void, onCancel: (id: string) => void }) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      if (!sale.createdAt) return;

      const created = new Date(sale.createdAt).getTime();
      const now = Date.now();
      let msPassed = now - created;

      // Aggressive practical fix for the common 3-hour UTC mismatch in Brazil
      // If the difference is roughly 3 hours (between 2.5h and 3.5h), adjust it.
      const threeHoursMs = 3 * 60 * 60 * 1000;
      if (Math.abs(msPassed) > 2.5 * 60 * 60 * 1000 && Math.abs(msPassed) < 3.5 * 60 * 60 * 1000) {
        msPassed = msPassed > 0 ? msPassed - threeHoursMs : msPassed + threeHoursMs;
      }

      const limitMs = 10 * 60 * 1000; // 10 minutes
      const timeRemaining = limitMs - Math.max(0, msPassed);

      if (timeRemaining <= 0) {
        setIsExpired(true);
        setTimeLeft("00:00");
        return;
      }

      const minutes = Math.floor(timeRemaining / (1000 * 60));
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

      setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      setIsExpired(false);
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [sale.createdAt]);

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex flex-col items-center gap-1 mb-2">
        <Badge variant="outline" className={`gap-1 w-full justify-center ${isExpired ? 'text-orange-600 border-orange-500' : 'text-yellow-600 border-yellow-500'}`}>
          <Timer className="w-3 h-3" />
          {isExpired ? "EXPIRADO" : "PENDENTE"}
        </Badge>
        {!isExpired && (
          <div className="flex items-center gap-1 font-mono text-[10px] font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100 italic">
            Tempo restante: {timeLeft}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1 w-full">
        {!isExpired ? (
          <Button
            size="sm"
            onClick={() => onConfirm(sale.id, false)}
            className="bg-green-500 hover:bg-green-600 text-white font-bold h-7 w-full text-[10px]"
          >
            <CheckCircle className="w-3 h-3 mr-1" /> Confirmar
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={() => onConfirm(sale.id, true)}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold h-7 w-full text-[10px]"
          >
            <AlertTriangle className="w-3 h-3 mr-1" /> Pago c/ Atraso
          </Button>
        )}
        <Button
          size="sm"
          variant="destructive"
          onClick={() => onCancel(sale.id)}
          className="font-bold h-7 w-full text-[10px]"
        >
          <XCircle className="w-3 h-3 mr-1" /> Cancelar
        </Button>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("raffles");
  const [raffles, setRaffles] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [editingRaffle, setEditingRaffle] = useState<any>(null);
  const [showSettings, setShowSettings] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Custom Loading State
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

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

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Fetch raffles
      const { data: rafflesData } = await supabase
        .from('raffles')
        .select('*')
        .eq('organizer_id', user.id)
        .order('created_at', { ascending: false });

      if (rafflesData) {
        const mappedRaffles = rafflesData.map(r => ({
          id: r.id,
          title: r.title,
          slug: r.slug,
          description: r.description,
          imageUrl: r.image_url,
          pricePerNumber: r.ticket_price,
          totalNumbers: r.total_numbers,
          drawDate: r.draw_date,
          status: r.status,
          winningNumber: r.winner_number,
          winner: r.winner_name || 'Ganhador',
          pixKey: r.pix_key,
          createdAt: r.created_at
        }));
        setRaffles(mappedRaffles);
      }

      // Load Sales
      const { data: allSales } = await supabase
        .from('purchases')
        .select('*, customers(*)')
        .order('created_at', { ascending: false });

      if (allSales) {
        mapSales(allSales);
      }

      // Load Notifications
      fetchNotifications(user.id);

      // Subscribe to Realtime Purchases
      const channel = supabase
        .channel('admin-dashboard')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'purchases' },
          (payload) => {
            // Reload sales on any change (INSERT, UPDATE, DELETE)
            loadSales();

            if (payload.eventType === 'INSERT') {
              toast({
                title: "Nova Venda!",
                description: `Venda iniciada. Valor: R$ ${payload.new.total_amount}`,
              });
              playNotificationSound();
            }
          }
        )
        .subscribe();

      setLoading(false);

      return () => {
        supabase.removeChannel(channel);
      };
    };
    loadData();
  }, []);

  const playNotificationSound = () => {
    // Create a simple beep or use a hosted file. For now, just skipped or implemented if requested.
    // const audio = new Audio('/sounds/kaching.mp3');
    // audio.play().catch(e => console.log("Audio play failed", e));
  };

  const fetchNotifications = async (userId: string) => {
    // Implement if notification table exists
    // For now, mocking or empty
    setNotifications([]);
  };

  const loadSales = async () => {
    const { data } = await supabase
      .from('purchases')
      .select('*, customers(*)')
      .order('created_at', { ascending: false });
    if (data) mapSales(data);
  };

  const mapSales = (data: any[]) => {
    const mapped = data.map(p => ({
      id: p.id,
      raffleId: p.raffle_id,
      name: p.customers?.name || 'Desconhecido',
      whatsapp: p.customers?.phone || '',
      selectedNumbers: p.numbers,
      status: p.status, // pending, paid, confirmed, paid_delayed, cancelled
      createdAt: p.created_at,
      total: p.total_amount
    }));
    setSales(mapped);
  };

  const loadRaffleDetails = async (raffleId: string) => {
    // Already loading global sales, but can filter
    return sales.filter(s => s.raffleId === raffleId);
  };

  const confirmPayment = async (saleId: string, isLate = false) => {
    const status = isLate ? 'paid_delayed' : 'confirmed';

    // Update DB
    const { error } = await supabase
      .from('purchases')
      .update({ status: status, confirmed_at: new Date() })
      .eq('id', saleId);

    if (error) {
      toast({ variant: "destructive", title: "Erro", description: error.message });
      return;
    }

    // Update reserved_numbers status to 'paid'
    await supabase
      .from('reserved_numbers')
      .update({ status: 'paid' })
      .eq('purchase_id', saleId);

    // Optimistic UI
    setSales(prev => prev.map(sale => sale.id === saleId ? { ...sale, status } : sale));

    toast({
      title: isLate ? "Confirmado com Atraso!" : "Pagamento Confirmado!",
      description: isLate
        ? "Pagamento marcado como recebido fora do prazo."
        : "O participante agora está com os números garantidos.",
      className: isLate ? "bg-orange-100 border-orange-200" : "bg-green-100 border-green-200"
    });
  };

  const cancelReservation = async (saleId: string) => {
    // Set status to cancelled
    // Remove reserved_numbers (or set to cancelled)

    const { error } = await supabase
      .from('purchases')
      .update({ status: 'cancelled' })
      .eq('id', saleId);

    if (error) {
      toast({ variant: "destructive", title: "Erro", description: error.message });
      return;
    }

    // Delete reservation to free up numbers
    await supabase
      .from('reserved_numbers')
      .delete()
      .eq('purchase_id', saleId);

    setSales(prev => prev.map(sale => sale.id === saleId ? { ...sale, status: 'cancelled' } : sale));

    toast({ title: "Reserva Cancelada", description: "Os números foram liberados.", variant: "destructive" });
  };

  const handleUpdateRaffle = (updatedRaffle: any) => {
    setRaffles(prev => prev.map(r => r.id === updatedRaffle.id ? updatedRaffle : r));
    toast({
      title: "Rifa Atualizada!",
      description: "As informações foram alteradas com sucesso.",
    });
  };

  const handleCreateRaffle = (newRaffle: any) => {
    const mapped = {
      id: newRaffle.id,
      title: newRaffle.title,
      slug: newRaffle.slug,
      description: newRaffle.description,
      imageUrl: newRaffle.image_url,
      pricePerNumber: newRaffle.ticket_price,
      totalNumbers: newRaffle.total_numbers,
      drawDate: newRaffle.draw_date,
      status: newRaffle.status,
      createdAt: newRaffle.created_at
    };

    setRaffles([mapped, ...raffles]);
    toast({
      title: "Rifa Criada!",
      description: "Sua nova rifa foi adicionada à lista.",
    });
  };

  const confirmedNumbersForRaffle = useMemo(() => {
    if (!drawingRaffle) return [];
    // Filter sales for this raffle that are confirmed/paid/paid_delayed
    const confirmedParticipants = sales.filter(s =>
      s.raffleId === drawingRaffle.id &&
      (s.status === 'confirmed' || s.status === 'paid' || s.status === 'paid_delayed')
    );
    const allNumbers: { num: number, buyer: any }[] = [];
    confirmedParticipants.forEach(p => {
      p.selectedNumbers.forEach((n: number) => {
        allNumbers.push({ num: n, buyer: p });
      });
    });
    return allNumbers;
  }, [drawingRaffle, sales]);

  const shareOnWhatsApp = (raffle: any) => {
    const url = `https://rifazap.vercel.app/rifa/${raffle.slug}`;
    const price = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(raffle.pricePerNumber);

    // Force Brasilia time for share message
    const date = new Date(raffle.drawDate).toLocaleDateString('pt-BR', {
      timeZone: 'America/Sao_Paulo'
    });

    const text = `🎟️ RIFA ATIVA

Prêmio: ${raffle.title}
Valor por número: ${price}
Sorteio: ${date}

👉 Garanta o seu número:
${url}`;

    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
  };

  const shareWithImage = async (raffle: any) => {
    toast({
      title: "Gerando imagem...",
      description: "Aguarde enquanto preparamos a imagem de status.",
    });

    try {
      const response = await fetch(`/api/rifa/${raffle.slug}/imagem`);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Falha ao gerar imagem');
      }

      const blob = await response.blob();

      if (blob.size < 500) {
        const text = await blob.text();
        if (text.startsWith('Erro')) {
          throw new Error(text);
        }
        throw new Error('A imagem gerada está vazia ou corrompida (tamanho insuficiente)');
      }

      const price = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(raffle.pricePerNumber);
      const date = new Date(raffle.drawDate).toLocaleDateString('pt-BR', {
        timeZone: 'America/Sao_Paulo'
      });
      const url = `https://rifazap.vercel.app/rifa/${raffle.slug}`;

      const shareText = `🎟️ RIFA ATIVA

Prêmio: ${raffle.title}
Valor por número: ${price}
Sorteio: ${date}

👉 Garanta o seu número:
${url}`;

      // Direct Download + WhatsApp Redirect Flow
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `status-rifa.png`;
      document.body.appendChild(a);
      a.click();

      // Short delay to ensure download starts
      setTimeout(() => {
        window.URL.revokeObjectURL(downloadUrl);
        document.body.removeChild(a);
      }, 500);

      toast({
        title: "Imagem baixada!",
        description: "Agora anexe-a no seu WhatsApp para completar o compartilhamento.",
      });

      // Immediately open WhatsApp
      shareOnWhatsApp(raffle);
    } catch (error) {
      console.error('Error sharing image:', error);
      toast({
        variant: 'destructive',
        title: "Não foi possível gerar a imagem",
        description: error instanceof Error ? error.message : "Tente novamente em instantes.",
      });
    }
  };

  const startDrawCeremony = () => {
    if (confirmedNumbersForRaffle.length === 0) {
      toast({
        variant: "destructive",
        title: "Sorteio Impossível",
        description: "Não há participantes aptos.",
      });
      return;
    }

    setDrawStep('counting');
    setCountdown(5);
    setWinner(null);

    let count = 5;
    const interval = setInterval(() => {
      count -= 1;
      setCountdown(count);
      if (count <= 0) {
        clearInterval(interval);
        clearInterval(spinInterval);

        const randomIndex = Math.floor(Math.random() * confirmedNumbersForRaffle.length);
        const chosen = confirmedNumbersForRaffle[randomIndex];
        setWinner(chosen);
        setDrawStep('finished');

        const updateWinner = async () => {
          await supabase.from('raffles').update({
            status: 'drawn',
            winner_number: chosen.num,
          }).eq('id', drawingRaffle.id);
        };
        updateWinner();

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

  const getStatusBadge = (sale: any) => {
    switch (sale.status) {
      case 'confirmed':
      case 'paid':
        return <Badge className="bg-green-500 hover:bg-green-600 text-white gap-1"><CheckCircle className="w-3 h-3" /> PAGO</Badge>;
      case 'paid_delayed': // Novo status
        return <Badge className="bg-orange-500 hover:bg-orange-600 text-white gap-1"><AlertTriangle className="w-3 h-3" /> PAGO (ATRASO)</Badge>;
      case 'cancelled':
        return <Badge variant="destructive" className="gap-1"><XCircle className="w-3 h-3" /> CANCELADO</Badge>;
      default: // pending
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted/30">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

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

          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="p-4 border-b font-bold">Notificações</div>
                <div className="p-4 text-sm text-muted-foreground text-center">
                  {notifications.length === 0 ? "Nenhuma notificação nova." : "..."}
                </div>
              </PopoverContent>
            </Popover>

            <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)}>
              <Settings className="w-5 h-5" />
            </Button>

            <CreateRaffleDialog onCreate={handleCreateRaffle} />
          </div>
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
                      <Badge
                        variant={raffle.status === 'active' ? 'default' : raffle.status === 'drawn' ? 'secondary' : 'outline'}
                        className={`shadow-lg px-3 py-1 font-bold ${raffle.status === 'pending_payment' ? 'border-orange-500 text-orange-600 bg-orange-50' : ''}`}
                      >
                        {raffle.status === 'active' ? 'ATIVA' :
                          raffle.status === 'drawn' ? 'SORTEADA' :
                            raffle.status === 'pending_payment' ? 'PGTO PENDENTE' : 'ENCERRADA'}
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
                        onClick={() => {
                          setSummaryRaffle(raffle);
                          // loadRaffleDetails(raffle.id); // Sales already loaded globally
                        }}
                        className="gap-2 text-[10px] font-bold h-10 border-2"
                      >
                        <FileText className="w-3.5 h-3.5" /> RESUMO
                      </Button>

                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => {
                          setDrawingRaffle(raffle);
                          // loadRaffleDetails(raffle.id);
                          setDrawStep('idle');
                        }}
                        disabled={raffle.status === 'drawn'}
                        className="gap-2 text-[10px] font-bold h-10 shadow-md bg-primary text-primary-foreground"
                      >
                        <Dices className="w-3.5 h-3.5" /> SORTEAR
                      </Button>

                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => shareWithImage(raffle)}
                        className="gap-2 text-[10px] font-bold h-10 shadow-md bg-[#25D366] hover:bg-[#128C7E] text-white"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-current" /> COMPARTILHAR
                      </Button>
                    </div>

                    {raffle.status === 'pending_payment' && (
                      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3 text-left">
                          <Zap className="w-6 h-6 text-blue-600 fill-current" />
                          <div>
                            <p className="text-[10px] font-bold text-blue-700 uppercase leading-none mb-1">Pagamento Necessário</p>
                            <p className="text-sm font-medium text-blue-800 leading-tight">Sua rifa está salva, mas falta pagar a taxa para ativar.</p>
                          </div>
                        </div>
                        <Button
                          className="w-full sm:w-auto bg-[#0052FF] hover:bg-[#0041CC] text-white font-black text-xs gap-2 px-6 h-12 shadow-lg transition-all active:scale-95 shrink-0"
                          onClick={() => {
                            const paymentUrl = `https://www.ggcheckout.com/checkout/v2/fhcawWP8XX2R59jn4gcW?external_id=${raffle.id}`;
                            window.open(paymentUrl, '_blank');
                          }}
                        >
                          <Zap className="w-4 h-4 fill-current" /> PAGAR TAXA
                        </Button>
                      </div>
                    )}

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
                            className="bg-white border-green-200 text-green-700 hover:bg-green-100 font-bold"
                            onClick={() => {
                              // Find the winning sale
                              const winningSale = sales.find(s =>
                                s.raffleId === raffle.id &&
                                s.selectedNumbers.includes(raffle.winningNumber)
                              );
                              setViewingWinner({ raffle, sale: winningSale || { name: raffle.winner, whatsapp: 'Não encontrado', total: 0 } });
                            }}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Ver Detalhes
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
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-base">{sale.name}</p>
                        <span className="text-xs text-muted-foreground font-medium">({sale.whatsapp})</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {sale.selectedNumbers?.map((n: number) => (
                          <Badge key={n} variant="secondary" className="text-[9px] px-1.5 h-4 font-black">
                            {n.toString().padStart(2, '0')}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-[10px] text-muted-foreground pt-1">
                        Rifa: {raffles.find(r => r.id === sale.raffleId)?.title}
                      </p>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-lg font-black text-foreground">R$ {sale.total.toFixed(2)}</p>
                        {sale.status !== 'pending' && getStatusBadge(sale)}
                      </div>

                      <div className="flex flex-col gap-2">
                        {sale.status === 'pending' && (() => {
                          const created = new Date(sale.createdAt).getTime();
                          const now = new Date().getTime();
                          const diffMinutes = (now - created) / 1000 / 60;

                          // If it's more than 10 minutes old, it's NOT recent (but we still show actions with "Atrasado" logic)
                          const isExpiredLocal = diffMinutes >= 10;

                          return (
                            <PendingSaleActions sale={sale} onConfirm={confirmPayment} onCancel={cancelReservation} />
                          );
                        })()}

                        {sale.status === 'cancelled' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => confirmPayment(sale.id, true)}
                            className="text-orange-600 border-orange-200 hover:bg-orange-50 font-bold h-8 w-full"
                          >
                            <AlertTriangle className="w-3 h-3 mr-1" /> Reviver (Atrasado)
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs >
      </div >

      <NotificationSettingsDialog
        open={showSettings}
        onOpenChange={setShowSettings}
      />

      <EditRaffleDialog
        isOpen={!!editingRaffle}
        raffle={editingRaffle}
        onClose={() => setEditingRaffle(null)}
        onUpdate={handleUpdateRaffle}
      />

      <RaffleSummaryDialog
        isOpen={!!summaryRaffle}
        raffle={summaryRaffle}
        sales={sales}
        onOpenChange={(open) => !open && setSummaryRaffle(null)}
      />

      <DrawRaffleDialog
        isOpen={!!drawingRaffle}
        raffle={drawingRaffle}
        sales={sales}
        onOpenChange={(open) => !open && setDrawingRaffle(null)}
        onDrawComplete={(winner) => {
          // Refresh local state to show updated winner immediately
          handleUpdateRaffle({
            ...drawingRaffle,
            status: 'drawn',
            winner: winner.buyer.name,
            winningNumber: winner.num
          });
        }}
      />

      <WinnerDetailsDialog
        isOpen={!!viewingWinner}
        onOpenChange={(open) => !open && setViewingWinner(null)}
        winnerSale={viewingWinner?.sale}
        raffle={viewingWinner?.raffle}
      />
    </div >
  );
}
