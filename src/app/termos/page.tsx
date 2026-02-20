"use client";

import { Zap, ArrowLeft, Shield, FileText, AlertCircle, CheckCircle2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const sections = [
    {
        id: "01",
        title: "Aceitação dos Termos",
        icon: <CheckCircle2 className="w-5 h-5" />,
        content: `Ao acessar ou utilizar a plataforma SocialRifa, você concorda integralmente com estes Termos de Uso. Se não concordar com qualquer parte destes termos, solicitamos que não utilize nossos serviços.

O uso continuado da plataforma após quaisquer alterações nos Termos de Uso constituirá sua aceitação dessas alterações. Recomendamos que você revise periodicamente esta página.`
    },
    {
        id: "02",
        title: "Descrição do Serviço",
        icon: <Zap className="w-5 h-5" />,
        content: `A SocialRifa é uma plataforma digital de gestão de sorteios e rifas que permite a organizadores criar, divulgar e gerenciar campanhas de arrecadação com pagamentos via PIX.

Nossos serviços incluem: criação de páginas de rifa personalizadas, geração automática de chaves PIX para pagamento, painel de gestão de participantes, sorteador automático integrado e link exclusivo para compartilhamento via WhatsApp.

A SocialRifa atua exclusivamente como ferramenta tecnológica de gestão, não sendo responsável pela condução ou premiação dos sorteios.`
    },
    {
        id: "03",
        title: "Responsabilidade do Organizador",
        icon: <AlertCircle className="w-5 h-5" />,
        content: `O organizador é o único responsável pela legalidade, condução e resultado do sorteio. Ao criar uma rifa na plataforma, o organizador declara que:

— O sorteio é realizado para fins filantrópicos, promocionais ou conforme autorização legal vigente.
— Todas as informações fornecidas sobre o prêmio são verdadeiras e o prêmio será entregue ao ganhador.
— O sorteio será realizado na data informada e o resultado será comunicado a todos os participantes.
— Não utilizará a plataforma para fins fraudulentos, ilegais ou que causem dano a terceiros.

A SocialRifa reserva-se o direito de suspender ou encerrar campanhas que violem estas diretrizes, sem aviso prévio.`
    },
    {
        id: "04",
        title: "Pagamentos e Taxas",
        icon: <FileText className="w-5 h-5" />,
        content: `A SocialRifa cobra uma taxa de publicação de R$ 9,90 por rifa criada. Este valor é cobrado no momento da criação da campanha e não é reembolsável.

Os pagamentos dos participantes são realizados diretamente ao organizador via PIX. A SocialRifa não intermedia, retém ou processa os valores das vendas — o dinheiro vai 100% para a conta do organizador.

A SocialRifa não se responsabiliza por transações realizadas fora da plataforma ou por pagamentos não confirmados pelo organizador.`
    },
    {
        id: "05",
        title: "Privacidade e Dados",
        icon: <Shield className="w-5 h-5" />,
        content: `Coletamos apenas os dados necessários para o funcionamento da plataforma: nome, número de WhatsApp e dados de pagamento dos participantes.

Esses dados são compartilhados com o organizador da rifa para fins de gestão e confirmação de pagamentos. Não vendemos, alugamos ou compartilhamos seus dados com terceiros para fins comerciais.

Ao utilizar a plataforma, você consente com a coleta e uso dos seus dados conforme descrito em nossa Política de Privacidade.`
    },
    {
        id: "06",
        title: "Limitação de Responsabilidade",
        icon: <AlertCircle className="w-5 h-5" />,
        content: `A SocialRifa não se responsabiliza por: danos diretos ou indiretos resultantes do uso ou incapacidade de uso da plataforma, não entrega de prêmios por parte dos organizadores, perda de dados por falhas técnicas fora de nosso controle, ou ações fraudulentas praticadas por organizadores ou participantes.

Nossa responsabilidade total perante qualquer reclamação está limitada ao valor pago pelo organizador pela publicação da rifa.`
    },
    {
        id: "07",
        title: "Suspensão e Encerramento",
        icon: <Shield className="w-5 h-5" />,
        content: `A SocialRifa pode suspender ou encerrar sua conta e campanhas a qualquer momento, sem aviso prévio, caso identifique violações destes Termos de Uso, atividades fraudulentas, solicitações de autoridades competentes ou inatividade prolongada.

O organizador pode encerrar sua conta a qualquer momento entrando em contato com nosso suporte via WhatsApp.`
    },
    {
        id: "08",
        title: "Alterações nos Termos",
        icon: <FileText className="w-5 h-5" />,
        content: `Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. Alterações significativas serão comunicadas via e-mail ou notificação na plataforma com antecedência mínima de 7 dias.

O uso continuado da plataforma após a entrada em vigor das alterações constitui aceitação dos novos termos.

Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da comarca de São Paulo/SP para dirimir quaisquer controvérsias.`
    }
];

export default function TermosPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between px-6 mx-auto">
                    <Link href="/" className="flex items-center gap-2">
                        <Zap className="h-6 w-6 text-primary-foreground fill-primary" />
                        <span className="text-2xl font-bold tracking-tighter">SocialRifa</span>
                    </Link>
                    <Link href="/">
                        <Button variant="outline" className="font-bold border-2 gap-2">
                            <ArrowLeft className="w-4 h-4" /> Voltar
                        </Button>
                    </Link>
                </div>
            </nav>

            {/* Hero */}
            <section className="bg-primary py-16 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                <div className="container mx-auto relative text-center space-y-4">
                    <div className="inline-flex items-center gap-2 bg-white/30 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider text-primary-foreground">
                        <FileText className="w-4 h-4" />
                        Documento Legal
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-primary-foreground tracking-tight">
                        Termos de Uso
                    </h1>
                    <p className="text-primary-foreground/80 font-medium max-w-xl mx-auto">
                        Leia com atenção antes de utilizar a plataforma. Última atualização: Janeiro de 2025.
                    </p>
                </div>
            </section>

            {/* Content */}
            <main className="flex-1 py-16 px-6">
                <div className="container mx-auto max-w-3xl space-y-6">

                    {/* Intro Card */}
                    <div className="bg-primary/10 border-2 border-primary/30 rounded-2xl p-6 flex gap-4 items-start">
                        <div className="h-10 w-10 shrink-0 rounded-xl bg-primary flex items-center justify-center">
                            <Shield className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div>
                            <p className="font-black text-sm uppercase tracking-widest text-primary-foreground mb-1">Resumo Simples</p>
                            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                                A SocialRifa é uma ferramenta. Você organiza e é responsável pela sua rifa. Nós cuidamos da tecnologia. O dinheiro vai direto pra você via PIX. Nossa taxa é de R$ 9,90 por campanha publicada.
                            </p>
                        </div>
                    </div>

                    {/* Sections */}
                    {sections.map((section, i) => (
                        <div key={i} className="bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4 p-6 border-b bg-muted/20">
                                <div className="h-10 w-10 shrink-0 rounded-xl bg-primary flex items-center justify-center text-primary-foreground">
                                    {section.icon}
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-black text-muted-foreground tracking-[0.2em] uppercase">{section.id}</span>
                                    <h2 className="text-lg font-black tracking-tight">{section.title}</h2>
                                </div>
                            </div>
                            <div className="p-6">
                                {section.content.split('\n\n').map((paragraph, j) => (
                                    <p key={j} className="text-muted-foreground font-medium text-sm leading-relaxed mb-3 last:mb-0">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Last Updated */}
                    <div className="text-center py-8 space-y-2">
                        <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">
                            SocialRifa — Termos de Uso • Versão 1.0 • Janeiro 2025
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Dúvidas? Entre em contato com nosso suporte via WhatsApp.
                        </p>
                    </div>
                </div>
            </main>

            {/* CTA Footer */}
            <section className="py-12 px-6 bg-foreground text-background">
                <div className="container mx-auto text-center space-y-6">
                    <p className="text-lg font-black">Ainda tem dúvidas sobre os termos?</p>
                    <Button className="h-14 px-8 rounded-2xl bg-primary text-primary-foreground font-black text-lg gap-3 shadow-xl hover:scale-105 transition-transform">
                        <MessageCircle className="w-5 h-5 fill-current" /> Falar com Suporte
                    </Button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white py-8 px-6 border-t">
                <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-primary-foreground fill-primary" />
                        <span className="text-xl font-bold tracking-tighter">SocialRifa</span>
                    </div>
                    <div className="flex gap-6 text-sm font-bold text-muted-foreground">
                        <Link href="/termos" className="text-primary-foreground">Termos de Uso</Link>
                        <Link href="/privacidade" className="hover:text-primary-foreground transition-colors">Privacidade</Link>
                        <Link href="/etica" className="hover:text-primary-foreground transition-colors">Código de Ética</Link>
                    </div>
                    <p className="text-xs font-bold text-muted-foreground">© 2025 RIFAZAP</p>
                </div>
            </footer>
        </div>
    );
}