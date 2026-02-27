
"use client";

import { useState, useEffect } from "react";
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
  Clock
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
            <span className="text-2xl font-bold tracking-tighter">TicketOn</span>
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
              <p className="mb-3 font-bold text-slate-900 text-base md:text-lg">A TicketOn fornece infraestrutura tecnológica para criação e gestão de campanhas digitais.</p>
              <ul className="list-disc pl-5 space-y-2 text-slate-800">
                <li>Os valores pagos pelos apoiadores são enviados diretamente para a conta do organizador via PIX.</li>
                <li>A TicketOn não intermedeia, retém ou movimenta valores financeiros.</li>
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Link href="/login">
                <Button size="lg" className="w-full sm:w-auto h-16 px-10 text-xl font-bold bg-foreground text-background hover:bg-foreground/90 shadow-xl gap-2 rounded-2xl">
                  Criar Minha Campanha <ArrowRight className="w-6 h-6" />
                </Button>
              </Link>
              <Link href="/campanha/rifa-exemplo-pc-gamer">
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
                  <Link href="/campanha/rifa-exemplo-pc-gamer">
                    <Button size="lg" className="h-16 px-8 rounded-2xl text-lg font-black gap-3 shadow-xl hover:scale-105 transition-transform">
                      ABRIR EXEMPLO COMPLETO <ExternalLink className="w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Smartphone Frame com Preview Real */}
              <div className="flex-1 relative group">
                <div className="absolute -inset-10 bg-primary/20 rounded-[4rem] blur-[80px] group-hover:bg-primary/30 transition-all duration-700" />

                {/* Frame do Smartphone (iPhone Style) */}
                <div className="relative bg-slate-900 rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-[12px] border-slate-900 overflow-hidden w-full max-w-[360px] mx-auto transform hover:-translate-y-4 transition-all duration-500 h-[720px] flex flex-col ring-4 ring-slate-800">
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
                    <div className="w-full h-16 rounded-[1.25rem] bg-slate-900 flex items-center justify-between px-6 border-2 border-slate-800 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
                      <div className="text-left">
                        <p className="text-[10px] font-black uppercase text-slate-400">01 Participação Selecionada</p>
                        <p className="font-black text-white text-base">COMPRAR AGORA</p>
                      </div>
                      <div className="bg-primary p-2 rounded-lg">
                        <ArrowRight className="w-5 h-5 text-primary-foreground" />
                      </div>
                    </div>
                  </div>

                  {/* Home Indicator */}
                  <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 h-1 w-24 bg-slate-300 rounded-full z-40" />
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
                  <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">Venda mais com menos esforço</h2>
                  <p className="text-lg text-muted-foreground font-medium">Nossa interface foi desenhada para facilitar a compra em apenas 3 cliques no celular.</p>
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
                        <Button className="w-full h-20 rounded-2xl bg-[#25D366] text-white font-black text-xl gap-3 shadow-xl hover:bg-[#128C7E]">
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

        {/* PRO Editor Showcase Section */}
        <section className="py-24 bg-zinc-50 border-y border-slate-200">
          <div className="container mx-auto px-6 space-y-16">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex h-8 items-center justify-center rounded-full bg-orange-100 text-orange-600 px-4 mb-2 font-black text-[10px] tracking-widest uppercase border border-orange-200">
                <Sparkles className="w-3.5 h-3.5 mr-2" /> Exclusividade TicketOn
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900">Conheça o Editor PRO</h2>
              <p className="text-lg text-muted-foreground font-medium">A única plataforma que permite você personalizar sua campanha como um verdadeiro site profissional. Venda mais com gatilhos de conversão.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
                <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 border border-orange-100 group-hover:bg-orange-500 transition-colors">
                  <Palette className="w-6 h-6 text-orange-500 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-black mb-3">9 Templates Exclusivos</h3>
                <p className="text-muted-foreground font-medium text-sm leading-relaxed">
                  Mint, Gold, Pink, Solar, Nebula, Scrapbook, Calor, Juliana e Creme. Escolha o tema que mais combina com seu prêmio e personalize as cores como quiser.
                </p>
              </div>

              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 border border-blue-100 group-hover:bg-blue-500 transition-colors">
                  <Clock className="w-6 h-6 text-blue-500 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-black mb-3">Gatilhos de Urgência</h3>
                <p className="text-muted-foreground font-medium text-sm leading-relaxed">
                  Adicione contadores regressivos dinâmicos, alertas de "Últimas Cotas!" e banners de compras em tempo real para acelerar o fechamento da sua campanha.
                </p>
              </div>

              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
                <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6 border border-green-100 group-hover:bg-green-500 transition-colors">
                  <Trophy className="w-6 h-6 text-green-500 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-black mb-3">Cupons e Bônus Extras</h3>
                <p className="text-muted-foreground font-medium text-sm leading-relaxed">
                  Crie cupons de desconto, configure pacotes promocionais automáticos e ofereça Bônus Garantidos para quem mais apoiar seu projeto.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="preços" className="py-24 bg-white border-b">
          <div className="container mx-auto px-6 text-center space-y-16">
            <div className="space-y-4 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight">Preço Justo e Sem Surpresas</h2>
              <p className="text-lg text-muted-foreground font-medium">Você só paga quando cria uma nova campanha. Sem dores de cabeça, sem porcentagem em cima da sua arrecadação.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Plano Básico */}
              <div className="bg-white rounded-[2.5rem] p-10 border-2 border-slate-100 shadow-lg hover:border-slate-300 transition-colors relative flex flex-col text-left">
                <div className="mb-6">
                  <h3 className="text-2xl font-black text-slate-800">Básico (Sem Edição)</h3>
                  <p className="text-sm text-slate-500 mt-2 font-medium">Layout estático padrão do sistema.</p>
                </div>

                <div className="mb-8 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold tracking-tight">R$ 14,90</span>
                  <span className="text-muted-foreground font-bold text-sm">/ campanha</span>
                </div>

                <ul className="space-y-4 mb-8 flex-1">
                  {[
                    "Crie até 1.000 participações",
                    "Receba 100% via PIX na sua conta",
                    "Painel de Gestão Completo",
                    "Upload de 1 foto do prêmio",
                    "Link exclusivo da campanha",
                    "Apuração e Sorteio Integrados"
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

              {/* Plano TicketOn PRO */}
              <div className="bg-gradient-to-b from-orange-500 to-red-500 rounded-[2.5rem] p-1 shadow-2xl relative flex flex-col transform md:-translate-y-4">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1 z-10">
                  <Sparkles className="w-3 h-3" /> Mais Escolhido
                </div>
                <div className="bg-white rounded-[2.3rem] p-10 relative flex flex-col h-full text-left">
                  <div className="mb-6">
                    <h3 className="text-2xl font-black text-orange-600 flex items-center gap-2">TicketOn PRO</h3>
                    <p className="text-sm text-slate-500 mt-2 font-medium">Editor Visual Completo para conversão máxima.</p>
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
                      "9 Templates de Cores e Temas",
                      "Notificações ('João acabou de comprar')",
                      "Contador Regressivo (Urgência)",
                      "Cupons de Desconto e Bônus",
                      "Cores Personalizadas"
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
                  a: "O valor pago pelos apoiadores é transferido diretamente para sua conta via PIX. A TicketOn não recebe nem administra os valores arrecadados."
                },
                {
                  q: "As campanhas online são permitidas?",
                  a: "Sim, desde que respeitadas as normas vigentes. A TicketOn é uma ferramenta de gestão. Recomendamos que o organizador utilize a plataforma para campanhas filantrópicas ou promocionais."
                },
                {
                  q: "Como funciona a apuração dos resultados?",
                  a: "No seu painel, você clica no botão de registro e uma ferramenta gera um resultado de forma transparente apenas entre as participações que já foram pagas, ajudando a identificar os contemplados de forma justa."
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
              Pare de lutar com planilhas e cadernos. Profissionalize sua gestão hoje mesmo com a TicketOn.
            </p>
            <div className="pt-4">
              <Link href="/login">
                <Button size="lg" className="h-20 px-3 text-2xl font-black bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl gap-3 shadow-[0_0_30px_rgba(255,221,43,0.3)] transition-all hover:scale-105">
                  CRIAR MINHA PRIMEIRA CAMPANHA <Zap className="w-8 h-8 fill-current" />
                </Button>
              </Link>
            </div>
            <p className="text-xs font-bold text-background/40 uppercase tracking-[0.3em]">Crie agora • Pague apenas R$ 9,90</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white py-20 px-6 border-t">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary-foreground fill-primary" />
              <span className="text-2xl font-bold tracking-tighter">TicketOn</span>
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
                      title: "TicketOn",
                      text: "A plataforma #1 para gestão de campanhas digitais!",
                      url: "https://www.ticketon.com.br",
                    });
                  } else {
                    await navigator.clipboard.writeText("https://www.ticketon.com.br");
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
                    "Conheça a TicketOn — a forma mais fácil de gerenciar campanhas de forma online e automatizada!\nhttps://www.ticketon.com.br"
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
              <p className="text-xs text-muted-foreground/80 font-medium">contato@ticketon.com.br</p>
            </div>
          </div>

          <div className="space-y-8">
            <h4 className="font-black uppercase tracking-widest text-xs text-foreground">Suporte Especializado</h4>
            <p className="text-sm text-muted-foreground font-medium">Precisa de ajuda ou parceria? Fale com nossa equipe agora.</p>
            <Button
              className="w-full bg-green-500 hover:bg-green-600 text-white font-black h-16 gap-3 rounded-2xl shadow-xl transition-all hover:scale-105"
              onClick={() => window.open("https://wa.me/SEU_NUMERO_AQUI", "_blank")}
            >
              <MessageCircle className="w-6 h-6 fill-current" /> Suporte WhatsApp
            </Button>
          </div>
        </div>
        <div className="container mx-auto mt-20 pt-8 border-t text-center space-y-2">
          <p className="text-xs font-bold text-muted-foreground tracking-widest">© 2026 TICKETON - TECNOLOGIA PARA GESTÃO. TODOS OS DIREITOS RESERVADOS.</p>
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">Orgulhosamente desenvolvido para inovadores digitais.</p>
        </div>
      </footer>
    </div>
  );  // <- fecha o return(
} 
