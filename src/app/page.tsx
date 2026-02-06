
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
  Menu,
  Trophy,
  MousePointer2
} from "lucide-react";
import Link from "next/link";

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
            <Link href="/login">
              <Button variant="outline" className="font-bold border-2">Acessar Painel</Button>
            </Link>
            <Link href="/login">
              <Button className="font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm">Começar Agora</Button>
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
                  Gerenciar Rifas
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
              
              {/* Visual Preview (No images, just UI components) */}
              <div className="relative aspect-square lg:aspect-square bg-white rounded-[2.5rem] shadow-2xl border-[12px] border-slate-900 overflow-hidden flex flex-col group">
                {/* Mobile App Header Mockup */}
                <div className="bg-slate-900 h-6 w-32 mx-auto rounded-b-2xl absolute top-0 left-1/2 -translate-x-1/2 z-20" />
                
                <div className="p-6 pt-12 flex-1 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-bold text-xl">Rifa de Exemplo</h3>
                      <p className="text-xs text-muted-foreground">Prêmio: iPhone 15 Pro Max</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary-foreground">
                      <Trophy className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Number Grid Mockup (The "Codes") */}
                  <div className="grid grid-cols-5 gap-2">
                    {[...Array(20)].map((_, i) => {
                      const num = i + 1;
                      let status = "available";
                      if ([3, 7, 12, 18].includes(num)) status = "paid";
                      if ([5, 14].includes(num)) status = "reserved";
                      if (num === 9) status = "selected";

                      return (
                        <div 
                          key={i} 
                          className={`
                            aspect-square rounded-lg flex items-center justify-center text-[10px] font-bold border transition-all
                            ${status === 'available' ? 'bg-rifa-available/5 text-rifa-available border-rifa-available/10' : ''}
                            ${status === 'paid' ? 'bg-slate-200 text-slate-400 border-transparent' : ''}
                            ${status === 'reserved' ? 'bg-rifa-reserved text-white border-transparent' : ''}
                            ${status === 'selected' ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-110 ring-2 ring-white' : ''}
                          `}
                        >
                          {num.toString().padStart(2, '0')}
                          {num === 9 && <MousePointer2 className="absolute -bottom-2 -right-2 w-4 h-4 text-slate-900 fill-white" />}
                        </div>
                      );
                    })}
                  </div>

                  <div className="space-y-3 pt-4">
                    <div className="flex justify-between text-[10px] font-bold uppercase text-muted-foreground">
                      <span>Progresso</span>
                      <span>65% Vendido</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-rifa-available w-[65%]" />
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="w-full h-12 rounded-xl bg-[#25D366] flex items-center justify-center gap-2 text-white font-bold text-sm shadow-lg">
                      <MessageCircle className="w-5 h-5 fill-current" />
                      Participar Agora
                    </div>
                  </div>
                </div>

                {/* Overlays to make it look active */}
                <div className="absolute inset-0 pointer-events-none border-[1px] border-white/20 rounded-[2rem]" />
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
                  Acessar Painel Agora <Zap className="w-6 h-6 fill-current" />
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
              <li><Link href="#" className="hover:text-primary transition-colors">Termos de Uso</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Privacidade</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">FAQ / Ajuda</Link></li>
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
      </footer>
    </div>
  );
}
