
import { MOCK_RAFFLES } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, ArrowRight, Zap, Share2, MessageCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary py-16 px-6 text-center space-y-6">
        <div className="inline-flex items-center gap-2 bg-white/30 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider">
          <Zap className="w-4 h-4 text-primary-foreground" />
          Rifas Profissionais via WhatsApp
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-primary-foreground leading-tight">
          Crie sua Rifa em <br /> <span className="text-white">Segundos</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-primary-foreground/80 font-medium">
          A ferramenta mais simples e bonita para organizar rifas beneficentes ou comerciais.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/admin">
            <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-bold bg-foreground text-background hover:bg-foreground/90 gap-2">
              Começar Agora <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg font-bold border-foreground/20 text-foreground">
            Saiba Mais
          </Button>
        </div>
      </section>

      {/* Featured Raffles */}
      <section className="max-w-6xl mx-auto py-16 px-6">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-2">Rifas em Destaque</h2>
            <p className="text-muted-foreground">Participe das rifas mais populares do momento</p>
          </div>
          <Link href="/rifas">
            <Button variant="ghost" className="font-bold gap-2">Ver Todas <ArrowRight className="w-4 h-4" /></Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_RAFFLES.map((raffle) => (
            <Card key={raffle.id} className="overflow-hidden group hover:shadow-xl transition-all border-none shadow-lg">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image 
                  src={raffle.imageUrl} 
                  alt={raffle.title} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  data-ai-hint="raffle prize"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-white/90 backdrop-blur-md text-foreground border-none font-bold">
                    Ativa
                  </Badge>
                </div>
              </div>
              <CardHeader className="space-y-1">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl group-hover:text-primary-foreground transition-colors">{raffle.title}</CardTitle>
                </div>
                <CardDescription className="line-clamp-2">{raffle.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-primary-foreground/50" />
                    <span className="text-sm font-semibold">Valor do Número</span>
                  </div>
                  <span className="text-lg font-bold text-foreground">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(raffle.pricePerNumber)}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="gap-2">
                <Link href={`/rifa/${raffle.slug}`} className="flex-1">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                    Participar
                  </Button>
                </Link>
                <Button variant="outline" size="icon">
                  <Share2 className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold italic tracking-tighter">RifaZap</h3>
            <p className="text-background/60 text-sm">
              Sua plataforma completa para criação e gestão de rifas digitais. Simples, rápido e profissional.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold uppercase tracking-wider text-sm">Links Úteis</h4>
            <ul className="space-y-2 text-background/60 text-sm">
              <li><Link href="/termos" className="hover:text-white">Termos de Uso</Link></li>
              <li><Link href="/privacidade" className="hover:text-white">Privacidade</Link></li>
              <li><Link href="/faq" className="hover:text-white">Perguntas Frequentes</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold uppercase tracking-wider text-sm">Suporte</h4>
            <Button variant="outline" className="w-full border-background/20 text-background hover:bg-white hover:text-foreground font-bold h-12 gap-2">
              <MessageCircle className="w-5 h-5" /> Falar no WhatsApp
            </Button>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-background/10 text-center text-xs text-background/40">
          © 2024 RifaZap. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}
