"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { RafflesList } from "@/components/admin/RafflesList";
import { EditRaffleDialog } from "@/components/admin/EditRaffleDialog";
import { RaffleSummaryDialog } from "@/components/admin/RaffleSummaryDialog";
import { DrawRaffleDialog } from "@/components/admin/DrawRaffleDialog";
import { WinnerDetailsDialog } from "@/components/admin/WinnerDetailsDialog";

export default function RafflesPage() {
    const [raffles, setRaffles] = useState<any[]>([]);
    const [sales, setSales] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingRaffle, setEditingRaffle] = useState<any>(null);
    const [summaryRaffle, setSummaryRaffle] = useState<any>(null);
    const [drawingRaffle, setDrawingRaffle] = useState<any>(null);
    const [viewingWinner, setViewingWinner] = useState<any>(null);

    const router = useRouter();
    const supabase = createClient();
    const { toast } = useToast();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
            router.push("/login");
            return;
        }

        // Buscar campanhas
        const { data: rafflesData } = await supabase
            .from("raffles")
            .select("*")
            .eq("organizer_id", user.id)
            .order("created_at", { ascending: false });

        if (rafflesData) {
            const mappedRaffles = rafflesData.map((r) => ({
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
                winner: r.winner_name || "Ganhador",
                pixKey: r.pix_key,
                whatsappContact: r.whatsapp_contact,
                whatsappGroupLink: r.whatsapp_group_link,
                imageEditCount: r.image_edit_count || 0,
                createdAt: r.created_at,
            }));
            setRaffles(mappedRaffles);
        }

        // Buscar vendas (para usar no componente de campanhas concluídas)
        const { data: allSales } = await supabase
            .from("purchases")
            .select("*, customers(*), raffles!inner(*)")
            .eq("raffles.organizer_id", user.id)
            .order("created_at", { ascending: false });

        if (allSales) {
            const mapped = allSales.map((p) => ({
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

        setLoading(false);
    };

    const handleUpdateRaffle = (updatedRaffle: any) => {
        setRaffles((prev) =>
            prev.map((r) => (r.id === updatedRaffle.id ? updatedRaffle : r))
        );
        toast({
            title: "Campanha Atualizada!",
            description: "As informações foram alteradas com sucesso.",
        });
    };

    const shareOnWhatsApp = (raffle: any) => {
        const url = `https://socialrifa.vercel.app/rifa/${raffle.slug}`;
        const price = new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(raffle.pricePerNumber);

        const date = new Date(raffle.drawDate).toLocaleDateString("pt-BR", {
            timeZone: "America/Sao_Paulo",
        });

        const text = `🎟️ CAMPANHA ATIVA

Prêmio: ${raffle.title}
Valor do ticket: ${price}
Resultado: ${date}

👉 Garanta o seu ticket:
${url}`;

        const encodedText = encodeURIComponent(text);
        window.open(`https://wa.me/?text=${encodedText}`, "_blank");
    };

    const shareWithImage = async (raffle: any) => {
        toast({
            title: "Gerando imagem...",
            description: "Aguarde enquanto preparamos a imagem de status.",
        });

        try {
            const slugEncoded = encodeURIComponent(raffle.slug);
            const response = await fetch(
                `/api/campanha/${slugEncoded}/imagem?t=${Date.now()}`
            );

            if (!response.ok) {
                const contentType = response.headers.get("content-type");
                let errorMessage = "Erro ao gerar imagem";
                if (contentType?.includes("application/json")) {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } else {
                    errorMessage = (await response.text()) || errorMessage;
                }
                throw new Error(errorMessage);
            }

            const blob = await response.blob();

            if (blob.size < 500) {
                throw new Error(
                    `Imagem muito pequena (${blob.size} bytes). Verifique sua conexão.`
                );
            }

            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = downloadUrl;
            a.download = `status-campanha.png`;
            document.body.appendChild(a);
            a.click();

            setTimeout(() => {
                window.URL.revokeObjectURL(downloadUrl);
                document.body.removeChild(a);
            }, 1000);

            toast({
                title: "Imagem baixada!",
                description: "Agora anexe-a no seu WhatsApp para completar o compartilhamento.",
            });

            shareOnWhatsApp(raffle);
        } catch (error) {
            console.error("Error sharing image:", error);
            toast({
                variant: "destructive",
                title: "Falha no download da imagem",
                description:
                    error instanceof Error ? error.message : "Tente novamente em instantes.",
            });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black mb-2">Minhas Campanhas</h1>
                <p className="text-muted-foreground">

                </p>
            </div>

            <RafflesList
                raffles={raffles}
                sales={sales}
                onEdit={setEditingRaffle}
                onViewSummary={setSummaryRaffle}
                onDraw={(raffle) => setDrawingRaffle(raffle)}
                onShareWithImage={shareWithImage}
                onViewWinner={setViewingWinner}
            />

            {/* Dialogs */}
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
                    handleUpdateRaffle({
                        ...drawingRaffle,
                        status: "drawn",
                        winner: winner.buyer.name,
                        winningNumber: winner.num,
                    });
                }}
            />

            <WinnerDetailsDialog
                isOpen={!!viewingWinner}
                onOpenChange={(open) => !open && setViewingWinner(null)}
                winnerSale={viewingWinner?.sale}
                raffle={viewingWinner?.raffle}
            />
        </div>
    );
}