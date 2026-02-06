
"use client";

import { useState, useEffect } from "react";
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
  MousePointer2,
  QrCode,
  Loader2
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 4);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

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
            <div className="inline-flex items-center gap-2 bg-white/30 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider text-primary-foreground animate-bounce">
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
              <Link href="/login">
                <Button size="lg" className="w-full sm:w-auto h-16 px-10 text-xl font-bold bg-foreground text-background hover:bg-foreground/90 shadow-xl gap-2 rounded-2xl">
                  Criar Minha Rifa <ArrowRight className="w-6 h-6" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-16 px-10 text-xl font-bold border-foreground/20 text-foreground bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20">
                  Gerenciar Rifas
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 border-b bg-white">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-1">
                <p className="text-4xl font-black text-primary-foreground">+10k</p>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Rifas Criadas</p>
              </div>
              <div className="space-y-1">
                <p className="text-4xl font-black text-primary-foreground">R$ 2M+</p>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Em Prêmios</p>
              </div>
              <div className="space-y-1">
                <p className="text-4xl font-black text-primary-foreground">100%</p>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Seguro (PIX)</p>
              </div>
              <div className="space-y-1">
                <p className="text-4xl font-black text-primary-foreground">24/7</p>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Suporte</p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section with Animated Preview */}
        <section id="beneficios" className="py-24 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">Como funciona para seu cliente?</h2>
                  <p className="text-lg text-muted-foreground font-medium">Simples, intuitivo e feito para converter mais vendas pelo celular.</p>
                </div>
                
                <div className="space-y-6">
                  {[
                    {
                      icon: <Smartphone className="h-6 w-6 text-primary-foreground" />,
                      title: "Escolha dos Números",
                      desc: "Interface limpa onde o cliente seleciona os números da sorte em segundos.",
                      active: animationStep === 0
                    },
                    {
                      icon: <Users className="h-6 w-6 text-primary-foreground" />,
                      title: "Cadastro Rápido",
                      desc: "Apenas nome e WhatsApp. Sem formulários chatos ou senhas complicadas.",
                      active: animationStep === 1
                    },
                    {
                      icon: <ShieldCheck className="h-6 w-6 text-primary-foreground" />,
                      title: "Pagamento Facilitado",
                      desc: "Geração de PIX Copia e Cola automático para garantir a reserva na hora.",
                      active: animationStep === 2
                    },
                    {
                      icon: <CheckCircle2 className="h-6 w-6 text-primary-foreground" />,
                      title: "Participação Confirmada",
                      desc: "Comprovante enviado direto para o seu WhatsApp para validação rápida.",
                      active: animationStep === 3
                    }
                  ].map((benefit, i) => (
                    <div key={i} className={`flex gap-4 p-4 rounded-2xl transition-all duration-500 ${benefit.active ? 'bg-white shadow-lg scale-105 border-l-4 border-primary' : 'opacity-50'}`}>
                      <div className={`mt-1 h-12 w-12 shrink-0 rounded-xl flex items-center justify-center transition-colors ${benefit.active ? 'bg-primary' : 'bg-muted'}`}>
                        {benefit.icon}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold">{benefit.title}</h4>
                        <p className="text-muted-foreground text-sm leading-relaxed">{benefit.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Visual Preview (Animated Flow) */}
              <div className="relative aspect-square bg-white rounded-[3rem] shadow-2xl border-[12px] border-slate-900 overflow-hidden flex flex-col">
                {/* Mobile App Header Mockup */}
                <div className="bg-slate-900 h-6 w-32 mx-auto rounded-b-2xl absolute top-0 left-1/2 -translate-x-1/2 z-20" />
                
                <div className="p-8 pt-12 flex-1 flex flex-col">
                  {/* Step 0: Grid Selection */}
                  {animationStep === 0 && (
                    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h3 className="font-bold text-xl">iPhone 15 Pro Max</h3>
                          <p className="text-xs text-muted-foreground">Selecione suas cotas</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary-foreground">
                          <Trophy className="w-5 h-5" />
                        </div>
                      </div>

                      <div className="grid grid-cols-5 gap-3 relative">
                        {[...Array(20)].map((_, i) => (
                          <div 
                            key={i} 
                            className={`
                              aspect-square rounded-xl flex items-center justify-center text-xs font-bold border transition-all duration-300
                              ${i === 8 ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-110' : 'bg-muted/30 text-muted-foreground border-border'}
                              ${[2, 5, 12, 18].includes(i) ? 'bg-slate-200 opacity-40' : ''}
                            `}
                          >
                            {(i + 1).toString().padStart(2, '0')}
                          </div>
                        ))}
                        <div className="absolute top-[45%] left-[55%] animate-bounce">
                          <MousePointer2 className="w-8 h-8 text-slate-900 fill-white drop-shadow-lg" />
                        </div>
                      </div>

                      <div className="mt-auto">
                        <div className="w-full h-14 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground font-black shadow-lg">
                          RESERVAR 01 NÚMERO
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 1: Form Filling */}
                  {animationStep === 1 && (
                    <div className="space-y-6 animate-in slide-in-from-right duration-500 h-full flex flex-col justify-center">
                      <div className="text-center space-y-2">
                        <Users className="w-12 h-12 mx-auto text-primary-foreground" />
                        <h3 className="font-bold text-2xl">Quase lá!</h3>
                        <p className="text-sm text-muted-foreground">Preencha para garantir sua reserva</p>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                          <div className="h-12 w-full bg-muted/30 border-2 border-primary rounded-xl flex items-center px-4 font-bold text-sm">
                            João da Silva|
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                          <div className="h-12 w-full bg-muted/30 border rounded-xl flex items-center px-4 text-muted-foreground text-sm">
                            (11) 99999-9999
                          </div>
                        </div>
                      </div>

                      <Button className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-black text-lg">
                        CONFIRMAR RESERVA
                      </Button>
                    </div>
                  )}

                  {/* Step 2: PIX Payment */}
                  {animationStep === 2 && (
                    <div className="space-y-6 animate-in slide-in-from-right duration-500 h-full flex flex-col items-center justify-center">
                      <div className="text-center space-y-1">
                        <h3 className="font-bold text-2xl">Pagamento PIX</h3>
                        <p className="text-sm text-muted-foreground">Copie a chave e pague no seu banco</p>
                      </div>

                      <div className="p-4 bg-white border-2 border-primary rounded-3xl shadow-xl">
                        <QrCode className="w-32 h-32 text-slate-900" />
                      </div>

                      <div className="w-full space-y-3">
                        <div className="w-full h-12 bg-muted rounded-xl flex items-center justify-between px-4 font-mono text-xs">
                          00020126330014BR.GOV.BCB...
                          <Loader2 className="w-4 h-4 animate-spin text-primary-foreground" />
                        </div>
                        <Button className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-black text-lg">
                          COPIAR CÓDIGO PIX
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Success & Share */}
                  {animationStep === 3 && (
                    <div className="space-y-8 animate-in zoom-in duration-500 h-full flex flex-col items-center justify-center text-center">
                      <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                        <CheckCircle2 className="w-14 h-14 text-white" />
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-black text-3xl text-slate-900">SUCESSO!</h3>
                        <p className="text-muted-foreground font-medium px-4">Sua reserva do número 09 foi confirmada. Boa sorte!</p>
                      </div>

                      <div className="w-full space-y-3 pt-4">
                        <Button className="w-full h-16 rounded-2xl bg-[#25D366] text-white font-black text-lg gap-3 shadow-lg hover:bg-[#128C7E]">
                          <MessageCircle className="w-6 h-6 fill-current" /> ENVIAR COMPROVANTE
                        </Button>
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Clique acima para validar</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Overlays */}
                <div className="absolute inset-0 pointer-events-none border-[1px] border-white/20 rounded-[2.5rem]" />
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-24 px-6 bg-foreground text-background">
          <div className="container mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight">Pronto para arrecadar?</h2>
            <p className="text-xl text-background/70 max-w-2xl mx-auto">
              Junte-se a milhares de organizadores que já utilizam a RifaZap para profissionalizar seus sorteios.
            </p>
            <div className="pt-4">
              <Link href="/login">
                <Button size="lg" className="h-20 px-12 text-2xl font-black bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl gap-3 shadow-[0_0_30px_rgba(255,221,43,0.3)] transition-all hover:scale-105">
                  CRIAR MINHA RIFA AGORA <Zap className="w-8 h-8 fill-current" />
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
              <Button variant="ghost" size="icon" className="rounded-full bg-white shadow-sm"><Share2 className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" className="rounded-full bg-white shadow-sm"><MessageCircle className="h-4 w-4" /></Button>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-bold uppercase tracking-wider text-sm">Plataforma</h4>
            <ul className="space-y-3 text-muted-foreground text-sm font-medium">
              <li><Link href="/login" className="hover:text-primary transition-colors">Área do Organizador</Link></li>
              <li><Link href="/login" className="hover:text-primary transition-colors">Criar Rifa</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold uppercase tracking-wider text-sm">Legal</h4>
            <ul className="space-y-3 text-muted-foreground text-sm font-medium">
              <li><Link href="#" className="hover:text-primary transition-colors">Termos de Uso</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Privacidade</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-bold uppercase tracking-wider text-sm">Suporte</h4>
            <p className="text-sm text-muted-foreground">Precisa de ajuda? Fale com nossa equipe agora mesmo.</p>
            <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold h-14 gap-2 rounded-2xl shadow-lg">
              <MessageCircle className="w-5 h-5 fill-current" /> Suporte via WhatsApp
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
