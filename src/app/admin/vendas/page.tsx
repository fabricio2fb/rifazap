"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import SalesList from "@/components/admin/SalesList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Bell, Volume2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export default function VendasPage() {
    const [sales, setSales] = useState<any[]>([]);
    const [raffles, setRaffles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [timeDrift, setTimeDrift] = useState(0);
    const [notifPermission, setNotifPermission] = useState<NotificationPermission>("default");
    const [notifSettings, setNotifSettings] = useState<any>({ new_reservation: true, browser_notifications: true });
    const [realtimeStatus, setRealtimeStatus] = useState("connecting");
    const [isMounted, setIsMounted] = useState(false);

    const router = useRouter();
    const supabase = createClient();
    const { toast } = useToast();

    useEffect(() => {
        setIsMounted(true);
        if (typeof window !== "undefined") {
            setNotifPermission(Notification.permission);
        }

        loadData();

        const channel = supabase
            .channel(`vendas-realtime-${Date.now()}`)
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "purchases" },
                (payload) => {
                    console.log("Evento Realtime recebido:", payload.eventType, payload);
                    if (payload.eventType === "INSERT") {
                        handleNewSale(payload.new);
                    } else {
                        loadSales();
                    }
                }
            )
            .subscribe((status) => {
                console.log("Status Realtime:", status);
                setRealtimeStatus(status);
            });

        // FALLBACK: Polling a cada 10 segundos para feedback mais rápido
        const pollInterval = setInterval(() => {
            loadSales();
        }, 10000);

        return () => {
            supabase.removeChannel(channel);
            clearInterval(pollInterval);
        };
    }, []);

    const playNotificationSound = () => {
        // Tenta tocar o arquivo local, senão usa uma URL remota de backup
        const audio = new Audio("/notification.mp3");
        audio.play().catch(() => {
            const backupAudio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
            backupAudio.play().catch(e => console.log("Erro ao tocar som:", e));
        });
    };

    const handleNewSale = async (newSale: any) => {
        if (notifSettings?.new_reservation) {
            playNotificationSound();
        }

        await loadSales(); // Atualiza a lista sozinha

        if (Notification.permission === "granted" && notifSettings?.browser_notifications) {
            new Notification("💰 Nova Reserva!", {
                body: `Uma nova reserva de R$ ${newSale.total_amount || '0,00'} foi realizada!`,
                icon: "/favicon.ico"
            });
        }
    };

    const requestNotificationPermission = async () => {
        const permission = await Notification.requestPermission();
        setNotifPermission(permission);
        if (permission === "granted") {
            toast({ title: "Notificações Ativadas!", description: "Você receberá alertas de novas vendas." });
            playNotificationSound(); // Teste inicial
        }
    };

    const loadData = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.push("/login");
            return;
        }

        const { data: rafflesData } = await supabase
            .from("raffles")
            .select("*")
            .eq("organizer_id", user.id);

        if (rafflesData) {
            setRaffles(rafflesData.map((r) => ({ id: r.id, title: r.title, slug: r.slug })));
        }

        // Busca configurações de notificação
        const { data: nSettings } = await supabase
            .from('notification_settings')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (nSettings) setNotifSettings(nSettings);

        // Sincroniza o horário com o servidor (FORÇADO SEM CACHE)
        try {
            const res = await fetch('/api/utils/time', { cache: 'no-store' });
            const { serverTime } = await res.json();
            const drift = serverTime - Date.now();
            setTimeDrift(drift);
            console.log("Sincronia Servidor:", { drift, serverTime });
        } catch (e) {
            console.error("Erro ao sincronizar horário:", e);
        }

        await loadSales();
        setLoading(false);
    };

    const loadSales = async () => {
        // 1. Gatilho de Limpeza Proativa no Banco (para liberar números)
        fetch('/api/admin/purchases/cleanup', { method: 'POST' }).catch(e => console.error("Cleanup error:", e));

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.push("/login");
            return;
        }

        const { data, error, status } = await supabase
            .from("purchases")
            .select("*, customers(*), raffles!inner(*)")
            .eq("raffles.organizer_id", user.id)
            .order("created_at", { ascending: false });

        if (status === 401) {
            router.push("/login");
            return;
        }

        if (data) {
            const mapped = data.map((p) => ({
                id: p.id,
                raffleId: p.raffle_id,
                name: p.customers?.name || "Desconhecido",
                whatsapp: p.customers?.phone || "",
                selectedNumbers: p.numbers,
                status: p.status,
                createdAt: p.created_at,
                expiresAt: p.expires_at,
                total: p.total_amount,
            }));
            setSales(mapped);
        }
    };

    const confirmPayment = async (saleId: string, isLate = false) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/purchases/${saleId}/confirm`, {
                method: 'PATCH',
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Erro ao confirmar');

            await loadSales();
            toast({ title: "Sucesso!", description: isLate ? "Confirmado com atraso" : "Pagamento confirmado" });
        } catch (error: any) {
            toast({ variant: "destructive", title: "Erro", description: error.message });
        } finally {
            setLoading(false);
        }
    };

    const cancelReservation = async (saleId: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/purchases/${saleId}/cancel`, {
                method: 'POST',
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Erro ao cancelar');

            await loadSales();
            toast({ title: "Reserva Cancelada", variant: "destructive" });
        } catch (error: any) {
            toast({ variant: "destructive", title: "Erro", description: error.message });
        } finally {
            setLoading(false);
        }
    };
    // --- LÓGICA DE TEMPO E FILTROS CORRIGIDA ---
    const nowTime = new Date().getTime();
    const limit = 15 * 60 * 1000; // 15 minutos (Sincronizado com o sistema)

    const searchedSales = sales.filter(sale =>
        sale.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.whatsapp.includes(searchTerm)
    );

    const filteredSales = searchedSales.filter((sale) => {
        // Cálculo baseado na criação para evitar erro de fuso horário
        const createdAt = new Date(sale.createdAt).getTime();
        const isExpired = (nowTime - createdAt) > limit;

        if (activeFilter === "all") return true;
        if (activeFilter === "pending") return sale.status === "pending" && !isExpired;
        if (activeFilter === "confirmed") return ["confirmed", "paid", "paid_delayed"].includes(sale.status);
        if (activeFilter === "cancelled") return sale.status === "cancelled" || (sale.status === "pending" && isExpired);
        return true;
    });

    // Contadores para as abas corrigidos
    const counts = {
        all: searchedSales.length,
        pending: searchedSales.filter(s => {
            const isExpired = (nowTime - new Date(s.createdAt).getTime()) > limit;
            return s.status === "pending" && !isExpired;
        }).length,
        confirmed: searchedSales.filter(s => ["confirmed", "paid", "paid_delayed"].includes(s.status)).length,
        cancelled: searchedSales.filter(s => {
            const isExpired = (nowTime - new Date(s.createdAt).getTime()) > limit;
            return s.status === "cancelled" || (s.status === "pending" && isExpired);
        }).length,
    };

    if (loading || !isMounted) return <div className="flex justify-center p-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

    return (
        <div className="space-y-6 p-4 max-w-7xl mx-auto">
            {/* CABEÇALHO ÚNICO */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black tracking-tight">Vendas & Pagamentos</h1>
                    <p className="text-muted-foreground font-medium">Acompanhe as reservas e confirme os recebimentos via PIX.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Indicador de Conexão Real-time */}
                    <div className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                        realtimeStatus === "SUBSCRIBED"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-200"
                            : "bg-amber-500/10 text-amber-600 border-amber-200 animate-pulse"
                    )}>
                        <div className={cn("w-1.5 h-1.5 rounded-full", realtimeStatus === "SUBSCRIBED" ? "bg-emerald-500" : "bg-amber-500")} />
                        {realtimeStatus === "SUBSCRIBED" ? "AO VIVO" : "CONECTANDO..."}
                    </div>

                    {/* Status das Notificações */}
                    <div className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold uppercase transition-all shadow-sm border",
                        notifPermission === "granted"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                    )}>
                        <Bell className={cn("w-4 h-4", notifPermission === "granted" && "fill-current")} />
                        {notifPermission === "granted" ? "Sino Ligado" : "Sino Desligado"}
                    </div>

                    {notifPermission !== "granted" && (
                        <Button
                            variant="default"
                            size="default"
                            onClick={requestNotificationPermission}
                            className="bg-primary text-primary-foreground font-black rounded-2xl shadow-xl hover:scale-105 transition-transform px-6 h-10"
                        >
                            🔔 Ativar Alertas no Celular
                        </Button>
                    )}

                    <Button
                        variant="secondary"
                        size="icon"
                        onClick={playNotificationSound}
                        className="rounded-2xl w-10 h-10 shadow-sm border border-slate-200"
                        title="Testar Som de Venda"
                    >
                        <Volume2 className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {/* BUSCA ÚNICA */}
            <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                    placeholder="Buscar por nome ou WhatsApp..."
                    className="pl-10 h-12 bg-white rounded-xl shadow-sm border-slate-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <Tabs value={activeFilter} onValueChange={setActiveFilter} className="w-full">
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                    <TabsList className="flex w-full overflow-x-auto bg-slate-100 p-1 rounded-xl h-auto min-h-[48px] justify-start md:justify-center no-scrollbar flex-1">
                        <TabsTrigger value="all" className="font-bold flex-shrink-0 px-4 py-2 whitespace-nowrap">Todas ({counts.all})</TabsTrigger>
                        <TabsTrigger value="pending" className="font-bold flex-shrink-0 px-4 py-2 whitespace-nowrap">Pendentes ({counts.pending})</TabsTrigger>
                        <TabsTrigger value="confirmed" className="font-bold flex-shrink-0 px-4 py-2 whitespace-nowrap">Confirmadas ({counts.confirmed})</TabsTrigger>
                        <TabsTrigger value="cancelled" className="font-bold flex-shrink-0 px-4 py-2 whitespace-nowrap">Canceladas ({counts.cancelled})</TabsTrigger>
                    </TabsList>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => loadSales()}
                        className="font-bold text-primary hover:bg-primary/10 rounded-xl flex items-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Atualizar Lista
                    </Button>
                </div>

                <TabsContent value={activeFilter} className="mt-6">
                    {filteredSales.length > 0 ? (
                        <SalesList
                            sales={filteredSales}
                            raffles={raffles}
                            timeDrift={timeDrift}
                            onConfirm={confirmPayment}
                            onCancel={cancelReservation}
                        />
                    ) : (
                        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                            <p className="text-slate-400 font-bold">Nenhuma venda encontrada.</p>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}