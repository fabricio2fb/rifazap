
"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Loader2,
  Coins,
  ExternalLink,
  HelpCircle,
  Wifi,
  BatteryMedium,
  Signal,
  Sparkles,
  Palette,
  Clock,
  ShoppingCart
} from "lucide-react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function Home() {
  const [animationStep, setAnimationStep] = useState(0);

  // Editor Mini Showcase States
  const [editorPrimaryColor, setEditorPrimaryColor] = useState('#ea580c');
  const [editorThemeMode, setEditorThemeMode] = useState<'claro' | 'escuro'>('claro');
  const [isEditorInteracted, setIsEditorInteracted] = useState(false);

  // We memoize editorColors so it can be used safely in useEffect
  const editorColors = useMemo(() => ['#ea580c', '#3b82f6', '#22c55e', '#ef4444', '#eab308', '#a855f7', '#ec4899', '#06b6d4', '#000000'], []);

  const templatesList = [
    { id: 'mint', name: 'Mint' },
    { id: 'gold', name: 'Gold' },
    { id: 'pink', name: 'Pink' },
    { id: 'solar', name: 'Solar' },
    { id: 'nebula', name: 'Nebula' },
    { id: 'scrapbook', name: 'Scrapbook' },
    { id: 'calor', name: 'Calor' },
    { id: 'juliana', name: 'Juliana' },
    { id: 'creme', name: 'Creme' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 4);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isEditorInteracted) return;
    const editorTimer = setInterval(() => {
      setEditorThemeMode(prev => prev === 'claro' ? 'escuro' : 'claro');
      setEditorPrimaryColor(prev => {
        const currentIndex = editorColors.indexOf(prev);
        return editorColors[(currentIndex + 1) % editorColors.length];
      });
    }, 3500);
    return () => clearInterval(editorTimer);
  }, [isEditorInteracted, editorColors]);

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-x-hidden">
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}} />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-6 mx-auto">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary-foreground fill-primary" />
            <span className="text-2xl font-bold tracking-tighter"> Apoiêfy</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link href="#exemplo" className="text-sm font-bold hover:text-primary-foreground transition-colors">Exemplo</Link>
            <Link href="#beneficios" className="text-sm font-bold hover:text-primary-foreground transition-colors">Benefícios</Link>
            <Link href="#preços" className="text-sm font-bold hover:text-primary-foreground transition-colors">Preços</Link>
            <Link href="#faq" className="text-sm font-bold hover:text-primary-foreground transition-colors">Dúvidas</Link>
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
              Plataforma #1 para Campanhas Digitais
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-primary-foreground leading-tight tracking-tight">
              Sua Campanha no WhatsApp <br /> em 60 Segundos
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-primary-foreground/90 font-medium">
              A maneira mais simples, rápida e profissional de organizar campanhas online, gerenciar participações e arrecadar muito mais.
            </p>
            <div className="max-w-3xl mx-auto mt-6 bg-white/40 backdrop-blur-md border border-black/10 rounded-2xl p-6 text-sm md:text-base text-slate-800 font-medium text-left shadow-lg">
              <p className="mb-3 font-bold text-slate-900 text-base md:text-lg">A Apoiêfy fornece infraestrutura tecnológica para criação e gestão de campanhas digitais.</p>
              <ul className="list-disc pl-5 space-y-2 text-slate-800">
                <li>Os valores pagos pelos apoiadores são enviados diretamente para a conta do organizador via PIX.</li>
                <li>A Apoiêfy não intermedeia, retém ou movimenta valores financeiros.</li>
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Link href="/login">
                <Button size="lg" className="w-full sm:w-auto h-16 px-10 text-xl font-bold bg-foreground text-background hover:bg-foreground/90 shadow-xl gap-2 rounded-2xl">
                  Criar Minha Campanha <ArrowRight className="w-6 h-6" />
                </Button>
              </Link>
              <Link href="/campanha/exemplo-pc-gamer">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-16 px-10 text-xl font-bold border-foreground/20 text-foreground bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20">
                  Ver Demonstração
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
                <p className="text-4xl font-black text-primary-foreground">+12.400</p>
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Campanhas Criadas</p>
              </div>
              <div className="space-y-1">
                <p className="text-4xl font-black text-primary-foreground">R$ 4.2M+</p>
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Arrecadados</p>
              </div>
              <div className="space-y-1">
                <p className="text-4xl font-black text-primary-foreground">100%</p>
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Seguro via PIX</p>
              </div>
              <div className="space-y-1">
                <p className="text-4xl font-black text-primary-foreground">+45k</p>
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Apoiadores Ativos</p>
              </div>
            </div>
          </div>
        </section>

        {/* Example Section - Preview Real */}
        <section id="exemplo" className="py-24 bg-white border-b overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1 space-y-8 text-center lg:text-left">
                <div className="space-y-4">
                  <Badge className="bg-primary/20 text-primary-foreground font-black px-4 py-1.5 rounded-full text-xs uppercase tracking-widest">Veja na Prática</Badge>
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.9]">Preview real da <br /><span className="text-primary-foreground">página de campanha</span></h2>
                  <p className="text-lg text-muted-foreground font-medium max-w-xl">
                    Nada de artes estáticas. Seus clientes acessam um sistema dinâmico, rápido e visualmente incrível, otimizado para fechar a venda no ato.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link href="/campanha/exemplo-pc-gamer">
                    <Button size="lg" className="h-16 px-8 rounded-2xl text-lg font-black gap-3 shadow-xl hover:scale-105 transition-transform">
                      ABRIR EXEMPLO COMPLETO <ExternalLink className="w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Smartphone Frame com Preview Real - Visual Upgrades */}
              <div className="flex-1 relative group">
                <div className="absolute -inset-10 bg-primary/30 rounded-[4rem] blur-[100px] group-hover:bg-primary/50 group-hover:blur-[120px] transition-all duration-700 animate-pulse" />

                {/* Frame do Smartphone (iPhone Style) */}
                <div className="relative bg-[#16171a] rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] border-8 border-zinc-800 overflow-hidden w-full max-w-[360px] mx-auto transform hover:-translate-y-4 transition-all duration-500 h-[720px] flex flex-col ring-4 ring-black/80">
                  {/* Dynamic Island */}
                  <div className="bg-black h-7 w-32 mx-auto rounded-full absolute top-3 left-1/2 -translate-x-1/2 z-40 flex items-center justify-around px-4">
                    <div className="h-2 w-2 rounded-full bg-slate-800" />
                    <div className="h-1.5 w-8 rounded-full bg-slate-800" />
                  </div>

                  {/* Status Bar */}
                  <div className="h-10 w-full flex items-center justify-between px-8 pt-4 pb-2 bg-white z-30">
                    <span className="text-xs font-bold text-slate-900">09:41</span>
                    <div className="flex items-center gap-1.5">
                      <Signal className="w-3.5 h-3.5" />
                      <Wifi className="w-3.5 h-3.5" />
                      <BatteryMedium className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Conteúdo Realista da Campanha */}
                  <div className="flex-1 overflow-y-auto no-scrollbar bg-white">
                    {/* Header Image */}
                    <div className="relative aspect-video w-full overflow-hidden">
                      <Image
                        src="/pcgamer.jpg"
                        alt="PC Gamer"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-green-500 text-white border-none font-black text-[10px] uppercase tracking-widest px-3 py-1 shadow-lg">ATIVA</Badge>
                      </div>
                    </div>

                    <div className="p-5 space-y-6">
                      {/* Info Principal */}
                      <div className="space-y-2">
                        <h4 className="font-black text-xl leading-tight text-slate-900">Apoie nosso Projeto + PC Gamer</h4>
                        <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                          Apoie nosso projeto participando da campanha. Cada participação: R$ 1,00
                        </p>
                      </div>

                      {/* Grid de Stats */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
                            <Trophy className="w-5 h-5 text-primary-foreground" />
                          </div>
                          <div className="leading-none">
                            <p className="text-[10px] uppercase font-black text-muted-foreground mb-1">Participação</p>
                            <p className="font-black text-sm text-slate-900">R$ 1,00</p>
                          </div>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-green-100 flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="leading-none">
                            <p className="text-[10px] uppercase font-black text-muted-foreground mb-1">Encerramento</p>
                            <p className="font-black text-xs text-slate-900">15/01/25</p>
                          </div>
                        </div>
                      </div>

                      {/* Progresso */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                          <span>Vendas</span>
                          <span className="text-primary-foreground">64% Completo</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: '64%' }} />
                        </div>
                      </div>

                      {/* Grade de Tickets Realista */}
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between">
                          <h5 className="font-black text-xs uppercase tracking-widest">Escolha sua Participação</h5>
                          <span className="text-[10px] font-bold text-muted-foreground">Ver todos</span>
                        </div>
                        <div className="grid grid-cols-5 gap-2 pb-24">
                          {[...Array(25)].map((_, i) => {
                            const num = i + 1;
                            const status = [2, 5, 12, 18, 22].includes(i) ? 'paid' : [8, 14, 20].includes(i) ? 'reserved' : 'available';
                            const isSelected = num === 9;
                            return (
                              <div
                                key={i}
                                className={cn(
                                  "aspect-square rounded-xl flex items-center justify-center text-[11px] font-black border transition-all duration-300",
                                  status === 'available' && !isSelected && "bg-slate-50 text-slate-400 border-slate-100",
                                  status === 'reserved' && "bg-amber-100 text-amber-600 border-amber-200",
                                  status === 'paid' && "bg-slate-200 text-slate-100 border-transparent opacity-40",
                                  isSelected && "bg-primary text-primary-foreground border-primary shadow-[0_5px_15px_rgba(255,221,43,0.4)] scale-110 z-10"
                                )}
                              >
                                {num.toString().padStart(2, '0')}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Botão de Checkout Flutuante Simulado */}
                  <div className="absolute bottom-6 left-4 right-4 z-40 animate-bounce">
                    <div className="w-full h-16 rounded-2xl bg-primary flex items-center justify-between px-6 shadow-[0_20px_40px_rgba(234,88,12,0.4)]">
                      <div className="text-left py-1">
                        <p className="text-[10px] items-center gap-1 font-black uppercase text-primary-foreground/80 flex"><ShoppingCart className="w-3 h-3" /> 01 Participação</p>
                        <p className="font-black text-white text-base">COMPRAR AGORA</p>
                      </div>
                      <div className="bg-white/20 backdrop-blur p-2 rounded-xl">
                        <ArrowRight className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Home Indicator */}
                  <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 h-1 w-24 bg-white/40 rounded-full z-40" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="beneficios" className="py-24 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="space-y-4 text-center lg:text-left">
                  <div className="inline-flex h-8 items-center justify-center rounded-full bg-primary/20 text-slate-800 px-4 mb-2 font-black text-[10px] tracking-widest uppercase border border-primary/30">
                    Simulação de Compra
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">Como seus clientes participam da campanha</h2>
                  <p className="text-lg text-muted-foreground font-medium">Nossa interface foi desenhada para facilitar compras incríveis com poucos cliques direto no celular.</p>
                </div>

                <div className="space-y-6">
                  {[
                    {
                      icon: <Smartphone className="h-6 w-6 text-primary-foreground" />,
                      title: "Escolha das Participações",
                      desc: "Grade interativa onde o apoiador vê na hora o que está livre ou ocupado.",
                      active: animationStep === 0
                    },
                    {
                      icon: <Users className="h-6 w-6 text-primary-foreground" />,
                      title: "Cadastro Instantâneo",
                      desc: "Sem senhas. O cliente só coloca Nome e WhatsApp e já vai para o pagamento.",
                      active: animationStep === 1
                    },
                    {
                      icon: <ShieldCheck className="h-6 w-6 text-primary-foreground" />,
                      title: "PIX Automático",
                      desc: "Geramos automaticamente o código PIX. O pagamento é realizado diretamente na conta do organizador.",
                      active: animationStep === 2
                    },
                    {
                      icon: <CheckCircle2 className="h-6 w-6 text-primary-foreground" />,
                      title: "Baixa em 1 Segundo",
                      desc: "O cliente te envia o comprovante no WhatsApp e você confirma com um clique.",
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

              {/* Visual Preview Interativo - Tamanho Aumentado */}
              <div className="relative bg-white rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-[12px] border-slate-900 overflow-hidden flex flex-col w-full max-w-[420px] mx-auto h-[740px]">
                <div className="bg-slate-900 h-6 w-32 mx-auto rounded-b-2xl absolute top-0 left-1/2 -translate-x-1/2 z-20" />
                <div className="p-8 pt-16 flex-1 flex flex-col h-full">
                  {animationStep === 0 && (
                    <div className="space-y-8 animate-in fade-in zoom-in duration-500 flex-1 flex flex-col">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h3 className="font-black text-2xl">iPhone 15 Pro</h3>
                          <p className="text-sm font-bold text-muted-foreground">Escolha suas participações</p>
                        </div>
                        <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary-foreground">
                          <Trophy className="w-6 h-6" />
                        </div>
                      </div>
                      <div className="grid grid-cols-5 gap-4 relative">
                        {[...Array(20)].map((_, i) => (
                          <div key={i} className={`aspect-square rounded-xl flex items-center justify-center text-sm font-black border ${i === 8 ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-110' : 'bg-muted/30 text-muted-foreground border-border'} ${[2, 5, 12, 18].includes(i) ? 'bg-slate-200 opacity-40' : ''}`}>
                            {(i + 1).toString().padStart(2, '0')}
                          </div>
                        ))}
                        <div className="absolute top-[45%] left-[55%] animate-bounce">
                          <MousePointer2 className="w-10 h-10 text-slate-900 fill-white drop-shadow-xl" />
                        </div>
                      </div>
                      <div className="mt-auto">
                        <div className="w-full h-16 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground font-black text-lg shadow-xl">RESERVAR 01 PARTICIPAÇÃO</div>
                      </div>
                    </div>
                  )}
                  {animationStep === 1 && (
                    <div className="space-y-8 animate-in slide-in-from-right duration-500 h-full flex flex-col justify-center">
                      <div className="text-center space-y-3">
                        <Users className="w-16 h-16 mx-auto text-primary-foreground" />
                        <h3 className="font-black text-3xl">Quase lá!</h3>
                        <p className="text-base text-muted-foreground font-bold">Preencha para garantir sua reserva</p>
                      </div>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <div className="h-5 w-24 bg-muted rounded animate-pulse" />
                          <div className="h-14 w-full bg-muted/30 border-2 border-primary rounded-2xl flex items-center px-4 font-black text-lg">João da Silva|</div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-5 w-24 bg-muted rounded animate-pulse" />
                          <div className="h-14 w-full bg-muted/30 border rounded-2xl flex items-center px-4 text-muted-foreground text-lg">(11) 99999-9999</div>
                        </div>
                      </div>
                      <Button className="w-full h-16 rounded-2xl bg-primary text-primary-foreground font-black text-xl shadow-xl">CONFIRMAR RESERVA</Button>
                    </div>
                  )}
                  {animationStep === 2 && (
                    <div className="space-y-8 animate-in slide-in-from-right duration-500 h-full flex flex-col items-center justify-center">
                      <div className="text-center space-y-2">
                        <h3 className="font-black text-3xl">Pagamento PIX</h3>
                        <p className="text-base text-muted-foreground font-bold">Copie a chave e pague no seu banco</p>
                      </div>
                      <div className="p-6 bg-white border-2 border-primary rounded-[2.5rem] shadow-2xl">
                        <QrCode className="w-40 h-40 text-slate-900" />
                      </div>
                      <div className="w-full space-y-4">
                        <div className="w-full h-14 bg-muted rounded-2xl flex items-center justify-between px-4 font-mono text-sm overflow-hidden">
                          00020126330014BR.GOV...
                          <Loader2 className="w-5 h-5 animate-spin text-primary-foreground" />
                        </div>
                        <Button className="w-full h-16 rounded-2xl bg-primary text-primary-foreground font-black text-xl shadow-xl">COPIAR CÓDIGO PIX</Button>
                      </div>
                    </div>
                  )}
                  {animationStep === 3 && (
                    <div className="space-y-10 animate-in zoom-in duration-500 h-full flex flex-col items-center justify-center text-center">
                      <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center shadow-[0_20px_40px_rgba(34,197,94,0.3)] animate-bounce">
                        <CheckCircle2 className="w-20 h-20 text-white" />
                      </div>
                      <div className="space-y-3">
                        <h3 className="font-black text-4xl text-slate-900">SUCESSO!</h3>
                        <p className="text-lg text-muted-foreground font-black px-6">Sua reserva da participação 09 foi confirmada. Boa sorte!</p>
                      </div>
                      <div className="w-full space-y-4 pt-6">
                        <Button className="w-full h-20 rounded-2xl bg-[#25D366] text-white font-black text-xl gap-3 shadow-[0_20px_40px_rgba(37,211,102,0.4)] hover:bg-[#128C7E] animate-pulse relative overflow-hidden group">
                          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                          <MessageCircle className="w-8 h-8 fill-current" /> ENVIAR COMPROVANTE
                        </Button>
                        <p className="text-xs text-muted-foreground uppercase font-black tracking-widest">Clique acima para validar sua participação</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRO Editor Showcase - Mini Functional Editor */}
        <section className="py-24 bg-[#121214] border-y border-zinc-900 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/10 blur-[120px] rounded-full point-events-none" />

          <div className="container mx-auto px-6 space-y-16 relative z-10 text-center">
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="inline-flex h-8 items-center justify-center rounded-full bg-orange-500/20 text-orange-500 px-4 mb-2 font-black text-[10px] tracking-widest uppercase border border-orange-500/30">
                <Sparkles className="w-3.5 h-3.5 mr-2" /> Exclusividade Apoiêfy
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
                Experimente o Editor PRO Exclusivo
              </h2>
              <p className="text-lg text-zinc-400 font-medium max-w-2xl mx-auto leading-relaxed">
                A única plataforma que permite você transformar sua campanha num site profissional, com identidade própria, contadores de escassez e notificações em tempo real. Teste abaixo!
              </p>
            </div>

            {/* Mini Editor UI */}
            <div className="mx-auto w-full max-w-[1000px] bg-[#1a1b1f] border border-zinc-800 rounded-2xl shadow-2xl flex flex-col md:flex-row text-left overflow-hidden ring-4 ring-black/50">

              {/* Sidebar do Editor */}
              <div className="w-full md:w-80 bg-[#16171a] border-r border-zinc-800/60 p-6 flex flex-col shrink-0">
                <div className="flex items-center gap-2 mb-8 border-b border-zinc-800 pb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center text-white"><Palette className="w-4 h-4" /></div>
                  <div>
                    <h3 className="text-white font-black text-sm">Editor da Campanha</h3>
                    <p className="text-[10px] font-bold text-orange-500 uppercase">Apoiêfy PRO</p>
                  </div>
                </div>

                <div className="flex bg-zinc-900/50 p-1 rounded-xl mb-8 border border-zinc-800">
                  <button className="flex-1 bg-zinc-800 text-white shadow rounded-lg py-1.5 text-xs font-bold text-center">Design</button>
                  <button className="flex-1 text-zinc-500 hover:text-white py-1.5 text-xs font-bold text-center">Avisos</button>
                </div>

                <div className="space-y-8 flex-1">
                  <div>
                    <h4 className="text-white font-black text-sm mb-1">Cores e Tema</h4>
                    <p className="text-zinc-500 text-[11px] font-medium leading-tight mb-4">Personalize a aparência da sua página.</p>

                    <div className="mb-6">
                      <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-2 block">Tema Base</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => { setEditorThemeMode('claro'); setIsEditorInteracted(true); }} className={`py-2 px-3 rounded-lg text-xs font-bold border-2 transition-all ${editorThemeMode === 'claro' ? 'border-orange-500 text-white bg-zinc-800' : 'border-zinc-800 text-zinc-400 hover:bg-zinc-800/50'}`}>Claro</button>
                        <button onClick={() => { setEditorThemeMode('escuro'); setIsEditorInteracted(true); }} className={`py-2 px-3 rounded-lg text-xs font-bold border-2 transition-all ${editorThemeMode === 'escuro' ? 'border-orange-500 text-white bg-zinc-800' : 'border-zinc-800 text-zinc-400 hover:bg-zinc-800/50'}`}>Escuro</button>
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-2 flex justify-between items-center">
                        Cor Primária
                        {isEditorInteracted && <span className="text-[8px] bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded animate-pulse">INTERAÇÃO ATIVADA</span>}
                      </label>
                      <div className="bg-[#09090b] p-3 rounded-2xl grid grid-cols-5 gap-y-3 gap-x-2 border border-zinc-800/80">
                        {editorColors.map((c: string) => (
                          <button key={c} onClick={() => { setEditorPrimaryColor(c); setIsEditorInteracted(true); }} className={`w-9 h-9 mx-auto rounded-full shadow-inner ring-2 ring-offset-2 ring-offset-[#09090b] ${editorPrimaryColor === c ? 'ring-slate-400 scale-110' : 'ring-transparent hover:scale-110'} transition-all duration-300`} style={{ backgroundColor: c }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Área de Preview Transparente Quadriculada */}
              <div className="flex-1 bg-[#09090b] relative flex items-center justify-center p-8 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px]">

                {/* Smartphone Frame Simulator */}
                <div className="w-full max-w-[300px] bg-black rounded-[2.5rem] p-2 md:p-2.5 shadow-2xl relative border-2 border-zinc-800 ring-4 ring-black aspect-[9/19] flex flex-col items-center">
                  <div className="bg-black w-24 h-5 absolute top-2 rounded-b-xl z-20" />

                  {/* Inner Screen */}
                  <div className={`w-full h-full rounded-[2rem] overflow-hidden flex flex-col relative transition-colors duration-500 border ${editorThemeMode === 'claro' ? 'bg-white border-zinc-200' : 'bg-[#121214] text-white border-zinc-900'}`}>

                    {/* Header Mock */}
                    <div className="h-44 w-full bg-zinc-200 relative overflow-hidden shrink-0">
                      <Image src="/pcgamer.jpg" alt="Exemplo" fill className="object-cover" />
                      {/* Notificação Pulse */}
                      <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur w-fit whitespace-nowrap text-white text-[8px] px-2.5 py-1.5 rounded-full flex gap-1.5 items-center shadow-lg border border-white/10 animate-pulse z-10 font-medium">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" /> João comprou 5 cotas
                      </div>
                      {/* Countdown Overlay Mock */}
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[9px] font-black px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                        <Clock className="w-3 h-3" /> ACABA EM 02:45:10
                      </div>
                    </div>

                    {/* Body Mock */}
                    <div className="px-4 py-3 space-y-3 flex-1 overflow-y-auto no-scrollbar">
                      <div>
                        <h2 className={`font-black text-sm mb-1 uppercase tracking-tight ${editorThemeMode === 'claro' ? 'text-slate-900' : 'text-white'}`}>PC GAMER COMPLETÃO</h2>
                        <p className="text-[9px] text-zinc-500 font-medium leading-relaxed">Participe da campanha de apoio ao projeto PC Gamer por apenas R$ 1,00!</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div className={`p-2 rounded-xl border flex flex-col gap-1 transition-colors ${editorThemeMode === 'claro' ? 'bg-slate-50 border-slate-100' : 'bg-zinc-900/50 border-zinc-800'}`}>
                          <div className="w-6 h-6 rounded-md flex items-center justify-center transition-colors" style={{ backgroundColor: `${editorPrimaryColor}20`, color: editorPrimaryColor }}>
                            <Trophy className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-[7px] text-zinc-500 uppercase font-black tracking-wider mt-1">Valor do Ticket</span>
                          <span className="text-xs font-black transition-colors" style={{ color: editorPrimaryColor }}>R$ 1,00</span>
                        </div>
                        <div className={`p-2 rounded-xl border flex flex-col gap-1 transition-colors ${editorThemeMode === 'claro' ? 'bg-slate-50 border-slate-100' : 'bg-zinc-900/50 border-zinc-800'}`}>
                          <div className="w-6 h-6 rounded-md bg-green-500/10 text-green-500 flex items-center justify-center">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-[7px] text-zinc-500 uppercase font-black tracking-wider mt-1">Encerramento</span>
                          <span className={`text-[10px] font-black mt-0.5 ${editorThemeMode === 'claro' ? 'text-slate-900' : 'text-zinc-100'}`}>20/12/2026</span>
                        </div>
                      </div>

                      <div className={`mt-3 p-3 rounded-xl border-dashed border-2 flex items-center gap-2 ${editorThemeMode === 'claro' ? 'border-orange-200 bg-orange-50' : 'border-zinc-800 bg-zinc-900'}`}>
                        <div className="text-[10px] font-bold text-orange-600 flex-1">🚀 Bônus: Compre 10 cotas e leve 15!</div>
                      </div>
                    </div>

                    {/* Footer Mock */}
                    <div className={`p-3 shrink-0 rounded-b-[2rem] border-t relative z-10 transition-colors ${editorThemeMode === 'claro' ? 'bg-white border-slate-100' : 'bg-[#121214] border-zinc-800'}`}>
                      <div className="h-12 w-full rounded-2xl flex items-center justify-center text-white font-black text-[11px] shadow-lg transition-colors duration-500 gap-1 tracking-wider" style={{ backgroundColor: editorPrimaryColor }}>
                        COMPRAR AGORA <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* Templates Showcase (Free for all) - Infinite Marquee */}
        <section className="py-24 bg-zinc-50 border-b overflow-hidden relative">
          {/* Gradient Shadows that fade the edges */}
          <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-zinc-50 to-transparent z-10" />
          <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-zinc-50 to-transparent z-10" />

          <div className="container mx-auto px-6 space-y-16">
            <div className="text-center space-y-4 max-w-2xl mx-auto relative z-20">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">9 Templates Prontos <br />para Uso</h2>
              <p className="text-lg text-slate-600 font-medium">Não perca tempo criando designs do zero. Selecione o modelo visual que mais combina com a sua campanha em apenas um clique e comece a vender.</p>
            </div>

            {/* Marquee Wrapper */}
            <div className="relative w-full pb-8">
              <div className="flex gap-6 w-max animate-marquee cursor-grab active:cursor-grabbing hover:[animation-play-state:paused] pointer-events-auto">
                {/* Duplicamos os templates para garantir o loop contínuo */}
                {[...templatesList, ...templatesList, ...templatesList].map((t, idx) => (
                  <div key={`${t.id}-${idx}`} className="shrink-0 w-[240px] group">
                    <div className="aspect-[9/16] bg-slate-100 rounded-[2rem] overflow-hidden shadow-md border-[8px] border-white group-hover:border-primary group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] group-hover:-translate-y-2 transition-all duration-300 relative ring-1 ring-slate-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`/tamplates/${t.id}.png`} alt={`Template ${t.name}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />

                      {/* Overlay Hover Text */}
                      <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                        <span className="bg-white text-slate-900 text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full absolute">APLICAR</span>
                      </div>
                    </div>
                    <p className="text-center font-bold text-sm text-slate-500 group-hover:text-slate-900 mt-5 uppercase tracking-widest">{t.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="preços" className="py-24 bg-white border-b">
          <div className="container mx-auto px-6 text-center space-y-16">
            <div className="space-y-4 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight">Preço Justo e Sem Surpresas</h2>
              <p className="text-lg text-muted-foreground font-medium">Você só paga a ativação da campanha. Sem dores de cabeça, sem porcentagem em cima da sua arrecadação.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Plano Básico */}
              <div className="bg-white rounded-[2.5rem] p-10 border-2 border-slate-100 shadow-lg hover:border-slate-300 transition-colors relative flex flex-col text-left">
                <div className="mb-6">
                  <h3 className="text-2xl font-black text-slate-800">Básico (9 Templates)</h3>
                  <p className="text-sm text-slate-500 mt-2 font-medium">Layouts fantásticos Inclusos para começar.</p>
                </div>

                <div className="mb-8 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold tracking-tight">R$ 14,90</span>
                  <span className="text-muted-foreground font-bold text-sm">/ campanha</span>
                </div>

                <ul className="space-y-4 mb-8 flex-1">
                  {[
                    "Acesso aos 9 Templates Exclusivos",
                    "Crie até 1.000 participações",
                    "Receba 100% via PIX na sua conta",
                    "Painel de Gestão Completo",
                    "Upload de imagem da campanha",
                    "Sistema de encerramento automático"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm font-semibold text-slate-700">
                      <CheckCircle2 className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>

                <Link href="/login" className="block w-full mt-auto">
                  <Button variant="outline" className="w-full h-14 rounded-2xl text-slate-700 font-black text-lg border-2 hover:bg-slate-50 transition-colors">
                    Criar Básico
                  </Button>
                </Link>
              </div>

              {/* Plano Apoiêfy PRO */}
              <div className="bg-gradient-to-b from-orange-500 to-red-500 rounded-[2.5rem] p-1 shadow-2xl relative flex flex-col transform md:-translate-y-4">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1 z-10">
                  <Sparkles className="w-3 h-3" /> Máxima Conversão
                </div>
                <div className="bg-white rounded-[2.3rem] p-10 relative flex flex-col h-full text-left">
                  <div className="mb-6">
                    <h3 className="text-2xl font-black text-orange-600 flex items-center gap-2">Apoiêfy PRO</h3>
                    <p className="text-sm text-slate-500 mt-2 font-medium">Editor Visual com ferramentas de venda.</p>
                  </div>

                  <div className="mb-8 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold tracking-tight text-slate-900">R$ 25,90</span>
                    <span className="text-muted-foreground font-bold text-sm">/ campanha</span>
                  </div>

                  <ul className="space-y-4 mb-8 flex-1">
                    <li className="flex items-start gap-3 text-sm font-bold text-slate-800">
                      <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                      Tudo do Básico, mais:
                    </li>
                    {[
                      "Acesso total ao Editor Visual PRO",
                      "Cores 100% Personalizadas e Tema Escuro",
                      "Notificações ao Vivo de Compras",
                      "Contador Regressivo (Gatilho de Urgência)",
                      "Cupons de Desconto Automáticos",
                      "Ocultar logo da Apoiêfy do Rodapé"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm font-semibold text-slate-700">
                        <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <Link href="/login" className="block w-full mt-auto">
                    <Button className="w-full h-14 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-black text-lg shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 transition-all">
                      Assinar PRO Agora
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-24 bg-white">
          <div className="container mx-auto px-6 max-w-3xl space-y-12">
            <div className="text-center space-y-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary-foreground mb-4">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight">Perguntas Frequentes</h2>
              <p className="text-lg text-muted-foreground font-medium">Tire todas as suas dúvidas antes de começar.</p>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {[
                {
                  q: "Como recebo o dinheiro das minhas campanhas?",
                  a: "O valor pago pelos apoiadores é transferido diretamente para sua conta via PIX. A Apoiêfy não recebe nem administra os valores arrecadados."
                },
                {
                  q: "As campanhas online são permitidas?",
                  a: "Sim, desde que respeitadas as normas vigentes. A Apoiêfy é uma ferramenta de gestão. Recomendamos que o organizador utilize a plataforma para campanhas filantrópicas ou promocionais."
                },
                {
                  q: "Como funciona a gestão interna de resultados?",
                  a: "No seu painel, você acesso imediato a uma ferramenta de organização de encerramento que estrutura todos os dados das participações confirmadas, garantindo controle e transparência total no fechamento do seu projeto."
                },
                {
                  q: "Qual o limite de participações por campanha?",
                  a: "Atualmente, você pode criar campanhas de 10 até 1.000 participações. Isso garante uma experiênca de navegação rápida e fluida para quem está acessando no celular."
                },
                {
                  q: "Tenho suporte caso precise de ajuda?",
                  a: "Sim! Temos uma equipe de suporte humanizado via WhatsApp pronta para te ajudar a configurar sua primeira campanha ou tirar dúvidas técnicas."
                }
              ].map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-b-2 py-2">
                  <AccordionTrigger className="text-left font-black text-lg hover:no-underline hover:text-primary-foreground">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground font-medium text-base leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-24 px-6 bg-foreground text-background">
          <div className="container mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight">Sua jornada de sucesso começa aqui.</h2>
            <p className="text-xl text-background/70 max-w-2xl mx-auto">
              Pare de lutar com planilhas e cadernos. Profissionalize sua gestão hoje mesmo com a Apoiêfy.
            </p>
            <div className="pt-4">
              <Link href="/login">
                <Button size="lg" className="h-20 px-3 text-2xl font-black bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl gap-3 shadow-[0_0_30px_rgba(255,221,43,0.3)] transition-all hover:scale-105">
                  CRIAR MINHA PRIMEIRA CAMPANHA <Zap className="w-8 h-8 fill-current" />
                </Button>
              </Link>
            </div>
            <p className="text-xs font-bold text-background/40 uppercase tracking-[0.3em]">Crie agora • Pague apenas R$ 14,90</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white py-20 px-6 border-t">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary-foreground fill-primary" />
              <span className="text-2xl font-bold tracking-tighter">Apoiêfy</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed font-medium">
              A maior e mais segura plataforma de infraestrutura e gestão para campanhas digitais do Brasil.
            </p>
            <div className="flex gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-2xl bg-muted/30 shadow-sm hover:bg-primary/20"
                onClick={async () => {
                  if (navigator.share) {
                    await navigator.share({
                      title: "Apoiêfy",
                      text: "A plataforma #1 para gestão de campanhas digitais!",
                      url: "https://www.apoiêfy.com.br",
                    });
                  } else {
                    await navigator.clipboard.writeText("https://www.apoiêfy.com.br");
                    alert("Link copiado!");
                  }
                }}
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-2xl bg-muted/30 shadow-sm hover:bg-primary/20"
                onClick={() => {
                  const texto = encodeURIComponent(
                    "Conheça a Apoiêfy — a forma mais fácil de gerenciar campanhas de forma online e automatizada!\nhttps://www.apoiêfy.com.br"
                  );
                  window.open(`https://wa.me/?text=${texto}`, "_blank");
                }}
              >
                <MessageCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="font-black uppercase tracking-widest text-xs text-foreground">Plataforma</h4>
            <ul className="space-y-4 text-muted-foreground text-sm font-bold">
              <li><Link href="/login" className="hover:text-primary-foreground transition-colors">Área do Organizador</Link></li>
              <li><Link href="/login" className="hover:text-primary-foreground transition-colors">Criar Nova Campanha</Link></li>
              <li><Link href="#preços" className="hover:text-primary-foreground transition-colors">Preços</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-black uppercase tracking-widest text-xs text-foreground">Legal</h4>
            <ul className="space-y-4 text-muted-foreground text-sm font-bold">
              <li><Link href="/termos" className="hover:text-primary-foreground transition-colors">Termos de Uso</Link></li>
              <li><Link href="/privacidade" className="hover:text-primary-foreground transition-colors">Política de Privacidade</Link></li>
            </ul>
            <div className="pt-2">
              <p className="text-xs text-muted-foreground/80 font-medium">CNPJ: 00.000.000/0001-00</p>
              <p className="text-xs text-muted-foreground/80 font-medium">São Gonçalo - RJ</p>
              <p className="text-xs text-muted-foreground/80 font-medium">contato@apoiêfy.com.br</p>
            </div>
          </div>

          <div className="space-y-8">
            <h4 className="font-black uppercase tracking-widest text-xs text-foreground">Suporte Especializado</h4>
            <p className="text-sm text-muted-foreground font-medium">Precisa de ajuda ou parceria? Fale com nossa equipe agora.</p>
            <Button
              className="w-full bg-green-500 hover:bg-green-600 text-white font-black h-16 gap-3 rounded-2xl shadow-xl transition-all hover:scale-105"
              onClick={() => window.open("https://wa.me/5521996567301", "_blank")}
            >
              <MessageCircle className="w-6 h-6 fill-current" /> Suporte WhatsApp
            </Button>
          </div>
        </div>
        <div className="container mx-auto mt-20 pt-8 border-t text-center space-y-2">
          <p className="text-xs font-bold text-muted-foreground tracking-widest">© 2026 APOIÊFY - TECNOLOGIA PARA GESTÃO. TODOS OS DIREITOS RESERVADOS.</p>
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">Orgulhosamente desenvolvido para inovadores digitais.</p>
        </div>
      </footer>
    </div>
  );  // <- fecha o return(
} 
