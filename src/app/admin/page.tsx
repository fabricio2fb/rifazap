"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import {
  Package,
  CheckCircle,
  Wallet,
  Trophy,
  TrendingUp,
  Users,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    activeRaffles: 0,
    totalSales: 0,
    revenue: 0,
    drawnRaffles: 0,
  });
  const [recentSales, setRecentSales] = useState<any[]>([]);
  const [topRaffles, setTopRaffles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const loadData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      // Buscar rifas
      const { data: raffles } = await supabase
        .from("raffles")
        .select("*")
        .eq("organizer_id", user.id);

      // Buscar vendas
      const { data: sales } = await supabase
        .from("purchases")
        .select("*, customers(*), raffles!inner(organizer_id, title)")
        .eq("raffles.organizer_id", user.id)
        .order("created_at", { ascending: false });

      if (raffles && sales) {
        const activeRaffles = raffles.filter((r) => r.status === "active").length;
        const drawnRaffles = raffles.filter((r) => r.status === "drawn").length;

        // Helper para filtrar vendas confirmadas
        const isConfirmed = (s: any) =>
          s.status === "confirmed" ||
          s.status === "paid" ||
          s.status === "paid_delayed";

        const confirmedSales = sales.filter(isConfirmed);
        const revenue = confirmedSales.reduce((acc, s) => acc + s.total_amount, 0);

        setStats({
          activeRaffles,
          totalSales: confirmedSales.length, // Agora conta apenas as pagas/confirmadas
          revenue,
          drawnRaffles,
        });

        // Vendas recentes (últimas 4) - Mantemos todas para visibilidade de lances pendentes
        setRecentSales(
          sales.slice(0, 4).map((s) => ({
            id: s.id,
            name: s.customers?.name || "Desconhecido",
            numbersCount: s.numbers?.length || 0,
            status: s.status,
          }))
        );

        // Top rifas (por progresso de vendas CONFIRMADAS)
        const raffleStats = raffles.map((raffle) => {
          // Filtrar apenas vendas confirmadas desta rifa específica
          const raffleConfirmedSales = sales.filter((s) => s.raffle_id === raffle.id && isConfirmed(s));
          const soldNumbers = raffleConfirmedSales.reduce(
            (acc, s) => acc + (s.numbers?.length || 0),
            0
          );
          const progress = (soldNumbers / raffle.total_numbers) * 100;

          return {
            id: raffle.id,
            title: raffle.title,
            progress: Math.min(100, Math.round(progress)), // Limitar a 100% visualmente
            soldNumbers,
            totalNumbers: raffle.total_numbers,
          };
        });

        // Ordenar por progresso e pegar top 4
        setTopRaffles(
          raffleStats
            .sort((a, b) => b.progress - a.progress)
            .slice(0, 4)
        );
      }

      setLoading(false);
    };

    loadData();
  }, [router, supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const statsCards = [
    {
      title: "Rifas Ativas",
      value: stats.activeRaffles,
      icon: Package,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Vendas Totais",
      value: stats.totalSales,
      icon: CheckCircle,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Receita Total",
      value: `R$ ${stats.revenue.toFixed(2)}`,
      icon: Wallet,
      color: "bg-primary/20 text-primary",
    },
    {
      title: "Sorteios",
      value: stats.drawnRaffles,
      icon: Trophy,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Visão Geral</h1>
        <p className="text-muted-foreground font-medium">

        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, i) => (
          <Card
            key={i}
            className="p-6 border-none shadow-sm flex flex-col gap-4 hover:shadow-md transition-all hover:-translate-y-1 duration-300 bg-white/80 backdrop-blur-sm"
          >
            <div
              className={cn(
                "h-12 w-12 rounded-2xl flex items-center justify-center shadow-inner",
                stat.color
              )}
            >
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em]">
                {stat.title}
              </p>
              <p className="text-2xl font-black mt-1">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Atividade Recente */}
        <Card className="p-8 border-none shadow-sm space-y-8 bg-white/80 backdrop-blur-sm rounded-3xl">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-xl flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              Atividade Recente
            </h3>
            <a
              href="/admin/vendas"
              className="text-xs font-bold text-primary flex items-center gap-1 hover:underline transition-all"
            >
              Ver tudo <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
          <div className="space-y-1">
            {recentSales.length > 0 ? (
              recentSales.map((sale) => (
                <div
                  key={sale.id}
                  className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors border-b last:border-0 border-slate-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-sm uppercase text-slate-500 shadow-sm">
                      {sale.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-base leading-tight">{sale.name}</p>
                      <p className="text-xs text-muted-foreground font-medium mt-0.5">
                        Reservou {sale.numbersCount} {sale.numbersCount === 1 ? 'cota' : 'cotas'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={cn(
                        "text-[10px] font-black px-3 py-1 rounded-full border shadow-sm uppercase tracking-wider",
                        sale.status === "confirmed" ||
                          sale.status === "paid" ||
                          sale.status === "paid_delayed"
                          ? "bg-green-50 text-green-700 border-green-100"
                          : sale.status === "pending"
                            ? "bg-orange-50 text-orange-700 border-orange-100"
                            : "bg-red-50 text-red-700 border-red-100"
                      )}
                    >
                      {sale.status === "confirmed" ||
                        sale.status === "paid" ||
                        sale.status === "paid_delayed"
                        ? "PAGO"
                        : sale.status === "pending"
                          ? "PENDENTE"
                          : "CANCELADO"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-sm text-muted-foreground font-medium">
                Nenhuma venda recente para exibir.
              </div>
            )}
          </div>
        </Card>

        {/* Melhores Rifas */}
        <Card className="p-8 border-none shadow-sm space-y-8 bg-white/80 backdrop-blur-sm rounded-3xl">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-xl flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-xl">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              Melhores Rifas
            </h3>
          </div>
          <div className="space-y-8">
            {topRaffles.length > 0 ? (
              topRaffles.map((raffle) => (
                <div key={raffle.id} className="group">
                  <div className="flex justify-between items-end mb-3">
                    <div className="space-y-1">
                      <p className="font-black text-base truncate max-w-[200px] group-hover:text-primary transition-colors">
                        {raffle.title}
                      </p>
                      <p className="text-xs text-muted-foreground font-bold">
                        {raffle.soldNumbers} de {raffle.totalNumbers} vendidos
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-slate-800">{raffle.progress}%</p>
                    </div>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner p-0.5">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-1000 ease-out shadow-sm",
                        raffle.progress >= 80 ? "bg-green-500" :
                          raffle.progress >= 50 ? "bg-primary" : "bg-blue-500"
                      )}
                      style={{ width: `${raffle.progress}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-sm text-muted-foreground font-medium">
                Nenhuma rifa com vendas confirmadas no momento.
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
