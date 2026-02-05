
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Zap, 
  MessageCircle, 
  Share2,
  CheckCircle2, 
  Smartphone, 
  Users, 
  ShieldCheck,
  Menu
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-6 mx-auto">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary-foreground fill-primary" />
            <span className="text-2xl font-bold tracking-tighter">RifaZap</span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Link href="/admin">
              <Button variant="outline" className="font-bold border-2">Entrar</Button>
            </Link>
            <Link href="/admin">
              <Button className="font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm">Registrar</Button>
            </Link>
          </div>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-primary py-20 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="container relative mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 bg-white/30 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider text-primary-foreground">
              <Zap className="w-4 h-4" />
              Plataforma #1 para Rifas Digitais
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-primary-foreground leading-tight tracking-tight">
              Sua Rifa no WhatsApp <br /> <span className="text-white">em 60 Segundos</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-primary-foreground/90 font-medium">
              A maneira mais simples, rápida e profissional de organizar sorteios, gerenciar pagamentos via PIX e crescer sua audiência.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Link href="/admin">
                <Button size="lg" className="w-full sm:w-auto h-16 px-10 text-xl font-bold bg-foreground text-background hover:bg-foreground/90 shadow-xl gap-2 rounded-2xl">
                  Criar Minha Rifa <ArrowRight className="w-6 h-6" />
                </Button>
              </Link>
              <Link href="/admin">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-16 px-10 text-xl font-bold border-foreground/20 text-foreground bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20">
                  Começar Agora
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 border-b bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-3xl font-bold">+10k</p>
                <p className="text-sm text-muted-foreground uppercase font-semibold">Rifas Criadas</p>
              </div>
              <div>
                <p className="text-3xl font-bold">R$ 2M+</p>
                <p className="text-sm text-muted-foreground uppercase font-semibold">Em Prêmios</p>
              </div>
              <div>
                <p className="text-3xl font-bold">100%</p>
                <p className="text-sm text-muted-foreground uppercase font-semibold">Seguro (PIX)</p>
              </div>
              <div>
                <p className="text-3xl font-bold">24/7</p>
                <p className="text-sm text-muted-foreground uppercase font-semibold">Suporte WhatsApp</p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="beneficios" className="py-24 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Por que escolher o RifaZap?</h2>
                <div className="space-y-6">
                  {[
                    {
                      icon: <Smartphone className="h-6 w-6 text-primary-foreground" />,
                      title: "Foco Total em Mobile",
                      desc: "99% das rifas são acessadas pelo celular. Nossa plataforma é a mais rápida e bonita no smartphone."
                    },
                    {
                      icon: <ShieldCheck className="h-6 w-6 text-primary-foreground" />,
                      title: "Pagamento Via PIX",
                      desc: "Integração nativa com PIX Copia e Cola para facilitar a vida do seu cliente e a sua gestão."
                    },
                    {
                      icon: <Users className="h-6 w-6 text-primary-foreground" />,
                      title: "Gestão de Participantes",
                      desc: "Lista completa de nomes e telefones organizada. Exporte para Excel ou use para remarketing."
                    },
                    {
                      icon: <CheckCircle2 className="h-6 w-6 text-primary-foreground" />,
                      title: "Transparência Total",
                      desc: "Seus clientes veem em tempo real quais números estão disponíveis, reservados ou pagos."
                    }
                  ].map((benefit, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="mt-1 h-10 w-10 shrink-0 rounded-xl bg-primary flex items-center justify-center">
                        {benefit.icon}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold">{benefit.title}</h4>
                        <p className="text-muted-foreground">{benefit.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative aspect-square md:aspect-video lg:aspect-square bg-primary/20 rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white">
                <Image 
                  src="https://images.unsplash.com/photo-1556742049-139b12cc20c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxzbWFydHBob25lJTIwcGF5bWVudHxlbnwwfHx8fDE3NzAyNTUxNDF8MA&ixlib=rb-4.1.0&q=80&w=1080" 
                  alt="Gestão de Rifa no Celular" 
                  fill 
                  className="object-cover"
                  data-ai-hint="smartphone payment"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-24 px-6 bg-foreground text-background">
          <div className="container mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight">Pronto para começar sua rifa?</h2>
            <p className="text-xl text-background/70 max-w-2xl mx-auto">
              Junte-se a milhares de organizadores que já arrecadaram mais de R$ 2 milhões com a nossa plataforma.
            </p>
            <div className="pt-4">
              <Link href="/admin">
                <Button size="lg" className="h-16 px-12 text-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl gap-3">
                  Criar Rifa Agora <Zap className="w-6 h-6 fill-current" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-muted py-16 px-6 border-t">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary-foreground fill-primary" />
              <span className="text-2xl font-bold tracking-tighter">RifaZap</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              A plataforma definitiva para criar e gerenciar rifas profissionais. Simplicidade, segurança e resultados para você.
            </p>
            <div className="flex gap-4">
              <Button variant="ghost" size="icon" className="rounded-full bg-white"><Share2 className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" className="rounded-full bg-white"><MessageCircle className="h-4 w-4" /></Button>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-bold uppercase tracking-wider text-sm">Plataforma</h4>
            <ul className="space-y-3 text-muted-foreground text-sm font-medium">
              <li><Link href="/admin" className="hover:text-primary transition-colors">Área do Organizador</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold uppercase tracking-wider text-sm">Legal</h4>
            <ul className="space-y-3 text-muted-foreground text-sm font-medium">
              <li><Link href="/termos" className="hover:text-primary transition-colors">Termos de Uso</Link></li>
              <li><Link href="/privacidade" className="hover:text-primary transition-colors">Privacidade</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ / Ajuda</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-bold uppercase tracking-wider text-sm">Suporte</h4>
            <p className="text-sm text-muted-foreground">Precisa de ajuda? Nossa equipe está pronta para te atender.</p>
            <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold h-12 gap-2 rounded-xl">
              <MessageCircle className="w-5 h-5" /> Falar no WhatsApp
            </Button>
          </div>
        </div>
        <div className="container mx-auto mt-16 pt-8 border-t text-center text-xs text-muted-foreground/60 font-medium">
          © 2024 RifaZap. Desenvolvido com ❤️ para organizadores de todo o Brasil.
        </div>
      </footer>
    </div>
  );
}
