import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import RaffleView from "./RaffleView";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Info, AlertCircle } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: raffle } = await supabase
    .from('raffles')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!raffle) return { title: "Rifa não encontrada" };

  const price = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(raffle.ticket_price);
  const date = new Date(raffle.draw_date).toLocaleDateString('pt-BR', {
    timeZone: 'America/Sao_Paulo'
  });
  const description = `Cada número custa ${price}. Sorteio dia ${date}.`;
  const url = `https://rifazap.vercel.app/rifa/${slug}`;

  return {
    title: raffle.title,
    description: description,
    openGraph: {
      type: "website",
      title: raffle.title,
      description: description,
      url: url,
      images: [
        {
          url: raffle.image_url,
          width: 1200,
          height: 630,
          alt: raffle.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: raffle.title,
      description: description,
      images: [raffle.image_url],
    },
  };
}

export default async function PublicRafflePage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch Raffle
  const { data: raffleData } = await supabase
    .from('raffles')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!raffleData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-background">
        <h1 className="text-2xl font-bold mb-2">Rifa não encontrada</h1>
        <p className="text-muted-foreground mb-6">Verifique se o link está correto.</p>
        <Link href="/">
          <Button>Voltar para Início</Button>
        </Link>
      </div>
    );
  }

  // Block unpaid raffles
  if (raffleData.status === 'pending_payment') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-background">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
          <Info className="w-8 h-8 text-orange-600" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Rifa em Ativação</h1>
        <p className="text-muted-foreground mb-6 max-w-sm">
          Esta rifa foi criada mas está aguardando o pagamento da taxa de publicação para ser aberta ao público. <b>Se você é o organizador, acesse o painel para pagar.</b>
        </p>
        <Link href="/">
          <Button variant="outline">Voltar para Início</Button>
        </Link>
      </div>
    );
  }

  // Fetch Participants (Purchases)
  const { data: salesData } = await supabase
    .from('purchases')
    .select('*')
    .eq('raffle_id', raffleData.id);

  const initialRaffle = {
    id: raffleData.id,
    slug: raffleData.slug,
    title: raffleData.title,
    description: raffleData.description,
    imageUrl: raffleData.image_url,
    status: raffleData.status,
    totalNumbers: raffleData.total_numbers,
    pricePerNumber: raffleData.ticket_price,
    drawDate: raffleData.draw_date,
    whatsappGroupLink: raffleData.whatsapp_group_link || '',
    whatsappContact: raffleData.whatsapp_contact || '',
    pixKey: raffleData.pix_key
  };

  const initialParticipants = salesData ? salesData.map(p => ({
    raffleId: p.raffle_id,
    status: p.status,
    selectedNumbers: p.numbers
  })) : [];

  return (
    <RaffleView
      initialRaffle={initialRaffle}
      initialParticipants={initialParticipants}
    />
  );
}
